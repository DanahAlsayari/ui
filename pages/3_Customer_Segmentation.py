import streamlit as st
import plotly.express as px
from utils.sample_data import segment_sample
from utils.charts import apply_layout

st.set_page_config(page_title="Customer Segmentation", page_icon="🧩", layout="wide")
st.title("Customer Segmentation")
st.caption("Explore the size and descriptive characteristics of customer groups.")

st.warning("Prototype sample only. The project's clustering evaluation indicates weak cluster separation; segments should be treated as exploratory, not validated customer personas.")
df = segment_sample()
selected = st.multiselect("Segments to display", df.segment.tolist(), default=df.segment.tolist())
view = df[df.segment.isin(selected)]
a,b = st.columns(2)
with a:
    st.subheader("Segment size")
    fig = px.bar(view, x="segment", y="customers", color="segment")
    st.plotly_chart(apply_layout(fig), use_container_width=True)
with b:
    st.subheader("Average monthly charges")
    fig = px.bar(view, x="segment", y="avg_monthly_charges", color="segment")
    st.plotly_chart(apply_layout(fig), use_container_width=True)
st.subheader("Segment profile comparison")
st.dataframe(view, use_container_width=True, hide_index=True)
