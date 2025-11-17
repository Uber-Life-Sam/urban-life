import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Quest } from '@/types/quest';
import { CheckCircle2, Circle } from 'lucide-react';

interface QuestTrackerProps {
  activeQuests: Quest[];
}

const QuestTracker = ({ activeQuests }: QuestTrackerProps) => {
  if (activeQuests.length === 0) return null;

  return (
    <div className="absolute top-4 left-4 z-30 max-w-sm">
      <Card className="p-4 bg-background/90 backdrop-blur-sm border-border/50">
        <h3 className="text-sm font-bold text-foreground mb-3">Active Quests</h3>
        <div className="space-y-4">
          {activeQuests.map((quest) => (
            <div key={quest.id} className="space-y-2">
              <h4 className="text-xs font-semibold text-primary">{quest.title}</h4>
              <div className="space-y-1">
                {quest.objectives.map((objective) => (
                  <div key={objective.id} className="flex items-start gap-2 text-xs">
                    {objective.completed ? (
                      <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Circle className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 space-y-1">
                      <p className={objective.completed ? 'text-muted-foreground line-through' : 'text-foreground'}>
                        {objective.description}
                      </p>
                      {objective.target && objective.progress !== undefined && (
                        <div className="space-y-1">
                          <Progress 
                            value={(objective.progress / objective.target) * 100} 
                            className="h-1"
                          />
                          <p className="text-[10px] text-muted-foreground">
                            {objective.progress}/{objective.target}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default QuestTracker;
