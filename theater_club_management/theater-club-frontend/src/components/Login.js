import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:3001/api/login', { username, password })
            .then(response => {
                if (response.data.success) {
                    setUser(response.data.user);
                    setMessage('Login successful!');
                    navigate('/account');
                } else {
                    setMessage('Invalid credentials');
                }
            })
            .catch(error => {
                setMessage('Login failed. Please try again.');
                console.error('There was an error!', error);
            });
    };

    return (
        <div className="container my-4">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username:</label>
                    <input 
                        type="text" 
                        className="form-control"
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input 
                        type="password" 
                        className="form-control"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">Login</button>
            </form>
            {message && <p className="mt-3">{message}</p>}
        </div>
    );
};

export default Login;
