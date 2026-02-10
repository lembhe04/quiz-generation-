'use client';

import { BookOpen, Github, Settings } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-white/20 bg-white/10 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">QuizGen</h1>
              <p className="text-sm text-muted-foreground">AI-Powered Quiz Generator</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a 
              href="#features" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Features
            </a>
            <a 
              href="#library" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Quiz Library
            </a>
            <a 
              href="#about" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              About
            </a>
          </nav>

          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Github className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}