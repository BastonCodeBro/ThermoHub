import { createFluidPowerFeatureState } from './fluidPowerState';

const replaceActiveWorkspace = (state, updater) => ({
  ...state,
  workspaces: {
    ...state.workspaces,
    [state.ui.activeDomain]: updater(state.workspaces[state.ui.activeDomain]),
  },
});

export const fluidPowerReducer = (state, action) => {
  switch (action.type) {
    case 'HYDRATE_PROJECT':
      return {
        ...state,
        projectMeta: action.projectMeta,
        workspaces: action.workspaces,
      };
    case 'SET_ACTIVE_DOMAIN':
      return {
        ...state,
        ui: {
          ...state.ui,
          activeDomain: action.domain,
        },
      };
    case 'UPDATE_ACTIVE_WORKSPACE':
      return replaceActiveWorkspace(state, action.updater);
    default:
      return state;
  }
};

export const createFluidPowerReducerState = () => createFluidPowerFeatureState();
