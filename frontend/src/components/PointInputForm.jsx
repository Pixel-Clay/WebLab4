import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkPoint, loadHistory } from '../store/slices/pointsSlice';
import './PointInputForm.css';

const X_VALUES = [-3, -2, -1, 0, 1, 2, 3, 4, 5];
const R_VALUES = [-3, -2, -1, 0, 1, 2, 3, 4, 5];
const DEFAULT_R = 1;

const PointInputForm = ({ onRChange }) => {
  const dispatch = useDispatch();
  const [x, setX] = useState(null);
  const [y, setY] = useState('');
  const [r, setR] = useState(DEFAULT_R);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (onRChange) {
      onRChange(DEFAULT_R);
    }
    if (r <= 0) {
      setR(DEFAULT_R);
      if (onRChange) {
        onRChange(DEFAULT_R);
      }
    }
  }, []);

  const validate = () => {
    const newErrors = {};
    
    if (x === null || x === undefined) {
      newErrors.x = 'Необходимо выбрать X';
    } else if (!X_VALUES.includes(x)) {
      newErrors.x = 'X должен быть одним из: -3, -2, -1, 0, 1, 2, 3, 4, 5';
    }
    
    if (!y || y.trim() === '') {
      newErrors.y = 'Y обязателен';
    } else {
      const yNum = parseFloat(y);
      if (isNaN(yNum)) {
        newErrors.y = 'Y должен быть числом';
      } else if (yNum < -3 || yNum > 5) {
        newErrors.y = 'Y должен быть от -3 до 5';
      }
    }
    
    if (r === null || r === undefined) {
      newErrors.r = 'Необходимо выбрать R';
    } else if (!R_VALUES.includes(r)) {
      newErrors.r = 'R должен быть одним из: -3, -2, -1, 0, 1, 2, 3, 4, 5';
    } else if (r <= 0) {
      newErrors.r = 'R должен быть больше 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      await dispatch(checkPoint({
        x: x,
        y: parseFloat(y),
        r: r
      })).unwrap();
      
      setX(null);
      setY('');
      setErrors({});
      
      dispatch(loadHistory({ offset: 0, limit: 20 })).catch((err) => {
        console.error('Error reloading history:', err);
      });
    } catch (error) {
      console.error('Error checking point:', error);
      const errorMessage = typeof error === 'string' ? error : (error?.message || 'Ошибка проверки точки');
      setErrors({ submit: errorMessage });
    }
  };

  const handleXChange = (value) => {
    setX(value);
    setErrors({ ...errors, x: null });
  };

  const handleYChange = (e) => {
    const value = e.target.value;
    
    if (value === '' || value === '-') {
      setY(value);
      setErrors({ ...errors, y: null });
      return;
    }
    
    const numberPattern = /^-?\d*\.?\d*$/;
    
    if (numberPattern.test(value) && value.length <= 7) {
      setY(value);
      setErrors({ ...errors, y: null });
    }
  };

  const handleRChange = (value) => {
    setR(value);
    setErrors({ ...errors, r: null });
    if (onRChange) {
      onRChange(value);
    }
  };

  return (
    <form className="point-input-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>X:</label>
        <div className="checkbox-group">
          {X_VALUES.map((value) => (
            <label key={value} className="checkbox-label">
              <input
                type="checkbox"
                checked={x === value}
                onChange={() => handleXChange(value)}
              />
              <span>{value}</span>
            </label>
          ))}
        </div>
        {errors.x && <span className="error">{errors.x}</span>}
      </div>

      <div className="form-group">
        <label>Y:</label>
        <input
          type="text"
          value={y}
          onChange={handleYChange}
          placeholder="-3 ... 5"
          className={errors.y ? 'error-input' : ''}
        />
        {errors.y && <span className="error">{errors.y}</span>}
      </div>

      <div className="form-group">
        <label>R:</label>
        <div className="checkbox-group">
          {R_VALUES.map((value) => (
            <label key={value} className="checkbox-label">
              <input
                type="checkbox"
                checked={r === value}
                onChange={() => handleRChange(value)}
                disabled={value <= 0}
              />
              <span>{value}</span>
            </label>
          ))}
        </div>
        {errors.r && <span className="error">{errors.r}</span>}
      </div>

      {errors.submit && <div className="error">{errors.submit}</div>}

      <button type="submit" className="submit-button">
        Отправить
      </button>
    </form>
  );
};

export default PointInputForm;


