import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './App.css'; // For basic styling

const API_BASE_URL = 'http://localhost:5000/api'; // Backend API URL

function App() {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [newUserName, setNewUserName] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch initial users
        fetchUsers();

        // Connect to Socket.IO for real-time updates
        const socket = io('http://localhost:5000');

        socket.on('leaderboard_update', (updatedUsers) => {
            setUsers(updatedUsers);
            setMessage('Leaderboard updated in real-time!');
            setTimeout(() => setMessage(''), 2000); // Clear message after 2 seconds
        });

        socket.on('connect_error', (err) => {
            console.error('Socket.IO connection error:', err);
            setError('Could not connect to real-time updates. Please check backend.');
        });

        return () => socket.disconnect(); // Clean up socket connection
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`${API_BASE_URL}/users`);
            setUsers(response.data);
            // After fetching, set a default selected user if available and none is selected
            if (response.data.length > 0 && !selectedUserId) {
                setSelectedUserId(response.data[0]._id);
            }
        } catch (err) {
            setError('Failed to fetch users. Please check backend server.');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async () => {
        if (!newUserName.trim()) {
            setError('User name cannot be empty.');
            return;
        }
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const response = await axios.post(`${API_BASE_URL}/users`, { name: newUserName });
            setMessage(`User "${response.data.name}" added successfully!`);
            setNewUserName('');
            // Users will be updated via Socket.IO, so no need to re-fetch manually here.
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add user.');
            console.error('Error adding user:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleClaimPoints = async () => {
        if (!selectedUserId) {
            setError('Please select a user to claim points.');
            return;
        }
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const response = await axios.post(`${API_BASE_URL}/claims`, { userId: selectedUserId });
            setMessage(response.data.message);
            // Users will be updated via Socket.IO
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to claim points.');
            console.error('Error claiming points:', err);
        } finally {
            setLoading(false);
        }
    };

    // Separate top 3 users from the rest for distinct rendering
    const topThreeUsers = users.slice(0, 3);
    const otherUsers = users.slice(3);

    return (
        <div className="app-container">
            <div className="header">
                {/* Simplified header for this UI, can be expanded for all nav items */}
                <h1>Live Ranking</h1>
                <p className="settlement-time">Settlement time 2 days 01:45:41</p>
                {/* Placeholder for top navigation like "Party Ranking", "Hourly Ranking" */}
                <div className="header-nav">
                     <span className="nav-item active">Live Ranking</span>
                     <span className="nav-item">Party Ranking</span>
                     <span className="nav-item">Hourly Ranking</span>
                     <span className="nav-item">Family Ranking</span>
                </div>
            </div>

            <div className="controls-section">
                {/* Add User */}
                <div className="add-user-section">
                    <input
                        type="text"
                        placeholder="New user name"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                    />
                    <button onClick={handleAddUser} disabled={loading}>
                        Add User
                    </button>
                </div>

                {/* Claim Points */}
                <div className="claim-points-section">
                    <select
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        disabled={loading || users.length === 0}
                    >
                        <option value="">Select a user</option>
                        {users.map((user) => (
                            <option key={user._id} value={user._id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleClaimPoints} disabled={loading || !selectedUserId}>
                        Claim Random Points (1-10)
                    </button>
                </div>
            </div>

            {loading && <p className="status-message loading">Loading...</p>}
            {error && <p className="status-message error">{error}</p>}
            {message && <p className="status-message success">{message}</p>}

            <div className="leaderboard-section">
                {users.length > 0 ? (
                    <>
                        {/* TOP 3 CARDS */}
                        <div className="leaderboard-top-three">
                            {topThreeUsers.map((user) => (
                                <div key={user._id} className={`leaderboard-card rank-${user.rank}`}>
                                    <div className="rank-display">{user.rank}</div>
                                    <div className="user-avatar" style={{ backgroundColor: `#${Math.floor(Math.random()*16777215).toString(16)}` }}>
                                        {/* Placeholder for avatars: first letter of name */}
                                        {user.name.substring(0,1).toUpperCase()}
                                        {/* If you had actual image URLs, you'd use:
                                        <img src={user.avatarUrl} alt={user.name} className="avatar-img" /> */}
                                    </div>
                                    <div className="user-name">{user.name}</div>
                                    <div className="user-points">
                                        {user.totalPoints.toLocaleString()} <span className="points-icon">🌟</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* REST OF THE USERS (ROWS) */}
                        <div className="leaderboard-others-list">
                            {otherUsers.map((user) => (
                                <div key={user._id} className="leaderboard-row">
                                    <div className="rank-display">{user.rank}</div>
                                    <div className="user-avatar-small" style={{ backgroundColor: `#${Math.floor(Math.random()*16777215).toString(16)}` }}>
                                        {/* Placeholder for avatars in rows */}
                                        {user.name.substring(0,1).toUpperCase()}
                                    </div>
                                    <div className="user-name">{user.name}</div>
                                    <div className="user-points">
                                        {user.totalPoints.toLocaleString()} <span className="points-icon">🌟</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <p className="no-users-message">No users to display. Add some users!</p>
                )}
            </div>
        </div>
    );
}

export default App;