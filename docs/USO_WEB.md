# Uso Web ThermoHub

Guida operativa per l applicazione web React/Vite deployata su Vercel, aggiornata al **2026-03-26**.

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

## Routing principale

- `/`
- `/cicli-termodinamici`
- `/impianti-fluidici`
- `/esami-di-stato`
- `/laboratorio-vapore`
- `/rankine`
- `/brayton`
- `/otto`
- `/diesel`
- `/frigo`
- `/carnot`

## Sezioni

### Cicli termodinamici

- libreria teorica di supporto
- simulatori interattivi
- export PDF con risultati e diagrammi

### Impianti oleodinamici e pneumatici

- canvas per costruire schemi
- palette componenti
- simulazione e stato del circuito

### Esami di stato

- archivio per anno e codice
- traccia sintetica e svolgimento dettagliato
- diagramma tecnico dedicato per ogni prova
- download PDF completo con traccia inclusa

## Deploy

- target: Vercel
- configurazione root: `vercel.json`
- output: `Cicli-Termodinamici-Web/dist`

## Note operative

- il sito e completamente statico lato hosting
- le tracce originali sono servite dalla cartella `public/esami/originali/`
- i PDF vengono generati nel browser dell utente

## Documenti correlati

- [ARCHITETTURA.md](ARCHITETTURA.md)
- [MANUTENZIONE_E_MIGLIORAMENTI.md](MANUTENZIONE_E_MIGLIORAMENTI.md)
