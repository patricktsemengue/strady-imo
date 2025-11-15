import { netlify } from "@netlify/functions";

export const handler = async (event) => {
  // --- AJOUT POUR GÉRER LE PREFLIGHT CORS ---
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200, // 200 OK
      headers: {
        'Access-Control-Allow-Origin': '*', // Autorise n'importe quelle origine
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS' // Indique les méthodes autorisées
      },
      body: ''
    };
  }
  // --- FIN DE L'AJOUT ---

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    // Cette ligne ne sera plus déclenchée par OPTIONS
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { systemPrompt, userPrompt } = JSON.parse(event.body);
  const apiKey = netlify.env.get("STRADY_GEMINI_API_KEY");

  if (!apiKey) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'API key is not configured.' }) 
    };
  }

  try {
    // URL Corrigée (avec -latest)
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {

      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      
      body: JSON.stringify({
        contents: [{ parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return { 
        statusCode: response.status, 
        body: JSON.stringify({ error: `API Error: ${errorBody}` }) 
      };
    }
    
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};