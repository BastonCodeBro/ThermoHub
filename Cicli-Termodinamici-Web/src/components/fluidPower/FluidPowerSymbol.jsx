import React from 'react';

const domainColor = (component, active) => {
  const base = component.domain === 'hydraulic' ? '#F59E0B' : '#38BDF8';
  return active ? '#22D3EE' : base;
};

const Box = ({ children, border = '#38BDF8', fill = '#0F172A' }) => (
  <rect x="12" y="12" width="136" height="72" rx="14" fill={fill} stroke={border} strokeWidth="3" />
);

const DirectionalValve = ({ component, color }) => {
  const family = component.simBehavior.family;
  const rightPorts = family === '3/2' ? ['A'] : ['A', 'B'];

  return (
    <>
      <rect x="18" y="20" width="124" height="56" rx="12" fill="#111827" stroke={color} strokeWidth="3" />
      <line x1="80" y1="20" x2="80" y2="76" stroke={color} strokeWidth="2" />
      <path d="M40 48 H68" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <polygon points="68,48 58,42 58,54" fill={color} />
      <path d="M92 48 H120" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray="5 4" />
      <text x="30" y="30" fill={color} fontSize="12" fontWeight="800">P</text>
      {rightPorts.map((port, index) => (
        <text key={port} x="124" y={index === 0 ? 30 : 68} fill={color} fontSize="12" fontWeight="800">
          {port}
        </text>
      ))}
      {(component.simBehavior.returnPorts ?? []).map((port, index) => (
        <text key={port} x={index === 0 ? 46 : 104} y="72" fill={color} fontSize="11" fontWeight="800">
          {port}
        </text>
      ))}
      <text x="80" y="94" textAnchor="middle" fill="#94A3B8" fontSize="11" fontWeight="700">
        {family}
      </text>
    </>
  );
};

const renderSymbol = (component, color) => {
  switch (component.symbol) {
    case 'single-cylinder':
      return (
        <>
          <Box border={color} />
          <rect x="34" y="36" width="72" height="24" rx="6" fill="none" stroke={color} strokeWidth="3" />
          <line x1="106" y1="48" x2="138" y2="48" stroke={color} strokeWidth="3" />
          <circle cx="141" cy="48" r="4" fill={color} />
          <path d="M24 48 H34" stroke={color} strokeWidth="3" />
          <path d="M20 38 L28 48 L20 58" fill="none" stroke="#94A3B8" strokeWidth="2" />
        </>
      );
    case 'double-cylinder':
      return (
        <>
          <Box border={color} />
          <rect x="34" y="34" width="80" height="28" rx="6" fill="none" stroke={color} strokeWidth="3" />
          <line x1="114" y1="48" x2="140" y2="48" stroke={color} strokeWidth="3" />
          <circle cx="143" cy="48" r="4" fill={color} />
          <path d="M20 36 H34" stroke={color} strokeWidth="3" />
          <path d="M20 60 H34" stroke={color} strokeWidth="3" />
        </>
      );
    case 'rotary-motor':
      return (
        <>
          <circle cx="80" cy="48" r="28" fill="#111827" stroke={color} strokeWidth="3" />
          <path d="M70 60 V38 L94 48 Z" fill={color} fillOpacity="0.22" stroke={color} strokeWidth="2" />
          <path d="M20 36 H52" stroke={color} strokeWidth="3" />
          <path d="M108 60 H140" stroke={color} strokeWidth="3" />
        </>
      );
    case 'pump':
    case 'compressor':
      return (
        <>
          <circle cx="80" cy="48" r="30" fill="#111827" stroke={color} strokeWidth="3" />
          <path d="M68 60 V36 L96 48 Z" fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" />
          <path d="M20 48 H50" stroke={color} strokeWidth="3" />
          <path d="M110 48 H140" stroke={color} strokeWidth="3" />
          <path d="M80 12 V24" stroke="#94A3B8" strokeWidth="3" />
        </>
      );
    case 'prime-mover':
      return (
        <>
          <circle cx="80" cy="42" r="28" fill="#111827" stroke={color} strokeWidth="3" />
          <path d="M60 42 Q70 20 80 42 Q90 64 100 42" fill="none" stroke={color} strokeWidth="3" />
          <path d="M80 70 V84" stroke="#94A3B8" strokeWidth="3" />
        </>
      );
    case 'reservoir':
      return (
        <>
          <rect x="32" y="26" width="96" height="48" rx="10" fill="#111827" stroke={color} strokeWidth="3" />
          <path d="M46 48 Q58 40 70 48 T94 48 T118 48" fill="none" stroke={color} strokeWidth="3" />
          <path d="M58 18 V26 M102 18 V26" stroke="#94A3B8" strokeWidth="3" />
        </>
      );
    case 'flow-control':
      return (
        <>
          <rect x="28" y="26" width="104" height="44" rx="12" fill="#111827" stroke={color} strokeWidth="3" />
          <path d="M40 48 H120" stroke={color} strokeWidth="3" />
          <path d="M54 62 L106 34" stroke={color} strokeWidth="3" />
        </>
      );
    case 'check-valve':
      return (
        <>
          <rect x="28" y="26" width="104" height="44" rx="12" fill="#111827" stroke={color} strokeWidth="3" />
          <path d="M44 48 H116" stroke={color} strokeWidth="3" />
          <polygon points="70,38 92,48 70,58" fill="none" stroke={color} strokeWidth="3" />
          <line x1="102" y1="34" x2="102" y2="62" stroke={color} strokeWidth="3" />
        </>
      );
    case 'logic-valve':
      return (
        <>
          <rect x="28" y="26" width="104" height="44" rx="12" fill="#111827" stroke={color} strokeWidth="3" />
          <path d="M44 48 H76" stroke={color} strokeWidth="3" />
          <path d="M84 38 L104 48 L84 58 Z" fill="none" stroke={color} strokeWidth="3" />
          <path d="M104 48 H116" stroke={color} strokeWidth="3" />
        </>
      );
    case 'limit-valve':
      return (
        <>
          <DirectionalValve component={{ ...component, simBehavior: { ...component.simBehavior, family: '3/2' } }} color={color} />
          <path d="M24 16 L36 8" stroke="#94A3B8" strokeWidth="3" />
          <circle cx="40" cy="8" r="5" fill="#94A3B8" />
        </>
      );
    case 'frl':
      return (
        <>
          <rect x="20" y="26" width="120" height="44" rx="12" fill="#111827" stroke={color} strokeWidth="3" />
          <line x1="58" y1="26" x2="58" y2="70" stroke={color} strokeWidth="2" />
          <line x1="98" y1="26" x2="98" y2="70" stroke={color} strokeWidth="2" />
          <circle cx="38" cy="48" r="6" fill="none" stroke={color} strokeWidth="2" />
          <path d="M74 38 V58" stroke={color} strokeWidth="3" />
          <path d="M116 36 Q110 48 116 60" fill="none" stroke={color} strokeWidth="3" />
        </>
      );
    case 'exhaust':
      return (
        <>
          <rect x="34" y="18" width="92" height="52" rx="12" fill="#111827" stroke={color} strokeWidth="3" />
          <path d="M80 18 V4" stroke={color} strokeWidth="3" />
          <path d="M58 70 L48 84 M72 70 L66 86 M88 70 L88 86 M102 70 L110 84" stroke="#94A3B8" strokeWidth="3" />
        </>
      );
    default:
      return <DirectionalValve component={component} color={color} />;
  }
};

const FluidPowerSymbol = ({ component, active = false, label }) => {
  const color = domainColor(component, active);

  return (
    <svg viewBox="0 0 160 100" className="fluid-symbol" role="img" aria-label={label ?? component.label}>
      {renderSymbol(component, color)}
    </svg>
  );
};

export default FluidPowerSymbol;
