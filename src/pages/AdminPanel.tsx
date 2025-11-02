import React, { useState, useEffect } from 'react';
import { Button } from '../components/common/Button';
import { adminService } from '../services/apiService';
import { User } from '../types';

export const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    total_steps: 0,
    step_history: [{ date: '', steps: 0 }]
  });

  useEffect(() => {
    const token = localStorage.getItem('stepladder_token');
    if (!token) {
      setError('Please log in to access admin panel');
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await adminService.getUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        setError(response.error || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError('Could not connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await adminService.addUser(newUser);
      if (response.success) {
        fetchUsers();
        setNewUser({ 
          username: '', 
          email: '', 
          password: '', 
          total_steps: 0,
          step_history: [{ date: '', steps: 0 }]
        });
        setShowAddForm(false);
      } else {
        setError(response.error || 'Failed to add user');
      }
    } catch (error) {
      console.error('Failed to add user:', error);
      setError('Failed to add user');
    }
  };

  const handleDeleteUser = async (uuid: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await adminService.deleteUser(uuid);
      if (response.success) {
        fetchUsers();
      } else {
        setError(response.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      setError('Failed to delete user');
    }
  };

  const handlePopulateSample = async () => {
    try {
      const response = await adminService.populateSample();
      if (response.success) {
        fetchUsers();
      } else {
        setError(response.error || 'Failed to populate sample data');
      }
    } catch (error) {
      console.error('Failed to populate sample data:', error);
      setError('Failed to populate sample data');
    }
  };

  const addHistoryEntry = () => {
    setNewUser({
      ...newUser,
      step_history: [...newUser.step_history, { date: '', steps: 0 }]
    });
  };

  const updateHistoryEntry = (index: number, field: 'date' | 'steps', value: string | number) => {
    const updatedHistory = [...newUser.step_history];
    updatedHistory[index] = { ...updatedHistory[index], [field]: value };
    setNewUser({ ...newUser, step_history: updatedHistory });
  };

  const removeHistoryEntry = (index: number) => {
    const updatedHistory = newUser.step_history.filter((_, i) => i !== index);
    setNewUser({ ...newUser, step_history: updatedHistory });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', background: '#000', color: '#fff'}}>
      {error && (
        <div style={{  
          color: '#c00', 
          padding: '1rem', 
          borderRadius: '4px', 
          marginBottom: '1rem' 
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Admin Panel</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : 'Add User'}
          </Button>
          <Button onClick={handlePopulateSample} variant="secondary">
            Populate Sample Data
          </Button>
        </div>
      </div>

      {showAddForm && (
        <div style={{ 
          background: '#000',
          padding: '2rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <h3>Add New User</h3>
          <form onSubmit={handleAddUser}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <input
                type="text"
                placeholder="Username"
                value={newUser.username}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                required
                style={{ padding: '0.5rem' }}
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                required
                style={{ padding: '0.5rem' }}
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                required
                style={{ padding: '0.5rem' }}
              />
              <input
                type="number"
                placeholder="Total Steps"
                value={newUser.total_steps}
                onChange={(e) => setNewUser({...newUser, total_steps: parseInt(e.target.value) || 0})}
                style={{ padding: '0.5rem' }}
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <h4>Step History</h4>
              {newUser.step_history.map((entry, index) => (
                <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                  <input
                    type="date"
                    value={entry.date}
                    onChange={(e) => updateHistoryEntry(index, 'date', e.target.value)}
                    style={{ padding: '0.5rem' }}
                  />
                  <input
                    type="number"
                    placeholder="Steps"
                    value={entry.steps}
                    onChange={(e) => updateHistoryEntry(index, 'steps', parseInt(e.target.value) || 0)}
                    style={{ padding: '0.5rem' }}
                  />
                  <Button 
                    type="button" 
                    onClick={() => removeHistoryEntry(index)}
                    variant="secondary"
                    size="sm"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addHistoryEntry} variant="secondary" size="sm">
                Add History Entry
              </Button>
            </div>
            
            <Button type="submit">Add User</Button>
          </form>
        </div>
      )}

      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#000' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Username</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Tag</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Total Steps</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.uuid}>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>{user.username}</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>{user.email}</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>{user.tag}</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>{user.total_steps?.toLocaleString()}</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
                    <Button 
                      onClick={() => handleDeleteUser(user.uuid)}
                      variant="secondary"
                      size="sm"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};