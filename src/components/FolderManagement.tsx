
import React, { useState, useEffect } from "react";
import { 
  vocabularyService, 
  Folder, 
  Module, 
  Word 
} from "../services/VocabularyService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronDown,
  ChevronUp,
  Folder as FolderIcon,
  Book,
  Plus,
  Pencil,
  Trash,
  FileText
} from "lucide-react";
import { toast } from "sonner";

interface FormDialogProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  defaultValue?: string;
}

const FormDialog: React.FC<FormDialogProps> = ({
  title,
  description,
  isOpen,
  onClose,
  onSubmit,
  defaultValue = ""
}) => {
  const [name, setName] = useState(defaultValue);

  useEffect(() => {
    if (isOpen) {
      setName(defaultValue);
    }
  }, [isOpen, defaultValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={isOpen => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface WordFormDialogProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (word: Omit<Word, "id">) => void;
  defaultValues?: Omit<Word, "id">;
}

const WordFormDialog: React.FC<WordFormDialogProps> = ({
  title,
  description,
  isOpen,
  onClose,
  onSubmit,
  defaultValues = { word: "", translation: "", example: "" }
}) => {
  const [wordData, setWordData] = useState(defaultValues);

  useEffect(() => {
    if (isOpen) {
      setWordData(defaultValues);
    }
  }, [isOpen, defaultValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (wordData.word.trim() && wordData.translation.trim()) {
      onSubmit(wordData);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={isOpen => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="word" className="text-right">
                Word
              </label>
              <Input
                id="word"
                value={wordData.word}
                onChange={(e) => setWordData({...wordData, word: e.target.value})}
                className="col-span-3"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="translation" className="text-right">
                Translation
              </label>
              <Input
                id="translation"
                value={wordData.translation}
                onChange={(e) => setWordData({...wordData, translation: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="example" className="text-right">
                Example
              </label>
              <Textarea
                id="example"
                value={wordData.example}
                onChange={(e) => setWordData({...wordData, example: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const FolderManagement: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Record<number, boolean>>({});
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});
  
  // Form dialogs state
  const [folderDialog, setFolderDialog] = useState({ open: false, isEdit: false, currentId: 0, defaultValue: "" });
  const [moduleDialog, setModuleDialog] = useState({ open: false, isEdit: false, folderId: 0, currentId: 0, defaultValue: "" });
  const [wordDialog, setWordDialog] = useState({ 
    open: false, 
    isEdit: false, 
    moduleId: 0, 
    currentId: 0, 
    defaultValues: { word: "", translation: "", example: "" } 
  });

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = () => {
    const loadedFolders = vocabularyService.getAllFolders();
    setFolders(loadedFolders);
    
    // Initialize expanded state for folders
    const initialExpandedFolders: Record<number, boolean> = {};
    loadedFolders.forEach(folder => {
      initialExpandedFolders[folder.id] = false;
    });
    setExpandedFolders(initialExpandedFolders);
    
    // Initialize expanded state for modules
    const initialExpandedModules: Record<number, boolean> = {};
    loadedFolders.forEach(folder => {
      folder.modules.forEach(module => {
        initialExpandedModules[module.id] = false;
      });
    });
    setExpandedModules(initialExpandedModules);
  };

  const toggleFolder = (folderId: number) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Folder CRUD operations
  const handleAddFolder = () => {
    setFolderDialog({ open: true, isEdit: false, currentId: 0, defaultValue: "" });
  };

  const handleEditFolder = (folder: Folder) => {
    setFolderDialog({ 
      open: true, 
      isEdit: true, 
      currentId: folder.id, 
      defaultValue: folder.name 
    });
  };

  const handleDeleteFolder = (folderId: number) => {
    const isDeleted = vocabularyService.deleteFolder(folderId);
    if (isDeleted) {
      toast.success("Folder deleted successfully");
      loadFolders();
    } else {
      toast.error("Failed to delete folder");
    }
  };

  const submitFolderForm = (name: string) => {
    if (folderDialog.isEdit) {
      const updatedFolder = vocabularyService.updateFolder(folderDialog.currentId, name);
      if (updatedFolder) {
        toast.success("Folder updated successfully");
        loadFolders();
      } else {
        toast.error("Failed to update folder");
      }
    } else {
      const newFolder = vocabularyService.createFolder(name);
      toast.success("Folder created successfully");
      loadFolders();
    }
  };

  // Module CRUD operations
  const handleAddModule = (folderId: number) => {
    setModuleDialog({ 
      open: true, 
      isEdit: false, 
      folderId: folderId, 
      currentId: 0, 
      defaultValue: "" 
    });
  };

  const handleEditModule = (module: Module) => {
    setModuleDialog({ 
      open: true, 
      isEdit: true, 
      folderId: 0, // Not needed for edit
      currentId: module.id, 
      defaultValue: module.name 
    });
  };

  const handleDeleteModule = (moduleId: number) => {
    const isDeleted = vocabularyService.deleteModule(moduleId);
    if (isDeleted) {
      toast.success("Module deleted successfully");
      loadFolders();
    } else {
      toast.error("Failed to delete module");
    }
  };

  const submitModuleForm = (name: string) => {
    if (moduleDialog.isEdit) {
      const updatedModule = vocabularyService.updateModule(moduleDialog.currentId, name);
      if (updatedModule) {
        toast.success("Module updated successfully");
        loadFolders();
      } else {
        toast.error("Failed to update module");
      }
    } else {
      const newModule = vocabularyService.createModule(moduleDialog.folderId, name);
      if (newModule) {
        toast.success("Module created successfully");
        loadFolders();
      } else {
        toast.error("Failed to create module");
      }
    }
  };

  // Word CRUD operations
  const handleAddWord = (moduleId: number) => {
    setWordDialog({
      open: true,
      isEdit: false,
      moduleId: moduleId,
      currentId: 0,
      defaultValues: { word: "", translation: "", example: "" }
    });
  };

  const handleEditWord = (moduleId: number, word: Word) => {
    setWordDialog({
      open: true,
      isEdit: true,
      moduleId: moduleId,
      currentId: word.id,
      defaultValues: { 
        word: word.word, 
        translation: word.translation, 
        example: word.example 
      }
    });
  };

  const handleDeleteWord = (moduleId: number, wordId: number) => {
    const isDeleted = vocabularyService.deleteWordFromModule(moduleId, wordId);
    if (isDeleted) {
      toast.success("Word deleted successfully");
      loadFolders();
    } else {
      toast.error("Failed to delete word");
    }
  };

  const submitWordForm = (wordData: Omit<Word, "id">) => {
    if (wordDialog.isEdit) {
      const updatedWord = vocabularyService.updateWordInModule(
        wordDialog.moduleId, 
        wordDialog.currentId, 
        wordData
      );
      if (updatedWord) {
        toast.success("Word updated successfully");
        loadFolders();
      } else {
        toast.error("Failed to update word");
      }
    } else {
      const newWord = vocabularyService.addWordToModule(wordDialog.moduleId, wordData);
      if (newWord) {
        toast.success("Word added successfully");
        loadFolders();
      } else {
        toast.error("Failed to add word");
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Vocabulary Management</h2>
        <Button onClick={handleAddFolder} className="flex items-center gap-2">
          <Plus size={16} />
          Add Folder
        </Button>
      </div>

      {folders.length === 0 ? (
        <Card className="text-center p-6">
          <p>No folders found. Create a new folder to get started.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {folders.map(folder => (
            <Card key={folder.id} className="overflow-hidden">
              <div 
                className="p-4 border-b flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => toggleFolder(folder.id)}
              >
                <div className="flex items-center gap-2">
                  <FolderIcon size={20} className="text-app-blue" />
                  <span className="font-medium">{folder.name}</span>
                  <span className="text-gray-500 text-sm">({folder.modules.length} modules)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={(e) => {
                    e.stopPropagation();
                    handleAddModule(folder.id);
                  }}>
                    <Plus size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={(e) => {
                    e.stopPropagation();
                    handleEditFolder(folder);
                  }}>
                    <Pencil size={16} />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                        <Trash size={16} className="text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete folder</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this folder? This action cannot be undone.
                          All modules and words inside this folder will be deleted.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteFolder(folder.id)} className="bg-red-500 hover:bg-red-600">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  {expandedFolders[folder.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>
              {expandedFolders[folder.id] && (
                <div className="p-4 bg-gray-50">
                  {folder.modules.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No modules in this folder. Create a new module to get started.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {folder.modules.map(module => (
                        <Card key={module.id} className="border">
                          <Collapsible open={expandedModules[module.id]}>
                            <CollapsibleTrigger asChild>
                              <div className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded-t">
                                <div className="flex items-center gap-2">
                                  <Book size={18} className="text-app-green" />
                                  <span className="font-medium">{module.name}</span>
                                  <span className="text-gray-500 text-sm">({module.words.length} words)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="icon" onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddWord(module.id);
                                  }}>
                                    <Plus size={16} />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditModule(module);
                                  }}>
                                    <Pencil size={16} />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                        <Trash size={16} className="text-red-500" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete module</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete this module? This action cannot be undone.
                                          All words inside this module will be deleted.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteModule(module.id)} className="bg-red-500 hover:bg-red-600">
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                  {expandedModules[module.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </div>
                              </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              {module.words.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">
                                  No words in this module. Add a new word to get started.
                                </div>
                              ) : (
                                <div className="p-3">
                                  <div className="bg-gray-100 p-2 rounded">
                                    <div className="grid grid-cols-12 gap-2 font-medium text-sm text-gray-600 mb-1 px-2">
                                      <div className="col-span-3">Word</div>
                                      <div className="col-span-3">Translation</div>
                                      <div className="col-span-5">Example</div>
                                      <div className="col-span-1"></div>
                                    </div>
                                    {module.words.map(word => (
                                      <div key={word.id} className="grid grid-cols-12 gap-2 p-2 border-b last:border-0 hover:bg-gray-50 rounded text-sm">
                                        <div className="col-span-3 flex items-center gap-1">
                                          <FileText size={14} className="text-gray-400" />
                                          {word.word}
                                        </div>
                                        <div className="col-span-3 flex items-center">
                                          {word.translation}
                                        </div>
                                        <div className="col-span-5 text-gray-600 overflow-hidden text-ellipsis">
                                          {word.example}
                                        </div>
                                        <div className="col-span-1 flex justify-end gap-1">
                                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEditWord(module.id, word)}>
                                            <Pencil size={14} />
                                          </Button>
                                          <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                                <Trash size={14} className="text-red-500" />
                                              </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                              <AlertDialogHeader>
                                                <AlertDialogTitle>Delete word</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                  Are you sure you want to delete this word? This action cannot be undone.
                                                </AlertDialogDescription>
                                              </AlertDialogHeader>
                                              <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteWord(module.id, word.id)} className="bg-red-500 hover:bg-red-600">
                                                  Delete
                                                </AlertDialogAction>
                                              </AlertDialogFooter>
                                            </AlertDialogContent>
                                          </AlertDialog>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </CollapsibleContent>
                          </Collapsible>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Form Dialogs */}
      <FormDialog
        title={folderDialog.isEdit ? "Edit Folder" : "Add Folder"}
        description={folderDialog.isEdit ? "Edit the folder details below." : "Add a new folder for organizing vocabulary modules."}
        isOpen={folderDialog.open}
        onClose={() => setFolderDialog(prev => ({ ...prev, open: false }))}
        onSubmit={submitFolderForm}
        defaultValue={folderDialog.defaultValue}
      />

      <FormDialog
        title={moduleDialog.isEdit ? "Edit Module" : "Add Module"}
        description={moduleDialog.isEdit ? "Edit the module details below." : "Add a new module to this folder."}
        isOpen={moduleDialog.open}
        onClose={() => setModuleDialog(prev => ({ ...prev, open: false }))}
        onSubmit={submitModuleForm}
        defaultValue={moduleDialog.defaultValue}
      />

      <WordFormDialog
        title={wordDialog.isEdit ? "Edit Word" : "Add Word"}
        description={wordDialog.isEdit ? "Edit the word details below." : "Add a new vocabulary word to this module."}
        isOpen={wordDialog.open}
        onClose={() => setWordDialog(prev => ({ ...prev, open: false }))}
        onSubmit={submitWordForm}
        defaultValues={wordDialog.defaultValues}
      />
    </div>
  );
};

export default FolderManagement;
