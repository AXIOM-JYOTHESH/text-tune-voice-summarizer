import React, { useState } from 'react';
import { useSummarizer } from '../hooks/use-summarizer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function Summarizer() {
  const [inputText, setInputText] = useState('');
  const { summary, isLoading, error, summarizeText } = useSummarizer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      await summarizeText(inputText);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to summarize..."
          className="min-h-[200px]"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating Summary...' : 'Generate Summary'}
        </Button>
      </form>

      {error && (
        <div className="text-red-500">
          {error}
        </div>
      )}

      {summary && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">Summary:</h3>
          <div className="p-4 bg-secondary rounded-lg">
            {summary}
          </div>
        </div>
      )}
    </div>
  );
} 