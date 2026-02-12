import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadHistory } from '../store/slices/pointsSlice';
import { getRandomBackground } from '../utils/backgroundUtils';
import Header from '../components/Header';
import PointInputForm from '../components/PointInputForm';
import CoordinatePlot from '../components/CoordinatePlot';
import ResultsTable from '../components/ResultsTable';
import './MainPage.css';

const MainPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useSelector((state) => state.auth);
  const { loading: pointsLoading } = useSelector((state) => state.points);
  const [r, setR] = useState(1);
  const [backgroundImage, setBackgroundImage] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadHistory({ offset: 0, limit: 20 })).catch((error) => {
        console.error('Error loading history:', error);
      });
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const bg = getRandomBackground();
    setBackgroundImage(bg);
  }, []);

  const handleRChange = (newR) => {
    setR(newR);
  };

  console.log('MainPage:', { isAuthenticated, authLoading, pointsLoading });

  if (authLoading) {
    return <div>Загрузка...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

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
    <div className="main-page" style={backgroundStyle}>
      <Header showLogout />
      
      <div className="main-content">
        <div className="left-section">
          <CoordinatePlot r={r} onRChange={handleRChange} />
        </div>
        
        <div className="right-section">
          <PointInputForm onRChange={handleRChange} />
        </div>
      </div>

      <div className="results-section">
        <div className="results-header">
          <h2>Результаты</h2>
        </div>
        <ResultsTable />
      </div>
    </div>
  );
};

export default MainPage;


