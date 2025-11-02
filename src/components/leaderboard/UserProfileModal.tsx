import React, { useEffect, useState } from 'react';
import { Modal } from '../common/Modal';
import { LeaderboardEntry, User } from '../../types';
import { userService } from '../../services/apiService';
import './UserProfileModal.css';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: LeaderboardEntry | null;
  currentWeek: number;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  currentWeek,
}) => {
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      fetchUserDetails();
    }
  }, [user, isOpen]);

  const fetchUserDetails = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await userService.getUserProfile(user.uuid);
      if (response.success && response.data) {
        setUserDetails(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  const weeklyData = userDetails?.weeklyStats?.weeklyData || [];
  const maxSteps = Math.max(...weeklyData.map(d => d.steps), 1);

  const getDayOfWeek = (dateStr: string) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[new Date(dateStr).getDay()];
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDistance = (km: number) => {
    return km >= 1 ? `${km}km` : `${(km * 1000).toFixed(0)}m`;
  };

  const formatPace = (totalSteps: number) => {
    const miles = totalSteps / 2000;
    const timeMinutes = totalSteps * 0.01;
    const paceMinutes = miles > 0 ? timeMinutes / miles : 0;
    const mins = Math.floor(paceMinutes);
    const secs = Math.floor((paceMinutes - mins) * 60);
    return `${mins}'${secs.toString().padStart(2, '0')}"`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="user-profile-modal">
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
        ) : (
          <>
            <div className="user-profile__header">
              <div className="user-profile__avatar">
                <div className="profile-avatar profile-avatar--large">
                  <span>{user.username.charAt(0)}</span>
                </div>
              </div>
              <div className="user-profile__info">
                <h2 className="user-profile__name">{user.username} #{user.tag}</h2>
                <div className="user-profile__rank">
                  Ranked {user.rank}{user.rank === 1 ? 'st' : user.rank === 2 ? 'nd' : user.rank === 3 ? 'rd' : 'th'} - {user.total_steps.toLocaleString()} Steps
                </div>
                <div className="user-profile__season">Week {currentWeek} Season 1</div>
              </div>
              <div className="user-profile__trend">
                <div className={`trend-badge trend-badge--${user.trend > 0 ? 'up' : user.trend < 0 ? 'down' : 'same'}`}>
                  {user.trend > 0 ? '▲' : user.trend < 0 ? '▼' : '—'}
                  {Math.abs(user.positions?.[user.positions.length - 1] - (user.positions?.[user.positions.length - 2] || 0))}
                </div>
              </div>
            </div>

            {userDetails?.weeklyStats && (
              <div className="user-profile__stats">
                <div className="stat-card">
                  <div className="stat-card__value">{userDetails.weeklyStats.dailyAverage.toLocaleString()} Steps</div>
                  <div className="stat-card__label">Daily Average</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card__value">{formatDistance(userDetails.weeklyStats.totalDistance)}</div>
                  <div className="stat-card__label">Distance Covered</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card__value">{formatTime(userDetails.weeklyStats.estimatedTime)}</div>
                  <div className="stat-card__label">Time Spent Walking</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card__value">{formatPace(user.total_steps)}</div>
                  <div className="stat-card__label">Estimated Pace</div>
                </div>
              </div>
            )}

            {weeklyData.length > 0 && (
              <div className="user-profile__chart">
                <div className="chart-header">
                  <h3>Weekly Progress</h3>
                </div>
                <div className="chart-bars">
                  {weeklyData.map((day, index) => (
                    <div key={index} className="chart-bar">
                      <div 
                        className="chart-bar__fill"
                        style={{ 
                          height: `${(day.steps / maxSteps) * 100}%`,
                          backgroundColor: day.steps === maxSteps ? '#FFD700' : '#3D34F2'
                        }}
                      ></div>
                      <div className="chart-bar__label">{getDayOfWeek(day.date)}</div>
                      <div className="chart-bar__value">{day.steps}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {user.positions && user.positions.length > 1 && (
              <div className="user-profile__history">
                <h3>Position History</h3>
                <div className="history-items">
                  {user.positions.slice(1).map((position, index) => {
                    const previousPosition = user.positions[index];
                    const change = previousPosition - position;
                    return (
                      <div key={index} className="history-item">
                        <div className={`history-item__badge history-item__badge--${change > 0 ? 'up' : change < 0 ? 'down' : 'same'}`}>
                          {change > 0 ? '▲' : change < 0 ? '▼' : '—'}
                        </div>
                        <div className="history-item__info">
                          <div className="history-item__value">#{position}</div>
                          <div className="history-item__label">
                            Week {currentWeek - user.positions.length + index + 2}<br />
                            {change !== 0 ? `${Math.abs(change)} place${Math.abs(change) > 1 ? 's' : ''} ${change > 0 ? 'gained' : 'lost'}` : 'No change'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};