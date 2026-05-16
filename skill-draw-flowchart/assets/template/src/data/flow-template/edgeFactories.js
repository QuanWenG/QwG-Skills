import { EDGE_THEME } from './edgeTheme.js'

export const createEdge = (id, sourceNodeId, targetNodeId, value, x, y, relation, flow) => ({
  id,
  type: 'colored-polyline',
  sourceNodeId,
  targetNodeId,
  text: { value: '', x, y },
  zIndex: 100,
  properties: {
    relation,
    flow,
    labelValue: value,
    labelX: x,
    labelY: y,
    strokeWidth: 2.1,
    hoverStroke: EDGE_THEME[relation]?.stroke,
    selectedStroke: EDGE_THEME[relation]?.stroke,
    ...(EDGE_THEME[relation] || EDGE_THEME['depends-on']),
  },
})

export const createEdgeLabel = (id, x, y, text, relation, flow) => ({
  id: `${id}-label`,
  type: 'edge-label-node',
  x,
  y,
  text: { value: text, x, y },
  zIndex: 300,
  properties: {
    role: 'edge-label',
    group: 'edge-labels',
    category: 'edge-label',
    relation,
    flow,
    width: 118,
    height: text.length > 14 ? 38 : 30,
    labelFill: EDGE_THEME[relation]?.labelFill || '#ffffff',
    labelStroke: EDGE_THEME[relation]?.labelStroke || '#d8dee4',
    labelColor: EDGE_THEME[relation]?.labelColor || '#172026',
    prompt: '真实 LogicFlow/SVG 标签节点，随画布缩放并参与图片导出。',
    note: '复杂架构图默认用标签节点承载边说明，避免 HTML overlay 缩放漂移和导出缺字。',
  },
})
