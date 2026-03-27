import { describe, expect, test, vi } from 'vitest';

vi.mock('./waterProps', () => ({
  solveFluid: vi.fn(async (inputs) => {
    if (inputs.p !== undefined && inputs.q === 0) {
      return { p: inputs.p, t: 45 + inputs.p, h: 100 + 0.5 * inputs.p, s: 1 + 0.01 * inputs.p, v: 0.001 };
    }
    if (inputs.p !== undefined && inputs.q === 1) {
      return { p: inputs.p, t: 100 + 0.5 * inputs.p, h: 2700 + 0.5 * inputs.p, s: 7 + 0.001 * inputs.p, v: 1.2 };
    }
    if (inputs.p !== undefined && inputs.t !== undefined) {
      return {
        p: inputs.p,
        t: inputs.t,
        h: 2800 + 1.4 * inputs.t - 0.5 * inputs.p,
        s: 6 + 0.002 * inputs.t - 0.01 * inputs.p,
        v: 0.15 + inputs.t / 10000,
      };
    }
    if (inputs.p !== undefined && inputs.s !== undefined) {
      return {
        p: inputs.p,
        t: 20 + 25 * inputs.s + 0.1 * inputs.p,
        h: 200 + 350 * inputs.s - 1.5 * inputs.p,
        s: inputs.s,
        v: 0.05 + inputs.s / 50,
      };
    }
    if (inputs.p !== undefined && inputs.h !== undefined) {
      return {
        p: inputs.p,
        t: 20 + inputs.h / 8 - 0.1 * inputs.p,
        h: inputs.h,
        s: 1 + inputs.h / 900 - 0.002 * inputs.p,
        v: 0.02 + inputs.h / 20000,
      };
    }
    throw new Error(`Unsupported mock state ${JSON.stringify(inputs)}`);
  }),
  getSaturationDomeFull: vi.fn().mockResolvedValue({
    ts: { s: [1, 2], t: [50, 300] },
    hs: { s: [1, 2], h: [100, 2800] },
    pv: { v: [0.001, 1], p: [0.1, 100] },
  }),
}));

vi.mock('./processPath', () => ({
  generateProcessPath: vi.fn(async (from, to) => [{ ...from }, { ...to }]),
}));

import { calcRankineCycle } from './rankineCycles';

describe('rankine cycle variants', () => {
  test('simple rankine returns 4 states', async () => {
    const result = await calcRankineCycle({
      p_high: 80,
      p_low: 0.1,
      eta_t: 0.85,
      eta_p: 0.85,
      mass_flow: 1,
      variant: 'simple',
    });

    expect(result.actualPoints).toHaveLength(4);
    expect(result.idealPoints).toHaveLength(4);
    expect(result.stats.q_in).toBeGreaterThan(0);
    expect(result.stats.wp).toBeGreaterThan(0);
    expect(Number.isFinite(result.stats.eta)).toBe(true);
  });

  test('reheat rankine exposes intermediate states and reheat load', async () => {
    const simple = await calcRankineCycle({
      p_high: 100,
      p_low: 0.1,
      t_max: 500,
      eta_t: 0.85,
      eta_p: 0.85,
      mass_flow: 1,
      variant: 'hirn',
    });

    const reheat = await calcRankineCycle({
      p_high: 100,
      p_low: 0.1,
      t_max: 500,
      p_reheat: 20,
      t_reheat: 480,
      eta_t: 0.85,
      eta_p: 0.85,
      mass_flow: 1,
      variant: 'reheat',
    });

    expect(reheat.actualPoints).toHaveLength(6);
    expect(reheat.idealPoints).toHaveLength(6);
    expect(reheat.stats.q_reheat).toBeGreaterThan(0);
    expect(reheat.stats.wt).toBeGreaterThan(simple.stats.wt);
  });
});
