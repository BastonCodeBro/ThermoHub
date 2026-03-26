# Architettura ThermoHub

Documento aggiornato al **2026-03-26**.

## Panoramica

Il repository e organizzato in due blocchi principali:

1. **ThermoHub Web**
2. **Legacy Python Desktop**

La parte web e il prodotto attivo. La parte Python resta isolata in `legacy/python-desktop/` come riferimento storico.

## 1. ThermoHub Web

### Percorso

- `Cicli-Termodinamici-Web/`

### Responsabilita

- routing e composizione delle pagine React
- calcolo proprieta browser-side con `coolprop-wasm`
- simulazione esplicita dei cicli a gas in `src/utils/idealGas.js`
- generazione dei percorsi in `src/utils/processPath.js`
- rendering diagrammi con Plotly
- export PDF brandizzato per cicli ed esami
- archivio esami di stato con tracce originali e schemi tecnici

### Moduli chiave

- `src/App.jsx`
- `src/components/StateExamsPage.jsx`
- `src/components/FluidPowerLabPage.jsx`
- `src/components/ThermodynamicCyclesPage.jsx`
- `src/utils/pdfExport.js`
- `src/utils/examPdfExport.js`

### Note architetturali

- Rankine e refrigerazione usano CoolProp browser-side
- Brayton, Otto, Diesel e Carnot usano logica gas ideale dedicata
- il laboratorio vapore porta nel web il flusso piu utile del vecchio desktop
- i PDF sono generati on-demand con `jspdf` e `html2canvas`

## 2. Legacy Python Desktop

### Percorso

- `legacy/python-desktop/`

### Ruolo attuale

- riferimento storico
- confronto formule e workflow
- archivio del vecchio strumento desktop

Il legacy non fa parte del deploy Vercel.

## Flusso dati web

1. l utente inserisce i parametri nelle pagine React
2. il frontend calcola stati, risultati e percorsi
3. Plotly renderizza diagrammi e schemi
4. l export PDF cattura le sezioni utili e genera il documento finale

## Rischi principali

- duplicazione parziale di conoscenza tra web e legacy
- copertura test ancora selettiva sulle parti piu grafiche
- bundle ancora pesante per via di Plotly e CoolProp

## Documenti correlati

- [USO_WEB.md](USO_WEB.md)
- [USO_DESKTOP.md](USO_DESKTOP.md)
- [MANUTENZIONE_E_MIGLIORAMENTI.md](MANUTENZIONE_E_MIGLIORAMENTI.md)
