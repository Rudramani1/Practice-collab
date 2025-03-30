
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Brain, Share2, Edit, Award } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  QuizQuestion, 
  createQuizSession, 
  generateQuiz 
} from "@/services/api";

const Quizzes = () => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [activeTab, setActiveTab] = useState("text");
  const [quizCreated, setQuizCreated] = useState(false);
  const [quizSessionId, setQuizSessionId] = useState("");
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGenerateQuiz = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some text to generate a quiz.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingQuiz(true);

    try {
      const generatedQuestions = await generateQuiz(inputText, numQuestions);
      setQuestions(generatedQuestions);
      
      toast({
        title: "Quiz generation complete",
        description: `Generated ${generatedQuestions.length} questions successfully.`,
      });
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast({
        title: "Quiz generation failed",
        description: "There was an error generating your quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleCreateQuiz = () => {
    if (!quizTitle.trim()) {
      toast({
        title: "Quiz title required",
        description: "Please enter a title for your quiz.",
        variant: "destructive",
      });
      return;
    }

    if (questions.length === 0) {
      toast({
        title: "No questions",
        description: "Please generate questions for your quiz first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create the quiz session
      const session = createQuizSession(quizTitle, questions);
      setQuizSessionId(session.id);
      setQuizCreated(true);
      
      toast({
        title: "Quiz created successfully",
        description: "Your quiz is ready to share with others!",
      });
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast({
        title: "Quiz creation failed",
        description: "There was an error creating your quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinQuiz = () => {
    if (quizSessionId) {
      navigate(`/host/${quizSessionId}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Create Interactive Quizzes</h1>
        <p className="text-muted-foreground">
          Generate engaging quizzes from any content and share them with others.
        </p>
      </div>

      {!quizCreated ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Quiz Content</h2>
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
                        placeholder="Paste your text here to generate quiz questions..."
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
                  <Label htmlFor="quiz-title">Quiz Title</Label>
                  <Input
                    id="quiz-title"
                    placeholder="Enter a title for your quiz"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="num-questions">Number of Questions</Label>
                  <Input
                    id="num-questions"
                    type="number"
                    min={1}
                    max={20}
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(parseInt(e.target.value) || 5)}
                  />
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <Button
                  onClick={handleGenerateQuiz}
                  disabled={isGeneratingQuiz || !inputText.trim()}
                  className="w-full"
                  variant="outline"
                >
                  {isGeneratingQuiz ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Generate Quiz Questions
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={handleCreateQuiz}
                  disabled={isLoading || questions.length === 0 || !quizTitle.trim()}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Quiz...
                    </>
                  ) : (
                    <>
                      <Award className="mr-2 h-4 w-4" />
                      Create Quiz
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Questions Preview Section */}
          <div>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Quiz Questions</h2>
                {questions.length > 0 && (
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
              
              <Separator className="mb-4" />
              
              <div className="space-y-6 overflow-auto max-h-[600px] pr-2">
                {questions.length === 0 ? (
                  <div className="text-center py-16">
                    <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Your quiz questions will appear here after generation.
                    </p>
                  </div>
                ) : (
                  questions.map((question, index) => (
                    <div key={question.id} className="bg-card border rounded-lg p-4 shadow-sm">
                      <div className="flex items-start mb-3">
                        <span className="bg-primary/10 text-primary font-medium rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0">
                          {index + 1}
                        </span>
                        <h3 className="font-medium">{question.question}</h3>
                      </div>
                      
                      <RadioGroup className="pl-9">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className={`flex items-center space-x-2 rounded-md p-2 ${option === question.correctAnswer ? 'bg-green-50 border border-green-100' : ''}`}>
                            <RadioGroupItem value={option} id={`option-${index}-${optIndex}`} />
                            <Label htmlFor={`option-${index}-${optIndex}`} className="flex-grow">
                              {option}
                            </Label>
                            {option === question.correctAnswer && (
                              <span className="text-xs font-medium text-green-600 px-2 py-0.5 rounded-full bg-green-100">
                                Correct
                              </span>
                            )}
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="p-8 max-w-2xl mx-auto text-center animate-slide-in">
          <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Quiz Created Successfully!</h2>
          <p className="text-muted-foreground mb-6">
            Your quiz "{quizTitle}" with {questions.length} questions is ready to be shared.
          </p>
          
          <div className="bg-muted p-4 rounded-md mb-6 flex items-center justify-between">
            <code className="text-sm font-mono">quiznect.com/join/{quizSessionId}</code>
            <Button variant="outline" size="sm" onClick={() => {
              navigator.clipboard.writeText(`quiznect.com/join/${quizSessionId}`);
              toast({
                title: "Link copied",
                description: "Quiz link copied to clipboard!",
              });
            }}>
              Copy
            </Button>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Button onClick={handleJoinQuiz}>
              <Share2 className="mr-2 h-4 w-4" />
              Host This Quiz
            </Button>
            <Button variant="outline" onClick={() => setQuizCreated(false)}>
              Create Another Quiz
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Quizzes;
