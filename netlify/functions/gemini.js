import { GoogleGenerativeAI } from '@google/generative-ai';

// Helper function to map user-defined task types to specific Gemini model names.
const getModelForTask = (task) => {
  switch (task) {
    // More capable model for complex analysis tasks
    case 'ANALYZE_PHOTO':
    case 'ANALYZE_PDF':
    case 'ANALYZE_PLAN':
    case 'ANALYZE_DOCUMENT':
      return 'gemini-1.5-pro-latest';

    // Faster, more economical model for general purpose tasks
    case 'ESTIMATE_RENOVATION':
    case 'QA':
    case 'EXTRACT_URL':
    case 'RESTRUCTURE_TEXT':
    case 'EXTRACT_DATA':
      return 'gemini-1.5-flash-latest';

    // Default to the faster model for any unknown tasks
    default:
      console.warn(`[WARN] Unknown taskType: '${task}'. Defaulting to 'gemini-1.5-flash-latest'.`);
      return 'gemini-1.5-flash-latest';
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

    // --- 5. CREATE AND RETURN A READABLE STREAM FOR NETLIFY ---
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              // Enqueue the text chunk, properly encoded
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (error) {
          console.error('[STREAM_ERROR] Error while processing Gemini stream:', error);
          controller.error(error); // Propagate the error to the stream
        } finally {
          controller.close(); // Close the stream when done
        }
      },
    });

    // --- 6. SEND THE STREAMING RESPONSE ---
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-Origin': process.env.URL || '*',
      },
      body: stream,
    };

  } catch (error) {
    console.error('[FATAL_ERROR] An unexpected error occurred:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};