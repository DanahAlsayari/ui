import streamlit as st
import plotly.express as px
from utils.sample_data import portfolio_kpis, churn_sample, segment_sample
from utils.charts import apply_layout

st.set_page_config(page_title="Executive Overview", page_icon="📊", layout="wide")
st.title("Executive Overview")
st.caption("A high-level view of portfolio health and customer risk.")

k = portfolio_kpis()
a,b,c,d = st.columns(4)
a.metric("Total customers", f'{k["total_customers"]:,}')
b.metric("At-risk customers", f'{k["at_risk"]:,}', delta="Illustrative")
c.metric("Average churn risk", f'{k["avg_risk"]:.0%}')
d.metric("Customer segments", k["segments"])

left,right = st.columns([1.35,1])
df = churn_sample()
with left:
    st.subheader("Churn risk distribution")
    risk_counts = df["risk_level"].value_counts().reindex(["Low","Medium","High"]).reset_index()
    risk_counts.columns = ["Risk level","Customers"]
    fig = px.bar(risk_counts, x="Risk level", y="Customers", color="Risk level",
                 color_discrete_map={"Low":"#62A89F","Medium":"#E8B75A","High":"#D96C6C"})
    st.plotly_chart(apply_layout(fig), use_container_width=True)
with right:
    st.subheader("Customer segments")
    seg = segment_sample()
    fig = px.pie(seg, names="segment", values="customers", hole=.62)
    st.plotly_chart(apply_layout(fig), use_container_width=True)

st.subheader("Portfolio snapshot")
st.dataframe(seg, use_container_width=True, hide_index=True)
st.info("All figures on this page are prototype sample data and are not live model outputs.")
