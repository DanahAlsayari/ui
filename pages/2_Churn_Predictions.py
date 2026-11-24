import streamlit as st
import pandas as pd
import plotly.express as px
from utils.sample_data import churn_sample
from utils.charts import apply_layout

st.set_page_config(page_title="Churn Predictions", page_icon="🎯", layout="wide")
st.title("Churn Predictions")
st.caption("Explore customer risk and test hypothetical customer scenarios.")

st.warning("Prototype mode: no trained model artifact or verified inference schema is connected. The scenario tool below is illustrative only.")
with st.sidebar:
    st.subheader("Scenario inputs")
    tenure = st.slider("Tenure (months)", 1, 72, 18)
    monthly = st.slider("Monthly charges (SAR)", 50, 600, 250, step=10)
    tickets = st.slider("Support tickets", 0, 12, 2)

if st.button("Explore illustrative scenario", type="primary"):
    score = min(.92, max(.05, .48 - tenure * .003 + (monthly - 250) / 1800 + tickets * .025))
    st.metric("Illustrative risk score", f"{score:.0%}")
    st.caption("This is a UI demonstration formula, not a prediction from the project's trained model.")

df = churn_sample()
left,right = st.columns([1.4,1])
with left:
    st.subheader("Customer risk explorer")
    threshold = st.slider("Minimum churn probability", 0.0, 1.0, 0.0, .05)
    filtered = df[df.churn_probability >= threshold].sort_values("churn_probability", ascending=False)
    st.dataframe(filtered, use_container_width=True, hide_index=True)
with right:
    st.subheader("Key customer indicators")
    metric = st.selectbox("Compare by", ["tenure_months","monthly_charges","support_tickets"])
    fig = px.scatter(df, x=metric, y="churn_probability", color="risk_level",
                     color_discrete_map={"Low":"#62A89F","Medium":"#E8B75A","High":"#D96C6C"},
                     labels={"churn_probability":"Illustrative churn probability"})
    st.plotly_chart(apply_layout(fig, 380), use_container_width=True)
