"""Transparent sample data used only for the UI prototype."""
import numpy as np
import pandas as pd

RNG = np.random.default_rng(42)

def portfolio_kpis():
    return {
        "total_customers": 10000,
        "at_risk": 1840,
        "avg_risk": 0.31,
        "segments": 4,
    }

def churn_sample(n=250):
    risk = RNG.beta(2.2, 4.5, n)
    return pd.DataFrame({
        "customer_id": [f"CUST-{i:05d}" for i in range(1, n + 1)],
        "churn_probability": risk,
        "risk_level": pd.cut(risk, [-0.01, .30, .60, 1.0], labels=["Low", "Medium", "High"]),
        "tenure_months": RNG.integers(1, 73, n),
        "monthly_charges": RNG.normal(240, 65, n).clip(60, 600).round(2),
        "support_tickets": RNG.poisson(1.4, n),
    })

def segment_sample():
    return pd.DataFrame({
        "segment": ["Segment 0", "Segment 1", "Segment 2", "Segment 3"],
        "customers": [3100, 2700, 2450, 1750],
        "avg_monthly_charges": [180, 260, 340, 220],
        "avg_tenure": [42, 28, 19, 51],
    })
