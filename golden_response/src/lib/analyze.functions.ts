import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const InputSchema = z.object({
  imageUrl: z.string().url().max(2000),
  imagePath: z.string().min(1).max(500),
});

export type AnalysisResult = {
  crop_type: string;
  disease_name: string;
  is_healthy: boolean;
  confidence: number;
  severity: "none" | "mild" | "moderate" | "severe";
  symptoms: string;
  treatment: string;
  fertilizer: string;
  prevention: string;
  irrigation: string;
  notes: string;
};

const responseSchema = {
  type: "object",
  properties: {
    crop_type: { type: "string", description: "Plant/crop species, e.g. Tomato, Wheat, Rice" },
    disease_name: { type: "string", description: "Specific disease name, or 'Healthy' if no disease" },
    is_healthy: { type: "boolean" },
    confidence: { type: "number", description: "0-100 confidence percentage" },
    severity: { type: "string", enum: ["none", "mild", "moderate", "severe"] },
    symptoms: { type: "string", description: "Visible symptoms in the image" },
    treatment: { type: "string", description: "Recommended treatment, fungicides, pesticides" },
    fertilizer: { type: "string", description: "Fertilizer recommendation" },
    prevention: { type: "string", description: "Preventive measures" },
    irrigation: { type: "string", description: "Irrigation/watering guidance" },
    notes: { type: "string", description: "Brief expert summary, max 2 sentences" },
  },
  required: ["crop_type", "disease_name", "is_healthy", "confidence", "severity", "symptoms", "treatment", "fertilizer", "prevention", "irrigation", "notes"],
  additionalProperties: false,
};

export const analyzeCrop = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI service not configured");

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are an expert agronomist and plant pathologist. Analyze crop/leaf images for diseases and return precise, actionable guidance for farmers. If the image is NOT a plant/crop, set crop_type='unknown', disease_name='Not a crop image', is_healthy=false, confidence=0.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this crop image. Identify the crop type, detect any disease or confirm healthy, and provide treatment, fertilizer, prevention, and irrigation guidance." },
              { type: "image_url", image_url: { url: data.imageUrl } },
            ],
          },
        ],
        tools: [{
          type: "function",
          function: {
            name: "report_diagnosis",
            description: "Return the crop disease diagnosis.",
            parameters: responseSchema,
          },
        }],
        tool_choice: { type: "function", function: { name: "report_diagnosis" } },
      }),
    });

    if (!aiResp.ok) {
      const text = await aiResp.text();
      if (aiResp.status === 429) throw new Error("Rate limit reached, please retry shortly.");
      if (aiResp.status === 402) throw new Error("AI credits exhausted. Add credits in workspace settings.");
      throw new Error(`AI analysis failed: ${text.slice(0, 200)}`);
    }

    const aiData = await aiResp.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) throw new Error("AI returned no diagnosis");

    let parsed: AnalysisResult;
    try {
      parsed = JSON.parse(toolCall.function.arguments);
    } catch {
      throw new Error("Could not parse AI diagnosis");
    }

    const { data: row, error } = await supabase.from("predictions").insert({
      user_id: userId,
      image_url: data.imageUrl,
      crop_type: parsed.crop_type,
      disease_name: parsed.disease_name,
      is_healthy: parsed.is_healthy,
      confidence: Math.max(0, Math.min(100, Number(parsed.confidence) || 0)),
      severity: parsed.severity,
      symptoms: parsed.symptoms,
      treatment: parsed.treatment,
      fertilizer: parsed.fertilizer,
      prevention: parsed.prevention,
      irrigation: parsed.irrigation,
      notes: parsed.notes,
    }).select().single();

    if (error) {
      console.error("DB insert error:", error);
      throw new Error("Could not save prediction");
    }

    return { prediction: row };
  });
