import { useState } from 'react';
import { generateSummary } from '../services/openai';

export function useSummarizer() {
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summarizeText = async (text: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await generateSummary(text);
      setSummary(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate summary');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    summary,
    isLoading,
    error,
    summarizeText
  };
} 