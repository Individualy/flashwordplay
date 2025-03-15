
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, CheckSquare, Shuffle } from "lucide-react";

interface ModeTileProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

const ModeTile: React.FC<ModeTileProps> = ({ 
  title, 
  description, 
  icon, 
  color, 
  onClick 
}) => {
  return (
    <Card 
      className={`p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-l-4 ${color}`}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-full bg-gray-100">{icon}</div>
        <div>
          <h3 className="font-bold text-lg mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Card>
  );
};

interface LearningDashboardProps {
  onSelectMode: (mode: string) => void;
}

const LearningDashboard: React.FC<LearningDashboardProps> = ({ onSelectMode }) => {
  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">FlashWordPlay</h1>
        <p className="text-gray-600">Select a learning mode to get started</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
        <ModeTile
          title="Flashcards"
          description="Review vocabulary with interactive flashcards"
          icon={<Book size={24} className="text-app-blue" />}
          color="border-app-blue"
          onClick={() => onSelectMode("flashcard")}
        />
        
        <ModeTile
          title="Multiple Choice"
          description="Test your knowledge with multiple choice questions"
          icon={<CheckSquare size={24} className="text-app-green" />}
          color="border-app-green"
          onClick={() => onSelectMode("multiple-choice")}
        />
        
        <ModeTile
          title="Matching"
          description="Match words with their translations"
          icon={<Shuffle size={24} className="text-app-purple" />}
          color="border-app-purple"
          onClick={() => onSelectMode("matching")}
        />
      </div>
    </div>
  );
};

export default LearningDashboard;
