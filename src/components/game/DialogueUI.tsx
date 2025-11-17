import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DialogueNode, DialogueOption } from '@/types/quest';
import { X } from 'lucide-react';

interface DialogueUIProps {
  dialogue: DialogueNode;
  onSelectOption: (option: DialogueOption) => void;
  onClose: () => void;
}

const DialogueUI = ({ dialogue, onSelectOption, onClose }: DialogueUIProps) => {
  return (
    <div className="absolute inset-0 z-40 flex items-end justify-center pb-20 pointer-events-none">
      <Card className="w-full max-w-2xl p-6 bg-background/95 backdrop-blur-sm border-border pointer-events-auto animate-slide-in-right">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">{dialogue.npcName}</h3>
            <p className="text-sm text-muted-foreground">Speaking</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-muted"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="mb-6">
          <p className="text-foreground leading-relaxed">{dialogue.text}</p>
        </div>

        <div className="space-y-2">
          {dialogue.options.map((option) => (
            <Button
              key={option.id}
              variant="outline"
              className="w-full justify-start text-left h-auto py-3 px-4 hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => onSelectOption(option)}
            >
              {option.text}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DialogueUI;
