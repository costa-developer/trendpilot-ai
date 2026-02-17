import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ChannelContext {
  channelTitle: string;
  subscriberCount: number;
  avgViews: number;
  engagementRate: number;
  topVideos: { title: string; views: number }[];
  videoCount: number;
  videos: { title: string; views: number; likes: number; comments: number; publishedAt: string }[];
}

export const useChannelData = () => {
  const { user } = useAuth();

  const { data: latestAnalysis, isLoading } = useQuery({
    queryKey: ["latest-analysis", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const analysisData = latestAnalysis?.analysis_data as any;

  const channelContext: ChannelContext | null = latestAnalysis
    ? {
        channelTitle: latestAnalysis.channel_title || "Unknown",
        subscriberCount: latestAnalysis.subscriber_count || 0,
        avgViews: analysisData?.avgViews || 0,
        engagementRate: analysisData?.engagementRate || 0,
        topVideos: analysisData?.topVideos || [],
        videoCount: latestAnalysis.video_count || 0,
        videos: analysisData?.videos || [],
      }
    : null;

  const hasData = !!channelContext;

  return { channelContext, latestAnalysis, hasData, isLoading };
};
