
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Loader2, GitBranch, Share2, Download, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import MermaidRenderer from "@/components/MermaidRenderer";
import { FlowchartData, generateFlowchart, saveFlowchart } from "@/services/flowchartService";

const Flowcharts = () => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("text");
  const [flowchartTitle, setFlowchartTitle] = useState("");
  const [flowchartData, setFlowchartData] = useState<FlowchartData | null>(null);
  
  const { toast } = useToast();

  const handleGenerateFlowchart = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some text to generate a flowchart.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const generatedFlowchart = await generateFlowchart(inputText);
      setFlowchartData(generatedFlowchart);
      setFlowchartTitle(generatedFlowchart.title);
      
      // Save the flowchart
      saveFlowchart(generatedFlowchart);
      
      toast({
        title: "Flowchart generation complete",
        description: "Your flowchart has been generated successfully.",
      });
    } catch (error) {
      console.error("Error generating flowchart:", error);
      toast({
        title: "Flowchart generation failed",
        description: "There was an error generating your flowchart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMermaidCode = () => {
    if (flowchartData) {
      navigator.clipboard.writeText(flowchartData.mermaidCode);
      toast({
        title: "Code copied",
        description: "Mermaid code has been copied to clipboard.",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Interactive Flowcharts</h1>
        <p className="text-muted-foreground">
          Generate visual flowcharts from any content to visualize relationships and hierarchies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Flowchart Content</h2>
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
                      placeholder="Paste your text here to generate a flowchart..."
                      className="h-40 resize-none"
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
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="flowchart-title">Flowchart Title</Label>
                <Input
                  id="flowchart-title"
                  placeholder="Enter a title for your flowchart"
                  value={flowchartTitle}
                  onChange={(e) => setFlowchartTitle(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mt-6">
              <Button
                onClick={handleGenerateFlowchart}
                disabled={isLoading || !inputText.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Flowchart...
                  </>
                ) : (
                  <>
                    <GitBranch className="mr-2 h-4 w-4" />
                    Generate Flowchart
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Flowchart Preview Section */}
        <div>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Flowchart Preview</h2>
              {flowchartData && (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleCopyMermaidCode}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              )}
            </div>
            
            <Separator className="mb-4" />
            
            <div className="bg-card border rounded-lg p-4 min-h-[400px] flex items-center justify-center">
              {!flowchartData ? (
                <div className="text-center">
                  <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Your flowchart will appear here after generation.
                  </p>
                </div>
              ) : (
                <div className="w-full">
                  <h3 className="text-lg font-medium mb-4 text-center">{flowchartData.title}</h3>
                  <MermaidRenderer 
                    chart={flowchartData.mermaidCode} 
                    className="w-full max-h-[500px] overflow-auto" 
                  />
                </div>
              )}
            </div>
            
            {flowchartData && (
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Mermaid Code</h3>
                  <Button variant="ghost" size="sm" onClick={handleCopyMermaidCode}>
                    <Copy className="h-3 w-3 mr-2" /> Copy
                  </Button>
                </div>
                <pre className="bg-muted p-4 rounded-md text-xs overflow-auto mt-2 max-h-[150px]">
                  <code>{flowchartData.mermaidCode}</code>
                </pre>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Flowcharts;
