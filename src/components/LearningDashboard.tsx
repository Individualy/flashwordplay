
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, CheckSquare, Shuffle, FolderOpen } from "lucide-react";
import { Module, vocabularyService } from "../services/VocabularyService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  onSelectMode: (mode: string, moduleId?: number) => void;
}

const LearningDashboard: React.FC<LearningDashboardProps> = ({ onSelectMode }) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");
  
  useEffect(() => {
    const loadModules = () => {
      const allModules = vocabularyService.getAllModules();
      setModules(allModules);
      
      if (allModules.length > 0) {
        setSelectedModuleId(allModules[0].id.toString());
      }
    };
    
    loadModules();
  }, []);

  const handleModuleChange = (moduleId: string) => {
    setSelectedModuleId(moduleId);
  };

  const handleSelectMode = (mode: string) => {
    if (selectedModuleId) {
      onSelectMode(mode, parseInt(selectedModuleId));
    } else {
      onSelectMode(mode);
    }
  };
  
  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">FlashWordPlay</h1>
        <p className="text-gray-600">Select a learning mode to get started</p>
      </div>
      
      {modules.length > 0 && (
        <div className="w-full max-w-md mb-2">
          <Select 
            value={selectedModuleId} 
            onValueChange={handleModuleChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a module" />
            </SelectTrigger>
            <SelectContent>
              {modules.map(module => (
                <SelectItem key={module.id} value={module.id.toString()}>
                  {module.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
        <ModeTile
          title="Flashcards"
          description="Review vocabulary with interactive flashcards"
          icon={<Book size={24} className="text-app-blue" />}
          color="border-app-blue"
          onClick={() => handleSelectMode("flashcard")}
        />
        
        <ModeTile
          title="Multiple Choice"
          description="Test your knowledge with multiple choice questions"
          icon={<CheckSquare size={24} className="text-app-green" />}
          color="border-app-green"
          onClick={() => handleSelectMode("multiple-choice")}
        />
        
        <ModeTile
          title="Matching"
          description="Match words with their translations"
          icon={<Shuffle size={24} className="text-app-purple" />}
          color="border-app-purple"
          onClick={() => handleSelectMode("matching")}
        />
      </div>
      
      <Button 
        variant="outline" 
        className="mt-4 flex items-center gap-2"
        onClick={() => onSelectMode("folders")}
      >
        <FolderOpen size={16} />
        Manage Folders & Modules
      </Button>
    </div>
  );
};

export default LearningDashboard;
