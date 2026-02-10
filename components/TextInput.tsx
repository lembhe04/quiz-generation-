'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, Clipboard, Sparkles } from 'lucide-react';

interface TextInputProps {
  onTextSubmit: (text: string) => void;
}

export default function TextInput({ onTextSubmit }: TextInputProps) {
  const [text, setText] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onTextSubmit(text.trim());
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setText(content);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'text/plain') {
      handleFileUpload(files[0]);
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const loadSampleText = () => {
    const sampleText = `Artificial Intelligence (AI) is a transformative technology that has revolutionized various industries and aspects of human life. Machine learning, a subset of AI, enables computers to learn and improve from experience without being explicitly programmed. Deep learning, which uses neural networks with multiple layers, has been particularly successful in tasks such as image recognition, natural language processing, and speech synthesis. The applications of AI are vast and continue to expand, including autonomous vehicles, medical diagnosis, financial trading, and smart home devices. However, AI also presents challenges and ethical considerations, such as job displacement, privacy concerns, and the need for responsible development and deployment of AI systems.`;
    setText(sampleText);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">Input Your Text</h2>
          <p className="text-muted-foreground text-lg">
            Paste your content, upload a text file, or use our sample text to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div 
            className={`relative border-2 border-dashed rounded-xl p-6 transition-all ${
              dragOver 
                ? 'border-blue-400 bg-blue-50/50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
          >
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your text here or drag and drop a .txt file..."
              className="w-full h-64 p-4 border-none bg-transparent resize-none focus:outline-none text-base leading-relaxed custom-scrollbar"
              required
            />
            
            {text.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Drop your text file here</p>
                  <p className="text-sm">or paste/type your content</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-white/70 border border-gray-200 rounded-lg transition-colors font-medium"
            >
              <Upload className="w-4 h-4" />
              Upload File
            </button>
            
            <button
              type="button"
              onClick={handlePaste}
              className="flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-white/70 border border-gray-200 rounded-lg transition-colors font-medium"
            >
              <Clipboard className="w-4 h-4" />
              Paste from Clipboard
            </button>
            
            <button
              type="button"
              onClick={loadSampleText}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 border border-purple-200 rounded-lg transition-colors font-medium text-purple-700"
            >
              <Sparkles className="w-4 h-4" />
              Use Sample Text
            </button>
          </div>

          {text.length > 0 && (
            <div className="text-center space-y-4 animate-fade-in">
              <div className="text-sm text-muted-foreground">
                {text.length} characters • ~{Math.ceil(text.length / 500)} minute read
              </div>
              
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
              >
                <Sparkles className="w-5 h-5" />
                Generate Quiz
              </button>
            </div>
          )}
        </form>

        <input
          ref={fileInputRef}
          type="file"
          accept=".txt"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
          className="hidden"
        />
      </div>
    </div>
  );
}