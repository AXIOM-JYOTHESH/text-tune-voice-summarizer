
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface SummaryOptionsProps {
  summaryType: string; 
  onSummaryTypeChange: (value: string) => void;
  readabilityLevel: string;
  onReadabilityLevelChange: (value: string) => void;
  language: string;
  onLanguageChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  progress: number;
}

const SummaryOptions: React.FC<SummaryOptionsProps> = ({
  summaryType,
  onSummaryTypeChange,
  readabilityLevel,
  onReadabilityLevelChange,
  language,
  onLanguageChange,
  onSubmit,
  isLoading,
  progress,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Summarization Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Summary Type</label>
          <Select value={summaryType} onValueChange={onSummaryTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select summary type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="detailed">Detailed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Readability Level</label>
          <Select value={readabilityLevel} onValueChange={onReadabilityLevelChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select readability level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kids">Kids</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="researchers">Researchers</SelectItem>
              <SelectItem value="professionals">Professionals</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Language</label>
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="ja">Japanese</SelectItem>
              <SelectItem value="zh">Chinese</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {isLoading && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Summarizing...</p>
            <Progress value={progress} />
          </div>
        )}
        
        <Button 
          onClick={onSubmit} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Generating Summary...' : 'Generate Summary'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SummaryOptions;
