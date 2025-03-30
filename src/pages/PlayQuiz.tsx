
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Award, Clock, AlertCircle } from "lucide-react";
import { 
  getQuizSession, 
  addParticipant, 
  submitAnswer, 
  QuizQuestion, 
  getLeaderboard 
} from "@/services/api";

const PlayQuiz = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [playerName, setPlayerName] = useState("");
  const [participantId, setParticipantId] = useState("");
  const [quizSession, setQuizSession] = useState<{
    id: string;
    title: string;
    questions: QuizQuestion[];
  } | null>(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [rank, setRank] = useState(0);
  const [leaderboard, setLeaderboard] = useState<{ id: string; name: string; score: number }[]>([]);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve player name from localStorage (set on the JoinQuiz page)
    const storedName = localStorage.getItem("playerName");
    if (storedName) {
      setPlayerName(storedName);
    }

    if (!sessionId) return;

    // Get quiz session data
    const session = getQuizSession(sessionId);
    if (session) {
      setQuizSession({
        id: session.id,
        title: session.title,
        questions: session.questions,
      });
      
      // Join the quiz as a participant
      if (storedName) {
        const participant = addParticipant(sessionId, storedName);
        if (participant) {
          setParticipantId(participant.id);
        }
      }
    } else {
      toast({
        title: "Quiz not found",
        description: "The quiz session could not be found.",
        variant: "destructive",
      });
      navigate("/join");
    }
  }, [sessionId, toast, navigate]);

  useEffect(() => {
    if (isQuizComplete && quizSession) {
      // Update leaderboard when quiz is complete
      const leaderboardData = getLeaderboard(quizSession.id);
      setLeaderboard(leaderboardData);
      
      // Find player's rank
      const playerRank = leaderboardData.findIndex(player => player.id === participantId) + 1;
      setRank(playerRank);
    }
  }, [isQuizComplete, quizSession, participantId]);

  useEffect(() => {
    if (!quizSession || isQuizComplete) return;
    
    // In a real app, this would be replaced with a server-side timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleNextQuestion();
          return 30;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentQuestionIndex, quizSession, isQuizComplete]);

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleSubmitAnswer = () => {
    if (!quizSession || !participantId || !selectedAnswer) return;
    
    const currentQuestion = quizSession.questions[currentQuestionIndex];
    
    // Submit the answer
    submitAnswer(quizSession.id, participantId, currentQuestion.id, selectedAnswer);
    
    // Track which questions have been answered
    setAnsweredQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: selectedAnswer,
    }));
    
    // Update local score for display
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
    
    // Go to next question
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    if (!quizSession) return;
    
    if (currentQuestionIndex < quizSession.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
      setTimeLeft(30);
    } else {
      // Quiz is complete
      setIsQuizComplete(true);
    }
  };

  const currentQuestion = quizSession?.questions[currentQuestionIndex];
  const progress = quizSession?.questions.length 
    ? ((currentQuestionIndex + 1) / quizSession.questions.length) * 100 
    : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {!quizSession ? (
        <div className="text-center py-16">
          <Award className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-2">Loading Quiz...</h2>
          <p className="text-muted-foreground mb-8">
            Please wait while we load the quiz session.
          </p>
        </div>
      ) : isQuizComplete ? (
        <Card className="p-8 text-center">
          <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-muted-foreground mb-6">
            You scored {score} out of {quizSession.questions.length} questions correctly.
          </p>
          
          {rank > 0 && (
            <div className="bg-muted p-4 rounded-md mb-6">
              <p className="text-lg font-medium">
                Your Rank: <span className="text-primary font-bold">{rank}{getRankSuffix(rank)}</span> Place
              </p>
            </div>
          )}
          
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold mb-2">Leaderboard</h3>
            
            {leaderboard.slice(0, 5).map((player, index) => (
              <div 
                key={player.id} 
                className={`flex items-center justify-between bg-card border rounded-lg p-4
                  ${player.id === participantId ? 'border-primary' : ''}`}
              >
                <div className="flex items-center">
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 font-bold
                    ${index === 0 ? 'bg-yellow-100 text-yellow-800' : 
                      index === 1 ? 'bg-gray-100 text-gray-800' : 
                      index === 2 ? 'bg-amber-100 text-amber-800' : 'bg-muted text-muted-foreground'}`}
                  >
                    {index + 1}
                  </span>
                  <span className="font-medium">{player.name}</span>
                </div>
                <span className="text-lg font-bold">{player.score}</span>
              </div>
            ))}
          </div>
          
          <Button onClick={() => navigate("/join")}>
            Join Another Quiz
          </Button>
        </Card>
      ) : currentQuestion ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">{quizSession.title}</h1>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {quizSession.questions.length}
              </p>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-muted-foreground mr-1" />
              <span className={`font-bold ${timeLeft <= 5 ? 'text-red-500' : ''}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
          
          <Progress value={progress} className="mb-2" />
          
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-6">{currentQuestion.question}</h2>
              
              <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
            >
              Submit Answer
            </Button>
          </Card>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              <span className="font-medium">Score:</span> {score}/{currentQuestionIndex}
            </div>
            <div>
              <span className="font-medium">Player:</span> {playerName}
            </div>
          </div>
        </div>
      ) : (
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Questions Available</h2>
          <p className="text-muted-foreground mb-6">
            This quiz doesn't have any questions or the host hasn't started the quiz yet.
          </p>
          <Button onClick={() => navigate("/join")}>
            Go Back
          </Button>
        </Card>
      )}
    </div>
  );
};

// Helper function for rank suffixes (1st, 2nd, 3rd, etc.)
const getRankSuffix = (rank: number): string => {
  if (rank === 1) return "st";
  if (rank === 2) return "nd";
  if (rank === 3) return "rd";
  return "th";
};

export default PlayQuiz;
