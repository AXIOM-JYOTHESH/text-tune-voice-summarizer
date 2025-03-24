import React, { useState, useEffect } from 'react';
import FileUpload from '@/components/FileUpload';
import TextInputArea from '@/components/TextInputArea';
import SummaryOptions from '@/components/SummaryOptions';
import ResultDisplay from '@/components/ResultDisplay';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SettingsDialog from '@/components/SettingsDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Summarizer } from '@/components/Summarizer';
import { generateMistralSummary } from '@/services/mistral';
import { extractTextFromFile } from '@/services/mistral-ocr';

const Index = () => {
  // State for file upload and text extraction
  const [extractedText, setExtractedText] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState(false);
  
  // State for summarization
  const [summary, setSummary] = useState<string>('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summarizationProgress, setSummarizationProgress] = useState(0);
  
  // State for summarization options
  const [summaryType, setSummaryType] = useState<string>('medium');
  const [readabilityLevel, setReadabilityLevel] = useState<string>('general');
  const [language, setLanguage] = useState<string>('en');
  
  // State for audio generation
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  
  // State for model selection
  const [selectedModel, setSelectedModel] = useState<string>('extractive');
  
  // State for sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ id: string; title: string }>>([]);
  
  // State for settings
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [summaryLength, setSummaryLength] = useState<number>(150);
  const [tone, setTone] = useState<string>('neutral');

  // Handle file upload
  const handleFilesAccepted = async (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setIsExtracting(true);
    
    try {
      const file = acceptedFiles[0];
      const extractedText = await extractTextFromFile(file);
      setExtractedText(extractedText);
      toast({
        title: "File processed successfully",
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
      setIsExtracting(false);
    }
  };

  // Handle text input submit
  const handleTextInputSubmit = () => {
    if (!inputText.trim()) return;
    
    setIsExtracting(true);
    
    // Simulate processing
    setTimeout(() => {
      setExtractedText(inputText);
      setIsExtracting(false);
      toast({
        title: "Text processed successfully",
        description: "Your text has been processed.",
      });
    }, 1000);
  };

  // Handle generate summary
  const handleGenerateSummary = async () => {
    if (!extractedText) {
      toast({
        title: "No text to summarize",
        description: "Please upload a document or paste text first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSummarizing(true);
    setSummarizationProgress(0);
    
    try {
      let summaryText: string;

      if (selectedModel === 'mistral') {
        // Use Mistral API
        summaryText = await generateMistralSummary(extractedText, {
          summaryType,
          readabilityLevel,
          language,
          summaryLength,
          tone
        });
      } else {
        // Use extractive model
        const sentences = extractedText.match(/[^.!?]+[.!?]+/g) || [];
        
        // Simple scoring based on sentence length and position
        const scoredSentences = sentences.map((sentence, index) => ({
          sentence,
          score: sentence.split(' ').length * (1 - index / sentences.length)
        }));
        
        // Sort by score and take top sentences based on summary type
        const numSentences = summaryType === 'short' ? 2 : summaryType === 'medium' ? 3 : 4;
        summaryText = scoredSentences
          .sort((a, b) => b.score - a.score)
          .slice(0, numSentences)
          .map(s => s.sentence)
          .join(' ');
      }
      
      setSummary(summaryText);
      
      // Add to chat history
      const newChatId = Date.now().toString();
      setChatHistory(prev => [
        { id: newChatId, title: `Summary ${prev.length + 1}` },
        ...prev
      ]);
      
      toast({
        title: "Summary generated",
        description: "Your summary has been generated successfully.",
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSummarizing(false);
      setSummarizationProgress(100);
    }
  };

  // Handle generate audio
  const handleGenerateAudio = () => {
    if (!summary) return;
    
    setIsGeneratingAudio(true);
    
    // Simulate audio generation
    setTimeout(() => {
      setIsGeneratingAudio(false);
      toast({
        title: "Audio generated",
        description: "Text-to-speech audio has been generated.",
      });
    }, 2000);
  };

  // Handle new chat
  const handleNewChat = () => {
    setExtractedText('');
    setInputText('');
    setSummary('');
    setFiles([]);
    setIsSidebarOpen(false);
    toast({
      title: "New chat started",
      description: "You've started a new summarization session.",
    });
  };

  // Handle chat selection
  const handleChatSelect = (id: string) => {
    // In a real app, this would load the selected chat
    setIsSidebarOpen(false);
    toast({
      title: "Chat selected",
      description: `You've selected a previous chat session with ID: ${id}`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        onNewChat={handleNewChat}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />
      
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={handleNewChat}
        chatHistory={chatHistory}
        onChatSelect={handleChatSelect}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      
      <SettingsDialog 
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        summaryLength={summaryLength}
        onSummaryLengthChange={setSummaryLength}
        tone={tone}
        onToneChange={setTone}
        language={language}
        onLanguageChange={setLanguage}
      />
      
      <main className="flex-1 container mx-auto py-8 px-4">
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
                  onTextExtracted={setExtractedText}
                />
              </CardContent>
            </Card>
            
            <TextInputArea 
              value={inputText}
              onChange={setInputText}
              onSubmit={handleTextInputSubmit}
              isLoading={isExtracting}
            />
            
            <Card>
              <CardHeader>
                <CardTitle>Extracted Text</CardTitle>
              </CardHeader>
              <CardContent>
                {extractedText ? (
                  <div className="p-4 bg-muted rounded-md max-h-[300px] overflow-y-auto">
                    <p className="whitespace-pre-wrap">{extractedText}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Upload a document or paste text to see content here
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <SummaryOptions 
              summaryType={summaryType}
              onSummaryTypeChange={setSummaryType}
              readabilityLevel={readabilityLevel}
              onReadabilityLevelChange={setReadabilityLevel}
              language={language}
              onLanguageChange={setLanguage}
              onSubmit={handleGenerateSummary}
              isLoading={isSummarizing}
              progress={summarizationProgress}
            />
            
            <ResultDisplay 
              summary={summary}
              isGeneratingAudio={isGeneratingAudio}
              onGenerateAudio={handleGenerateAudio}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
