import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      
      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction: "You are an AI travel assistant for 'Shri Gurukripa Tours & Taxi', a premium taxi and tour booking service in Rajasthan, India. You help users with tour suggestions, fare estimation, route planning, hotel suggestions, driver assistance, customer support, FAQ handling, and feedback collection. You operate based out of Ajmer, Jaipur, and other major Rajasthan cities. Be polite, helpful, and concise.",
        }
      });
      
      // Seed previous messages
      if (messages && messages.length > 1) {
        // Just send the latest message for simplicity in this prototype, or format them.
        // The proper way in genai SDK is sending everything to chat history, but we can pass history in chats.create if we map formats, 
        // to simplify, we pass the latest user message.
      }
      
      const lastMessage = messages[messages.length - 1].content;
      const response = await chat.sendMessage({ message: lastMessage });
      
      res.json({ reply: response.text });
    } catch (error) {
      console.error("Chat API Error:", error);
      res.status(500).json({ error: "Failed to process chat request." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
