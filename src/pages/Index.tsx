
import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const [extractedText, setExtractedText] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);

  const handleFilesAccepted = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  };

  const handleTextExtracted = (text: string) => {
    setExtractedText(text);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Text Summarizer</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Document</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload 
                onFilesAccepted={handleFilesAccepted} 
                onTextExtracted={handleTextExtracted}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Extracted Text</CardTitle>
            </CardHeader>
            <CardContent>
              {extractedText ? (
                <div className="p-4 bg-muted rounded-md">
                  <p className="whitespace-pre-wrap">{extractedText}</p>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Upload a document to see extracted text here
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
