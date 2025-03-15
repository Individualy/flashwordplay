
import React, { useState, useEffect } from "react";
import { Word, vocabularyService } from "../services/VocabularyService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface MatchItem {
  id: number;
  text: string;
  type: "word" | "translation";
  originalId: number;
  isMatched: boolean;
}

const MatchingMode: React.FC = () => {
  const [items, setItems] = useState<MatchItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MatchItem | null>(null);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPairs, setTotalPairs] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const loadItems = () => {
      const words = vocabularyService.getRandomWords(6);
      setTotalPairs(words.length);
      
      const wordItems = words.map((word, index) => ({
        id: index,
        text: word.word,
        type: "word" as const,
        originalId: word.id,
        isMatched: false
      }));
      
      const translationItems = words.map((word, index) => ({
        id: index + words.length,
        text: word.translation,
        type: "translation" as const,
        originalId: word.id,
        isMatched: false
      }));
      
      // Shuffle both arrays and combine
      const allItems = [...wordItems, ...translationItems].sort(() => 0.5 - Math.random());
      setItems(allItems);
      setIsLoading(false);
    };
    
    loadItems();
  }, []);

  const handleSelectItem = (item: MatchItem) => {
    if (item.isMatched) return;
    
    if (!selectedItem) {
      // First selection
      setSelectedItem(item);
    } else {
      // Second selection - check if it's a match
      if (
        selectedItem.id !== item.id && 
        selectedItem.originalId === item.originalId &&
        selectedItem.type !== item.type
      ) {
        // It's a match!
        const updatedItems = items.map(i => 
          i.id === selectedItem.id || i.id === item.id 
            ? { ...i, isMatched: true } 
            : i
        );
        
        setItems(updatedItems);
        setMatchedPairs(prev => prev + 1);
        setSelectedItem(null);
        
        toast.success("Matching pair found!");
        
        // Check if all pairs are matched
        if (matchedPairs + 1 === totalPairs) {
          setIsCompleted(true);
          toast.success("All pairs matched! Well done!");
        }
      } else {
        // Not a match
        toast.error("Not a match, try again!");
        // Brief highlight of the selected items before clearing
        setTimeout(() => {
          setSelectedItem(null);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setIsLoading(true);
    setSelectedItem(null);
    setMatchedPairs(0);
    setIsCompleted(false);
    
    const loadItems = () => {
      const words = vocabularyService.getRandomWords(6);
      setTotalPairs(words.length);
      
      const wordItems = words.map((word, index) => ({
        id: index,
        text: word.word,
        type: "word" as const,
        originalId: word.id,
        isMatched: false
      }));
      
      const translationItems = words.map((word, index) => ({
        id: index + words.length,
        text: word.translation,
        type: "translation" as const,
        originalId: word.id,
        isMatched: false
      }));
      
      // Shuffle both arrays and combine
      const allItems = [...wordItems, ...translationItems].sort(() => 0.5 - Math.random());
      setItems(allItems);
      setIsLoading(false);
    };
    
    loadItems();
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <h2 className="text-2xl font-bold mb-4">Matching Exercise</h2>
      
      <div className="w-full max-w-md">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {items.map((item) => (
            <Button
              key={item.id}
              variant={
                item.isMatched
                  ? "default"
                  : selectedItem?.id === item.id
                  ? "secondary"
                  : "outline"
              }
              className={`h-24 p-2 flex items-center justify-center text-center ${
                item.isMatched ? "bg-app-green text-white" : ""
              }`}
              onClick={() => handleSelectItem(item)}
              disabled={item.isMatched || isCompleted}
            >
              {item.text}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-sm">
          Matched: {matchedPairs} of {totalPairs} pairs
        </p>
        {isCompleted && (
          <Button onClick={resetGame} className="mt-4">
            Play Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default MatchingMode;
