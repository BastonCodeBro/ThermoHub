import { solveFluid, getSaturationDomeFull } from './waterProps';
import { generateProcessPath } from './processPath';

const directSegment = (from, to) => [{ ...from }, { ...to }];

const buildStateSet = async ({
  pHigh,
  pLow,
  etaT,
  etaP,
  variant,
  tMax,
  pReheat,
  tReheat,
}) => {
  const st1 = await solveFluid({ p: pLow, q: 0 });
  const st2s = await solveFluid({ p: pHigh, s: st1.s });
  const h2 = st1.h + (st2s.h - st1.h) / etaP;
  const st2 = await solveFluid({ p: pHigh, h: h2 });

  let st3;
  if (variant === 'simple') {
    st3 = await solveFluid({ p: pHigh, q: 1 });
  } else {
    st3 = await solveFluid({ p: pHigh, t: tMax });
  }

  if (variant !== 'reheat') {
    const st4s = await solveFluid({ p: pLow, s: st3.s });
    const h4 = st3.h - (st3.h - st4s.h) * etaT;
    const st4 = await solveFluid({ p: pLow, h: h4 });

    return {
      actualPoints: [st1, st2, st3, st4],
      idealPoints: [st1, st2s, st3, st4s],
      stats: {
        wt: st3.h - st4.h,
        wp: st2.h - st1.h,
        q_in: st3.h - st2.h,
      },
    };
  }

  const st4s = await solveFluid({ p: pReheat, s: st3.s });
  const h4 = st3.h - (st3.h - st4s.h) * etaT;
  const st4 = await solveFluid({ p: pReheat, h: h4 });
  const st5 = await solveFluid({ p: pReheat, t: tReheat });
  const st6s = await solveFluid({ p: pLow, s: st5.s });
  const h6 = st5.h - (st5.h - st6s.h) * etaT;
  const st6 = await solveFluid({ p: pLow, h: h6 });

  return {
    actualPoints: [st1, st2, st3, st4, st5, st6],
    idealPoints: [st1, st2s, st3, st4s, st5, st6s],
    stats: {
      wt: (st3.h - st4.h) + (st5.h - st6.h),
      wp: st2.h - st1.h,
      q_in: (st3.h - st2.h) + (st5.h - st4.h),
      wt_hp: st3.h - st4.h,
      wt_lp: st5.h - st6.h,
      q_reheat: st5.h - st4.h,
    },
  };
};

export const calcRankineCycle = async ({
  p_high,
  p_low,
  t_max,
  p_reheat,
  t_reheat,
  eta_t,
  eta_p,
  mass_flow,
  variant = 'simple',
}) => {
  const stateSet = await buildStateSet({
    pHigh: p_high,
    pLow: p_low,
    etaT: eta_t,
    etaP: eta_p,
    variant,
    tMax: t_max,
    pReheat: p_reheat,
    tReheat: t_reheat,
  });

  const qOut = stateSet.stats.q_in - (stateSet.stats.wt - stateSet.stats.wp);
  const wNet = stateSet.stats.wt - stateSet.stats.wp;
  const dome = await getSaturationDomeFull('Water');

  const actualPaths = variant === 'reheat'
    ? [
        directSegment(stateSet.actualPoints[0], stateSet.actualPoints[1]),
        await generateProcessPath(stateSet.actualPoints[1], stateSet.actualPoints[2], 'Water', 80),
        directSegment(stateSet.actualPoints[2], stateSet.actualPoints[3]),
        await generateProcessPath(stateSet.actualPoints[3], stateSet.actualPoints[4], 'Water', 64),
        directSegment(stateSet.actualPoints[4], stateSet.actualPoints[5]),
        await generateProcessPath(stateSet.actualPoints[5], stateSet.actualPoints[0], 'Water', 80),
      ]
    : [
        directSegment(stateSet.actualPoints[0], stateSet.actualPoints[1]),
        await generateProcessPath(stateSet.actualPoints[1], stateSet.actualPoints[2], 'Water', 80),
        directSegment(stateSet.actualPoints[2], stateSet.actualPoints[3]),
        await generateProcessPath(stateSet.actualPoints[3], stateSet.actualPoints[0], 'Water', 80),
      ];

  const idealPaths = await Promise.all(
    stateSet.idealPoints.map((point, index) =>
      generateProcessPath(point, stateSet.idealPoints[(index + 1) % stateSet.idealPoints.length], 'Water', 72),
    ),
  );

  const lossPaths = variant === 'reheat'
    ? [
        await generateProcessPath(stateSet.actualPoints[1], stateSet.idealPoints[1], 'Water', 30),
        await generateProcessPath(stateSet.actualPoints[3], stateSet.idealPoints[3], 'Water', 30),
        await generateProcessPath(stateSet.actualPoints[5], stateSet.idealPoints[5], 'Water', 30),
      ]
    : [
        await generateProcessPath(stateSet.actualPoints[1], stateSet.idealPoints[1], 'Water', 30),
        await generateProcessPath(stateSet.actualPoints[3], stateSet.idealPoints[3], 'Water', 30),
      ];

  return {
    ...stateSet,
    actualPaths,
    idealPaths,
    lossPaths,
    dome,
    stats: {
      ...stateSet.stats,
      q_out: qOut,
      eta: stateSet.stats.q_in > 0 ? (wNet / stateSet.stats.q_in) * 100 : 0,
      power: wNet * mass_flow,
    },
  };
};
