// functions/index.js
const { onRequest } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Load environment variables
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.STRADY_GEMINI_API_KEY);

exports.askGemini = onRequest(
  { 
    timeoutSeconds: 300, // ⚡️ 5 Minutes (This fixes the 502 error)
    region: "us-central1",
    cors: true // Allows your React app to talk to this function
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
      const { prompt } = req.body;
      if (!prompt) return res.status(400).json({ error: "No prompt provided" });

      const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      res.status(200).json({ answer: text });

    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);