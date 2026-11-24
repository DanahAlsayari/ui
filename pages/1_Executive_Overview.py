import streamlit as st
import plotly.express as px
from utils.sample_data import portfolio_kpis, churn_sample, segment_sample
from utils.charts import apply_layout
from utils.theme import inject_theme, sidebar_brand, page_intro, panel_title

st.set_page_config(page_title="Executive Overview",page_icon="📊",layout="wide")
inject_theme(); sidebar_brand()
page_intro("OVERVIEW","Executive overview","A clear snapshot of portfolio health, customer risk, and segment composition.")
k=portfolio_kpis()
a,b,c,d=st.columns(4)
a.metric("Total customers",f'{k["total_customers"]:,}',"Portfolio size")
b.metric("At-risk customers",f'{k["at_risk"]:,}',"Illustrative")
c.metric("Average churn risk",f'{k["avg_risk"]:.0%}',"Sample score")
d.metric("Customer segments",k["segments"],"Exploratory")
st.write("")
left,right=st.columns([1.25,1],gap="large")
df=churn_sample()
with left:
    with st.container(border=True):
        panel_title("Risk distribution","Customer count by estimated risk band")
        counts=df["risk_level"].value_counts().reindex(["Low","Medium","High"]).reset_index()
        counts.columns=["Risk level","Customers"]
        fig=px.bar(counts,x="Risk level",y="Customers",color="Risk level",text_auto=True,
                   color_discrete_map={"Low":"#8BC9B9","Medium":"#F2C77B","High":"#E78D96"})
        st.plotly_chart(apply_layout(fig,330),use_container_width=True,config={"displayModeBar":False})
with right:
    with st.container(border=True):
        panel_title("Segment composition","Share of customers in each exploratory group")
        seg=segment_sample()
        fig=px.pie(seg,names="segment",values="customers",hole=.7,
                   color_discrete_sequence=["#6C63FF","#A49EFF","#61B8AE","#F0BE72"])
        fig.update_traces(textinfo="percent",textfont_size=12)
        st.plotly_chart(apply_layout(fig,330),use_container_width=True,config={"displayModeBar":False})
with st.container(border=True):
    panel_title("Segment snapshot","A descriptive comparison of the sample groups")
    st.dataframe(seg,use_container_width=True,hide_index=True)
st.caption("Prototype data only. No live model outputs are connected.")
