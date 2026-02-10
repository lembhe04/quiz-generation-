'use client';

import { useState, useEffect } from 'react';
import { Loader2, Settings, ArrowLeft, Zap, Target, BookOpen } from 'lucide-react';
import { Quiz } from '@/types/quiz';
import { generateQuiz } from '@/lib/quizGenerator';

interface QuizGeneratorProps {
  inputText: string;
  onQuizGenerated: (quiz: Quiz) => void;
  onGenerateClick: () => void;
  isGenerating: boolean;
  onStartOver: () => void;
}

export default function QuizGenerator({ 
  inputText, 
  onQuizGenerated, 
  onGenerateClick, 
  isGenerating,
  onStartOver 
}: QuizGeneratorProps) {
  const [settings, setSettings] = useState({
    numQuestions: 5,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    questionTypes: {
      fillInBlank: true,
      multipleChoice: true,
      shortAnswer: true
    }
  });

  const [generationStep, setGenerationStep] = useState(0);
  const steps = [
    'Analyzing text...',
    'Extracting key concepts...',
    'Identifying entities...',
    'Generating questions...',
    'Finalizing quiz...'
  ];

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setGenerationStep(prev => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            // Simulate quiz generation completion
            setTimeout(() => {
              const quiz = generateQuiz(inputText, settings);
              onQuizGenerated(quiz);
            }, 1000);
            return prev;
          }
        });
      }, 800);

      return () => clearInterval(interval);
    }
  }, [isGenerating, inputText, settings, onQuizGenerated]);

  const handleGenerate = () => {
    onGenerateClick();
    setGenerationStep(0);
  };

  const wordCount = inputText.split(' ').length;
  const estimatedTime = Math.ceil(wordCount / 200); // Reading time estimation

  if (isGenerating) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center">
          <div className="mb-8">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Generating Your Quiz</h2>
            <p className="text-muted-foreground">
              Using advanced NLP to create engaging questions...
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                  index < generationStep 
                    ? 'bg-green-100 text-green-600' 
                    : index === generationStep
                    ? 'bg-blue-100 text-blue-600 animate-pulse'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {index < generationStep ? '✓' : index + 1}
                </div>
                <span className={`text-left ${
                  index <= generationStep ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              Processing {wordCount} words • Estimated {estimatedTime} minute read
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Quiz Configuration</h2>
              <p className="opacity-90">Customize your quiz settings before generation</p>
            </div>
            <button
              onClick={onStartOver}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Text Preview */}
          <div className="mb-8 p-6 bg-gray-50 rounded-xl border">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Text Preview
            </h3>
            <div className="text-sm text-muted-foreground mb-2">
              {wordCount} words • ~{estimatedTime} minute read
            </div>
            <p className="text-gray-700 line-clamp-3 leading-relaxed">
              {inputText.substring(0, 300)}
              {inputText.length > 300 && '...'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Quiz Settings */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                Quiz Settings
              </h3>

              {/* Number of Questions */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Number of Questions
                </label>
                <div className="flex space-x-2">
                  {[3, 5, 8, 10].map(num => (
                    <button
                      key={num}
                      onClick={() => setSettings(s => ({ ...s, numQuestions: num }))}
                      className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                        settings.numQuestions === num
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Difficulty Level
                </label>
                <div className="flex space-x-2">
                  {[
                    { value: 'easy', label: 'Easy', icon: '🟢' },
                    { value: 'medium', label: 'Medium', icon: '🟡' },
                    { value: 'hard', label: 'Hard', icon: '🔴' }
                  ].map(difficulty => (
                    <button
                      key={difficulty.value}
                      onClick={() => setSettings(s => ({ ...s, difficulty: difficulty.value as any }))}
                      className={`px-4 py-2 rounded-lg border font-medium transition-colors flex items-center gap-2 ${
                        settings.difficulty === difficulty.value
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span>{difficulty.icon}</span>
                      {difficulty.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Question Types */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                Question Types
              </h3>

              <div className="space-y-4">
                {[
                  {
                    key: 'fillInBlank',
                    label: 'Fill in the Blank',
                    description: 'Complete sentences with missing words',
                    icon: '📝'
                  },
                  {
                    key: 'multipleChoice',
                    label: 'Multiple Choice',
                    description: 'Choose the correct answer from options',
                    icon: '✅'
                  },
                  {
                    key: 'shortAnswer',
                    label: 'Short Answer',
                    description: 'Brief written responses',
                    icon: '💭'
                  }
                ].map(type => (
                  <label key={type.key} className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.questionTypes[type.key as keyof typeof settings.questionTypes]}
                      onChange={(e) => setSettings(s => ({
                        ...s,
                        questionTypes: {
                          ...s.questionTypes,
                          [type.key]: e.target.checked
                        }
                      }))}
                      className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        <span className="font-medium">{type.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleGenerate}
              disabled={!Object.values(settings.questionTypes).some(Boolean)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
            >
              <Zap className="w-5 h-5" />
              Generate Quiz
            </button>
            
            {!Object.values(settings.questionTypes).some(Boolean) && (
              <p className="text-sm text-red-600 mt-2">
                Please select at least one question type
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}