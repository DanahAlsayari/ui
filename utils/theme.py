import streamlit as st

def inject_theme():
    st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
    :root { --ink:#172033; --muted:#778197; --purple:#6C63FF; --line:#E9ECF3; --surface:#FFFFFF; }
    html, body, [class*="css"] { font-family:'DM Sans',sans-serif; color:var(--ink); }
    .stApp { background:#F6F7FB; }
    [data-testid="stHeader"] { background:transparent; }
    .block-container { max-width:1440px; padding:2.1rem 3.1rem 3.5rem; }
    [data-testid="stSidebar"] { background:#fff; border-right:1px solid #ECEEF4; }
    [data-testid="stSidebar"] > div:first-child { padding:1.5rem 1rem; }
    [data-testid="stSidebarNav"] { padding-top:1rem; }
    [data-testid="stSidebarNav"] a { border-radius:10px; margin:4px 0; padding:10px 13px; font-weight:600; }
    [data-testid="stSidebarNav"] a[aria-current="page"] { background:#F0EFFF; color:#5B52E8; }
    h1,h2,h3 { font-family:'Plus Jakarta Sans',sans-serif; letter-spacing:-.035em; color:#172033; }
    h1 { font-size:2rem !important; font-weight:800 !important; }
    h2 { font-size:1.22rem !important; font-weight:700 !important; }
    h3 { font-size:1rem !important; font-weight:700 !important; }
    p, label, .stCaption { color:#69748A; }
    [data-testid="stMetric"] { background:#fff; border:1px solid var(--line); border-radius:16px; padding:19px 20px; box-shadow:0 3px 12px rgba(26,36,64,.025); }
    [data-testid="stMetricLabel"] p { color:#7D879A; font-size:.82rem; font-weight:600; }
    [data-testid="stMetricValue"] { color:#182238; font-family:'Plus Jakarta Sans',sans-serif; font-size:1.8rem; font-weight:800; }
    [data-testid="stMetricDelta"] { font-size:.78rem; }
    div[data-testid="stVerticalBlockBorderWrapper"] { background:#fff; border:1px solid var(--line); border-radius:17px; }
    .stButton > button { border-radius:10px; font-weight:700; border:1px solid #E6E8F0; padding:.58rem 1rem; }
    .stButton > button[kind="primary"] { background:#665CF6; border-color:#665CF6; color:white; }
    .stButton > button[kind="primary"]:hover { background:#5147DF; border-color:#5147DF; }
    .stSelectbox div[data-baseweb="select"] > div, .stTextInput input, .stNumberInput input { border-radius:10px; }
    [data-testid="stDataFrame"] { border:1px solid var(--line); border-radius:12px; overflow:hidden; }
    [data-testid="stAlert"] { border-radius:12px; }
    hr { border-color:#ECEEF4; }
    .eyebrow { text-transform:uppercase; letter-spacing:.13em; color:#817AF7; font-size:.7rem; font-weight:800; margin-bottom:.45rem; }
    .page-subtitle { color:#7B8497; font-size:.96rem; margin-top:-.45rem; margin-bottom:1.5rem; }
    .brand { display:flex; align-items:center; gap:10px; padding:4px 8px 22px; }
    .brand-mark { width:36px; height:36px; border-radius:12px; display:grid; place-items:center; color:white; font-weight:800; background:linear-gradient(135deg,#776DFF,#4E48D9); box-shadow:0 5px 14px #6c63ff44; }
    .brand-name { font-family:'Plus Jakarta Sans'; font-weight:800; color:#1D2740; font-size:1rem; }
    .hero { border-radius:20px; padding:28px 30px; color:white; background:linear-gradient(115deg,#24234B 0%,#4944A6 58%,#746BFA 100%); position:relative; overflow:hidden; margin:8px 0 24px; }
    .hero h2 { color:white; font-size:1.55rem !important; margin:0 0 8px; }
    .hero p { color:#E3E2FF; margin:0; max-width:660px; }
    .hero-tag { display:inline-block; padding:5px 10px; border:1px solid #ffffff44; border-radius:30px; color:#F1F0FF; font-size:.72rem; margin-bottom:13px; }
    .section-kicker { color:#929BAD; text-transform:uppercase; letter-spacing:.1em; font-size:.68rem; font-weight:800; margin-bottom:5px; }
    .insight-card { background:#fff; border:1px solid #E9ECF3; border-radius:16px; padding:18px 20px; min-height:125px; }
    .insight-icon { font-size:1.35rem; margin-bottom:10px; }
    .insight-title { font-weight:800; color:#202A40; margin-bottom:5px; }
    .insight-copy { font-size:.84rem; line-height:1.55; color:#7B8497; }
    @media(max-width:900px) { .block-container { padding:1.3rem 1rem 2rem; } }
    </style>
    """, unsafe_allow_html=True)

def sidebar_brand():
    st.sidebar.markdown('<div class="brand"><div class="brand-mark">C</div><div class="brand-name">Customerly</div></div>', unsafe_allow_html=True)
    st.sidebar.caption("CUSTOMER INTELLIGENCE")
    st.sidebar.markdown("---")

def page_intro(eyebrow, title, subtitle):
    st.markdown(f'<div class="eyebrow">{eyebrow}</div>', unsafe_allow_html=True)
    st.title(title)
    st.markdown(f'<div class="page-subtitle">{subtitle}</div>', unsafe_allow_html=True)

def panel_title(title, caption=None):
    st.markdown(f'<div style="font-family:Plus Jakarta Sans;font-weight:800;font-size:1.02rem;color:#202A40;margin:0 0 3px">{title}</div>', unsafe_allow_html=True)
    if caption:
        st.caption(caption)
