import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import LogoutButton from './LogoutButton';
import './Header.css';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return <div className="header-clock">{formatTime(time)}</div>;
};

const Header = ({ showLogout = false }) => {
  const { username } = useSelector((state) => state.auth);

  return (
    <div className="header">
      <h1>Турыгин Никита Денисович P3231 Вариант 4467</h1>
      <div className="header-right">
        {username && <div className="header-username">{username}</div>}
        <Clock />
        {showLogout && (
          <div className="header-logout">
            <LogoutButton />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;


