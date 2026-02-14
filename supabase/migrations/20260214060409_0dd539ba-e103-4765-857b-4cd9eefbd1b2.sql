
-- Table to track channel analyses per user
CREATE TABLE public.analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  channel_url TEXT NOT NULL,
  channel_id TEXT,
  channel_title TEXT,
  subscriber_count INTEGER,
  video_count INTEGER,
  view_count BIGINT,
  analysis_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own analyses"
ON public.analyses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analyses"
ON public.analyses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses"
ON public.analyses FOR DELETE
USING (auth.uid() = user_id);

-- Index for faster user lookups
CREATE INDEX idx_analyses_user_id ON public.analyses(user_id);
CREATE INDEX idx_analyses_created_at ON public.analyses(created_at DESC);
