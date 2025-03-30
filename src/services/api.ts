// API keys (in production these should be secured in environment variables or server-side)
export const GEMINI_API_KEY = "AIzaSyB7RRqKHgGHD2AGPp2mht81ZTbeO--Nb2M";
export const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
export const RAPID_API_KEY = "88e9d73b57msh9982c178daafdb7p1d1688jsn6d4186f6ca5a";

export interface FlashcardItem {
  id: string;
  question: string;
  answer: string;
}

export interface NotesItem {
  id: string;
  title: string;
  content: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizSession {
  id: string;
  title: string;
  questions: QuizQuestion[];
  participants: Participant[];
  createdAt: Date;
}

export interface Participant {
  id: string;
  name: string;
  score: number;
  answers: Record<string, string>;
}

// Function to generate flashcards from text
export const generateFlashcards = async (text: string): Promise<FlashcardItem[]> => {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Generate 5 flashcards based on the following content. Format your response as a JSON array of objects with "question" and "answer" keys. Keep questions focused and concise. Keep answers brief but comprehensive. Text: ${text}`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate flashcards");
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Parse the JSON from the response text
    const jsonStart = generatedText.indexOf('[');
    const jsonEnd = generatedText.lastIndexOf(']') + 1;
    const jsonStr = generatedText.substring(jsonStart, jsonEnd);
    
    const flashcards = JSON.parse(jsonStr);
    
    // Add unique IDs to each flashcard
    return flashcards.map((card: any, index: number) => ({
      id: `card-${Date.now()}-${index}`,
      question: card.question,
      answer: card.answer,
    }));
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw error;
  }
};

// Function to generate study notes from text
export const generateNotes = async (text: string): Promise<NotesItem[]> => {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Create concise summary notes based on the following content. Format your response as a JSON array of objects with "title" and "content" keys. Break down the content into 3-5 main topics or concepts. Each note should be brief but informative. Text: ${text}`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate notes");
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Parse the JSON from the response text
    const jsonStart = generatedText.indexOf('[');
    const jsonEnd = generatedText.lastIndexOf(']') + 1;
    const jsonStr = generatedText.substring(jsonStart, jsonEnd);
    
    const notes = JSON.parse(jsonStr);
    
    // Add unique IDs to each note
    return notes.map((note: any, index: number) => ({
      id: `note-${Date.now()}-${index}`,
      title: note.title,
      content: note.content,
    }));
  } catch (error) {
    console.error("Error generating notes:", error);
    throw error;
  }
};

// Function to generate quiz questions from text
export const generateQuiz = async (text: string, numQuestions: number = 5): Promise<QuizQuestion[]> => {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Generate ${numQuestions} multiple-choice quiz questions based on the following content. Format your response as a JSON array of objects with "question", "options" (array of 4 choices), and "correctAnswer" keys. Make sure options are distinct and only one is correct. Text: ${text}`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate quiz");
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Parse the JSON from the response text
    const jsonStart = generatedText.indexOf('[');
    const jsonEnd = generatedText.lastIndexOf(']') + 1;
    const jsonStr = generatedText.substring(jsonStart, jsonEnd);
    
    const questions = JSON.parse(jsonStr);
    
    // Add unique IDs to each question
    return questions.map((q: any, index: number) => ({
      id: `quiz-${Date.now()}-${index}`,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
    }));
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};

// Mock database of quiz sessions
let quizSessions: QuizSession[] = [];

// Create a new quiz session
export const createQuizSession = (title: string, questions: QuizQuestion[]): QuizSession => {
  const session: QuizSession = {
    id: `session-${Date.now()}`,
    title,
    questions,
    participants: [],
    createdAt: new Date(),
  };
  
  quizSessions.push(session);
  return session;
};

// Get a quiz session by ID
export const getQuizSession = (id: string): QuizSession | undefined => {
  return quizSessions.find(session => session.id === id);
};

// Add a participant to a quiz session
export const addParticipant = (sessionId: string, name: string): Participant | null => {
  const session = getQuizSession(sessionId);
  if (!session) return null;
  
  const participant: Participant = {
    id: `participant-${Date.now()}`,
    name,
    score: 0,
    answers: {},
  };
  
  session.participants.push(participant);
  return participant;
};

// Submit an answer for a participant
export const submitAnswer = (
  sessionId: string, 
  participantId: string, 
  questionId: string, 
  answer: string
): boolean => {
  const session = getQuizSession(sessionId);
  if (!session) return false;
  
  const participant = session.participants.find(p => p.id === participantId);
  if (!participant) return false;
  
  const question = session.questions.find(q => q.id === questionId);
  if (!question) return false;
  
  // Save the answer
  participant.answers[questionId] = answer;
  
  // Update score if correct
  if (answer === question.correctAnswer) {
    participant.score += 1;
  }
  
  return true;
};

// Get leaderboard for a session
export const getLeaderboard = (sessionId: string): Participant[] => {
  const session = getQuizSession(sessionId);
  if (!session) return [];
  
  return [...session.participants].sort((a, b) => b.score - a.score);
};
