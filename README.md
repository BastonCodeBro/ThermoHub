# Cicli Termodinamici

Repository web-first per il sito React/Vite deployato su Vercel.

This repository is organized primarily for the React/Vite web application deployed on Vercel.

Stato verificato localmente il **2026-03-25**.

## Layout Attuale

- `Cicli-Termodinamici-Web/`
  applicazione web attiva
- `docs/`
  documentazione tecnica
- `legacy/python-desktop/`
  codice desktop storico isolato dal runtime del sito
- `vercel.json`
  configurazione di deploy del repository

## Prodotto Principale

Il deliverable principale e il sito in `Cicli-Termodinamici-Web/`.

Funzionalita principali:

- pagine ciclo per Rankine, Brayton, Otto, Diesel, Frigorifero e Carnot
- `Laboratorio Vapore` per la costruzione manuale di stati acqua-vapore nel browser
- diagrammi interattivi con Plotly
- proprieta termodinamiche con `coolprop-wasm`
- export PDF on-demand

## Avvio Locale

```powershell
cd Cicli-Termodinamici-Web
npm install
npm run dev
```

## Verifiche Correnti

Controlli rieseguiti il **2026-03-25**:

- `npm run lint` -> passed
- `npm run test` -> passed
- `npm run build` -> passed

## Deploy

Il deploy Vercel usa `vercel.json` alla radice e costruisce:

- `Cicli-Termodinamici-Web/dist`

Non e presente Streamlit nel repository e il deploy del sito non richiede runtime Python.

## Legacy Python

Il codice desktop storico e stato spostato in:

- `legacy/python-desktop/`

Include:

- GUI `customtkinter`
- core Python storico
- launcher `.bat`
- dipendenze in `legacy/python-desktop/requirements-desktop.txt`

Il legacy resta disponibile come riferimento, ma non fa parte del runtime del sito.

## Documentazione

- [README web](Cicli-Termodinamici-Web/README.md)
- [Uso web](docs/USO_WEB.md)
- [Architettura](docs/ARCHITETTURA.md)
- [Manutenzione e miglioramenti](docs/MANUTENZIONE_E_MIGLIORAMENTI.md)
- [Uso desktop legacy](docs/USO_DESKTOP.md)
