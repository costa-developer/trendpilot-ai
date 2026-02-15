
CREATE TABLE public.roadmap_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  completed_days integer[] NOT NULL DEFAULT '{}',
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.roadmap_progress ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX idx_roadmap_progress_user ON public.roadmap_progress (user_id);

CREATE POLICY "Users can view their own progress"
  ON public.roadmap_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.roadmap_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.roadmap_progress FOR UPDATE
  USING (auth.uid() = user_id);
