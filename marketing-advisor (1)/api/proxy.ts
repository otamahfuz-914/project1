// api/proxy.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from "@google/genai";
import { Plan, ProductInfo, AnalysisResult, GeneratedContent, CampaignStrategy, CampaignGoal, VideoScript, CoreAudienceSet, AudienceSuggestion, CampaignType, SheetAnalysisResult, CompetitorAnalysisResult } from '../types';
import { CAMPAIGN_DETAILS } from '../constants';

// --- API Initialization (Server-Side) ---
function getAiClient(): GoogleGenAI {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API Key not found in environment variables.");
    }
    return new GoogleGenAI({ apiKey });
}

function parseApiError(error: unknown): string {
    console.error("Gemini API call failed:", error);
    if (error instanceof Error) {
        if (error.message.includes('API Key')) {
            return "আপনার API Key টি সঠিক নয় বা কনফিগার করা হয়নি।";
        }
        return `API অনুরোধ ব্যর্থ হয়েছে: ${error.message}`;
    }
    return "একটি অজানা সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
}


// --- Backend Logic Functions (copied from old services/backend.ts) ---

async function processMarketingContentGeneration(
  productInfo: ProductInfo,
  plan: Plan | null,
  campaignType: CampaignType | null
): Promise<GeneratedContent> {
  const ai = getAiClient();
  const { name, description, price, currency, targetAgeStart, targetAgeEnd, category } = productInfo;
  
  const audienceDescription = `The target audience are people aged ${targetAgeStart}-${targetAgeEnd} interested in '${category}'. The product price is ${price} ${currency}, which suggests the target demographic's purchasing power.`;

  let numVariations = 1;
  let numCoreAudienceSets = 1;
  let generateCustomAudiences = false;
  let generateLookalikeAudiences = false;

  if (plan === Plan.PRO) {
    numVariations = 5;
    numCoreAudienceSets = 3;
    generateCustomAudiences = true;
    generateLookalikeAudiences = true;
  } else if (plan === Plan.STANDARD) {
    numVariations = 3;
    numCoreAudienceSets = 2;
    generateCustomAudiences = true;
  }
  
  const captionTemplates = `
  1.  **Template 01: Pain-Agitate-Solve**: Pain point as a question -> Benefit -> Authority/Social Proof -> Benefit -> Urgency.
  2.  **Template 02: Targeted Social Proof**: Discover how [Target Audience] beat [Pain Point] in [Time Period].
  3.  **Template 03: Urgency/Scarcity**: Sale/Offer ends soon -> Social Proof -> Final urgent Call to Action.
  4.  **Template 04: Fear-Based**: Don't let [Fear] stop you from [Desired Outcome].
  5.  **Template 05: Fact-Driven**: Start with a surprising industry fact -> Ask a related pain point question -> Offer solution with urgency.
  6.  **Template 06: Customer Review**: Use a customer testimonial as the main copy -> Add social proof -> Call to action.
  7.  **Template 07: Future Pacing**: "Imagine..." feeling the benefit -> "Imagine..." the pain point gone -> Pitch the product as the way to achieve it.
  8.  **Template 08: Benefit-Driven List**: List multiple benefits as headlines, each followed by a short description.
  9.  **Template 09: "Did You Know?" Hook**: Start with a surprising question/fact -> Provide a related fact -> Offer product as a way to leverage this information.
  10. **Template 10: Niche Targeting**: Address a specific audience and their unique pain point -> "Nobody understands..." -> Offer product as the solution.
  11. **Template 11: Emotional Question**: Ask an emotional question related to a social proof statistic -> Address the emotional pain point -> Urgent call to action.
  12. **Template 12: Action Verbs**: Start each benefit statement with a strong action verb (e.g., Absorb, Smash, Sprinkle).
  13. **Template 13: "Or Do You?" Challenge**: State a common, difficult way to solve a problem -> Ask "Or do you?" -> Introduce your easy solution with social proof.
  14. **Template 14: Competitor Call-out**: Claim your product is better than a well-known competitor -> Challenge the user to try -> Remind them of the key benefit.
  15. **Template 15: Justify Weakness**: Acknowledge a perceived weakness (e.g., high price) -> Justify it with a major strength (e.g., superior quality) -> Call to action to join an "elite" group.
  `;

  const audiencePrompt = `
**Step 2: Generate Core Audience Sets (In English)**
- Generate ${numCoreAudienceSets} unique "Core Audience Sets". Each set should target a slightly different angle (e.g., one focused on value, one on specific needs).
- Each set must include: title, reasoning (in English), age, gender, location, relationship (array), education (array), profession (array), interests (array), and behaviors (array).
- **Crucially for 'education' and 'profession'**: Provide a detailed list of specific keywords that are valid Facebook demographic targeting options. For example, for 'education', list specific 'Fields of Study' or 'Education Levels'. For 'profession', list specific 'Job Titles' or 'Industries' relevant to the product category.
- All targeting keywords (interests, behaviors, education, profession, relationship) MUST be specific, valid Facebook targeting options.

${generateCustomAudiences ? `
**Step 3: Generate Custom Audience Suggestions (In English)**
- Provide 2-3 specific "Custom Audience" suggestions for retargeting.
- These should be based on website visitors, video viewers, or page engagement.
- Each suggestion must have a "title", "description", and a "how_to" guide for Facebook Ads Manager.
` : ''}

${generateLookalikeAudiences ? `
**Step 4: Generate Lookalike Audience Suggestions (In English)**
- Provide 2 "Lookalike Audience" suggestions.
- These should be based on high-value customer lists or converters.
- Each suggestion must have a "title", "description", and a "how_to" guide for Facebook Ads Manager.
` : ''}

**Step 5: Generate Audience Reasoning (In Bengali)**
- Provide a detailed paragraph in Bengali explaining the overall audience strategy.
`;

  const campaignTypeInstruction = campaignType
    ? `*   **Campaign Type:** ${CAMPAIGN_DETAILS[campaignType].name} - ${CAMPAIGN_DETAILS[campaignType].description}. All generated content must strictly follow the concept of this campaign type.`
    : `*   **Campaign Type:** General purpose (no specific type selected).`;


  const prompt = `You are a world-class Bengali copywriter and Facebook Ads strategist. You are an expert at using proven copywriting formulas to create high-conversion ad copy and detailed audience targeting strategies. Your primary language for copy is Bengali, but for Facebook targeting options, you MUST use English.
Your task is to generate a complete marketing asset package for a product based on the details provided.

**CRITICAL INSTRUCTION:** Your entire response MUST be a single, valid JSON object that conforms to the provided schema. Do not add any text before or after the JSON object. Do not use markdown (e.g., \`\`\`json).

### **Copywriting Formulas**
You must use these formulas to structure the ad copy. For each of the ${numVariations} variations, you MUST select one of these 15 formulas.
${captionTemplates}

### **Content Generation Steps**

**Step 1: Generate Content Variations**
- Generate exactly ${numVariations} unique variations in Bengali.
- For each variation, randomly select one of the 15 formulas.
- Structure each variation into: Hook, Body, and CTA.
- **Body:** This must be very detailed, persuasive, and **between 300-500 words long**. Use storytelling, address pain points, and explain benefits in-depth.
- **Reasoning:** Briefly explain in Bengali which formula you used.

${audiencePrompt}

### **Product & Campaign Details**
*   **Product Name:** ${name}
*   **Product Description:** ${description}
*   **Target Audience Hint:** ${audienceDescription}
${campaignTypeInstruction}

--- START GENERATION ---
`;
  
  const audienceSuggestionSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        how_to: { type: Type.STRING },
      },
      required: ["title", "description", "how_to"],
  };

  const responseSchema = {
      type: Type.OBJECT,
      properties: {
          variations: {
              type: Type.ARRAY,
              description: "An array of generated content variations.",
              items: {
                  type: Type.OBJECT,
                  properties: {
                      id: { type: Type.INTEGER },
                      formula_name: { type: Type.STRING },
                      hook: { type: Type.STRING },
                      body: { type: Type.STRING },
                      cta: { type: Type.STRING },
                      reasoning: { type: Type.STRING },
                  },
                  required: ["id", "formula_name", "hook", "body", "cta", "reasoning"],
              },
          },
          coreAudienceSets: {
              type: Type.ARRAY,
              items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    reasoning: { type: Type.STRING },
                    age: { type: Type.STRING },
                    gender: { type: Type.STRING },
                    location: { type: Type.STRING },
                    relationship: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array of Facebook relationship statuses." },
                    education: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array of Facebook education targeting options (levels, fields of study)." },
                    profession: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array of Facebook profession targeting options (job titles, industries)." },
                    interests: { type: Type.ARRAY, items: { type: Type.STRING } },
                    behaviors: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ["title", "reasoning", "age", "gender", "location", "relationship", "education", "profession", "interests", "behaviors"]
              }
          },
          customAudienceSuggestions: {
              type: Type.ARRAY,
              items: audienceSuggestionSchema,
          },
          lookalikeAudienceSuggestions: {
              type: Type.ARRAY,
              items: audienceSuggestionSchema,
          },
          audienceReasoning: { type: Type.STRING }
      },
      required: ["variations", "coreAudienceSets", "audienceReasoning"],
  };

  try {
     const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema,
        }
     });

    const responseText = response.text.trim();
    if (!responseText) throw new Error("AI থেকে কোনো উত্তর পাওয়া যায়নি।");

    const parsedJson = JSON.parse(responseText);
    if (!parsedJson.customAudienceSuggestions) parsedJson.customAudienceSuggestions = [];
    if (!parsedJson.lookalikeAudienceSuggestions) parsedJson.lookalikeAudienceSuggestions = [];
    return parsedJson;

  } catch (error) {
    throw new Error(parseApiError(error));
  }
}

async function processBusinessProblemAnalysis(
  imageBase64: string,
  problemDescription: string
): Promise<AnalysisResult> {
  const ai = getAiClient();
  
  const userDescriptionPrompt = problemDescription
    ? `Additionally, the user has provided the following text description of their problem: "${problemDescription}"\nPlease consider BOTH the image and this text for a complete and more accurate analysis.`
    : 'Please analyze the problem based solely on the image provided.';

  const prompt = `
You are a powerful multimodal business consultant AI, specializing in the Bangladeshi market. Your analysis should be exceptionally detailed, insightful, and professional, delivered in natural-sounding Bengali.

**CRITICAL INSTRUCTION:** Your entire response MUST be a single, valid JSON object that conforms to the provided schema. Do not add any text before or after the JSON object. Do not use markdown (e.g., \`\`\`json).

All text values in the JSON object must be in professional, clear, and natural Bengali.
The priority value for solutions MUST be one of these exact Bengali words: "High", "Medium", or "Low".

Now, analyze the image and the following user description:
${userDescriptionPrompt}
`;
  
  const match = imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!match) throw new Error("অবৈধ ছবির ফরম্যাট।");
  
  const mimeType = match[1];
  const data = match[2];

  const imagePart = { inlineData: { mimeType, data } };
  const textPart = { text: prompt };

  const analysisResultSchema = {
    type: Type.OBJECT,
    properties: {
      problem_summary: { type: Type.STRING, description: "A concise, one-sentence summary of the core problem in natural Bengali." },
      detailed_analysis: { type: Type.STRING, description: "A comprehensive paragraph explaining the probable causes in detailed, natural Bengali." },
      impact_assessment: { type: Type.STRING, description: "A paragraph explaining the potential negative business impacts in professional Bengali." },
      solutions: {
        type: Type.ARRAY,
        description: "An array of actionable solutions.",
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A clear, short title for the solution in Bengali." },
            steps: {
              type: Type.ARRAY,
              description: "A list of specific, actionable steps to implement the solution.",
              items: { type: Type.STRING }
            },
            priority: {
              type: Type.STRING,
              description: "Priority level: 'High', 'Medium', or 'Low' in Bengali.",
              enum: ['High', 'Medium', 'Low']
            }
          },
          required: ['title', 'steps', 'priority']
        }
      }
    },
    required: ['problem_summary', 'detailed_analysis', 'impact_assessment', 'solutions']
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart, imagePart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisResultSchema,
      }
    });
    
    const responseText = response.text.trim();
    if (!responseText) throw new Error("AI থেকে কোনো উত্তর পাওয়া যায়নি।");
    return JSON.parse(responseText);
    
  } catch (error) {
    throw new Error(parseApiError(error));
  }
};

async function processAdMetricsAnalysis(
  sheetUrl: string
): Promise<SheetAnalysisResult> {
  const ai = getAiClient();
  const createSeedFromUrl = (url: string): number => {
      let hash = 0;
      for (let i = 0; i < url.length; i++) {
          const char = url.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash |= 0;
      }
      return Math.abs(hash);
  };
  
  const seed = createSeedFromUrl(sheetUrl);

  const prompt = `
You are a world-class senior data analyst and marketing consultant AI, specializing in deep analysis of Facebook Ads performance for the Bangladeshi market. Your analysis must be practical, insightful, professional, and delivered in professional Bengali.

A user has provided a Google Sheet URL. While you cannot access external URLs, you must **simulate** a deep, cell-by-cell analysis of this data and generate a comprehensive, actionable report.

**ASSUME** the Google Sheet at the URL (${sheetUrl}) contains granular data, including columns for: Campaign Name, Ad Set Name, Ad Name/Content, Amount Spent, Reach, Impressions, Link Clicks, CTR (Link Click-Through Rate), CPC (Cost Per Click), CPM (Cost Per Mille), Conversions (e.g., Purchases, Leads), Cost per Conversion, ROAS (Return on Ad Spend), Frequency, and Video Plays, ThruPlay, as well as some demographic breakdown (Age, Gender, Location) per ad set.

**Your Task:**
Based on this assumed rich data structure, perform a thorough analysis. Go beyond surface-level observations. Identify underlying trends, gaps, and opportunities. Your output should empower the user to make data-driven decisions.

**Analysis Steps to Simulate:**
1.  **Standard Analysis:**
    *   Calculate a 'health_score' (0-100) and provide 'health_score_reasoning'.
    *   Write a concise 'overall_summary' and list critical 'key_insights'.
    *   Identify 'top_performers' and 'underperformers' (campaign, ad set, ad).
    *   Detail specific 'performance_gaps'.
    *   Provide a list of prioritized 'recommendations', each with a priority number (1 being highest), title, reasoning, and action steps.

2.  **Advanced Analysis (New Sections):**
    *   **'deep_dive_analysis':** Provide 2-3 detailed insights by correlating different metrics. Examples: Analyze the drop-off from 'Link Clicks' to 'Conversions', or the relationship between 'Frequency' and 'CTR'.
    *   **'audience_insights':** Based on assumed demographic data in ad sets, identify the best and worst performing audience segments. Provide at least one 'Top Performer' and one 'Underperformer'. Include the 'audience_segment' name, 'key_metric', 'metric_value', and a 'suggestion'.
    *   **'creative_insights':** Based on assumed ad names (e.g., "Video Ad 1", "Image Ad - Offer"), compare the performance of different creative types ('Video', 'Image', 'Carousel'). State the 'trend' and 'reasoning'.
    *   **'forecasts':** Provide 1-2 realistic performance forecasts. Each should include the 'metric', 'projected_value', 'timeline', and the 'condition' for the forecast to be true.

**CRITICAL INSTRUCTION:** Your entire response MUST be a single, valid JSON object that conforms to the provided schema. Do not use markdown. All text must be in natural, professional Bengali.

--- START GENERATION ---
`;

  const performanceMetricSchema = {
    type: Type.OBJECT,
    properties: {
      entity_type: {
        type: Type.STRING,
        description: "Type of entity, e.g., 'ক্যাম্পেইন', 'এড সেট', 'কনটেন্ট'.",
        enum: ['ক্যাম্পেইন', 'এড সেট', 'কনটেন্ট']
      },
      name: { type: Type.STRING, description: "Name of the campaign, ad set, or ad." },
      metric: { type: Type.STRING, description: "The key metric making it perform, e.g., 'সর্বাধিক ROAS'." },
      value: { type: Type.STRING, description: "The value of the metric, e.g., '7.5x'." },
      reason: { type: Type.STRING, description: "A short reason for its performance." }
    },
    required: ['entity_type', 'name', 'metric', 'value', 'reason']
  };

  const sheetAnalysisResultSchema = {
    type: Type.OBJECT,
    properties: {
      health_score: { type: Type.NUMBER, description: "A score from 0-100 representing campaign health." },
      health_score_reasoning: { type: Type.STRING, description: "A short reasoning for the health score." },
      overall_summary: { type: Type.STRING, description: "A detailed summary of the campaign performance in Bengali." },
      key_insights: { type: Type.ARRAY, items: { type: Type.STRING } },
      top_performers: { type: Type.ARRAY, items: performanceMetricSchema },
      underperformers: { type: Type.ARRAY, items: performanceMetricSchema },
      performance_gaps: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            area: { type: Type.STRING },
            description: { type: Type.STRING },
            implication: { type: Type.STRING },
            suggestion: { type: Type.STRING }
          },
          required: ['area', 'description', 'implication', 'suggestion']
        }
      },
      recommendations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            priority: {type: Type.NUMBER },
            title: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            action_steps: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['priority', 'title', 'reasoning', 'action_steps']
        }
      },
      deep_dive_analysis: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                observation: { type: Type.STRING },
                hypothesis: { type: Type.STRING },
                recommendation: { type: Type.STRING }
            },
            required: ['title', 'observation', 'hypothesis', 'recommendation']
        }
      },
      audience_insights: {
          type: Type.ARRAY,
          items: {
              type: Type.OBJECT,
              properties: {
                  audience_segment: { type: Type.STRING },
                  key_metric: { type: Type.STRING },
                  metric_value: { type: Type.STRING },
                  performance_level: { type: Type.STRING, enum: ['Top Performer', 'Underperformer'] },
                  suggestion: { type: Type.STRING }
              },
              required: ['audience_segment', 'key_metric', 'metric_value', 'performance_level', 'suggestion']
          }
      },
      creative_insights: {
          type: Type.ARRAY,
          items: {
              type: Type.OBJECT,
              properties: {
                  creative_type: { type: Type.STRING, enum: ['Video', 'Image', 'Carousel'] },
                  trend: { type: Type.STRING },
                  reasoning: { type: Type.STRING }
              },
              required: ['creative_type', 'trend', 'reasoning']
          }
      },
      forecasts: {
          type: Type.ARRAY,
          items: {
              type: Type.OBJECT,
              properties: {
                  metric: { type: Type.STRING },
                  projected_value: { type: Type.STRING },
                  timeline: { type: Type.STRING },
                  condition: { type: Type.STRING }
              },
              required: ['metric', 'projected_value', 'timeline', 'condition']
          }
      }
    },
    required: ['health_score', 'health_score_reasoning', 'overall_summary', 'key_insights', 'top_performers', 'underperformers', 'performance_gaps', 'recommendations', 'deep_dive_analysis', 'audience_insights', 'creative_insights', 'forecasts']
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: sheetAnalysisResultSchema,
        seed: seed, // ফলাফল একই URL-এর জন্য ডিটারমিনিস্টিক করা
      }
    });

    const responseText = response.text.trim();
    if (!responseText) throw new Error("AI থেকে কোনো উত্তর পাওয়া যায়নি।");
    return JSON.parse(responseText);

  } catch (error) {
    throw new Error(parseApiError(error));
  }
};

async function processSocialPostGeneration(
  productInfo: ProductInfo
): Promise<{ postText: string; imagePrompt: string }> {
    const ai = getAiClient();
    const { name, description, category, price, currency } = productInfo;
    
    const prompt = `
You are an expert viral content creator specializing in engaging Facebook and Instagram posts for the Bangladeshi audience. Your tone should be modern, friendly, and highly engaging.
Based on the provided product information, I need you to generate a Facebook post.
The post MUST include:
1. A catchy opening line to grab attention.
2. The main body of the post (concise, under 80 words).
3. An engaging question to encourage comments and interaction.
4. A clear and strong Call-To-Action (e.g., 'সম্পূর্ণ দেখতে ইনবক্স করুন', 'অর্ডার করতে ক্লিক করুন', 'আপনার মতামত জানান').
5. 3-4 relevant and trending Bengali/Banglish hashtags.

Also, create a descriptive prompt for an AI image generator. The image prompt MUST be in English, be highly descriptive for a photorealistic image, and suggest a specific artistic style (e.g., 'cinematic lighting, vibrant colors', 'minimalist and clean, on a pastel background', 'dynamic action shot showing the product in use').

Return a single, valid, minified JSON object with NO other text before or after it. Do not use markdown.
The JSON must have two keys:
1. "postText": The Bengali Facebook post, with each part on a new line for readability.
2. "imagePrompt": The English prompt for the image generator.

Product Information:
- Name: ${name}
- Description: ${description}
- Category: ${category}
- Price: ${price} ${currency}
`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            postText: { type: Type.STRING, description: "The generated Facebook post in Bengali." },
            imagePrompt: { type: Type.STRING, description: "The prompt for the image generator in English." },
        },
        required: ["postText", "imagePrompt"],
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema,
            },
        });

        const responseText = response.text.trim();
        if (!responseText) throw new Error("AI থেকে কোনো উত্তর পাওয়া যায়নি।");
        return JSON.parse(responseText);
    } catch (error) {
        throw new Error(parseApiError(error));
    }
};

async function processImageGeneration(prompt: string): Promise<string> {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '1:1',
            },
        });

        if (!response.generatedImages || response.generatedImages.length === 0) {
            throw new Error("AI কোনো ছবি তৈরি করতে পারেনি।");
        }
        
        return response.generatedImages[0].image.imageBytes;
    } catch (error) {
        throw new Error(parseApiError(error));
    }
};

async function processVideoScriptGeneration(adCopy: string): Promise<VideoScript> {
    const ai = getAiClient();
    const prompt = `
You are a professional video scriptwriter for short, punchy social media ads (like Facebook/Instagram Reels or YouTube Shorts). Your output MUST be in a specific JSON format. All text should be in Bengali.

**Task:** Convert the following ad copy into a 3-5 scene video script.

**Ad Copy:**
---
${adCopy}
---

**Instructions:**
1.  **Analyze the ad copy:** Identify the hook, key benefits/features, and the call to action.
2.  **Create a Title:** Give the video script a short, catchy title in Bengali.
3.  **Develop Scenes:** Break the script into 3 to 5 scenes.
4.  **For each scene, provide:**
    *   'sceneNumber': An integer starting from 1.
    *   'visuals': A short, clear description of what is happening visually in the scene (in Bengali). Suggest dynamic shots, close-ups, and engaging visuals.
    *   'voiceover': The voiceover text for the scene (in Bengali). This should be natural and conversational.
    *   'onScreenText': Short, impactful text or keywords to display on the screen (in Bengali). This should complement the voiceover, not just repeat it.

**CRITICAL:** Your entire output must be a single, valid JSON object conforming to the schema. No extra text or markdown.
`;

    const videoScriptSchema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: "The title of the video script in Bengali." },
            scenes: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        sceneNumber: { type: Type.INTEGER },
                        visuals: { type: Type.STRING, description: "Visual description for the scene in Bengali." },
                        voiceover: { type: Type.STRING, description: "Voiceover text for the scene in Bengali." },
                        onScreenText: { type: Type.STRING, description: "On-screen text for the scene in Bengali." }
                    },
                    required: ["sceneNumber", "visuals", "voiceover", "onScreenText"]
                }
            }
        },
        required: ["title", "scenes"]
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: videoScriptSchema
            }
        });
        const responseText = response.text.trim();
        if (!responseText) throw new Error("AI থেকে কোনো ভিডিও স্ক্রিপ্ট তৈরি করা সম্ভব হয়নি।");
        return JSON.parse(responseText);
    } catch (error) {
        throw new Error(parseApiError(error));
    }
};

async function processCampaignStrategyGeneration(productInfo: ProductInfo, goal: CampaignGoal, totalBudget: number): Promise<CampaignStrategy> {
    const ai = getAiClient();
    const goalMap = {
        'BRAND_AWARENESS': 'ব্র্যান্ড সচেতনতা বৃদ্ধি করা। নতুন দর্শকের কাছে পৌঁছানো এবং ব্র্যান্ডকে পরিচিত করানো।',
        'LEAD_GENERATION': 'লিড সংগ্রহ করা। সম্ভাব্য গ্রাহকদের তথ্য (যেমন ইমেল, ফোন নম্বর) সংগ্রহ করা।',
        'SALES_CONVERSION': 'সরাসরি বিক্রয় বৃদ্ধি করা। গ্রাহকদের পণ্য কিনতে উৎসাহিত করা।'
    };

    const prompt = `
You are a senior marketing strategist AI specializing in creating full-funnel digital marketing campaigns for the Bangladeshi market. Your analysis must be practical, insightful, and presented in professional Bengali.

**Task:** Create a comprehensive TOFU/MOFU/BOFU (Top of Funnel, Middle of Funnel, Bottom of Funnel) campaign strategy.

**Product & Campaign Information:**
- Product Name: ${productInfo.name}
- Description: ${productInfo.description}
- Category: ${productInfo.category}
- Price: ${productInfo.price} ${productInfo.currency}
- Target Age: ${productInfo.targetAgeStart}-${productInfo.targetAgeEnd}
- Total Campaign Budget: ${totalBudget} ${productInfo.currency}
- Primary Campaign Goal: ${goalMap[goal]}

**Instructions:**
1.  **Provide Top-Level Fields**:
    *   'strategy_title': A clear title for the campaign strategy in Bengali.
    *   'product_name': The product name.
    *   'primary_goal': The campaign goal.
    *   'total_budget': The provided total budget number.
    *   'budget_reasoning': A detailed Bengali paragraph explaining the rationale behind the budget allocation across the funnel stages, tailored to the primary campaign goal. (e.g., For SALES goal, allocate more to BOFU. For AWARENESS, more to TOFU).
2.  **Define Funnel Stages:** For each stage (TOFU, MOFU, BOFU), you must define:
    *   'stage': The funnel stage ('TOFU', 'MOFU', 'BOFU').
    *   'title': The name of the stage in Bengali (e.g., "সচেতনতা তৈরি (TOFU)").
    *   'objective': The primary goal for that specific stage in Bengali.
    *   'budget_allocation_percentage': A number (e.g., 30 for 30%) for this stage. The sum for all stages must be 100.
    *   'suggested_budget': The calculated budget amount for this stage (total_budget * percentage / 100).
    *   'content_ideas': An array of 2-3 specific content ideas for that stage.
3.  **For each content idea, provide:**
    *   'title': A catchy title for the content piece (e.g., "আপনার ঘুম ভালো হচ্ছে না? ৫টি কারণ").
    *   'description': A brief description of what the content is about and its purpose.
    *   'platform': The recommended platform (e.g., "Facebook Blog Post", "Instagram Reel", "YouTube Short", "Facebook Ad").

**CRITICAL:** Your entire output must be a single, valid JSON object conforming to the schema. No extra text or markdown. All text must be in natural, professional Bengali.
`;

    const campaignStrategySchema = {
        type: Type.OBJECT,
        properties: {
            strategy_title: { type: Type.STRING },
            product_name: { type: Type.STRING },
            primary_goal: { type: Type.STRING },
            total_budget: { type: Type.NUMBER },
            budget_reasoning: { type: Type.STRING },
            funnel: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        stage: { type: Type.STRING, enum: ['TOFU', 'MOFU', 'BOFU'] },
                        title: { type: Type.STRING },
                        objective: { type: Type.STRING },
                        budget_allocation_percentage: { type: Type.NUMBER },
                        suggested_budget: { type: Type.NUMBER },
                        content_ideas: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    platform: { type: Type.STRING },
                                },
                                required: ['title', 'description', 'platform']
                            }
                        }
                    },
                    required: ['stage', 'title', 'objective', 'budget_allocation_percentage', 'suggested_budget', 'content_ideas']
                }
            }
        },
        required: ["strategy_title", "product_name", "primary_goal", "total_budget", "budget_reasoning", "funnel"]
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: campaignStrategySchema
            }
        });
        const responseText = response.text.trim();
        if (!responseText) throw new Error("AI থেকে কোনো ক্যাম্পেইন স্ট্র্যাটেজি তৈরি করা সম্ভব হয়নি।");
        return JSON.parse(responseText);
    } catch (error) {
        throw new Error(parseApiError(error));
    }
};

async function processCompetitorAnalysisGeneration(
    keyword: string,
    competitorInfo: string,
    myProductInfo: string,
    imageBase64: string | null = null
): Promise<CompetitorAnalysisResult> {
    const ai = getAiClient();
    const myProductPrompt = myProductInfo
        ? `For context, here is information about the user's own product: "${myProductInfo}". The USP should be tailored for this product.`
        : "The user has not provided information about their own product, so the USP should be a general recommendation based on the market gap.";

    const imageAnalysisPrompt = imageBase64
        ? `**Image Analysis:** In addition to the text, the user has provided an image of a competitor's product or advertisement. You MUST analyze this image as a primary source of information. Look for details like: product presentation, packaging, pricing if visible, ad design, and overall sentiment. Integrate insights from the image directly into your analysis of Strengths, Weaknesses, and Market Gap.`
        : '';
        
    const competitorInfoSource = competitorInfo 
        ? `**Competitor Ad Information (from text):** """${competitorInfo}"""`
        : `**Competitor Ad Information (from text):** The user has not provided text-based information, rely primarily on the provided image for analysis.`;

    const prompt = `
You are a world-class market research analyst and marketing strategist, with deep expertise in the Bangladeshi e-commerce and social media landscape. You will be given information scraped from the Facebook Ad Library about competitors for a specific keyword. Your task is to perform a deep analysis and generate a comprehensive strategic report in professional, natural-sounding Bengali.

**User Provided Information:**
- **Keyword:** "${keyword}"
${imageAnalysisPrompt}
- ${competitorInfoSource}
- **User's Product Information:** ${myProductPrompt}

**Your Analysis Task (All output must be in Bengali):**
1.  **Analysis Summary:** Read through all the competitor information (text and/or image). Write a concise summary of the overall competitive landscape.
2.  **Competitor Count Estimation:** Based on the provided data, give a realistic estimation of the number of competitors (e.g., "কমপক্ষে ৫-৭ জন সক্রিয় প্রতিযোগী রয়েছে", "অনেক প্রতিযোগী, ১০ জনের বেশি").
3.  **Common Strengths (Good Sides):** Identify 2-3 common strengths or effective tactics you see across the competitor ads. For each, provide a 'title' and a 'description'.
4.  **Common Weaknesses (Bad Sides):** Identify 2-3 common weaknesses, missed opportunities, or ineffective tactics. For each, provide a 'title' and a 'description'.
5.  **Market Gap Analysis:** Based on the weaknesses, identify the biggest strategic market gap. Describe this opportunity clearly.
6.  **Suggested USP (Unique Selling Proposition):** Formulate a powerful USP for the user's product that directly targets the identified market gap.
7.  **Winning Content Strategy:** Create a step-by-step content strategy to win the market using the new USP. Provide 3-4 concrete steps. Each step should have a title and a detailed description of the action to be taken.

**CRITICAL INSTRUCTION:** Your entire response MUST be a single, valid JSON object that conforms to the provided schema. Do not add any text before or after the JSON object. Do not use markdown.
`;

    const competitorAnalysisSchema = {
        type: Type.OBJECT,
        properties: {
            analysis_summary: { type: Type.STRING, description: "A summary of the competitive landscape in Bengali." },
            competitor_count_estimation: { type: Type.STRING, description: "An estimation of the number of competitors in Bengali." },
            common_strengths: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING }
                    },
                    required: ["title", "description"]
                }
            },
            common_weaknesses: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING }
                    },
                    required: ["title", "description"]
                }
            },
            market_gap_analysis: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING }
                },
                required: ["title", "description"]
            },
            suggested_usp: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING }
                },
                required: ["title", "description"]
            },
            winning_content_strategy: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    steps: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                step_number: { type: Type.INTEGER },
                                title: { type: Type.STRING },
                                description: { type: Type.STRING }
                            },
                            required: ["step_number", "title", "description"]
                        }
                    }
                },
                required: ["title", "steps"]
            }
        },
        required: ["analysis_summary", "competitor_count_estimation", "common_strengths", "common_weaknesses", "market_gap_analysis", "suggested_usp", "winning_content_strategy"]
    };

    try {
        const config = {
            responseMimeType: "application/json",
            responseSchema: competitorAnalysisSchema
        };
        
        const contents: { parts: any[] } = { parts: [{ text: prompt }] };

        if (imageBase64) {
            const match = imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
            if (!match) throw new Error("অবৈধ ছবির ফরম্যাট।");
            const mimeType = match[1];
            const data = match[2];
            contents.parts.push({ inlineData: { mimeType, data } });
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config
        });
        
        const responseText = response.text.trim();
        if (!responseText) throw new Error("AI থেকে কোনো বিশ্লেষণ তৈরি করা সম্ভব হয়নি।");
        return JSON.parse(responseText);
    } catch (error) {
        throw new Error(parseApiError(error));
    }
};

// --- Main Serverless Function Handler ---
export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { action, payload } = req.body;

    try {
        let result;
        switch (action) {
            case 'generateMarketingContent':
                result = await processMarketingContentGeneration(payload.productInfo, payload.plan, payload.campaignType);
                break;
            case 'analyzeBusinessProblemFromImage':
                result = await processBusinessProblemAnalysis(payload.imageBase64, payload.problemDescription);
                break;
            case 'analyzeAdMetricsFromSheet':
                result = await processAdMetricsAnalysis(payload.sheetUrl);
                break;
            case 'generateSocialPostContent':
                result = await processSocialPostGeneration(payload.productInfo);
                break;
            case 'generateImageForPost':
                result = await processImageGeneration(payload.prompt);
                break;
            case 'generateVideoScript':
                result = await processVideoScriptGeneration(payload.adCopy);
                break;
            case 'generateCampaignStrategy':
                result = await processCampaignStrategyGeneration(payload.productInfo, payload.goal, payload.totalBudget);
                break;
            case 'generateCompetitorAnalysis':
                result = await processCompetitorAnalysisGeneration(payload.keyword, payload.competitorInfo, payload.myProductInfo, payload.imageBase64);
                break;
            default:
                return res.status(400).json({ error: 'Invalid action' });
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error(`Error processing action "${action}":`, error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred on the server.';
        return res.status(500).json({ error: errorMessage });
    }
}
