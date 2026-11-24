import plotly.express as px

def apply_layout(fig, height=340):
    fig.update_layout(
        height=height,
        margin=dict(l=12, r=12, t=35, b=12),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(family="Arial", color="#364152"),
        legend_title_text="",
    )
    return fig
