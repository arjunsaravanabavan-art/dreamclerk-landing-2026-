import React from "react";

// =========================================================
// SVG ICON LIBRARY — inline SVGs, no external deps
// All icons 20×20, black by default, fillable
// =========================================================

export function IconNode({ className = "", color = "var(--ink)" }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="8" stroke={color} strokeWidth="2"/>
      <circle cx="10" cy="10" r="2" fill={color}/>
    </svg>
  );
}

export function IconEdge({ className = "", color = "var(--ok)" }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 10L17 10" stroke={color} strokeWidth="2" strokeDasharray="4,4"/>
    </svg>
  );
}

export function IconFile({ className = "", color = "var(--ink)" }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 5V15H16V9L11 4H4Z" stroke={color} strokeWidth="2" stroke-linejoin="round"/>
      <path d="M11 4V9H16" stroke={color} strokeWidth="2" stroke-linejoin="round"/>
    </svg>
  );
}

export function IconCode({ className = "", color = "var(--ok)" }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 6L2 10L5 14" stroke={color} strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15 6L18 10L15 14" stroke={color} strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8 4L12 16" stroke={color} strokeWidth="2" stroke-linecap="round"/>
    </svg>
  );
}

export function IconFolder({ className = "", color = "var(--ok)" }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 6V16H18V8L14 4H6L5 6" stroke={color} strokeWidth="2" stroke-linejoin="round"/>
      <path d="M2 6H6" stroke={color} strokeWidth="2"/>
      <path d="M9 4L10 6" stroke={color} strokeWidth="2"/>
    </svg>
  );
}

export function IconQuestion({ className = "", color = "var(--ok)" }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2C5.6 2 2 5.6 2 10C2 14.4 5.6 18 10 18C14.4 18 18 14.4 18 10C18 5.6 14.4 2 10 2Z" stroke={color} strokeWidth="2"/>
      <path d="M8.5 8C9.3 7.3 10.3 7.2 10.8 7.8" stroke={color} strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8.5 12C9.5 12.7 11.5 12.7 12.5 12" stroke={color} strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  );
}

export function IconTerminal({ className = "", color = "var(--ink)" }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="16" height="12" rx="2" stroke={color} strokeWidth="2"/>
      <path d="M6 10H14" stroke={color} strokeWidth="2" stroke-linecap="round"/>
      <path d="M8 10L6 12L8 8" stroke={color} strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  );
}

export function IconCheck({ className = "", color = "var(--ok)" }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="8" stroke={color} strokeWidth="2"/>
      <path d="M7 10L9 12L13 8" stroke={color} strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  );
}

export function IconDollar({ className = "", color = "var(--ok)" }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="8" stroke={color} strokeWidth="2"/>
      <path d="M10 6V8C11.1 8 12 8.9 12 10C12 11.1 11.1 12 10 12C8.9 12 8 11.1 8 10V8C8 6.9 8.9 6 10 6" stroke={color} strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  );
}

export function IconPadlock({ className = "", color = "var(--ok)" }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 8V6C6 3.8 7.8 2 10 2C12.2 2 14 3.8 14 6V8" stroke={color} strokeWidth="2" stroke-linecap="round"/>
      <path d="M4 8H16V16H4V8Z" stroke={color} strokeWidth="2" stroke-linejoin="round"/>
      <circle cx="10" cy="12" r="1.5" fill={color}/>
    </svg>
  );
}

export function IconRocket({ className = "", color = "var(--ok)" }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2L8 8L2 10L8 12L10 18L12 12L18 10L12 8L10 2Z" stroke={color} strokeWidth="2" stroke-linejoin="round"/>
    </svg>
  );
}

export function IconClock({ className = "", color = "var(--ok)" }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="8" stroke={color} strokeWidth="2"/>
      <path d="M10 6V10L13 13" stroke={color} strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  );
}

export function IconStar({ className = "", color = "var(--ok)" }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2L12.5 7.5L18 8L13.5 12.5L15 18L10 14.5L5 18L6.5 12.5L2 8L7.5 7.5L10 2Z" stroke={color} strokeWidth="2" stroke-linejoin="round"/>
    </svg>
  );
}

export function IconBrush({ className = "", color = "var(--ok)" }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 3L17 6L8 15L5 15L5 12L14 3Z" stroke={color} strokeWidth="2" stroke-linejoin="round"/>
      <path d="M3 17H13" stroke={color} strokeWidth="2" stroke-linecap="round"/>
    </svg>
  );
}

export function IconScale({ className = "", color = "var(--ok)" }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 3V17M4 17H16M4 7H16" stroke={color} strokeWidth="2" stroke-linecap="round"/>
      <path d="M4 7L2 11C2 12.1 2.9 13 4 13C5.1 13 6 12.1 6 11L4 7Z" stroke={color} strokeWidth="2" stroke-linejoin="round"/>
      <path d="M16 7L14 11C14 12.1 14.9 13 16 13C17.1 13 18 12.1 18 11L16 7Z" stroke={color} strokeWidth="2" stroke-linejoin="round"/>
    </svg>
  );
}

export function IconTrend({ className = "", color = "var(--ok)" }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 17L8 11L12 14L17 6" stroke={color} strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M13 6H17V10" stroke={color} strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  );
}

// =========================================================
// VISUAL COMPONENTS
// =========================================================

export function NodeSmall({ n, cmd, className = "" }) {
  return (
    <div className={`node ${className}`}>
      <span className="node-n">[{n}]</span>
      <span className="node-cmd">$ {cmd}</span>
      <style jsx>{`
        .node {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border: 1px solid var(--line);
          border-radius: 4px;
          background: var(--paper);
          font-family: var(--mono);
          font-size: 11px;
        }
        .node-n { color: var(--ok); font-weight: 600; }
        .node-cmd { font-weight: 600; }
      `}</style>
    </div>
  );
}

export function BlockCode({ code, bg = "var(--ink)", color = "var(--paper)" }) {
  return (
    <pre style={{ background: bg, color }}>
      <code>{code}</code>
      <style jsx>{`
        pre {
          padding: 12px;
          border-radius: 6px;
          font-family: var(--mono);
          font-size: 12.5px;
          line-height: 1.5;
          overflow-x: auto;
          white-space: pre;
        }
      `}</style>
    </pre>
  );
}

export function StackPill({ items, className = "" }) {
  return (
    <div className={`stack-pill ${className}`}>
      {items.map((s, i) => (
        <span key={i}>{s}</span>
      ))}
      <style jsx>{`
        .stack-pill {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .stack-pill span {
          padding: 4px 10px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: var(--paper);
          font-family: var(--mono);
          font-size: 12px;
          color: var(--ink);
        }
      `}</style>
    </div>
  );
}

export function ProgressTrack({ pct, max = 100, width = 80, height = 4, className = "" }) {
  const fill = (pct / max) * 100;
  return (
    <div className={`progress ${className}`} style={{ width, height }}>
      <div className="progress-fill" style={{ width: `${fill}%` }} />
      <style jsx>{`
        .progress {
          position: relative;
          background: var(--line);
          border-radius: 999px;
          overflow: hidden;
        }
        .progress-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: var(--ok);
          transition: width 300ms var(--ease-out-expo);
        }
      `}</style>
    </div>
  );
}

export function StatusChip({ status, className = "" }) {
  const statusColor = {
    live: { bg: "rgba(20, 132, 86, 0.12)", color: "#148456" },
    beta: { bg: "rgba(180, 130, 0, 0.12)", color: "#8a5a00" },
  }[status] || { bg: "var(--paper-2)", color: "var(--ink)" };

  return (
    <span className={`status ${className}`} style={statusColor}>
      {status}
    </span>
  );
}

export function ArrowRight({ className = "", color = "var(--ok)" }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 10L16 10" stroke={color} strokeWidth="2" stroke-linecap="round"/>
      <path d="M12 6L16 10L12 14" stroke={color} strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  );
}

export function SurfaceMock({ name, bg = "var(--paper-2)", color = "var(--ink)", width = 80, height = 50, className = "" }) {
  return (
    <div className={`surface ${className}`} style={{ width, height, background: bg, color }}>
      <div className="surface-name">{name}</div>
      <div className="surface-grid" />
      <style jsx>{`
        .surface {
          display: flex;
          flex-direction: column;
          border-radius: 4px;
          overflow: hidden;
          position: relative;
        }
        .surface-name {
          padding: 6px 8px;
          font-size: 11px;
          font-family: var(--mono);
          border-bottom: 1px solid var(--line);
        }
        .surface-grid {
          flex: 1;
          background-image:
            repeating-linear-gradient(0deg, transparent, transparent 1px, var(--line) 1px, var(--line) 1px),
            repeating-linear-gradient(90deg, transparent, transparent 1px, var(--line) 1px, var(--line) 1px);
          opacity: 0.3;
        }
      `}</style>
    </div>
  );
}