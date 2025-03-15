
import React, { useState } from "react";
import LearningDashboard from "../components/LearningDashboard";
import FlashcardMode from "../components/FlashcardMode";
import MultipleChoiceMode from "../components/MultipleChoiceMode";
import MatchingMode from "../components/MatchingMode";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Index = () => {
  const [activeMode, setActiveMode] = useState<string | null>(null);

  const handleSelectMode = (mode: string) => {
    setActiveMode(mode);
  };

  const handleBackToDashboard = () => {
    setActiveMode(null);
  };

  const renderActiveMode = () => {
    switch (activeMode) {
      case "flashcard":
        return <FlashcardMode />;
      case "multiple-choice":
        return <MultipleChoiceMode />;
      case "matching":
        return <MatchingMode />;
      default:
        return <LearningDashboard onSelectMode={handleSelectMode} />;
    }
  };

  return (
    <div className="min-h-screen bg-app-light-gray">
      <div className="container mx-auto px-4 py-8">
        {activeMode && (
          <Button 
            variant="ghost" 
            className="mb-4 flex items-center gap-2"
            onClick={handleBackToDashboard}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-4">
          {renderActiveMode()}
        </div>
      </div>
    </div>
  );
};

export default Index;
