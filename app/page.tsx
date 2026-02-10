'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import TextInput from '@/components/TextInput';
import QuizGenerator from '@/components/QuizGenerator';
import QuizDisplay from '@/components/QuizDisplay';
import { Quiz } from '@/types/quiz';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [generatedQuiz, setGeneratedQuiz] = useState<Quiz | null>(null);
  const [currentStep, setCurrentStep] = useState<'input' | 'generate' | 'display'>('input');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTextSubmit = (text: string) => {
    setInputText(text);
    setCurrentStep('generate');
  };

  const handleQuizGenerated = (quiz: Quiz) => {
    setGeneratedQuiz(quiz);
    setCurrentStep('display');
    setIsGenerating(false);
  };

  const handleStartOver = () => {
    setInputText('');
    setGeneratedQuiz(null);
    setCurrentStep('input');
    setIsGenerating(false);
  };

  const handleGenerateClick = () => {
    setIsGenerating(true);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4 animate-fade-in">
            QuizGen
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Transform any text into engaging educational quizzes using advanced NLP techniques. 
            Perfect for teachers, students, and lifelong learners.
          </p>
        </div>

        <div className="grid gap-8">
          {currentStep === 'input' && (
            <div className="animate-slide-up">
              <TextInput onTextSubmit={handleTextSubmit} />
            </div>
          )}

          {currentStep === 'generate' && (
            <div className="animate-slide-up">
              <QuizGenerator
                inputText={inputText}
                onQuizGenerated={handleQuizGenerated}
                onGenerateClick={handleGenerateClick}
                isGenerating={isGenerating}
                onStartOver={handleStartOver}
              />
            </div>
          )}

          {currentStep === 'display' && generatedQuiz && (
            <div className="animate-slide-up">
              <QuizDisplay
                quiz={generatedQuiz}
                onStartOver={handleStartOver}
              />
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-20 animate-fade-in">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose QuizGen?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">Generate comprehensive quizzes in seconds using advanced NLP algorithms.</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Analysis</h3>
              <p className="text-muted-foreground">Intelligent keyword extraction and entity recognition for relevant questions.</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Multiple Formats</h3>
              <p className="text-muted-foreground">Create fill-in-the-blank, MCQ, and short-answer questions automatically.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}