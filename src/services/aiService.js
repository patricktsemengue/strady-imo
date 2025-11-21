import { getFromCache, setInCache } from './aiCacheService';


/**
 * Calls the backend Netlify function for the Gemini API.
 * @param {string} systemPrompt - The system prompt for the AI.
 * @param {string} userPrompt - The user's prompt.
 * @param {string} taskType - The type of task for the AI.
 * @returns {Promise<string>} The raw text response from the AI.
 */
async function callGeminiAPI(systemPrompt, userPrompt, taskType) {
    const requestBody = { systemPrompt, userPrompt, taskType };
    try {
        const response = await fetch('/.netlify/functions/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            let errorBody;
            try {
                errorBody = await response.json();
            } catch (e) {
                throw new Error(`Le serveur a répondu avec le statut ${response.status}.`);
            }
            throw new Error(errorBody.error || `Une erreur est survenue sur le serveur (code: ${response.status}).`);
        }

        const resultData = await response.json();
        const text = resultData?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            console.error("API response is missing expected text content:", resultData);
            throw new Error("La réponse de l'API était vide ou dans un format inattendu.");
        }

        return text;

    } catch (error) {
        console.error("Erreur lors de l'appel à l'API Gemini:", error);
        if (error.message.includes('Failed to fetch')) {
            throw new Error("Impossible de joindre le serveur. Vérifiez votre connexion internet.");
        }
        throw error;
    }
}

/**
 * Parses the raw AI response into conversational text and structured JSON data.
 * @param {string} responsePayload - The raw text from the AI.
 * @returns {{conversationalPart: string, jsonData: object|null, error: string|null}}
 */
function parseAIResponse(responsePayload) {
    const jsonMarker = 'JSON UPDATED';
    const jsonStartIndex = responsePayload.indexOf(jsonMarker);

    let conversationalPart = responsePayload;
    let jsonData = null;
    let error = null;

    if (jsonStartIndex !== -1) {
        conversationalPart = responsePayload.substring(0, jsonStartIndex).trim();
        const jsonString = responsePayload.substring(jsonStartIndex + jsonMarker.length);
        try {
            const potentialJson = jsonString.match(/\{[\s\S]*\}/);
            if (!potentialJson) throw new Error("Aucun bloc JSON valide trouvé après le marqueur.");
            jsonData = JSON.parse(potentialJson[0]);
        } catch (e) {
            console.error("Échec du parsing JSON de la réponse de l'IA:", e, "Contenu reçu:", jsonString);
            error = "L'IA a retourné une réponse avec un format JSON invalide. Veuillez réessayer.";
        }
    }

    return { conversationalPart, jsonData, error };
}

/**
 * Orchestrates fetching a response from the AI, using cache if available.
 * @param {object} requestPayload - The payload for the AI request.
 * @param {string} userId - The ID of the current user for caching.
 * @returns {Promise<string>} The raw text response from the AI.
 */
async function fetchAIResponse(requestPayload, userId, currentAnalysisData, conversationHistory, newUserInput) {
    // 1. Construire le prompt utilisateur complet
    const userPrompt = `
Voici l'état actuel de l'analyse. Utilise-le comme base de connaissance.

\`\`\`json
${JSON.stringify(currentAnalysisData, null, 2)}
\`\`\`

---
HISTORIQUE DE LA CONVERSATION:
${conversationHistory.map(msg => `${msg.sender === 'user' ? 'Utilisateur' : 'Assistant'}: ${msg.content.replace(/<[^>]*>?/gm, '')}`).join('\n')}

---
NOUVEAU MESSAGE DE L'UTILISATEUR:
Utilisateur: ${newUserInput}
---

En te basant sur TOUTES les informations ci-dessus, suis les instructions de ton persona pour fournir la prochaine réponse.
`;

    // 2. Mettre à jour le payload de la requête avec le nouveau prompt
    const finalRequestPayload = {
        ...requestPayload,
        userPrompt: userPrompt,
    };

    // 3. Utiliser le cache ou appeler l'API
    const cachedResponse = await getFromCache(finalRequestPayload);
    if (cachedResponse) {
        return cachedResponse;
    }

    const apiResponseText = await callGeminiAPI(finalRequestPayload.systemPrompt, finalRequestPayload.userPrompt, finalRequestPayload.taskType);

    if (userId) {
        setInCache(requestPayload, apiResponseText, userId);
    }

    return apiResponseText;
}

export const aiService = {
    fetchAIResponse,
    parseAIResponse,
    callGeminiAPI, // Exporter pour une utilisation potentielle ailleurs
};