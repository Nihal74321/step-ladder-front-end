export interface User {
  uuid: string;
  tag: string;
  username: string;
  email: string;
  total_steps: number;
  step_counter: {
    [key: string]: [number, number, number];
  };
  weeklyStats?: {
    dailyAverage: number;
    totalDistance: number;
    estimatedTime: number;
    weeklyData: Array<{ date: string; steps: number }>;
  };
  history?: Array<{ date: string; steps: number }>;
}

export interface LeaderboardEntry {
  uuid: string;
  username: string;
  total_steps: number;
  positions: number[];
  trend: number; // -1, 0, 1
  avatar?: string;
  rank: number;
  tag?: string;
  week: number;
  daily_breakdown: { [key: string]: number };
}

export interface WeekData {
  step_counter: {
    [key: string]: [number, number, number];
  };
  total_steps: number;
  position: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}