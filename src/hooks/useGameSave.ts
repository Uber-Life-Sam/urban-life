import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface GameSaveData {
  playerPosition: { x: number; y: number; z: number };
  playerRotation: number;
  money: number;
  inventory: any[];
  questStates: any[];
  timeOfDay: number;
}

export const useGameSave = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-save function
  const saveGame = useCallback(async (data: GameSaveData) => {
    try {
      setIsSaving(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Not signed in",
          description: "Please sign in to save your progress",
          variant: "destructive",
        });
        return false;
      }

      const saveData = {
        user_id: user.id,
        player_position: data.playerPosition,
        player_rotation: data.playerRotation,
        money: data.money,
        inventory: data.inventory,
        quest_states: data.questStates,
        time_of_day: data.timeOfDay,
      };

      // Check if save exists
      const { data: existingSave } = await supabase
        .from('player_saves')
        .select('id')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (existingSave) {
        // Update existing save
        const { error } = await supabase
          .from('player_saves')
          .update(saveData)
          .eq('id', existingSave.id);

        if (error) throw error;
      } else {
        // Create new save
        const { error } = await supabase
          .from('player_saves')
          .insert(saveData);

        if (error) throw error;
      }

      toast({
        title: "Game saved",
        description: "Your progress has been saved",
      });

      return true;
    } catch (error) {
      console.error('Error saving game:', error);
      toast({
        title: "Save failed",
        description: "Could not save your progress",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  // Load game function
  const loadGame = useCallback(async (): Promise<GameSaveData | null> => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      const { data: save, error } = await supabase
        .from('player_saves')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No save found
          return null;
        }
        throw error;
      }

      if (!save) return null;

      return {
        playerPosition: save.player_position as { x: number; y: number; z: number },
        playerRotation: save.player_rotation,
        money: save.money,
        inventory: save.inventory as any[],
        questStates: save.quest_states as any[],
        timeOfDay: save.time_of_day,
      };
    } catch (error) {
      console.error('Error loading game:', error);
      toast({
        title: "Load failed",
        description: "Could not load your saved game",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    saveGame,
    loadGame,
    isLoading,
    isSaving,
  };
};
