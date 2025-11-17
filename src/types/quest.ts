export interface QuestObjective {
  id: string;
  description: string;
  completed: boolean;
  progress?: number;
  target?: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  giver: string; // NPC name
  objectives: QuestObjective[];
  rewards: {
    money?: number;
    items?: string[];
    experience?: number;
  };
  status: 'available' | 'active' | 'completed';
}

export interface DialogueOption {
  id: string;
  text: string;
  action?: 'accept_quest' | 'decline_quest' | 'complete_quest' | 'trade' | 'exit';
  nextDialogueId?: string;
  questId?: string;
}

export interface DialogueNode {
  id: string;
  npcName: string;
  text: string;
  options: DialogueOption[];
}
