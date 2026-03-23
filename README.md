# Thermodynamic Cycles - Web Suite ⚡ / Cicli Termodinamici
*Created by **Prof. Ing. Andrea Viola** | Creato dal **Prof. Ing. Andrea Viola***
*For educational purposes only | Esclusivamente per scopi didattici*

🇬🇧 An interactive educational web application for teaching and studying ideal and real thermodynamic cycles.
🇮🇹 Una suite software didattica e interattiva per l'insegnamento e lo studio dei principali cicli termodinamici.

Developed in Python with **Streamlit** and **Matplotlib**, it allows dynamic visualization of physical parameters and performance (efficiency, work, heat), with **automatic English/Italian translation** based on the user's browser.

## 📂 Project Structure / Struttura del Progetto
- `streamlit_app.py`: The main Web Application file (Deploy this on Streamlit Community Cloud).
- `calcolatore_*.py`: Desktop backend modules (Tkinter + Matplotlib) for local use.
- `cicli_termodinamici.py`: Desktop Unified Launcher for Windows/Mac.
- `requirements.txt`: Python dependencies.

## 🚀 Main Features / Funzionalità
The program integrates **5 complete modules**:
1. **💧 Rankine Cycle (Steam/Water)**: IAPWS-IF97 analysis, exact saturation dome, vapor quality.
2. **🔥 Brayton Cycle (Gas Turbine)**: Compressor, combustion chamber, turbine analysis, BWR.
3. **⚙️ Otto Cycle (Spark Ignition Engine)**: P-v and T-s charts.
4. **🛢️ Diesel Cycle (Compression Ignition)**: P-v and T-s charts.
5. **❄️ Refrigeration Cycle (Heat Pump)**: COP analysis for cooling and heating.

### Advanced Graphics
*   Visual distinction between **Real Cycle (solid lines)** and **Ideal/Carnot Cycle (dashed lines)**.
*   Interactive Plant Schematics alongside Thermodynamic Diagrams (T-s, P-v, P-h).

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
