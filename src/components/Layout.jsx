import React from "react";
import {
  Activity,
  ArrowUpRight,
  BrainCircuit,
  LayoutDashboard,
  Sparkles,
  Users,
} from "lucide-react";
import { projectName } from "../data";

// Keep the navigation configuration in one place so labels and icons stay consistent.
export const sections = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "predictions", label: "Churn prediction", icon: Activity },
  { id: "segments", label: "Customer segments", icon: Users },
  { id: "genai", label: "GenAI recommendations", icon: Sparkles },
];

// Brand mark and project name displayed at the top of the sidebar.
function Brand() {
  return (
    <div className="brand">
      <div className="brand-mark">
        <BrainCircuit size={22} strokeWidth={1.9} />
      </div>
      <div>
        <div className="brand-name">CCO<span>.</span></div>
        <div className="brand-caption">RETAIL INTELLIGENCE</div>
      </div>
    </div>
  );
}

// Shared sidebar used by every dashboard page.
export function Sidebar({ page, setPage }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <Brand />
      </div>

      <nav className="simple-nav">
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${page === id ? "nav-active" : ""}`}
            onClick={() => setPage(id)}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-project">{projectName}</div>
    </aside>
  );
}

// Reusable title block that gives all pages the same visual hierarchy.
export function PageHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="page-heading">
      <div>
  
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

// Reusable KPI cards shown on the overview page.
export function StatCards({ items }) {
  const icons = [Users, Activity, LayoutDashboard, LayoutDashboard];
  const tones = ["violet", "rose", "mint", "amber"];

  return (
    <section className="stats-grid">
      {items.map((item, index) => {
        const Icon = icons[index % icons.length];

        return (
          <article className="stat-card" key={item.label}>
            <div className="stat-top">
              <span>{item.label}</span>
              <div className={`stat-icon ${tones[index % tones.length]}`}>
                <Icon size={17} />
              </div>
            </div>
            <div className="stat-value-row">
              <strong>{item.value}</strong>
            </div>
            <small>{item.note}</small>
          </article>
        );
      })}
    </section>
  );
}

// Shared inline notice for important model and data limitations.
export function Notice({ children }) {
  return <div className="notice">{children}</div>;
}
