import streamlit as st
import plotly.express as px
from utils.sample_data import segment_sample
from utils.charts import apply_layout
from utils.theme import inject_theme, sidebar_brand, page_intro, panel_title

st.set_page_config(page_title="Customer segments",page_icon="🧩",layout="wide")
inject_theme(); sidebar_brand()
page_intro("CUSTOMER GROUPS","Customer segments","Explore group sizes and compare descriptive characteristics.")
st.info("Exploratory preview · Project clustering metrics show weak separation, so these groups are not validated customer personas.")
df=segment_sample()
selected=st.multiselect("Select segments",df.segment.tolist(),default=df.segment.tolist())
view=df[df.segment.isin(selected)]
a,b=st.columns(2,gap="large")
with a:
    with st.container(border=True):
        panel_title("Segment size","Number of customers in each selected group")
        fig=px.bar(view,x="segment",y="customers",color="segment",text_auto=True,
                   color_discrete_sequence=["#6C63FF","#A49EFF","#61B8AE","#F0BE72"])
        st.plotly_chart(apply_layout(fig,330),use_container_width=True,config={"displayModeBar":False})
with b:
    with st.container(border=True):
        panel_title("Average monthly charges","Descriptive comparison in SAR")
        fig=px.bar(view,x="segment",y="avg_monthly_charges",color="segment",text_auto=True,
                   color_discrete_sequence=["#6C63FF","#A49EFF","#61B8AE","#F0BE72"])
        st.plotly_chart(apply_layout(fig,330),use_container_width=True,config={"displayModeBar":False})
with st.container(border=True):
    panel_title("Segment profile","Compare the selected groups side by side")
    st.dataframe(view,use_container_width=True,hide_index=True)
