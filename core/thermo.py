import numpy as np
from iapws import IAPWS97

# ---------------------------------------------------------
# STEAM & WATER CORE (IAPWS-97 BASED)
# ---------------------------------------------------------

def get_iapws_robust(**args):
    """Robust IAPWS-97 state calculator."""
    try:
        state = IAPWS97(**args)
        if getattr(state, 'T', None) is not None and getattr(state, 'P', None) is not None:
            return state
        return None
    except Exception:
        return None

def steam_point_to_dict(name, state):
    """Converts IAPWS97 state to a standardized dictionary."""
    return {
        "name": name,
        "P": state.P * 10.0, # MPa to bar
        "T": state.T - 273.15, # K to C
        "h": state.h,
        "s": state.s,
        "v": state.v,
        "x": state.x if state.x is not None else (0 if state.phase == 0 else 1)
    }

# ---------------------------------------------------------
# GAS CORE (IDEAL & POLYTROPIC)
# ---------------------------------------------------------

class GasPoint:
    """Represents a thermodynamic state for an ideal gas."""
    def __init__(self, name, T_C, P_bar, cp, k, R=0.287, h_ref=0.0, s_ref=0.0, T_ref_C=0.0, P_ref_bar=1.0):
        self.name = name
        self.T_C = T_C
        self.T_K = T_C + 273.15
        self.P_bar = P_bar
        self.cp = cp          # kJ/(kg·K)
        self.k = k            # Isentropic exponent
        self.R = R            # Gas constant kJ/(kg·K)
        
        # Enthalpy and Entropy relative to reference
        T_ref_K = T_ref_C + 273.15
        self.h = h_ref + cp * (T_C - T_ref_C)
        self.s = s_ref + cp * np.log(self.T_K / T_ref_K) - self.R * np.log(P_bar / P_ref_bar)
        self.v = (self.R * self.T_K) / (P_bar * 100) # m³/kg

    def to_dict(self):
        return {
            "name": self.name,
            "P": self.P_bar,
            "T": self.T_C,
            "h": self.h,
            "s": self.s,
            "v": self.v
        }

def get_polytropic_path(pt1, pt2, n=100):
    """
    Generates n intermediate points for a physically correct path
    using a generalized polytropic model.
    """
    pts = []
    t_vals = np.linspace(0, 1, n)
    
    # Check if they are GasPoints or dicts
    p1 = pt1 if hasattr(pt1, 'P_bar') else pt1
    p2 = pt2 if hasattr(pt2, 'P_bar') else pt2
    
    p1_P, p1_T_K, p1_v, p1_h, p1_s = (p1.P_bar, p1.T_K, p1.v, p1.h, p1.s) if hasattr(pt1, 'P_bar') else (p1["P"], p1["T"]+273.15, p1["v"], p1["h"], p1["s"])
    p2_P, p2_T_K, p2_v, p2_h, p2_s = (p2.P_bar, p2.T_K, p2.v, p2.h, p2.s) if hasattr(pt2, 'P_bar') else (p2["P"], p2["T"]+273.15, p2["v"], p2["h"], p2["s"])

    for t in t_vals:
        # P, T, v interpolated in log scale
        P_k = p1_P * ((p2_P / p1_P) ** t) if p1_P != p2_P else p1_P
        T_K_k = p1_T_K * ((p2_T_K / p1_T_K) ** t) if p1_T_K != p2_T_K else p1_T_K
        v_k = p1_v * ((p2_v / p1_v) ** t) if p1_v != p2_v else p1_v
        
        # Enthalpy is linear with T
        if p1_T_K != p2_T_K:
            h_k = p1_h + (T_K_k - p1_T_K) / (p2_T_K - p1_T_K) * (p2_h - p1_h)
        else:
            h_k = p1_h + t * (p2_h - p1_h)
            
        # Entropy is linear with t for polytropic processes
        s_k = p1_s + t * (p2_s - p1_s)
        
        pts.append({"P": P_k, "T": T_K_k - 273.15, "h": h_k, "s": s_k, "v": v_k})
        
    return pts
