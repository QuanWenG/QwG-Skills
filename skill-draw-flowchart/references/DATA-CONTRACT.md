# Architecture Topology Data Contract

Use this reference when converting user-provided architecture, project,
microservice, infrastructure, and business-flow data into
`src/data/flowTemplate.js`.

This skill creates **architecture system topology diagrams**. Use **groups and
layout** to show structure; use **labeled arrows** to show business logic,
service calls, data flow, message flow, deployment flow, or dependencies.

## Metadata

```js
export const FLOW_METADATA = {
  title: '架构系统拓扑图标题',
  subtitle: '一句话说明这张图解释的系统边界或业务链路',
  description: '数据来源、读图方式、关键假设、是否省略业务流程',
  layoutNote: '例如：按服务中心 / 中间件 / 存储 / 持续集成分区；箭头表示调用或数据流',
}
```

## Topology Groups

`TOPOLOGY_GROUPS` powers the visible architecture zone legend in the left panel.
The actual architecture frames must be represented as LogicFlow `group-node`
nodes in `INITIAL_GRAPH.nodes`, so they zoom, move, resize, export, and serialize
with the rest of the graph.

```js
export const TOPOLOGY_GROUPS = [
  {
    id: 'service-center',
    label: '服务中心',
    description: '网关、注册中心、配置中心、业务服务集群。',
  },
]
```

## Core Modeling Rule

| Information | Represent with | Example |
|---|---|---|
| Structure topology | `properties.group`, coordinates, group header nodes | 服务中心 > 服务器集群1 > 业务服务 |
| Technical dependency | Labeled edge | 注册中心 --> 服务中心 |
| Business logic | Labeled edge | 订单服务 -->|扣减库存| 库存服务 |
| Message/data flow | Labeled edge | 业务服务 -->|publish| Kafka |
| Unknown business flow | Metadata/note, not invented arrows | `业务流程未提供，当前仅展示结构拓扑` |

If there is no concrete project or business workflow, omit business arrows and
label the graph as a **generic topology / placeholder**.

## Node Types

Use these LogicFlow built-in types first:

| type | Use for |
|---|---|
| `rect` | Service, middleware, storage, CI/CD tool, component, module |
| `diamond` | Gateway, route condition, approval/decision, failover condition |
| `circle` | External entry, start/end, registry, event hub, milestone |

The template also registers one custom type:

| type | Use for |
|---|---|
| `group-node` | Large architecture container / topology zone placed below component nodes |

Do not create custom node types unless the user explicitly needs a special
visual language beyond `group-node`. The template is intended to be easy to
maintain.

## Group Fields

LogicFlow's default template stores grouping metadata in `properties`.
First-level group boundaries are drawn by `group-node` container nodes. Concrete
component nodes still use `properties.group` to record their ownership.

Recommended group categories:

| group | Example nodes |
|---|---|
| `registry-center` | 注册中心 |
| `service-center` | 业务服务、服务器集群、配置中心 |
| `middleware` | MQ、Redis、分库分表 |
| `storage` | MySQL、Redis Cluster、FastDFS、流媒体服务器 |
| `ci-cd` | Docker、Maven、K8s、Jenkins、GitLab |
| `external` | 用户端、第三方系统、支付网关 |

For nested topology, use a slash-like path in `properties.group`:

```js
properties: {
  group: 'service-center/server-cluster-1',
  groupLabel: '服务中心 / 服务器集群1',
}
```

Recommended `group-node` shape:

```js
{
  id: 'group-service-center',
  type: 'group-node',
  x: 500,
  y: 250,
  text: { value: '服务中心', x: 285, y: 55 },
  zIndex: 0,
  properties: {
    role: 'topology-group',
    group: 'service-center',
    category: 'architecture-zone',
    width: 520,
    height: 430,
    prompt: '服务中心架构边界。',
    note: '作为底层大节点参与缩放、导出和 JSON 编辑。',
  },
}
```

`group-node` rules:

- Do not model architecture frames as DOM/CSS background layers. They must be
  real LogicFlow nodes so they scale, export, serialize, move, and resize with
  the graph.
- Use `properties.role = 'topology-group'` and keep the frame below component
  nodes with a lower z-index.
- Keep layering in graph data/model defaults. Do not call graph-mutating APIs
  such as `setElementZIndex` from `history:change`, because that creates new
  history entries while undo/redo is running.
- After first render and layering normalization, reset LogicFlow history to the
  current graph as the only baseline so the initial canvas has no undo step.
- Put the title at the top center of the frame. Do not place it outside the
  frame or where it can collide with child nodes.
- A frame must fully contain its component nodes with readable padding.
- Frames must not overlap one another after any layout change.
- When component nodes are moved farther apart, update the frame width/height
  and re-run containment/overlap checks.
- Use non-negative z-index layers for reliable snapshot export. Recommended:
  architecture frames below edges, edges below component nodes.

## Node Fields

```js
{
  id: 'bs1',
  type: 'rect',
  x: 120,
  y: 180,
  text: '业务服务',
  properties: {
    role: 'service',
    group: 'service-center/server-cluster-1',
    category: 'business-service',
    prompt: '业务服务实例，参与服务调用链路。',
    note: '可在具体项目中补充服务名、端口、接口、依赖和部署信息。',
  },
}
```

Rules:

- Use kebab-case or snake_case stable ids.
- Keep `text` short: normally 2-8 Chinese characters or 1-4 English words.
- Put long explanation in `properties.prompt` or `properties.note`.
- Use consistent `role` values. Examples: `service`, `middleware`, `storage`,
  `registry`, `config`, `ci-cd`, `external`, `business-step`.
- Use `properties.group` for topology ownership.
- Use `properties.category` for domain type: `business-service`, `mq`, `cache`,
  `database`, `file-storage`, `streaming`, `build-tool`, `orchestrator`.

## Edge Fields

```js
{
  id: 'edge-bs1-bs3',
  type: 'polyline',
  sourceNodeId: 'bs1',
  targetNodeId: 'bs3',
  text: 'feign/ribbon',
  properties: {
    relation: 'service-call',
    flow: 'technical',
  },
}
```

Rules:

- Every edge must point to existing nodes.
- Every edge must have a meaningful label.
- Edge labels must be readable. For horizontal or dense edges, prefer explicit
  label coordinates such as `text: { value: '扣减库存', x: 640, y: 210 }` so the
  label sits above or below the line instead of being crossed by it.
- Use labels to distinguish dependencies and business logic: `注册`, `配置拉取`,
  `feign/ribbon`, `publish`, `consume`, `读写`, `主从复制`, `部署发布`.
- Use `properties.relation` when useful:
  - `contains` for structural relationship if represented as an edge.
  - `depends-on` for technical dependency.
  - `service-call` for synchronous call.
  - `message-flow` for MQ publish/consume.
  - `data-flow` for read/write or persistence.
  - `deploy-flow` for CI/CD and release.
  - `business-flow` for concrete business process logic.
- Use labels to make exceptions visible: `失败`, `超时`, `降级`, `回滚`, `重试`.
- Use `polyline` unless the chart has a strong reason to use another edge type.

## Runtime State Rules

- Preserve a source graph for reset. Runtime edits must not overwrite the reset
  baseline unless the user explicitly asks to replace the source.
- Current browser edits must update Graph JSON and `getGraphData()`.
- Undo/redo must use LogicFlow history and resync Graph JSON after each action.
- Snapshot export must use the current LogicFlow graph with all nodes, container
  frames, arrows, labels, and edited coordinates.

## Layout Coordinates

Recommended coordinate grid:

- Horizontal group interval: 260-360.
- Vertical group interval: 150-220.
- Keep external entry / registry at the left.
- Keep service center near the visual center.
- Put middleware and storage to the right or below service center.
- Put CI/CD in a separate lower or right-side band.
- Keep business arrows readable; avoid crossing every group boundary multiple times.

Example topology coordinates:

```js
const GROUPS = {
  registryCenter: { x: 90, y: 260 },
  serviceCenter: { x: 360, y: 80 },
  middleware: { x: 760, y: 80 },
  storage: { x: 1160, y: 120 },
  ciCd: { x: 760, y: 520 },
}
```

## STEP_TYPES

`STEP_TYPES` powers the left node library. Make it match the current
architecture domain, not the generic template.

```js
export const STEP_TYPES = [
  {
    label: '业务服务',
    type: 'rect',
    text: '业务服务',
    properties: {
      role: 'service',
      group: 'service-center',
      category: 'business-service',
      prompt: '微服务或业务服务实例。',
      note: '拖到画布后可编辑。',
    },
  },
]
```

## Microservice Topology Example

Use this as a generic placeholder shape only when the user has not provided a
concrete project.

```js
export const INITIAL_GRAPH = {
  nodes: [
    {
      id: 'registry-center',
      type: 'circle',
      x: 100,
      y: 300,
      text: '注册中心',
      properties: {
        role: 'registry',
        group: 'registry-center',
        category: 'registry',
        prompt: '服务注册与发现。',
        note: '通用示例节点，具体项目需替换为 Eureka/Nacos/Consul 等。',
      },
    },
    {
      id: 'bs1',
      type: 'rect',
      x: 360,
      y: 160,
      text: '业务服务',
      properties: {
        role: 'service',
        group: 'service-center/server-cluster-1',
        category: 'business-service',
        prompt: '服务器集群1中的业务服务。',
        note: '通用示例。',
      },
    },
    {
      id: 'bs3',
      type: 'rect',
      x: 560,
      y: 160,
      text: '业务服务',
      properties: {
        role: 'service',
        group: 'service-center/server-cluster-2',
        category: 'business-service',
        prompt: '服务器集群2中的业务服务。',
        note: '通用示例。',
      },
    },
    {
      id: 'kafka',
      type: 'rect',
      x: 820,
      y: 180,
      text: 'Kafka',
      properties: {
        role: 'middleware',
        group: 'middleware/mq',
        category: 'mq',
        prompt: '消息队列中间件。',
        note: '',
      },
    },
    {
      id: 'mysql',
      type: 'rect',
      x: 1080,
      y: 260,
      text: 'MySQL',
      properties: {
        role: 'storage',
        group: 'storage',
        category: 'database',
        prompt: '主库 -> 从库 -> 备库。',
        note: '',
      },
    },
  ],
  edges: [
    {
      id: 'edge-registry-service',
      type: 'polyline',
      sourceNodeId: 'registry-center',
      targetNodeId: 'bs1',
      text: '注册/发现',
      properties: { relation: 'depends-on', flow: 'technical' },
    },
    {
      id: 'edge-bs1-bs3',
      type: 'polyline',
      sourceNodeId: 'bs1',
      targetNodeId: 'bs3',
      text: 'feign/ribbon',
      properties: { relation: 'service-call', flow: 'technical' },
    },
    {
      id: 'edge-bs3-kafka',
      type: 'polyline',
      sourceNodeId: 'bs3',
      targetNodeId: 'kafka',
      text: 'publish',
      properties: { relation: 'message-flow', flow: 'business-or-technical' },
    },
    {
      id: 'edge-bs3-mysql',
      type: 'polyline',
      sourceNodeId: 'bs3',
      targetNodeId: 'mysql',
      text: '读写',
      properties: { relation: 'data-flow', flow: 'business-or-technical' },
    },
  ],
}
```

## Minimal Valid Graph

```js
export const INITIAL_GRAPH = {
  nodes: [
    {
      id: 'start',
      type: 'circle',
      x: 120,
      y: 180,
      text: '注册中心',
      properties: {
        role: 'registry',
        group: 'registry-center',
        category: 'registry',
        prompt: '服务注册与发现。',
        note: '',
      },
    },
    {
      id: 'service',
      type: 'rect',
      x: 340,
      y: 180,
      text: '业务服务',
      properties: {
        role: 'service',
        group: 'service-center',
        category: 'business-service',
        prompt: '业务服务组件。',
        note: '',
      },
    },
  ],
  edges: [
    {
      id: 'edge-registry-service',
      type: 'polyline',
      sourceNodeId: 'start',
      targetNodeId: 'service',
      text: '注册/发现',
      properties: { relation: 'depends-on', flow: 'technical' },
    },
  ],
}
```
