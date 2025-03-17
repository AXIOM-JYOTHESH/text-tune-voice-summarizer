
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AudioPlayer from './AudioPlayer';

interface ResultDisplayProps {
  summary: string;
  isGeneratingAudio: boolean;
  onGenerateAudio: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  summary,
  isGeneratingAudio,
  onGenerateAudio,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {summary ? (
          <>
            <div className="p-4 bg-muted rounded-md">
              <p className="whitespace-pre-wrap">{summary}</p>
            </div>
            <div className="pt-4 border-t">
              <AudioPlayer 
                text={summary} 
                isGenerating={isGeneratingAudio} 
                onGenerate={onGenerateAudio} 
              />
            </div>
          </>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            Generate a summary to see the result here
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultDisplay;
