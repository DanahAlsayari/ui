import streamlit as st

st.set_page_config(page_title="Customer Intelligence Dashboard", page_icon="📊", layout="wide")

st.markdown("""
<style>
    .block-container {padding-top: 1.8rem; padding-bottom: 2rem;}
    [data-testid="stMetric"] {background: #ffffff; border: 1px solid #e8eaf0; padding: 18px 20px; border-radius: 14px;}
    .hero {padding: 26px 30px; border-radius: 18px; background: linear-gradient(120deg,#16213e,#263f69); color: white; margin-bottom: 22px;}
    .hero h1 {color:white; margin:0; font-size:2rem;}
    .hero p {color:#dce6f7; margin:8px 0 0 0;}
    div[data-testid="stTabs"] button {font-weight:600;}
</style>
""", unsafe_allow_html=True)

st.markdown("""
<div class="hero">
  <h1>Customer Intelligence</h1>
  <p>Executive decision-making through churn predictions, customer segmentation, and AI-powered insights.</p>
</div>
""", unsafe_allow_html=True)

pages = {
    "Executive Overview": "pages/1_Executive_Overview.py",
    "Churn Predictions": "pages/2_Churn_Predictions.py",
    "Customer Segmentation": "pages/3_Customer_Segmentation.py",
    "GenAI Insights": "pages/4_GenAI_Insights.py",
}
st.sidebar.title("Navigation")
st.sidebar.caption("Customer Intelligence Platform")
st.sidebar.info("Use the pages below to explore portfolio health, risk scenarios, customer groups, and strategic recommendations.")
st.sidebar.markdown("**Project status**\n\nUI prototype · Sample data")
st.title("Welcome")
st.write("Choose a workspace from the sidebar to begin exploring the customer portfolio.")
st.subheader("Platform capabilities")
c1,c2,c3 = st.columns(3)
with c1:
    st.markdown("### 🎯 Churn intelligence")
    st.write("Explore churn-risk estimates, confidence indicators, and key factors.")
with c2:
    st.markdown("### 🧩 Customer segments")
    st.write("Understand customer groups through exploratory clustering views.")
with c3:
    st.markdown("### ✨ GenAI insights")
    st.write("Review explainable strategic summaries and recommended actions.")
st.caption("Prototype note: displayed metrics and examples are illustrative until connected to the validated project data and model artifacts.")
