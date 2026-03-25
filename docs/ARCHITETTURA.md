# Architettura / Architecture

Documento aggiornato allo stato verificato il **2026-03-25**.

## Overview

Il repository e organizzato in due blocchi principali:

1. **Web App React/Vite**
2. **Legacy Python Desktop**

La parte web e il prodotto attivo. La parte Python e stata isolata in `legacy/python-desktop/` come riferimento storico e tecnico.

## 1. Web App React/Vite

### Percorso

- `Cicli-Termodinamici-Web/`

### Responsabilita

- routing e composizione pagine
- calcolo proprieta browser-side con `coolprop-wasm`
- logica esplicita dei cicli a gas in `src/utils/idealGas.js`
- generazione dei percorsi in `src/utils/processPath.js`
- rendering diagrammi con Plotly
- export PDF on-demand

### Interfacce JS principali

- `solveFluid`
- `getSaturationDome`
- `getSaturationDomeFull`
- `generateProcessPath`
- `calcOttoCycle`
- `calcDieselCycle`
- `calcBraytonCycle`
- `calcCarnotCycle`
- `generateIdealGasPath`
- `exportToPDF`

### Note Architetturali

- Rankine e refrigerazione usano CoolProp browser-side
- Brayton, Otto, Diesel e Carnot usano logica gas-ideale esplicita nel frontend
- `Laboratorio Vapore` importa nel sito il flusso manuale piu utile del vecchio desktop
- Plotly, `jspdf` e `html2canvas` sono caricati in modo lazy

## 2. Legacy Python Desktop

### Percorso

- `legacy/python-desktop/`

### Contenuto

- `cicli_termodinamici.py`
- `calcolatore_acqua.py`
- `calcolatore_brayton.py`
- `calcolatore_otto.py`
- `calcolatore_diesel.py`
- `calcolatore_frigo.py`
- `core/`
- launcher `.bat`
- `requirements-desktop.txt`

### Ruolo Attuale

- riferimento storico
- confronto formule e workflow
- base da cui e stato portato nel web il laboratorio vapore

Il legacy non fa parte del deploy Vercel del sito.

## Runtime Data Flow

### Web

1. l'utente modifica i parametri in una pagina React
2. la pagina calcola stati e statistiche
3. `generateProcessPath()` o `generateIdealGasPath()` costruiscono i tratti
4. Plotly renderizza i diagrammi
5. l'export PDF carica on-demand `jspdf` e `html2canvas`

### Legacy Desktop

1. l'utente usa una GUI `customtkinter`
2. il calcolo avviene localmente in Python
3. `legacy/python-desktop/core/` costruisce proprieta e percorsi
4. `matplotlib` renderizza i diagrammi

## Rischi Architetturali

### Duplicazione di dominio

- una parte della conoscenza termodinamica vive ancora anche nel legacy Python
- la parte web e oggi la sorgente attiva del prodotto
- serve evitare divergenze future tra formule legacy e formule web

### Copertura test ancora selettiva

- i test web coprono routing e una base numerica per i cicli a gas
- mancano ancora test numerici estesi su Rankine, refrigerazione e validazione grafici

### Bundle ancora costoso

- il caricamento e migliorato con lazy loading
- Plotly e CoolProp restano comunque i componenti piu costosi del frontend

Related:

- [USO_WEB.md](USO_WEB.md)
- [USO_DESKTOP.md](USO_DESKTOP.md)
- [MANUTENZIONE_E_MIGLIORAMENTI.md](MANUTENZIONE_E_MIGLIORAMENTI.md)
