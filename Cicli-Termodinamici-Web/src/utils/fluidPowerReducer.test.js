import {
  createFluidPowerReducerState,
  fluidPowerReducer,
} from './fluidPowerReducer';
import {
  selectActiveDomain,
  selectActiveWorkspace,
  selectConnectionVisualStates,
  selectIsStudentMode,
} from './fluidPowerSelectors';

describe('fluidPowerReducer', () => {
  test('switches active domain and project mode through the reducer', () => {
    let state = createFluidPowerReducerState();

    expect(selectActiveDomain(state)).toBe('hydraulic');
    expect(selectIsStudentMode(state)).toBe(true);

    state = fluidPowerReducer(state, { type: 'SET_ACTIVE_DOMAIN', domain: 'pneumatic' });
    state = fluidPowerReducer(state, { type: 'SET_PROJECT_MODE', mode: 'engineering' });

    expect(selectActiveDomain(state)).toBe('pneumatic');
    expect(selectIsStudentMode(state)).toBe(false);
  });

  test('updates only the active workspace', () => {
    let state = createFluidPowerReducerState();

    state = fluidPowerReducer(state, {
      type: 'UPDATE_ACTIVE_WORKSPACE',
      updater: (workspace) => ({
        ...workspace,
        message: 'Workspace idraulico aggiornato.',
      }),
    });

    expect(selectActiveWorkspace(state).message).toMatch(/idraulico/i);
    expect(state.workspaces.pneumatic.message).not.toMatch(/idraulico/i);
  });

  test('builds fallback connection visuals when the solver has not emitted connection states yet', () => {
    let state = createFluidPowerReducerState();

    state = fluidPowerReducer(state, {
      type: 'UPDATE_ACTIVE_WORKSPACE',
      updater: (workspace) => ({
        ...workspace,
        connections: [
          {
            id: 'connection-1',
            kind: 'mechanical',
            domain: 'hydraulic',
            from: { nodeId: 'driver-1', portId: 'shaft' },
            to: { nodeId: 'pump-1', portId: 'drive' },
          },
        ],
      }),
    });

    const connectionStates = selectConnectionVisualStates(state);

    expect(connectionStates['connection-1']).toMatchObject({
      active: false,
      phase: 'mechanical',
    });
  });
});
