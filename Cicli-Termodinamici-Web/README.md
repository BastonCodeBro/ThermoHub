# Cicli Termodinamici Web

Applicazione web React/Vite per lo studio interattivo dei cicli termodinamici.

React/Vite web application for interactive thermodynamic-cycle analysis.

Stato verificato il **2026-03-25**.

## Obiettivo

- questa cartella contiene il prodotto deployato su Vercel
- non usa Streamlit
- non richiede runtime Python lato deploy
- incorpora anche un flusso avanzato ispirato al vecchio strumento desktop tramite `Laboratorio Vapore`

## Route Disponibili

- `/`
- `/rankine`
- `/brayton`
- `/otto`
- `/diesel`
- `/frigo`
- `/carnot`
- `/laboratorio-vapore`

## Funzionalita Principali

- diagrammi interattivi Plotly
- export PDF per le pagine ciclo
- proprieta reali via `coolprop-wasm` per acqua e refrigeranti
- percorsi gas-ideali coerenti per Brayton, Otto, Diesel e Carnot
- confronto ideale/reale nella pagina Brayton
- laboratorio vapore con costruzione manuale dei punti da coppie di proprieta

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

## Avvio Locale

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

## API JS Utilizzate

Utility da considerare parte dell'interfaccia attuale del frontend:

- `solveFluid`
- `getSaturationDome`
- `getSaturationDomeFull`
- `generateProcessPath`
- `exportToPDF`

Per i cicli a gas:

- `calcOttoCycle`
- `calcDieselCycle`
- `calcBraytonCycle`
- `calcCarnotCycle`
- `generateIdealGasPath`

## Asset E Runtime

- il file WASM richiesto e `public/coolprop.wasm`
- l'inizializzazione di CoolProp e lazy
- il deploy Vercel del repository usa la build prodotta da questa cartella

## Stato Dei Check

Verificato il **2026-03-25**:

- `npm run lint` -> passed
- `npm run test` -> passed
- `npm run build` -> passed

## Limitazioni Note

- la copertura test e ancora leggera e concentrata sul routing
- parte del dominio termodinamico e ancora separata fra codice web attivo e codice Python legacy
- restano file storici desktop nel repository root, ma non servono al deploy del sito

## Documenti Correlati

- [../docs/USO_WEB.md](../docs/USO_WEB.md)
- [../docs/ARCHITETTURA.md](../docs/ARCHITETTURA.md)
- [../docs/MANUTENZIONE_E_MIGLIORAMENTI.md](../docs/MANUTENZIONE_E_MIGLIORAMENTI.md)
