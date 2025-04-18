import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

// Ensure the API key is valid and correctly set
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error(
    "API key is missing. Please set GEMINI_API_KEY in your environment."
  );
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const voiceCommand = async (req, res) => {
  try {
    const { text, language } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const systemPrompts = {
      en: `You are a voice command interpreter for a web application. 
           Parse the user's voice command and return a structured JSON object.
           Valid actions are: navigate (with target), scroll (up/down), back, refresh.
           The site has these pages: overview, recent, news, profile, chatbot, 
           game flow.

           Examples:
           "go to overview" -> { "action": "navigate", "target": "overview" }
           "scroll down" -> { "action": "scroll", "target": "down" }
           "go back" -> { "action": "back" }
           "go to workflows" -> { "action": "navigate", "target": "marketplace/workflows" }
           Return ONLY a JSON object.`,
    };

    const systemPrompt = systemPrompts[language] || systemPrompts["en"];

    const chat = model.startChat({
      history: [],
      generationConfig: { temperature: 0.8, maxOutputTokens: 150 },
    });

    const result = await chat.sendMessage(systemPrompt + "\n" + text);
    const responseText = result.response.text();

    if (!responseText) {
      throw new Error("No response from AI");
    }

    const cleanResponseText = responseText.replace(
      /```(?:json)?\n?([\s\S]*?)```/g,
      "$1"
    );
    const parsedResponse = JSON.parse(cleanResponseText);

    return res.status(200).json(parsedResponse);
  } catch (error) {
    console.error("Error processing command:", error);
    return res
      .status(500)
      .json({ error: "Failed to process command", details: error.message });
  }
};
