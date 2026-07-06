import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import emailRoutes from "./email-service/emailRoutes.js";
import { verifyEmailConnection } from "./email-service/emailConfig.js";

dotenv.config();

const apiKeyVal = process.env.GEMINI_API_KEY || "";
const hasValidApiKey = apiKeyVal.trim() !== "" && apiKeyVal !== "MY_GEMINI_API_KEY";

const ai = new GoogleGenAI({
  apiKey: apiKeyVal || "dummy-key-to-prevent-sdk-crash",
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

  // ── Mount Email API routes ─────────────────────────────
  app.use("/api/email", emailRoutes);

  // ── Verify SMTP connection (non-blocking) ──────────────
  verifyEmailConnection().catch(() => {
    console.warn("⚠️  SMTP not configured — email features will not work. See .env.example");
  });

  // API Routes
  app.post("/api/chat", async (req, res) => {
    const { messages } = req.body;
    try {
      if (!messages || !messages.length) {
        return res.status(400).json({ error: "No messages provided." });
      }

      // Safe Fallback if API key is not configured
      if (!hasValidApiKey) {
        console.warn("GEMINI_API_KEY is not configured. Running in local backup mode.");
        const lastMessage = String(messages[messages.length - 1].content).toLowerCase();
        let reply = "";

        if (lastMessage.includes("udaipur")) {
          reply = `Here is a custom 3-day itinerary for Udaipur (Venice of the East):
- Day 1: City Palace tour, boat ride in Lake Pichola, and Jagmandir.
- Day 2: Visit Sajjangarh (Monsoon Palace), Saheliyon-ki-Bari gardens, and Fateh Sagar Lake.
- Day 3: Excursion to Haldighati or Kumbhalgarh Fort.
Estimated Hatchback fare from Jaipur starts at ₹6,500 roundtrip. Call +91 9950072777 to book!`;
        } else if (lastMessage.includes("jaipur")) {
          reply = `Here is a 2-day heritage guide for Jaipur (Pink City):
- Day 1: Visit Amber Fort (elephant ride/jeep), Jal Mahal, Hawa Mahal, and Jantar Mantar.
- Day 2: Explore City Palace, Albert Hall Museum, Birla Temple, and shop at Johari Bazaar.
Try delicious Rajasthani Thali at Chokhi Dhani! Cabs are available at ₹11/km.`;
        } else if (lastMessage.includes("jaisalmer")) {
          reply = `Here is a 2-day desert itinerary for Jaisalmer (Golden City):
- Day 1: Visit Jaisalmer Fort (Sonar Qila), Patwon ki Haveli, and Gadisar Lake.
- Day 2: Excursion to Sam Sand Dunes for camel rides, sunset views, and Rajasthani folk dance with camp stay.
Outstation cab package from Jaipur starts at ₹12,000.`;
        } else if (lastMessage.includes("toll") || lastMessage.includes("charge") || lastMessage.includes("fare") || lastMessage.includes("allowance")) {
          reply = `Typical outstation charges:
- Hatchback: ₹11/km (Base ₹999)
- Sedan: ₹12/km (Base ₹1,200)
- SUV Innova: ₹18/km (Base ₹2,800)
* Note: Toll taxes, state border permits, and driver allowance (₹300/day) are extra. We charge only for actual kms traveled.`;
        } else {
          reply = `Namaste! I am the Shri Gurukripa AI Assistant. 
[Note: GEMINI_API_KEY is not configured in your .env file, so I am running in local backup mode.]
I can help you plan your travel across Rajasthan. Please tell me which cities you plan to visit (e.g., Jaipur, Udaipur, Jaisalmer) or ask about our taxi fares! You can also call us directly at +91 9950072777.`;
        }

        return res.json({ reply });
      }

      const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: "You are an AI travel assistant for 'Shri Gurukripa Tours & Taxi', a premium taxi and tour booking service in Rajasthan, India. You help users with tour suggestions, fare estimation, route planning, hotel suggestions, driver assistance, customer support, FAQ handling, and feedback collection. You operate based out of Ajmer, Jaipur, and other major Rajasthan cities. Be polite, helpful, and concise.",
        }
      });
      
      const lastMessage = messages[messages.length - 1].content;
      const response = await chat.sendMessage({ message: lastMessage });
      
      res.json({ reply: response.text });
    } catch (error) {
      console.error("Chat API Error (falling back to mock responses):", error);
      
      const lastMessage = String(messages && messages.length ? messages[messages.length - 1].content : "").toLowerCase();
      let reply = "";

      if (lastMessage.includes("udaipur")) {
        reply = `Here is a custom 3-day itinerary for Udaipur (Venice of the East):
- Day 1: City Palace tour, boat ride in Lake Pichola, and Jagmandir.
- Day 2: Visit Sajjangarh (Monsoon Palace), Saheliyon-ki-Bari gardens, and Fateh Sagar Lake.
- Day 3: Excursion to Haldighati or Kumbhalgarh Fort.
Estimated Hatchback fare from Jaipur starts at ₹6,500 roundtrip. Call +91 9950072777 to book!`;
      } else if (lastMessage.includes("jaipur")) {
        reply = `Here is a 2-day heritage guide for Jaipur (Pink City):
- Day 1: Visit Amber Fort (elephant ride/jeep), Jal Mahal, Hawa Mahal, and Jantar Mantar.
- Day 2: Explore City Palace, Albert Hall Museum, Birla Temple, and shop at Johari Bazaar.
Try delicious Rajasthani Thali at Chokhi Dhani! Cabs are available at ₹11/km.`;
      } else if (lastMessage.includes("jaisalmer")) {
        reply = `Here is a 2-day desert itinerary for Jaisalmer (Golden City):
- Day 1: Visit Jaisalmer Fort (Sonar Qila), Patwon ki Haveli, and Gadisar Lake.
- Day 2: Excursion to Sam Sand Dunes for camel rides, sunset views, and Rajasthani folk dance with camp stay.
Outstation cab package from Jaipur starts at ₹12,000.`;
      } else if (lastMessage.includes("toll") || lastMessage.includes("charge") || lastMessage.includes("fare") || lastMessage.includes("allowance")) {
        reply = `Typical outstation charges:
- Hatchback: ₹11/km (Base ₹999)
- Sedan: ₹12/km (Base ₹1,200)
- SUV Innova: ₹18/km (Base ₹2,800)
* Note: Toll taxes, state border permits, and driver allowance (₹300/day) are extra. We charge only for actual kms traveled.`;
      } else {
        reply = `Namaste! I am the Shri Gurukripa AI Assistant. 
[Note: The live AI model is currently experiencing high demand. Running in local backup mode.]
I can help you plan your travel across Rajasthan. Please tell me which cities you plan to visit (e.g., Jaipur, Udaipur, Jaisalmer) or ask about our taxi fares! You can also call us directly at +91 9950072777.`;
      }

      res.json({ reply });
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
