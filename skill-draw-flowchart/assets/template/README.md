# Architecture Topology HTML Template

LogicFlow + React + Vite template for generating an editable architecture
system topology HTML page. Use groups/layout for structure and labeled arrows
for service calls, dependencies, data flow, message flow, deployment flow, and
business logic.

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
