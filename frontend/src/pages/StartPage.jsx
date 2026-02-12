import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../store/slices/authSlice';
import { getRandomBackground } from '../utils/backgroundUtils';
import Header from '../components/Header';
import './StartPage.css';

const StartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/main');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const bg = getRandomBackground();
    setBackgroundImage(bg);
  }, []);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setLocalError('');

    if (!username || !password) {
      setLocalError('Пожалуйста, введите имя пользователя и пароль');
      return;
    }

    if (isRegisterMode) {
      if (password !== confirmPassword) {
        setLocalError('Пароли не совпадают');
        return;
      }
      if (password.length < 3) {
        setLocalError('Пароль должен содержать минимум 3 символа');
        return;
      }

      console.log('Attempting registration with:', username);
      
      dispatch(register({ username, password }))
        .unwrap()
        .then((result) => {
          console.log('Registration successful:', result);
          navigate('/main');
        })
        .catch((err) => {
          console.error('Registration error:', err);
          setLocalError(err || 'Ошибка регистрации');
        });
    } else {
      console.log('Attempting login with:', username);
      
      dispatch(login({ username, password }))
        .unwrap()
        .then((result) => {
          console.log('Login successful:', result);
          navigate('/main');
        })
        .catch((err) => {
          console.error('Login error:', err);
          setLocalError(err || 'Ошибка входа');
        });
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setLocalError('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  const backgroundStyle = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }
    : {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      };

  return (
    <div className="start-page" style={backgroundStyle}>
      <Header />
      <div className="login-container">
        <h2>{isRegisterMode ? 'Регистрация' : 'Вход'}</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Имя пользователя:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          {isRegisterMode && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Подтвердите пароль:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          )}
          {(error || localError) && (
            <div className="error-message">{error || localError}</div>
          )}
          <button type="submit" disabled={loading} className="login-button">
            {loading ? (isRegisterMode ? 'Регистрация...' : 'Вход...') : (isRegisterMode ? 'Зарегистрироваться' : 'Войти')}
          </button>
        </form>
        <div className="toggle-mode">
          <span>{isRegisterMode ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}</span>
          <button type="button" onClick={toggleMode} className="toggle-button" disabled={loading}>
            {isRegisterMode ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartPage;


