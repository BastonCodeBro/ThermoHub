import { describe, expect, test } from 'vitest';
import {
  AIR,
  calcBraytonCycle,
  calcCarnotCycle,
  calcDieselCycle,
  calcDualCycle,
  calcOttoCycle,
  calcRegenerativeBraytonCycle,
  calcReverseCarnotCycle,
  createIdealGasPoint,
  generateIdealGasPath,
} from './idealGas';
import { generateProcessPath } from './processPath';

const expectClose = (received, expected, tolerance = 1e-6) => {
  expect(Math.abs(received - expected)).toBeLessThanOrEqual(tolerance);
};

describe('idealGas cycle calculators', () => {
  test('Otto cycle matches ideal efficiency formula', () => {
    const inputs = {
      p1Bar: 1,
      t1C: 25,
      r: 9,
      t3C: 1200,
      eta: 1,
      massFlow: 1,
    };

    const result = calcOttoCycle(inputs);
    const expectedEta = (1 - 1 / inputs.r ** (AIR.k - 1)) * 100;

    expect(result.points).toHaveLength(4);
    expect(result.stats.q_in).toBeGreaterThan(0);
    expect(result.stats.q_out).toBeGreaterThan(0);
    expectClose(result.stats.eta, expectedEta, 1e-9);
    expectClose(result.stats.eta_ideal, expectedEta, 1e-9);
  });

  test('Diesel cycle reports the same ideal efficiency formula used in the model', () => {
    const inputs = {
      p1Bar: 1,
      t1C: 25,
      r: 18,
      rc: 2,
      eta: 1,
      massFlow: 1,
    };

    const result = calcDieselCycle(inputs);
    const expectedEta = (1 - (1 / inputs.r ** (AIR.k - 1)) * ((inputs.rc ** AIR.k - 1) / (AIR.k * (inputs.rc - 1)))) * 100;

    expect(result.points).toHaveLength(4);
    expect(result.stats.q_in).toBeGreaterThan(0);
    expect(result.stats.q_out).toBeGreaterThan(0);
    expectClose(result.stats.eta, expectedEta, 1e-9);
    expectClose(result.stats.eta_ideal, expectedEta, 1e-9);
  });

  test('Brayton cycle keeps ideal compressor and turbine stages isentropic', () => {
    const result = calcBraytonCycle({
      p1Bar: 1,
      t1C: 20,
      p2Bar: 10,
      t3C: 1000,
      etaComp: 0.85,
      etaTurb: 0.88,
      massFlow: 1,
    });

    expect(result.realPoints).toHaveLength(4);
    expect(result.idealPoints).toHaveLength(4);
    expect(result.stats.q_in).toBeGreaterThan(0);
    expect(result.stats.wt).toBeGreaterThan(result.stats.wc);
    expectClose(result.idealPoints[0].s, result.idealPoints[1].s, 1e-9);
    expectClose(result.idealPoints[2].s, result.idealPoints[3].s, 1e-9);
  });

  test('Carnot cycle matches TH/TL efficiency', () => {
    const tHighC = 500;
    const tLowC = 50;
    const result = calcCarnotCycle({
      tHighC,
      tLowC,
      pRefBar: 1,
      ds: 0.5,
      massFlow: 1,
    });

    const expectedEta = (1 - (tLowC + 273.15) / (tHighC + 273.15)) * 100;

    expect(result.points).toHaveLength(4);
    expect(result.stats.Q_in).toBeGreaterThan(result.stats.Q_out);
    expectClose(result.stats.eta, expectedEta, 1e-9);
  });

  test('Dual cycle splits heat addition into isochoric and isobaric parts', () => {
    const result = calcDualCycle({
      p1Bar: 1,
      t1C: 25,
      r: 16,
      alpha: 1.4,
      rc: 1.3,
      eta: 1,
      massFlow: 1,
    });

    expect(result.points).toHaveLength(5);
    expect(result.stats.q_in_cv).toBeGreaterThan(0);
    expect(result.stats.q_in_cp).toBeGreaterThan(0);
    expectClose(result.stats.q_in, result.stats.q_in_cv + result.stats.q_in_cp, 1e-9);
  });

  test('Regenerative Brayton does not worsen efficiency when epsilon increases', () => {
    const simple = calcBraytonCycle({
      p1Bar: 1,
      t1C: 20,
      p2Bar: 8,
      t3C: 950,
      etaComp: 0.85,
      etaTurb: 0.88,
      massFlow: 1,
    });

    const regenerative = calcRegenerativeBraytonCycle({
      p1Bar: 1,
      t1C: 20,
      p2Bar: 8,
      t3C: 950,
      etaComp: 0.85,
      etaTurb: 0.88,
      epsilonReg: 0.75,
      massFlow: 1,
    });

    expect(regenerative.realPoints).toHaveLength(6);
    expect(regenerative.stats.regen_gain).toBeGreaterThanOrEqual(0);
    expect(regenerative.stats.eta).toBeGreaterThanOrEqual(simple.stats.eta - 1e-9);
  });

  test('Reverse Carnot reports theoretical COP values', () => {
    const tHighC = 35;
    const tLowC = -5;
    const result = calcReverseCarnotCycle({
      tHighC,
      tLowC,
      pRefBar: 2,
      ds: 0.5,
      massFlow: 1,
    });

    const th = tHighC + 273.15;
    const tl = tLowC + 273.15;
    expect(result.points).toHaveLength(4);
    expectClose(result.stats.cop, tl / (th - tl), 1e-9);
    expectClose(result.stats.cop_hp, th / (th - tl), 1e-9);
  });
});

describe('idealGas path generation', () => {
  test('isochoric path keeps volume constant', () => {
    const start = createIdealGasPoint('1', 25, 1);
    const endPressure = (AIR.R * (300 + 273.15)) / (start.v * 100);
    const end = { ...createIdealGasPoint('2', 300, endPressure), v: start.v };
    const path = generateIdealGasPath(start, end, 'isochoric', { n: 12 });

    expect(path).toHaveLength(12);
    expect(path[0].v).toBe(start.v);
    expect(path.at(-1).v).toBe(end.v);
    path.forEach((point) => expectClose(point.v, start.v, 1e-12));
  });

  test('isothermal path keeps temperature and p*v invariant', () => {
    const start = createIdealGasPoint('1', 200, 8);
    const end = createIdealGasPoint('2', 200, 2);
    const path = generateIdealGasPath(start, end, 'isothermal', { n: 10 });
    const pvConstant = start.p * start.v;

    path.forEach((point) => {
      expectClose(point.t, 200, 1e-9);
      expectClose(point.p * point.v, pvConstant, 1e-9);
    });
  });

  test('generateProcessPath delegates Air paths to the ideal-gas generator', async () => {
    const start = createIdealGasPoint('1', 25, 1);
    const end = createIdealGasPoint('2', 25, 5);

    const path = await generateProcessPath(start, end, 'Air', 16, {
      processType: 'isothermal',
      model: 'ideal-gas',
    });

    expect(path).toHaveLength(16);
    expect(path[0]).toEqual(start);
    expect(path.at(-1)).toEqual(end);
    path.forEach((point) => expectClose(point.t, start.t, 1e-9));
  });
});
