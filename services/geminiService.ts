import { GoogleGenAI, ChatSession, Type, FunctionDeclaration } from "@google/genai";
import { MarkdownFile } from '../types';
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

// Define the Tool
const createFileTool: FunctionDeclaration = {
  name: 'create_file',
  description: 'Create a new markdown file in the archive. Use this when the user asks to save a draft, create a project, or store information.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      path: {
        type: Type.STRING,
        description: 'The full file path, starting with /. Example: /Projects/Under_Armour.md or /Bio/My_Story.md',
      },
      category: {
        type: Type.STRING,
        description: 'The folder category. Example: Projects, Bio, Brand, Notes',
      },
      content: {
        type: Type.STRING,
        description: 'The full Markdown content of the file.',
      },
    },
    required: ['path', 'category', 'content'],
  },
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
The following text is the ENTIRETY of what you know.
${formatKnowledgeBase(files)}

### TOOLS
You have access to a "create_file" tool.
- If the user asks you to "draft", "create", "write", or "save" a document, use this tool immediately.
- Do not ask for permission to use it. Just do it.
`;

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: fullSystemInstruction,
      temperature: 0.5,
      tools: [{ functionDeclarations: [createFileTool] }],
    },
  });
};

// Define a response type that can be Text OR a Function Call
export interface GeminiResponse {
  text?: string;
  toolCall?: {
    id: string;
    name: string;
    args: any;
  };
}

export const sendMessageToGemini = async (userMessage: string): Promise<GeminiResponse> => {
  if (!chatSession) throw new Error("Chat session not initialized");

  try {
    const result = await chatSession.sendMessage({ message: userMessage });
    
    // Check for function calls
    const toolCalls = result.functionCalls;
    if (toolCalls && toolCalls.length > 0) {
      const call = toolCalls[0];
      return {
        toolCall: {
          id: call.id,
          name: call.name,
          args: call.args
        }
      };
    }

    return { text: result.text || "No output." };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "Error communicating with Archive Intelligence." };
  }
};

export const sendToolResponse = async (toolCallId: string, functionName: string, result: any): Promise<GeminiResponse> => {
  if (!chatSession) throw new Error("Chat session not initialized");

  try {
    // Send the execution result back to the model so it can confirm to the user
    const response = await chatSession.sendToolResponse({
      functionResponses: [
        {
          id: toolCallId,
          name: functionName,
          response: { result: result },
        }
      ]
    });

    return { text: response.text || "Action confirmed." };
  } catch (error) {
    console.error("Tool Response Error:", error);
    return { text: "Error confirming action." };
  }
};