
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, File } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface FileUploadProps {
  onFilesAccepted: (files: File[]) => void;
  onTextExtracted: (text: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesAccepted, onTextExtracted }) => {
  const [extracting, setExtracting] = useState(false);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setExtracting(true);
        onFilesAccepted(acceptedFiles);
        
        // Simulate text extraction (in a real app, this would process the files)
        try {
          // This is just a placeholder - in a real app you'd extract text from the files
          setTimeout(() => {
            const text = "This is extracted text from the uploaded file. In a production app, this would be the actual content extracted from your document.";
            onTextExtracted(text);
            setExtracting(false);
            toast({
              title: "File processed successfully",
              description: `Extracted text from ${acceptedFiles[0].name}`,
            });
          }, 1500);
        } catch (error) {
          setExtracting(false);
          toast({
            title: "Error processing file",
            description: "There was a problem extracting text from your file.",
            variant: "destructive",
          });
        }
      }
    }
  });

  return (
    <Card className="w-full p-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/30 hover:border-primary/50'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Drag & drop files here</h3>
          <p className="text-sm text-muted-foreground">
            or click to browse (PDF, Word, Text files)
          </p>
          {extracting && <p className="text-sm text-primary animate-pulse">Extracting text...</p>}
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <Button 
          variant="outline" 
          onClick={() => document.getElementById('dropzone-file')?.click()}
          disabled={extracting}
        >
          <File className="mr-2 h-4 w-4" />
          Select Files
        </Button>
      </div>
    </Card>
  );
};

export default FileUpload;
