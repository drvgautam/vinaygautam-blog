/** @jsxImportSource react */


import { useState } from "react"

// Shared shell for stepped figures: pill navigation above, one SVG below.
// Pills carry data-step so editors/scripts/figures-capture.mjs can find them.
export function Stepped({ labels, children }) {
  const [step, setStep] = useState(0)
  return (
    <div>
      <div role="tablist" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
        {labels.map((label, i) => (
          <button
            key={label}
            type="button"
            role="tab"
            data-step={i + 1}
            aria-selected={i === step}
            onClick={() => setStep(i)}
            style={{
              font: "inherit",
              fontSize: 13,
              padding: "2px 12px",
              borderRadius: 999,
              border: "1px solid currentColor",
              cursor: "pointer",
              color: i === step ? "Canvas" : "inherit",
              background: i === step ? "CanvasText" : "transparent",
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {children(step)}
    </div>
  )
}

// Arrowhead marker shared by every figure; `id` must be unique per SVG.
export function ArrowDefs({ id }) {
  return (
    <defs>
      <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
      </marker>
    </defs>
  )
}

export const ink = { stroke: "currentColor", fill: "none", strokeWidth: 1.5 }
export const label = { fill: "currentColor", fontSize: 13, textAnchor: "middle" }
