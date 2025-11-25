import fetch from 'node-fetch';

export const handler = async (event) => {
  // --- GESTION DU PREFLIGHT CORS ---
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { systemPrompt, userPrompt, taskType } = JSON.parse(event.body);

    // --- VALIDATION DES DONNÉES D'ENTRÉE ---
    const validateInputs = ({ userPrompt, systemPrompt }) => {
      const MAX_USER_PROMPT_LENGTH = 15000;
      const MAX_SYSTEM_PROMPT_LENGTH = 10000;

      if (!userPrompt || typeof userPrompt !== 'string' || userPrompt.trim() === '') return 'Le paramètre "userPrompt" est requis.';
      if (!systemPrompt || typeof systemPrompt !== 'string' || systemPrompt.trim() === '') return 'Le paramètre "systemPrompt" est requis.';
      if (userPrompt.length > MAX_USER_PROMPT_LENGTH) return `La longueur du "userPrompt" dépasse la limite de ${MAX_USER_PROMPT_LENGTH} caractères.`;
      if (systemPrompt.length > MAX_SYSTEM_PROMPT_LENGTH) return `La longueur du "systemPrompt" dépasse la limite de ${MAX_SYSTEM_PROMPT_LENGTH} caractères.`;
      return null;
    };

    const validationError = validateInputs({ userPrompt, systemPrompt });
    if (validationError) {
      return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: validationError }) };
    }

    const apiKey = process.env.STRADY_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[ERROR] La clé API Gemini n\'est pas configurée.');
      return { statusCode: 500, body: JSON.stringify({ error: 'API key is not configured.' }) };
    }

    const getModelForTask = (task) => {
      switch (task) {
        case 'ANALYZE_PHOTO':
        case 'ANALYZE_PDF':
        case 'ANALYZE_PLAN':
        case 'ANALYZE_DOCUMENT':
          return 'gemini-2.5-pro';
        case 'ESTIMATE_RENOVATION':
        case 'QA':
        case 'EXTRACT_URL':
          return 'gemini-2.5-flash';
        case 'RESTRUCTURE_TEXT':
        case 'EXTRACT_DATA':
          return 'gemini-2.5-flash-lite';
        default:
          console.warn(`[WARN] taskType inconnu: '${task}'. Utilisation de 'flash-lite'.`);
          return 'gemini-2.5-flash-lite';
      }
    };

    const model = getModelForTask(taskType);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${apiKey}`;
    
    console.log(`[INFO] Appel de l'API Gemini en streaming avec le modèle : ${model}`);

    const geminiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
      })
    });

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text();
      console.error(`[API_ERROR] L'API Gemini a répondu avec le statut ${geminiResponse.status}: ${errorBody}`);
      return { 
        statusCode: geminiResponse.status, 
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: `API Error: ${errorBody}` }) 
      };
    }
    
    // Renvoyer la réponse en streaming
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Access-Control-Allow-Origin': '*',
      },
      body: geminiResponse.body,
    };

  } catch (error) {
    console.error('[FATAL_ERROR] Une erreur inattendue est survenue :', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};