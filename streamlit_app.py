import matplotlib.patches as patches
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import plotly.graph_objects as go
import streamlit as st
from iapws import IAPWS97
from streamlit_javascript import st_javascript

st.set_page_config(page_title="TermoWeb UI", page_icon="⚡", layout="wide")

THEME = {
    "bg": "#0d141b",
    "panel": "#10202c",
    "grid": "rgba(184, 219, 237, 0.14)",
    "text": "#e7f6ff",
    "cyan": "#50c8e8",
    "gold": "#ffd166",
    "orange": "#ff9f43",
    "red": "#ff6b6b",
    "blue": "#74c0fc",
    "green": "#4dd4ac",
    "gray": "#9aa7b2",
}

st.markdown(
    """
    <style>
    .block-container { padding-top: 0.35rem; padding-bottom: 0.5rem; max-width: 1500px; }
    .stApp {
        background:
            radial-gradient(circle at top left, rgba(0, 212, 255, 0.10), transparent 28%),
            radial-gradient(circle at top right, rgba(80, 200, 232, 0.08), transparent 30%),
            linear-gradient(180deg, #071018 0%, #0b1620 45%, #0d141b 100%);
        color: #e7f6ff;
    }
    [data-testid="stHeader"] { background: rgba(7, 16, 24, 0.0); }
    .hero {
        margin-top: 0.2rem; margin-bottom: 1rem; padding: 1.35rem 1.5rem 1.1rem 1.5rem;
        border-radius: 22px; background: linear-gradient(135deg, rgba(7, 29, 43, 0.96), rgba(10, 57, 76, 0.88));
        border: 1px solid rgba(80, 200, 232, 0.24); box-shadow: 0 18px 40px rgba(0, 0, 0, 0.28);
    }
    .hero h1 { margin: 0; color: #8ae8ff; font-size: 2.35rem; line-height: 1.1; text-shadow: 0 0 18px rgba(0, 212, 255, 0.22); }
    .hero p { margin: 0.55rem 0 0 0; color: #cbefff; }
    .subtitle { font-size: 1.05rem; }
    .authorline { font-size: 0.96rem; opacity: 0.92; }
    div[data-testid="stMetric"] {
        background: linear-gradient(180deg, rgba(15, 31, 43, 0.95), rgba(10, 23, 34, 0.92));
        border: 1px solid rgba(80, 200, 232, 0.18); border-radius: 18px; padding: 0.35rem 0.6rem;
    }
    div[data-testid="stDataFrame"] { border: 1px solid rgba(80, 200, 232, 0.14); border-radius: 16px; overflow: hidden; }
    .stTabs [data-baseweb="tab-list"] { gap: 0.35rem; }
    .stTabs [data-baseweb="tab"] { border-radius: 12px; background: rgba(12, 28, 39, 0.88); border: 1px solid rgba(80, 200, 232, 0.14); }
    </style>
    """,
    unsafe_allow_html=True,
)


def get_browser_lang():
    try:
        lang = st_javascript("window.navigator.language;")
        if lang:
            return "it" if str(lang).lower().startswith("it") else "en"
    except Exception:
        pass
    return "it"


if "app_lang" not in st.session_state:
    st.session_state["app_lang"] = get_browser_lang()
if "cad_points" not in st.session_state:
    st.session_state["cad_points"] = []
if "cad_close_cycle" not in st.session_state:
    st.session_state["cad_close_cycle"] = True


dict_t = {
    "en": {
        "main_title": "Thermodynamic Cycles - Web Suite",
        "subtitle": "Interactive study of ideal and real thermodynamic cycles with diagrams, state points, and a free cycle builder.",
        "author": "Created by Prof. Ing. Andrea Viola | Educational use only.",
        "sidebar_head": "Settings",
        "select_cycle": "Select cycle",
        "inputs": "Input parameters",
        "results": "Main results",
        "plots": "Diagrams",
        "net_work": "Net work",
        "efficiency": "Thermal efficiency",
        "heat_in": "Heat in",
        "heat_out": "Heat out",
        "pmax": "Max pressure",
        "comp_ratio": "Compression ratio r",
        "k_exp": "Exponent k",
        "eta_is": "Isentropic eta",
        "ideal": "Ideal cycle",
        "real": "Real cycle",
        "bwr": "Back work ratio",
        "p_evap": "Boiler pressure (bar)",
        "p_cond": "Condenser pressure (bar)",
        "t_max": "Maximum temperature (°C)",
        "build_info": "Build custom water or steam cycles by adding independent or derived points.",
        "points": "State points",
        "stats": "Cycle summary",
    },
    "it": {
        "main_title": "Cicli Termodinamici - Suite Web",
        "subtitle": "Studio interattivo dei cicli termodinamici ideali e reali con diagrammi, punti di stato e costruttore libero del ciclo.",
        "author": "Creato dal Prof. Ing. Andrea Viola | Solo per uso didattico.",
        "sidebar_head": "Impostazioni",
        "select_cycle": "Seleziona il ciclo",
        "inputs": "Parametri di input",
        "results": "Risultati principali",
        "plots": "Diagrammi",
        "net_work": "Lavoro netto",
        "efficiency": "Rendimento termico",
        "heat_in": "Calore entrante",
        "heat_out": "Calore uscente",
        "pmax": "Pressione massima",
        "comp_ratio": "Rapporto di compressione r",
        "k_exp": "Esponente k",
        "eta_is": "Eta isentropico",
        "ideal": "Ciclo ideale",
        "real": "Ciclo reale",
        "bwr": "Back work ratio",
        "p_evap": "Pressione caldaia (bar)",
        "p_cond": "Pressione condensatore (bar)",
        "t_max": "Temperatura massima (°C)",
        "build_info": "Costruisci cicli liberi ad acqua o vapore aggiungendo punti indipendenti o derivati.",
        "points": "Punti di stato",
        "stats": "Bilancio del ciclo",
    },
}

st.sidebar.header("Language / Lingua")
lang_choice = st.sidebar.radio("", ["Italiano (it)", "English (en)"], index=0 if st.session_state["app_lang"] == "it" else 1)
lang = "it" if "Italiano" in lang_choice else "en"
st.session_state["app_lang"] = lang
t = dict_t[lang]

st.markdown(
    f"""
    <div class="hero">
        <h1>{t['main_title']}</h1>
        <p class="subtitle">{t['subtitle']}</p>
        <p class="authorline">{t['author']}</p>
    </div>
    """,
    unsafe_allow_html=True,
)
st.divider()


def get_iapws_robust(**args):
    try:
        return IAPWS97(**args)
    except Exception:
        return None


def quality_label(x):
    if x is None or (isinstance(x, float) and np.isnan(x)):
        return "n/d"
    if 0.0 < x < 1.0:
        return f"{x:.3f}"
    if x <= 0.0:
        return "liq. sat."
    if x >= 1.0:
        return "vap. sat."
    return f"{x:.3f}"


def steam_point(name, state):
    return {"name": name, "P": state.P * 10.0, "T": state.T - 273.15, "h": state.h, "s": state.s, "v": state.v, "x": state.x}


@st.cache_data(show_spinner=False)
def build_steam_dome():
    pressures = np.logspace(np.log10(0.001), np.log10(22.0), 160)
    sat_f = {"P": [], "T": [], "v": [], "h": [], "s": []}
    sat_g = {"P": [], "T": [], "v": [], "h": [], "s": []}
    for p in pressures:
        try:
            st_f = IAPWS97(P=p, x=0)
            sat_f["P"].append(st_f.P * 10.0); sat_f["T"].append(st_f.T - 273.15); sat_f["v"].append(st_f.v); sat_f["h"].append(st_f.h); sat_f["s"].append(st_f.s)
        except Exception:
            pass
        try:
            st_g = IAPWS97(P=p, x=1)
            sat_g["P"].append(st_g.P * 10.0); sat_g["T"].append(st_g.T - 273.15); sat_g["v"].append(st_g.v); sat_g["h"].append(st_g.h); sat_g["s"].append(st_g.s)
        except Exception:
            pass
    return sat_f, sat_g


def plotly_base(title, x_title, y_title, xlog=False, ylog=False, height=460):
    fig = go.Figure()
    fig.update_layout(
        title=title,
        height=height,
        paper_bgcolor=THEME["bg"],
        plot_bgcolor=THEME["panel"],
        font=dict(color=THEME["text"]),
        margin=dict(l=20, r=20, t=52, b=20),
        legend=dict(bgcolor="rgba(6, 19, 27, 0.78)", bordercolor="rgba(80, 200, 232, 0.18)", borderwidth=1),
        hoverlabel=dict(bgcolor="#06131b", bordercolor=THEME["cyan"], font=dict(color=THEME["text"])),
    )
    fig.update_xaxes(title=x_title, showgrid=True, gridcolor=THEME["grid"], zeroline=False, type="log" if xlog else "linear")
    fig.update_yaxes(title=y_title, showgrid=True, gridcolor=THEME["grid"], zeroline=False, type="log" if ylog else "linear")
    return fig


def add_line(fig, x, y, name, color, dash="solid", width=3):
    fig.add_trace(go.Scatter(x=x, y=y, mode="lines", name=name, line=dict(color=color, width=width, dash=dash), hoverinfo="skip"))


def add_steam_points(fig, points, x_key, y_key, name, color):
    customdata = [[p["name"], p["P"], p["T"], p["h"], p["s"], p["v"], quality_label(p.get("x"))] for p in points]
    fig.add_trace(
        go.Scatter(
            x=[p[x_key] for p in points],
            y=[p[y_key] for p in points],
            mode="lines+markers+text",
            name=name,
            text=[p["name"] for p in points],
            textposition="top center",
            line=dict(color=color, width=3),
            marker=dict(size=10, color=color, line=dict(color="#17303b", width=2)),
            customdata=customdata,
            hovertemplate="<b>%{customdata[0]}</b><br>P = %{customdata[1]:.3f} bar<br>T = %{customdata[2]:.2f} °C<br>h = %{customdata[3]:.2f} kJ/kg<br>s = %{customdata[4]:.4f} kJ/kgK<br>v = %{customdata[5]:.5e} m³/kg<br>x = %{customdata[6]}<extra></extra>",
        )
    )


def add_generic_points(fig, points, x_key, y_key, name, color):
    customdata = [[p["name"], p["P"], p["T"], p["h"], p["s"], p["v"]] for p in points]
    fig.add_trace(
        go.Scatter(
            x=[p[x_key] for p in points],
            y=[p[y_key] for p in points],
            mode="lines+markers+text",
            name=name,
            text=[p["name"] for p in points],
            textposition="top center",
            line=dict(color=color, width=3),
            marker=dict(size=10, color=color, line=dict(color="#17303b", width=2)),
            customdata=customdata,
            hovertemplate="<b>%{customdata[0]}</b><br>P = %{customdata[1]:.3f} bar<br>T = %{customdata[2]:.2f} °C<br>h = %{customdata[3]:.2f} kJ/kg<br>s = %{customdata[4]:.4f} kJ/kgK<br>v = %{customdata[5]:.5e} m³/kg<extra></extra>",
        )
    )


def add_steam_dome(fig, x_key, y_key):
    sat_f, sat_g = build_steam_dome()
    add_line(fig, sat_f[x_key], sat_f[y_key], "Liquido saturo", THEME["cyan"], width=2)
    add_line(fig, sat_g[x_key], sat_g[y_key], "Vapore saturo", THEME["cyan"], width=2)


def draw_rankine_schema(p1, p2, p3, p4):
    fig_s, ax = plt.subplots(figsize=(6, 5))
    ax.set_facecolor("#10202c"); ax.axis("off"); ax.set_xlim(0, 10.5); ax.set_ylim(-2, 11)
    ax.add_patch(patches.Rectangle((1.5, 3.5), 2.5, 4.5, fill=True, color="#2c1e1e", ec=THEME["red"], lw=2))
    ax.add_patch(patches.Polygon([(6.5, 7.5), (7.8, 6.8), (7.8, 4.2), (6.5, 3.5)], fill=True, color="#2f2214", ec=THEME["orange"], lw=2))
    ax.add_patch(patches.Circle((7.15, 1.5), 0.8, fill=True, color="#1a2433", ec=THEME["blue"], lw=2))
    ax.add_patch(patches.Circle((4, 0.5), 0.5, fill=True, color="#1a3333", ec=THEME["cyan"], lw=2))
    ax.text(2.75, 5.75, "Caldaia", color=THEME["red"], ha="center", va="center", weight="bold")
    ax.text(7.15, 8.2, "Turbina", color=THEME["orange"], ha="center", weight="bold")
    ax.text(8.8, 1.5, "Condensatore", color=THEME["blue"], ha="center", va="center", weight="bold")
    ax.text(4, 1.5, "Pompa", color=THEME["cyan"], ha="center", weight="bold")
    ax.plot([3.5, 2.75, 2.75], [0.5, 0.5, 3.5], color=THEME["cyan"], lw=2)
    ax.plot([2.75, 2.75, 6.5, 6.5], [8.0, 9.5, 9.5, 7.5], color=THEME["red"], lw=2)
    ax.plot([7.15, 7.15], [5.5, 2.3], color=THEME["orange"], lw=2)
    ax.plot([6.35, 4.5, 4.5, 4.0], [1.5, 1.5, 0.5, 0.5], color=THEME["blue"], lw=2)
    for x, y, lbl, p in [(4.5, 0.5, "1", p1), (2.75, 2.0, "2", p2), (4.5, 9.7, "3", p3), (7.3, 3.5, "4", p4)]:
        ax.text(x, y, f"[{lbl}]\\nP:{p.P*10:.2f} bar\\nT:{p.T-273.15:.1f} °C", color="white", fontsize=7, bbox=dict(boxstyle="round,pad=0.2", fc="#10202c", ec="white", alpha=0.7))
    return fig_s


def draw_brayton_schema(p1, p2, p3, p4):
    fig_s, ax = plt.subplots(figsize=(6, 5))
    ax.set_facecolor("#10202c"); ax.axis("off"); ax.set_xlim(0, 1); ax.set_ylim(0, 1)
    ax.plot([0.3, 0.9], [0.4, 0.4], color="gray", linewidth=4, zorder=1); ax.text(0.6, 0.35, "Albero", color="white", weight="bold", ha="center", fontsize=9)
    ax.plot([0.35, 0.35, 0.45], [0.5, 0.8, 0.8], color="#555555", linewidth=10, zorder=1); ax.plot([0.55, 0.65, 0.65], [0.8, 0.8, 0.5], color="#555555", linewidth=10, zorder=1)
    ax.add_patch(patches.Polygon([[0.2, 0.3], [0.2, 0.7], [0.4, 0.6], [0.4, 0.4]], closed=True, color="#2196F3", zorder=2))
    ax.add_patch(patches.Polygon([[0.6, 0.4], [0.6, 0.6], [0.8, 0.7], [0.8, 0.3]], closed=True, color="#4CAF50", zorder=2))
    ax.add_patch(patches.Rectangle((0.4, 0.7), 0.2, 0.2, color="#FFCA28", zorder=2))
    ax.text(0.3, 0.5, "Compressore", color="white", weight="bold", ha="center", va="center", rotation=90, fontsize=8)
    ax.text(0.7, 0.5, "Turbina", color="white", weight="bold", ha="center", va="center", rotation=-90, fontsize=8)
    ax.text(0.5, 0.8, "Combustore", color="black", weight="bold", ha="center", va="center", fontsize=8)
    for x, y, lbl, p in [(0.1, 0.5, "1", p1), (0.35, 0.9, "2", p2), (0.65, 0.9, "3", p3), (0.9, 0.5, "4", p4)]:
        ax.text(x, y, f"{lbl}\\nP:{p['P']:.1f} bar\\nT:{p['T']:.0f} °C", color="white", fontsize=7, bbox=dict(boxstyle="round,pad=0.2", fc="#10202c", ec="white", alpha=0.7))
    return fig_s


def draw_otto_diesel_schema(is_diesel=False):
    fig_s, ax = plt.subplots(figsize=(6, 4))
    ax.set_facecolor("#10202c"); ax.axis("off")
    ax.add_patch(patches.Rectangle((0.3, 0.2), 0.4, 0.6, fill=False, color="white", lw=3))
    piston_y = 0.3 if is_diesel else 0.4
    ax.add_patch(patches.Rectangle((0.3, piston_y), 0.4, 0.1, color="gray"))
    ax.plot([0.5, 0.5], [piston_y, 0.05], color="gray", lw=5)
    ax.text(0.5, 0.9, "Diesel" if is_diesel else "Otto", color="white", ha="center", weight="bold")
    return fig_s


def render_point_table(points):
    df = pd.DataFrame(points)
    cols = [c for c in ["name", "P", "T", "h", "s", "v", "x"] if c in df.columns]
    st.dataframe(df[cols], use_container_width=True, hide_index=True)


cycle_options = ["💧 Rankine (Vapore/Acqua)", "🔥 Brayton (Turbina a gas)", "⚙️ Otto", "🛢️ Diesel", "❄️ Frigorifero", "🛠️ ThermoCAD"]
st.sidebar.header(t["sidebar_head"])
ciclo = st.sidebar.radio(t["select_cycle"], cycle_options)


if "Rankine" in ciclo:
    st.header("💧 Rankine / Hirn")
    st.sidebar.subheader(t["inputs"])
    p_evap = st.sidebar.number_input(t["p_evap"], value=50.0)
    p_cond = st.sidebar.number_input(t["p_cond"], value=0.08)
    t_max = st.sidebar.number_input(t["t_max"], value=400.0)
    eta_p = st.sidebar.number_input("η pompa", value=0.85)
    eta_t = st.sidebar.number_input("η turbina", value=0.85)

    try:
        pt1 = IAPWS97(P=p_cond / 10.0, x=0)
        pt2s = IAPWS97(P=p_evap / 10.0, s=pt1.s)
        h2 = pt1.h + (pt2s.h - pt1.h) / eta_p
        pt2 = IAPWS97(P=p_evap / 10.0, h=h2)
        sat_vapor = IAPWS97(P=p_evap / 10.0, x=1)
        pt3 = sat_vapor if t_max < sat_vapor.T - 273.15 else IAPWS97(P=p_evap / 10.0, T=t_max + 273.15)
        pt4s = IAPWS97(P=p_cond / 10.0, s=pt3.s)
        h4 = pt3.h - (pt3.h - pt4s.h) * eta_t
        pt4 = IAPWS97(P=p_cond / 10.0, h=h4)

        l_p = pt2.h - pt1.h
        l_t = pt3.h - pt4.h
        q_in = pt3.h - pt2.h
        l_net = l_t - l_p
        eta_cycle = 100.0 * l_net / q_in if q_in > 0 else 0.0
        points = [steam_point("1", pt1), steam_point("2", pt2), steam_point("3", pt3), steam_point("4", pt4), steam_point("1", pt1)]

        col_res, col_plot, col_schema = st.columns([1, 1.5, 1.5])
        with col_res:
            st.subheader(t["results"])
            st.metric(t["net_work"], f"{l_net:.1f} kJ/kg")
            st.metric(t["efficiency"], f"{eta_cycle:.2f} %")
            st.write(f"**L turbina:** {l_t:.1f} kJ/kg")
            st.write(f"**L pompa:** {l_p:.1f} kJ/kg")
            st.write(f"**{t['heat_in']}:** {q_in:.1f} kJ/kg")
            render_point_table(points[:-1])

        with col_plot:
            st.subheader(t["plots"])
            tab_ts, tab_pv, tab_hs = st.tabs(["T-s", "P-v", "h-s"])
            with tab_ts:
                fig = plotly_base("T-s Diagram", "s (kJ/kgK)", "T (°C)")
                add_steam_dome(fig, "s", "T")
                add_line(fig, [pt1.s, pt1.s, pt3.s, pt3.s, pt1.s], [pt1.T - 273.15, pt2s.T - 273.15, pt3.T - 273.15, pt4s.T - 273.15, pt1.T - 273.15], t["ideal"], THEME["gray"], dash="dash", width=2)
                add_steam_points(fig, points, "s", "T", t["real"], THEME["gold"])
                st.plotly_chart(fig, use_container_width=True)
            with tab_pv:
                fig = plotly_base("P-v Diagram", "v (m³/kg)", "P (bar)", xlog=True, ylog=True)
                add_steam_dome(fig, "v", "P")
                add_steam_points(fig, points, "v", "P", t["real"], THEME["gold"])
                st.plotly_chart(fig, use_container_width=True)
            with tab_hs:
                fig = plotly_base("Mollier h-s", "s (kJ/kgK)", "h (kJ/kg)")
                add_steam_dome(fig, "s", "h")
                add_steam_points(fig, points, "s", "h", t["real"], THEME["red"])
                st.plotly_chart(fig, use_container_width=True)

        with col_schema:
            st.subheader("Schema impianto")
            st.pyplot(draw_rankine_schema(pt1, pt2, pt3, pt4))
    except Exception as exc:
        st.error(f"IAPWS error: {exc}")


elif "Brayton" in ciclo:
    st.header("🔥 Brayton")
    st.sidebar.subheader(t["inputs"])
    p1 = st.sidebar.number_input("P1 (bar)", value=1.0)
    p2 = st.sidebar.number_input("P2 (bar)", value=12.0)
    t1 = st.sidebar.number_input("T1 (°C)", value=15.0)
    t3 = st.sidebar.number_input(t["t_max"], value=1100.0)
    eta_c = st.sidebar.number_input("η compressore", value=0.85)
    eta_t = st.sidebar.number_input("η turbina", value=0.88)

    cp = 1.005
    k = 1.4
    r_p = p2 / p1
    t1k = t1 + 273.15
    t3k = t3 + 273.15
    t2sk = t1k * (r_p ** ((k - 1) / k))
    t2k = t1k + (t2sk - t1k) / eta_c
    t4sk = t3k / (r_p ** ((k - 1) / k))
    t4k = t3k - eta_t * (t3k - t4sk)

    def entropy_air(temp_k, press_bar):
        return cp * np.log(temp_k / 273.15) - 0.287 * np.log(press_bar)

    h1, h2, h3, h4 = cp * t1k, cp * t2k, cp * t3k, cp * t4k
    s1, s2, s3, s4 = entropy_air(t1k, p1), entropy_air(t2k, p2), entropy_air(t3k, p2), entropy_air(t4k, p1)
    v1, v2, v3, v4 = 0.287 * t1k / (p1 * 100), 0.287 * t2k / (p2 * 100), 0.287 * t3k / (p2 * 100), 0.287 * t4k / (p1 * 100)
    points = [
        {"name": "1", "P": p1, "T": t1, "h": h1, "s": s1, "v": v1},
        {"name": "2", "P": p2, "T": t2k - 273.15, "h": h2, "s": s2, "v": v2},
        {"name": "3", "P": p2, "T": t3, "h": h3, "s": s3, "v": v3},
        {"name": "4", "P": p1, "T": t4k - 273.15, "h": h4, "s": s4, "v": v4},
        {"name": "1", "P": p1, "T": t1, "h": h1, "s": s1, "v": v1},
    ]
    l_c = h2 - h1
    l_t = h3 - h4
    q_in = h3 - h2
    l_net = l_t - l_c
    eta_cycle = 100.0 * l_net / q_in if q_in > 0 else 0.0
    bwr = 100.0 * l_c / l_t if l_t > 0 else 0.0

    col_res, col_plot, col_schema = st.columns([1, 1.5, 1.5])
    with col_res:
        st.subheader(t["results"])
        st.metric(t["net_work"], f"{l_net:.1f} kJ/kg")
        st.metric(t["efficiency"], f"{eta_cycle:.2f} %")
        st.write(f"**β:** {r_p:.2f}")
        st.write(f"**{t['bwr']}:** {bwr:.1f} %")
        st.write(f"**{t['heat_in']}:** {q_in:.1f} kJ/kg")
        render_point_table(points[:-1])

    with col_plot:
        st.subheader(t["plots"])
        tab_ts, tab_pv, tab_hs = st.tabs(["T-s", "P-v", "h-s"])
        with tab_ts:
            fig = plotly_base("T-s Diagram", "s (kJ/kgK)", "T (°C)")
            add_line(fig, [s1, s1, s3, s3, s1], [t1, t2sk - 273.15, t3, t4sk - 273.15, t1], t["ideal"], THEME["gray"], dash="dash", width=2)
            add_generic_points(fig, points, "s", "T", t["real"], THEME["orange"])
            st.plotly_chart(fig, use_container_width=True)
        with tab_pv:
            fig = plotly_base("P-v Diagram", "v (m³/kg)", "P (bar)")
            add_generic_points(fig, points, "v", "P", t["real"], THEME["cyan"])
            st.plotly_chart(fig, use_container_width=True)
        with tab_hs:
            fig = plotly_base("h-s Diagram", "s (kJ/kgK)", "h (kJ/kg)")
            add_generic_points(fig, points, "s", "h", t["real"], THEME["red"])
            st.plotly_chart(fig, use_container_width=True)

    with col_schema:
        st.subheader("Schema impianto")
        st.pyplot(draw_brayton_schema(points[0], points[1], points[2], points[3]))


elif "Otto" in ciclo:
    st.header("⚙️ Otto")
    st.sidebar.subheader(t["inputs"])
    p1 = st.sidebar.number_input("P1 (bar)", value=1.0)
    t1 = st.sidebar.number_input("T1 (°C)", value=20.0)
    r = st.sidebar.number_input(t["comp_ratio"], value=9.0)
    t3 = st.sidebar.number_input(t["t_max"], value=1200.0)
    k = st.sidebar.number_input(t["k_exp"], value=1.4)
    cv = st.sidebar.number_input("cv (kJ/kgK)", value=0.718)
    eta = st.sidebar.number_input(t["eta_is"], value=0.85)

    rg = cv * (k - 1)
    t1k = t1 + 273.15
    t3k = t3 + 273.15
    v1 = rg * t1k / (p1 * 100)
    v2 = v1 / r
    t2sk = t1k * (r ** (k - 1))
    t2k = t1k + (t2sk - t1k) / eta
    p2 = p1 * (t2k / t1k) * (v1 / v2)
    p3 = p2 * (t3k / t2k)
    v3 = v2
    t4sk = t3k * ((1 / r) ** (k - 1))
    t4k = t3k - eta * (t3k - t4sk)
    p4 = p3 * (t4k / t3k) * (v3 / v1)

    def s_otto(temp_k, vol):
        return cv * np.log(temp_k / 273.15) + rg * np.log(vol / v1)

    h1, h2, h3, h4 = cv * t1k, cv * t2k, cv * t3k, cv * t4k
    s1, s2, s3, s4 = s_otto(t1k, v1), s_otto(t2k, v2), s_otto(t3k, v3), s_otto(t4k, v1)
    points = [
        {"name": "1", "P": p1, "T": t1, "h": h1, "s": s1, "v": v1},
        {"name": "2", "P": p2, "T": t2k - 273.15, "h": h2, "s": s2, "v": v2},
        {"name": "3", "P": p3, "T": t3, "h": h3, "s": s3, "v": v3},
        {"name": "4", "P": p4, "T": t4k - 273.15, "h": h4, "s": s4, "v": v1},
        {"name": "1", "P": p1, "T": t1, "h": h1, "s": s1, "v": v1},
    ]
    q_in = cv * (t3k - t2k)
    q_out = cv * (t4k - t1k)
    w_net = q_in - q_out
    eta_cycle = 100.0 * w_net / q_in if q_in > 0 else 0.0

    col_res, col_plot, col_schema = st.columns([1, 1.5, 1.5])
    with col_res:
        st.subheader(t["results"])
        st.metric(t["net_work"], f"{w_net:.1f} kJ/kg")
        st.metric(t["efficiency"], f"{eta_cycle:.2f} %")
        st.write(f"**{t['pmax']}:** {p3:.2f} bar")
        st.write(f"**{t['heat_in']}:** {q_in:.1f} kJ/kg")
        st.write(f"**{t['heat_out']}:** {q_out:.1f} kJ/kg")
        render_point_table(points[:-1])

    with col_plot:
        st.subheader(t["plots"])
        tab_pv, tab_ts, tab_hs = st.tabs(["P-v", "T-s", "h-s"])
        with tab_pv:
            fig = plotly_base("P-v Diagram", "v (m³/kg)", "P (bar)")
            add_line(fig, np.linspace(v2, v1, 60), p1 * (v1 / np.linspace(v2, v1, 60)) ** k, t["ideal"], THEME["gray"], dash="dash", width=2)
            add_generic_points(fig, points, "v", "P", t["real"], THEME["cyan"])
            st.plotly_chart(fig, use_container_width=True)
        with tab_ts:
            fig = plotly_base("T-s Diagram", "s (kJ/kgK)", "T (°C)")
            add_generic_points(fig, points, "s", "T", t["real"], THEME["gold"])
            st.plotly_chart(fig, use_container_width=True)
        with tab_hs:
            fig = plotly_base("h-s Diagram", "s (kJ/kgK)", "h (kJ/kg)")
            add_generic_points(fig, points, "s", "h", t["real"], THEME["red"])
            st.plotly_chart(fig, use_container_width=True)

    with col_schema:
        st.subheader("Schema motore")
        st.pyplot(draw_otto_diesel_schema(False))


elif "Diesel" in ciclo:
    st.header("🛢️ Diesel")
    st.sidebar.subheader(t["inputs"])
    p1 = st.sidebar.number_input("P1 (bar)", value=1.0)
    t1 = st.sidebar.number_input("T1 (°C)", value=20.0)
    r = st.sidebar.number_input(t["comp_ratio"], value=18.0)
    rc = st.sidebar.number_input("Rapporto di introduzione rc", value=2.0)
    k = st.sidebar.number_input(t["k_exp"], value=1.4)
    cv = st.sidebar.number_input("cv (kJ/kgK)", value=0.718)
    eta = st.sidebar.number_input(t["eta_is"], value=0.85)

    rg = cv * (k - 1)
    cp = cv * k
    t1k = t1 + 273.15
    v1 = rg * t1k / (p1 * 100)
    v2 = v1 / r
    t2sk = t1k * (r ** (k - 1))
    t2k = t1k + (t2sk - t1k) / eta
    p2 = p1 * (t2k / t1k) * (v1 / v2)
    p3 = p2
    v3 = v2 * rc
    t3k = t2k * rc
    t4sk = t3k * ((v3 / v1) ** (k - 1))
    t4k = t3k - eta * (t3k - t4sk)
    p4 = p3 * (t4k / t3k) * (v3 / v1)

    def s_diesel(temp_k, vol):
        return cv * np.log(temp_k / 273.15) + rg * np.log(vol / v1)

    h1, h2, h3, h4 = cp * t1k, cp * t2k, cp * t3k, cp * t4k
    s1, s2, s3, s4 = s_diesel(t1k, v1), s_diesel(t2k, v2), s_diesel(t3k, v3), s_diesel(t4k, v1)
    points = [
        {"name": "1", "P": p1, "T": t1, "h": h1, "s": s1, "v": v1},
        {"name": "2", "P": p2, "T": t2k - 273.15, "h": h2, "s": s2, "v": v2},
        {"name": "3", "P": p3, "T": t3k - 273.15, "h": h3, "s": s3, "v": v3},
        {"name": "4", "P": p4, "T": t4k - 273.15, "h": h4, "s": s4, "v": v1},
        {"name": "1", "P": p1, "T": t1, "h": h1, "s": s1, "v": v1},
    ]
    q_in = cp * (t3k - t2k)
    q_out = cv * (t4k - t1k)
    w_net = q_in - q_out
    eta_cycle = 100.0 * w_net / q_in if q_in > 0 else 0.0

    col_res, col_plot, col_schema = st.columns([1, 1.5, 1.5])
    with col_res:
        st.subheader(t["results"])
        st.metric(t["net_work"], f"{w_net:.1f} kJ/kg")
        st.metric(t["efficiency"], f"{eta_cycle:.2f} %")
        st.write(f"**{t['pmax']}:** {p3:.2f} bar")
        st.write(f"**{t['heat_in']}:** {q_in:.1f} kJ/kg")
        st.write(f"**{t['heat_out']}:** {q_out:.1f} kJ/kg")
        render_point_table(points[:-1])

    with col_plot:
        st.subheader(t["plots"])
        tab_pv, tab_ts, tab_hs = st.tabs(["P-v", "T-s", "h-s"])
        with tab_pv:
            fig = plotly_base("P-v Diagram", "v (m³/kg)", "P (bar)")
            add_line(fig, np.linspace(v2, v1, 60), p1 * (v1 / np.linspace(v2, v1, 60)) ** k, t["ideal"], THEME["gray"], dash="dash", width=2)
            add_generic_points(fig, points, "v", "P", t["real"], THEME["cyan"])
            st.plotly_chart(fig, use_container_width=True)
        with tab_ts:
            fig = plotly_base("T-s Diagram", "s (kJ/kgK)", "T (°C)")
            add_generic_points(fig, points, "s", "T", t["real"], THEME["gold"])
            st.plotly_chart(fig, use_container_width=True)
        with tab_hs:
            fig = plotly_base("h-s Diagram", "s (kJ/kgK)", "h (kJ/kg)")
            add_generic_points(fig, points, "s", "h", t["real"], THEME["red"])
            st.plotly_chart(fig, use_container_width=True)

    with col_schema:
        st.subheader("Schema motore")
        st.pyplot(draw_otto_diesel_schema(True))


elif "Frigorifero" in ciclo:
    st.header("❄️ Frigorifero / Pompa di calore")
    st.sidebar.subheader(t["inputs"])
    te = st.sidebar.number_input("T evaporazione (°C)", value=-10.0)
    tc = st.sidebar.number_input("T condensazione (°C)", value=35.0)
    eta = st.sidebar.number_input("η compressore", value=0.8)

    pe = 10 ** ((te + 100) / 70)
    pc = 10 ** ((tc + 100) / 70)
    h1 = 400 + 0.5 * te + 4.0
    h2 = h1 + ((h1 - 200) * 0.5 * (pc / pe - 1)) / eta
    h3 = 200 + 1.2 * tc - 2.4
    h4 = h3
    s1 = 1.0 + 0.005 * te
    s2 = s1 + 0.002 * (pc / pe)
    s3 = s2 - 0.003 * (pc - pe)
    s4 = s3
    qe = h1 - h4
    wc = h2 - h1
    qc = h2 - h3
    points = [
        {"name": "1", "P": pe, "T": te, "h": h1, "s": s1, "v": 0.0},
        {"name": "2", "P": pc, "T": tc + 25, "h": h2, "s": s2, "v": 0.0},
        {"name": "3", "P": pc, "T": tc, "h": h3, "s": s3, "v": 0.0},
        {"name": "4", "P": pe, "T": te, "h": h4, "s": s4, "v": 0.0},
        {"name": "1", "P": pe, "T": te, "h": h1, "s": s1, "v": 0.0},
    ]

    col_res, col_plot = st.columns([1, 2])
    with col_res:
        st.subheader(t["results"])
        st.metric("COP freddo", f"{qe / wc:.2f}")
        st.metric("COP caldo", f"{qc / wc:.2f}")
        render_point_table(points[:-1])
    with col_plot:
        st.subheader(t["plots"])
        tab_ph, tab_ts, tab_hs = st.tabs(["P-h", "T-s", "h-s"])
        with tab_ph:
            fig = plotly_base("P-h Diagram", "h (kJ/kg)", "P (bar)", ylog=True)
            add_generic_points(fig, points, "h", "P", "Cycle", THEME["cyan"])
            st.plotly_chart(fig, use_container_width=True)
        with tab_ts:
            fig = plotly_base("T-s Diagram", "s (kJ/kgK)", "T (°C)")
            add_generic_points(fig, points, "s", "T", "Cycle", THEME["gold"])
            st.plotly_chart(fig, use_container_width=True)
        with tab_hs:
            fig = plotly_base("h-s Diagram", "s (kJ/kgK)", "h (kJ/kg)")
            add_generic_points(fig, points, "s", "h", "Cycle", THEME["red"])
            st.plotly_chart(fig, use_container_width=True)


else:
    st.header("🛠️ ThermoCAD")
    st.info(t["build_info"])

    with st.sidebar:
        st.divider()
        st.subheader("1. Punto indipendente")
        point_mode = st.selectbox("Metodo", ["P-T", "P-x", "P-s", "P-h", "T-x", "T-s"])
        val1 = st.number_input("Valore 1", value=1.0, format="%.4f", key="cad_v1")
        val2 = st.number_input("Valore 2", value=20.0, format="%.4f", key="cad_v2")
        if st.button("Aggiungi punto", use_container_width=True):
            args = {}
            if point_mode == "P-T":
                args = {"P": val1 / 10.0, "T": val2 + 273.15}
            elif point_mode == "P-x":
                args = {"P": val1 / 10.0, "x": val2}
            elif point_mode == "P-s":
                args = {"P": val1 / 10.0, "s": val2}
            elif point_mode == "P-h":
                args = {"P": val1 / 10.0, "h": val2}
            elif point_mode == "T-x":
                args = {"T": val1 + 273.15, "x": val2}
            elif point_mode == "T-s":
                args = {"T": val1 + 273.15, "s": val2}
            state = get_iapws_robust(**args)
            if state:
                st.session_state["cad_points"].append(steam_point(f"P{len(st.session_state['cad_points']) + 1}", state))
                st.rerun()
            else:
                st.error("Stato non valido")

        st.subheader("2. Punto derivato")
        if st.session_state["cad_points"]:
            point_names = [p["name"] for p in st.session_state["cad_points"]]
            base_name = st.selectbox("Punto di partenza", point_names)
            iso_type = st.selectbox("Trasformazione iso", ["Isobara", "Isoterma", "Isentropica", "Isentalpica"])
            target_prop = st.selectbox("Proprietà target", ["Pressione (bar)", "Temperatura (°C)", "Entropia (kJ/kgK)", "Entalpia (kJ/kg)", "Titolo x"])
            target_val = st.number_input("Valore target", value=1.0, format="%.4f", key="cad_target")
            if st.button("Aggiungi punto derivato", use_container_width=True):
                base_point = next(p for p in st.session_state["cad_points"] if p["name"] == base_name)
                args = {}
                if iso_type == "Isobara":
                    args["P"] = base_point["P"] / 10.0
                elif iso_type == "Isoterma":
                    args["T"] = base_point["T"] + 273.15
                elif iso_type == "Isentropica":
                    args["s"] = base_point["s"]
                elif iso_type == "Isentalpica":
                    args["h"] = base_point["h"]

                if "Pressione" in target_prop:
                    args["P"] = target_val / 10.0
                elif "Temperatura" in target_prop:
                    args["T"] = target_val + 273.15
                elif "Entropia" in target_prop:
                    args["s"] = target_val
                elif "Entalpia" in target_prop:
                    args["h"] = target_val
                elif "Titolo" in target_prop:
                    args["x"] = target_val

                state = get_iapws_robust(**args)
                if state:
                    st.session_state["cad_points"].append(steam_point(f"P{len(st.session_state['cad_points']) + 1}", state))
                    st.rerun()
                else:
                    st.error("Trasformazione non valida")

        st.checkbox("Chiudi il ciclo nei diagrammi", key="cad_close_cycle")
        if st.button("Rimuovi ultimo punto", use_container_width=True):
            if st.session_state["cad_points"]:
                st.session_state["cad_points"].pop()
                st.rerun()
        if st.button("Azzera ciclo", type="primary", use_container_width=True):
            st.session_state["cad_points"] = []
            st.rerun()

    if st.session_state["cad_points"]:
        points = list(st.session_state["cad_points"])
        closed_points = points + [points[0]] if st.session_state["cad_close_cycle"] and len(points) > 2 else points

        col_list, col_plot = st.columns([1, 1.8])
        with col_list:
            st.subheader(t["points"])
            render_point_table(points)
            st.subheader(t["stats"])
            if len(closed_points) > 1:
                q_in = 0.0
                q_out = 0.0
                l_net = 0.0
                for p_a, p_b in zip(closed_points[:-1], closed_points[1:]):
                    dh = p_b["h"] - p_a["h"]
                    l_net -= dh
                    if dh >= 0:
                        q_in += dh
                    else:
                        q_out += abs(dh)
                eta_cycle = 100.0 * l_net / q_in if q_in > 0 else 0.0
                st.metric(t["heat_in"], f"{q_in:.1f} kJ/kg")
                st.metric(t["heat_out"], f"{q_out:.1f} kJ/kg")
                st.metric(t["net_work"], f"{l_net:.1f} kJ/kg")
                st.metric(t["efficiency"], f"{eta_cycle:.2f} %")

        with col_plot:
            st.subheader(t["plots"])
            tab_ts, tab_pv, tab_tv, tab_hs = st.tabs(["T-s", "P-v", "T-v", "h-s"])
            with tab_ts:
                fig = plotly_base("T-s Diagram", "s (kJ/kgK)", "T (°C)")
                add_steam_dome(fig, "s", "T")
                add_steam_points(fig, closed_points, "s", "T", "Cycle", THEME["gold"])
                st.plotly_chart(fig, use_container_width=True)
            with tab_pv:
                fig = plotly_base("P-v Diagram", "v (m³/kg)", "P (bar)", xlog=True, ylog=True)
                add_steam_dome(fig, "v", "P")
                add_steam_points(fig, closed_points, "v", "P", "Cycle", THEME["cyan"])
                st.plotly_chart(fig, use_container_width=True)
            with tab_tv:
                fig = plotly_base("T-v Diagram", "v (m³/kg)", "T (°C)", xlog=True)
                add_steam_dome(fig, "v", "T")
                add_steam_points(fig, closed_points, "v", "T", "Cycle", THEME["green"])
                st.plotly_chart(fig, use_container_width=True)
            with tab_hs:
                fig = plotly_base("h-s Diagram", "s (kJ/kgK)", "h (kJ/kg)")
                add_steam_dome(fig, "s", "h")
                add_steam_points(fig, closed_points, "s", "h", "Cycle", THEME["red"])
                st.plotly_chart(fig, use_container_width=True)
    else:
        st.write("Aggiungi punti dalla barra laterale per iniziare a costruire il ciclo.")
