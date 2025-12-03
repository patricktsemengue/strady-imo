// functions/index.js
const { onRequest } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { defineString } = require("firebase-functions/params");

// Define the Gemini API key as a secret parameter
const geminiApiKey = defineString("GEMINI_API_SECRET");

exports.askGemini = onRequest(
  { 
    timeoutSeconds: 300,
    region: "us-central1",
    cors: true,
    secrets: ["GEMINI_API_SECRET"], // Grant the function access to the new secret
  },
  async (req, res) => {
    // Handle preflight (browser security check)
    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.status(204).send('');
        return;
    }

    try {
      // Initialize the AI client inside the function
      const genAI = new GoogleGenerativeAI(geminiApiKey.value());

      const { prompt, taskType = 'QA' } = req.body;
      if (!prompt) return res.status(400).json({ error: "No prompt provided" });

      // Dynamically select the model based on the task
      let modelName;
      switch (taskType) {
        case 'EXTRACT_URL':
          modelName = 'gemini-pro-latest'; // More powerful model for complex tasks
          console.log(`Using powerful model for URL extraction: ${modelName}`);
          break;
        case 'QA':
        default:
          modelName = 'gemini-flash-latest'; // Faster model for general conversation
          console.log(`Using fast model for QA: ${modelName}`);
          break;
      }

      const model = genAI.getGenerativeModel({ model: modelName });

      // Set headers for streaming
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');

      const stream = await model.generateContentStream(prompt);
      
      // Pipe the stream from Gemini to the client
      for await (const chunk of stream.stream) {
          const chunkText = chunk.text();
          res.write(chunkText);
      }
      
      // End the stream
      res.end();

    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);