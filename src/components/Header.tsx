
import React from 'react';
import { Menu, Plus, User, ChevronDown } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface HeaderProps {
  onToggleSidebar: () => void;
  onNewChat: () => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onNewChat,
  selectedModel,
  onModelChange,
}) => {
  return (
    <header className="border-b border-border h-14 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="sm" onClick={onNewChat}>
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Select value={selectedModel} onValueChange={onModelChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4">OpenAI GPT-4</SelectItem>
            <SelectItem value="gpt-3.5-turbo">OpenAI GPT-3.5</SelectItem>
            <SelectItem value="mistral">Mistral</SelectItem>
          </SelectContent>
        </Select>
        <ThemeToggle />
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
