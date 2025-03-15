
import React, { useState, useEffect } from "react";
import { Word, vocabularyService } from "../services/VocabularyService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

interface QuizQuestion {
  word: Word;
  options: string[];
  correctAnswer: string;
}

const MultipleChoiceMode: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    const loadQuestions = () => {
      const allWords = vocabularyService.getAllWords();
      const quizQuestions = allWords.map((word) => {
        // Get 3 random incorrect options
        const otherWords = vocabularyService.getRandomWordsExcluding(3, word.id);
        const options = [...otherWords.map((w) => w.translation), word.translation].sort(
          () => 0.5 - Math.random()
        );
        
        return {
          word,
          options,
          correctAnswer: word.translation,
        };
      });
      
      setQuestions(quizQuestions);
      setIsLoading(false);
    };
    
    loadQuestions();
  }, []);

  const handleSelectAnswer = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    if (answer === questions[currentIndex].correctAnswer) {
      setScore((prev) => prev + 1);
      toast.success("Correct answer!");
    } else {
      toast.error("Incorrect answer!");
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Quiz completed
      toast.success(`Quiz completed! Your score: ${score}/${questions.length}`);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (questions.length === 0) {
    return <div className="text-center p-4">No questions available.</div>;
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <h2 className="text-2xl font-bold mb-4">Multiple Choice Quiz</h2>
      
      <div className="w-full max-w-md">
        <Card className="w-full p-6 shadow-lg">
          <div className="text-center mb-6">
            <p className="text-sm mb-2">Question {currentIndex + 1} of {questions.length}</p>
            <h3 className="text-2xl font-bold mb-2">{currentQuestion.word.word}</h3>
            <p className="text-sm italic">{currentQuestion.word.example}</p>
          </div>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === option 
                  ? option === currentQuestion.correctAnswer 
                    ? "default" 
                    : "destructive"
                  : "outline"}
                className={`w-full justify-start h-auto py-3 px-4 ${
                  isAnswered && option === currentQuestion.correctAnswer
                    ? "border-green-500 border-2"
                    : ""
                }`}
                onClick={() => handleSelectAnswer(option)}
                disabled={isAnswered}
              >
                <div className="flex justify-between w-full items-center">
                  <span>{option}</span>
                  {isAnswered && option === currentQuestion.correctAnswer && (
                    <Check className="h-5 w-5 text-green-500" />
                  )}
                  {isAnswered && selectedAnswer === option && option !== currentQuestion.correctAnswer && (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </Button>
            ))}
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-between w-full max-w-md">
        <div className="text-sm">
          Score: {score}/{questions.length}
        </div>
        <Button
          onClick={handleNext}
          disabled={!isAnswered}
          className={!isAnswered ? "opacity-50" : ""}
        >
          {currentIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
        </Button>
      </div>
    </div>
  );
};

export default MultipleChoiceMode;
