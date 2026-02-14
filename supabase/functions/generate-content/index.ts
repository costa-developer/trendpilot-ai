import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { type, channelData } = await req.json();

    let systemPrompt = "";
    let userPrompt = "";

    const channelContext = channelData
      ? `Channel: "${channelData.channelTitle}" with ${channelData.subscriberCount} subscribers, ${channelData.avgViews} avg views, ${channelData.engagementRate}% engagement rate. Top videos: ${(channelData.topVideos || []).map((v: any) => v.title).join(", ")}.`
      : "A general YouTube creator looking to grow.";

    if (type === "ideas") {
      systemPrompt = "You are a YouTube growth strategist. Generate viral video ideas.";
      userPrompt = `${channelContext}\n\nGenerate 10 trending video ideas tailored to this channel. For each, provide a title and a viral probability score (0-100). Return as JSON array: [{"title": "...", "viral": 85}]`;
    } else if (type === "titles") {
      systemPrompt = "You are a YouTube title optimization expert focused on high CTR.";
      userPrompt = `${channelContext}\n\nGenerate 5 high-CTR optimized video titles with emoji hooks. Return as JSON array of strings.`;
    } else if (type === "hashtags") {
      systemPrompt = "You are a YouTube SEO expert.";
      userPrompt = `${channelContext}\n\nGenerate 15 SEO-optimized hashtags for this channel. Return as JSON array of strings starting with #.`;
    } else if (type === "script") {
      systemPrompt = "You are a YouTube scriptwriter who creates engaging video scripts.";
      userPrompt = `${channelContext}\n\nGenerate a YouTube script outline with these sections: hook (0-15 sec engaging opener), problem (what issue the video addresses), value (main value delivery), example (demo or example section), cta (call to action). Return as JSON: {"hook": "...", "problem": "...", "value": "...", "example": "...", "cta": "..."}`;
    } else if (type === "trends") {
      systemPrompt = "You are a YouTube trend analyst.";
      userPrompt = `${channelContext}\n\nIdentify 5 trending topics in this creator's niche. For each, provide: topic name, trendScore (0-100), velocity (0-100), opportunity (0-100), status emoji+text. Return as JSON array: [{"topic": "...", "trendScore": 90, "velocity": 85, "opportunity": 92, "status": "🔥 Hot"}]`;
    } else if (type === "gaps") {
      systemPrompt = "You are a YouTube content gap analyst.";
      userPrompt = `${channelContext}\n\nIdentify 4 content gaps for this creator. For each, provide: topic, yourCoverage (e.g. "None", "1 video"), competition level, potential level. Return as JSON array: [{"topic": "...", "yourCoverage": "None", "competition": "Medium", "potential": "High"}]`;
    } else {
      throw new Error("Invalid type. Use: ideas, titles, hashtags, script, trends, gaps");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt + " Always respond with valid JSON only, no markdown formatting." },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error("AI service error");
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    // Parse JSON from the response
    let parsed;
    try {
      // Try to extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      parsed = JSON.parse(jsonMatch[1].trim());
    } catch {
      parsed = content;
    }

    return new Response(JSON.stringify({ result: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-content error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
