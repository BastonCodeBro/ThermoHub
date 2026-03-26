# ThermoHub Web

Applicazione web React/Vite di **ThermoHub** per spiegare cicli termodinamici, simulare impianti fluidici e distribuire esami di stato svolti.

Stato aggiornato al **2026-03-26**.

## Obiettivo

- offrire un ambiente unico per lezione, esercitazione e ripasso
- mantenere tutto client-side nel deploy Vercel
- includere PDF scaricabili brandizzati ThermoHub

## Route disponibili

- `/`
- `/cicli-termodinamici`
- `/rankine`
- `/brayton`
- `/otto`
- `/diesel`
- `/frigo`
- `/carnot`
- `/laboratorio-vapore`
- `/impianti-fluidici`
- `/esami-di-stato`

## Funzionalita principali

- diagrammi interattivi Plotly
- export PDF con branding ThermoHub
- proprieta reali via `coolprop-wasm`
- simulazione di cicli ideali e reali
- laboratorio vapore avanzato
- archivio esami con traccia, schema e soluzione completa

## Stack

- React 19
- Vite 8
- React Router 7
- `coolprop-wasm`
- `plotly.js`
- `jspdf`
- `html2canvas`
- Vitest
- ESLint

## Avvio locale

```powershell
npm install
npm run dev
```

## Script

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run test`
- `npm run lint`

## Asset e runtime

- il file WASM richiesto e `public/coolprop.wasm`
- le tracce originali degli esami sono in `public/esami/originali/`
- il deploy del repository usa la build prodotta da questa cartella

## Documenti correlati

- [../docs/USO_WEB.md](../docs/USO_WEB.md)
- [../docs/ARCHITETTURA.md](../docs/ARCHITETTURA.md)
- [../docs/MANUTENZIONE_E_MIGLIORAMENTI.md](../docs/MANUTENZIONE_E_MIGLIORAMENTI.md)
