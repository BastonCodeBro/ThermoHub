import React from 'react';

const TEXT = '#E2E8F0';
const MUTED = '#94A3B8';
const PIPE = '#CBD5E1';
const PANEL = '#0F172A';

const FlowArrow = ({ x1, y1, x2, y2, color = PIPE, width = 3, label, labelX, labelY }) => {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const arrowLen = 10;
  const ax1 = x2 - arrowLen * Math.cos(angle - 0.38);
  const ay1 = y2 - arrowLen * Math.sin(angle - 0.38);
  const ax2 = x2 - arrowLen * Math.cos(angle + 0.38);
  const ay2 = y2 - arrowLen * Math.sin(angle + 0.38);

  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeLinecap="round" />
      <polygon points={`${x2},${y2} ${ax1},${ay1} ${ax2},${ay2}`} fill={color} />
      {label ? (
        <text x={labelX ?? (x1 + x2) / 2} y={labelY ?? (y1 + y2) / 2 - 12} fill={color} fontSize="11" fontWeight="700" textAnchor="middle">
          {label}
        </text>
      ) : null}
    </g>
  );
};

const ShaftLine = ({ x1, x2, y, label = 'ALBERO', color = MUTED }) => (
  <g>
    <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth={4} strokeDasharray="10 6" />
    <text x={(x1 + x2) / 2} y={y - 10} fill={color} fontSize="10" fontWeight="700" textAnchor="middle">
      {label}
    </text>
  </g>
);

const StateTag = ({ x, y, label, detail, color }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x="-22" y="-18" width="44" height="36" rx="10" fill={PANEL} stroke={color} strokeWidth="2" />
    <text y="-2" textAnchor="middle" fill={color} fontSize="13" fontWeight="800">
      {label}
    </text>
    {detail ? (
      <text y="12" textAnchor="middle" fill={MUTED} fontSize="8" fontWeight="700">
        {detail}
      </text>
    ) : null}
  </g>
);

const Boiler = ({ x, y, color }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x="-48" y="-74" width="96" height="148" rx="12" fill="#2A1620" stroke={color} strokeWidth="3" />
    <rect x="-34" y="-48" width="68" height="24" rx="6" fill="none" stroke={color} strokeWidth="2" />
    <rect x="-34" y="-12" width="68" height="24" rx="6" fill="none" stroke={color} strokeWidth="2" />
    <rect x="-34" y="24" width="68" height="24" rx="6" fill="none" stroke={color} strokeWidth="2" />
    <text y="-92" textAnchor="middle" fill={color} fontSize="13" fontWeight="800">CALDAIA</text>
  </g>
);

const Turbine = ({ x, y, color, label = 'TURBINA' }) => (
  <g transform={`translate(${x},${y})`}>
    <polygon points="-38,-42 36,-28 36,28 -38,42" fill="#271D13" stroke={color} strokeWidth="3" />
    <text y="-58" textAnchor="middle" fill={color} fontSize="13" fontWeight="800">{label}</text>
  </g>
);

const Compressor = ({ x, y, color, label = 'COMPRESSORE' }) => (
  <g transform={`translate(${x},${y})`}>
    <polygon points="-36,-28 38,-42 38,42 -36,28" fill="#16263A" stroke={color} strokeWidth="3" />
    <text y="-58" textAnchor="middle" fill={color} fontSize="12" fontWeight="800">{label}</text>
  </g>
);

const Pump = ({ x, y, color }) => (
  <g transform={`translate(${x},${y})`}>
    <circle r="28" fill="#143038" stroke={color} strokeWidth="3" />
    <path d="M-8,12 L-8,-10 L12,-2" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <text y="-44" textAnchor="middle" fill={color} fontSize="12" fontWeight="800">POMPA</text>
  </g>
);

const Condenser = ({ x, y, color }) => (
  <g transform={`translate(${x},${y})`}>
    <circle r="36" fill="#14253B" stroke={color} strokeWidth="3" />
    <path d="M-22,0 Q-16,-10 -10,0 Q-4,10 2,0 Q8,-10 14,0 Q20,10 24,0" fill="none" stroke={color} strokeWidth="2.5" />
    <text y="-52" textAnchor="middle" fill={color} fontSize="12" fontWeight="800">CONDENSATORE</text>
  </g>
);

const Combustor = ({ x, y, color }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x="-42" y="-32" width="84" height="64" rx="12" fill="#2B2117" stroke={color} strokeWidth="3" />
    <path d="M-8,14 C-12,0 -5,-12 0,-4 C4,-14 12,-4 8,14" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
    <text y="-48" textAnchor="middle" fill={color} fontSize="12" fontWeight="800">CAMERA DI COMBUSTIONE</text>
  </g>
);

const Generator = ({ x, y }) => (
  <g transform={`translate(${x},${y})`}>
    <circle r="22" fill="#111827" stroke={TEXT} strokeWidth="2.5" />
    <path d="M-10,0 Q-5,-10 0,0 Q5,10 10,0" fill="none" stroke={TEXT} strokeWidth="2" />
    <text y="38" textAnchor="middle" fill={TEXT} fontSize="10" fontWeight="700">GENERATORE</text>
  </g>
);

const HeatExchanger = ({ x, y, color, label }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x="-42" y="-28" width="84" height="56" rx="10" fill="#182233" stroke={color} strokeWidth="3" />
    <path d="M-26,4 H26" stroke={color} strokeWidth="2.5" />
    <path d="M-18,-8 Q-10,-16 -2,-8 Q6,0 14,-8 Q22,-16 30,-8" fill="none" stroke={color} strokeWidth="2" />
    <text y="-44" textAnchor="middle" fill={color} fontSize="12" fontWeight="800">{label}</text>
  </g>
);

const Valve = ({ x, y, color }) => (
  <g transform={`translate(${x},${y})`}>
    <polygon points="-18,-16 18,16 -18,16" fill="#25161B" stroke={color} strokeWidth="3" />
    <line x1="-18" y1="16" x2="18" y2="-16" stroke={color} strokeWidth="2" />
    <text y="-30" textAnchor="middle" fill={color} fontSize="11" fontWeight="800">VALVOLA</text>
  </g>
);

const Cylinder = ({ x, y, color, label, topLabel }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x="-54" y="-56" width="108" height="112" rx="10" fill="#1A2436" stroke={color} strokeWidth="3" />
    <rect x="-40" y="-6" width="80" height="16" rx="4" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="2" />
    <line x1="0" y1="-6" x2="0" y2="-72" stroke={color} strokeWidth="3" />
    <circle cx="0" cy="-78" r="7" fill={color} />
    <text y="-92" textAnchor="middle" fill={color} fontSize="12" fontWeight="800">{topLabel}</text>
    <text y="76" textAnchor="middle" fill={TEXT} fontSize="12" fontWeight="800">{label}</text>
  </g>
);

function renderRankine() {
  const hot = '#F97316';
  const cold = '#60A5FA';
  const mech = '#22D3EE';

  return (
    <svg viewBox="0 0 520 340" width="100%" height="100%">
      <Boiler x={120} y={132} color={hot} />
      <Turbine x={360} y={82} color="#FB923C" />
      <Generator x={452} y={82} />
      <Condenser x={364} y={250} color={cold} />
      <Pump x={140} y={250} color={mech} />

      <ShaftLine x1={392} x2={430} y={82} label="ALBERO" />

      <FlowArrow x1={140} y1={220} x2={140} y2={170} color={mech} label="Wp" labelX={114} labelY={194} />
      <FlowArrow x1={140} y1={170} x2={140} y2={82} color={mech} />
      <FlowArrow x1={140} y1={82} x2={320} y2={82} color={hot} label="Qin" labelX={230} labelY={64} />
      <FlowArrow x1={400} y1={82} x2={400} y2={214} color="#FB923C" label="Wt" labelX={426} labelY={156} />
      <FlowArrow x1={328} y1={250} x2={176} y2={250} color={cold} label="Qout" labelX={252} labelY={276} />

      <StateTag x={172} y={250} label="1" detail="usc. cond." color={cold} />
      <StateTag x={140} y={160} label="2" detail="usc. pompa" color={mech} />
      <StateTag x={332} y={82} label="3" detail="usc. caldaia" color={hot} />
      <StateTag x={400} y={214} label="4" detail="usc. turbina" color="#FB923C" />
    </svg>
  );
}

function renderBrayton() {
  const comp = '#60A5FA';
  const heat = '#F97316';
  const turb = '#34D399';

  return (
    <svg viewBox="0 0 520 320" width="100%" height="100%">
      <Compressor x={116} y={150} color={comp} />
      <Combustor x={258} y={110} color={heat} />
      <Turbine x={400} y={150} color={turb} />
      <Generator x={472} y={150} />

      <ShaftLine x1={148} x2={450} y={212} label="ALBERO MOTORE" />

      <FlowArrow x1={20} y1={150} x2={76} y2={150} color={comp} label="ARIA" labelX={46} labelY={132} />
      <FlowArrow x1={154} y1={150} x2={216} y2={150} color={PIPE} label="1 -> 2" labelY={132} />
      <FlowArrow x1={258} y1={26} x2={258} y2={74} color={heat} label="COMBUSTIBILE" labelY={18} />
      <FlowArrow x1={300} y1={150} x2={360} y2={150} color={PIPE} label="2 -> 3" labelY={132} />
      <FlowArrow x1={440} y1={150} x2={506} y2={150} color={turb} label="SCARICO" labelX={472} labelY={132} />

      <StateTag x={76} y={114} label="1" detail="asp." color={comp} />
      <StateTag x={182} y={188} label="2" detail="usc. comp." color={comp} />
      <StateTag x={334} y={188} label="3" detail="ingr. turb." color={heat} />
      <StateTag x={438} y={114} label="4" detail="usc. turb." color={turb} />
    </svg>
  );
}

function renderOtto(color) {
  return (
    <svg viewBox="0 0 520 320" width="100%" height="100%">
      <Cylinder x={260} y={128} color={color} label="CILINDRO - CICLO OTTO" topLabel="CANDELA" />
      <FlowArrow x1={178} y1={74} x2={218} y2={74} color="#60A5FA" label="1 -> 2" />
      <FlowArrow x1={302} y1={74} x2={342} y2={74} color="#F97316" label="2 -> 3" />
      <FlowArrow x1={322} y1={218} x2={362} y2={218} color="#34D399" label="3 -> 4" />
      <FlowArrow x1={198} y1={218} x2={158} y2={218} color="#94A3B8" label="4 -> 1" />

      <text x="260" y="278" textAnchor="middle" fill={MUTED} fontSize="11" fontWeight="700">
        Compressione ed espansione politropiche, scambio termico isocoro
      </text>

      <StateTag x={160} y={74} label="1" detail="inizio compr." color={color} />
      <StateTag x={360} y={74} label="2" detail="fine compr." color={color} />
      <StateTag x={360} y={218} label="3" detail="comb. isocora" color={color} />
      <StateTag x={160} y={218} label="4" detail="fine esp." color={color} />
    </svg>
  );
}

function renderDiesel(color) {
  return (
    <svg viewBox="0 0 520 320" width="100%" height="100%">
      <Cylinder x={260} y={128} color={color} label="CILINDRO - CICLO DIESEL" topLabel="INIETTORE" />
      <FlowArrow x1={178} y1={74} x2={218} y2={74} color="#60A5FA" label="1 -> 2" />
      <FlowArrow x1={302} y1={108} x2={356} y2={108} color="#F97316" label="2 -> 3 (p cost)" labelY={92} />
      <FlowArrow x1={322} y1={218} x2={362} y2={218} color="#34D399" label="3 -> 4" />
      <FlowArrow x1={198} y1={218} x2={158} y2={218} color="#94A3B8" label="4 -> 1" />

      <text x="260" y="278" textAnchor="middle" fill={MUTED} fontSize="11" fontWeight="700">
        Combustione a pressione quasi costante, scarico termico isocoro
      </text>

      <StateTag x={160} y={74} label="1" detail="inizio compr." color={color} />
      <StateTag x={360} y={74} label="2" detail="fine compr." color={color} />
      <StateTag x={382} y={108} label="3" detail="comb. isobara" color={color} />
      <StateTag x={160} y={218} label="4" detail="fine esp." color={color} />
    </svg>
  );
}

function renderRefrigeration(color) {
  const hot = '#F87171';
  const cold = '#38BDF8';

  return (
    <svg viewBox="0 0 520 340" width="100%" height="100%">
      <Compressor x={100} y={244} color={color} label="COMPRESSORE" />
      <HeatExchanger x={252} y={82} color={hot} label="CONDENSATORE" />
      <Valve x={420} y={244} color={color} />
      <HeatExchanger x={252} y={244} color={cold} label="EVAPORATORE" />

      <FlowArrow x1={130} y1={220} x2={182} y2={108} color={PIPE} label="Win" labelX={130} labelY={152} />
      <FlowArrow x1={294} y1={82} x2={378} y2={82} color={hot} label="QH" />
      <FlowArrow x1={420} y1={108} x2={420} y2={214} color={PIPE} label="h = cost" labelX={454} labelY={164} />
      <FlowArrow x1={378} y1={244} x2={294} y2={244} color={cold} label="QL" labelY={270} />
      <FlowArrow x1={210} y1={244} x2={128} y2={244} color={PIPE} />

      <StateTag x={128} y={244} label="1" detail="usc. evap." color={cold} />
      <StateTag x={196} y={108} label="2" detail="usc. comp." color={color} />
      <StateTag x={388} y={82} label="3" detail="usc. cond." color={hot} />
      <StateTag x={388} y={244} label="4" detail="usc. valv." color={color} />
    </svg>
  );
}

function renderCarnot(color) {
  return (
    <svg viewBox="0 0 520 320" width="100%" height="100%">
      <rect x="196" y="26" width="128" height="50" rx="14" fill="#2B1818" stroke="#EF4444" strokeWidth="3" />
      <rect x="196" y="244" width="128" height="50" rx="14" fill="#16263A" stroke="#3B82F6" strokeWidth="3" />
      <rect x="190" y="114" width="140" height="90" rx="18" fill="#171E2D" stroke={color} strokeWidth="3" />

      <text x="260" y="56" textAnchor="middle" fill="#EF4444" fontSize="16" fontWeight="800">TH</text>
      <text x="260" y="274" textAnchor="middle" fill="#3B82F6" fontSize="16" fontWeight="800">TL</text>
      <text x="260" y="154" textAnchor="middle" fill={color} fontSize="16" fontWeight="800">MOTORE</text>
      <text x="260" y="176" textAnchor="middle" fill={color} fontSize="16" fontWeight="800">CARNOT</text>

      <FlowArrow x1={260} y1={76} x2={260} y2={114} color="#EF4444" label="QH" labelX={286} labelY={100} />
      <FlowArrow x1={260} y1={204} x2={260} y2={244} color="#3B82F6" label="QL" labelX={286} labelY={228} />
      <FlowArrow x1={330} y1={160} x2={418} y2={160} color={color} label="Wnet" labelY={142} />

      <text x="260" y="312" textAnchor="middle" fill={MUTED} fontSize="11" fontWeight="700">
        2 isoterme + 2 isentropiche
      </text>
    </svg>
  );
}

const SchematicDiagram = ({ type, accentColor = '#38BDF8', width = 520, height = 340 }) => {
  let content = null;

  switch (type) {
    case 'rankine':
      content = renderRankine();
      break;
    case 'brayton':
      content = renderBrayton();
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
