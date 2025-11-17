import { Quest, DialogueNode } from '@/types/quest';

export const availableQuests: Quest[] = [
  {
    id: 'quest_1',
    title: 'Welcome to the City',
    description: 'Get to know the city by visiting key locations.',
    giver: 'Mayor',
    objectives: [
      { id: 'obj_1', description: 'Visit the Shop', completed: false },
      { id: 'obj_2', description: 'Talk to 3 NPCs', completed: false, progress: 0, target: 3 },
    ],
    rewards: {
      money: 500,
      experience: 100,
    },
    status: 'available',
  },
  {
    id: 'quest_2',
    title: 'City Explorer',
    description: 'Explore different buildings around the city.',
    giver: 'Guide',
    objectives: [
      { id: 'obj_3', description: 'Enter 5 different buildings', completed: false, progress: 0, target: 5 },
    ],
    rewards: {
      money: 750,
      items: ['city_map'],
      experience: 150,
    },
    status: 'available',
  },
];

export const dialogueDatabase: Record<string, DialogueNode> = {
  mayor_greeting: {
    id: 'mayor_greeting',
    npcName: 'Mayor',
    text: 'Welcome to our city! I have a task for you if you\'re interested.',
    options: [
      { id: 'opt_1', text: 'What do you need?', nextDialogueId: 'mayor_quest_offer' },
      { id: 'opt_2', text: 'Not right now.', action: 'exit' },
    ],
  },
  mayor_quest_offer: {
    id: 'mayor_quest_offer',
    npcName: 'Mayor',
    text: 'I need someone to get familiar with the city. Could you visit the shop and talk to some locals?',
    options: [
      { id: 'opt_3', text: 'Sure, I can do that.', action: 'accept_quest', questId: 'quest_1' },
      { id: 'opt_4', text: 'Maybe later.', action: 'decline_quest', questId: 'quest_1' },
    ],
  },
  guide_greeting: {
    id: 'guide_greeting',
    npcName: 'Guide',
    text: 'Hello traveler! Want to explore the city with me?',
    options: [
      { id: 'opt_5', text: 'Tell me more.', nextDialogueId: 'guide_quest_offer' },
      { id: 'opt_6', text: 'No thanks.', action: 'exit' },
    ],
  },
  guide_quest_offer: {
    id: 'guide_quest_offer',
    npcName: 'Guide',
    text: 'I challenge you to explore the city! Visit different buildings and discover what they offer.',
    options: [
      { id: 'opt_7', text: 'Challenge accepted!', action: 'accept_quest', questId: 'quest_2' },
      { id: 'opt_8', text: 'Not interested.', action: 'decline_quest', questId: 'quest_2' },
    ],
  },
  generic_npc: {
    id: 'generic_npc',
    npcName: 'Citizen',
    text: 'Nice day, isn\'t it? Welcome to our city!',
    options: [
      { id: 'opt_9', text: 'Thanks!', action: 'exit' },
    ],
  },
};
