import { ARCHITECTURE_GROUP_NODES } from './flow-template/architectureGroups.data.js'
import { CICD_NODES } from './flow-template/cicd.data.js'
import { EDGE_LABEL_NODES, FLOW_EDGES } from './flow-template/edges.data.js'
import { EXTERNAL_NODES } from './flow-template/external.data.js'
import { FLOW_METADATA } from './flow-template/metadata.js'
import { MIDDLEWARE_NODES } from './flow-template/middleware.data.js'
import { SERVICE_CENTER_NODES } from './flow-template/serviceCenter.data.js'
import { STEP_TYPES } from './flow-template/stepTypes.js'
import { STORAGE_NODES } from './flow-template/storage.data.js'
import { TOPOLOGY_GROUPS } from './flow-template/topologyGroups.js'

export { FLOW_METADATA, STEP_TYPES, TOPOLOGY_GROUPS }

export const INITIAL_GRAPH = {
  nodes: [
    ...ARCHITECTURE_GROUP_NODES,
    ...EXTERNAL_NODES,
    ...SERVICE_CENTER_NODES,
    ...MIDDLEWARE_NODES,
    ...STORAGE_NODES,
    ...CICD_NODES,
    ...EDGE_LABEL_NODES,
  ],
  edges: FLOW_EDGES,
}

export const PATTERN_ITEMS = STEP_TYPES.map((item) => ({
  ...item,
  className: `flow-pattern flow-pattern-${item.properties.role}`,
}))
