# ThermoHub

Repository principale del progetto **ThermoHub**, piattaforma web per cicli termodinamici, impianti fluidici ed esami di stato.

Stato aggiornato al **2026-03-26**.

## Struttura

- `Cicli-Termodinamici-Web/`
  applicazione React/Vite attiva e deployata su Vercel
- `docs/`
  documentazione tecnica e operativa
- `legacy/python-desktop/`
  materiale desktop storico, fuori dal runtime del sito
- `vercel.json`
  configurazione di build e deploy

## Cosa include ThermoHub

- libreria dei principali cicli termodinamici
- simulatori interattivi per Rankine, Brayton, Otto, Diesel, Frigo e Carnot
- laboratorio vapore con costruzione manuale degli stati
- laboratorio oleodinamico e pneumatico con canvas interattivo
- archivio esami di stato con traccia, svolgimento e download PDF
- export PDF brandizzato ThermoHub

## Avvio locale

```powershell
cd Cicli-Termodinamici-Web
npm install
npm run dev
```

## Verifiche consigliate

```powershell
cd Cicli-Termodinamici-Web
npm run lint
npm run test
npm run build
```

## Deploy

Il deploy Vercel usa `vercel.json` alla radice e pubblica:

- `Cicli-Termodinamici-Web/dist`

## Documentazione

- [README web](Cicli-Termodinamici-Web/README.md)
- [Uso web](docs/USO_WEB.md)
- [Architettura](docs/ARCHITETTURA.md)
- [Manutenzione e miglioramenti](docs/MANUTENZIONE_E_MIGLIORAMENTI.md)
- [Uso desktop legacy](docs/USO_DESKTOP.md)
