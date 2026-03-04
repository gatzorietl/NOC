
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { MessageTone, MessageParts } from "./types";

export const generateMessageParts = async (topic: string, tone: MessageTone): Promise<MessageParts> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: `Draft input: "${topic}". Tone: ${tone}.`,
    config: {
      systemInstruction: `You are a professional email assistant for a chromatic workspace.
      TASK: Generate 3 professional ENGLISH variations for a modular email based on the user's input.
      
      STRICT RULES:
      1. PRESERVATION: If input has text in "quotes", keep those exact strings verbatim.
      2. PERSPECTIVE: Always use "WE" (plural) for the sender. Never use "I", "me", or "my".
      3. GREETINGS: Include "Dear Partner" as the primary greeting.
      4. OUTPUT: Return valid JSON matching the schema.`,
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          greetings: { type: Type.ARRAY, items: { type: Type.STRING } },
          bodies: { type: Type.ARRAY, items: { type: Type.STRING } },
          thanks: { type: Type.ARRAY, items: { type: Type.STRING } },
          closings: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["greetings", "bodies", "thanks", "closings"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text) as MessageParts;
    if (!data.greetings.includes("Dear Partner")) {
      data.greetings.unshift("Dear Partner");
    }
    return data;
  } catch {
    throw new Error("AI communication error. Please try again.");
  }
};
