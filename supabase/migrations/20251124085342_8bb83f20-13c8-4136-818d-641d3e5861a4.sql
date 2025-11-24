-- Create player_saves table for persisting game state
CREATE TABLE public.player_saves (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  save_name TEXT NOT NULL DEFAULT 'Auto Save',
  player_position JSONB NOT NULL DEFAULT '{"x": 0, "y": 1, "z": 0}'::jsonb,
  player_rotation FLOAT NOT NULL DEFAULT 0,
  money INTEGER NOT NULL DEFAULT 1000,
  inventory JSONB NOT NULL DEFAULT '[]'::jsonb,
  quest_states JSONB NOT NULL DEFAULT '[]'::jsonb,
  time_of_day FLOAT NOT NULL DEFAULT 12,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.player_saves ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own saves" 
ON public.player_saves 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saves" 
ON public.player_saves 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saves" 
ON public.player_saves 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saves" 
ON public.player_saves 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_player_saves_updated_at
BEFORE UPDATE ON public.player_saves
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_player_saves_user_id ON public.player_saves(user_id);
CREATE INDEX idx_player_saves_updated_at ON public.player_saves(updated_at DESC);