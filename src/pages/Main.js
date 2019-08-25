import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';
import './Main.css';
import api from '../services/api';

import logo from '../assets/logoTinder.svg';
import coffee from '../assets/coffee.svg';
import noCoffee from '../assets/no-coffee.svg';
import itsamatch from '../assets/itsamatch.png';

export default function Main({ match }) {
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/devs', {
        headers: {
          user: match.params.id,
        }
      })
      
      setUsers(response.data);
    }
    loadUsers();
  }, [match.params.id]);

  useEffect(() => {
    const socket = io('http://localhost:3333', {
      query: { user: match.params.id }
    });

    socket.on('match', dev =>{
      setMatchDev(dev);
    })

  }, [match.params.id]);

  async function handleLike(id) {
    await api.post(`/devs/${id}/likes`, null, {
      headers: { user: match.params.id },
    })

    setUsers(users.filter(user => user._id !== id));
  }

  async function handleDislike(id) {
    await api.post(`/devs/${id}/dislikes`, null, {
      headers: { user: match.params.id },
    })

    setUsers(users.filter(user => user._id !== id));
  }


  return (
    <div className="main-container">
      { users.length === 0 ?(
        <Link to="/">
        <img src={logo} alt="Tindev" />
        </Link>
      ):(<img src={logo} alt="Tindev" />)}
      
      {users.length > 0 ?(
        <ul>
          {users.map(user => (
            <li key={user._id}>
              <img src={user.avatar} alt={user.name} />
              <footer>
                <strong>{user.name}</strong>
                <p>{user.bio}</p>
              </footer>

              <div className="buttons">
                <button type="button" onClick={() => handleDislike(user._id)}>
                  <img src={noCoffee} alt="Unfollow"/>
                  </button>
                <button type="button" onClick={() => handleLike(user._id)}>
                  <img src={coffee} alt="Follew" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty">Não a mais Devs <br/>Volte mais tarde! </div>
      )}

      {matchDev && (
        <div className="match-container">
          <img src={itsamatch} alt="It's a match" />

          <img className="avatar" src={matchDev.avatar} alt={matchDev.name} />
          <strong>{matchDev.name}</strong>
          <p>{matchDev.bio}</p>

          <button type="button" onClick={() => setMatchDev(null)}> <p>{'</>'}</p> </button>
        </div>
      )}
    </div>
  ) 
}