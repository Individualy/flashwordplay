
import React, { useState, useEffect } from "react";
import { Word, vocabularyService } from "../services/VocabularyService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const FlashcardMode: React.FC = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWords = () => {
      const loadedWords = vocabularyService.getAllWords();
      setWords(loadedWords);
      
      // Initialize all cards as not flipped
      const initialFlippedState: Record<number, boolean> = {};
      loadedWords.forEach((word, index) => {
        initialFlippedState[index] = false;
      });
      setFlippedCards(initialFlippedState);
      
      setIsLoading(false);
    };
    loadWords();
  }, []);

  const handleFlip = (index: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (words.length === 0) {
    return <div className="text-center p-4">No vocabulary words found.</div>;
  }

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <h2 className="text-2xl font-bold mb-4">Flashcard Mode</h2>
      
      <div className="w-full max-w-md">
        <Carousel className="w-full">
          <CarouselContent>
            {words.map((word, index) => (
              <CarouselItem key={word.id}>
                <div className="p-1">
                  <Card 
                    className={`w-full h-60 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl ${
                      flippedCards[index] ? 'bg-app-green text-white' : 'bg-white'
                    }`} 
                    onClick={() => handleFlip(index)}
                  >
                    <div className="text-center p-6">
                      <div className="text-3xl font-bold">
                        {flippedCards[index] ? word.translation : word.word}
                      </div>
                      {flippedCards[index] && (
                        <div className="mt-4 text-sm italic">
                          {word.example}
                        </div>
                      )}
                    </div>
                  </Card>
                  
                  <div className="text-center text-sm mt-2">
                    Card {index + 1} of {words.length} - Click to flip
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 -translate-x-1/2" />
          <CarouselNext className="absolute right-0 translate-x-1/2" />
        </Carousel>
      </div>

      <div className="text-center text-sm mt-4 text-muted-foreground">
        Swipe left or right to navigate between cards
      </div>
    </div>
  );
};

export default FlashcardMode;
