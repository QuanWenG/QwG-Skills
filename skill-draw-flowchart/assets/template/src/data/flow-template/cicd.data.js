export const CICD_NODES = [
  {
    id: 'gitlab',
    type: 'rect',
    x: 520,
    y: 910,
    text: 'GitLab',
    properties: {
      role: 'ci-cd',
      group: 'ci-cd/source',
      category: 'repository',
      prompt: '代码仓库或制品源。',
      note: '通用示例；可替换为 GitHub、GitLab、Gitea 等。',
    },
  },
  {
    id: 'jenkins',
    type: 'rect',
    x: 820,
    y: 910,
    text: 'Jenkins',
    properties: {
      role: 'ci-cd',
      group: 'ci-cd/build',
      category: 'build-tool',
      prompt: '持续集成、测试和构建。',
      note: '部署发布链路可根据具体项目补充构建脚本和触发条件。',
    },
  },
  {
    id: 'k8s',
    type: 'rect',
    x: 1120,
    y: 910,
    text: 'K8s',
    properties: {
      role: 'ci-cd',
      group: 'ci-cd/orchestrator',
      category: 'orchestrator',
      prompt: '容器编排和发布运行环境。',
      note: '通用示例；也可替换为 Docker Compose、VM、裸机部署。',
    },
  },
]

