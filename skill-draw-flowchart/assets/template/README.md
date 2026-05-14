# Architecture Topology HTML Template

LogicFlow + React + Vite template for generating an editable architecture
system topology HTML page. Use groups/layout for structure and labeled arrows
for service calls, dependencies, data flow, message flow, deployment flow, and
business logic.

The default page is a hybrid **architecture diagram + process-flow diagram**:
large LogicFlow container nodes show system topology, while labeled arrows show
supported business or technical flows. Container nodes participate in zoom,
JSON editing, drag/resize, and image export.

## Prepare

```powershell
.\scripts\prepare-template.ps1
```

or:

```powershell
npm run setup
```

On Windows cmd:

```cmd
scripts\prepare-template.cmd
```

The script runs `npm ci` from this template directory and recreates `node_modules` from `package-lock.json`.

## Develop

```powershell
npm run dev
```

Edit the default diagram in:

```text
src/data/flowTemplate.js
```

Key exports:

- `FLOW_METADATA`: title, description, and reading guide.
- `TOPOLOGY_GROUPS`: architecture zone descriptions for the side panel.
- `STEP_TYPES`: draggable architecture component templates.
- `INITIAL_GRAPH`: default container nodes, component nodes, and labeled arrows.

Runtime helper:

```js
window.TopologyTemplate.getGraphData()
window.TopologyTemplate.getSourceGraphData()
window.TopologyTemplate.renderGraphData(data)
window.TopologyTemplate.resetToSource()
window.TopologyTemplate.exportJson()
```

Editing notes:

- Browser edits update the current graph JSON panel and runtime
  `getGraphData()` result.
- Reset uses the preserved source graph, not the last edited graph.
- Undo/redo use LogicFlow history and keep JSON in sync.
- Export is taken from the current LogicFlow graph with all container nodes,
  labels, arrows, and edited positions.

## Verify

```powershell
npm run lint
npm run build
```

## Clean Generated Files

```powershell
.\scripts\clean-template.ps1
```

or:

```powershell
npm run clean:template
```

`dist`, `node_modules`, and local Vite logs are intentionally not kept in the template. They can be regenerated with the commands above.
