import { netlify } from "@netlify/functions";

export const handler = async (event) => {
  // --- GESTION DU PREFLIGHT CORS ---
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200, 
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }
  // --- FIN DE LA GESTION CORS ---

  try {
    console.log(`[INFO] Début du traitement de la requête ${event.httpMethod}.`);

    if (event.httpMethod !== 'POST') {
      console.warn(`[WARN] Méthode non autorisée : ${event.httpMethod}.`);
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { systemPrompt, userPrompt, taskType } = JSON.parse(event.body);

    // --- VALIDATION DES DONNÉES D'ENTRÉE ---
    // Fonction de validation déplacée à l'intérieur du handler pour la propreté
    const validateInputs = ({ userPrompt, systemPrompt }) => {
      const MAX_USER_PROMPT_LENGTH = 15000;
      const MAX_SYSTEM_PROMPT_LENGTH = 10000;

      if (!userPrompt || typeof userPrompt !== 'string' || userPrompt.trim() === '') {
        const errorMessage = 'Le paramètre "userPrompt" est requis.';
        console.warn(`[VALIDATION_FAIL] ${errorMessage}`);
        return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: errorMessage }) };
      }
      if (!systemPrompt || typeof systemPrompt !== 'string' || systemPrompt.trim() === '') {
        const errorMessage = 'Le paramètre "systemPrompt" est requis.';
        console.warn(`[VALIDATION_FAIL] ${errorMessage}`);
        return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: errorMessage }) };
      }
      if (userPrompt.length > MAX_USER_PROMPT_LENGTH) {
        const errorMessage = `La longueur du "userPrompt" (${userPrompt.length}) dépasse la limite de ${MAX_USER_PROMPT_LENGTH} caractères.`;
        console.warn(`[VALIDATION_FAIL] ${errorMessage}`);
        return { statusCode: 413, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: errorMessage }) };
      }
      if (systemPrompt.length > MAX_SYSTEM_PROMPT_LENGTH) {
        const errorMessage = `La longueur du "systemPrompt" (${systemPrompt.length}) dépasse la limite de ${MAX_SYSTEM_PROMPT_LENGTH} caractères.`;
        console.warn(`[VALIDATION_FAIL] ${errorMessage}`);
        return { statusCode: 413, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: errorMessage }) };
      }
      return null; // Validation réussie
    };

    const validationError = validateInputs({ userPrompt, systemPrompt });
    if (validationError) {
      return validationError;
    }
    // --- FIN DE LA VALIDATION ---

    const apiKey = process.env.STRADY_GEMINI_API_KEY;

    if (!apiKey) {
      console.error('[ERROR] La clé API Gemini n\'est pas configurée.');
      return { 
        statusCode: 500, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'API key is not configured.' }) 
      };
    }

    //
    // =================================================================
    // ### DÉBUT DE LA CORRECTION ###
    //
    // Remplacement des noms de modèles obsolètes (ex: 'gemini-1.5-flash')
    // par les noms de modèles '2.5' corrects pour l'API v1beta,
    // conformément à nos spécifications de plan (Flash-Lite, Flash, Pro).
    //
    /**
     * Sélectionne le modèle Gemini approprié en fonction du type de tâche.
     * @param {string} task - Le type de tâche (ex: 'EXTRACT_URL', 'ANALYZE_PHOTO').
     * @returns {string} Le nom du modèle Gemini à utiliser.
     */
    const getModelForTask = (task) => {
      switch (task) {
        // === Tâches "Pro" (Coût: 8 CA) ===
        // Celles-ci nécessitent le modèle multimodal le plus puissant.
        case 'ANALYZE_PHOTO':
        case 'ANALYZE_PDF':
        case 'ANALYZE_PLAN':
        case 'ANALYZE_DOCUMENT':
          return 'gemini-2.5-pro'; // CORRIGÉ

        // === Tâches "Standard" (Coût: 1 CA) ===
        // Celles-ci nécessitent un raisonnement, géré par Flash.
        case 'ESTIMATE_RENOVATION':
        case 'QA': // QA (Légal, fiscal)
        case 'EXTRACT_URL': // Moved to Standard as it requires good extraction capabilities
          return 'gemini-2.5-flash'; // CORRIGÉ

        case 'RESTRUCTURE_TEXT':
        case 'EXTRACT_DATA':
          return 'gemini-2.5-flash-lite'; // AJOUTÉ

        // === Cas par défaut (Sécurité) ===
        // Si un taskType inconnu est envoyé, utiliser le modèle le MOINS CHER.
        default:
          console.warn(`[WARN] taskType inconnu: '${task}'. Utilisation du modèle 'flash-lite' par défaut.`);
          return 'gemini-2.5-flash-lite'; // CORRIGÉ
      }
    };
    //
    // ### FIN DE LA CORRECTION ###
    // =================================================================
    //

    const model = getModelForTask(taskType);

    console.log(`[INFO] Appel de l'API Gemini avec le modèle : ${model} pour la tâche : ${taskType || 'default'}.`);

    // L'URL de l'API est correcte, mais le 'model' est maintenant corrigé.
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
      })
    });
    
    if (!response.ok) {
      const errorBody = await response.text();
      // L'erreur 404 ne devrait plus se produire.
      console.error(`[API_ERROR] L'API Gemini a répondu avec le statut ${response.status} pour le modèle ${model}: ${errorBody}`);
      return { 
        statusCode: response.status, 
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: `API Error: ${errorBody}` }) 
      };
    }
    
    const data = await response.json();
    console.log('[INFO] Réponse de l\'API Gemini reçue avec succès.');
    return {
      statusCode: 200, 
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Ajout du header CORS pour la réponse
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('[FATAL_ERROR] Une erreur inattendue est survenue dans le handler :', error);
    return {
      statusCode: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Ajout du header CORS pour la réponse d'erreur
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};