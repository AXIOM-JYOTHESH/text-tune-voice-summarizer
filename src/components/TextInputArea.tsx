
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TextInputAreaProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const TextInputArea: React.FC<TextInputAreaProps> = ({
  value,
  onChange,
  onSubmit,
  isLoading,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paste Text</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Paste or type your text here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[200px] mb-4"
        />
        <Button 
          onClick={onSubmit} 
          disabled={!value.trim() || isLoading}
          className="w-full"
        >
          {isLoading ? 'Processing...' : 'Extract Text'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TextInputArea;
