export const TOPOLOGY_GROUPS = [
  {
    id: 'external',
    label: '外部入口',
    description: '用户端、第三方系统、API 调用方。',
  },
  {
    id: 'service-center',
    label: '服务中心',
    description: '网关、注册中心、配置中心、业务服务集群。',
  },
  {
    id: 'middleware',
    label: '中间件',
    description: '消息队列、缓存、分库分表、任务调度。',
  },
  {
    id: 'storage',
    label: '存储',
    description: '数据库、文件存储、流媒体、对象存储。',
  },
  {
    id: 'ci-cd',
    label: 'CI/CD',
    description: '代码仓库、构建、镜像、编排和发布。',
  },
]

