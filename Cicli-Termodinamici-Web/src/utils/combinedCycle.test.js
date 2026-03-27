import { describe, expect, test, vi } from 'vitest';

vi.mock('./rankineCycles', () => ({
  calcRankineCycle: vi.fn().mockResolvedValue({
    actualPoints: [
      { p: 0.08, t: 40, h: 100, s: 1, v: 0.001 },
      { p: 90, t: 45, h: 112, s: 1.1, v: 0.001 },
      { p: 90, t: 300, h: 2900, s: 6.5, v: 0.2 },
      { p: 0.08, t: 60, h: 2400, s: 7.1, v: 1.2 },
    ],
    actualPaths: [],
    dome: { ts: { s: [1, 2], t: [50, 300] } },
    stats: {
      wt: 500,
      wp: 12,
      q_in: 900,
      eta: 54.2,
    },
  }),
}));

import { calcCombinedCycle } from './combinedCycle';

describe('combined cycle solver', () => {
  test('combines gas and steam block powers with HRSG recovery', async () => {
    const result = await calcCombinedCycle({
      p_low_air: 1,
      beta: 8,
      t_air_in: 20,
      t_turb_in: 950,
      eta_c: 0.85,
      eta_t_gas: 0.88,
      mass_flow_gas: 3,
      eta_hrsg: 0.7,
      p_high_steam: 90,
      p_low_steam: 0.08,
      eta_t_steam: 0.86,
      eta_p_steam: 0.85,
    });

    expect(result.massFlowSteam).toBeGreaterThan(0);
    expect(result.stats.q_recovered).toBeGreaterThan(0);
    expect(result.stats.power_total).toBeCloseTo(result.stats.power_brayton + result.stats.power_rankine, 9);
    expect(result.stats.eta_total).toBeGreaterThan(result.stats.eta_brayton);
  });
});
