
import vocabularyData from '../data/vocabulary.json';

export interface Word {
  id: number;
  word: string;
  translation: string;
  example: string;
}

export class VocabularyService {
  private words: Word[] = [];

  constructor() {
    this.words = vocabularyData.words;
  }

  getAllWords(): Word[] {
    return [...this.words];
  }

  getWordById(id: number): Word | undefined {
    return this.words.find(word => word.id === id);
  }

  getRandomWords(count: number): Word[] {
    const shuffled = [...this.words].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  getRandomWordsExcluding(count: number, excludeId: number): Word[] {
    const filtered = this.words.filter(word => word.id !== excludeId);
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}

export const vocabularyService = new VocabularyService();
