
import React, { useState } from "react";
import LearningDashboard from "../components/LearningDashboard";
import FlashcardMode from "../components/FlashcardMode";
import MultipleChoiceMode from "../components/MultipleChoiceMode";
import MatchingMode from "../components/MatchingMode";
import FolderManagement from "../components/FolderManagement";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Book, FolderOpen } from "lucide-react";

const Index = () => {
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<number | undefined>();

  const handleSelectMode = (mode: string, moduleId?: number) => {
    setActiveMode(mode);
    if (moduleId) {
      setSelectedModuleId(moduleId);
    }
  };

  const handleBackToDashboard = () => {
    setActiveMode(null);
    setSelectedModuleId(undefined);
  };

  const renderActiveMode = () => {
    switch (activeMode) {
      case "flashcard":
        return <FlashcardMode selectedModuleId={selectedModuleId} />;
      case "multiple-choice":
        return <MultipleChoiceMode />;
      case "matching":
        return <MatchingMode />;
      case "folders":
        return <FolderManagement />;
      default:
        return (
          <Tabs defaultValue="dashboard">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <Book size={16} />
                Learning Modes
              </TabsTrigger>
              <TabsTrigger value="folders" className="flex items-center gap-2">
                <FolderOpen size={16} />
                Modules & Folders
              </TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
              <LearningDashboard onSelectMode={handleSelectMode} />
            </TabsContent>
            <TabsContent value="folders">
              <FolderManagement />
            </TabsContent>
          </Tabs>
        );
    }
  };

  return (
    <div className="min-h-screen bg-app-light-gray">
      <div className="container mx-auto px-4 py-8">
        {activeMode && activeMode !== "folders" && (
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
