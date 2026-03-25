import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

vi.mock('./utils/waterProps', () => ({
  ensureCoolProp: vi.fn().mockResolvedValue({}),
  solveFluid: vi.fn().mockResolvedValue({
    t: 100,
    p: 1,
    h: 2676,
    s: 7.35,
    v: 1.694,
  }),
  getSaturationDomeFull: vi.fn().mockResolvedValue({
    ts: { s: [1, 2], t: [100, 200] },
    hs: { s: [1, 2], h: [500, 2600] },
  }),
}));

describe('App routes', () => {
  test('renders landing page content', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/L'intera Termodinamica/i)).toBeInTheDocument();
    });
  });

  test('renders 404 fallback for unknown route', async () => {
    render(
      <MemoryRouter initialEntries={['/not-found']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Pagina non trovata/i)).toBeInTheDocument();
    });
  });

  test('renders steam lab route', async () => {
    render(
      <MemoryRouter initialEntries={['/laboratorio-vapore']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Laboratorio Vapore/i })).toBeInTheDocument();
      expect(screen.getByText(/Strumento derivato dal desktop/i)).toBeInTheDocument();
    });
  });
});
