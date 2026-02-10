'use client';

import { useState } from 'react';
import { Check, X, RotateCcw, Save, Share, Award, Clock } from 'lucide-react';
import { Quiz, Question } from '@/types/quiz';

interface QuizDisplayProps {
  quiz: Quiz;
  onStartOver: () => void;
}

export default function QuizDisplay({ quiz, onStartOver }: QuizDisplayProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleAnswerChange = (answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizCompleted(true);
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      const userAnswer = userAnswers[index]?.toLowerCase().trim();
      const correctAnswer = question.correctAnswer.toLowerCase().trim();
      
      if (question.type === 'multiple-choice') {
        if (userAnswer === correctAnswer) correct++;
      } else {
        // For fill-in-blank and short-answer, use simple string matching
        // In a real implementation, you'd want more sophisticated matching
        if (userAnswer === correctAnswer) correct++;
      }
    });
    return { correct, total: quiz.questions.length, percentage: (correct / quiz.questions.length) * 100 };
  };

  const score = showResults ? calculateScore() : null;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return 'Excellent work! 🎉';
    if (percentage >= 80) return 'Great job! 👏';
    if (percentage >= 70) return 'Good effort! 👍';
    if (percentage >= 60) return 'Not bad, keep practicing! 📚';
    return 'Keep studying and try again! 💪';
  };

  if (showResults && score) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Results Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white text-center">
            <Award className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-xl opacity-90">{getScoreMessage(score.percentage)}</p>
          </div>

          {/* Score Summary */}
          <div className="p-8">
            <div className="text-center mb-8">
              <div className={`text-6xl font-bold mb-2 ${getScoreColor(score.percentage)}`}>
                {score.percentage.toFixed(0)}%
              </div>
              <p className="text-xl text-muted-foreground">
                {score.correct} out of {score.total} correct
              </p>
            </div>

            {/* Detailed Results */}
            <div className="space-y-6 mb-8">
              <h3 className="text-2xl font-semibold text-center mb-6">Review Your Answers</h3>
              
              {quiz.questions.map((question, index) => {
                const userAnswer = userAnswers[index];
                const isCorrect = userAnswer?.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
                
                return (
                  <div key={index} className="border rounded-lg p-6 bg-white/50">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-lg flex-1">
                        Question {index + 1}: {question.question}
                      </h4>
                      {isCorrect ? (
                        <Check className="w-6 h-6 text-green-600 flex-shrink-0 ml-2" />
                      ) : (
                        <X className="w-6 h-6 text-red-600 flex-shrink-0 ml-2" />
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex gap-2">
                        <span className="font-medium text-muted-foreground">Your answer:</span>
                        <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                          {userAnswer || 'No answer provided'}
                        </span>
                      </div>
                      
                      {!isCorrect && (
                        <div className="flex gap-2">
                          <span className="font-medium text-muted-foreground">Correct answer:</span>
                          <span className="text-green-700">{question.correctAnswer}</span>
                        </div>
                      )}
                      
                      {question.explanation && (
                        <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                          <p className="text-blue-800">{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={onStartOver}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                Start Over
              </button>
              
              <button className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold rounded-xl shadow-lg transition-all">
                <Save className="w-5 h-5" />
                Save Quiz
              </button>
              
              <button className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold rounded-xl shadow-lg transition-all">
                <Share className="w-5 h-5" />
                Share Results
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        {/* Quiz Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{quiz.title}</h2>
            <div className="flex items-center gap-2 text-sm opacity-90">
              <Clock className="w-4 h-4" />
              <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Content */}
        <div className="p-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {currentQuestion.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
              </span>
            </div>
            
            <h3 className="text-2xl font-semibold mb-6 leading-relaxed">
              {currentQuestion.question}
            </h3>

            {/* Answer Input */}
            <div className="space-y-4">
              {currentQuestion.type === 'multiple-choice' && currentQuestion.options ? (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <label key={index} className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all">
                      <input
                        type="radio"
                        name={`question-${currentQuestionIndex}`}
                        value={option}
                        checked={userAnswers[currentQuestionIndex] === option}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="flex-1 text-lg">{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div>
                  <textarea
                    value={userAnswers[currentQuestionIndex] || ''}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder={currentQuestion.type === 'fill-in-blank' 
                      ? 'Type your answer...' 
                      : 'Write your short answer here...'
                    }
                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none text-lg"
                    rows={currentQuestion.type === 'short-answer' ? 4 : 2}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold rounded-xl transition-colors"
            >
              Previous
            </button>

            <div className="flex gap-2">
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    index === currentQuestionIndex
                      ? 'bg-blue-600 text-white'
                      : userAnswers[index]
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!userAnswers[currentQuestionIndex]}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all"
            >
              {currentQuestionIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}