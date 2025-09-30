import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pincode } = await req.json();
    console.log("Getting irrigation advice for pincode:", pincode);

    if (!pincode) {
      throw new Error("PIN code is required");
    }

    // Simulate weather-based irrigation logic
    const temperature = Math.floor(Math.random() * 15) + 20;
    const humidity = Math.floor(Math.random() * 40) + 40;
    const rainfall = Math.random() > 0.7;

    let shouldWater = false;
    let reason = "";

    if (rainfall) {
      shouldWater = false;
      reason = "Recent rainfall detected. Your crops have sufficient water. No irrigation needed today.";
    } else if (temperature > 30 && humidity < 60) {
      shouldWater = true;
      reason = `High temperature (${temperature}°C) and low humidity (${humidity}%) detected. Water your crops in the early morning or evening.`;
    } else if (humidity < 50) {
      shouldWater = true;
      reason = `Low humidity (${humidity}%) may cause moisture loss. Light irrigation recommended.`;
    } else {
      shouldWater = false;
      reason = `Weather conditions are favorable. Current temperature: ${temperature}°C, humidity: ${humidity}%. No immediate irrigation needed.`;
    }

    const recommendation = {
      shouldWater,
      reason,
      temperature,
      humidity,
      rainfall,
    };

    return new Response(JSON.stringify(recommendation), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
