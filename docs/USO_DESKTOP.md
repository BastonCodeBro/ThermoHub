# Uso Desktop / Desktop Usage

Guida al codice desktop legacy, verificata sul repository del **2026-03-25**.

## Stato

La suite desktop non e piu il prodotto principale del repository.

Il codice e stato spostato in:

- `legacy/python-desktop/`

Il sito web resta il deliverable primario. Questa guida documenta solo il legacy per consultazione o manutenzione storica.

## Requisiti

- Python 3.10+ consigliato
- ambiente Windows consigliato
- dipendenze in `legacy/python-desktop/requirements-desktop.txt`

Installazione:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r legacy/python-desktop/requirements-desktop.txt
```

## Entry Point Legacy

```powershell
python legacy/python-desktop/cicli_termodinamici.py
python legacy/python-desktop/calcolatore_acqua.py
python legacy/python-desktop/calcolatore_brayton.py
python legacy/python-desktop/calcolatore_otto.py
python legacy/python-desktop/calcolatore_diesel.py
python legacy/python-desktop/calcolatore_frigo.py
```

## Note

- `legacy/python-desktop/calcolatore_acqua.py` resta il modulo piu avanzato del vecchio desktop
- il launcher batch principale legacy e ancora obsoleto e punta a un file mancante
- il core storico si trova in `legacy/python-desktop/core/`
- questo codice non partecipa al deploy Vercel del sito

Related:

- [ARCHITETTURA.md](ARCHITETTURA.md)
- [MANUTENZIONE_E_MIGLIORAMENTI.md](MANUTENZIONE_E_MIGLIORAMENTI.md)
