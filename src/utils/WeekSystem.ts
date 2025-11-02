export interface WeekInfo {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  isComplete: boolean;
}

const CHARITY_WALK_START_DATE = new Date('2025-10-10T00:00:00+13:00'); // Changed to Oct 10
const TOTAL_WEEKS = 10;

export const getCurrentWeek = (): number => {
  const now = new Date();
  const startDate = new Date(CHARITY_WALK_START_DATE);
  
  const diffTime = now.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const weeksPassed = Math.floor(diffDays / 7);
  
  const currentWeek = Math.min(Math.max(weeksPassed + 1, 1), TOTAL_WEEKS);
  return currentWeek;
};

export const getWeekInfo = (weekNumber: number): WeekInfo => {
  const startDate = new Date(CHARITY_WALK_START_DATE);
  startDate.setDate(startDate.getDate() + (weekNumber - 1) * 7);
  
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);
  
  const now = new Date();
  const isActive = weekNumber === getCurrentWeek();
  const isComplete = now > endDate;
  
  return {
    weekNumber,
    startDate,
    endDate,
    isActive,
    isComplete
  };
};

export const getAllWeeks = (): WeekInfo[] => {
  const weeks: WeekInfo[] = [];
  const currentWeek = getCurrentWeek();
  
  // Show weeks 1 through current week (up to TOTAL_WEEKS)
  for (let i = 1; i <= Math.max(currentWeek, 1); i++) {
    weeks.push(getWeekInfo(i));
  }
  
  return weeks;
};

export const getAvailableWeeks = async (): Promise<WeekInfo[]> => {
  // You could also fetch from backend to see which weeks have data
  // For now, return all weeks up to current
  return getAllWeeks();
};

export const formatWeekStats = (weekNumber: number): string => {
  // You might want to fetch real stats from your backend eventually
  const stats = {
    totalSteps: 99000000,
    participants: 9000,
    dollarsRaised: 999000
  };
  
  return `${(stats.totalSteps / 1000000).toFixed(0)}M Steps • ${(stats.participants / 1000).toFixed(0)}k Participants • $${(stats.dollarsRaised / 1000).toFixed(0)}k Raised`;
};

// Helper function to format week date range
export const formatWeekRange = (weekInfo: WeekInfo): string => {
  const startStr = weekInfo.startDate.toLocaleDateString('en-NZ', { 
    month: 'short', 
    day: 'numeric' 
  });
  const endStr = weekInfo.endDate.toLocaleDateString('en-NZ', { 
    month: 'short', 
    day: 'numeric' 
  });
  return `${startStr} - ${endStr}`;
};