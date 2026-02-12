import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './store/slices/authSlice';
import { NotificationProvider } from './contexts/NotificationContext';
import StartPage from './pages/StartPage';
import MainPage from './pages/MainPage';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  console.log('ProtectedRoute:', { isAuthenticated, loading });

  if (isAuthenticated) {
    return children;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return <Navigate to="/" replace />;
};

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route
              path="/main"
              element={
                <ProtectedRoute>
                  <MainPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;


