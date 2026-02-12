import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import Plot from 'react-plotly.js';
import { useDispatch, useSelector } from 'react-redux';
import { checkPointFromClick, loadHistory } from '../store/slices/pointsSlice';
import { useNotification } from '../contexts/NotificationContext';
import './CoordinatePlot.css';

const CoordinatePlot = ({ r, onRChange }) => {
  const dispatch = useDispatch();
  const { points } = useSelector((state) => state.points);
  const { username } = useSelector((state) => state.auth);
  const { showError } = useNotification();
  const [currentR, setCurrentR] = useState(r !== undefined && r !== null ? r : 1);
  const plotRef = useRef(null);

  useEffect(() => {
    if (r !== undefined && r !== null) {
      setCurrentR(r);
    } else if (r === 0) {
      setCurrentR(0);
    }
  }, [r]);

  useEffect(() => {
    dispatch(loadHistory({ offset: 0, limit: 20 }));
  }, [dispatch]);

  const { shapes, areaData } = useMemo(() => {
    if (currentR === null || currentR === undefined) return { shapes: [], areaData: [] };

    const r = currentR;

    const circlePoints = [];
    for (let angle = 180; angle <= 270; angle += 2) {
      const rad = (angle * Math.PI) / 180;
      const x = r * Math.cos(rad);
      const y = r * Math.sin(rad);
      circlePoints.push({ x, y });
    }
    if (circlePoints.length === 0 || Math.abs(circlePoints[0].x + r) > 0.01 || circlePoints[0].y !== 0) {
      circlePoints.unshift({ x: -r, y: 0 });
    }
    if (circlePoints.length === 0 || circlePoints[circlePoints.length - 1].x !== 0 || Math.abs(circlePoints[circlePoints.length - 1].y + r) > 0.01) {
      circlePoints.push({ x: 0, y: -r });
    }

    const shapes = [
      {
        type: 'rect',
        xref: 'x',
        yref: 'y',
        x0: 0,
        y0: 0,
        x1: r,
        y1: r,
        fillcolor: 'rgba(172, 255, 47, 0.5)',
        line: { width: 0 },
        layer: 'below'
      },
      {
        type: 'path',
        xref: 'x',
        yref: 'y',
        path: `M 0,0 L -${r},0 L 0,${r/2} Z`,
        fillcolor: 'rgba(172, 255, 47, 0.5)',
        line: { width: 0 },
        layer: 'below'
      }
    ];

    const areaData = [{
      x: [0, ...circlePoints.map(p => p.x), 0],
      y: [0, ...circlePoints.map(p => p.y), 0],
      mode: 'lines',
      type: 'scatter',
      fill: 'toself',
      fillcolor: 'rgba(172, 255, 47, 0.5)',
      line: { width: 0 },
      showlegend: false,
      hoverinfo: 'skip'
    }];

    return { shapes, areaData };
  }, [currentR]);

  const pointData = useMemo(() => {
    if (!points || points.length === 0) return [];

    const userPoints = points.filter(point => point.username === username);

    const hitPoints = userPoints
      .filter(point => point.r === currentR && point.success)
      .map(point => ({ x: point.x, y: point.y }));

    const missPoints = userPoints
      .filter(point => point.r === currentR && !point.success)
      .map(point => ({ x: point.x, y: point.y }));

    const traces = [];

    if (hitPoints.length > 0) {
      traces.push({
        x: hitPoints.map(p => p.x),
        y: hitPoints.map(p => p.y),
        mode: 'markers',
        type: 'scatter',
        showlegend: false,
        marker: {
          color: 'green',
          size: 10,
          line: { color: 'black', width: 1 }
        }
      });
    }

    if (missPoints.length > 0) {
      traces.push({
        x: missPoints.map(p => p.x),
        y: missPoints.map(p => p.y),
        mode: 'markers',
        type: 'scatter',
        showlegend: false,
        marker: {
          color: 'red',
          size: 10,
          line: { color: 'black', width: 1 }
        }
      });
    }

    return traces;
  }, [points, currentR, username]);

  const layout = useMemo(() => ({
    xaxis: {
      range: [-4, 6],
      zeroline: false,
      showgrid: true,
      gridcolor: '#e0e0e0',
      showline: false,
      showticklabels: false,
      ticks: ''
    },
    yaxis: {
      range: [-4, 6],
      zeroline: false,
      showgrid: true,
      gridcolor: '#e0e0e0',
      showline: false,
      showticklabels: false,
      ticks: '',
      scaleanchor: 'x',
      scaleratio: 1
    },
    shapes: shapes,
    plot_bgcolor: 'transparent',
    paper_bgcolor: 'transparent',
    showlegend: false,
    margin: { l: 0, r: 0, t: 0, b: 0 },
    autosize: true
  }), [shapes]);

  const sendPoint = useCallback(async (coordX, coordY) => {
    if (currentR === null || currentR === undefined) {
      showError('Пожалуйста, выберите R сначала');
      return;
    }

    if (currentR <= 0) {
      showError('R должен быть больше 0');
      return;
    }

    coordX = Math.round(coordX * 100) / 100;
    coordY = Math.round(coordY * 100) / 100;

    if (coordX < -3 || coordX > 5) {
      showError('X должен быть от -3 до 5');
      return;
    }

    if (coordY < -3 || coordY > 5) {
      showError('Y должен быть от -3 до 5');
      return;
    }

    console.log('Sending point:', { x: coordX, y: coordY, r: currentR });

    try {
      const result = await dispatch(checkPointFromClick({
        x: coordX,
        y: coordY,
        r: currentR
      })).unwrap();
      console.log('Point checked successfully:', result);
      dispatch(loadHistory({ offset: 0, limit: 20 })).catch((err) => {
        console.error('Error reloading history:', err);
      });
    } catch (error) {
      console.error('Error checking point:', error);
      const errorMessage = typeof error === 'string' ? error : (error?.message || error || 'Failed to check point');
      showError(errorMessage);
    }
  }, [currentR, dispatch, showError]);

  const handleDivClick = useCallback((event) => {
    if (currentR === null || currentR === undefined) {
      showError('Пожалуйста, выберите R сначала');
      return;
    }

    const container = event.currentTarget;
    const rect = container.getBoundingClientRect();
    const xPixel = event.clientX - rect.left;
    const yPixel = event.clientY - rect.top;

    console.log('Click at pixel:', xPixel, yPixel, 'Container size:', rect.width, rect.height);

    if (xPixel < 0 || xPixel > rect.width || yPixel < 0 || yPixel > rect.height) {
      return;
    }

    const xRange = layout.xaxis.range[1] - layout.xaxis.range[0];
    const yRange = layout.yaxis.range[1] - layout.yaxis.range[0];

    const coordX = layout.xaxis.range[0] + (xPixel / rect.width) * xRange;
    const coordY = layout.yaxis.range[1] - (yPixel / rect.height) * yRange;

    console.log('Calculated coordinates:', coordX, coordY);
    sendPoint(coordX, coordY);
  }, [currentR, layout, sendPoint, showError]);

  const config = {
    displayModeBar: false,
    responsive: true,
    staticPlot: false,
    useResizeHandler: true
  };

  const allData = [...areaData, ...pointData];

  return (
    <div className="coordinate-plot" onClick={handleDivClick}>
      <Plot
        data={allData}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default CoordinatePlot;

