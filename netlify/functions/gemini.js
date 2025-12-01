import { PassThrough, Readable } from 'stream';

export const handler = async (event) => {
  // --- GESTION DU PREFLIGHT CORS ---
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': process.env.URL || '*',
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
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': process.env.URL || '*' },
        body: JSON.stringify({ error: `API Error: ${errorBody}` }) 
      };
    }
    
    const reader = geminiResponse.body.getReader();
    const decoder = new TextDecoder();
    let aggregatedResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      aggregatedResponse += decoder.decode(value, { stream: true });
    }

    // Now, parse the aggregated JSON response to extract the content
    let fullText = '';
    try {
        const responseArray = JSON.parse(aggregatedResponse);
        fullText = responseArray.map(chunk =>
            chunk.candidates?.[0]?.content?.parts?.[0]?.text || ''
        ).join('');
    } catch (e) {
        console.error("Error parsing aggregated Gemini response:", e);
        console.error("Aggregated response was:", aggregatedResponse);
        // It's possible the response isn't a clean JSON array if an error occurred mid-stream.
        // Let's try to salvage what we can by just returning the raw aggregated text.
        // A better approach might be to parse line-by-line if Gemini stream format is known.
        // Assuming it might just be raw text in some error cases.
        if (!fullText) {
             fullText = aggregatedResponse;
        }
    }


    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.URL || '*',
      },
      body: JSON.stringify({ text: fullText }),
    };

  } catch (error) {
    console.error('[FATAL_ERROR] Une erreur inattendue est survenue :', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': process.env.URL || '*' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};