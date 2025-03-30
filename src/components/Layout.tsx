import { ReactNode, useEffect, useState } from "react";
import { NavBar } from "./ui/tubelight-navbar";
import { useLocation } from "react-router-dom";
import { BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="w-full py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <BrainCircuit className="h-8 w-8 text-primary mr-2" />
          <span className="text-2xl font-bold text-foreground">
            LearnFlow.ai
          </span>
        </motion.div>
      </header>
      
      <main className="flex-grow pt-4 pb-24 sm:pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      
      <NavBar items={[
        { name: 'Home', url: '/', icon: BrainCircuit },
        { name: 'Flashcards', url: '/flashcards', icon: BookOpen },
        { name: 'Quizzes', url: '/quizzes', icon: Award },
        { name: 'Flowcharts', url: '/flowcharts', icon: Activity },
        { name: 'Join', url: '/join', icon: Share2 },
      ]} />
      
      <footer className="bg-muted/30 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LearnFlow.ai. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
