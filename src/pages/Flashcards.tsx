
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCw, BookOpen, StickyNote, RotateCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { FlashcardItem, NotesItem, generateFlashcards, generateNotes } from "@/services/api";

const Flashcards = () => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>([]);
  const [notes, setNotes] = useState<NotesItem[]>([]);
  const [activeTab, setActiveTab] = useState("text");
  const [outputTab, setOutputTab] = useState("flashcards");
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some text to generate flashcards or notes.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const [flashcardsData, notesData] = await Promise.all([
        generateFlashcards(inputText),
        generateNotes(inputText),
      ]);

      setFlashcards(flashcardsData);
      setNotes(notesData);
      setOutputTab("flashcards");
      
      toast({
        title: "Generation complete",
        description: "Your flashcards and notes have been generated successfully.",
      });
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Generation failed",
        description: "There was an error generating your content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCardFlip = (cardId: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Flashcards & Study Notes</h1>
        <p className="text-muted-foreground">
          Generate interactive flashcards and concise study notes from any text or content.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Input Content</h2>
            <Tabs defaultValue="text" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="document">Document</TabsTrigger>
                <TabsTrigger value="youtube">YouTube</TabsTrigger>
              </TabsList>
              
              <TabsContent value="text">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="input-text">Enter your text</Label>
                    <Textarea
                      id="input-text"
                      placeholder="Paste your text here to generate flashcards and notes..."
                      className="h-56 resize-none"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="document">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="document-upload">Upload document (PDF, DOCX, TXT)</Label>
                    <Input
                      id="document-upload"
                      type="file"
                      accept=".pdf,.docx,.txt"
                      className="cursor-pointer"
                      disabled={isLoading}
                      onChange={() => toast({
                        title: "Coming soon",
                        description: "Document upload functionality will be available soon.",
                      })}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="youtube">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="youtube-url">YouTube Video URL</Label>
                    <Input
                      id="youtube-url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      disabled={isLoading}
                      onChange={() => toast({
                        title: "Coming soon",
                        description: "YouTube processing functionality will be available soon.",
                      })}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6">
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !inputText.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate Flashcards & Notes
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Output Section */}
        <div>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Learning Materials</h2>
              
              <div className="flex items-center space-x-1 bg-muted rounded-md">
                <Button
                  variant={outputTab === "flashcards" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setOutputTab("flashcards")}
                  className="rounded-r-none"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Flashcards
                </Button>
                <Button
                  variant={outputTab === "notes" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setOutputTab("notes")}
                  className="rounded-l-none"
                >
                  <StickyNote className="h-4 w-4 mr-2" />
                  Notes
                </Button>
              </div>
            </div>
            
            <Separator className="mb-4" />
            
            {outputTab === "flashcards" ? (
              <div className="space-y-4 overflow-auto max-h-[500px] pr-2">
                {flashcards.length === 0 ? (
                  <div className="text-center py-16">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Your flashcards will appear here after generation.
                    </p>
                  </div>
                ) : (
                  flashcards.map((card) => (
                    <div
                      key={card.id}
                      className={`flashcard cursor-pointer ${flippedCards[card.id] ? "flipped" : ""}`}
                      onClick={() => toggleCardFlip(card.id)}
                    >
                      <div className="flashcard-inner h-full relative">
                        <div className="flashcard-front bg-card border rounded-lg p-6 shadow-sm flex items-center justify-center min-h-[150px]">
                          <div>
                            <p className="font-medium text-center">{card.question}</p>
                            <div className="absolute bottom-2 right-2 text-muted-foreground">
                              <RotateCw className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                        <div className="flashcard-back bg-primary/5 border rounded-lg p-6 shadow-sm flex items-center justify-center absolute top-0 left-0 w-full h-full min-h-[150px]">
                          <div>
                            <p className="text-center">{card.answer}</p>
                            <div className="absolute bottom-2 right-2 text-muted-foreground">
                              <RotateCw className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4 overflow-auto max-h-[500px] pr-2">
                {notes.length === 0 ? (
                  <div className="text-center py-16">
                    <StickyNote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Your study notes will appear here after generation.
                    </p>
                  </div>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className="bg-card border rounded-lg p-6 shadow-sm">
                      <h3 className="font-semibold text-lg mb-2">{note.title}</h3>
                      <p className="text-muted-foreground whitespace-pre-line">{note.content}</p>
                    </div>
                  ))
                )}
              </div>
            )}
            
            {(flashcards.length > 0 || notes.length > 0) && (
              <div className="mt-4 pt-4 border-t flex justify-between">
                <Button variant="outline" size="sm" onClick={() => setFlippedCards({})}>
                  Reset Cards
                </Button>
                <Button variant="outline" size="sm">
                  Download
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Flashcards;
