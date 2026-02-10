import { Quiz, Question, QuizSettings } from '@/types/quiz';

// Simple keyword extraction using basic NLP techniques
function extractKeywords(text: string): string[] {
  // Common stop words to filter out
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after',
    'above', 'below', 'between', 'among', 'this', 'that', 'these', 'those', 'is',
    'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
    'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'shall'
  ]);

  // Split into words, clean, and filter
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));

  // Count frequency
  const wordCount: Record<string, number> = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  // Return top keywords
  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15)
    .map(([word]) => word);
}

// Extract sentences for fill-in-the-blank questions
function extractSentences(text: string): string[] {
  return text.split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 20 && s.length < 200)
    .slice(0, 10);
}

// Generate fill-in-the-blank question
function generateFillInBlank(text: string, keywords: string[], difficulty: string): Question | null {
  const sentences = extractSentences(text);
  
  for (const sentence of sentences) {
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      if (regex.test(sentence)) {
        const questionText = sentence.replace(regex, '_____');
        
        return {
          id: Math.random().toString(36).substr(2, 9),
          question: `Fill in the blank: ${questionText}`,
          type: 'fill-in-blank',
          correctAnswer: keyword,
          difficulty: difficulty as any,
          keywords: [keyword],
          explanation: `The correct answer is "${keyword}" based on the context of the sentence.`
        };
      }
    }
  }
  
  return null;
}

// Generate multiple choice question
function generateMultipleChoice(text: string, keywords: string[], difficulty: string): Question | null {
  const sentences = extractSentences(text);
  
  for (const sentence of sentences) {
    for (const keyword of keywords) {
      if (sentence.toLowerCase().includes(keyword.toLowerCase())) {
        // Create distractors (wrong answers)
        const allKeywords = keywords.filter(k => k !== keyword);
        const distractors = allKeywords
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        
        if (distractors.length >= 3) {
          const options = [keyword, ...distractors].sort(() => Math.random() - 0.5);
          
          return {
            id: Math.random().toString(36).substr(2, 9),
            question: `Based on the text, which term is most relevant to: "${sentence.substring(0, 80)}..."?`,
            type: 'multiple-choice',
            options,
            correctAnswer: keyword,
            difficulty: difficulty as any,
            keywords: [keyword],
            explanation: `"${keyword}" is the correct answer based on the context provided in the text.`
          };
        }
      }
    }
  }
  
  return null;
}

// Generate short answer question
function generateShortAnswer(text: string, keywords: string[], difficulty: string): Question | null {
  const sentences = extractSentences(text);
  const keyword = keywords[Math.floor(Math.random() * Math.min(keywords.length, 5))];
  
  const relevantSentences = sentences.filter(s => 
    s.toLowerCase().includes(keyword.toLowerCase())
  );
  
  if (relevantSentences.length > 0) {
    const questionTemplates = [
      `What is the significance of ${keyword} in the given context?`,
      `Explain the role of ${keyword} based on the text.`,
      `Define ${keyword} as described in the passage.`,
      `How does ${keyword} relate to the main topic discussed?`
    ];
    
    const question = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      question,
      type: 'short-answer',
      correctAnswer: `A brief explanation about ${keyword} based on the context provided.`,
      difficulty: difficulty as any,
      keywords: [keyword],
      explanation: `This question tests understanding of key concepts related to ${keyword}.`
    };
  }
  
  return null;
}

export function generateQuiz(inputText: string, settings: QuizSettings): Quiz {
  const keywords = extractKeywords(inputText);
  const questions: Question[] = [];
  
  // Calculate how many questions of each type to generate
  const enabledTypes = Object.entries(settings.questionTypes)
    .filter(([, enabled]) => enabled)
    .map(([type]) => type);
  
  const questionsPerType = Math.ceil(settings.numQuestions / enabledTypes.length);
  
  // Generate questions for each enabled type
  if (settings.questionTypes.fillInBlank) {
    for (let i = 0; i < questionsPerType && questions.length < settings.numQuestions; i++) {
      const question = generateFillInBlank(inputText, keywords, settings.difficulty);
      if (question) questions.push(question);
    }
  }
  
  if (settings.questionTypes.multipleChoice) {
    for (let i = 0; i < questionsPerType && questions.length < settings.numQuestions; i++) {
      const question = generateMultipleChoice(inputText, keywords, settings.difficulty);
      if (question) questions.push(question);
    }
  }
  
  if (settings.questionTypes.shortAnswer) {
    for (let i = 0; i < questionsPerType && questions.length < settings.numQuestions; i++) {
      const question = generateShortAnswer(inputText, keywords, settings.difficulty);
      if (question) questions.push(question);
    }
  }
  
  // Shuffle questions
  questions.sort(() => Math.random() - 0.5);
  
  // Ensure we have the requested number of questions
  while (questions.length < settings.numQuestions) {
    // Generate additional questions if needed
    const question = generateFillInBlank(inputText, keywords, settings.difficulty) ||
                   generateMultipleChoice(inputText, keywords, settings.difficulty) ||
                   generateShortAnswer(inputText, keywords, settings.difficulty);
    
    if (question && !questions.find(q => q.question === question.question)) {
      questions.push(question);
    } else {
      break; // Avoid infinite loop if we can't generate more unique questions
    }
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    title: `Generated Quiz - ${new Date().toLocaleDateString()}`,
    description: `Auto-generated quiz from provided text with ${questions.length} questions`,
    questions: questions.slice(0, settings.numQuestions),
    createdAt: new Date(),
    sourceText: inputText,
    settings
  };
}