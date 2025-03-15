
import vocabularyData from '../data/vocabulary.json';

export interface Word {
  id: number;
  word: string;
  translation: string;
  example: string;
}

export interface Module {
  id: number;
  name: string;
  words: Word[];
}

export interface Folder {
  id: number;
  name: string;
  modules: Module[];
}

export class VocabularyService {
  private words: Word[] = [];
  private folders: Folder[] = [];
  private lastWordId: number = 0;
  private lastModuleId: number = 0;
  private lastFolderId: number = 0;

  constructor() {
    this.words = vocabularyData.words;
    
    // Find the highest ID to ensure new items get unique IDs
    this.words.forEach(word => {
      this.lastWordId = Math.max(this.lastWordId, word.id);
    });
    
    // Initialize with a default folder and module
    const defaultModule: Module = {
      id: 1,
      name: "Basic Vocabulary",
      words: [...this.words]
    };
    
    const defaultFolder: Folder = {
      id: 1,
      name: "General",
      modules: [defaultModule]
    };
    
    this.folders = [defaultFolder];
    this.lastModuleId = 1;
    this.lastFolderId = 1;
  }

  // Words methods
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

  // Folders methods
  getAllFolders(): Folder[] {
    return [...this.folders];
  }

  getFolderById(id: number): Folder | undefined {
    return this.folders.find(folder => folder.id === id);
  }

  createFolder(name: string): Folder {
    const newFolder: Folder = {
      id: ++this.lastFolderId,
      name,
      modules: []
    };
    this.folders.push(newFolder);
    return newFolder;
  }

  updateFolder(id: number, name: string): Folder | undefined {
    const folder = this.getFolderById(id);
    if (folder) {
      folder.name = name;
    }
    return folder;
  }

  deleteFolder(id: number): boolean {
    const initialLength = this.folders.length;
    this.folders = this.folders.filter(folder => folder.id !== id);
    return initialLength !== this.folders.length;
  }

  // Modules methods
  getAllModules(): Module[] {
    return this.folders.flatMap(folder => folder.modules);
  }

  getModuleById(id: number): Module | undefined {
    for (const folder of this.folders) {
      const module = folder.modules.find(module => module.id === id);
      if (module) return module;
    }
    return undefined;
  }

  getModulesByFolderId(folderId: number): Module[] {
    const folder = this.getFolderById(folderId);
    return folder ? [...folder.modules] : [];
  }

  createModule(folderId: number, name: string): Module | undefined {
    const folder = this.getFolderById(folderId);
    if (folder) {
      const newModule: Module = {
        id: ++this.lastModuleId,
        name,
        words: []
      };
      folder.modules.push(newModule);
      return newModule;
    }
    return undefined;
  }

  updateModule(id: number, name: string): Module | undefined {
    for (const folder of this.folders) {
      const moduleIndex = folder.modules.findIndex(module => module.id === id);
      if (moduleIndex !== -1) {
        folder.modules[moduleIndex].name = name;
        return folder.modules[moduleIndex];
      }
    }
    return undefined;
  }

  deleteModule(id: number): boolean {
    for (const folder of this.folders) {
      const initialLength = folder.modules.length;
      folder.modules = folder.modules.filter(module => module.id !== id);
      if (initialLength !== folder.modules.length) {
        return true;
      }
    }
    return false;
  }

  // Words in modules methods
  getWordsByModuleId(moduleId: number): Word[] {
    const module = this.getModuleById(moduleId);
    return module ? [...module.words] : [];
  }

  addWordToModule(moduleId: number, word: Omit<Word, "id">): Word | undefined {
    const module = this.getModuleById(moduleId);
    if (module) {
      const newWord: Word = {
        ...word,
        id: ++this.lastWordId
      };
      module.words.push(newWord);
      return newWord;
    }
    return undefined;
  }

  updateWordInModule(moduleId: number, wordId: number, updatedWord: Omit<Word, "id">): Word | undefined {
    const module = this.getModuleById(moduleId);
    if (module) {
      const wordIndex = module.words.findIndex(word => word.id === wordId);
      if (wordIndex !== -1) {
        module.words[wordIndex] = {
          ...updatedWord,
          id: wordId
        };
        return module.words[wordIndex];
      }
    }
    return undefined;
  }

  deleteWordFromModule(moduleId: number, wordId: number): boolean {
    const module = this.getModuleById(moduleId);
    if (module) {
      const initialLength = module.words.length;
      module.words = module.words.filter(word => word.id !== wordId);
      return initialLength !== module.words.length;
    }
    return false;
  }
}

export const vocabularyService = new VocabularyService();
