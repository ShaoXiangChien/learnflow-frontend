export interface Word {
  word: string;
  translation: string;
  pronunciation: string;
  definition?: string;
  example?: string;
}

export interface Subtitle {
  start: number;
  end: number;
  text_target: string;
  text_native: string;
  words: Word[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

export interface Quiz {
  video_id: string;
  questions: QuizQuestion[];
}

export interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  language: string;
  difficulty: string;
  duration: number;
  description?: string;
  subtitles: Subtitle[];
  quiz?: Quiz;
}

export interface FlashcardWord extends Word {
  timestamp: number;
}
