import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const YOUTUBE_API_KEY = Deno.env.get("YOUTUBE_API_KEY");
    if (!YOUTUBE_API_KEY) throw new Error("YOUTUBE_API_KEY is not configured");

    const { channelUrl } = await req.json();
    if (!channelUrl) throw new Error("channelUrl is required");

    // Extract channel identifier from URL
    let channelId = "";
    let channelHandle = "";
    const url = channelUrl.trim();

    if (url.includes("/@")) {
      channelHandle = url.split("/@")[1]?.split(/[/?#]/)[0] || "";
    } else if (url.includes("/channel/")) {
      channelId = url.split("/channel/")[1]?.split(/[/?#]/)[0] || "";
    } else if (url.includes("/c/")) {
      channelHandle = url.split("/c/")[1]?.split(/[/?#]/)[0] || "";
    } else {
      // Try as direct handle
      channelHandle = url.replace(/^https?:\/\/(www\.)?youtube\.com\/?/, "").replace("@", "");
    }

    // Resolve channel ID
    if (!channelId && channelHandle) {
      const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(channelHandle)}&maxResults=1&key=${YOUTUBE_API_KEY}`
      );
      const searchData = await searchRes.json();
      if (searchData.error) throw new Error(searchData.error.message);
      channelId = searchData.items?.[0]?.id?.channelId || "";
    }

    if (!channelId) throw new Error("Could not find channel. Please check the URL.");

    // Fetch channel info
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&id=${channelId}&key=${YOUTUBE_API_KEY}`
    );
    const channelData = await channelRes.json();
    if (channelData.error) throw new Error(channelData.error.message);
    const channel = channelData.items?.[0];
    if (!channel) throw new Error("Channel not found");

    // Fetch recent videos
    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=50&key=${YOUTUBE_API_KEY}`
    );
    const videosData = await videosRes.json();
    if (videosData.error) throw new Error(videosData.error.message);

    const videoIds = (videosData.items || []).map((v: any) => v.id.videoId).filter(Boolean);

    // Fetch video stats
    let videoStats: any[] = [];
    if (videoIds.length > 0) {
      const statsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds.join(",")}&key=${YOUTUBE_API_KEY}`
      );
      const statsData = await statsRes.json();
      if (statsData.error) throw new Error(statsData.error.message);
      videoStats = statsData.items || [];
    }

    // Calculate metrics
    const videos = videoStats.map((v: any) => ({
      title: v.snippet.title,
      publishedAt: v.snippet.publishedAt,
      views: parseInt(v.statistics.viewCount || "0"),
      likes: parseInt(v.statistics.likeCount || "0"),
      comments: parseInt(v.statistics.commentCount || "0"),
    }));

    const totalViews = videos.reduce((s: number, v: any) => s + v.views, 0);
    const totalLikes = videos.reduce((s: number, v: any) => s + v.likes, 0);
    const totalComments = videos.reduce((s: number, v: any) => s + v.comments, 0);
    const avgViews = videos.length > 0 ? Math.round(totalViews / videos.length) : 0;
    const engagementRate = totalViews > 0 ? ((totalLikes + totalComments) / totalViews * 100).toFixed(2) : "0";

    // Sort by views for top/worst
    const sorted = [...videos].sort((a: any, b: any) => b.views - a.views);
    const topVideos = sorted.slice(0, 5);
    const worstVideos = sorted.slice(-5).reverse();

    const result = {
      channelId,
      channelTitle: channel.snippet.title,
      channelDescription: channel.snippet.description,
      thumbnailUrl: channel.snippet.thumbnails?.medium?.url,
      subscriberCount: parseInt(channel.statistics.subscriberCount || "0"),
      totalViewCount: parseInt(channel.statistics.viewCount || "0"),
      videoCount: parseInt(channel.statistics.videoCount || "0"),
      avgViews,
      engagementRate: parseFloat(engagementRate),
      totalVideosAnalyzed: videos.length,
      topVideos,
      worstVideos,
      videos,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-channel error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
