// services/marketingApi.ts
/**
 * @file This file now acts as a true API client for the frontend.
 * It makes network requests (using fetch) to a secure serverless function
 * endpoint (/api/proxy) which then communicates with the Google Gemini API.
 * This architecture is secure and correctly handles API keys on the server-side.
 */

import type {
    ProductInfo,
    Plan,
    CampaignType,
    GeneratedContent,
    AnalysisResult,
    SheetAnalysisResult,
    VideoScript,
    CampaignGoal,
    CampaignStrategy,
    CompetitorAnalysisResult
} from '../types';

async function apiCall(action: string, payload: any) {
    const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, payload }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'API request failed');
    }

    return data;
}


export const generateMarketingContent = async (
    productInfo: ProductInfo,
    plan: Plan | null,
    campaignType: CampaignType | null
): Promise<GeneratedContent> => {
    return apiCall('generateMarketingContent', { productInfo, plan, campaignType });
};

export const analyzeBusinessProblemFromImage = async (
    imageBase64: string,
    problemDescription: string
): Promise<AnalysisResult> => {
    return apiCall('analyzeBusinessProblemFromImage', { imageBase64, problemDescription });
};

export const analyzeAdMetricsFromSheet = async (
    sheetUrl: string
): Promise<SheetAnalysisResult> => {
    return apiCall('analyzeAdMetricsFromSheet', { sheetUrl });
};

export const generateSocialPostContent = async (
    productInfo: ProductInfo
): Promise<{ postText: string; imagePrompt: string }> => {
    return apiCall('generateSocialPostContent', { productInfo });
};

export const generateImageForPost = async (prompt: string): Promise<string> => {
    return apiCall('generateImageForPost', { prompt });
};

export const generateVideoScript = async (adCopy: string): Promise<VideoScript> => {
    return apiCall('generateVideoScript', { adCopy });
};

export const generateCampaignStrategy = async (
    productInfo: ProductInfo,
    goal: CampaignGoal,
    totalBudget: number
): Promise<CampaignStrategy> => {
    return apiCall('generateCampaignStrategy', { productInfo, goal, totalBudget });
};

export const generateCompetitorAnalysis = async (
    keyword: string,
    competitorInfo: string,
    myProductInfo: string,
    imageBase64: string | null = null
): Promise<CompetitorAnalysisResult> => {
    return apiCall('generateCompetitorAnalysis', { keyword, competitorInfo, myProductInfo, imageBase64 });
};
