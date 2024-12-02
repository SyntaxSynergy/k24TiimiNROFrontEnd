import React, { useState, useEffect } from 'react';

function Register() {
  const [etunimi, setEtunimi] = useState('');
  const [sukunimi, setSukunimi] = useState('');
  const [role, setRole] = useState('USER');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      etunimi: etunimi,
      sukunimi: sukunimi,
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
        setEtunimi('');
        setSukunimi('');
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
            type="etunimi"
            value={etunimi}
            onChange={(e) => setEtunimi(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Sukunimi:</label>
          <input
            type="sukunimi"
            value={sukunimi}
            onChange={(e) => setSukunimi(e.target.value)}
            required
          />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;