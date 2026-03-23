# Cicli Termodinamici - Suite Didattica Avanzata

Una suite software didattica e interattiva per l'insegnamento e lo studio dei principali cicli termodinamici.
Sviluppata interamente in Python con **CustomTkinter** e **Matplotlib**, permette di visualizzare dinamicamente l'interazione tra i parametri fisici e le prestazioni (rendimenti, lavori, calori).

## 🚀 Funzionalità Principali
Il programma integra **5 moduli completi** in un'unica interfaccia unificata:
1. **💧 Ciclo Rankine (Vapore/Acqua)**: Include analisi IAPWS-IF97 completa, campana di saturazione esatta, titolo vapore e analisi macchine reali.
2. **🔥 Ciclo Brayton (Turbogas)**: Analisi di compressore, camera di combustione e turbina a gas, inclusi eccesso d'aria e back-work ratio (BWR).
3. **⚙️ Ciclo Otto (Motore a scoppio)**: Ciclo termodinamico a volume costante con grafici P-v e T-s.
4. **🛢️ Ciclo Diesel (Motore Diesel)**: Ciclo ideale e reale per motori ad accensione spontanea con grafici P-v e T-s.
5. **❄️ Ciclo Frigorifero (Pompa di Calore)**: Analisi delle prestazioni frigorifere e di riscaldamento (Coefficient of Performance - COP).

### Grafici Avanzati
*   I grafici distinguono visivamente il **Ciclo Reale (linee continue o a colori vibranti)** dal **Ciclo Ideale / di Carnot (linee tratteggiate)**.
*   Punti interattivi ai nodi delle trasformazioni (tooltip on hover per leggere Entalpia, Entropia, Temperatura, e Pressione).

## 📥 Installazione e Avvio
Per eseguire l'applicazione web in locale è necessario **Python 3.9+**.

1. Clona il repository:
   ```bash
   git clone https://github.com/TUO_NOME_UTENTE/cicli_termodinamici.git
   cd cicli_termodinamici
   ```
2. Installa le dipendenze:
   ```bash
   pip install -r requirements.txt
   ```
3. Avvia la Web App su Streamlit:
   ```bash
   streamlit run streamlit_app.py
   ```
   *Si aprirà una scheda nel tuo browser con l'applicazione!*

## 🌐 Deploy su Streamlit Community Cloud (Sito Pubblico Gratuito)
L'applicazione è ora una VERA Web App. Per renderla accessibile gratis a chiunque dal proprio browser:

1. Fai Login su [Streamlit Community Cloud](https://share.streamlit.io/) usando il tuo account GitHub.
2. Clicca su **"New app"**.
3. Seleziona questa repository (`BastonCodeBro/Thermodynamics-Cycles-Open_Source`).
4. Nel campo `Main file path` inserisci: `streamlit_app.py`
5. Clicca **Deploy!**

In pochi minuti Streamlit creerà un link pubblico gratuito (es. `https://nome-scelto.streamlit.app`) che i tuoi studenti potranno usare da PC o cellulare senza scaricare nulla.

### Versione Desktop Inclusa
Se si preferisce usare il programma locale tradizionale (con GUI Tkinter nativa), lanciare `python cicli_termodinamici.py` oppure creare l'eseguibile con `pyinstaller --noconsole --onefile cicli_termodinamici.py`.

## 📝 Licenza
Progetto rilasciato sotto licenza MIT - sentiti libero di usarlo e modificarlo per la didattica!
