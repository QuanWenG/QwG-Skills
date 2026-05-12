export const STEP_TYPES = [
  {
    label: '提示词',
    type: 'rect',
    text: '用户提示词',
    properties: {
      role: 'input',
      prompt:
        '请生成一个响应式 HTML 页面，包含清晰结构、可访问按钮和可维护样式。',
      note: '后续 skill 可以从这里读取原始需求。',
    },
  },
  {
    label: '意图分析',
    type: 'diamond',
    text: '页面意图?',
    properties: {
      role: 'decision',
      prompt: '判断页面类型、目标用户、主要内容和交互边界。',
      note: '可以拆分为设计、内容、代码三个分支。',
    },
  },
  {
    label: '页面规划',
    type: 'rect',
    text: '页面规划',
    properties: {
      role: 'plan',
      prompt: '输出页面区块、组件层级、视觉约束和响应式规则。',
      note: '作为 HTML/CSS 生成前的结构蓝图。',
    },
  },
  {
    label: 'HTML 生成',
    type: 'rect',
    text: '生成 HTML',
    properties: {
      role: 'generate',
      prompt: '根据规划生成单文件 HTML，包含语义标签和内联/外链样式入口。',
      note: '后续可替换为真实生成器节点。',
    },
  },
  {
    label: '人工微调',
    type: 'rect',
    text: '人工微调',
    properties: {
      role: 'review',
      prompt: '检查布局、文案、交互、边界状态和移动端表现。',
      note: '用户可在右侧属性面板调整节点说明。',
    },
  },
]

export const INITIAL_GRAPH = {
  nodes: [
    {
      id: 'prompt',
      type: 'rect',
      x: 120,
      y: 170,
      text: '用户提示词',
      properties: STEP_TYPES[0].properties,
    },
    {
      id: 'intent',
      type: 'diamond',
      x: 330,
      y: 170,
      text: '页面意图?',
      properties: STEP_TYPES[1].properties,
    },
    {
      id: 'plan',
      type: 'rect',
      x: 540,
      y: 170,
      text: '页面规划',
      properties: STEP_TYPES[2].properties,
    },
    {
      id: 'html',
      type: 'rect',
      x: 750,
      y: 170,
      text: '生成 HTML',
      properties: STEP_TYPES[3].properties,
    },
    {
      id: 'tune',
      type: 'rect',
      x: 960,
      y: 170,
      text: '人工微调',
      properties: STEP_TYPES[4].properties,
    },
  ],
  edges: [
    {
      id: 'edge_prompt_intent',
      type: 'polyline',
      sourceNodeId: 'prompt',
      targetNodeId: 'intent',
      text: '解析',
    },
    {
      id: 'edge_intent_plan',
      type: 'polyline',
      sourceNodeId: 'intent',
      targetNodeId: 'plan',
      text: '确认方向',
    },
    {
      id: 'edge_plan_html',
      type: 'polyline',
      sourceNodeId: 'plan',
      targetNodeId: 'html',
      text: '生成',
    },
    {
      id: 'edge_html_tune',
      type: 'polyline',
      sourceNodeId: 'html',
      targetNodeId: 'tune',
      text: '预览反馈',
    },
  ],
}

export const PATTERN_ITEMS = STEP_TYPES.map((item) => ({
  ...item,
  className: `flow-pattern flow-pattern-${item.properties.role}`,
}))
