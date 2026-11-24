import streamlit as st
from utils.theme import inject_theme, sidebar_brand
from utils.sample_data import portfolio_kpis, churn_sample, segment_sample
from utils.charts import apply_layout
import plotly.express as px

st.set_page_config(page_title="Customerly | Overview", page_icon="✦", layout="wide", initial_sidebar_state="expanded")
inject_theme()
sidebar_brand()
st.sidebar.markdown("**Workspace**")
st.sidebar.caption("Executive analytics")
st.sidebar.markdown("---")
st.sidebar.markdown("**Prototype preview**")
st.sidebar.caption("Sample data · Not connected to live models")

st.markdown('<div class="eyebrow">CUSTOMER INTELLIGENCE PLATFORM</div>', unsafe_allow_html=True)
st.title("Good evening 👋")
st.markdown('<div class="page-subtitle">Here’s your customer portfolio at a glance.</div>', unsafe_allow_html=True)
st.markdown("""
<div class="hero">
  <div class="hero-tag">✦ &nbsp; EXECUTIVE WORKSPACE</div>
  <h2>Make smarter decisions.<br>Understand every customer.</h2>
  <p>Bring churn signals, customer segments, and AI-powered explanations together in one clear view.</p>
</div>
""", unsafe_allow_html=True)

k=portfolio_kpis()
a,b,c,d=st.columns(4)
a.metric("Total customers",f'{k["total_customers"]:,}', "Portfolio size")
b.metric("At-risk customers",f'{k["at_risk"]:,}', "Needs attention")
c.metric("Average churn risk",f'{k["avg_risk"]:.0%}', "Illustrative score")
d.metric("Customer segments",k["segments"], "Exploratory groups")

st.write("")
left,right=st.columns([1.25,1], gap="large")
df=churn_sample()
with left:
    with st.container(border=True):
        from utils.theme import panel_title
        panel_title("Churn risk overview","Distribution across the sample customer portfolio")
        counts=df["risk_level"].value_counts().reindex(["Low","Medium","High"]).reset_index()
        counts.columns=["Risk level","Customers"]
        fig=px.bar(counts,x="Risk level",y="Customers",color="Risk level",text_auto=True,
                   color_discrete_map={"Low":"#8BC9B9","Medium":"#F2C77B","High":"#E78D96"})
        st.plotly_chart(apply_layout(fig,310),use_container_width=True,config={"displayModeBar":False})
with right:
    with st.container(border=True):
        panel_title("Customer segments","Illustrative segment mix")
        seg=segment_sample()
        fig=px.pie(seg,names="segment",values="customers",hole=.72,
                   color_discrete_sequence=["#6C63FF","#A49EFF","#61B8AE","#F0BE72"])
        fig.update_traces(textinfo="percent",textfont_size=12)
        st.plotly_chart(apply_layout(fig,310),use_container_width=True,config={"displayModeBar":False})

st.markdown('<div class="section-kicker">EXPLORE THE WORKSPACE</div>',unsafe_allow_html=True)
x,y,z=st.columns(3)
for col,icon,title,copy in [
    (x,"🎯","Churn predictions","Explore risk patterns and customer-level scenarios."),
    (y,"🧩","Customer segments","Compare group sizes and behavioral profiles."),
    (z,"✦","GenAI insights","Turn signals into clear strategic recommendations.")
]:
    with col:
        st.markdown(f'<div class="insight-card"><div class="insight-icon">{icon}</div><div class="insight-title">{title}</div><div class="insight-copy">{copy}</div></div>',unsafe_allow_html=True)
st.caption("Design prototype · All displayed values are illustrative sample data.")
