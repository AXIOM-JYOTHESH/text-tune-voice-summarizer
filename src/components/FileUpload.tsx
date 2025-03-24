import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, File, Image } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { extractTextFromFile } from '@/services/mistral-ocr';

interface FileUploadProps {
  onFilesAccepted: (files: File[]) => void;
  onTextExtracted: (text: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesAccepted, onTextExtracted }) => {
  const [extracting, setExtracting] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setExtracting(true);
        onFilesAccepted(acceptedFiles);
        
        try {
          const file = acceptedFiles[0];
          console.log('Processing file:', file.name, 'Type:', file.type);
          
          const extractedText = await extractTextFromFile(file);
          console.log('Text extracted successfully:', extractedText);
          onTextExtracted(extractedText);
          toast({
            title: "Text extracted successfully",
            description: `Extracted text from ${file.name}`,
          });
        } catch (error) {
          console.error('Error processing file:', error);
          toast({
            title: "Error processing file",
            description: error instanceof Error ? error.message : "Failed to extract text from the file",
            variant: "destructive",
          });
        } finally {
          setExtracting(false);
        }
      }
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Image</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isDragActive
                ? 'Drop the image here'
                : 'Drag and drop an image here, or click to select'}
            </p>
            <p className="text-xs text-muted-foreground">
              Supported formats: PNG, JPG, JPEG, GIF, WEBP
            </p>
          </div>
        </div>
        
        {extracting && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Extracting text from image...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;
