
import React, { useState, useRef } from 'react';
import { Play, Pause, Download, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  const [voice, setVoice] = useState('alloy');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const handleDownload = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = 'summary.mp3';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // This would normally call an API to generate speech
  const generateSpeech = () => {
    onGenerate();
    
    // Simulating API call with setTimeout
    setTimeout(() => {
      // In a real app, this would be the URL from the TTS API
      // Here we're just using a basic Audio API for demonstration
      const audio = new Audio();
      const url = URL.createObjectURL(new Blob([])); // Empty blob for demo
      setAudioUrl(url);
      
      // In a real implementation, we would set the audio source to the API response
      if (audioRef.current) {
        audioRef.current.src = url;
      }
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Volume2 className="h-5 w-5" />
        <h3 className="text-lg font-medium">Text-to-Speech</h3>
      </div>
      
      <div className="flex items-center space-x-2">
        <Select value={voice} onValueChange={setVoice}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select voice" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alloy">Alloy</SelectItem>
            <SelectItem value="echo">Echo</SelectItem>
            <SelectItem value="fable">Fable</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          size="icon"
          disabled={!audioUrl || isGenerating}
          onClick={handlePlay}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        <Button 
          variant="outline" 
          size="icon"
          disabled={!audioUrl || isGenerating}
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
      
      <Button 
        onClick={generateSpeech} 
        disabled={!text || isGenerating}
        className="w-full"
      >
        {isGenerating ? 'Generating Audio...' : 'Generate Audio'}
      </Button>
      
      <audio ref={audioRef} onEnded={handleEnded} style={{ display: 'none' }} />
    </div>
  );
};

export default AudioPlayer;
