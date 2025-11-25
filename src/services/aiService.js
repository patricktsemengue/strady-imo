
/**
 * Parses the raw AI response (full streamed JSON string) into conversational text,
 * structured JSON data, and usage metadata.
 * @param {string} rawStreamResponseJsonString - The complete JSON string from the streamed API response.
 * @returns {{conversationalPart: string, jsonData: object|null, usageMetadata: object|null, error: string|null}}
 */
function parseAIResponse(rawStreamResponseJsonString) {
    let fullTextContent = '';
    let jsonData = null;
    let usageMetadata = null;
    let error = null;

    try {
        const parsedResponses = JSON.parse(rawStreamResponseJsonString);
        
        if (!Array.isArray(parsedResponses)) {
            throw new Error("La réponse streamée n'est pas un tableau JSON.");
        }

        parsedResponses.forEach(item => {
            const text = item?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
                fullTextContent += text;
            }
            const metadata = item?.usageMetadata;
            if (metadata) {
                usageMetadata = metadata; // Last one will be the total
            }
        });

        const jsonMarker = 'JSON UPDATED';
        const jsonStartIndex = fullTextContent.indexOf(jsonMarker);

        if (jsonStartIndex !== -1) {
            // Extract JSON string after the marker
            const potentialJsonString = fullTextContent.substring(jsonStartIndex + jsonMarker.length);
            // Attempt to find and parse the actual JSON object
            const jsonMatch = potentialJsonString.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    jsonData = JSON.parse(jsonMatch[0]);
                    // Remove the JSON part and marker from the conversational part
                    fullTextContent = fullTextContent.substring(0, jsonStartIndex).trim();
                } catch (e) {
                    console.error("Failed to parse extracted JSON from AI response:", e, "Content:", jsonMatch[0]);
                    error = "L'IA a retourné une réponse avec un format JSON invalide. Veuillez réessayer.";
                }
            } else {
                console.warn("JSON marker found, but no valid JSON object followed.", "Content:", potentialJsonString);
            }
        }

    } catch (e) {
        console.error("Failed to parse raw stream response as JSON array:", e, "Raw response:", rawStreamResponseJsonString);
        error = "Format de réponse de l'IA inattendu. Veuillez réessayer.";
    }

    return { conversationalPart: fullTextContent, jsonData, usageMetadata, error };
}


/**
 * Orchestrates fetching a response from the AI for streaming.
 * @param {object} requestPayload - The payload for the AI request.
 * @param {string} userId - The ID of the current user for caching.
 * @returns {Promise<Response>} The raw fetch Response object.
 */
async function fetchAIResponse(requestPayload, conversationHistory, newUserInput) {
    const HISTORY_LENGTH = 10;
    const recentHistory = conversationHistory.slice(-HISTORY_LENGTH);

    const userPrompt = `
HISTORIQUE DE LA CONVERSATION RÉCENTE:
${recentHistory.map(msg => `${msg.sender === 'user' ? 'Utilisateur' : 'Assistant'}: ${msg.content.replace(/<[^>]*>?/gm, '')}`).join('\n')}

---
NOUVEAU MESSAGE DE L'UTILISATEUR:
Utilisateur: ${newUserInput}
---

En te basant sur la conversation et le nouveau message, suis les instructions de ton persona pour fournir la prochaine réponse.
`;

    const finalRequestPayload = {
        ...requestPayload,
        userPrompt: userPrompt,
    };

    const response = await fetch('/.netlify/functions/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalRequestPayload)
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

    return response;
}

export const aiService = {
    fetchAIResponse,
    parseAIResponse,
};