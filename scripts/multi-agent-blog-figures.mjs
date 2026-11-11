// Blog-column versions of the multi-agent design figures (~680px wide).
// Run: node scripts/multi-agent-blog-figures.mjs
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_CONTENT = path.join(__dirname, "..", "src", "content", "blog", "multi-agent-design")
const OUT_PUBLIC = path.join(__dirname, "..", "public", "blog", "multi-agent-design")
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

const P = {
  chain: { c: "#2563eb", f: "#eef4ff" },
  eval: { c: "#c2410c", f: "#fff1e6" },
  orch: { c: "#7c3aed", f: "#f3edff" },
  route: { c: "#0f766e", f: "#e3f7f4" },
  grey: { c: "#94a3b8", f: "#f8fafc" },
  human: { c: "#b45309", f: "#fff7d6" },
  file: { c: "#475569", f: "#f1f5f9" },
}

const FONT = "ui-sans-serif,system-ui,-apple-system,Segoe UI,Helvetica,Arial,sans-serif"

function kit() {
  let s = ""
  const k = {
    get out() { return s },
    raw(x) { s += x },
    rect(x, y, w, h, o = {}) {
      const fill = o.fill || "#fff"
      const stroke = o.stroke || "#334155"
      const dash = o.dash ? ` stroke-dasharray="${o.dash}"` : ""
      s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 8}" fill="${fill}" stroke="${stroke}" stroke-width="${o.sw || 1.5}"${dash}/>`
    },
    text(x, y, t, o = {}) {
      const color = o.color || "#1e293b"
      const anchor = o.anchor || "middle"
      const italic = o.italic ? ";font-style:italic" : ""
      const mono = o.mono ? ";font-family:ui-monospace,Menlo,Consolas,monospace" : ""
      s += `<text x="${x}" y="${y}" style="font-size:${o.size || 13}px;font-weight:${o.bold ? 700 : o.weight || 500};fill:${color};text-anchor:${anchor}${italic}${mono}">${esc(t)}</text>`
    },
    node(cx, cy, w, h, label, o = {}) {
      k.rect(cx - w / 2, cy - h / 2, w, h, { fill: o.fill, stroke: o.stroke, rx: o.rx ?? 7, dash: o.dash, sw: o.sw })
      const lines = Array.isArray(label) ? label : [label]
      const size = o.size || 12
      const lh = size + 3
      lines.forEach((l, i) => k.text(cx, cy + (i - (lines.length - 1) / 2) * lh + size * 0.35, l, { size, bold: i === 0 && o.bold !== false, color: o.color, weight: 500 }))
    },
    diamond(cx, cy, r, label, o = {}) {
      const fill = o.fill || "#fff"
      const stroke = o.stroke || "#334155"
      s += `<path d="M${cx} ${cy - r}L${cx + r * 1.35} ${cy}L${cx} ${cy + r}L${cx - r * 1.35} ${cy}Z" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`
      const lines = Array.isArray(label) ? label : [label]
      lines.forEach((l, i) => k.text(cx, cy + 4 + (i - (lines.length - 1) / 2) * 13, l, { size: 11, bold: i === 0, color: o.color }))
    },
    arrow(pts, o = {}) {
      const d = pts.map((p, i) => (i ? "L" : "M") + p[0] + " " + p[1]).join(" ")
      const color = o.color || "#334155"
      const dash = o.dash ? ` stroke-dasharray="${o.dash}"` : ""
      s += `<path d="${d}" fill="none" stroke="${color}" stroke-width="${o.w || 1.5}"${dash} marker-end="url(#ah)"/>`
    },
    path(d, o = {}) {
      const color = o.color || "#334155"
      const dash = o.dash ? ` stroke-dasharray="${o.dash}"` : ""
      const arrow = o.arrow ? ' marker-end="url(#ah)"' : ""
      s += `<path d="${d}" fill="none" stroke="${color}" stroke-width="${o.w || 1.5}"${dash}${arrow}/>`
    },
    badge(cx, cy, t, col, solid) {
      const w = Math.min(t.length * 7.2 + 22, 200)
      k.rect(cx - w / 2, cy - 12, w, 24, { rx: 12, fill: solid ? col : "#fff", stroke: col, sw: 1.5, dash: solid ? null : "5 4" })
      k.text(cx, cy + 4, t, { size: 11, bold: true, color: solid ? "#fff" : col })
    },
  }
  return k
}

function wrapSvg(W, H, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" style="font-family:${FONT}">
<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="context-stroke"/></marker></defs>
<rect width="${W}" height="${H}" fill="#fff"/>
${body}</svg>`
}

function figPatterns() {
  const W = 680
  const k = kit()
  const cards = [
    { key: "chain", name: "Prompt chaining", def: "Fixed steps in order, with a check between steps",
      here: ["The backbone. Gate → substance → line → figures → gate → series:", "each stage starts only when the one before it passes."],
      badge: "USED", solid: true },
    { key: "eval", name: "Evaluator–optimizer", def: "One model drafts, another critiques, and they loop",
      here: ["Every editor. The writer revises until the editor returns", "SATISFIED, for at most three rounds."],
      badge: "USED", solid: true },
    { key: "orch", name: "Orchestrator–workers", def: "A lead model hands subtasks to workers",
      here: ["The writer starts each editor as a cold subagent. The roster", "is fixed in a file, never chosen at runtime."],
      badge: "USED, FIXED ROSTER", solid: true },
    { key: "route", name: "Routing", def: "Classify the input and send it down one path",
      here: ["Not really. Scripts count and models judge, but that split", "is decided in advance, not per input."],
      badge: "NOT USED", solid: false },
    { key: "par", name: "Parallelization", def: "Run several models at once; split the work, or vote",
      here: ["Not used. Editors run one after another, because later editors", "polish text that earlier ones may rewrite."],
      badge: "NOT USED", solid: false },
  ]

  k.text(24, 32, "Five workflow patterns, and the three this system uses", { size: 18, bold: true, anchor: "start", color: "#0f172a" })
  k.text(24, 54, "Solid cards are used; dashed grey cards are not.", { size: 12, anchor: "start", color: "#475569" })

  let y = 72
  const x = 16
  const cw = W - 32

  cards.forEach((cd) => {
    const used = cd.solid
    const p = used ? P[cd.key] : P.grey
    const ch = 168
    k.rect(x, y, cw, ch, { fill: used ? "#fff" : "#fbfcfd", stroke: p.c, sw: used ? 2.5 : 1.5, rx: 10, dash: used ? null : "8 6" })
    k.rect(x, y, cw, 34, { fill: p.c, stroke: p.c, rx: 10 })
    k.rect(x, y + 20, cw, 14, { fill: p.c, stroke: p.c, rx: 0 })
    k.text(x + 14, y + 22, cd.name, { size: 14, bold: true, color: "#fff", anchor: "start" })
    const bw = Math.min(cd.badge.length * 7.2 + 18, 150)
    k.rect(x + cw - bw - 10, y + 6, bw, 22, { rx: 11, fill: "rgba(255,255,255,0.18)", stroke: "#fff", sw: 1.2 })
    k.text(x + cw - bw / 2 - 10, y + 21, cd.badge, { size: 10, bold: true, color: "#fff" })

    k.text(x + 14, y + 54, cd.def, { size: 12, color: "#475569", anchor: "start" })

    // compact mini flow on the left
    const mx = x + 90
    const my = y + 92
    const lc = used ? "#334155" : "#94a3b8"
    const N = (cx, cy, l, w = 72) => k.node(cx, cy, w, 22, l, { fill: p.f, stroke: p.c, color: used ? "#0f172a" : "#64748b", size: 10, bold: false })
    if (cd.key === "chain") {
      N(mx - 50, my, "step 1", 58); k.arrow([[mx - 20, my], [mx + 8, my]], { color: lc, w: 1.2 })
      k.diamond(mx + 28, my, 14, "gate", { stroke: p.c, fill: "#fff" })
      k.arrow([[mx + 48, my], [mx + 76, my]], { color: lc, w: 1.2 })
      N(mx + 108, my, "step 2", 58)
      k.arrow([[mx + 138, my], [mx + 166, my]], { color: lc, w: 1.2 })
      N(mx + 198, my, "step 3", 58)
    } else if (cd.key === "eval") {
      N(mx, my - 14, "generator", 78)
      N(mx + 110, my + 14, "evaluator", 78)
      k.path(`M${mx + 40} ${my - 14} H${mx + 110} V${my + 2}`, { color: p.c, arrow: true, w: 1.2 })
      k.path(`M${mx + 70} ${my + 14} H${mx} V${my - 2}`, { color: p.c, arrow: true, w: 1.2 })
      k.text(mx + 175, my, "loop ≤ 3", { size: 10, color: p.c, anchor: "start" })
    } else if (cd.key === "orch") {
      N(mx, my, "orchestrator", 90)
      ;[0, 1, 2].forEach((i) => {
        const wx = mx + 130 + i * 58
        k.arrow([[mx + 46, my], [wx, my]], { color: p.c, dash: "5 4", w: 1.2 })
        N(wx, my, "w", 36)
      })
    } else if (cd.key === "route") {
      k.diamond(mx, my, 14, "router", { stroke: p.c })
      ;[-1, 0, 1].forEach((i) => {
        const py = my + i * 22
        k.arrow([[mx + 20, my], [mx + 48, py], [mx + 70, py]], { color: lc, w: 1.1 })
        N(mx + 108, py, "path", 48)
      })
    } else if (cd.key === "par") {
      ;[-1, 0, 1].forEach((i) => {
        const py = my + i * 22
        N(mx + 40, py, "LLM", 48)
        k.arrow([[mx + 64, py], [mx + 120, my]], { color: lc, w: 1.1 })
      })
      N(mx + 168, my, "aggregate", 78)
    }

    k.text(x + 14, y + 128, "IN THIS SYSTEM", { size: 10, bold: true, color: used ? p.c : "#64748b", anchor: "start" })
    cd.here.forEach((l, j) => k.text(x + 14, y + 146 + j * 14, l, { size: 11.5, color: used ? "#1e293b" : "#64748b", anchor: "start" }))
    y += ch + 12
  })

  return { W, H: y + 8, body: k.out }
}

function figWorkflow() {
  const W = 680
  const k = kit()
  const X = 340
  let y = 70

  k.text(24, 28, "How each guide moves through review", { size: 18, bold: true, anchor: "start", color: "#0f172a" })
  k.text(24, 48, "One writer, eleven cold editors, two script gates, two human decisions.", { size: 12, anchor: "start", color: "#475569" })

  const human = (cy, lines) => k.node(X, cy, 280, 44, lines, { fill: P.human.f, stroke: P.human.c, rx: 22, size: 12 })
  const writer = (cy, lines) => k.node(X, cy, 300, 44, lines, { fill: P.orch.f, stroke: P.orch.c, size: 12 })
  const gate = (cy, lines) => k.diamond(X, cy, 28, lines, { stroke: P.route.c, fill: P.route.f })
  const down = (y1, y2) => k.arrow([[X, y1], [X, y2]], { w: 1.4 })
  const note = (x, yy, lines, col) => lines.forEach((l, i) => k.text(x, yy + i * 13, l, { size: 10.5, color: col, anchor: "start" }))

  const editors = (cy, title, eds) => {
    const n = eds.length
    const w = Math.min(86, Math.floor((W - 80) / n) - 6)
    const gap = 6
    const gw = n * w + (n - 1) * gap + 20
    const gx = X - gw / 2
    const h = 88
    k.rect(gx, cy - 36, gw, h, { fill: "#fff", stroke: "#cbd5e1", rx: 8, dash: "4 4" })
    k.text(gx + 10, cy - 20, title, { size: 10.5, bold: true, anchor: "start", color: "#475569" })
    eds.forEach((e, i) => {
      const cx = gx + 10 + i * (w + gap) + w / 2
      k.node(cx, cy + 14, w, 36, e.split("|"), { fill: P.eval.f, stroke: P.eval.c, size: 10, bold: false })
    })
    return { bottom: cy - 36 + h }
  }

  // legend
  const leg = [[P.human, "Author"], [P.orch, "Writer"], [P.route, "Gate"], [P.eval, "Editor"], [P.file, "Files"]]
  let lx = 24
  leg.forEach(([p, a]) => {
    k.rect(lx, y - 8, 14, 14, { fill: p.f, stroke: p.c, rx: 3, sw: 1.3 })
    k.text(lx + 20, y + 3, a, { size: 11, anchor: "start", color: "#0f172a" })
    lx += 20 + a.length * 6.8 + 16
  })
  y += 28

  human(y, ["Author writes the brief,", "approves the outline"])
  down(y + 22, y + 42); y += 58

  writer(y, ["Writer drafts", "every code block really run"])
  note(X + 160, y - 8, ["reads notation,", "glossary, ledger"], P.file.c)
  const draftY = y
  down(y + 22, y + 42); y += 64

  gate(y, ["gate", "check"])
  note(X + 50, y - 10, ["length, rhythm,", "code rerun"], P.route.c)
  k.path(`M${X - 38} ${y} H${X - 120} V${draftY} H${X - 152}`, { color: P.route.c, dash: "5 4", arrow: true, w: 1.2 })
  k.text(X - 128, (y + draftY) / 2, "fail", { size: 10, color: P.route.c, anchor: "end" })
  down(y + 30, y + 50); y += 78

  let b = editors(y, "SUBSTANCE — fix what is said", ["code", "accuracy", "currency", "miscon-|ceptions", "complete-|ness"])
  down(b.bottom + 2, b.bottom + 22); y = b.bottom + 48

  b = editors(y, "LINE AND FIGURES — then how it is said", ["conver-|sational", "slop", "figures"])
  down(b.bottom + 2, b.bottom + 22); y = b.bottom + 52

  gate(y, ["gate", "again"])
  note(X + 50, y - 6, ["same checks on", "the revised draft"], P.route.c)
  down(y + 30, y + 50); y += 78

  b = editors(y, "SERIES — agree with the other eleven?", ["consis-|tency", "simplif.|ledger", "running|example"])
  note(X + 175, y - 6, ["updates series", "files"], P.file.c)
  down(b.bottom + 2, b.bottom + 22); y = b.bottom + 48

  writer(y, ["Writer writes the summary", "rounds, verdicts, open findings"])
  down(y + 22, y + 42); y += 58

  human(y, ["Author decides", "whether to publish"])
  y += 50

  // writer / files callouts
  k.rect(16, y, W - 32, 78, { fill: P.orch.f, stroke: P.orch.c, rx: 8, sw: 1.5 })
  k.text(28, y + 20, "THE WRITER", { size: 11, bold: true, color: P.orch.c, anchor: "start" })
  k.text(28, y + 38, "One agent drafts, starts each editor cold (file paths in, verdict out), arbitrates findings,", { size: 11, color: "#1e293b", anchor: "start" })
  k.text(28, y + 54, "and never marks a guide as shipped. Editors advise; the writer arbitrates; the author decides.", { size: 11, color: "#1e293b", anchor: "start" })
  y += 90

  k.rect(16, y, W - 32, 92, { fill: P.file.f, stroke: P.file.c, rx: 8, sw: 1.5 })
  k.text(28, y + 20, "SERIES FILES — memory across conversations", { size: 11, bold: true, color: P.file.c, anchor: "start" })
  k.text(28, y + 40, "briefs · notation.md · glossary.md · concepts.md · ledger.md · running-example.md · editors/*.md", { size: 10.5, color: "#334155", anchor: "start", mono: true })
  k.text(28, y + 58, "The ledger records simplifications and where they are later repaid. A stale glossary propagates", { size: 11, color: "#1e293b", anchor: "start" })
  k.text(28, y + 74, "errors as efficiently as a current one prevents them.", { size: 11, color: "#1e293b", anchor: "start" })
  y += 104

  k.rect(16, y, W - 32, 86, { fill: "#fff", stroke: "#e2e8f0", rx: 8 })
  k.text(28, y + 20, "STOP RULES", { size: 11, bold: true, color: P.eval.c, anchor: "start" })
  k.text(28, y + 38, "SATISFIED = no HIGH findings and at most two MEDIUM. Loop ≤ 3 rounds; open findings go to the author.", { size: 10.5, color: "#1e293b", anchor: "start" })
  k.text(28, y + 54, "Order is enforced by instructions and the files each stage leaves behind — only the gate is code.", { size: 10.5, color: "#1e293b", anchor: "start" })
  k.text(28, y + 70, "Across 12 guides: 131 first-round reviews, ~200 editor rounds, all sequential.", { size: 10.5, color: "#1e293b", anchor: "start" })
  y += 98

  return { W, H: y, body: k.out }
}

for (const [name, fig] of [
  ["multi-agent-design-fig1", figPatterns()],
  ["multi-agent-design-fig2", figWorkflow()],
]) {
  const svg = wrapSvg(fig.W, fig.H, fig.body)
  for (const dir of [OUT_CONTENT, OUT_PUBLIC]) {
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, `${name}.svg`), svg)
  }
  console.log(`wrote ${name}.svg ${fig.W}x${fig.H}`)
}
