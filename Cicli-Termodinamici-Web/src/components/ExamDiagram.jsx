import React, { useId } from 'react';

const tones = {
  cyan: {
    fill: 'rgba(56, 189, 248, 0.12)',
    stroke: '#38BDF8',
    text: '#E0F2FE',
  },
  amber: {
    fill: 'rgba(245, 158, 11, 0.13)',
    stroke: '#F59E0B',
    text: '#FEF3C7',
  },
  slate: {
    fill: 'rgba(148, 163, 184, 0.12)',
    stroke: '#94A3B8',
    text: '#E2E8F0',
  },
  emerald: {
    fill: 'rgba(16, 185, 129, 0.13)',
    stroke: '#10B981',
    text: '#D1FAE5',
  },
};

const DiagramNode = ({ x, y, width, height, title, subtitle, tone = 'cyan' }) => {
  const style = tones[tone];

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="16"
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth="2"
      />
      <text x={x + width / 2} y={y + 26} textAnchor="middle" fill={style.text} fontSize="14" fontWeight="700">
        {title}
      </text>
      <text x={x + width / 2} y={y + 46} textAnchor="middle" fill="#94A3B8" fontSize="11">
        {subtitle}
      </text>
    </g>
  );
};

const FlowArrow = ({ d, markerEnd, stroke = '#64748B', dash = '' }) => (
  <path
    d={d}
    fill="none"
    stroke={stroke}
    strokeWidth="3.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    markerEnd={markerEnd}
    strokeDasharray={dash}
  />
);

const ExamDiagram = ({ meta }) => {
  const arrowId = useId();

  if (!meta) {
    return null;
  }

  return (
    <div className="exam-diagram-frame">
      <svg
        viewBox="0 0 760 380"
        className="exam-diagram-svg"
        role="img"
        aria-label={meta.title}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`${arrowId}-grid`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(56,189,248,0.16)" />
            <stop offset="100%" stopColor="rgba(245,158,11,0.10)" />
          </linearGradient>
          <marker id={arrowId} markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0 0L10 5L0 10Z" fill="#94A3B8" />
          </marker>
        </defs>

        <rect x="18" y="18" width="724" height="344" rx="24" fill="#07111F" stroke="rgba(148, 163, 184, 0.16)" />
        <path d="M30 100H730M30 190H730M30 280H730" stroke="rgba(148, 163, 184, 0.06)" strokeWidth="1" />
        <path d="M140 30V350M270 30V350M400 30V350M530 30V350M660 30V350" stroke="rgba(148, 163, 184, 0.05)" strokeWidth="1" />

        {meta.type === 'diesel-steam' && (
          <>
            <DiagramNode x="54" y="108" width="140" height="72" title="Motore diesel" subtitle="Propulsione" tone="cyan" />
            <DiagramNode x="256" y="108" width="160" height="72" title="Gas di scarico" subtitle="Recupero termico" tone="slate" />
            <DiagramNode x="482" y="108" width="182" height="72" title="Caldaia a recupero" subtitle="Produzione vapore" tone="amber" />
            <DiagramNode x="536" y="236" width="128" height="72" title="Servizi nave" subtitle="Utenze ausiliarie" tone="emerald" />
            <DiagramNode x="238" y="236" width="148" height="72" title="Pompa alimento" subtitle="Condense" tone="cyan" />
            <FlowArrow d="M194 144H256" markerEnd={`url(#${arrowId})`} />
            <FlowArrow d="M416 144H482" markerEnd={`url(#${arrowId})`} />
            <FlowArrow d="M572 180V236" markerEnd={`url(#${arrowId})`} />
            <FlowArrow d="M536 272H386" markerEnd={`url(#${arrowId})`} stroke="#38BDF8" />
            <FlowArrow d="M238 272H118V180" markerEnd={`url(#${arrowId})`} stroke="#F59E0B" dash="8 8" />
          </>
        )}

        {meta.type === 'cogag' && (
          <>
            <DiagramNode x="44" y="106" width="134" height="72" title="GT crociera" subtitle="Coppia 1" tone="cyan" />
            <DiagramNode x="44" y="226" width="134" height="72" title="GT boost" subtitle="Coppia 2" tone="amber" />
            <DiagramNode x="250" y="166" width="170" height="82" title="Riduttore" subtitle="Frizioni e innesti" tone="slate" />
            <DiagramNode x="502" y="166" width="188" height="82" title="Linea d'asse" subtitle="Reggispinta + elica" tone="emerald" />
            <FlowArrow d="M178 142C214 142 218 166 250 186" markerEnd={`url(#${arrowId})`} />
            <FlowArrow d="M178 262C214 262 218 238 250 228" markerEnd={`url(#${arrowId})`} />
            <FlowArrow d="M420 207H502" markerEnd={`url(#${arrowId})`} />
          </>
        )}

        {meta.type === 'cargo-pump' && (
          <>
            <DiagramNode x="50" y="120" width="146" height="74" title="Cisterna" subtitle="1000 m3 greggio" tone="slate" />
            <DiagramNode x="274" y="70" width="152" height="74" title="Pompa 1" subtitle="Mandata parallela" tone="cyan" />
            <DiagramNode x="274" y="214" width="152" height="74" title="Pompa 2" subtitle="Mandata parallela" tone="cyan" />
            <DiagramNode x="520" y="144" width="180" height="74" title="Manifold" subtitle="Scarico a terra" tone="amber" />
            <FlowArrow d="M196 157H274" markerEnd={`url(#${arrowId})`} />
            <FlowArrow d="M196 157C232 157 236 251 274 251" markerEnd={`url(#${arrowId})`} />
            <FlowArrow d="M426 107C470 107 470 154 520 154" markerEnd={`url(#${arrowId})`} />
            <FlowArrow d="M426 251C470 251 470 208 520 208" markerEnd={`url(#${arrowId})`} />
          </>
        )}

        {meta.type === 'traditional-propulsion' && (
          <>
            <DiagramNode x="42" y="152" width="154" height="74" title="Motore principale" subtitle="Medium speed" tone="cyan" />
            <DiagramNode x="246" y="152" width="124" height="74" title="Giunto" subtitle="Elastico" tone="slate" />
            <DiagramNode x="420" y="152" width="128" height="74" title="Riduttore" subtitle="Abbassa i giri" tone="amber" />
            <DiagramNode x="598" y="152" width="112" height="74" title="Elica" subtitle="Spinta nave" tone="emerald" />
            <FlowArrow d="M196 189H246" markerEnd={`url(#${arrowId})`} />
            <FlowArrow d="M370 189H420" markerEnd={`url(#${arrowId})`} />
            <FlowArrow d="M548 189H598" markerEnd={`url(#${arrowId})`} />
            <FlowArrow d="M120 152V86H484V152" markerEnd={`url(#${arrowId})`} stroke="#F59E0B" dash="8 8" />
          </>
        )}

        {meta.type === 'lng-electric' && (
          <>
            <DiagramNode x="52" y="144" width="144" height="76" title="Turbina a gas" subtitle="Gruppo 1..3" tone="amber" />
            <DiagramNode x="266" y="144" width="150" height="76" title="Alternatore" subtitle="Generazione elettrica" tone="cyan" />
            <DiagramNode x="486" y="86" width="178" height="76" title="Quadro principale" subtitle="Distribuzione" tone="slate" />
            <DiagramNode x="486" y="226" width="178" height="76" title="Azipod" subtitle="Propulsione elettrica" tone="emerald" />
            <FlowArrow d="M196 182H266" markerEnd={`url(#${arrowId})`} />
            <FlowArrow d="M416 182C452 182 452 132 486 124" markerEnd={`url(#${arrowId})`} />
            <FlowArrow d="M416 182C452 182 452 250 486 264" markerEnd={`url(#${arrowId})`} />
          </>
        )}

        {meta.type === 'slow-diesel' && (
          <>
            <DiagramNode x="44" y="152" width="160" height="76" title="Diesel lento" subtitle="8 cilindri in linea" tone="cyan" />
            <DiagramNode x="278" y="70" width="164" height="76" title="Turbo" subtitle="Sovralimentazione" tone="amber" />
            <DiagramNode x="278" y="234" width="164" height="76" title="Linea d'asse" subtitle="Reggispinta + astuccio" tone="slate" />
            <DiagramNode x="532" y="152" width="154" height="76" title="Elica" subtitle="Spinta di progetto" tone="emerald" />
            <FlowArrow d="M204 189H278" markerEnd={`url(#${arrowId})`} stroke="#38BDF8" />
            <FlowArrow d="M204 189C238 189 246 272 278 272" markerEnd={`url(#${arrowId})`} />
            <FlowArrow d="M442 272H532" markerEnd={`url(#${arrowId})`} />
            <FlowArrow d="M442 108C494 108 496 152 532 172" markerEnd={`url(#${arrowId})`} stroke="#F59E0B" dash="8 8" />
          </>
        )}

        <text x="44" y="54" fill="#E2E8F0" fontSize="20" fontWeight="800">
          {meta.title}
        </text>
        <text x="44" y="76" fill="#94A3B8" fontSize="12">
          {meta.caption}
        </text>
      </svg>
    </div>
  );
};

export default ExamDiagram;
