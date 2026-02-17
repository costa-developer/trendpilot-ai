-- Create unique index on user_id to prevent duplicate subscriptions
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_user_id_unique ON public.subscriptions (user_id);