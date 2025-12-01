import { GoogleGenerativeAI } from '@google/generative-ai';
import { Readable } from 'stream';

// Helper function to map user-defined task types to specific Gemini model names.
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

export const handler = async (event) => {
  // --- 1. HANDLE PREFLIGHT CORS ---
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': process.env.URL || '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  // --- 2. VALIDATE REQUEST ---
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.STRADY_GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[ERROR] Gemini API key is not configured.');
    return { statusCode: 500, body: JSON.stringify({ error: 'API key is not configured.' }) };
  }

  try {
    const { systemPrompt, userPrompt, taskType } = JSON.parse(event.body);

    // --- 3. INITIALIZE GEMINI SDK ---
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = getModelForTask(taskType);
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemPrompt,
    });

    console.log(`[INFO] Calling Gemini API with model: ${modelName}`);

    // --- 4. PREPARE AND EXECUTE THE STREAMING REQUEST ---
    const result = await model.generateContentStream(userPrompt);

    // --- 5. SEND THE STREAMING RESPONSE ---
    const headers = {
      'Content-Type': 'text/plain; charset=utf-8',
      'Access-Control-Allow-Origin': process.env.URL || '*',
    };

    // The production Netlify environment requires a standard `Response` object with a Web Stream,
    // while the local `netlify dev` server requires the legacy object format with a Node.js Stream.
    if (process.env.NETLIFY) {
      // For production on Netlify: Use a Web ReadableStream
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          try {
            for await (const chunk of result.stream) {
              const text = chunk.text();
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            }
          } catch (error) {
            console.error('[STREAM_ERROR] Error while processing Gemini stream:', error);
            controller.error(error);
          } finally {
            controller.close();
          }
        },
      });
      return new Response(stream, { status: 200, headers });

    } else {
      // For local development (netlify dev): Use a Node.js Readable stream
      async function* streamGenerator() {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            yield text;
          }
        }
      }
      const nodeStream = Readable.from(streamGenerator());
      return {
        statusCode: 200,
        headers,
        body: nodeStream,
      };
    }

  } catch (error) {
    console.error('[FATAL_ERROR] An unexpected error occurred:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};