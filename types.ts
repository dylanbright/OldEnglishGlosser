export interface GlossToken {
  original: string;
  modernTranslation: string;
  lemma: string;
  partOfSpeech: string;
  grammaticalInfo: string;
  etymology: string;
  isPunctuation: boolean;
  isFlagged?: boolean;
}

export enum AppState {
  INPUT = 'INPUT',
  LOADING = 'LOADING',
  GLOSSING = 'GLOSSING',
  ERROR = 'ERROR'
}

export interface AnalyzeResponse {
  tokens: GlossToken[];
}