import { useState, useEffect, useRef, useCallback } from 'react';
import { solveFluid } from '../utils/waterProps';
import { generateProcessPath } from '../utils/processPath';
import { RotateCw } from 'lucide-react';
import CyclePageLayout from './shared/CyclePageLayout';
import InputField from './shared/InputField';
import StatCard from './shared/StatCard';
import FormulasSection from './shared/FormulasSection';
import SchematicDiagram from './shared/SchematicDiagram';
import { exportToPDF } from '../utils/pdfExport';
import { plotLayout, plotConfig, addTrace, genPvCurve, genTsCurve, genHsCurve } from './shared/plotConfig';
import { renderPlot, cleanupPlot } from '../utils/plotly';

const COLOR = '#A78BFA';
const R = 0.287;
const CP = 1.005;
const K = 1.4;
const isFiniteNumber = (value) => Number.isFinite(value);

const pointAnnotations = (pts, labels, color) =>
  pts.map((p, i) => ({
    x: p.x, y: p.y, text: labels[i] || `${i + 1}`,
    showarrow: true, arrowhead: 0, arrowsize: 1, arrowwidth: 1.5, arrowcolor: color,
    ax: 22, ay: -22, font: { color, size: 13, family: 'Inter' },
    bgcolor: '#0F172A', bordercolor: color, borderwidth: 1, borderpad: 4,
  }));

const CarnotPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  const tsRef = useRef(null);
  const pvRef = useRef(null);
  const hsRef = useRef(null);
  const schematicRef = useRef(null);

  const [inputs, setInputs] = useState({
    t_high: 500, t_low: 25, p_ref: 1.0, mass_flow: 1.0,
  });

  useEffect(() => {
    const node = activeTab === 0 ? tsRef.current : activeTab === 1 ? pvRef.current : activeTab === 2 ? hsRef.current : null;
    if (!results || !node) return;
    const pts = results.allPoints;
    const fluid = 'Air';

    const renderActivePlot = async () => {
      const paths = await Promise.all([
        generateProcessPath(pts[0], pts[1], fluid),
        generateProcessPath(pts[1], pts[2], fluid),
        generateProcessPath(pts[2], pts[3], fluid),
        generateProcessPath(pts[3], pts[0], fluid),
      ]);

      if (activeTab === 0) {
        const data = [
          ...paths.map((path, i) => addTrace(path.map(p => p.s), path.map(p => p.t), {
            name: `Tratto ${i + 1}`,
            color: [COLOR, '#EF4444', '#22D3EE', '#60A5FA'][i],
            width: 3,
            mode: 'lines',
          })),
          addTrace(pts.map(p => p.s), pts.map(p => p.t), { color: COLOR, mode: 'markers', markerSize: 10 }),
        ];
        const layout = plotLayout('Entropia s (kJ/kg·K)', 'Temperatura T (°C)');
        layout.annotations = pointAnnotations(pts.map(p => ({ x: p.s, y: p.t })),
          ['1\nIsoT esp.', '2\nAdiab.', '3\nIsoT compr.', '4\nAdiab.'], COLOR);
        renderPlot(node, data, layout, plotConfig);
      } else if (activeTab === 1) {
        const data = [
          ...paths.map((path, i) => addTrace(path.map(p => p.v), path.map(p => p.p), {
            name: `Tratto ${i + 1}`,
            color: ['#C4B5FD', '#EF4444', '#22D3EE', '#60A5FA'][i],
            width: 3,
            mode: 'lines',
          })),
          addTrace(pts.map(p => p.v), pts.map(p => p.p), { color: '#C4B5FD', mode: 'markers', markerSize: 10 }),
        ];
        const layout = plotLayout('Volume specifico v (m³/kg)', 'Pressione P (bar)');
        layout.annotations = pointAnnotations(pts.map(p => ({ x: p.v, y: p.p })), ['1', '2', '3', '4'], COLOR);
        renderPlot(node, data, layout, plotConfig);
      } else if (activeTab === 2) {
        const data = [
          ...paths.map((path, i) => addTrace(path.map(p => p.s), path.map(p => p.h), {
            name: `Tratto ${i + 1}`,
            color: ['#67E8F9', '#EF4444', '#22D3EE', '#60A5FA'][i],
            width: 3,
            mode: 'lines',
          })),
          addTrace(pts.map(p => p.s), pts.map(p => p.h), { color: '#67E8F9', mode: 'markers', markerSize: 10 }),
        ];
        const layout = plotLayout('Entropia s (kJ/kg·K)', 'Entalpia h (kJ/kg)');
        layout.annotations = pointAnnotations(pts.map(p => ({ x: p.s, y: p.h })), ['1', '2', '3', '4'], COLOR);
        renderPlot(node, data, layout, plotConfig);
      }
    };
    renderActivePlot();
    return () => cleanupPlot(node);
  }, [results, activeTab]);

  const canCalculate = isFiniteNumber(inputs.t_high) && isFiniteNumber(inputs.t_low)
    && isFiniteNumber(inputs.p_ref) && isFiniteNumber(inputs.mass_flow)
    && inputs.t_high > inputs.t_low && inputs.p_ref > 0 && inputs.mass_flow > 0;

  const calculate = async () => {
    setLoading(true);
    setError(null);
    const fluid = 'Air';
    try {
      const st1 = await solveFluid({ p: inputs.p_ref, t: inputs.t_high }, fluid);
      const ds = 0.5;
      const st2 = await solveFluid({ t: inputs.t_high, s: st1.s + ds }, fluid);
      const st3 = await solveFluid({ t: inputs.t_low, s: st2.s }, fluid);
      const st4 = await solveFluid({ t: inputs.t_low, s: st1.s }, fluid);

      const allPoints = [st1, st2, st3, st4];
      const Th = inputs.t_high + 273.15;
      const Tl = inputs.t_low + 273.15;
      const Q_in = Th * ds;
      const Q_out = Tl * ds;
      const W_net = Q_in - Q_out;
      const eta = (1 - Tl / Th) * 100;

      setResults({
        allPoints,
        stats: { Q_in, Q_out, W_net, eta, power: W_net * inputs.mass_flow },
      });
    } catch (err) {
      setError('Errore nel calcolo: verificare i parametri.');
      console.error(err);
    } finally { setLoading(false); }
  };

  const handleDownloadPDF = useCallback(async () => {
    if (!results) return;
    setDownloadingPDF(true);
    try {
      await exportToPDF({
        title: 'Carnot', accentColor: COLOR, inputs, stats: results.stats,
        points: results.allPoints.map((p, i) => ({
          label: ['1: IsoT esp.', '2: Adiab.', '3: IsoT compr.', '4: Adiab.'][i],
          t: p.t, p: p.p, h: p.h, s: p.s, v: p.v,
        })),
        formulas: [
          { label: 'Rendimento Carnot', latex: '\\eta = 1 - \\frac{T_L}{T_H}', value: results.stats.eta },
          { label: 'Calore Ingresso', latex: 'Q_{in} = T_H \\cdot \\Delta s', value: results.stats.Q_in },
          { label: 'Calore Uscita', latex: 'Q_{out} = T_L \\cdot \\Delta s', value: results.stats.Q_out },
          { label: 'Lavoro Netto', latex: 'W_{net} = Q_{in} - Q_{out}', value: results.stats.W_net },
        ],
        plotRefs: { ts: tsRef, pv: pvRef, hs: hsRef }, schematicRef,
      });
    } catch (err) { console.error(err); }
    finally { setDownloadingPDF(false); }
  }, [results, inputs]);

  const diagramTabs = results ? [
    { id: 'ts', label: 'T-s', active: activeTab === 0, onClick: () => setActiveTab(0), content: <div ref={tsRef} className="plot-area" /> },
    { id: 'pv', label: 'P-v', active: activeTab === 1, onClick: () => setActiveTab(1), content: <div ref={pvRef} className="plot-area" /> },
    { id: 'hs', label: 'h-s', active: activeTab === 2, onClick: () => setActiveTab(2), content: <div ref={hsRef} className="plot-area" /> },
    { id: 'schema', label: 'Schema', active: activeTab === 3, onClick: () => setActiveTab(3), content: <div ref={schematicRef}><SchematicDiagram type="carnot" accentColor={COLOR} /></div> },
  ] : null;

  const formulasSection = results ? (
    <FormulasSection accentColor={COLOR}
      points={results.allPoints.map((p, i) => ({
        label: ['1: IsoT esp.', '2: Adiab.', '3: IsoT compr.', '4: Adiab.'][i],
        t: p.t, p: p.p, h: p.h, s: p.s, v: p.v,
      }))}
      formulas={[
        { label: 'Punto 1 — Inizio isoterma espansione', latex: 'T_1 = T_H, \\quad s_1 = s_{ref}' },
        { label: 'Punto 2 — Fine isoterma espansione', latex: 'T_2 = T_H, \\quad s_2 = s_1 + \\Delta s' },
        { label: 'Punto 3 — Fine adiabatica', latex: 'T_3 = T_L, \\quad s_3 = s_2, \\quad P_3 = P_2 \\left(\\frac{T_L}{T_H}\\right)^{k/(k-1)}' },
        { label: 'Punto 4 — Fine isoterma compressione', latex: 'T_4 = T_L, \\quad s_4 = s_1' },
        { label: 'Calore Ingresso (isoterma T_H)', latex: 'Q_{in} = T_H \\cdot \\Delta s', value: results.stats.Q_in },
        { label: 'Calore Uscita (isoterma T_L)', latex: 'Q_{out} = T_L \\cdot \\Delta s', value: results.stats.Q_out },
        { label: 'Lavoro Netto', latex: 'W_{net} = Q_{in} - Q_{out}', value: results.stats.W_net },
        { label: 'Rendimento Carnot', latex: '\\eta_{Carnot} = 1 - \\frac{T_L}{T_H} = 1 - \\frac{' + (inputs.t_low + 273.15).toFixed(1) + '}{' + (inputs.t_high + 273.15).toFixed(1) + '}', value: results.stats.eta, display: true },
        { label: 'Potenza Netta', latex: '\\dot{W}_{net} = \\dot{m} \\cdot W_{net}', value: results.stats.power },
      ]}
    />
  ) : null;

  const stats = results ? (
    <div className="stats-row">
      <StatCard label="Rendimento Carnot" value={`${results.stats.eta.toFixed(2)}%`} accent color={COLOR} />
      <StatCard label="Potenza Netta" value={`${results.stats.power.toFixed(1)} kW`} />
      <StatCard label="Calore In (Th·Δs)" value={`${results.stats.Q_in.toFixed(1)} kJ/kg`} />
      <StatCard label="Calore Out (Tl·Δs)" value={`${results.stats.Q_out.toFixed(1)} kJ/kg`} />
    </div>
  ) : null;

  return (
    <CyclePageLayout badge="Ciclo Ideale" title="Ciclo" titleAccent="Carnot" accentColor={COLOR}
      loading={loading} error={error} results={results} onCalculate={calculate} canCalculate={canCalculate}
      stats={stats} diagramTabs={diagramTabs} formulasSection={formulasSection}
      onDownloadPDF={handleDownloadPDF} downloadingPDF={downloadingPDF} EmptyIcon={RotateCw}>
      <h3 className="card-title">Parametri del Ciclo</h3>
      <p className="input-hint">
        Ciclo Carnot ideale su aria (gas ideale). Il rendimento dipende solo dalle temperature: η = 1 − T_L/T_H
      </p>
      <div className="inputs-grid">
        <InputField label="Temperatura Alta (T_H)" value={inputs.t_high} onChange={v => setInputs({ ...inputs, t_high: v })} unit="°C" accent={COLOR} />
        <InputField label="Temperatura Bassa (T_L)" value={inputs.t_low} onChange={v => setInputs({ ...inputs, t_low: v })} unit="°C" accent={COLOR} />
      </div>
      <div className="inputs-row">
        <InputField label="Pressione di Riferimento" value={inputs.p_ref} onChange={v => setInputs({ ...inputs, p_ref: v })} unit="bar" accent={COLOR} />
        <InputField label="Portata Massica" value={inputs.mass_flow} onChange={v => setInputs({ ...inputs, mass_flow: v })} unit="kg/s" step={0.1} accent={COLOR} />
      </div>
    </CyclePageLayout>
  );
};

export default CarnotPage;
