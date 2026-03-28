import { createEmptyFluidPowerSnapshot } from './fluidPowerState';

export const selectActiveDomain = (state) => state.ui?.activeDomain ?? 'hydraulic';

export const selectMode = (state) => state.projectMeta?.mode ?? 'didactic';

export const selectIsStudentMode = (state) => selectMode(state) !== 'engineering';

export const selectActiveWorkspace = (state) =>
  state.workspaces?.[selectActiveDomain(state)] ?? null;

export const selectSnapshot = (state) =>
  selectActiveWorkspace(state)?.snapshot ?? createEmptyFluidPowerSnapshot();

export const selectMeasurementMap = (state) => {
  const snapshot = selectSnapshot(state);
  const measurements = snapshot.measurements ?? {};

  if (Object.keys(measurements).length > 0) {
    return measurements;
  }

  return snapshot.readings ?? {};
};

const buildFallbackConnectionState = (connection, snapshot) => ({
  active: snapshot.activeConnections?.includes(connection.id) ?? false,
  phase: connection.kind === 'mechanical' ? 'mechanical' : 'pressure',
  flowDirection: null,
  flowRate: null,
  pressureIn: null,
  pressureOut: null,
  velocityFactor: 1,
});

export const selectConnectionVisualStates = (state) => {
  const workspace = selectActiveWorkspace(state);
  const snapshot = selectSnapshot(state);

  return (workspace?.connections ?? []).reduce((accumulator, connection) => {
    accumulator[connection.id] =
      snapshot.connectionStates?.[connection.id] ??
      buildFallbackConnectionState(connection, snapshot);
    return accumulator;
  }, {});
};
