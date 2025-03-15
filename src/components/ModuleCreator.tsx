
import React, { useState, useRef } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash, Upload, Image } from "lucide-react";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { vocabularyService } from "../services/VocabularyService";

interface WordEntry {
  id: number;
  word: string;
  translation: string;
  example: string;
}

interface ModuleCreatorProps {
  folderId: number;
  onModuleCreated: () => void;
  onCancel: () => void;
}

const ModuleCreator: React.FC<ModuleCreatorProps> = ({
  folderId,
  onModuleCreated,
  onCancel
}) => {
  const [words, setWords] = useState<WordEntry[]>([
    { id: 1, word: "", translation: "", example: "" },
    { id: 2, word: "", translation: "", example: "" }
  ]);
  const [moduleName, setModuleName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddWord = () => {
    const newWordId = words.length > 0 ? Math.max(...words.map(w => w.id)) + 1 : 1;
    setWords([...words, { id: newWordId, word: "", translation: "", example: "" }]);
  };

  const handleRemoveWord = (id: number) => {
    if (words.length <= 1) {
      toast.error("A module must have at least one word");
      return;
    }
    setWords(words.filter(word => word.id !== id));
  };

  const handleWordChange = (id: number, field: keyof Omit<WordEntry, "id">, value: string) => {
    setWords(words.map(word => {
      if (word.id === id) {
        return { ...word, [field]: value };
      }
      return word;
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        parseFileContent(content);
      } catch (error) {
        toast.error("Failed to parse file. Please check the format.");
      }
    };
    reader.readAsText(file);
  };

  const parseFileContent = (content: string) => {
    // Expecting format: word,translation,example
    // Each line is a new word entry
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      toast.error("No valid entries found in the file");
      return;
    }

    const parsedWords: WordEntry[] = lines.map((line, index) => {
      const parts = line.split(',').map(part => part.trim());
      return {
        id: index + 1,
        word: parts[0] || "",
        translation: parts[1] || "",
        example: parts[2] || ""
      };
    });

    setWords(parsedWords);
    toast.success(`Imported ${parsedWords.length} words from file`);
  };

  const handleSubmit = () => {
    if (!moduleName.trim()) {
      toast.error("Please enter a module name");
      return;
    }

    const validWords = words.filter(word => word.word.trim() && word.translation.trim());
    if (validWords.length === 0) {
      toast.error("Please add at least one valid word with translation");
      return;
    }

    // Create the module
    const newModule = vocabularyService.createModule(folderId, moduleName);
    if (!newModule) {
      toast.error("Failed to create module");
      return;
    }

    // Add all words to the module
    validWords.forEach(word => {
      vocabularyService.addWordToModule(newModule.id, {
        word: word.word,
        translation: word.translation,
        example: word.example
      });
    });

    toast.success("Module created successfully");
    onModuleCreated();
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Tạo một học phần mới</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="module-name">Tên học phần</Label>
            <Input 
              id="module-name"
              placeholder="Nhập tên học phần" 
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Từ vựng</h3>
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                accept=".txt,.csv"
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button 
                variant="outline" 
                onClick={triggerFileUpload}
                className="flex items-center gap-2"
              >
                <Upload size={16} />
                Tải từ file
              </Button>
              <Button 
                variant="default" 
                onClick={handleAddWord}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Thêm từ
              </Button>
            </div>
          </div>

          <div className="space-y-4 mt-4">
            {words.map((word, index) => (
              <Card key={word.id} className="border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-lg">{index + 1}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveWord(word.id)}
                      className="h-8 w-8"
                    >
                      <Trash size={16} className="text-red-500" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`word-${word.id}`}>Thuật ngữ</Label>
                      <Input
                        id={`word-${word.id}`}
                        placeholder="Nhập từ"
                        value={word.word}
                        onChange={(e) => handleWordChange(word.id, "word", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`translation-${word.id}`}>Định nghĩa</Label>
                      <Input
                        id={`translation-${word.id}`}
                        placeholder="Nhập nghĩa"
                        value={word.translation}
                        onChange={(e) => handleWordChange(word.id, "translation", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`example-${word.id}`}>Ví dụ (tùy chọn)</Label>
                      <Input
                        id={`example-${word.id}`}
                        placeholder="Nhập ví dụ sử dụng"
                        value={word.example}
                        onChange={(e) => handleWordChange(word.id, "example", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Hình ảnh (tùy chọn)</Label>
                      <div className="border border-dashed rounded-md p-4 flex items-center justify-center">
                        <Button variant="outline" className="flex flex-col gap-2 h-auto py-4">
                          <Image size={24} />
                          <span>Thêm hình ảnh</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Hủy</Button>
        <Button onClick={handleSubmit}>Tạo</Button>
        <Button className="bg-app-blue text-white">Tạo và ôn tập</Button>
      </CardFooter>
    </Card>
  );
};

export default ModuleCreator;
