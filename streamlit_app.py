import streamlit as st
import numpy as np
import matplotlib.pyplot as plt
from iapws import IAPWS97

st.set_page_config(page_title="Cicli Termodinamici", page_icon="⚡", layout="wide")

plt.style.use('dark_background')

# --- Header ---
st.title("⚡ Cicli Termodinamici - Suite Web")
st.markdown("Applicazione didattica per l'analisi dei cicli termodinamici ideali e reali.")

# --- Sidebar ---
st.sidebar.header("Impostazioni")
ciclo_selezionato = st.sidebar.radio("Seleziona il Ciclo:", [
    "💧 Rankine (Acqua)",
    "🔥 Brayton (Gas)",
    "⚙️ Otto",
    "🛢️ Diesel",
    "❄️ Frigorifero"
])

# ---------------------------------------------------------
# CICLO OTTO
# ---------------------------------------------------------
if ciclo_selezionato == "⚙️ Otto":
    st.header("⚙️ Ciclo Otto (Motore ad accensione comandata)")
    
    col_in, col_out = st.columns([1, 2])
    with col_in:
        st.subheader("Parametri di Input")
        P1 = st.number_input("P1 (bar)", value=1.0)
        T1_C = st.number_input("T1 (°C)", value=20.0)
        r = st.number_input("Rapp. di Compressione (r)", value=9.0)
        T3_C = st.number_input("T3 (°C - max)", value=1200.0)
        k = st.number_input("Esponente k", value=1.4)
        cv = st.number_input("cv (kJ/kgK)", value=0.718)
        eta = st.number_input("η_is (compr/esp)", value=0.85)
    
    # Calcoli Otto
    R = cv * (k - 1)
    cp = cv * k
    T1_K = T1_C + 273.15
    T3_K = T3_C + 273.15
    v1 = (R * T1_K) / (P1 * 100)
    v2 = v1 / r
    
    # 1->2 (isentropic compression)
    T2s_K = T1_K * (r**(k-1))
    T2_K = T1_K + (T2s_K - T1_K) / eta
    P2_bar = P1 * (T2_K / T1_K) * (v1 / v2)
    
    # 2->3 (isochoric heat addition)
    P3_bar = P2_bar * (T3_K / T2_K)
    v3 = v2
    
    # 3->4 (isentropic expansion)
    T4s_K = T3_K * ((1/r)**(k-1))
    T4_K = T3_K - eta * (T3_K - T4s_K)
    P4_bar = P3_bar * (T4_K / T3_K) * (v3 / v1)
    v4 = v1

    qin = cv * (T3_K - T2_K)
    qout = cv * (T4_K - T1_K)
    wnet = qin - qout
    thermal_eta = (wnet / qin) * 100 if qin > 0 else 0

    with col_out:
        st.subheader("Risultati")
        st.metric("Lavoro Netto (Wnet)", f"{wnet:.1f} kJ/kg")
        st.metric("Rendimento Termico", f"{thermal_eta:.2f} %")
        st.write(f"**Calore in (Qin):** {qin:.1f} kJ/kg")
        st.write(f"**Calore out (Qout):** {qout:.1f} kJ/kg")
        st.write(f"**Pressione Max:** {P3_bar:.2f} bar")

        # Plot P-v
        fig, ax = plt.subplots(figsize=(6, 4))
        ax.set_title("Diagramma P-v (Ciclo Otto)")
        ax.set_xlabel("Volume Specifico (m³/kg)")
        ax.set_ylabel("Pressione (bar)")
        
        # Ideale
        v_comp = np.linspace(v2, v1, 50)
        p_comp_s = P1 * (v1 / v_comp)**k
        p_esp_s = P3_bar * (v3 / v_comp)**k
        ax.plot(v_comp, p_comp_s, '--', color='gray', label="Ideale (η=1)")
        ax.plot(v_comp, p_esp_s, '--', color='gray')
        ax.plot([v1, v1], [p_esp_s[-1], P1], '--', color='gray')
        ax.plot([v2, v2], [p_comp_s[0], P3_bar], '--', color='gray')

        # Reale
        p_comp_r = P1 * (v1 / v_comp)**1.4 # approx polytropic per disegno
        p_esp_r = P3_bar * (v3 / v_comp)**1.4
        ax.plot(v_comp, p_comp_r, '-', color='orange', label='Comp. Reale')
        ax.plot([v2, v2], [p_comp_r[0], P3_bar], '-', color='red', label='Add. Calore')
        ax.plot(v_comp, p_esp_r, '-', color='cyan', label='Esp. Reale')
        ax.plot([v1, v1], [p_esp_r[-1], P1], '-', color='blue', label='Sott. Calore')

        ax.grid(True, alpha=0.3)
        ax.legend()
        st.pyplot(fig)


# ---------------------------------------------------------
# CICLO DIESEL
# ---------------------------------------------------------
elif ciclo_selezionato == "🛢️ Diesel":
    st.header("🛢️ Ciclo Diesel (Motore ad accensione spontanea)")
    
    col_in, col_out = st.columns([1, 2])
    with col_in:
        st.subheader("Parametri di Input")
        P1 = st.number_input("P1 (bar)", value=1.0)
        T1_C = st.number_input("T1 (°C)", value=20.0)
        r = st.number_input("Rapp. Compressione (r)", value=18.0)
        rc = st.number_input("Rapp. Iniezione (rc)", value=2.0)
        k = st.number_input("Esponente k", value=1.4)
        cv = st.number_input("cv (kJ/kgK)", value=0.718)
        eta = st.number_input("η_is (compr/esp)", value=0.85)

    R = cv * (k - 1)
    cp = cv * k
    T1_K = T1_C + 273.15
    v1 = (R * T1_K) / (P1 * 100)
    v2 = v1 / r
    T2s_K = T1_K * (r**(k-1))
    T2_K = T1_K + (T2s_K - T1_K) / eta
    P2_bar = P1 * (T2_K / T1_K) * (v1 / v2)
    P3_bar = P2_bar
    v3 = v2 * rc
    T3_K = T2_K * rc
    T4s_K = T3_K * ((v3/v1)**(k-1))
    T4_K = T3_K - eta * (T3_K - T4s_K)
    P4_bar = P3_bar * (T4_K / T3_K) * (v3 / v1)

    qin = cp * (T3_K - T2_K)
    qout = cv * (T4_K - T1_K)
    wnet = qin - qout
    thermal_eta = (wnet / qin) * 100 if qin > 0 else 0

    with col_out:
        st.subheader("Risultati")
        st.metric("Lavoro Netto (Wnet)", f"{wnet:.1f} kJ/kg")
        st.metric("Rendimento Termico", f"{thermal_eta:.2f} %")
        st.write(f"**Pressione Max:** {P3_bar:.2f} bar")

        fig, ax = plt.subplots(figsize=(6, 4))
        ax.set_title("Diagramma P-v (Ciclo Diesel)")
        v_comp = np.linspace(v2, v1, 50)
        v_esp = np.linspace(v3, v1, 50)
        
        # Ideale
        ax.plot(v_comp, P1 * (v1 / v_comp)**k, '--', color='gray', label="Ideale")
        ax.plot(v_esp, P3_bar * (v3 / v_esp)**k, '--', color='gray')
        
        # Reale
        ax.plot(v_comp, P1 * (v1 / v_comp)**1.35, '-', color='orange', label="Reale")
        ax.plot([v2, v3], [P3_bar, P3_bar], '-', color='red')
        ax.plot(v_esp, P3_bar * (v3 / v_esp)**1.35, '-', color='cyan')
        ax.plot([v1, v1], [P4_bar, P1], '-', color='blue')

        ax.grid(True, alpha=0.3)
        ax.legend()
        st.pyplot(fig)

# ---------------------------------------------------------
# CICLO FRIGORIFERO
# ---------------------------------------------------------
elif ciclo_selezionato == "❄️ Frigorifero":
    st.header("❄️ Ciclo Frigorifero / Pompa di Calore")
    
    col_in, col_out = st.columns([1, 2])
    with col_in:
        st.subheader("Parametri di Input")
        Te = st.number_input("T Evaporazione (°C)", value=-10.0)
        Tc = st.number_input("T Condensazione (°C)", value=35.0)
        eta = st.number_input("η_is Compressore", value=0.8)
        dt_sub = st.number_input("Sottoraffreddamento (K)", value=2.0)
        dt_sup = st.number_input("Surriscaldamento (K)", value=5.0)

    # Simplified math as done in our Frigo module
    def get_sat_props(T_C):
        P = 10**((T_C+100)/70) # bar
        hf = 200 + 1.2 * T_C; hg = 400 + 0.5 * T_C
        sf = 1.0 + 0.004 * T_C; sg = 1.7 - 0.001 * T_C
        return P, hf, hg, sf, sg

    Pe, hf_e, hg_e, sf_e, sg_e = get_sat_props(Te)
    Pc, hf_c, hg_c, sf_c, sg_c = get_sat_props(Tc)
    
    h1 = hg_e + 0.8 * dt_sup
    h2s = h1 + (h1-hf_e)*0.5 * (Pc/Pe - 1)
    h2 = h1 + (h2s - h1) / eta
    h3 = hf_c - 1.2 * dt_sub
    h4 = h3

    qe = h1 - h4
    wc = h2 - h1
    qc = h2 - h3

    with col_out:
        st.subheader("Risultati")
        st.metric("COP Freddo", f"{qe/wc:.2f}")
        st.metric("COP Caldo", f"{qc/wc:.2f}")
        st.write(f"**Pressione Evap:** {Pe:.2f} bar")
        st.write(f"**Pressione Cond:** {Pc:.2f} bar")

        fig, ax = plt.subplots(figsize=(6, 4))
        ax.set_title("Diagramma P-h (Ciclo Frigorifero)")
        ax.set_yscale('log')
        ax.set_xlabel("Entalpia (kJ/kg)")
        ax.set_ylabel("Pressione (bar)")
        
        Tt = np.linspace(-40, 60, 50)
        hh_f = 200 + 1.2 * Tt; hh_g = 400 + 0.5 * Tt
        PP = 10**((Tt+100)/70)
        
        ax.plot(np.concatenate([hh_f, hh_g[::-1]]), np.concatenate([PP, PP[::-1]]), color="gray", alpha=0.5)
        ax.plot([h1, h2, h3, h4, h1], [Pe, Pc, Pc, Pe, Pe], color="cyan", linewidth=2, marker='o', label="Ciclo")
        
        ax.grid(True, alpha=0.3)
        ax.legend()
        st.pyplot(fig)

# ---------------------------------------------------------
# CICLO BRAYTON
# ---------------------------------------------------------
elif ciclo_selezionato == "🔥 Brayton (Gas)":
    st.header("🔥 Ciclo Brayton (Turbogas)")
    
    col_in, col_out = st.columns([1, 2])
    with col_in:
        st.subheader("Parametri")
        P1 = st.number_input("Pressioni P1, P2 (bar)", value=1.0)
        P2 = st.number_input("  -> P2 (bar)", value=12.0)
        T1 = st.number_input("Temperature T1, T3 (°C)", value=15.0)
        T3 = st.number_input("  -> T3 max (°C)", value=1100.0)
        eta_c = st.number_input("η isentropico compr.", value=0.85)
        eta_t = st.number_input("η isentropico turbina", value=0.88)
        beta_c = P2 / P1
        st.write(f"Rapporto di press. β: **{beta_c:.2f}**")

    # Math
    cp = 1.005
    k = 1.4
    T1_K = T1 + 273.15; T3_K = T3 + 273.15
    
    T2s_K = T1_K * (beta_c**((k-1)/k))
    T2_K = T1_K + (T2s_K - T1_K) / eta_c
    T4s_K = T3_K / (beta_c**((k-1)/k))
    T4_K = T3_K - eta_t * (T3_K - T4s_K)

    l_c = cp * (T2_K - T1_K)
    l_t = cp * (T3_K - T4_K)
    l_net = l_t - l_c
    q_in = cp * (T3_K - T2_K)
    eta_ciclo = (l_net / q_in) * 100 if q_in > 0 else 0
    bwr = (l_c / l_t) * 100 if l_t > 0 else 0

    with col_out:
        st.subheader("Risultati")
        st.metric("Lavoro Netto", f"{l_net:.1f} kJ/kg")
        st.metric("Rendimento Termico", f"{eta_ciclo:.2f} %")
        st.write(f"**BWR (Back Work Ratio):** {bwr:.1f} %")
        st.write(f"**Lavoro Turbina:** {l_t:.1f} kJ/kg")
        st.write(f"**Lavoro Compressore:** {l_c:.1f} kJ/kg")

        fig, ax = plt.subplots(figsize=(6, 4))
        ax.set_title("Diagramma T-s (Ciclo Brayton)")
        ax.set_xlabel("Entropia (kJ/kgK)")
        ax.set_ylabel("Temperatura (°C)")

        def entropy(T_K, P_b): return cp * np.log(T_K/273.15) - 0.287 * np.log(P_b/1.0)
        
        s1 = entropy(T1_K, P1)
        s2 = entropy(T2_K, P2); s2s = entropy(T2s_K, P2)
        s3 = entropy(T3_K, P2)
        s4 = entropy(T4_K, P1); s4s = entropy(T4s_K, P1)

        # Isobars
        s_base = np.linspace(s1-0.5, s4+0.5, 50)
        T_isob1 = 273.15 * np.exp((s_base + 0.287*np.log(P1/1.0))/cp)
        T_isob2 = 273.15 * np.exp((s_base + 0.287*np.log(P2/1.0))/cp)
        ax.plot(s_base, T_isob1 - 273.15, ':', color='gray', alpha=0.5)
        ax.plot(s_base, T_isob2 - 273.15, ':', color='gray', alpha=0.5)

        # Ideale (dashed)
        ax.plot([s1, s1], [T1, T2s_K-273.15], '--', color='gray', label="Ideale")
        ax.plot([s1, s3], [T2s_K-273.15, T3], '--', color='gray')
        ax.plot([s3, s3], [T3, T4s_K-273.15], '--', color='gray')
        ax.plot([s3, s1], [T4s_K-273.15, T1], '--', color='gray')

        # Reale
        ax.plot([s1, s2], [T1, T2_K-273.15], '-', color='orange', label="Compressione")
        ss_q = np.linspace(s2, s3, 50)
        tt_q = 273.15 * np.exp((ss_q + 0.287*np.log(P2/1.0))/cp) - 273.15
        ax.plot(ss_q, tt_q, '-', color='red', label="Add. Calore")
        ax.plot([s3, s4], [T3, T4_K-273.15], '-', color='cyan', label="Espansione")
        
        ax.grid(True, alpha=0.3)
        ax.legend()
        st.pyplot(fig)
        
# ---------------------------------------------------------
# CICLO RANKINE
# ---------------------------------------------------------
elif ciclo_selezionato == "💧 Rankine (Acqua)":
    st.header("💧 Ciclo Rankine / Hirsch (Vapore)")
    
    col_in, col_out = st.columns([1, 2])
    with col_in:
        st.subheader("Parametri")
        P_cond = st.number_input("P Condensatore (bar)", value=0.08)
        P_evap = st.number_input("P Evaporatore (bar)", value=50.0)
        T_max = st.number_input("T surriscaldamento (°C)", value=400.0)
        eta_p = st.number_input("η isentropico pompa", value=0.85)
        eta_t = st.number_input("η isentropico turbina", value=0.85)

    try:
        # State 1: Saturated liquid at P_cond
        pt1 = IAPWS97(P=P_cond/10, x=0)
        h1 = pt1.h; s1 = pt1.s; v1 = pt1.v; T1 = pt1.T - 273.15

        # State 2: Pump outlet
        pt2s = IAPWS97(P=P_evap/10, s=s1)
        h2s = pt2s.h
        l_p = (h2s - h1) / eta_p
        h2 = h1 + l_p
        pt2 = IAPWS97(P=P_evap/10, h=h2)
        T2 = pt2.T - 273.15; s2 = pt2.s

        # State 3: Turbine inlet (superheated or saturated vapor)
        # Check if T_max is valid for this pressure
        sat_vap = IAPWS97(P=P_evap/10, x=1)
        T_sat = sat_vap.T - 273.15
        if T_max < T_sat:
            st.warning(f"T max inserita ({T_max}°C) è inferiore alla T di saturazione ({T_sat:.1f}°C). Uso vapore saturo secco.")
            pt3 = sat_vap
            T3 = T_sat
        else:
            pt3 = IAPWS97(P=P_evap/10, T=T_max+273.15)
            T3 = T_max
        h3 = pt3.h; s3 = pt3.s

        # State 4: Turbine outlet
        pt4s = IAPWS97(P=P_cond/10, s=s3)
        h4s = pt4s.h
        l_t = (h3 - h4s) * eta_t
        h4 = h3 - l_t
        pt4 = IAPWS97(P=P_cond/10, h=h4)
        T4 = pt4.T - 273.15; s4 = pt4.s; x4 = pt4.x

        q_in = h3 - h2
        q_out = h4 - h1
        l_net = l_t - l_p
        eta_ciclo = (l_net / q_in) * 100 if q_in > 0 else 0

        with col_out:
            st.subheader("Risultati")
            st.metric("Lavoro Netto", f"{l_net:.1f} kJ/kg")
            st.metric("Rendimento Termico", f"{eta_ciclo:.2f} %")
            st.write(f"**Titolo Vapore (uscita turbina):** {x4 if x4 else 1.0:.3f}")
            st.write(f"**Calore Scambiato (Qin):** {q_in:.1f} kJ/kg")
            st.write(f"**Lavoro Turbina:** {l_t:.1f} kJ/kg")
            st.write(f"**Lavoro Pompa:** {l_p:.1f} kJ/kg")

            fig, ax = plt.subplots(figsize=(6, 4))
            ax.set_title("Diagramma T-s (Ciclo Rankine)")
            ax.set_xlabel("Entropia (kJ/kgK)")
            ax.set_ylabel("Temperatura (°C)")

            # Campana di saturazione
            ss_f, ss_g, tt_sat = [], [], []
            for t_c in np.linspace(0.1, 373.9, 200):
                try:
                    sat_liq = IAPWS97(T=t_c+273.15, x=0)
                    sat_vap = IAPWS97(T=t_c+273.15, x=1)
                    ss_f.append(sat_liq.s); ss_g.append(sat_vap.s); tt_sat.append(t_c)
                except: pass
            
            ax.fill_betweenx(tt_sat, ss_f, ss_g, color='#1a3a4a', alpha=0.35)
            ax.plot(ss_f, tt_sat, color='#50c8e8', lw=1.5, label="Campana Saturazione")
            ax.plot(ss_g, tt_sat, color='#50c8e8', lw=1.5)

            # Ideale
            ax.plot([s1, s2, pt2s.s, s3, s3, s1], [T1, T2, pt2s.T-273.15, T3, pt4s.T-273.15, T1], '--', color='gray', label="Ideale")

            # Reale
            # Generazione punti isobarici riscaldamento
            s_isc = []; T_isc = []
            for t_step in np.linspace(T2, T3, 30):
                try:
                    p_temp = IAPWS97(P=P_evap/10, T=t_step+273.15)
                    s_isc.append(p_temp.s); T_isc.append(t_step)
                except: pass

            ax.plot([s1, s2], [T1, T2], '-', color='orange', label="Pompa")
            ax.plot(s_isc, T_isc, '-', color='red', label="Riscaldamento/Evap.")
            ax.plot([s3, s4], [T3, T4], '-', color='cyan', label="Turbina")
            ax.plot([s4, s1], [T4, T1], '-', color='blue', label="Condensatore")
            
            ax.grid(True, alpha=0.3)
            ax.legend(loc='upper right', fontsize=8)
            st.pyplot(fig)

    except Exception as e:
        st.error(f"Errore nel calcolo del ciclo: {e}")
