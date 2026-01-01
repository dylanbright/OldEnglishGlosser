
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GlossToken } from "../types";

const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is not set in environment variables");
}

// Using a slightly larger thinking budget for complex philological tasks
const ai = new GoogleGenAI({ apiKey: apiKey || 'DUMMY_KEY_FOR_BUILD' });

const glossSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      original: {
        type: Type.STRING,
        description: "The word, punctuation, or '\\n' for a newline."
      },
      modernTranslation: {
        type: Type.STRING,
        description: "Modern English definition. For '\\n', return 'Line Break'."
      },
      lemma: {
        type: Type.STRING,
        description: "Standard West Saxon headword. For '\\n', return 'N/A'."
      },
      partOfSpeech: {
        type: Type.STRING,
        description: "Part of speech. For '\\n', return 'Formatting'."
      },
      grammaticalInfo: {
        type: Type.STRING,
        description: "Contextual morphology (case, number, gender, etc.). For '\\n', return 'N/A'."
      },
      etymology: {
        type: Type.STRING,
        description: "Brief etymology notes. For '\\n', return 'N/A'."
      },
      isPunctuation: {
        type: Type.BOOLEAN,
        description: "True if punctuation or newline ('\\n')."
      }
    },
    required: ["original", "modernTranslation", "lemma", "partOfSpeech", "grammaticalInfo", "isPunctuation"]
  }
};

/**
 * Splits text into chunks by line count to avoid JSON output truncation.
 */
const splitIntoChunks = (text: string, maxLines: number = 12): string[] => {
  const lines = text.split('\n');
  const chunks: string[] = [];
  for (let i = 0; i < lines.length; i += maxLines) {
    chunks.push(lines.slice(i, i + maxLines).join('\n'));
  }
  return chunks;
};

export const analyzeOldEnglishText = async (text: string): Promise<GlossToken[]> => {
  if (!apiKey) throw new Error("API Key is missing.");

  // For very long texts, we process in chunks to prevent model output truncation
  const chunks = splitIntoChunks(text);
  let allTokens: GlossToken[] = [];

  for (const [index, chunk] of chunks.entries()) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are an expert philologist specializing in Old English.
        Analyze Chunk ${index + 1} of ${chunks.length}.
        Break it down into tokens (words, punctuation, and newlines).
        
        RULES:
        - Output EXACTLY as JSON.
        - Preserve visual structure: If a newline exists, output a token where "original" is "\\n".
        - Do not output tokens for spaces.
        - Provide rich grammatical morphology for the specific context.
        
        Text to analyze:
        "${chunk}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: glossSchema,
          temperature: 0.1,
          thinkingConfig: { thinkingBudget: 0 } // Flash doesn't need high budget for this, keeping it fast
        }
      });

      if (response.text) {
        try {
          const chunkTokens = JSON.parse(response.text.trim()) as GlossToken[];
          allTokens = [...allTokens, ...chunkTokens];
        } catch (parseError) {
          console.error("Chunk parse error:", response.text);
          throw new Error(`Failed to parse analysis for segment ${index + 1}. The response was malformed.`);
        }
      } else {
        throw new Error(`The scribe returned an empty scroll for segment ${index + 1}.`);
      }
    } catch (error) {
      console.error(`Gemini API Error on chunk ${index}:`, error);
      // If we already have some tokens, we might return them, but for a clean fix we rethrow
      throw error;
    }
  }

  return allTokens;
};
