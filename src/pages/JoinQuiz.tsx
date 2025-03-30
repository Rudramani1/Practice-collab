
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Users, ArrowRight } from "lucide-react";

const JoinQuiz = () => {
  const [quizCode, setQuizCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleJoinQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quizCode.trim()) {
      toast({
        title: "Quiz code required",
        description: "Please enter a valid quiz code to join.",
        variant: "destructive",
      });
      return;
    }

    if (!playerName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to join the quiz.",
        variant: "destructive",
      });
      return;
    }

    setIsJoining(true);

    try {
      // In a real implementation, we would verify the session exists here
      
      // For now, just simulate a delay and redirect
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store player name in local storage so it's available on the game page
      localStorage.setItem("playerName", playerName);
      
      // Redirect to the game page
      navigate(`/play/${quizCode}`);
    } catch (error) {
      console.error("Error joining quiz:", error);
      toast({
        title: "Failed to join quiz",
        description: "The quiz code may be invalid or the session has ended.",
        variant: "destructive",
      });
      setIsJoining(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <Card className="p-8">
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Join a Quiz Session</h1>
          <p className="text-muted-foreground">
            Enter the quiz code and your name to join a live quiz session.
          </p>
        </div>

        <form onSubmit={handleJoinQuiz} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="quiz-code">Quiz Code</Label>
            <Input
              id="quiz-code"
              placeholder="Enter the quiz code (e.g., session-1234567890)"
              value={quizCode}
              onChange={(e) => setQuizCode(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="player-name">Your Name</Label>
            <Input
              id="player-name"
              placeholder="Enter your display name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isJoining}>
            {isJoining ? (
              "Joining..."
            ) : (
              <>
                Join Quiz <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
        
        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Want to create your own quiz?
          </p>
          <Button variant="outline" onClick={() => navigate("/quizzes")}>
            Create a Quiz
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default JoinQuiz;
