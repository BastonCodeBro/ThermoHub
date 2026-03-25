# Uso Web / Web Usage

Guida operativa per l'applicazione web React/Vite deployata su Vercel, verificata il **2026-03-25**.

## Requisiti

- Node.js 20+ consigliato
- npm

## Installazione

```powershell
cd Cicli-Termodinamici-Web
npm install
```

## Comandi

```powershell
npm run dev
npm run lint
npm run test
npm run build
```

## Stato Dei Check

- `npm run lint` -> passed
- `npm run test` -> passed
- `npm run build` -> passed

## Routing

- `/`
- `/rankine`
- `/brayton`
- `/otto`
- `/diesel`
- `/frigo`
- `/carnot`
- `/laboratorio-vapore`

## Pagine E Logica

### Rankine

- acqua/vapore con `solveFluid()`
- diagrammi `T-s`, `h-s`, `P-v`
- cupola di saturazione
- schema impianto
- export PDF on-demand

### Brayton

- calcolo esplicito a gas ideale
- confronto tra ciclo ideale e reale
- diagrammi `T-s`, `P-v`, `h-s`

### Otto

- calcolo esplicito a gas ideale
- trasformazioni coerenti con compressione/espansione politropica e scambi isocori

### Diesel

- calcolo esplicito a gas ideale
- tratto di apporto calore isobarico

### Frigorifero

- refrigeranti: `R134a`, `R410A`, `R32`, `R22`, `R290`, `R600a`
- diagrammi `T-s` e `P-h`

### Carnot

- ciclo gas ideale con tratti isotermi e isentropici

### Laboratorio Vapore

- costruzione manuale degli stati da `P + T`, `P + h`, `P + s`, `P + x`, `T + x`
- visualizzazione del percorso sui diagrammi `T-s`, `h-s`, `P-v`
- chiusura opzionale automatica del ciclo

## Utility Principali

### `src/utils/waterProps.js`

- `ensureCoolProp()`
- `solveFluid(inputs, fluid)`
- `getSaturationDome(fluid)`
- `getSaturationDomeFull(fluid)`

### `src/utils/processPath.js`

- `generateProcessPath(pt1, pt2, fluid, numPoints, options)`
- instrada i fluidi reali verso CoolProp
- instrada i cicli a gas verso il generatore ideale dedicato

### `src/utils/idealGas.js`

- `calcOttoCycle()`
- `calcDieselCycle()`
- `calcBraytonCycle()`
- `calcCarnotCycle()`
- `generateIdealGasPath()`

## Deploy

- deploy target: Vercel
- configurazione root: `vercel.json`
- build output: `Cicli-Termodinamici-Web/dist`
- nessun uso di Streamlit o backend Python nel deploy del sito

## Limitazioni Note

- la copertura test e migliorata ma resta selettiva
- parte della conoscenza di dominio esiste ancora anche nel legacy Python in `legacy/python-desktop/`
- la convergenza completa fra web app e codice legacy non e ancora finita

Related:

- [ARCHITETTURA.md](ARCHITETTURA.md)
- [MANUTENZIONE_E_MIGLIORAMENTI.md](MANUTENZIONE_E_MIGLIORAMENTI.md)
