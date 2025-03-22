import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Download, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

interface AudioPlayerProps {
  text: string;
  isGenerating: boolean;
  onGenerate: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  text,
  isGenerating,
  onGenerate,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voice, setVoice] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  // Initialize voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      console.log('Available voices:', availableVoices);
      const englishVoices = availableVoices.filter(v => v.lang.startsWith('en'));
      console.log('English voices:', englishVoices);
      setVoices(englishVoices);
      if (englishVoices.length > 0) {
        setVoice(englishVoices[0].name);
        console.log('Selected default voice:', englishVoices[0].name);
      }
    };

    // Initial load
    const initialVoices = window.speechSynthesis.getVoices();
    if (initialVoices.length > 0) {
      loadVoices();
    }

    // Setup event listener for when voices are loaded
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handlePlay = () => {
    console.log('Play button clicked. Current state:', { isPlaying, text, voice });
    if (isPlaying) {
      window.speechSynthesis.pause();
    } else {
      if (utterance) {
        console.log('Resuming speech');
        window.speechSynthesis.resume();
      } else {
        console.log('Generating new speech');
        generateSpeech();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    console.log('Stop button clicked');
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setUtterance(null);
  };

  const generateSpeech = () => {
    console.log('Generating speech with:', { text, voice });
    onGenerate();
    
    try {
      // Cancel any ongoing speech
      handleStop();

      // Create new utterance
      const newUtterance = new SpeechSynthesisUtterance(text);
      
      // Find selected voice
      const selectedVoice = voices.find(v => v.name === voice);
      console.log('Selected voice:', selectedVoice);
      if (selectedVoice) {
        newUtterance.voice = selectedVoice;
      }

      newUtterance.onend = () => {
        console.log('Speech ended');
        setIsPlaying(false);
        setUtterance(null);
      };

      newUtterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        toast({
          title: "Error",
          description: "Failed to generate speech. Please try again.",
          variant: "destructive",
        });
        setIsPlaying(false);
        setUtterance(null);
      };

      setUtterance(newUtterance);
      window.speechSynthesis.speak(newUtterance);
      setIsPlaying(true);
      console.log('Speech started');
    } catch (error) {
      console.error('Error generating speech:', error);
      toast({
        title: "Error",
        description: "Failed to generate speech. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Volume2 className="h-5 w-5" />
        <h3 className="text-lg font-medium">Text-to-Speech</h3>
      </div>
      
      <div className="flex items-center space-x-2">
        <Select value={voice} onValueChange={(newVoice) => {
          console.log('Voice changed to:', newVoice);
          setVoice(newVoice);
        }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select voice" />
          </SelectTrigger>
          <SelectContent>
            {voices.map((v) => (
              <SelectItem key={v.name} value={v.name}>
                {`${v.name} (${v.lang})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="flex items-center space-x-1">
          <Button 
            variant="outline" 
            size="icon"
            disabled={!text || isGenerating}
            onClick={handlePlay}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          <Button 
            variant="outline" 
            size="icon"
            disabled={!text || isGenerating || !isPlaying}
            onClick={handleStop}
            title="Stop"
          >
            <Square className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            disabled={!text || isGenerating}
            onClick={() => {
              toast({
                title: "Coming Soon",
                description: "Download functionality will be available in a future update.",
              });
            }}
            title="Download Audio"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Button 
        onClick={generateSpeech} 
        disabled={!text || isGenerating || voices.length === 0}
        className="w-full"
      >
        {isGenerating ? 'Generating Audio...' : 'Generate Audio'}
      </Button>

      {voices.length === 0 && (
        <p className="text-sm text-red-500">
          No voices available. Please make sure your browser supports speech synthesis.
        </p>
      )}
    </div>
  );
};

export default AudioPlayer;
