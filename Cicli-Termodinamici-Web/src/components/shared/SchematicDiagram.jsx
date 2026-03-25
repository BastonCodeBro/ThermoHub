import React from 'react';

const ICONS = {
  compressor: (x, y, color) => (
    <g transform={`translate(${x},${y})`}>
      <circle r={22} fill="none" stroke={color} strokeWidth={2.5} />
      <path d="M-8,-10 L8,0 L-8,10 Z" fill={color} opacity={0.8} />
      <text y={30} textAnchor="middle" fill={color} fontSize="9" fontWeight="700">COMPRESSORE</text>
    </g>
  ),
  turbine: (x, y, color) => (
    <g transform={`translate(${x},${y})`}>
      <circle r={22} fill="none" stroke={color} strokeWidth={2.5} />
      <path d="M8,-10 L-8,0 L8,10 Z" fill={color} opacity={0.8} />
      <text y={30} textAnchor="middle" fill={color} fontSize="9" fontWeight="700">TURBINA</text>
    </g>
  ),
  pump: (x, y, color) => (
    <g transform={`translate(${x},${y})`}>
      <circle r={20} fill="none" stroke={color} strokeWidth={2.5} />
      <line x1={-6} y1={8} x2={-6} y2={-8} stroke={color} strokeWidth={3} />
      <line x1={-6} y1={-8} x2={8} y2={-2} stroke={color} strokeWidth={3} />
      <text y={28} textAnchor="middle" fill={color} fontSize="9" fontWeight="700">POMPA</text>
    </g>
  ),
  boiler: (x, y, color) => (
    <g transform={`translate(${x},${y})`}>
      <rect x={-28} y={-18} width={56} height={36} rx={4} fill="none" stroke={color} strokeWidth={2.5} />
      <line x1={-16} y1={-8} x2={-16} y2={8} stroke={color} strokeWidth={2} />
      <line x1={-4} y1={-8} x2={-4} y2={8} stroke={color} strokeWidth={2} />
      <line x1={8} y1={-8} x2={8} y2={8} stroke={color} strokeWidth={2} />
      <line x1={20} y1={-8} x2={20} y2={8} stroke={color} strokeWidth={2} />
      <path d="M-12,-12 L-8,-16 L-4,-12" stroke={color} strokeWidth={1.5} fill="none" />
      <path d="M4,-12 L8,-16 L12,-12" stroke={color} strokeWidth={1.5} fill="none" />
      <path d="M16,-12 L20,-16 L24,-12" stroke={color} strokeWidth={1.5} fill="none" />
      <text y={30} textAnchor="middle" fill={color} fontSize="9" fontWeight="700">CALDAIA</text>
    </g>
  ),
  condenser: (x, y, color) => (
    <g transform={`translate(${x},${y})`}>
      <rect x={-28} y={-18} width={56} height={36} rx={4} fill="none" stroke={color} strokeWidth={2.5} />
      <path d="M-18,0 Q-12,-10 -6,0 Q0,10 6,0 Q12,-10 18,0" stroke={color} strokeWidth={2} fill="none" />
      <text y={30} textAnchor="middle" fill={color} fontSize="9" fontWeight="700">CONDENSATORE</text>
    </g>
  ),
  combustion: (x, y, color) => (
    <g transform={`translate(${x},${y})`}>
      <rect x={-28} y={-20} width={56} height={40} rx={6} fill="none" stroke={color} strokeWidth={2.5} />
      <path d="M-8,8 C-8,-4 -4,-12 0,-4 C4,-12 8,-4 8,8" stroke={color} strokeWidth={2} fill={color} fillOpacity={0.2} />
      <text y={32} textAnchor="middle" fill={color} fontSize="8" fontWeight="700">COMBUSTORE</text>
    </g>
  ),
  evaporator: (x, y, color) => (
    <g transform={`translate(${x},${y})`}>
      <rect x={-28} y={-18} width={56} height={36} rx={4} fill="none" stroke={color} strokeWidth={2.5} />
      <circle cx={-12} cy={0} r={4} fill="none" stroke={color} strokeWidth={1.5} />
      <circle cx={4} cy={-4} r={3} fill="none" stroke={color} strokeWidth={1.5} />
      <circle cx={12} cy={2} r={5} fill="none" stroke={color} strokeWidth={1.5} />
      <text y={30} textAnchor="middle" fill={color} fontSize="9" fontWeight="700">EVAPORATORE</text>
    </g>
  ),
  valve: (x, y, color) => (
    <g transform={`translate(${x},${y})`}>
      <polygon points="0,-14 14,8 -14,8" fill="none" stroke={color} strokeWidth={2.5} />
      <line x1={-14} y1={8} x2={14} y2={8} stroke={color} strokeWidth={2.5} />
      <text y={24} textAnchor="middle" fill={color} fontSize="9" fontWeight="700">VALVOLA</text>
    </g>
  ),
  heatEngine: (x, y, color) => (
    <g transform={`translate(${x},${y})`}>
      <rect x={-24} y={-20} width={48} height={40} rx={6} fill="none" stroke={color} strokeWidth={2.5} />
      <text y={5} textAnchor="middle" fill={color} fontSize="14" fontWeight="700">eta</text>
      <text y={32} textAnchor="middle" fill={color} fontSize="8" fontWeight="700">MOTORE</text>
    </g>
  ),
  heatSource: (x, y, color, label = 'TH') => (
    <g transform={`translate(${x},${y})`}>
      <rect x={-24} y={-16} width={48} height={32} rx={6} fill={color} fillOpacity={0.15} stroke={color} strokeWidth={2} />
      <text y={5} textAnchor="middle" fill={color} fontSize="12" fontWeight="700">{label}</text>
    </g>
  ),
  heatSink: (x, y, color, label = 'TL') => (
    <g transform={`translate(${x},${y})`}>
      <rect x={-24} y={-16} width={48} height={32} rx={6} fill={color} fillOpacity={0.1} stroke={color} strokeWidth={2} />
      <text y={5} textAnchor="middle" fill={color} fontSize="12" fontWeight="700">{label}</text>
    </g>
  ),
  piston: (x, y, color) => (
    <g transform={`translate(${x},${y})`}>
      <rect x={-24} y={-25} width={48} height={50} rx={3} fill="none" stroke={color} strokeWidth={2.5} />
      <rect x={-20} y={-8} width={40} height={8} rx={2} fill={color} fillOpacity={0.3} stroke={color} strokeWidth={1.5} />
      <line x1={0} y1={-8} x2={0} y2={-30} stroke={color} strokeWidth={2} />
      <circle cy={-32} r={3} fill={color} />
      <text y={38} textAnchor="middle" fill={color} fontSize="9" fontWeight="700">CILINDRO</text>
    </g>
  ),
};

const Arrow = ({ x1, y1, x2, y2, color = '#94A3B8', label, labelOffset = { x: 0, y: 0 } }) => {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const arrowLen = 8;
  const ax1 = x2 - arrowLen * Math.cos(angle - 0.4);
  const ay1 = y2 - arrowLen * Math.sin(angle - 0.4);
  const ax2 = x2 - arrowLen * Math.cos(angle + 0.4);
  const ay2 = y2 - arrowLen * Math.sin(angle + 0.4);
  const mx = (x1 + x2) / 2 + labelOffset.x;
  const my = (y1 + y2) / 2 + labelOffset.y;

  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2} />
      <polygon points={`${x2},${y2} ${ax1},${ay1} ${ax2},${ay2}`} fill={color} />
      {label && (
        <text x={mx} y={my} textAnchor="middle" fill="#E2E8F0" fontSize="10" fontWeight="600">
          {label}
        </text>
      )}
    </g>
  );
};

const PointLabel = ({ x, y, number, processLabel, color = '#F8FAFC', bgColor }) => (
  <g transform={`translate(${x},${y})`}>
    <circle r={14} fill={bgColor || '#0F172A'} stroke={color} strokeWidth={2} />
    <text y={1} textAnchor="middle" fill={color} fontSize="12" fontWeight="800" dominantBaseline="middle">
      {number}
    </text>
    {processLabel && (
      <text y={-18} textAnchor="middle" fill="#94A3B8" fontSize="7.5" fontWeight="600">
        {processLabel}
      </text>
    )}
  </g>
);

function renderRankine(accentColor) {
  return (
    <svg viewBox="0 0 460 320" width="100%" height="100%">
      {ICONS.pump(100, 230, accentColor)}
      {ICONS.boiler(100, 80, accentColor)}
      {ICONS.turbine(360, 80, accentColor)}
      {ICONS.condenser(360, 230, '#60A5FA')}

      <Arrow x1={100} y1={208} x2={100} y2={102} color="#94A3B8" label="Wp" labelOffset={{ x: -25, y: 0 }} />
      <Arrow x1={128} y1={80} x2={332} y2={80} color="#94A3B8" label="Qin" labelOffset={{ x: 0, y: -15 }} />
      <Arrow x1={360} y1={102} x2={360} y2={208} color="#94A3B8" label="Wt" labelOffset={{ x: 25, y: 0 }} />
      <Arrow x1={332} y1={230} x2={122} y2={230} color="#94A3B8" label="Qout" labelOffset={{ x: 0, y: 18 }} />

      <PointLabel x={100} y={202} number={1} processLabel="usc. cond." color={accentColor} />
      <PointLabel x={100} y={108} number={2} processLabel="usc. pompa" color={accentColor} />
      <PointLabel x={360} y={108} number={3} processLabel="usc. caldaia" color={accentColor} />
      <PointLabel x={360} y={202} number={4} processLabel="usc. turbina" color={accentColor} />
    </svg>
  );
}

function renderBrayton(accentColor) {
  return (
    <svg viewBox="0 0 460 300" width="100%" height="100%">
      {ICONS.compressor(100, 100, accentColor)}
      {ICONS.combustion(230, 100, '#F97316')}
      {ICONS.turbine(360, 100, accentColor)}

      <Arrow x1={60} y1={100} x2={74} y2={100} color="#94A3B8" label="1" labelOffset={{ x: 0, y: -12 }} />
      <Arrow x1={126} y1={100} x2={196} y2={100} color="#94A3B8" label="1->2" labelOffset={{ x: 0, y: -12 }} />
      <Arrow x1={264} y1={100} x2={334} y2={100} color="#94A3B8" label="2->3" labelOffset={{ x: 0, y: -12 }} />
      <Arrow x1={386} y1={100} x2={420} y2={100} color="#94A3B8" label="4" labelOffset={{ x: 0, y: -12 }} />
      <path d="M 386 100 L 400 100 L 400 200 L 60 200 L 60 100 L 74 100" fill="none" stroke="#475569" strokeWidth={2} strokeDasharray="4 4" opacity={0.5} />

      <PointLabel x={80} y={70} number={1} processLabel="ingresso" color={accentColor} />
      <PointLabel x={160} y={130} number={2} processLabel="usc. comp." color={accentColor} />
      <PointLabel x={300} y={130} number={3} processLabel="usc. comb." color={accentColor} />
      <PointLabel x={380} y={70} number={4} processLabel="usc. turb." color={accentColor} />
    </svg>
  );
}

function renderOtto(accentColor) {
  return (
    <svg viewBox="0 0 460 320" width="100%" height="100%">
      {ICONS.piston(230, 120, accentColor)}

      <Arrow x1={125} y1={230} x2={185} y2={170} color="#94A3B8" label="Qin" />
      <Arrow x1={275} y1={170} x2={335} y2={230} color="#94A3B8" label="Qout" />

      <PointLabel x={180} y={70} number={1} processLabel="inizio compr." color={accentColor} />
      <PointLabel x={280} y={70} number={2} processLabel="fine compr." color={accentColor} />
      <PointLabel x={280} y={180} number={3} processLabel="comb. isocora" color={accentColor} />
      <PointLabel x={180} y={180} number={4} processLabel="fine espans." color={accentColor} />

      <g transform="translate(18, 220)" fontSize="10" fill="#94A3B8" fontWeight="600">
        <text y="0">1-&gt;2: compressione reale</text>
        <text y="18">2-&gt;3: apporto di calore a volume costante</text>
        <text y="36">3-&gt;4: espansione reale</text>
        <text y="54">4-&gt;1: cessione di calore a volume costante</text>
      </g>
    </svg>
  );
}

function renderDiesel(accentColor) {
  return (
    <svg viewBox="0 0 460 320" width="100%" height="100%">
      {ICONS.piston(230, 120, accentColor)}

      <Arrow x1={125} y1={230} x2={185} y2={170} color="#94A3B8" label="Qin" />
      <Arrow x1={275} y1={170} x2={335} y2={230} color="#94A3B8" label="Qout" />

      <PointLabel x={180} y={70} number={1} processLabel="inizio compr." color={accentColor} />
      <PointLabel x={280} y={70} number={2} processLabel="fine compr." color={accentColor} />
      <PointLabel x={300} y={130} number={3} processLabel="comb. isobara" color={accentColor} />
      <PointLabel x={180} y={180} number={4} processLabel="fine espans." color={accentColor} />

      <g transform="translate(18, 220)" fontSize="10" fill="#94A3B8" fontWeight="600">
        <text y="0">1-&gt;2: compressione reale</text>
        <text y="18">2-&gt;3: apporto di calore a pressione costante</text>
        <text y="36">3-&gt;4: espansione reale</text>
        <text y="54">4-&gt;1: cessione di calore a volume costante</text>
      </g>
    </svg>
  );
}

function renderRefrigeration(accentColor) {
  return (
    <svg viewBox="0 0 460 320" width="100%" height="100%">
      {ICONS.compressor(100, 230, accentColor)}
      {ICONS.condenser(230, 70, '#F87171')}
      {ICONS.valve(360, 230, accentColor)}
      {ICONS.evaporator(230, 230, '#38BDF8')}

      <path d="M 126 230 L 196 230" stroke="#94A3B8" strokeWidth={2} fill="none" />
      <Arrow x1={100} y1={204} x2={100} y2={100} label="Win" labelOffset={{ x: -25, y: 0 }} />
      <path d="M 100 100 L 196 100" stroke="#94A3B8" strokeWidth={2} fill="none" />

      <Arrow x1={196} y1={70} x2={126} y2={70} color="#F87171" label="QH" labelOffset={{ x: 0, y: -15 }} />
      <path d="M 264 70 L 360 70 L 360 206" stroke="#94A3B8" strokeWidth={2} fill="none" />
      <Arrow x1={360} y1={206} x2={360} y2={214} label="h = cost" labelOffset={{ x: 30, y: 0 }} />
      <Arrow x1={330} y1={230} x2={264} y2={230} color="#38BDF8" label="QL" labelOffset={{ x: 0, y: 15 }} />

      <PointLabel x={100} y={150} number={1} processLabel="usc. evap." color={accentColor} />
      <PointLabel x={160} y={70} number={2} processLabel="usc. comp." color={accentColor} />
      <PointLabel x={360} y={150} number={3} processLabel="usc. cond." color={accentColor} />
      <PointLabel x={300} y={230} number={4} processLabel="usc. valv." color={accentColor} />
    </svg>
  );
}

function renderCarnot(accentColor) {
  return (
    <svg viewBox="0 0 460 320" width="100%" height="100%">
      {ICONS.heatSource(230, 60, '#EF4444', 'TH')}
      {ICONS.heatEngine(230, 160, accentColor)}
      {ICONS.heatSink(230, 260, '#3B82F6', 'TL')}

      <Arrow x1={230} y1={82} x2={230} y2={135} color="#EF4444" label="QH" labelOffset={{ x: 20, y: 0 }} />
      <Arrow x1={230} y1={185} x2={230} y2={235} color="#3B82F6" label="QL" labelOffset={{ x: 20, y: 0 }} />
      <Arrow x1={258} y1={160} x2={320} y2={160} color={accentColor} label="Wnet" labelOffset={{ x: 0, y: -15 }} />

      <text x={230} y={305} textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="600">
        Ciclo ideale: 2 isoterme + 2 isentropiche
      </text>
    </svg>
  );
}

const SchematicDiagram = ({ type, accentColor = '#38BDF8', width = 460, height = 320 }) => {
  let content = null;

  switch (type) {
    case 'rankine':
      content = renderRankine(accentColor);
      break;
    case 'brayton':
      content = renderBrayton(accentColor);
      break;
    case 'otto':
      content = renderOtto(accentColor);
      break;
    case 'diesel':
      content = renderDiesel(accentColor);
      break;
    case 'refrigeration':
      content = renderRefrigeration(accentColor);
      break;
    case 'carnot':
      content = renderCarnot(accentColor);
      break;
    default:
      content = null;
  }

  return (
    <div className="schematic-container glass">
      <div className="schematic-svg" style={{ width, height }}>
        {content}
      </div>
    </div>
  );
};

export default SchematicDiagram;
export { PointLabel, Arrow, ICONS };
