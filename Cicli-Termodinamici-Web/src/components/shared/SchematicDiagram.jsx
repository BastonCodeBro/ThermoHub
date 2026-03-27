import React from 'react';

const clampPoints = (points) => (Array.isArray(points) ? points.filter(Boolean) : []);

const COLORS = {
  hot: '#F97316',
  cold: '#60A5FA',
  work: '#A78BFA',
  neutral: '#38BDF8',
  return: '#22D3EE',
  exhaust: '#94A3B8',
};

const BOX_FILL = 'rgba(8, 15, 28, 0.96)';
const BOX_BORDER = 'rgba(255, 255, 255, 0.1)';
const BADGE_FILL = '#1E1B4B';
const BADGE_STROKE = '#A78BFA';
const DOT_FILL = '#A78BFA';

const splitLabel = (label) => (Array.isArray(label) ? label : String(label ?? '').split('|').filter(Boolean));
const linePath = (...points) => points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');

const formatPoint = (point) => [
  Number.isFinite(point?.p) ? `P ${point.p.toFixed(2)} bar` : null,
  Number.isFinite(point?.t) ? `T ${point.t.toFixed(1)} degC` : null,
  Number.isFinite(point?.h) ? `h ${point.h.toFixed(1)} kJ/kg` : null,
  Number.isFinite(point?.s) ? `s ${point.s.toFixed(3)} kJ/(kg K)` : null,
].filter(Boolean);

const rectLoop = ({
  title,
  subtitle,
  left,
  top,
  right,
  bottom,
  colors,
}) => {
  const p1 = { x: 150, y: 320, badge: 'bl' };
  const p2 = { x: 150, y: 140, badge: 'tl' };
  const p3 = { x: 630, y: 140, badge: 'tr' };
  const p4 = { x: 630, y: 320, badge: 'br' };

  return {
    title,
    subtitle,
    viewBoxHeight: 430,
    components: [
      { ...left, x: 150, y: 230, w: 164, h: 62 },
      { ...top, x: 390, y: 140, w: 196, h: 62 },
      { ...right, x: 630, y: 230, w: 164, h: 62 },
      { ...bottom, x: 390, y: 320, w: 196, h: 62 },
    ],
    pipes: [
      { d: linePath(p1, p2), color: colors.left },
      { d: linePath(p2, p3), color: colors.top },
      { d: linePath(p3, p4), color: colors.right },
      { d: linePath(p4, p1), color: colors.bottom },
    ],
    markers: [p1, p2, p3, p4],
  };
};

const dualLoop = () => {
  const p1 = { x: 150, y: 320, badge: 'bl' };
  const p2 = { x: 150, y: 140, badge: 'tl' };
  const p3 = { x: 390, y: 140, badge: 'top' };
  const p4 = { x: 630, y: 140, badge: 'tr' };
  const p5 = { x: 630, y: 320, badge: 'br' };

  return {
    title: 'Schema ciclo Duale',
    subtitle: 'Stesso linguaggio grafico per leggere le due fasi di apporto termico: prima isocora, poi isobara.',
    viewBoxHeight: 430,
    components: [
      { title: 'Compressione', kind: 'compressor', x: 150, y: 230, w: 164, h: 62 },
      { title: 'Calore isocoro', kind: 'heater', x: 270, y: 140, w: 176, h: 62 },
      { title: 'Calore isobaro', kind: 'heater', x: 510, y: 140, w: 176, h: 62 },
      { title: 'Espansione', kind: 'turbine', x: 630, y: 230, w: 164, h: 62 },
      { title: 'Raffreddamento', kind: 'cooler', x: 390, y: 320, w: 196, h: 62 },
    ],
    pipes: [
      { d: linePath(p1, p2), color: COLORS.cold },
      { d: linePath(p2, p3), color: COLORS.hot },
      { d: linePath(p3, p4), color: '#FB7185' },
      { d: linePath(p4, p5), color: COLORS.work },
      { d: linePath(p5, p1), color: COLORS.return },
    ],
    markers: [p1, p2, p3, p4, p5],
  };
};

const reheatRankineLoop = () => {
  const p1 = { x: 130, y: 320, badge: 'bl' };
  const p2 = { x: 130, y: 150, badge: 'tl' };
  const p3 = { x: 300, y: 150, badge: 'top' };
  const p4 = { x: 470, y: 150, badge: 'top' };
  const p5 = { x: 640, y: 150, badge: 'tr' };
  const p6 = { x: 640, y: 320, badge: 'br' };

  return {
    title: 'Schema Rankine con risurriscaldamento',
    subtitle: 'La stessa linea di flusso evidenzia i due stadi di turbina separati dal reheat.',
    viewBoxHeight: 430,
    components: [
      { title: 'Pompa', kind: 'pump', x: 130, y: 235, w: 150, h: 62 },
      { title: 'Caldaia', kind: 'heater', x: 215, y: 150, w: 150, h: 62 },
      { title: 'Turbina HP', kind: 'turbine', x: 385, y: 150, w: 150, h: 62 },
      { title: 'Reheater', note: 'Risurriscaldo', kind: 'heater', x: 555, y: 150, w: 150, h: 62 },
      { title: 'Turbina LP', kind: 'turbine', x: 640, y: 235, w: 150, h: 62 },
      { title: 'Condensatore', kind: 'cooler', x: 385, y: 320, w: 210, h: 62 },
    ],
    pipes: [
      { d: linePath(p1, p2), color: COLORS.cold },
      { d: linePath(p2, p3), color: COLORS.hot },
      { d: linePath(p3, p4), color: COLORS.work },
      { d: linePath(p4, p5), color: '#FB7185' },
      { d: linePath(p5, p6), color: COLORS.work },
      { d: linePath(p6, p1), color: COLORS.return },
    ],
    markers: [p1, p2, p5, p3, p4, p6],
  };
};

const regenerativeBraytonLoop = () => {
  const p1 = { x: 120, y: 320, badge: 'bl' };
  const p2 = { x: 120, y: 160, badge: 'tl' };
  const p5 = { x: 320, y: 160, badge: 'top' };
  const p3 = { x: 560, y: 160, badge: 'tr' };
  const p4 = { x: 560, y: 320, badge: 'br' };
  const p6 = { x: 320, y: 320, badge: 'bottom' };

  return {
    title: 'Schema Brayton rigenerativo',
    subtitle: 'Il rigeneratore e leggibile come componente unico con due passaggi: aria compressa in alto, gas caldi in basso.',
    viewBoxHeight: 430,
    components: [
      { title: 'Compressore', kind: 'compressor', x: 120, y: 240, w: 154, h: 62 },
      { title: 'Rigeneratore', note: 'Doppio passaggio', kind: 'regenerator', x: 320, y: 240, w: 176, h: 112 },
      { title: 'Combustore', kind: 'heater', x: 440, y: 160, w: 168, h: 62 },
      { title: 'Turbina', kind: 'turbine', x: 560, y: 240, w: 154, h: 62 },
      { title: 'Scarico', kind: 'generic', x: 190, y: 320, w: 126, h: 54 },
    ],
    pipes: [
      { d: linePath(p1, p2), color: COLORS.cold },
      { d: linePath(p2, p5), color: COLORS.neutral },
      { d: linePath(p5, p3), color: COLORS.hot },
      { d: linePath(p3, p4), color: COLORS.work },
      { d: linePath(p4, p6), color: '#F59E0B' },
      { d: linePath(p6, p1), color: COLORS.exhaust },
    ],
    markers: [p1, p2, p3, p4, p5, p6],
  };
};

const combinedLoop = () => {
  const p1 = { x: 90, y: 130, badge: 'left' };
  const p2 = { x: 220, y: 360, badge: 'left' };
  const p3 = { x: 470, y: 130, badge: 'top' };
  const p4 = { x: 620, y: 130, badge: 'right' };
  const p5 = { x: 470, y: 360, badge: 'top' };
  const p6 = { x: 620, y: 360, badge: 'right' };

  return {
    title: 'Schema ciclo combinato gas-vapore',
    subtitle: 'Gas e vapore condividono l HRSG: in alto il Brayton, in basso il Rankine con lo stesso linguaggio grafico.',
    viewBoxHeight: 520,
    components: [
      { title: 'Compressore', kind: 'compressor', x: 170, y: 130, w: 156, h: 62 },
      { title: 'Combustore', kind: 'heater', x: 350, y: 130, w: 164, h: 62 },
      { title: 'Turbina gas', kind: 'turbine', x: 550, y: 130, w: 160, h: 62 },
      { title: 'HRSG', note: 'Recupero gas-vapore', kind: 'regenerator', x: 360, y: 245, w: 192, h: 118 },
      { title: 'Pompa', kind: 'pump', x: 170, y: 420, w: 142, h: 60 },
      { title: 'Turbina vapore', kind: 'turbine', x: 550, y: 360, w: 180, h: 62 },
      { title: 'Condensatore', kind: 'cooler', x: 360, y: 450, w: 196, h: 62 },
    ],
    pipes: [
      { d: linePath({ x: 70, y: 130 }, { x: 620, y: 130 }), color: COLORS.hot },
      { d: linePath({ x: 620, y: 130 }, { x: 620, y: 245 }, { x: 90, y: 245 }), color: COLORS.exhaust },
      { d: linePath({ x: 90, y: 450 }, { x: 220, y: 450 }, { x: 220, y: 360 }, p2), color: COLORS.cold },
      { d: linePath(p2, p5), color: COLORS.neutral },
      { d: linePath(p5, p6), color: COLORS.hot },
      { d: linePath(p6, { x: 620, y: 450 }, { x: 90, y: 450 }), color: COLORS.return },
    ],
    markers: [p1, p2, p3, p4, p5, p6],
  };
};

const getLayout = (type) => {
  switch (type) {
    case 'otto':
      return rectLoop({
        title: 'Schema motore Otto',
        subtitle: 'Compressione, combustione isocora, espansione e raffreddamento con stati numerati sul percorso.',
        left: { title: 'Compressione', kind: 'compressor' },
        top: { title: 'Combustione|isocora', kind: 'heater' },
        right: { title: 'Espansione', kind: 'turbine' },
        bottom: { title: 'Raffreddamento', kind: 'cooler' },
        colors: { left: COLORS.cold, top: COLORS.hot, right: COLORS.work, bottom: COLORS.return },
      });
    case 'diesel':
      return rectLoop({
        title: 'Schema motore Diesel',
        subtitle: 'Stessa struttura, ma con apporto termico isobaro nel tratto superiore del ciclo.',
        left: { title: 'Compressione', kind: 'compressor' },
        top: { title: 'Combustione|isobara', kind: 'heater' },
        right: { title: 'Espansione', kind: 'turbine' },
        bottom: { title: 'Raffreddamento', kind: 'cooler' },
        colors: { left: COLORS.cold, top: COLORS.hot, right: COLORS.work, bottom: COLORS.return },
      });
    case 'dual':
      return dualLoop();
    case 'carnot': {
      const p1 = { x: 150, y: 140, badge: 'tl' };
      const p2 = { x: 630, y: 140, badge: 'tr' };
      const p3 = { x: 630, y: 320, badge: 'br' };
      const p4 = { x: 150, y: 320, badge: 'bl' };
      return {
        title: 'Schema Carnot',
        subtitle: 'Le due isoterme e le due adiabatiche sono presentate come componenti coerenti con gli altri cicli.',
        viewBoxHeight: 430,
        components: [
          { title: 'Compressione|adiabatica', kind: 'generic', x: 150, y: 230, w: 164, h: 62 },
          { title: 'Isoterma alta', note: 'Sorgente calda', kind: 'heater', x: 390, y: 140, w: 196, h: 62 },
          { title: 'Espansione|adiabatica', kind: 'generic', x: 630, y: 230, w: 164, h: 62 },
          { title: 'Isoterma bassa', note: 'Sorgente fredda', kind: 'cooler', x: 390, y: 320, w: 196, h: 62 },
        ],
        pipes: [
          { d: linePath(p1, p2), color: COLORS.hot },
          { d: linePath(p2, p3), color: COLORS.work },
          { d: linePath(p3, p4), color: COLORS.cold },
          { d: linePath(p4, p1), color: COLORS.work },
        ],
        markers: [p1, p2, p3, p4],
      };
    }
    case 'reverse-carnot':
      return rectLoop({
        title: 'Schema Carnot inverso',
        subtitle: 'Evaporatore, compressore ideale, condensatore ed espansore ideale nello stesso stile tecnico.',
        left: { title: 'Compressore|ideale', kind: 'compressor' },
        top: { title: 'Condensatore', note: 'Q verso caldo', kind: 'heater' },
        right: { title: 'Espansore|ideale', kind: 'valve' },
        bottom: { title: 'Evaporatore', note: 'Q dal freddo', kind: 'cooler' },
        colors: { left: COLORS.work, top: COLORS.hot, right: COLORS.neutral, bottom: COLORS.cold },
      });
    case 'brayton':
      return rectLoop({
        title: 'Schema Brayton',
        subtitle: 'Compressore, camera di combustione, turbina e scarico con stati leggibili sul circuito.',
        left: { title: 'Compressore', kind: 'compressor' },
        top: { title: 'Combustore', kind: 'heater' },
        right: { title: 'Turbina', kind: 'turbine' },
        bottom: { title: 'Scarico', kind: 'generic' },
        colors: { left: COLORS.cold, top: COLORS.hot, right: COLORS.work, bottom: COLORS.exhaust },
      });
    case 'regenerative-brayton':
      return regenerativeBraytonLoop();
    case 'rankine':
      return rectLoop({
        title: 'Schema Rankine',
        subtitle: 'Pompa, caldaia, turbina e condensatore con numerazione coerente degli stati.',
        left: { title: 'Pompa', kind: 'pump' },
        top: { title: 'Caldaia', kind: 'heater' },
        right: { title: 'Turbina', kind: 'turbine' },
        bottom: { title: 'Condensatore', kind: 'cooler' },
        colors: { left: COLORS.cold, top: COLORS.hot, right: COLORS.work, bottom: COLORS.return },
      });
    case 'reheat-rankine':
      return reheatRankineLoop();
    case 'refrigeration':
      return rectLoop({
        title: 'Schema frigorifero',
        subtitle: 'Compressore, condensatore, valvola ed evaporatore come in uno schema impiantistico semplificato.',
        left: { title: 'Compressore', kind: 'compressor' },
        top: { title: 'Condensatore', kind: 'heater' },
        right: { title: 'Valvola', note: 'Laminazione', kind: 'valve' },
        bottom: { title: 'Evaporatore', kind: 'cooler' },
        colors: { left: COLORS.work, top: COLORS.hot, right: COLORS.neutral, bottom: COLORS.cold },
      });
    case 'combined':
      return combinedLoop();
    default:
      return rectLoop({
        title: 'Schema di principio',
        subtitle: 'Ciclo rappresentato con componenti, linea di flusso e punti di stato numerati.',
        left: { title: 'Ingresso', kind: 'generic' },
        top: { title: 'Trasformazione', kind: 'heater' },
        right: { title: 'Uscita', kind: 'generic' },
        bottom: { title: 'Ritorno', kind: 'cooler' },
        colors: { left: COLORS.cold, top: COLORS.hot, right: COLORS.work, bottom: COLORS.return },
      });
  }
};

const renderIcon = (kind, color) => {
  switch (kind) {
    case 'pump':
      return (
        <g transform="translate(-1 -1)">
          <circle cx="0" cy="0" r="11" fill="none" stroke={color} strokeWidth="2" />
          <path d="M -5 6 L 6 0 L -5 -6 Z" fill={color} />
        </g>
      );
    case 'compressor':
      return <path d="M -10 -9 L 7 -5 L 7 5 L -10 9 Z" fill="none" stroke={color} strokeWidth="2" />;
    case 'turbine':
      return <path d="M -7 -9 L 10 -5 L 10 5 L -7 9 Z" fill="none" stroke={color} strokeWidth="2" />;
    case 'valve':
      return <path d="M 0 -10 L 10 0 L 0 10 L -10 0 Z" fill="none" stroke={color} strokeWidth="2" />;
    case 'heater':
      return (
        <g>
          <rect x="-12" y="-8" width="24" height="16" rx="4" fill="none" stroke={color} strokeWidth="2" />
          <path d="M -8 0 C -6 -6 -2 -6 0 0 S 6 6 8 0" fill="none" stroke={color} strokeWidth="2" />
        </g>
      );
    case 'cooler':
      return (
        <g>
          <rect x="-12" y="-8" width="24" height="16" rx="4" fill="none" stroke={color} strokeWidth="2" />
          <path d="M -8 0 C -6 6 -2 6 0 0 S 6 -6 8 0" fill="none" stroke={color} strokeWidth="2" />
        </g>
      );
    case 'regenerator':
      return (
        <g>
          <rect x="-13" y="-12" width="26" height="24" rx="5" fill="none" stroke={color} strokeWidth="2" />
          <path d="M -9 -3 C -5 -8 -2 -8 1 -3 S 7 2 10 -3" fill="none" stroke={color} strokeWidth="1.8" />
          <path d="M -9 5 C -5 0 -2 0 1 5 S 7 10 10 5" fill="none" stroke={color} strokeWidth="1.8" />
        </g>
      );
    default:
      return (
        <g>
          <path d="M -10 -6 H 10" stroke={color} strokeWidth="2" />
          <path d="M -10 0 H 10" stroke={color} strokeWidth="2" />
          <path d="M -10 6 H 10" stroke={color} strokeWidth="2" />
        </g>
      );
  }
};

const renderComponent = (component, accentColor) => {
  const stroke = component.stroke ?? accentColor;
  const lines = splitLabel(component.title);
  const note = component.note;
  const x = component.x - component.w / 2;
  const y = component.y - component.h / 2;
  const textX = x + 48;
  const topTextY = note ? component.y - 8 : component.y - (lines.length > 1 ? 8 : 2);

  return (
    <g key={`${component.title}-${component.x}-${component.y}`}>
      <rect
        x={x}
        y={y}
        width={component.w}
        height={component.h}
        rx="18"
        fill={BOX_FILL}
        stroke={stroke}
        strokeOpacity="0.78"
      />
      <rect
        x={x + 10}
        y={component.y - 15}
        width="28"
        height="30"
        rx="10"
        fill="rgba(255,255,255,0.03)"
        stroke={BOX_BORDER}
      />
      <g transform={`translate(${x + 24} ${component.y})`}>
        {renderIcon(component.kind, stroke)}
      </g>
      {lines.map((line, index) => (
        <text
          key={`${component.title}-${line}-${index}`}
          x={textX}
          y={topTextY + index * 16}
          fill="#E2E8F0"
          fontSize="14"
          fontWeight="700"
        >
          {line}
        </text>
      ))}
      {note && (
        <text x={textX} y={component.y + 18} fill="#94A3B8" fontSize="12">
          {note}
        </text>
      )}
    </g>
  );
};

const BADGE_OFFSETS = {
  tl: { dx: -24, dy: -36 },
  tr: { dx: 24, dy: -36 },
  br: { dx: 24, dy: 36 },
  bl: { dx: -24, dy: 36 },
  top: { dx: 0, dy: -40 },
  bottom: { dx: 0, dy: 40 },
  left: { dx: -40, dy: 0 },
  right: { dx: 40, dy: 0 },
};

const renderMarker = (marker, index) => {
  const label = String(index + 1);
  const offset = BADGE_OFFSETS[marker.badge] ?? BADGE_OFFSETS.top;
  const badgeX = marker.x + offset.dx;
  const badgeY = marker.y + offset.dy;

  return (
    <g key={`marker-${label}`}>
      <circle cx={marker.x} cy={marker.y} r="6.5" fill={DOT_FILL} stroke="#0F172A" strokeWidth="2" />
      <line x1={marker.x} y1={marker.y} x2={badgeX} y2={badgeY} stroke={BADGE_STROKE} strokeWidth="2" />
      <rect
        x={badgeX - 12}
        y={badgeY - 12}
        width="24"
        height="24"
        rx="4"
        fill={BADGE_FILL}
        stroke={BADGE_STROKE}
        strokeWidth="1.5"
      />
      <text
        x={badgeX}
        y={badgeY + 5}
        textAnchor="middle"
        fill="#F8FAFC"
        fontSize="13"
        fontWeight="700"
      >
        {label}
      </text>
    </g>
  );
};

const SchematicDiagram = ({
  type = 'generic',
  accentColor = '#38BDF8',
  points = [],
  pointLabels = [],
  summaryItems = [],
}) => {
  const layout = getLayout(type);
  const visiblePoints = clampPoints(points);

  return (
    <div className="schematic-container">
      <div className="schematic-shell">
        <svg
          className="schematic-svg"
          viewBox={`0 0 780 ${layout.viewBoxHeight}`}
          role="img"
          aria-label={layout.title}
        >
          <defs>
            <marker id={`schematic-arrow-${type}`} markerWidth="10" markerHeight="10" refX="7" refY="5" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" />
            </marker>
          </defs>

          <rect
            x="12"
            y="12"
            width="756"
            height={layout.viewBoxHeight - 24}
            rx="28"
            fill="rgba(8,15,28,0.95)"
            stroke="rgba(255,255,255,0.08)"
          />
          <text x="42" y="54" fill="#E2E8F0" fontSize="24" fontWeight="700">
            {layout.title}
          </text>
          <text x="42" y="80" fill="#94A3B8" fontSize="14">
            {layout.subtitle}
          </text>

          {layout.pipes.map((pipe, index) => (
            <path
              key={`pipe-${index}`}
              d={pipe.d}
              fill="none"
              stroke={pipe.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              markerEnd={`url(#schematic-arrow-${type})`}
            />
          ))}

          {layout.components.map((component) => renderComponent(component, accentColor))}
          {layout.markers.map((marker, index) => renderMarker(marker, index))}
        </svg>

        {visiblePoints.length > 0 && (
          <div className="schematic-details-block">
            <div className="schematic-section-heading">Stati del ciclo</div>
            <div className="schematic-points-grid">
              {visiblePoints.map((point, index) => (
                <article
                  key={`point-${index}`}
                  className="schematic-point-card"
                  style={{ '--point-accent': accentColor }}
                >
                  <div className="schematic-point-head">
                    <span className="schematic-point-index">{index + 1}</span>
                    <div className="schematic-point-label">{pointLabels[index] ?? `Stato ${index + 1}`}</div>
                  </div>
                  <div className="schematic-point-values">
                    {formatPoint(point).map((value) => (
                      <span key={value}>{value}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>

      {summaryItems.length > 0 && (
        <div className="schematic-details-block">
          <div className="schematic-section-heading">Bilancio rapido</div>
          <div className="tag-row" style={{ minWidth: '100%' }}>
            {summaryItems.map((item) => (
              <span
                key={item.label}
                className="topic-tag"
                style={{
                  background: `color-mix(in srgb, ${item.color ?? accentColor} 16%, transparent)`,
                  color: item.color ?? accentColor,
                }}
              >
                {item.label}: {item.value}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SchematicDiagram;
