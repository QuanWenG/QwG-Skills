---
name: skill-draw-flowchart
description: Generate, refine, and deliver editable architecture system topology diagram HTML pages from project structures, microservice systems, middleware/storage/CI infrastructure, deployment topology, service dependencies, business workflows, and codebase structure. Use when Codex needs to create a Vite + React + LogicFlow hybrid architecture diagram where grouped topology shows system structure and labeled arrows show service calls, data flow, message flow, deployment flow, dependencies, and business process logic.
---

# Skill Draw Flowchart

把用户提供的项目结构、系统组件、微服务拓扑、中间件/存储/CI/CD 设施、
部署关系和业务流程，整理成可运行、可编辑、可导出的**架构系统拓扑图
HTML**。

产出物 = Vite + React + LogicFlow 项目 + 架构建模计划 + 可复用图数据。

本 Skill **以架构建模方法 + 协作流程为核心**。模板只提供画布、节点库、
属性面板、JSON 同步和导出能力；每次任务都必须围绕用户材料重新设计系统
边界、架构分组、节点类型、依赖箭头和业务流程箭头，不要只替换占位文案。

> **定义**：本 Skill 生成的是**架构系统拓扑图**，不是单纯流程图。
> 架构图展示结构：系统、集群、服务、中间件、存储、CI/CD 等用分组和
> 层级表达；流程箭头展示逻辑：服务调用、数据流、消息流、审批流、部署流
> 等用带标签箭头表达。没有业务材料时，只输出结构拓扑和技术依赖；有业务
> 链路时，必须把业务逻辑叠加到架构拓扑上。

---

## 工作流总览

```text
Phase 1   架构建模
   1.1  识别用户输入
   1.2  提取系统边界、分组、组件、依赖和业务链路
   1.3  项目类输入先做轻量代码/目录扫描
   1.4  一次产出 flow-source.* + flow-plan.md
   ▼
[Checkpoint Plan]      ← 必须停。一次对齐 5 件事：
                         项目理解 / flow-plan / 拓扑风格 / 素材 / 开发模式
   ▼
Phase 2   网页开发
   2.1  复制 LogicFlow 模板项目
   2.2  改写图数据唯一真相源 src/data/flowTemplate.js
   2.3  调整布局、主题、分组、边标签和说明面板
        ▼
        [硬节点] 用户验收首版架构拓扑图 ← 不可跳过
        ▼
   2.4  按选定模式继续细化：A 逐轮 / B 顺序 / C 并行拆分
   ▼
Phase 3   验证交付
   3.1  npm run lint
   3.2  npm run build
   3.3  可选启动 dev server，交付 URL 和路径
```

默认输出目录使用用户当前目录下的 `flowchart-html/`，除非用户指定名称。

工作目录约定：

```text
flowchart-html/
├── flow-source.md              # 自然语言、文章、会议纪要、SOP、项目分析摘录
├── flow-source.json            # 用户给结构化数据时保留
├── flow-plan.md                # 必有：架构拓扑建模计划，代码前唯一计划源
└── app files                   # 脚手架复制出的 Vite + React + LogicFlow 项目
    ├── src/data/flowTemplate.js # ★ 图数据唯一真相源
    ├── src/components/          # 画布、节点库、属性面板、顶栏
    ├── src/styles/app.css       # 主题、布局、响应式和画布外壳样式
    └── package.json
```

> **关键**：`src/data/flowTemplate.js` 是最终架构拓扑图的**唯一真相源**。
> `FLOW_METADATA`、`STEP_TYPES`、`TOPOLOGY_GROUPS`、`INITIAL_GRAPH.nodes`、
> `INITIAL_GRAPH.edges` 必须与 `flow-plan.md` 对齐。不要让文档、画布默认
> 数据、节点库和交付说明各说各话。

---

## 硬性自检协议

下面三个产出，每一个完成后必须走**自检 -> 修复 -> 再汇报/推进**：

| 产出 | 自检清单出处 |
|---|---|
| `flow-plan.md` | [`QUALITY-CHECKLIST.md`](references/QUALITY-CHECKLIST.md) 的 Architecture Coverage / Graph Correctness / Readability |
| `src/data/flowTemplate.js` | [`DATA-CONTRACT.md`](references/DATA-CONTRACT.md) + [`TOPOLOGY-RULES.md`](references/TOPOLOGY-RULES.md) + [`QUALITY-CHECKLIST.md`](references/QUALITY-CHECKLIST.md) |
| 首版或最终 HTML 项目 | [`TOPOLOGY-RULES.md`](references/TOPOLOGY-RULES.md) 的 Required Node Review + [`QUALITY-CHECKLIST.md`](references/QUALITY-CHECKLIST.md) 全量自检 + `npm run lint` + `npm run build` |

执行方式按能力降级：

1. **独立 reviewer agent**：给它产出文件路径、对应清单和关键上下文，让它逐项核查并报告 pass/fail、证据和修改建议。
2. **当前 agent 自检**：如果无法开独立 agent，就自己严格逐项核查，不允许只目测。

**铁律**：拿到 fail 项后，先修复产出，再向用户汇报“做完了 + 自检结论 +
改了什么”。不能把未修复的检查结论直接丢给用户。

---

## 各阶段文件读取指南

不同阶段读不同文件。长会话里容易忘记边界，尤其是 Phase 2.2 改图数据和
Phase 2.4 继续细化会重复发生，每次都要回看核心约束。

| 阶段 | 必读（每次都看） | 按需查 |
|---|---|---|
| Phase 1.1-1.4 架构建模 | 用户材料、现有 `flow-source.*`、本文件 Phase 1、[`QUALITY-CHECKLIST.md`](references/QUALITY-CHECKLIST.md) | 项目代码结构、部署文档、接口文档、用户给的图例或品牌材料 |
| Checkpoint Plan | `flow-plan.md`、素材路径清单、拓扑风格判断 | [`DATA-CONTRACT.md`](references/DATA-CONTRACT.md) 的节点、分组、连线和坐标约定 |
| Phase 2.1 脚手架 | 本文件 Phase 2.1、`scripts/scaffold.ps1` 使用方式 | `assets/template/README.md` |
| Phase 2.2 改图数据 | `flow-plan.md`、[`DATA-CONTRACT.md`](references/DATA-CONTRACT.md)、[`TOPOLOGY-RULES.md`](references/TOPOLOGY-RULES.md)、[`QUALITY-CHECKLIST.md`](references/QUALITY-CHECKLIST.md) | `assets/template/src/data/flowTemplate.js` 当前结构 |
| Phase 2.3 视觉和说明面板 | `flow-plan.md`、当前 `src/data/flowTemplate.js`、`src/styles/app.css`、[`TOPOLOGY-RULES.md`](references/TOPOLOGY-RULES.md) | 用户素材、品牌色、架构截图、图标 |
| Phase 2.4 继续细化 | 用户反馈、`flow-plan.md`、当前 `src/data/flowTemplate.js` | 相关组件文件、项目源码、历史验收意见 |
| Phase 3 验证交付 | [`QUALITY-CHECKLIST.md`](references/QUALITY-CHECKLIST.md)、`package.json` | 构建日志、dev server 端口 |

---

## Phase 1 - 架构建模

### 1.1 识别用户输入

| 用户给的东西 | 该做的 |
|---|---|
| JSON / CSV / 表格 / 列表 | 转成标准架构分组、组件节点、依赖连线、业务流程箭头 |
| 自然语言架构描述 | 提取系统边界、集群、服务、中间件、存储、CI/CD |
| 自然语言业务流程 | 提取业务动作、服务调用、数据流、消息流、异常/回退路径 |
| 文章 / 会议纪要 / SOP | 先摘要为架构层级和业务链路，再拆分组、节点和箭头 |
| 项目目录 / 代码仓库 | 先做轻量项目扫描，形成项目粗分析和后续详细分析清单 |
| 只说“帮我画某某架构图”但没有内容 | 反问：要求用户提供系统组件、项目路径、部署结构或业务链路；不要凭空编造 |

### 1.2 提取架构拓扑骨架

先从用户材料中提取：

- **系统边界**：服务中心、中间件、存储、持续集成、外部系统等。
- **架构分组**：服务集群、配置中心、MQ、Redis、数据库、CI/CD 工具链等。
- **组件节点**：业务服务、网关、注册中心、配置中心、消息队列、缓存、数据库、文件服务、构建工具。
- **结构关系**：包含、部署于、依赖、注册、订阅、读写、构建、发布。
- **业务流程箭头**：请求进入、服务调用、消息发送、缓存读写、数据库落库、审批/回退、部署发布。
- **异常/回退路径**：失败重试、降级、人工介入、回滚、补偿。

必须区分两种信息：

| 信息类型 | 表达方式 | 示例 |
|---|---|---|
| 结构拓扑 | 分组、容器、层级、空间位置 | 服务中心 > 服务器集群1 > 业务服务 |
| 技术依赖 | 带标签箭头 | 注册中心 -> 服务中心 |
| 业务逻辑 | 带标签箭头 | 订单服务 -> 库存服务：扣减库存 |
| 数据/消息流 | 方向箭头 + 标签 | 业务服务 -> Kafka：publish |
| 无业务材料 | 元信息说明，不编业务箭头 | “业务流程未提供，当前仅展示结构拓扑” |

### 1.3 项目类输入先做轻量扫描

用户提供项目目录、仓库或代码路径时，不要立刻画完整图：

1. 用 `rg --files` / `Get-ChildItem` 看目录结构。
2. 找入口文件、配置文件、主要模块、脚本命令、测试目录。
3. 归纳项目结构图、服务拓扑候选和关键业务链路候选。
4. 在 `flow-plan.md` 中写清楚后续详细分析计划清单：还需要读哪些文件、确认哪些服务依赖、哪些调用链、哪些地方只是推断。

### 1.4 推测目标和拓扑风格

根据材料判断用户更可能需要哪类输出：

| 目标 | 图形策略 |
|---|---|
| 系统架构汇报 | 强调系统边界、分层分组、核心依赖，业务箭头适度 |
| 微服务拓扑梳理 | 强调注册中心、配置中心、服务中心、中间件、存储、CI/CD |
| 研发理解 / 架构排查 | 强调模块、调用、数据流、异常路径、瓶颈点 |
| 业务链路说明 | 在架构拓扑上叠加业务箭头，标出服务调用、消息和数据落点 |
| 部署 / 运维视角 | 强调集群、环境、实例、发布链路和故障回退 |

视觉风格只做方向建议，不要在 `flow-plan.md` 写死所有 CSS 细节。具体字号、
色彩和空间在 Phase 2 根据画布实际效果调整。

抽象“微服务架构”场景可参考 [`TOPOLOGY-RULES.md`](references/TOPOLOGY-RULES.md)
的 Microservice Reference Shape，但必须标注为通用示例/placeholder，不要伪装成用户真实系统。

### 1.5 一次产出 flow-source.* + flow-plan.md

必须保留原始资料：

```text
flowchart-html/
├── flow-source.md      # 自然语言、文章、会议纪要、SOP、项目分析摘录
└── flow-source.json    # 用户给结构化数据时保留
```

生成 `flow-plan.md`，作为代码前的唯一计划文件：

```markdown
# Flow Plan

## 目标
- 这张图要解释什么
- 面向谁
- 最终 HTML 的使用场景：架构汇报 / 研发梳理 / 运维拓扑 / 业务链路说明

## 数据来源
- 用户提供了哪些材料
- 哪些地方是推断
- 哪些地方需要用户确认

## 项目粗分析（项目类输入必填）
- 目录结构摘要
- 关键模块 / 服务 / 入口 / 脚本 / 配置
- 后续详细分析计划清单

## 架构分组 / 拓扑层级
- group id: 展示名，职责，父级分组

## 组件节点清单
| id | type | group | category | text | prompt/note |

## 结构依赖清单
| source | target | label | 关系类型 |

## 业务流程箭头清单
| source | target | label | 业务含义 / 条件 |

## 布局策略
- 按层级 / 分组 / 集群 / 技术域 / 业务链路
- 复杂度处理：分区、分层、局部放大、备注放属性面板
- 复杂项目采用“小架构先行”布局法：
  1. 先为服务中心、中间件、存储、CI/CD、外部系统、核心业务链路分别生成独立小图数据。
  2. 每个小图先使用极大间距摆放节点、容器和标签，完成包含关系、箭头方向、标签避让和几何自检。
  3. 小图通过后，只在安全范围内逐步收缩。
  4. 所有小架构通过后，再组合成完整大架构。
  5. 记录哪些区域已通过小图自检，哪些跨域连线仍需确认。

## 主题 / 素材建议
- 视觉风格方向
- 需要的素材或图标
- placeholder 方案

## 自检
- 是否覆盖用户给的关键系统、服务、中间件、存储和 CI/CD 组件
- 是否清楚区分结构拓扑和业务流程箭头
- 是否每条技术依赖 / 业务链路都有方向和标签
- 没有具体业务时是否明确标注业务流程省略
- 是否节点文字能在画布上读清
```

落盘后必须先按**硬性自检协议**检查 `flow-plan.md`，修复 fail 项后再进入 Checkpoint Plan。

---

## Checkpoint Plan - 5 件事一次对齐

`flow-source.*` + `flow-plan.md` 写完并自检修复后必须停下来。用户在这一个
节点同时确认 5 件事。

### agent 此时要做的预备工作

1. 回看 `flow-plan.md` 的目标、项目粗分析、节点清单、连线清单。
2. 根据目标判断 2-3 个拓扑主题/视觉方向推荐，例如微服务拓扑、部署架构、业务链路叠加、研发排查、汇报展示。
3. 扫描素材需求：图标、截图、品牌色、项目 logo、服务图标、云厂商/中间件标识、外部系统标识。
4. 判断合适的开发模式：默认 A；复杂项目或多图输出时建议 B/C。

### 总结模板

```text
架构拓扑计划写完，产出文件：
  flow-source.md/json   原始资料已保留
  flow-plan.md          {G} 个分组 / {M} 个组件节点 / {E} 条结构依赖 / {B} 条业务流程箭头

拓扑速览：
  1. <group-id>  <分组标题>  <节点数> 个组件
  2. ...

接下来一次对齐 5 件事：

  1. 项目粗分析要不要改？
     重点看：目录理解、关键模块、后续详细分析清单是否准确。

  2. flow-plan 要不要改？
     重点看：架构分组、组件节点、结构依赖、业务流程箭头、异常/回退路径。

  3. 选哪个拓扑主题 / 风格？
     我的推荐：
     - <推荐 1>：因为 <命中目标 / 材料类型 / 受众>
     - <推荐 2>
     - <推荐 3>

  4. 素材怎么处理？
     a) 使用用户现有素材
     b) 我从项目/资料里提取截图或名称
     c) 全部 placeholder

  5. 开发模式选哪个？
     A) 默认 · 逐轮确认（推荐）
        首版架构拓扑图完成后暂停验收；每轮只改一组问题。
     B) 顺序完善
        主线程按 flow-plan 顺序完成全部图和说明，最后统一验收。
     C) 并行拆分（subagent）
        多张图、多模块或多泳道可并行；需要明确每个 agent 的文件写入范围。
```

收到反馈后：

- `flow-plan.md` 要改：直接编辑，编辑完再按硬性自检协议检查。
- 主题必须明确才进入 Phase 2。用户说“你帮我选”时，取推荐 1，并说明选择理由。
- 开发模式不明确时，默认走 A 逐轮确认。

---

## Phase 2 - 网页开发

### 2.1 复制模板项目

优先使用脚本：

```powershell
.\scripts\scaffold.ps1 -OutputPath .\flowchart-html
```

或在 cmd 中：

```cmd
scripts\scaffold.cmd flowchart-html
```

脚本复制 `assets/template`，会自动排除模板中的 `node_modules`、`dist` 和
`.vite`。复制后在输出项目中运行：

```powershell
cd .\flowchart-html
npm ci
npm run dev
```

如果没有 lockfile 或 `npm ci` 失败，再用 `npm install`。网络或权限失败时，
按环境规则申请批准，不要绕过依赖安装。

### 2.2 改写 src/data/flowTemplate.js

核心文件：

```text
flowchart-html/src/data/flowTemplate.js
```

必须根据 `flow-plan.md` 改写：

- **`FLOW_METADATA`**：标题、副标题、数据来源说明、布局读法。
- **`STEP_TYPES`**：左侧节点库，贴合当前架构领域，不保留无关占位。
- **`TOPOLOGY_GROUPS`**：左侧架构域说明，必须与图中 `group-node` 对齐。
- **`INITIAL_GRAPH.nodes`**：最终默认渲染的组件节点、分组节点、必要标签节点。
- **`INITIAL_GRAPH.edges`**：最终默认渲染的结构依赖和业务流程箭头。

无论什么样的项目的数据生成必须按**小架构先行 + 极大间距收缩法**执行：

1. 先把 `flow-plan.md` 中的架构域拆成若干小架构数据单元，每个单元有自己的 `group-node`、内部节点、内部结构依赖和必要业务箭头。
2. 对每个小架构单元先用极大间距生成坐标和容器尺寸，宁可画布临时变大，也不能让节点、标签、容器一开始就贴得过近。
3. 单个小架构通过几何自检后才允许收缩：容器完整包含、容器标题不遮挡、普通节点不重叠、标签不压线不压节点、边引用有效。
4. 小架构收缩到合适尺寸后，才把多个小架构合并为完整项目大图；合并时先给架构域之间和跨域箭头保留极大间距。
5. 大图合并也必须重复“极大间距 -> 几何自检 -> 局部收缩”的流程；跨域线、共享中间件、存储和 CI/CD 区域是重点检查对象。

节点必须使用稳定 id。边必须引用存在的 `sourceNodeId` 和 `targetNodeId`。
节点属性至少包含：

```js
properties: {
  role: 'service',
  group: 'service-center',
  category: 'business-service',
  prompt: '该节点代表的系统组件、服务、存储或中间件能力',
  note: '补充说明、技术栈、风险、数据来源或业务含义',
}
```

写完后必须按硬性自检协议检查 `src/data/flowTemplate.js`，尤其是重复 id、
悬空边、分组归属、结构依赖、业务箭头、边标签、节点文字长度。

### 2.3 调整布局、主题、箭头和说明面板

详细规则见 [`TOPOLOGY-RULES.md`](references/TOPOLOGY-RULES.md)。主流程只保留核心要求：

- 架构结构先清晰，业务箭头后叠加；没有业务材料时不编造业务链路。
- `group-node` 容器、普通节点、箭头标签都要可读、可编辑、可导出。
- 架构分区必须是真正的 LogicFlow `group-node`，不能是 CSS 背景或画布外装饰。
- 推荐层级：架构大节点 `zIndex = 0`，箭头和边标签 `zIndex = 100`，普通节点 `zIndex = 200`，真实标签节点可更高。
- 容器不重叠，普通节点不越界，容器标题顶部居中，箭头标签避让节点和线段。
- 网页编辑要同步当前 Graph JSON，同时保留源图数据用于重置。
- `history:change` 不能改图；初始加载后不能出现可撤销的“上一步”。
- 复杂标签若缩放漂移、导出缺失、被其他线穿过，优先改成真实 LogicFlow/SVG 标签节点，例如 `edge-label-node`。

用户反馈“太挤 / 标签被线穿过 / 标签导出缺失 / 缩放后标签漂移”时，读取
[`TOPOLOGY-RULES.md`](references/TOPOLOGY-RULES.md) 的 Large Spacing And
Contraction Method 与 Edge Label Stability Pattern，按“大间距基线 ->
几何自检 -> 局部收缩 -> 真实标签节点”的顺序处理。

### 2.4 首版架构拓扑图 - 主线程 + 强制验收

首版架构拓扑图必须由主线程完成，并且必须是**可运行、可编辑、可验收**的
版本，不交付只有骨架的空项目。

首版完成后必须停下来等用户验收：

```text
首版架构拓扑图完成了，dev server 在 localhost:<port> 运行。

验收重点：
  □ 当前排版是否合理，节点是否需要拉开或者收紧，节点之间有无错乱？
  □ 项目粗分析 / 架构理解是否准确？
  □ 服务中心、中间件、存储、持续集成等分组是否符合你的认知？
  □ 结构依赖和业务流程箭头是否区分清楚？
  □ 有业务材料时，关键业务链路是否被箭头标出来？
  □ 没有业务材料时，是否明确只展示结构拓扑和技术依赖？
  □ 视觉风格是否符合 <拓扑主题/目标>？

问题告诉我，我按最小范围改。OK 后我按选定模式继续细化。
```

### 2.5 第 2 轮及之后 - 按选定模式细化

所有模式下的共同规则：

- 每轮修改都必须回看用户反馈、`flow-plan.md` 和当前 `src/data/flowTemplate.js`。
- 修改架构理解时，先修 `flow-plan.md`，再修图数据。
- 修改布局/标签时，优先局部调整；复杂拥挤时按小架构拆分和大间距基线处理。
- 每轮完成后都要按相关清单自检，修复 fail 项后再汇报。

#### 模式 A · 默认 · 逐轮确认

每轮只处理一组问题，例如补业务链路、补中间件、重排分组、改主题、拆分多图。
每轮完成后都暂停验收。适合用户持续校准架构理解。

#### 模式 B · 顺序完善

主线程按 `flow-plan.md` 顺序完成所有架构分组、组件节点、箭头、样式和说明
面板，最后统一验收。适合拓扑清晰、用户希望一次看成品。

#### 模式 C · 并行拆分（subagent）

仅在用户明确允许并行 agent 工作时使用。适合多图、多模块、多项目路径。每个
subagent 必须有独立写入范围，例如：

- Worker 1：只负责服务中心 / 业务服务拓扑数据。
- Worker 2：只负责中间件 / 存储拓扑数据。
- Worker 3：只负责业务链路箭头或样式主题，不改其他分组数据。

并行 prompt 必须包含：

- 当前 `flow-plan.md` 对应段落。
- [`DATA-CONTRACT.md`](references/DATA-CONTRACT.md) 和 [`QUALITY-CHECKLIST.md`](references/QUALITY-CHECKLIST.md) 路径。
- 明确的文件写入范围。
- 明确说明“你不是唯一工作者，不要覆盖他人修改”。
- 完工后必须运行可行的检查命令，并报告改了哪些文件。

---

## Phase 3 - 验证交付

在输出项目目录运行：

```powershell
npm run lint
npm run build
```

如果用户需要本地预览，启动：

```powershell
npm run dev
```

交付前按硬性自检协议对最终 HTML 项目走全量检查。最终回复必须包含：

- 输出目录
- dev server URL（如果已启动）
- 已生成/修改的主要文件
- 验证命令结果
- 仍属于推断或需要用户确认的流程点

---

## 十条原则

完整细节分散在 [`DATA-CONTRACT.md`](references/DATA-CONTRACT.md)、
[`TOPOLOGY-RULES.md`](references/TOPOLOGY-RULES.md) 和
[`QUALITY-CHECKLIST.md`](references/QUALITY-CHECKLIST.md)。下面只保留索引。

| # | 原则 | 一句话 |
|---|---|---|
| 1 | 数据先行 | 先保留 `flow-source.*`，再建模，不直接写图。 |
| 2 | `flow-plan` 是唯一计划源 | 代码前必须有 `flow-plan.md`，复杂判断都写在那里。 |
| 3 | 图数据是唯一真相源 | 最终画布以 `src/data/flowTemplate.js` 为准。 |
| 4 | 架构展示结构 | 系统、集群、服务、中间件、存储、CI/CD 用分组和层级表达。 |
| 5 | 箭头展示逻辑 | 业务链路、服务调用、数据流、消息流、部署流用带标签箭头表达。 |
| 6 | 无业务不编造 | 没有具体项目或业务材料时，只画结构拓扑和技术依赖。 |
| 7 | 节点短，说明长 | 节点文字短，长解释放 `properties.prompt/note`。 |
| 8 | 异常路径显性化 | 失败、降级、重试、回滚、人工介入不能藏在备注里。 |
| 9 | 复杂架构先拆分 | 大系统优先拆小架构或拆多图，不硬塞一张乱图。 |
| 10 | 自检后再汇报 | 任何关键产出先检查、修复，再推进。 |

---

## 常见用户反馈速查

| 用户反馈 | 定位 | 修改方式 |
|---|---|---|
| “太乱” | 布局 / 信息密度 | 减少同屏节点，拆成总览拓扑 + 业务链路图，长说明放 `note`。 |
| “看不出系统边界” | 架构分组 | 增加服务中心、中间件、存储、CI/CD 等分组，调整分组标题和边界。 |
| “看不出业务怎么走” | 业务流程箭头 | 在拓扑上补服务调用、消息流、数据流箭头，并给边加业务标签。 |
| “只有结构没有流程” | 输入材料不足 / 业务链路缺失 | 若用户未给业务链路，标注“业务流程省略”；若已给，补箭头。 |
| “不符合项目结构” | 项目粗分析 | 回看目录、配置和关键文件，修正 `flow-plan.md` 后再改图。 |
| “想要更像架构汇报图” | 主题 / 受众 | 调整标题、副标题、分组层级、颜色和节点密度，保留可编辑能力。 |
| “标签被线穿过 / 导出没标签 / 缩放标签漂移” | 标签层级 / 导出一致性 | 改用真实 `edge-label-node`，清空边自身可见文字，并复查 Snapshot 导出。 |
| “给我图片” | 导出 | 用页面“导出图片”按钮或 LogicFlow Snapshot 导出；导出后检查标签内容是否存在。 |

---

## 相关资源

按“何时读”标注，避免一次性全读：

| 文件 | 何时读 | 内容 |
|---|---|---|
| [`references/DATA-CONTRACT.md`](references/DATA-CONTRACT.md) | Phase 2.2 必读 | `FLOW_METADATA`、分组、节点、连线、布局坐标、最小有效图 |
| [`references/TOPOLOGY-RULES.md`](references/TOPOLOGY-RULES.md) | Phase 2.2 / 2.3 必读 | 架构大节点、布局、标签避让、撤销历史、导出一致性、微服务参考形态 |
| [`references/QUALITY-CHECKLIST.md`](references/QUALITY-CHECKLIST.md) | 每个关键产出完成后必读 | 架构覆盖、结构/业务箭头正确性、可读性、HTML 项目和验证清单 |
| [`scripts/scaffold.ps1`](scripts/scaffold.ps1) | Phase 2.1 | 复制模板项目到输出目录 |
| [`scripts/scaffold.cmd`](scripts/scaffold.cmd) | Phase 2.1 | Windows cmd 包装脚本 |
| [`assets/template/`](assets/template) | Phase 2 | Vite + React + LogicFlow 模板 |
| [`assets/template/src/data/flowTemplate.js`](assets/template/src/data/flowTemplate.js) | Phase 2.2 | 默认图数据示例，实际任务中必须改写 |
