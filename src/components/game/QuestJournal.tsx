import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Quest } from '@/types/quest';
import { X, CheckCircle2, Circle, Gift, Coins } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface QuestJournalProps {
  quests: Quest[];
  onClose: () => void;
}

const QuestJournal = ({ quests, onClose }: QuestJournalProps) => {
  const activeQuests = quests.filter(q => q.status === 'active');
  const availableQuests = quests.filter(q => q.status === 'available');
  const completedQuests = quests.filter(q => q.status === 'completed');

  const QuestCard = ({ quest }: { quest: Quest }) => (
    <Card className="p-4 space-y-3 hover:border-primary transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-foreground">{quest.title}</h4>
          <p className="text-xs text-muted-foreground">From: {quest.giver}</p>
        </div>
        <Badge variant={quest.status === 'completed' ? 'default' : 'secondary'}>
          {quest.status}
        </Badge>
      </div>
      
      <p className="text-sm text-foreground">{quest.description}</p>
      
      <div className="space-y-1">
        <p className="text-xs font-semibold text-muted-foreground">Objectives:</p>
        {quest.objectives.map((obj) => (
          <div key={obj.id} className="flex items-start gap-2 text-xs">
            {obj.completed ? (
              <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5" />
            ) : (
              <Circle className="w-3 h-3 text-muted-foreground mt-0.5" />
            )}
            <span className={obj.completed ? 'line-through text-muted-foreground' : 'text-foreground'}>
              {obj.description}
              {obj.target && ` (${obj.progress}/${obj.target})`}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-4 pt-2 border-t border-border">
        {quest.rewards.money && (
          <div className="flex items-center gap-1 text-xs">
            <Coins className="w-3 h-3 text-yellow-500" />
            <span className="text-foreground">${quest.rewards.money}</span>
          </div>
        )}
        {quest.rewards.items && quest.rewards.items.length > 0 && (
          <div className="flex items-center gap-1 text-xs">
            <Gift className="w-3 h-3 text-blue-500" />
            <span className="text-foreground">{quest.rewards.items.length} items</span>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col bg-background">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">Quest Journal</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <Tabs defaultValue="active" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="mx-6 mt-4">
            <TabsTrigger value="active">
              Active ({activeQuests.length})
            </TabsTrigger>
            <TabsTrigger value="available">
              Available ({availableQuests.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedQuests.length})
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto p-6">
            <TabsContent value="active" className="space-y-3 mt-0">
              {activeQuests.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No active quests</p>
              ) : (
                activeQuests.map(quest => <QuestCard key={quest.id} quest={quest} />)
              )}
            </TabsContent>

            <TabsContent value="available" className="space-y-3 mt-0">
              {availableQuests.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No available quests</p>
              ) : (
                availableQuests.map(quest => <QuestCard key={quest.id} quest={quest} />)
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-3 mt-0">
              {completedQuests.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No completed quests</p>
              ) : (
                completedQuests.map(quest => <QuestCard key={quest.id} quest={quest} />)
              )}
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

export default QuestJournal;
