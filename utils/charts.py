import plotly.express as px

def apply_layout(fig, height=340):
    fig.update_layout(
        height=height, margin=dict(l=12,r=12,t=24,b=12),
        paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)",
        font=dict(family="DM Sans, Arial",color="#778197",size=11),
        legend_title_text="", hoverlabel=dict(bgcolor="#202A40",font_color="white"),
    )
    fig.update_xaxes(showgrid=False,zeroline=False,linecolor="#EEF0F5")
    fig.update_yaxes(showgrid=True,gridcolor="#F0F1F6",zeroline=False)
    return fig
