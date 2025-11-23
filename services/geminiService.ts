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
        description: "The original word or punctuation mark exactly as it appears in the text."
      },
      modernTranslation: {
        type: Type.STRING,
        description: "A brief modern English definition or translation of this specific word instance."
      },
      lemma: {
        type: Type.STRING,
        description: "The dictionary headword form of the word (Standard West Saxon spelling). Crucial: This must be the Nominative Singular for nouns, Infinitive for verbs, etc., suitable for dictionary lookup."
      },
      partOfSpeech: {
        type: Type.STRING,
        description: "The part of speech (e.g., Noun, Verb, Pronoun, Preposition)."
      },
      grammaticalInfo: {
        type: Type.STRING,
        description: "Morphological details: Case, Gender, Number, Tense, Mood, Person (e.g., 'Nom. Sg. Masc.', '3rd Pers. Sg. Pres. Ind.')."
      },
      etymology: {
        type: Type.STRING,
        description: "A very brief note on etymology or cognates (e.g., 'Cognate with German ...', 'Related to Modern English ...')."
      },
      isPunctuation: {
        type: Type.BOOLEAN,
        description: "True if this token is a punctuation mark, false otherwise."
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
      Analyze the following Old English text. Break it down into individual tokens (words and punctuation).
      For each token, provide a detailed philological gloss including the modern meaning, lemma, part of speech, and specific grammatical morphology (case, gender, number, etc.) for this context.
      
      Text to analyze:
      "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: glossSchema,
        temperature: 0.1, // Low temperature for factual grammatical analysis
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