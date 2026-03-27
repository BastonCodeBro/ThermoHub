# ThermoHub Web

Applicazione web React/Vite di **ThermoHub** per spiegare cicli termodinamici, simulare impianti fluidici e distribuire esami di stato svolti.

Stato aggiornato al **2026-03-26**.

## Obiettivo

- offrire un ambiente unico per lezione, esercitazione e ripasso
- mantenere tutto client-side nel deploy Cloudflare Pages
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

## Deploy Cloudflare Pages

Deploy consigliato: **Cloudflare Pages** con sito statico, senza backend.

Impostazioni da usare:

- `Framework preset`: `Vite`
- `Build command`: `npm run build`
- `Build output directory`: `dist`
- `Root directory`: `Cicli-Termodinamici-Web`

Note operative:

- il file [`public/_redirects`](/C:/Users/andre/Desktop/ThermoHub/Cicli-Termodinamici-Web/public/_redirects) abilita il fallback SPA per React Router
- il file [`public/_headers`](/C:/Users/andre/Desktop/ThermoHub/Cicli-Termodinamici-Web/public/_headers) aggiunge header base per la versione statica e cache lunga sugli asset compilati
- se colleghi il repository dalla root `ThermoHub`, su Cloudflare devi indicare come root la cartella `Cicli-Termodinamici-Web`
- dopo il deploy, prova queste route direttamente dal browser:
  - `/`
  - `/impianti-fluidici`
  - `/laboratorio-vapore`
  - `/esami-di-stato`

## Documenti correlati

- [../docs/USO_WEB.md](../docs/USO_WEB.md)
- [../docs/ARCHITETTURA.md](../docs/ARCHITETTURA.md)
- [../docs/MANUTENZIONE_E_MIGLIORAMENTI.md](../docs/MANUTENZIONE_E_MIGLIORAMENTI.md)
