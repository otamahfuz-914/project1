export enum CampaignType {
  POLLING = 'POLLING',
  LOOKALIKE = 'LOOKALIKE',
  RETARGETING = 'RETARGETING',
}

export enum Plan {
  BASIC = 'BASIC',
  STANDARD = 'STANDARD',
  PRO = 'PRO',
}

export interface SocialPostContent {
  text: string;
  imagePrompt: string;
  imageUrl: string;
}

export interface User {
  email: string;
  plan: Plan | null;
  generatedContent?: GeneratedContent[];
  dailySocialPost?: {
    date: string;
    content: SocialPostContent;
  } | null;
  createdAt: string; // ISO date string
  isAdmin?: boolean;
  status?: 'active' | 'inactive';
}

export interface ProductInfo {
  name: string;
  description: string;
  price: string;
  currency: string;
  targetAgeStart: string;
  targetAgeEnd:string;
  category: string;
}

// Advanced Audience Types (Tiered Access)
export interface CoreAudienceSet {
  title: string;
  reasoning: string;
  age: string;
  gender: string;
  location: string;
  relationship: string[];
  education: string[];
  profession: string[];
  interests: string[];
  behaviors: string[];
}

export interface AudienceSuggestion {
  title: string;
  description: string;
  how_to: string; // Instructions for FB Ads Manager
}

export interface AnalyticsMetrics {
    reach: number;
    impressions: number;
    engagement: number;
    ctr: number; // percentage
    roas: number; // multiplier, e.g. 4.5x
}

export interface MarketingVariation {
  id: number;
  formula_name: string;
  hook: string;
  body: string;
  cta: string;
  reasoning: string;
  isSaved?: boolean;
  analytics?: AnalyticsMetrics;
}

export interface VideoScene {
    sceneNumber: number;
    visuals: string;
    voiceover: string;
    onScreenText: string;
}

export interface VideoScript {
    title: string;
    scenes: VideoScene[];
}

export interface GeneratedContent {
  createdAt: string; // ISO date string
  variations: MarketingVariation[];
  // audienceAvatar is deprecated, use coreAudienceSets instead
  audienceAvatar?: AudienceAvatar; 
  coreAudienceSets: CoreAudienceSet[];
  customAudienceSuggestions?: AudienceSuggestion[];
  lookalikeAudienceSuggestions?: AudienceSuggestion[];
  audienceReasoning: string;
  videoScript?: VideoScript | null;
}

// Deprecated
export interface AudienceAvatar {
  age: string;
  gender: string;
  location: string;
  relationship: string;
  education: string;
  profession: string;
  interest: string[];
  behavior: string[];
}

export interface ActionableSolution {
  title: string;
  steps: string[];
  priority: 'High' | 'Medium' | 'Low';
}

export interface AnalysisResult {
  problem_summary: string;
  detailed_analysis: string;
  impact_assessment: string;
  solutions: ActionableSolution[];
}

export type CampaignGoal = 'BRAND_AWARENESS' | 'LEAD_GENERATION' | 'SALES_CONVERSION';

export interface CampaignFunnelStage {
    stage: 'TOFU' | 'MOFU' | 'BOFU';
    title: string;
    objective: string;
    budget_allocation_percentage: number;
    suggested_budget: number;
    content_ideas: {
        title: string;
        description: string;
        platform: string;
    }[];
}

export interface CampaignStrategy {
    strategy_title: string;
    product_name: string;
    primary_goal: string;
    total_budget: number;
    budget_reasoning: string;
    funnel: CampaignFunnelStage[];
}

// --- New Types for Sheet Analysis ---
export interface PerformanceMetric {
  entity_type: 'ক্যাম্পেইন' | 'এড সেট' | 'কনটেন্ট';
  name: string;
  metric: string;
  value: string;
  reason: string;
}

export interface OptimizationRecommendation {
  priority: number;
  title: string;
  reasoning: string;
  action_steps: string[];
}

export interface PerformanceGap {
  area: string;
  description: string;
  implication: string;
  suggestion: string;
}

export interface DeepDiveInsight {
  title: string;
  observation: string;
  hypothesis: string;
  recommendation: string;
}

export interface AudiencePerformanceInsight {
  audience_segment: string;
  key_metric: string;
  metric_value: string;
  performance_level: 'Top Performer' | 'Underperformer';
  suggestion: string;
}

export interface CreativePerformanceInsight {
  creative_type: 'Video' | 'Image' | 'Carousel';
  trend: string;
  reasoning: string;
}

export interface PerformanceForecast {
  metric: string;
  projected_value: string;
  timeline: string;
  condition: string;
}

export interface SheetAnalysisResult {
  health_score: number;
  health_score_reasoning: string;
  overall_summary: string;
  key_insights: string[];
  top_performers: PerformanceMetric[];
  underperformers: PerformanceMetric[];
  performance_gaps: PerformanceGap[];
  recommendations: OptimizationRecommendation[];
  deep_dive_analysis: DeepDiveInsight[];
  audience_insights: AudiencePerformanceInsight[];
  creative_insights: CreativePerformanceInsight[];
  forecasts: PerformanceForecast[];
}
// --- End New Types ---

// --- New Types for Competitor Analysis ---
export interface CompetitorAnalysisResult {
  analysis_summary: string;
  competitor_count_estimation: string;
  common_strengths: { title: string; description: string }[];
  common_weaknesses: { title: string; description: string }[];
  market_gap_analysis: {
    title: string;
    description: string;
  };
  suggested_usp: {
    title: string;
    description: string;
  };
  winning_content_strategy: {
    title: string;
    steps: {
      step_number: number;
      title: string;
      description: string;
    }[];
  };
}
// --- End New Types ---

// --- New Type for Activity Log ---
export interface ActivityLog {
  id: string;
  timestamp: string;
  userEmail: string;
  message: string;
}
// --- End New Type ---

export type View = 'home' | 'pricing' | 'auth' | 'generator' | 'analyzer' | 'dashboard' | 'social' | 'strategist' | 'sheet-analysis' | 'competitor-analysis' | 'admin';