export interface LotteryDraw {
  issue: string;
  date: string;
  winningNumbers: number[];
}

export interface Prediction {
  issue: string;
  numbers: number[]; // The predicted numbers (e.g., a set of 10-12 numbers)
  hitCount?: number; // How many matched (calculated after draw)
  prize?: number; // Estimated prize for this prediction
}

export interface Influencer {
  id: string;
  name: string;
  avatar: string;
  title: string; // e.g., "Probability Master"
  tags: string[];
  followers: number;
  winRate: number; // Percentage
  totalProfit: number; // Currency value
  history: Prediction[]; // Last 7-10 draws
  currentRecommendation: {
    description: string;
    numbers: number[]; // The compound set
    type: string; // e.g. "Pick 10 Compound"
  };
  isFollowed: boolean;
  likes: number;
}

export interface AIRecommendation {
  id: string;
  algorithmName: string;
  description: string;
  accuracy: number;
  numbers: number[];
  confidence: number;
  risk: 'low' | 'medium' | 'high';
  recommendedStake: number;
  lastWinRate: number;
  totalPredictions: number;
  tags: string[];
  createdAt: string;
}

export interface AlgorithmInfo {
  id: string;
  name: string;
  type: string;
  description: string;
  accuracy: number;
  totalPredictions: number;
  avgConfidence: number;
  features: string[];
}

export type Tab = 'home' | 'rankings' | 'profile';