import React, { useId } from 'react';

const ThermoHubMark = ({ className = '', title = 'ThermoHub', compact = false }) => {
  const gradientId = useId();
  const glowId = useId();
  const borderGradientId = useId();

  return (
    <svg
      viewBox="0 0 72 72"
      role="img"
      aria-label={title}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId} x1="12" y1="14" x2="58" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <linearGradient id={borderGradientId} x1="10" y1="10" x2="62" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FCD34D" stopOpacity="0.9" />
        </linearGradient>
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x="8" y="8" width="56" height="56" rx="18" fill="#07111F" />
      <rect x="8" y="8" width="56" height="56" rx="18" fill="url(#borderGradientId)" fillOpacity="0.12" />
      <rect x="8.75" y="8.75" width="54.5" height="54.5" rx="17.25" stroke="url(#borderGradientId)" strokeWidth="1.5" />

      <circle cx="55" cy="17" r="4" fill="#F59E0B" filter={`url(#${glowId})`} />
      <path d="M22 24H50" stroke="url(#gradientId)" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M36 24V49" stroke="url(#gradientId)" strokeWidth="5.5" strokeLinecap="round" />

      {!compact && (
        <>
          <path d="M24 24V49" stroke="#C4E7FA" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M48 24V49" stroke="#FDE68A" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M24 37H48" stroke="#E2E8F0" strokeWidth="4.5" strokeLinecap="round" />
        </>
      )}

      {compact && (
        <>
          <path d="M25.5 27V47" stroke="#D7F1FD" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M46.5 27V47" stroke="#FDE68A" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M25.5 37H46.5" stroke="#E2E8F0" strokeWidth="4.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
};

export default ThermoHubMark;
