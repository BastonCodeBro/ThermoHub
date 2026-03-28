import {
  createFluidPowerReducerState,
  fluidPowerReducer,
} from './fluidPowerReducer';
import {
  selectActiveDomain,
  selectActiveWorkspace,
  selectConnectionVisualStates,
} from './fluidPowerSelectors';

describe('fluidPowerReducer', () => {
  test('switches the active domain through the reducer', () => {
    let state = createFluidPowerReducerState();

    expect(selectActiveDomain(state)).toBe('hydraulic');

    state = fluidPowerReducer(state, { type: 'SET_ACTIVE_DOMAIN', domain: 'pneumatic' });

    expect(selectActiveDomain(state)).toBe('pneumatic');
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
