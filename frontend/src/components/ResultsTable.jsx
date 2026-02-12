import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadHistory, clearHistory } from '../store/slices/pointsSlice';
import './ResultsTable.css';

const ITEMS_PER_PAGE = 20;

const ResultsTable = () => {
  const dispatch = useDispatch();
  const { points, totalCount, pageSize, loading } = useSelector((state) => state.points);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    dispatch(loadHistory({ offset, limit: ITEMS_PER_PAGE }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    const interval = setInterval(() => {
      const offset = (currentPage - 1) * ITEMS_PER_PAGE;
      dispatch(loadHistory({ offset, limit: ITEMS_PER_PAGE }));
    }, 10000);

    return () => clearInterval(interval);
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (totalCount > 0 && currentPage > Math.ceil(totalCount / ITEMS_PER_PAGE)) {
      setCurrentPage(1);
    }
  }, [totalCount, currentPage]);

  const totalPages = totalCount > 0 ? Math.ceil(totalCount / ITEMS_PER_PAGE) : 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = totalCount > 0 ? Math.min(startIndex + ITEMS_PER_PAGE, totalCount) : 0;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleClearHistory = async () => {
    if (window.confirm('Вы уверены, что хотите очистить все результаты?')) {
      try {
        await dispatch(clearHistory()).unwrap();
        setCurrentPage(1);
        dispatch(loadHistory({ offset: 0, limit: ITEMS_PER_PAGE }));
      } catch (error) {
        console.error('Error clearing history:', error);
      }
    }
  };

  if (loading && (!points || points.length === 0)) {
    return (
      <div className="results-table-container">
        <h2>Результаты</h2>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (!points || points.length === 0) {
    return (
      <div className="results-table-container">
        <h2>Результаты</h2>
        <p>Пока нет результатов</p>
      </div>
    );
  }

  return (
    <div className="results-table-container">
      <h2>Результаты</h2>
      <div className="table-wrapper">
        <table className="results-table">
          <thead>
            <tr>
              <th>Пользователь</th>
              <th>X</th>
              <th>Y</th>
              <th>R</th>
              <th>Результат</th>
              <th>Время</th>
              <th>Время выполнения</th>
            </tr>
          </thead>
          <tbody>
            {points.map((point, index) => (
              <tr key={startIndex + index} className={point.success ? 'success' : 'failure'}>
                <td>{point.username || 'Н/Д'}</td>
                <td>{point.x}</td>
                <td>{point.y}</td>
                <td>{point.r}</td>
                <td>
                  {point.success ? (
                    <span className="result-success">✅ Попадание</span>
                  ) : (
                    <span className="result-failure">❌ Промах</span>
                  )}
                </td>
                <td>{point.time || 'Н/Д'}</td>
                <td>{point.took || 'Н/Д'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination-container">
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
            >
              Назад
            </button>
            <div className="pagination-numbers">
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                  disabled={loading}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              className="pagination-button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
            >
              Вперед
            </button>
          </div>
        )}
        <button onClick={handleClearHistory} className="clear-button" disabled={loading}>
          Очистить историю
        </button>
      </div>
      <div className="pagination-info">
        Показано {startIndex + 1} - {endIndex} из {totalCount} результатов
      </div>
    </div>
  );
};

export default ResultsTable;


