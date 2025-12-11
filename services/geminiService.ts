import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GlossToken } from "../types";

const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is not set in environment variables");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'DUMMY_KEY_FOR_BUILD' });

const glossSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      original: {
        type: Type.STRING,
        description: "The original word, punctuation mark, or '\\n' for a newline/line-break exactly as it appears in the text."
      },
      modernTranslation: {
        type: Type.STRING,
        description: "A brief modern English definition or translation. For '\\n', return 'Line Break'."
      },
      lemma: {
        type: Type.STRING,
        description: "The dictionary headword form (Standard West Saxon). For '\\n', return 'N/A'."
      },
      partOfSpeech: {
        type: Type.STRING,
        description: "The part of speech. For '\\n', return 'Formatting'."
      },
      grammaticalInfo: {
        type: Type.STRING,
        description: "Morphological details. For '\\n', return 'N/A'."
      },
      etymology: {
        type: Type.STRING,
        description: "Brief etymology. For '\\n', return 'N/A'."
      },
      isPunctuation: {
        type: Type.BOOLEAN,
        description: "True if this is punctuation or a newline ('\\n')."
      }
    },
    required: ["original", "modernTranslation", "lemma", "partOfSpeech", "grammaticalInfo", "isPunctuation"]
  }
};

export const analyzeOldEnglishText = async (text: string): Promise<GlossToken[]> => {
  if (!apiKey) throw new Error("API Key is missing.");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert philologist specializing in Old English (Anglo-Saxon).
      Analyze the following Old English text. Break it down into individual tokens (words, punctuation, and newlines).
      
      CRITICAL INSTRUCTION FOR STRUCTURE:
      - Preserve the visual structure of the text.
      - If you encounter a line break (newline character) in the text, you MUST output a distinct token where "original" is exactly "\\n".
      - If there are multiple newlines (e.g. paragraph break), output multiple "\\n" tokens.
      - DO NOT create separate tokens for whitespace (spaces/tabs). Whitespace should be implied between tokens unless it is a newline.
      - Punctuation marks (.,?!:;) should be separate tokens.
      
      For each token, provide a detailed philological gloss including the modern meaning, lemma, part of speech, and specific grammatical morphology (case, gender, number, etc.) for this context.
      
      Text to analyze:
      "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: glossSchema,
        temperature: 0.1, 
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text) as GlossToken[];
      return data;
    }
    
    throw new Error("No data returned from model");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};