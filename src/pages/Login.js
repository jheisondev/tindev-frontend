import React, { useState } from 'react';
import './Login.css';

import api from '../services/api';
import logo from '../assets/logoTinder.svg';

export default function Login({ history }){
  const [username, setUsername] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const response = await api.post('/devs', {
      username: username,
    });
    
    const { _id } = response.data;
    history.push(`/dev/${_id}`);
  }
  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="TinDev"/>
        <p>Faça seu login</p>
        <input 
          placeholder="User GitHub"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <button type="submit">Continuar</button>
      </form>
    </div>
  );
}