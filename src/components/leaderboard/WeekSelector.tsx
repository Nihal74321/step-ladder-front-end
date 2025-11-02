import React from 'react';
import { WeekInfo } from '../../utils/WeekSystem';
import './WeekSelector.css';

interface WeekSelectorProps {
  selectedWeek: number;
  onWeekChange: (week: number) => void;
  availableWeeks: WeekInfo[];
  weekStats: string;
}

export const WeekSelector: React.FC<WeekSelectorProps> = ({
  selectedWeek,
  onWeekChange,
  availableWeeks,
  weekStats,
}) => {
  const maxWeek = Math.max(...availableWeeks.map(w => w.weekNumber));
  const canGoUp = selectedWeek < maxWeek;
  const canGoDown = selectedWeek > 1;

  return (
    <div className="week-selector">
      <div className="week-selector__header">
        <button 
          className="week-selector__nav week-selector__nav--up"
          onClick={() => onWeekChange(selectedWeek + 1)}
          disabled={!canGoUp}
          aria-label="Next week"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className="week-selector__content">
          <span className="week-selector__label">Week {selectedWeek}</span>
        </div>

        <button 
          className="week-selector__nav week-selector__nav--down"
          onClick={() => onWeekChange(selectedWeek - 1)}
          disabled={!canGoDown}
          aria-label="Previous week"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};