import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import FluidPowerLabPage from './FluidPowerLabPage';
import { FLUID_POWER_PROJECT_STORAGE_KEY } from '../utils/fluidPowerProject';

const addComponent = (label) => {
  fireEvent.click(screen.getByRole('button', { name: label }));
};

describe('FluidPowerLabPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test('renders the domain tabs and updates the palette by domain', () => {
    render(<FluidPowerLabPage />);

    expect(screen.getByRole('button', { name: /^Aggiungi Pompa idraulica$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Studente$/i })).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('button', { name: /Pneumatica/i }));

    expect(screen.getByRole('button', { name: /^Aggiungi Compressore$/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Aggiungi Pompa idraulica$/i })).not.toBeInTheDocument();
  });

  test('blocks incompatible port connections', () => {
    render(<FluidPowerLabPage />);

    addComponent(/^Aggiungi Motore primo$/i);
    addComponent(/^Aggiungi Pompa idraulica$/i);

    fireEvent.click(screen.getByRole('button', { name: /Porta Albero di Motore primo 1/i }));
    fireEvent.click(screen.getByRole('button', { name: /Porta P di Pompa idraulica 1/i }));

    expect(screen.getByText(/Porte incompatibili/i)).toBeInTheDocument();
  });

  test('starts a valid minimal hydraulic simulation', () => {
    render(<FluidPowerLabPage />);

    addComponent(/^Aggiungi Pompa idraulica$/i);
    addComponent(/^Aggiungi Valvola 3\/2 monostabile$/i);
    addComponent(/^Aggiungi Cilindro a singolo effetto$/i);
    addComponent(/^Aggiungi Serbatoio$/i);

    fireEvent.click(screen.getByRole('button', { name: /Porta P di Pompa idraulica 1/i }));
    fireEvent.click(screen.getByRole('button', { name: /Porta P di Valvola 3\/2 monostabile 1/i }));

    fireEvent.click(screen.getByRole('button', { name: /Porta A di Valvola 3\/2 monostabile 1/i }));
    fireEvent.click(screen.getByRole('button', { name: /Porta A di Cilindro a singolo effetto 1/i }));

    fireEvent.click(screen.getByRole('button', { name: /Porta R di Valvola 3\/2 monostabile 1/i }));
    fireEvent.click(screen.getByRole('button', { name: /Porta T di Serbatoio 1/i }));

    fireEvent.click(screen.getByRole('button', { name: /Commuta Valvola 3\/2 monostabile 1/i }));
    fireEvent.click(screen.getByRole('button', { name: /Avvia schema/i }));

    expect(screen.getAllByText(/Schema avviato/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/estensione/i).length).toBeGreaterThan(0);
  });

  test('switches to engineer mode and persists mode in autosave', async () => {
    render(<FluidPowerLabPage />);

    fireEvent.click(screen.getByRole('button', { name: /^Ingegnere$/i }));

    expect(screen.getByRole('button', { name: /^Ingegnere$/i })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/Inspector tecnico/i)).toBeInTheDocument();
    expect(screen.queryByText(/Checklist didattica/i)).not.toBeInTheDocument();

    await waitFor(() => {
      const saved = JSON.parse(window.localStorage.getItem(FLUID_POWER_PROJECT_STORAGE_KEY));
      expect(saved.mode).toBe('engineering');
    });
  });

  test('hydrates engineer mode from local storage', () => {
    window.localStorage.setItem(
      FLUID_POWER_PROJECT_STORAGE_KEY,
      JSON.stringify({
        type: 'thermohub-fluid-power-project',
        id: 'project-test',
        name: 'Fluid Power Project',
        mode: 'engineering',
        units: 'metric',
        version: 1,
        author: 'ThermoHub',
        tags: ['fluid-power'],
        createdAt: '2026-03-27T10:00:00.000Z',
        updatedAt: '2026-03-27T10:00:00.000Z',
        workspaces: {
          hydraulic: {},
          pneumatic: {},
        },
      }),
    );

    render(<FluidPowerLabPage />);

    expect(screen.getByRole('button', { name: /^Ingegnere$/i })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/Pannello tecnico/i)).toBeInTheDocument();
  });
});
