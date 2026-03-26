# Manutenzione e Miglioramenti ThermoHub

Documento aggiornato al **2026-03-26**.

## Check da eseguire

- `npm run lint` in `Cicli-Termodinamici-Web/`
- `npm run test` in `Cicli-Termodinamici-Web/`
- `npm run build` in `Cicli-Termodinamici-Web/`

## Interventi recenti

1. rebranding completo a ThermoHub su sito, documentazione e PDF
2. introduzione dei diagrammi tecnici nella sezione esami di stato
3. miglioramento dell export PDF con intestazione, footer e impaginazione piu curata
4. archivio esami con download completo e traccia inclusa

## Aree da monitorare

### Export PDF

- verificare resa grafica su browser differenti
- controllare il peso finale dei file con diagrammi catturati

### Sezione esami

- mantenere coerenti dati numerici, traccia e schema tecnico
- aggiungere nuove prove ministeriali senza duplicare i contenuti

### Simulatori

- estendere i test numerici per Rankine e refrigerazione
- ridurre dove possibile il costo di caricamento di Plotly

## Raccomandazioni

1. mantenere ThermoHub Web come sorgente primaria del prodotto
2. aggiornare l archivio esami in modo centralizzato da `src/data/stateExamsData.js`
3. usare sempre gli exporter in `src/utils/pdfExport.js` e `src/utils/examPdfExport.js` per preservare il branding
4. valutare una futura separazione del legacy Python in repository dedicato

## Documenti correlati

- [USO_WEB.md](USO_WEB.md)
- [ARCHITETTURA.md](ARCHITETTURA.md)
- [USO_DESKTOP.md](USO_DESKTOP.md)
