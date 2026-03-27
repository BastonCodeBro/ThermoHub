import React from 'react';
import { Activity, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const CycleCard = ({
  title,
  id,
  route,
  description,
  Icon = Activity,
  color = '#38BDF8',
  availability = 'live',
}) => {
  const targetRoute = route ?? `/${id}`;
  const live = availability === 'live';
  const Wrapper = live ? Link : 'article';
  const wrapperProps = live ? { to: targetRoute } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`cycle-card glass no-underline ${live ? '' : 'cycle-card-planned'}`.trim()}
    >
      <div className="cycle-card-top">
        <div className="card-icon-wrapper" style={{ background: `${color}15`, color }}>
          <Icon className="card-icon" />
        </div>
        {!live && (
          <span className="availability-badge">
            <Clock3 size={14} />
            In arrivo
          </span>
        )}
      </div>
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
      <div className="card-footer" style={{ color }}>
        {live ? <>Apri simulatore <span>-&gt;</span></> : <>Contenuto pianificato</>}
      </div>
    </Wrapper>
  );
};

export default CycleCard;
