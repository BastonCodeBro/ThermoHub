# Manutenzione E Miglioramenti / Maintenance And Improvements

Audit tecnico aggiornato allo stato verificato il **2026-03-25**.

## Check Eseguiti

- `npm run lint` in `Cicli-Termodinamici-Web/` -> passed
- `npm run test` in `Cicli-Termodinamici-Web/` -> passed
- `npm run build` in `Cicli-Termodinamici-Web/` -> passed

## Correzioni Gia Applicate

1. **Frontend pulito lato toolchain**
   - ESLint non segnala errori
   - build di produzione completata
   - test frontend verdi

2. **Cicli a gas resi coerenti**
   - Brayton, Otto, Diesel e Carnot usano una utility dedicata per stati e percorsi a gas ideale

3. **Schemi di ciclo corretti**
   - `SchematicDiagram` e stato separato per ciclo

4. **Flusso desktop utile migrato nel sito**
   - `Laboratorio Vapore` porta nel web la costruzione manuale dei punti acqua-vapore

5. **Miglioramento bundle**
   - export PDF caricato on-demand
   - chunking del build reso piu esplicito

6. **Repository piu chiaro**
   - il codice desktop storico e stato isolato in `legacy/python-desktop/`

## Problemi Ancora Aperti

### 1. Dominio ancora parzialmente duplicato

- la web app ha logica attiva in JS
- nel repository resta anche il legacy Python
- il rischio principale e la divergenza numerica futura

Priorita: **alta**

### 2. Copertura test ancora parziale

- sono presenti smoke test di routing
- sono stati aggiunti test numerici di base per i cicli a gas
- mancano ancora test numerici estesi su Rankine, refrigerazione e validazione dei diagrammi

Priorita: **alta**

### 3. Bundle ancora costoso

- il caricamento e migliorato
- Plotly e CoolProp restano comunque asset pesanti

Priorita: **media**

### 4. Legacy ancora nel repository

- il legacy e stato isolato in `legacy/python-desktop/`
- resta da decidere se mantenerlo qui o estrarlo in un repository separato

Priorita: **media**

## Raccomandazioni Prioritarie

### Priorita 1: Estendere i test numerici

- aggiungere test con tolleranze per Rankine e refrigerazione
- verificare esplicitamente heat/work balance e coordinate dei punti

### Priorita 2: Test dei diagrammi e dei path generator

- validare che i path `isentropic`, `isobaric`, `isochoric`, `isothermal` e `polytropic` generino curve fisicamente coerenti
- aumentare la copertura di `generateProcessPath()` e `generateIdealGasPath()`

### Priorita 3: Rifinire la separazione web / legacy

- mantenere il web come sorgente primaria del prodotto
- valutare se estrarre il legacy in un repository separato

### Priorita 4: Alleggerire ancora il frontend

- code splitting piu fine su diagrammi ed export
- valutare lazy loading ancora piu aggressivo per alcune librerie

### Priorita 5: Rifinire UX e contenuti

- completare la migrazione delle funzioni desktop davvero utili nel laboratorio web
- uniformare tutte le stringhe residue in UTF-8 pulito

Related:

- [USO_WEB.md](USO_WEB.md)
- [ARCHITETTURA.md](ARCHITETTURA.md)
- [USO_DESKTOP.md](USO_DESKTOP.md)
