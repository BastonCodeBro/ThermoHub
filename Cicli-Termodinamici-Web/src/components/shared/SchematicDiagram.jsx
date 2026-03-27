import React from 'react';

const clampPoints = (points) => (Array.isArray(points) ? points.filter(Boolean) : []);

const LAYOUTS = {
  otto: {
    title: 'Schema motore Otto',
    subtitle: 'Compressione, combustione isocora, espansione e raffreddamento.',
    blocks: ['Compressione', 'Calore isocoro', 'Espansione', 'Raffreddamento'],
  },
  diesel: {
    title: 'Schema motore Diesel',
    subtitle: 'Il tratto chiave e la combustione a pressione costante.',
    blocks: ['Compressione', 'Combustione isobara', 'Espansione', 'Raffreddamento'],
  },
  dual: {
    title: 'Schema ciclo Duale',
    subtitle: 'Combina una quota isocora e una quota isobara di apporto termico.',
    blocks: ['Compressione', 'Calore CV', 'Calore CP', 'Espansione', 'Raffreddamento'],
  },
  carnot: {
    title: 'Schema Carnot',
    subtitle: 'Motore ideale con due isoterme e due adiabatiche.',
    blocks: ['Isoterma alta', 'Adiabatica', 'Isoterma bassa', 'Adiabatica'],
  },
  'reverse-carnot': {
    title: 'Schema Carnot inverso',
    subtitle: 'Benchmark teorico per frigoriferi e pompe di calore.',
    blocks: ['Evaporazione', 'Compressione ideale', 'Condensazione', 'Espansione ideale'],
  },
  brayton: {
    title: 'Schema Brayton',
    subtitle: 'Compressore, combustore, turbina e scarico della turbina a gas.',
    blocks: ['Compressore', 'Camera calda', 'Turbina', 'Scarico'],
  },
  'regenerative-brayton': {
    title: 'Schema Brayton rigenerativo',
    subtitle: 'Il rigeneratore recupera calore dei gas di scarico verso l aria compressa.',
    blocks: ['Compressore', 'Rigeneratore freddo', 'Combustore', 'Turbina', 'Rigeneratore caldo', 'Camino'],
  },
  rankine: {
    title: 'Schema Rankine',
    subtitle: 'Sequenza base pompa, caldaia, turbina e condensatore.',
    blocks: ['Pompa', 'Caldaia', 'Turbina', 'Condensatore'],
  },
  'reheat-rankine': {
    title: 'Schema Rankine con risurriscaldamento',
    subtitle: 'Due stadi di espansione separati da un nuovo apporto di calore.',
    blocks: ['Pompa', 'Caldaia', 'Turbina HP', 'Risurriscaldatore', 'Turbina LP', 'Condensatore'],
  },
  refrigeration: {
    title: 'Schema frigorifero',
    subtitle: 'Compressore, condensatore, laminazione ed evaporatore.',
    blocks: ['Compressore', 'Condensatore', 'Valvola', 'Evaporatore'],
  },
  combined: {
    title: 'Schema ciclo combinato',
    subtitle: 'Il Brayton alimenta l HRSG che a sua volta sostiene il blocco Rankine.',
    blocks: ['Compressore gas', 'Combustore', 'Turbina gas', 'HRSG', 'Turbina vapore', 'Condensatore'],
  },
};

const createBlockGeometry = (count) => {
  if (count <= 4) {
    const width = 180;
    const gap = 28;
    const startX = 70;
    return Array.from({ length: count }, (_, index) => ({
      x: startX + index * (width + gap),
      y: 124,
      width,
      height: 72,
    }));
  }

  const width = 200;
  const gap = 36;
  const startX = 72;
  const columns = [0, 1, 2].map((index) => startX + index * (width + gap));
  return Array.from({ length: count }, (_, index) => {
    const isTopRow = index < 3;
    const rowIndex = isTopRow ? index : 2 - (index - 3);
    return {
      x: columns[rowIndex],
      y: isTopRow ? 116 : 250,
      width,
      height: 72,
    };
  });
};

const buildConnectorPath = (current, next) => {
  const startX = current.x + current.width;
  const startY = current.y + current.height / 2;
  const endX = next.x;
  const endY = next.y + next.height / 2;

  if (Math.abs(startY - endY) < 4 && endX >= startX) {
    const midX = (startX + endX) / 2;
    return `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
  }

  const bridgeX = endX >= startX ? startX + 42 : startX + 28;
  const approachX = endX - 24;
  return `M ${startX} ${startY} C ${bridgeX} ${startY}, ${bridgeX} ${endY}, ${approachX} ${endY} L ${endX} ${endY}`;
};

const formatPoint = (point) => [
  Number.isFinite(point?.p) ? `P ${point.p.toFixed(2)} bar` : null,
  Number.isFinite(point?.t) ? `T ${point.t.toFixed(1)} degC` : null,
  Number.isFinite(point?.h) ? `h ${point.h.toFixed(1)} kJ/kg` : null,
  Number.isFinite(point?.s) ? `s ${point.s.toFixed(3)} kJ/(kg K)` : null,
].filter(Boolean);

const SchematicDiagram = ({
  type = 'generic',
  accentColor = '#38BDF8',
  points = [],
  pointLabels = [],
  summaryItems = [],
}) => {
  const layout = LAYOUTS[type] ?? {
    title: 'Schema di principio',
    subtitle: 'Schema base del ciclo con sequenza delle trasformazioni principali.',
    blocks: ['Ingresso', 'Trasformazione', 'Uscita'],
  };
  const blocks = createBlockGeometry(layout.blocks.length);
  const visiblePoints = clampPoints(points);
  const viewBoxHeight = layout.blocks.length > 4 ? 420 : 290;

  return (
    <div className="schematic-container">
      <div className="schematic-shell">
        <svg
          className="schematic-svg"
          viewBox={`0 0 980 ${viewBoxHeight}`}
          role="img"
          aria-label={layout.title}
        >
          <defs>
            <marker id={`schematic-arrow-${type}`} markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={accentColor} />
            </marker>
          </defs>

          <rect
            x="12"
            y="12"
            width="956"
            height={viewBoxHeight - 24}
            rx="28"
            fill="rgba(8,15,28,0.92)"
            stroke="rgba(255,255,255,0.08)"
          />
          <text x="42" y="52" fill="#E2E8F0" fontSize="24" fontWeight="700">
            {layout.title}
          </text>
          <text x="42" y="78" fill="#94A3B8" fontSize="14">
            {layout.subtitle}
          </text>

          {blocks.map((block, index) => {
            const next = blocks[index + 1];
            const pointLabel = pointLabels[index] ?? `${index + 1}`;

            return (
              <g key={`${layout.blocks[index]}-${index}`}>
                <rect
                  x={block.x}
                  y={block.y}
                  width={block.width}
                  height={block.height}
                  rx="20"
                  fill="rgba(255,255,255,0.04)"
                  stroke={accentColor}
                  strokeOpacity="0.56"
                />
                <text x={block.x + 18} y={block.y + 30} fill="#E2E8F0" fontSize="15" fontWeight="700">
                  {layout.blocks[index]}
                </text>
                <text x={block.x + 18} y={block.y + 52} fill="#94A3B8" fontSize="12">
                  Stato {pointLabel}
                </text>

                {next && (
                  <path
                    d={buildConnectorPath(block, next)}
                    fill="none"
                    stroke={accentColor}
                    strokeWidth="4"
                    strokeOpacity="0.88"
                    markerEnd={`url(#schematic-arrow-${type})`}
                  />
                )}
              </g>
            );
          })}
        </svg>

        <div className="schematic-reading-guide">
          <strong>Come leggere lo schema</strong>
          <p>Segui le frecce nell ordine delle trasformazioni, poi usa le card sotto per confrontare subito P, T, h e s dei punti principali.</p>
        </div>

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
                  <div className="schematic-point-label">{pointLabels[index] ?? `${index + 1}`}</div>
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
