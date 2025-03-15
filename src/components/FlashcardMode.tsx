
import React, { useState, useEffect } from "react";
import { Word, vocabularyService } from "../services/VocabularyService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";

const FlashcardMode: React.FC = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWords = () => {
      const loadedWords = vocabularyService.getAllWords();
      setWords(loadedWords);
      setIsLoading(false);
    };
    loadWords();
  }, []);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 100);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + words.length) % words.length);
    }, 100);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (words.length === 0) {
    return <div className="text-center p-4">No vocabulary words found.</div>;
  }

  const currentWord = words[currentIndex];

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <h2 className="text-2xl font-bold mb-4">Flashcard Mode</h2>
      
      <div className="w-full max-w-md">
        <Card 
          className={`w-full h-60 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl ${isFlipped ? 'bg-app-green text-white' : 'bg-white'}`} 
          onClick={handleFlip}
        >
          <div className="text-center p-6">
            <div className="text-3xl font-bold">
              {isFlipped ? currentWord.translation : currentWord.word}
            </div>
            {isFlipped && (
              <div className="mt-4 text-sm italic">
                {currentWord.example}
              </div>
            )}
          </div>
        </Card>
        
        <div className="text-center text-sm mt-2">
          Card {currentIndex + 1} of {words.length} - Click to flip
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          className="rounded-full w-12 h-12 p-0"
        >
          <ArrowLeft size={20} />
        </Button>
        <Button 
          variant="outline" 
          onClick={handleNext}
          className="rounded-full w-12 h-12 p-0"
        >
          <ArrowRight size={20} />
        </Button>
      </div>
    </div>
  );
};

export default FlashcardMode;
