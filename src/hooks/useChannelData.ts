import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useCallback, useMemo } from "react";

export interface ChannelContext {
  channelTitle: string;
  subscriberCount: number;
  avgViews: number;
  engagementRate: number;
  topVideos: { title: string; views: number }[];
  videoCount: number;
  videos: { title: string; views: number; likes: number; comments: number; publishedAt: string }[];
}

export interface AnalysisRecord {
  id: string;
  channel_title: string | null;
  channel_id: string | null;
  channel_url: string;
  subscriber_count: number | null;
  video_count: number | null;
  view_count: number | null;
  analysis_data: any;
  created_at: string;
}

function buildContext(record: AnalysisRecord): ChannelContext {
  const d = record.analysis_data as any;
  return {
    channelTitle: record.channel_title || "Unknown",
    subscriberCount: record.subscriber_count || 0,
    avgViews: d?.avgViews || 0,
    engagementRate: d?.engagementRate || 0,
    topVideos: d?.topVideos || [],
    videoCount: record.video_count || 0,
    videos: d?.videos || [],
  };
}

export const useChannelData = () => {
  const { user } = useAuth();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: allAnalyses, isLoading } = useQuery({
    queryKey: ["all-analyses", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as AnalysisRecord[];
    },
    enabled: !!user,
  });

  // Deduplicate by channel_id, keeping only the latest per channel
  const channels = useMemo(() => {
    if (!allAnalyses?.length) return [];
    const seen = new Map<string, AnalysisRecord>();
    for (const a of allAnalyses) {
      const key = a.channel_id || a.channel_url;
      if (!seen.has(key)) seen.set(key, a);
    }
    return Array.from(seen.values());
  }, [allAnalyses]);

  const activeAnalysis = useMemo(() => {
    if (!channels.length) return null;
    if (selectedId) return channels.find((c) => c.id === selectedId) || channels[0];
    return channels[0];
  }, [channels, selectedId]);

  const channelContext: ChannelContext | null = activeAnalysis ? buildContext(activeAnalysis) : null;
  const hasData = !!channelContext;

  const selectChannel = useCallback((id: string) => setSelectedId(id), []);

  return {
    channelContext,
    latestAnalysis: activeAnalysis,
    hasData,
    isLoading,
    channels,
    selectedChannelId: activeAnalysis?.id || null,
    selectChannel,
  };
};
