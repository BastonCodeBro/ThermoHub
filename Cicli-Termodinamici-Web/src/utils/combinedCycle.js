import { AIR, calcBraytonCycle } from './idealGas';
import { calcRankineCycle } from './rankineCycles';

export const calcCombinedCycle = async ({
  p_low_air,
  beta,
  t_air_in,
  t_turb_in,
  eta_c,
  eta_t_gas,
  mass_flow_gas,
  eta_hrsg,
  p_high_steam,
  p_low_steam,
  eta_t_steam,
  eta_p_steam,
}) => {
  const brayton = calcBraytonCycle({
    p1Bar: p_low_air,
    t1C: t_air_in,
    p2Bar: p_low_air * beta,
    t3C: t_turb_in,
    etaComp: eta_c,
    etaTurb: eta_t_gas,
    massFlow: mass_flow_gas,
  });

  const rankine = await calcRankineCycle({
    p_high: p_high_steam,
    p_low: p_low_steam,
    eta_t: eta_t_steam,
    eta_p: eta_p_steam,
    mass_flow: 1,
    variant: 'simple',
  });

  const exhaustT = brayton.realPoints[3].t;
  const availableRecovery = Math.max(0, exhaustT - t_air_in);
  const recoveredHeatPerKgGas = AIR.cp * availableRecovery * Math.max(0, Math.min(1, eta_hrsg));
  const qSteamPerKg = rankine.stats.q_in;
  const massFlowSteam = qSteamPerKg > 0 ? (mass_flow_gas * recoveredHeatPerKgGas) / qSteamPerKg : 0;
  const braytonPower = brayton.stats.power;
  const rankinePower = (rankine.stats.wt - rankine.stats.wp) * massFlowSteam;
  const totalPower = braytonPower + rankinePower;
  const fuelHeatRate = brayton.stats.q_in * mass_flow_gas;

  return {
    brayton,
    rankine,
    massFlowSteam,
    stats: {
      eta_hrsg: eta_hrsg * 100,
      q_recovered: recoveredHeatPerKgGas * mass_flow_gas,
      power_brayton: braytonPower,
      power_rankine: rankinePower,
      power_total: totalPower,
      eta_total: fuelHeatRate > 0 ? (totalPower / fuelHeatRate) * 100 : 0,
      eta_brayton: brayton.stats.eta,
      eta_rankine: rankine.stats.eta,
    },
  };
};
