import { GoogleGenAI, ChatSession } from "@google/genai";
import { MarkdownFile, Message } from '../types';
import { SYSTEM_INSTRUCTION_HEADER } from '../constants';

// Store the session instance
let chatSession: ChatSession | null = null;

const formatKnowledgeBase = (files: MarkdownFile[]): string => {
  return files.map(f => `
---
FILE PATH: ${f.path}
CATEGORY: ${f.category}
LAST UPDATED: ${f.lastUpdated}
CONTENT:
${f.content}
---
`).join('\n');
};

export const initializeChat = async (files: MarkdownFile[]) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment");
    throw new Error("API_KEY is missing");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const fullSystemInstruction = `
${SYSTEM_INSTRUCTION_HEADER}

### THE KNOWLEDGE BASE (CURRENT ARCHIVE)
The following text is the ENTIRETY of what you know. You do not know anything outside of this.
If a user asks about Colton, you MUST look here first.

${formatKnowledgeBase(files)}
`;

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: fullSystemInstruction,
      temperature: 0.5, // Lowered temperature to stick closer to the provided text
    },
  });
};

export const sendMessageToGemini = async (userMessage: string): Promise<string> => {
  if (!chatSession) {
    // If session is missing, we might need to wait or throw. 
    // Ideally App.tsx handles initialization, but a safety check:
    throw new Error("Chat session not initialized");
  }

  try {
    const result = await chatSession.sendMessage({
        message: userMessage
    });
    return result.text || "I processed the request but received no textual output.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "CRITICAL ERROR: Connection to Intelligence Layer failed. Please check your network or API Key.";
  }
};