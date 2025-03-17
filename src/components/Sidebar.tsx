
import React from 'react';
import { HistoryIcon, Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  chatHistory: Array<{ id: string; title: string }>;
  onChatSelect: (id: string) => void;
  onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onNewChat,
  chatHistory,
  onChatSelect,
  onOpenSettings,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="p-0 w-[280px]">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Text Summarizer</SheetTitle>
        </SheetHeader>
        <div className="p-4">
          <Button className="w-full" onClick={onNewChat}>
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>
        <div className="px-4 pb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium">Chat History</h3>
        </div>
        <ScrollArea className="flex-1 h-[calc(100vh-180px)]">
          <div className="space-y-1 p-2">
            {chatHistory.length > 0 ? (
              chatHistory.map((chat) => (
                <Button
                  key={chat.id}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => onChatSelect(chat.id)}
                >
                  <HistoryIcon className="mr-2 h-4 w-4" />
                  <span className="truncate">{chat.title}</span>
                </Button>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No history yet
              </p>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t mt-auto">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onOpenSettings}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
