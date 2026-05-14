# Architecture Topology Quality Checklist

Use this checklist before reporting that an architecture system topology HTML
project is complete.

## Architecture Coverage

- Every user-provided system, service, cluster, middleware, storage, CI/CD tool,
  external system, or environment appears as a node, group, or explicit note.
- System boundaries and architecture groups are visible: service center,
  middleware, storage, CI/CD, external systems, or project-specific equivalents.
- Concrete business workflows are represented with labeled arrows when provided.
- If no concrete business workflow is provided, the graph clearly states that
  business flow is omitted and only structure topology / technical dependencies
  are shown.
- Any inferred component, dependency, or business arrow is marked in
  `flow-plan.md` as an assumption.

## Graph Correctness

- Every edge references existing nodes.
- Every edge has a meaningful label: protocol, dependency, call type, message
  action, data action, or business meaning.
- Structure topology and business logic are not mixed ambiguously:
  groups show structure; arrows show dependency, call, data flow, message flow,
  deployment flow, or business process.
- Business arrows are only added when supported by user material or clearly
  marked assumptions.
- Decision/gateway nodes have labeled exits when used.
- Branches either rejoin intentionally or end at a clear terminal/storage/node.
- There are no duplicate node ids or edge ids.

## Node Layout

- Architecture frames are LogicFlow `group-node` nodes, not HTML/CSS
  backgrounds outside the graph.
- `group-node` frames sit below component nodes, serialize in graph JSON, zoom
  with the canvas, and are included in exported images.
- `group-node` titles are top-centered and do not overlap component nodes.
- Every component node is inside its corresponding top-level architecture frame
  with readable padding.
- Architecture frames do not overlap each other.
- Component nodes do not overlap each other or sit too close to control-plane
  nodes such as registry/config/gateway nodes.
- Edge labels are offset from horizontal arrows and component nodes when needed;
  labels remain readable and are not pierced by arrow lines.
- Edge labels that must survive zoom and image export are represented as real
  LogicFlow/SVG graph data, not HTML-only overlays. For dense topology diagrams,
  prefer dedicated label nodes such as `edge-label-node` with `role=edge-label`.
- Edge label nodes sit above edges, have no anchors, use a flat light background
  with no drop shadow, and do not duplicate visible edge text.
- If component coordinates are changed, related architecture frame size/position
  is rechecked; if frame size/position changes, frame overlap is rechecked.

## Readability

- Node text is short enough to read without zooming.
- Long explanations are in `properties.prompt` or `properties.note`.
- Dense systems are grouped by architecture domain instead of a single tangled
  line.
- Related services are visually close to their group: service center,
  middleware, storage, CI/CD, external systems.
- Main topology is visually obvious; business arrows and exception paths do not
  overpower structure.
- Edge crossings are minimized. If crossings cannot be avoided, split into
  overview and detailed business-flow diagrams.

## HTML Project

- `src/data/flowTemplate.js` contains the final graph, not placeholder data.
- `FLOW_METADATA` matches the user request.
- Topbar title and subtitle are domain-specific.
- Left node library contains useful architecture node templates for the user's
  domain.
- Browser edits update the current graph JSON / runtime `getGraphData()`.
- Reset restores the preserved source graph, not the last edited graph.
- Undo and redo are wired to LogicFlow history and keep Graph JSON in sync.
- Export image button works through LogicFlow Snapshot and exports the current
  LogicFlow graph, including architecture `group-node` frames, edited node
  positions, arrows, and labels.
- Exported images are visually checked for label content. If labels disappear
  from export or drift during zoom, replace HTML overlay labels with real graph
  label nodes and clear the edge's visible text.

## Verification

- Run `npm run lint`.
- Run `npm run build`.
- Start `npm run dev` when the user needs to preview locally.
- If a command cannot run because dependencies are missing or network is
  blocked, state that clearly and provide the exact next command.
