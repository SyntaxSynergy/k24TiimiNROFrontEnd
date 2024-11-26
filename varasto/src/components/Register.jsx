import React, { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const user = {
        username: username,
        passwordHash: passwordHash,
        role: role
    };

    try {
        const response = await fetch(process.env.REACT_APP_API_USERS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (response.ok) {
            alert('User registered successfully');
            setUsername('');
            setPassword('');
        } else {
            const errorData = await response.json();
            alert(`Failed to register user: ${errorData.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error registering user');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;