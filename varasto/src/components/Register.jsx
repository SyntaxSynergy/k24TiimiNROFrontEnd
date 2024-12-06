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
    <div className="bg">
    <div className='register-page'>
      <h1 className='register-heading'>Luo tili</h1>
      <div className='register-container'>
        <form onSubmit={handleSubmit} className='register-form'>
          <div className='input-group'>
            <label>Etunimi:</label>
            <input
              type="text"
              value={etunimi}
              onChange={(e) => setEtunimi(e.target.value)}
              placeholder="Anna etunimesi"
              required
            />
          </div>

          <div className='input-group'>
            <label>Sukunimi:</label>
            <input
              type="text"
              value={sukunimi}
              onChange={(e) => setSukunimi(e.target.value)}
              placeholder="Anna sukunimesi"
              required
            />
          </div>

          <div className='form-footer'>
            <button type="submit" className='register-btn'>Luo tili</button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}

export default Register;