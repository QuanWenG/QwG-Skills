import { createEdge, createEdgeLabel } from './edgeFactories.js'

const EDGE_DEFINITIONS = [
  ['edge-client-gateway', 'client', 'api-gateway', 'HTTPS请求', 300, 270, 'business-flow', 'request'],
  ['edge-gateway-bs1', 'api-gateway', 'bs1', '路由/鉴权通过', 600, 270, 'service-call', 'business'],
  ['edge-gateway-bs2', 'api-gateway', 'bs2', '用户上下文', 565, 430, 'service-call', 'business'],
  ['edge-registry-service', 'registry-center', 'bs1', '注册/发现', 840, 205, 'depends-on', 'technical'],
  ['edge-bs1-bs3', 'bs1', 'bs3', '扣减库存', 910, 270, 'service-call', 'business'],
  ['edge-bs2-bs4', 'bs2', 'bs4', '支付校验', 910, 450, 'service-call', 'business'],
  ['edge-service-mq', 'bs3', 'mq', '库存事件', 1250, 230, 'message-flow', 'business'],
  ['edge-service-redis', 'bs4', 'redis', '缓存读写', 1250, 440, 'data-flow', 'business'],
  ['edge-config-services', 'config-center', 'bs2', '配置拉取', 775, 555, 'depends-on', 'technical'],
  ['edge-middleware-storage', 'sharding', 'mysql', '分库分表', 1620, 555, 'data-flow', 'technical'],
  ['edge-service-mysql', 'bs1', 'mysql', '订单落库', 1440, 320, 'data-flow', 'business'],
  ['edge-service-file', 'bs4', 'fastdfs', '凭证/文件', 1440, 505, 'data-flow', 'business'],
  ['edge-gitlab-jenkins', 'gitlab', 'jenkins', '提交触发', 680, 875, 'deploy-flow', 'release'],
  ['edge-jenkins-k8s', 'jenkins', 'k8s', '构建/发布', 970, 875, 'deploy-flow', 'release'],
  ['edge-k8s-bs4', 'k8s', 'bs4', '部署服务', 1095, 745, 'deploy-flow', 'release'],
]

export const EDGE_LABEL_NODES = EDGE_DEFINITIONS.map(([id, , , value, x, y, relation, flow]) =>
  createEdgeLabel(id, x, y, value, relation, flow),
)

export const FLOW_EDGES = EDGE_DEFINITIONS.map(([id, sourceNodeId, targetNodeId, value, x, y, relation, flow]) =>
  createEdge(id, sourceNodeId, targetNodeId, value, x, y, relation, flow),
)
