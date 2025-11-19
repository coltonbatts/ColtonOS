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
${formatKnowledgeBase(files)}
`;

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: fullSystemInstruction,
      temperature: 0.7, // Low temperature for factual retrieval, slightly higher for creative drafting
    },
  });
};

export const sendMessageToGemini = async (userMessage: string): Promise<string> => {
  if (!chatSession) {
    throw new Error("Chat session not initialized");
  }

  try {
    const result = await chatSession.sendMessage({
        message: userMessage
    });
    return result.text || "I processed the request but received no textual output.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "CRITICAL ERROR: Connection to Intelligence Layer failed.";
  }
};