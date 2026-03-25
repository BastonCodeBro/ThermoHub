import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Flame } from 'lucide-react';
import InputField from './shared/InputField';
import FormulasSection from './shared/FormulasSection';
import StatCard from './shared/StatCard';
import { solveFluid, getSaturationDomeFull } from '../utils/waterProps';
import { generateProcessPath } from '../utils/processPath';
import { plotLayout, plotConfig, addTrace, addDomeTrace } from './shared/plotConfig';
import { renderPlot, cleanupPlot } from '../utils/plotly';

const COLOR = '#38BDF8';

const MODE_SPECS = [
  {
    id: 'pt',
    label: 'P + T',
    build: ({ a, b }) => ({ p: a, t: b }),
    fields: [
      { key: 'a', label: 'Pressione', unit: 'bar' },
      { key: 'b', label: 'Temperatura', unit: 'C' },
    ],
  },
  {
    id: 'ph',
    label: 'P + h',
    build: ({ a, b }) => ({ p: a, h: b }),
    fields: [
      { key: 'a', label: 'Pressione', unit: 'bar' },
      { key: 'b', label: 'Entalpia', unit: 'kJ/kg' },
    ],
  },
  {
    id: 'ps',
    label: 'P + s',
    build: ({ a, b }) => ({ p: a, s: b }),
    fields: [
      { key: 'a', label: 'Pressione', unit: 'bar' },
      { key: 'b', label: 'Entropia', unit: 'kJ/kg K' },
    ],
  },
  {
    id: 'pq',
    label: 'P + x',
    build: ({ a, b }) => ({ p: a, q: b }),
    fields: [
      { key: 'a', label: 'Pressione', unit: 'bar' },
      { key: 'b', label: 'Titolo x', unit: '-' },
    ],
  },
  {
    id: 'tq',
    label: 'T + x',
    build: ({ a, b }) => ({ t: a, q: b }),
    fields: [
      { key: 'a', label: 'Temperatura', unit: 'C' },
      { key: 'b', label: 'Titolo x', unit: '-' },
    ],
  },
];

const pointAnnotations = (pts, mapperX, mapperY) =>
  pts.map((point, index) => ({
    x: mapperX(point),
    y: mapperY(point),
    text: point.name || `${index + 1}`,
    showarrow: true,
    arrowhead: 0,
    arrowsize: 1,
    arrowwidth: 1.5,
    arrowcolor: COLOR,
    ax: 18,
    ay: -18,
    font: { color: COLOR, size: 12, family: 'Inter' },
    bgcolor: '#0F172A',
    bordercolor: COLOR,
    borderwidth: 1,
    borderpad: 4,
  }));

const SteamLabPage = () => {
  const [mode, setMode] = useState('pt');
  const [pointName, setPointName] = useState('');
  const [form, setForm] = useState({ a: 1, b: 100 });
  const [points, setPoints] = useState([]);
  const [segmentPaths, setSegmentPaths] = useState([]);
  const [dome, setDome] = useState(null);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [closeCycle, setCloseCycle] = useState(true);

  const tsRef = useRef(null);
  const hsRef = useRef(null);
  const pvRef = useRef(null);

  const modeSpec = useMemo(() => MODE_SPECS.find((entry) => entry.id === mode) ?? MODE_SPECS[0], [mode]);

  useEffect(() => {
    let cancelled = false;
    const loadDome = async () => {
      try {
        const domeData = await getSaturationDomeFull('Water');
        if (!cancelled) setDome(domeData);
      } catch (loadError) {
        console.error(loadError);
      }
    };
    loadDome();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const buildPaths = async () => {
      if (points.length < 2) {
        setSegmentPaths([]);
        return;
      }

      const pairs = [];
      for (let index = 0; index < points.length - 1; index += 1) {
        pairs.push([points[index], points[index + 1]]);
      }
      if (closeCycle && points.length > 2) {
        pairs.push([points[points.length - 1], points[0]]);
      }

      try {
        const paths = await Promise.all(
          pairs.map(([from, to]) => generateProcessPath(from, to, 'Water', 64)),
        );
        setSegmentPaths(paths);
      } catch (pathError) {
        console.error(pathError);
        setSegmentPaths([]);
      }
    };

    buildPaths();
  }, [points, closeCycle]);

  useEffect(() => {
    const node = activeTab === 0 ? tsRef.current : activeTab === 1 ? hsRef.current : pvRef.current;
    if (!node || points.length === 0) return;

    const renderActivePlot = () => {
      if (activeTab === 0) {
        const data = [
          dome?.ts ? addDomeTrace(dome.ts.s, dome.ts.t) : null,
          ...segmentPaths.map((path, index) =>
            addTrace(path.map((point) => point.s), path.map((point) => point.t), {
              name: `Tratto ${index + 1}`,
              color: ['#38BDF8', '#EF4444', '#22D3EE', '#60A5FA', '#A78BFA'][index % 5],
              width: 3,
              mode: 'lines',
            }),
          ),
          addTrace(points.map((point) => point.s), points.map((point) => point.t), {
            color: COLOR,
            mode: 'markers',
            markerSize: 9,
          }),
        ].filter(Boolean);
        const layout = plotLayout('Entropia s (kJ/kg K)', 'Temperatura T (C)');
        layout.annotations = pointAnnotations(points, (point) => point.s, (point) => point.t);
        renderPlot(node, data, layout, plotConfig);
      } else if (activeTab === 1) {
        const data = [
          dome?.hs ? addDomeTrace(dome.hs.s, dome.hs.h) : null,
          ...segmentPaths.map((path, index) =>
            addTrace(path.map((point) => point.s), path.map((point) => point.h), {
              name: `Tratto ${index + 1}`,
              color: ['#38BDF8', '#EF4444', '#22D3EE', '#60A5FA', '#A78BFA'][index % 5],
              width: 3,
              mode: 'lines',
            }),
          ),
          addTrace(points.map((point) => point.s), points.map((point) => point.h), {
            color: COLOR,
            mode: 'markers',
            markerSize: 9,
          }),
        ].filter(Boolean);
        const layout = plotLayout('Entropia s (kJ/kg K)', 'Entalpia h (kJ/kg)');
        layout.annotations = pointAnnotations(points, (point) => point.s, (point) => point.h);
        renderPlot(node, data, layout, plotConfig);
      } else {
        const data = [
          ...segmentPaths.map((path, index) =>
            addTrace(path.map((point) => point.v), path.map((point) => point.p), {
              name: `Tratto ${index + 1}`,
              color: ['#38BDF8', '#EF4444', '#22D3EE', '#60A5FA', '#A78BFA'][index % 5],
              width: 3,
              mode: 'lines',
            }),
          ),
          addTrace(points.map((point) => point.v), points.map((point) => point.p), {
            color: COLOR,
            mode: 'markers',
            markerSize: 9,
          }),
        ];
        const layout = plotLayout('Volume specifico v (m^3/kg)', 'Pressione P (bar)', {
          yaxis: { type: 'log' },
        });
        layout.annotations = pointAnnotations(points, (point) => point.v, (point) => point.p);
        renderPlot(node, data, layout, plotConfig);
      }
    };

    renderActivePlot();
    return () => cleanupPlot(node);
  }, [points, segmentPaths, dome, activeTab]);

  const addPoint = async () => {
    setAdding(true);
    setError(null);
    try {
      const inputs = modeSpec.build(form);
      const state = await solveFluid(inputs, 'Water');
      const name = pointName.trim() || `${points.length + 1}`;
      setPoints([...points, { ...state, name }]);
      setPointName('');
    } catch (addError) {
      setError('Impossibile costruire lo stato richiesto: controlla la coppia di proprieta scelta.');
      console.error(addError);
    } finally {
      setAdding(false);
    }
  };

  const removeLastPoint = () => {
    setPoints(points.slice(0, -1));
    setError(null);
  };

  const clearPoints = () => {
    setPoints([]);
    setSegmentPaths([]);
    setError(null);
  };

  const stats = points.length > 0 ? (
    <div className="stats-row">
      <StatCard label="Punti" value={`${points.length}`} accent color={COLOR} />
      <StatCard label="Tratti" value={`${segmentPaths.length}`} />
      <StatCard label="Ciclo" value={closeCycle && points.length > 2 ? 'Chiuso' : 'Aperto'} />
      <StatCard label="Ultimo Punto" value={points[points.length - 1]?.name || '-'} />
    </div>
  ) : null;

  return (
    <section className="features-section cycle-page">
      <div className="section-header">
        <div className="section-badge">Modalita Avanzata</div>
        <h2 className="section-title">
          Laboratorio <span style={{ color: COLOR }}>Vapore</span>
        </h2>
      </div>

      <div className="cycle-layout">
        <div className="cycle-inputs glass">
          <h3 className="card-title">Strumento derivato dal desktop</h3>
          <p className="input-hint">
            Costruisci punti manuali dell&apos;acqua/vapore a partire da due proprieta indipendenti e visualizza il percorso sui diagrammi principali.
          </p>

          <div className="input-field">
            <label className="input-label" htmlFor="steam-lab-name">Nome punto</label>
            <input
              id="steam-lab-name"
              className="glass-input"
              value={pointName}
              onChange={(event) => setPointName(event.target.value)}
              placeholder="Es. 1, 2, A, Turbina out"
            />
          </div>

          <div className="input-field">
            <label className="input-label" htmlFor="steam-lab-mode">Coppia di proprieta</label>
            <select
              id="steam-lab-mode"
              className="glass-input"
              value={mode}
              onChange={(event) => {
                setMode(event.target.value);
                setForm({ a: null, b: null });
              }}
            >
              {MODE_SPECS.map((entry) => (
                <option key={entry.id} value={entry.id}>{entry.label}</option>
              ))}
            </select>
          </div>

          <div className="inputs-row">
            {modeSpec.fields.map((field) => (
              <InputField
                key={field.key}
                label={field.label}
                unit={field.unit}
                value={form[field.key]}
                onChange={(value) => setForm({ ...form, [field.key]: value })}
                accent={COLOR}
              />
            ))}
          </div>

          <div className="action-row">
            <button className="btn-primary" onClick={addPoint} disabled={adding}>
              Aggiungi Punto
            </button>
            <button className="btn-outline" onClick={removeLastPoint} disabled={points.length === 0}>
              Rimuovi Ultimo
            </button>
            <button className="btn-outline" onClick={clearPoints} disabled={points.length === 0}>
              Svuota
            </button>
          </div>

          <label className="checkbox-row">
            <input type="checkbox" checked={closeCycle} onChange={(event) => setCloseCycle(event.target.checked)} />
            <span>Chiudi automaticamente il ciclo quando ci sono almeno 3 punti</span>
          </label>

          {points.length > 0 && (
            <div className="points-chip-list">
              {points.map((point) => (
                <span key={point.name} className="point-chip" style={{ borderColor: `${COLOR}55`, color: COLOR }}>
                  {point.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="cycle-results">
          {error && (
            <div className="error-banner">
              <Flame size={18} />
              <p>{error}</p>
            </div>
          )}

          {points.length > 0 ? (
            <div className="results-grid">
              <div className="glass diagram-tabs-wrapper">
                <div className="diagram-tabs-bar">
                  <button className={`diagram-tab ${activeTab === 0 ? 'diagram-tab-active' : ''}`} onClick={() => setActiveTab(0)} style={activeTab === 0 ? { borderColor: COLOR, color: COLOR } : {}}>
                    T-s
                  </button>
                  <button className={`diagram-tab ${activeTab === 1 ? 'diagram-tab-active' : ''}`} onClick={() => setActiveTab(1)} style={activeTab === 1 ? { borderColor: COLOR, color: COLOR } : {}}>
                    h-s
                  </button>
                  <button className={`diagram-tab ${activeTab === 2 ? 'diagram-tab-active' : ''}`} onClick={() => setActiveTab(2)} style={activeTab === 2 ? { borderColor: COLOR, color: COLOR } : {}}>
                    P-v
                  </button>
                </div>
                <div className="diagram-tab-content">
                  {activeTab === 0 && <div ref={tsRef} className="plot-area" />}
                  {activeTab === 1 && <div ref={hsRef} className="plot-area" />}
                  {activeTab === 2 && <div ref={pvRef} className="plot-area" />}
                </div>
              </div>
              {stats}
            </div>
          ) : (
            <div className="empty-state glass">
              <Flame size={48} className="empty-icon" />
              <p>Aggiungi almeno un punto per iniziare il laboratorio vapore.</p>
            </div>
          )}
        </div>
      </div>

      {points.length > 0 && (
        <div className="formulas-section-wrapper">
          <FormulasSection
            accentColor={COLOR}
            coordTitle="Punti Definiti Manualmente"
            points={points.map((point) => ({
              label: point.name,
              t: point.t,
              p: point.p,
              h: point.h,
              s: point.s,
              v: point.v,
            }))}
            formulas={[]}
          />
        </div>
      )}
    </section>
  );
};

export default SteamLabPage;
