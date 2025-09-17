
export interface WaniKaniMeaning {
  meaning: string;
  primary: boolean;
  accepted_answer: boolean;
}

export interface WaniKaniSubjectData {
  characters: string | null;
  meanings: WaniKaniMeaning[];
  component_subject_ids?: number[];
  slug: string;
}

export interface WaniKaniSubject {
  id: number;
  object: 'radical' | 'kanji' | 'vocabulary';
  data: WaniKaniSubjectData;
}

export interface WaniKaniCollection {
  object: 'collection';
  pages: {
    next_url: string | null;
    previous_url: string | null;
    per_page: number;
  };
  total_count: number;
  data_updated_at: string;
  data: WaniKaniSubject[];
}

export interface Radical {
  id: number;
  character: string | null;
  meaning: string;
}

export interface KanjiDetail {
  id: number;
  character: string;
  meaning: string;
  radicals: Radical[];
}

export interface AnalysisResult {
  originalWord: string;
  translation: string;
  kanjiDetails: KanjiDetail[];
}
