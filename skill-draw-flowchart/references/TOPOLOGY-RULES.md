# Topology Rules

本文件承载 `SKILL.md` 中不适合长期占据主流程的详细规则。主流程只保留入口和硬约束；涉及架构大节点、布局、撤销历史、导出一致性、微服务参考形态时，读取本文件。

## Iteration Fixes

这些问题来自模板迭代中的真实反馈，后续生成或修改模板时必须纳入实现和验收：

1. **架构分区必须是真节点**：架构框不能作为网页背景、CSS 背景或画布外装饰存在，必须是 LogicFlow 图数据里的 `group-node` 大节点。它要能被选中、拖动、缩放，能进入 JSON，能跟随缩放，并且必须随导出图片一起出现。
2. **架构大节点是底层容器**：架构大节点要放在底层，但不能盖住箭头和标签。推荐层级为：架构大节点 `zIndex = 0`，箭头和边标签 `zIndex = 100`，普通节点 `zIndex = 200`。不要使用负数层级，避免导出或历史恢复时出现不一致。
3. **架构大节点不能重叠**：拉大某个架构容器后，必须重新检查所有容器边界。服务中心、中间件、存储、CI/CD、外部系统等大节点之间要留出明确间距，不能只调整普通节点而忘记同步调整容器。
4. **普通节点必须被容器完整包含**：普通节点不能超出所属架构大节点，例如 CI/CD 节点不能越过 CI/CD 容器边框。调整普通节点排版后，必须同步复查容器尺寸、标题位置和容器之间的间距。
5. **容器标题固定顶部居中**：架构大节点标题放在容器顶部居中，不能压住内部节点，不能跑到边框外，也不能放在左上角造成汇报图观感混乱。
6. **箭头标签避让优先**：边标签不能和水平箭头重叠，不能被节点压住，不能贴着节点边缘。水平箭头的标签优先放在线段上方或下方，必要时用 `text: { value, x, y }` 显式指定坐标，并开启边标签拖拽。
7. **编辑数据实时同步，但保留源数据**：网页中拖动节点、缩放架构框、移动边标签、编辑属性后，当前 Graph JSON 必须同步更新；同时要保留初始化源图数据用于重置，不能让页面编辑覆盖 reset 的基准。
8. **撤销/重做使用 LogicFlow 自带 history**：不要再做顶部自定义“上一步 / 下一步”按钮。撤销/重做由 LogicFlow 画布控制条承担，并且执行后要同步 Graph JSON。
9. **禁止在 history 回调里改图**：`history:change` 只能同步状态或 JSON，不能调用 `setElementZIndex`、`render`、`setProperties` 等会改图的 API，否则会产生新的历史记录，导致“上一步”无限可点，或撤销后架构大节点重新盖住箭头标签。
10. **初始加载不能有可撤销步骤**：模板刚加载完成时，理论上没有任何用户操作，所以 LogicFlow 的“上一步”必须是不可用状态。初始化渲染、图层校正、控件挂载完成后，要把当前图重置为 history 的唯一基线。
11. **导出必须等同当前画布**：导出图片必须来自当前 LogicFlow 图，而不是旧数据或 DOM 背景。导出结果要和网页当前看到的一致，包含架构大节点、普通节点、箭头、标签，并且不能出现节点重叠或标签遮挡。
12. **做完数据后必须检查节点问题**：完成 `src/data/flowTemplate.js` 后必须检查重复 id、悬空边、容器重叠、节点越界、普通节点重叠、标签遮挡、导出一致性和初始 history 状态。发现问题先修数据坐标、容器尺寸、标签位置和层级，再汇报。
13. **复杂标签不要用 HTML overlay 承载**：LogicFlow `Label` HTML 覆盖层容易在缩放时相对画布坐标漂移，也可能被 Snapshot 导出遗漏。需要稳定缩放和导出时，把边标签建模为真实 LogicFlow/SVG 节点，例如 `edge-label-node`，并清空边自身 `text.value` 避免重复显示。

## Data And Layout Rules

写完 `src/data/flowTemplate.js` 后必须按这些规则检查：

- 架构分区不能是 HTML/CSS 背景，必须是 LogicFlow 内部的 `group-node` 大节点。它要进入 JSON、跟随缩放、可选中调整，并随导出图片一起导出。
- `group-node` 必须作为底层容器节点：`properties.role = 'topology-group'`，稳定 id，`zIndex` 低于普通节点；普通服务、存储、中间件、CI/CD 节点在其上方。
- 架构大节点标题必须位于容器顶部居中。不要把标题随意放在左上角、边框外或与内部节点重叠。
- 每个普通节点必须落在对应 `properties.group` 的架构大节点边界内，并保留可读边距。
- 架构大节点之间不能互相重叠。服务中心、中间件、存储、CI/CD、外部系统等容器边界要留出清晰间距。
- 普通节点之间不能重叠或贴得过近。注册中心、配置中心、网关、业务服务等控制面/业务面节点要分层摆放，避免相互遮挡。
- 箭头标签不能直接压在水平箭头或节点上。必要时用 `text: { value, x, y }` 显式放置标签，并开启/保留边标签拖拽能力。
- 标签和箭头要可读：标签建议偏离线段上/下方，并使用白底、描边或等效样式避免被线条穿过。
- 标签必须能稳定缩放和导出。若普通 edge text 被其他线段穿过，或 HTML overlay 标签在缩放/导出时不稳定，改用真实标签节点：`role = 'edge-label'`、`type = 'edge-label-node'`、`zIndex` 高于箭头和普通节点、无锚点、浅色填充、细描边、无阴影。
- 拉开普通节点后，必须同步调整架构大节点尺寸和位置；调整架构大节点后，也必须复查它们之间是否重叠。
- 上述检查未通过时，先修 `src/data/flowTemplate.js`，再汇报。不能只说“用户可以手动调整”。

## Large Spacing And Contraction Method

当用户反馈“节点重叠、标签遮挡、线太密、看不清”时，优先按这个顺序修，不要只局部挪几个点：

1. **复杂项目先拆小架构**：不要直接把所有节点塞进一张完整大图。先按架构域或业务域生成独立小架构数据，例如服务中心、中间件、存储、CI/CD、外部系统、核心业务链路。
2. **每个小架构先拉到极大间距基线**：小架构内部的容器、普通节点、标签和箭头先充分拉开，宁可局部画布很大，也不要在拥挤布局里微调。
3. **先修小架构包含关系**：父容器要完全包裹子容器和普通节点，容器标题保留顶部安全带；每次移动节点后都要同步复查容器尺寸和边界。
4. **小架构通过后再收缩**：只有在无重叠、无越界、无标题遮挡、无标签压线后，才逐步收紧小架构内部距离；一旦出现遮挡，回退到上一版安全间距。
5. **小架构全部通过后再组合大架构**：把已通过的小架构作为稳定单元合并到完整项目图里。合并时仍然先保留极大架构域间距，尤其给跨域箭头、共享中间件、共享存储和 CI/CD 留出通道。
6. **大架构组合也重复收缩流程**：完整大图先做极大间距基线，再做几何自检，最后只收缩安全空白。不要为了塞进一屏而破坏已通过的小架构内部布局。
7. **用脚本做几何自检**：至少检查容器包含、容器重叠、普通节点重叠、标签-标签重叠、标签-节点重叠、标签-标题重叠。小架构和合并后的大架构都必须检查，不要只凭截图目测通过。
8. **密集箭头分色分型**：不同关系使用相邻可区分颜色和箭头头型，例如业务流实心箭头、服务调用空心箭头、数据流菱形、依赖圆形或虚线、部署流紫色虚线。

推荐执行节奏：

```text
拆分架构域
  -> 生成小架构数据（极大间距）
  -> 小架构几何自检
  -> 小架构局部收缩
  -> 小架构再次自检
  -> 合并为完整大架构（极大间距）
  -> 大架构几何自检
  -> 大架构局部收缩
  -> 最终节点/标签/导出自检
```

## Edge Label Stability Pattern

普通 LogicFlow edge text、HTML Label overlay、真实标签节点各有取舍：

| 方案 | 适用场景 | 风险 |
|---|---|---|
| 普通 edge text | 简单图、线少、标签不被其他线穿过 | 标签在边 group 内，其他线可能从上层穿过；复杂拓扑难控层级 |
| HTML Label overlay | 需要网页交互编辑、但不强依赖导出 | 缩放时可能漂移；Snapshot 可能漏掉 HTML 内容 |
| 真实 `edge-label-node` | 复杂架构图、必须稳定缩放和导出 | 节点数增加；需要在布局检查中把它当标签处理 |

复杂架构拓扑默认优先用真实标签节点：

```js
const EDGE_LABEL_Z_INDEX = 300

function registerEdgeLabelNode(lf) {
  lf.register('edge-label-node', ({ RectNode, RectNodeModel }) => {
    class EdgeLabelNodeModel extends RectNodeModel {
      setAttributes() {
        super.setAttributes()
        this.width = this.properties?.width || 118
        this.height = this.properties?.height || 30
        this.zIndex = EDGE_LABEL_Z_INDEX
        this.autoToFront = false
        this.rotatable = false
        this.resizable = false
      }

      getDefaultAnchor() {
        return []
      }

      getNodeStyle() {
        const style = super.getNodeStyle()
        return {
          ...style,
          fill: this.properties?.labelFill || '#ffffff',
          fillOpacity: 0.98,
          stroke: this.properties?.labelStroke || '#d8dee4',
          strokeWidth: 1.2,
          radius: 5,
        }
      }
    }

    return { view: RectNode, model: EdgeLabelNodeModel }
  })
}
```

数据建模时：

- 边保留关系元信息和原始标签坐标：`properties.labelValue`、`labelX`、`labelY`。
- 边自身 `text.value` 置空，避免和标签节点重复显示。
- 为每条带标签箭头创建一个 `edge-label-node`，`properties.role = 'edge-label'`，`zIndex` 高于边和普通节点。
- 标签节点使用对应箭头的浅色 `labelFill` / `labelStroke` / `labelColor`，不要加阴影；阴影在密集图中会显得突兀并降低专业感。
- 标签节点无锚点，不参与连线，只作为可缩放、可导出、可编辑的说明牌。

## Layout Rules

- 少于 12 个节点：优先**结构拓扑 + 少量关键箭头**，保持一屏读完。
- 12-40 个节点：按**架构域**分组，例如服务中心、中间件、存储、持续集成。
- 超过 40 个节点：先做**总览拓扑图**；细节放到 `note`，必要时拆成多张图：总览图、服务调用图、数据流图、部署图。
- 系统/服务节点用 `rect`，判断/网关/路由条件可用 `diamond`，开始/结束或外部入口可用 `circle`。
- 架构分区用 `group-node` 大节点，不用 DOM 背景、CSS 背景图或画布外层装饰模拟分区。
- `group-node` 标题顶部居中，容器放在底层，且容器之间不能重叠。
- 业务节点、控制面节点、中间件节点、存储节点之间要有足够间距；不同层级之间优先用横向/纵向分层，而不是堆在同一点附近。
- 边标签必须表达关系：`feign/ribbon`、`注册`、`配置拉取`、`publish`、`consume`、`读写`、`主从复制`、`部署发布`、`失败重试` 等。
- 边标签必须避开箭头和节点。水平箭头尤其容易压住标签，默认应把标签放到线段上方或下方；密集区域允许把标签拖离中点。
- 不把大段解释塞进节点文字；节点文字短，技术细节和业务含义放右侧属性面板。
- **结构层级优先**：先让读者看懂有哪些系统和组件，再用箭头说明它们如何协作。
- **业务箭头克制**：没有业务材料时不强行补业务链路；有业务材料时只标关键链路，避免满屏交叉线。

## Required Node Review

数据和页面完成后，至少做一次**节点问题复查**：

1. 容器检查：所有 `topology-group` 大节点互不重叠，内部组件没有越界。
2. 节点检查：普通节点不重叠、不贴边、不压住容器标题。
3. 标签检查：边标签不被箭头穿过，不贴住节点，不和其他标签重叠。
4. 缩放/导出检查：架构大节点、普通节点、箭头、标签都属于 LogicFlow 图数据，缩放和导出表现一致。复杂图中的标签应使用真实 SVG/LogicFlow 节点，不使用导出不稳定的 HTML overlay。
5. 编辑同步检查：网页里拖动节点、缩放架构框、移动边标签后，当前 Graph JSON / `getGraphData()` 必须同步更新。
6. 源数据检查：必须保留初始源图数据用于“重置”，不能让网页编辑覆盖 reset 的基准数据。
7. 历史检查：“上一步 / 下一步”必须接入 LogicFlow history，并在执行后同步 Graph JSON。
8. 导出检查：导出图片必须来自当前 LogicFlow 图，且与画布当前图形一致；不能缺少架构大节点，不能导出旧坐标、旧标签或重叠版本。
9. 图层历史检查：不要在 `history:change` 里调用 `setElementZIndex`、`render`、`setProperties` 等会改图的 API；否则撤销/重做会继续写入历史，造成“上一步”无限可点，或让架构大节点重新盖住箭头标签。
10. 初始历史检查：模板刚加载完成时不能有可撤销步骤；初始化渲染、图层校正、控件挂载完成后，必须把当前图重置为 history 唯一基线。
11. 修复闭环：发现问题先改 `src/data/flowTemplate.js` 的坐标、尺寸、标签位置、层级或样式，再继续验收/汇报。

## Visual Rules

- 汇报型：克制色彩、清晰分组、标题正式。
- 微服务型：突出服务中心、注册/配置中心、中间件、存储、CI/CD。
- 研发型：突出模块边界、调用链、数据流和异常路径。
- 运维型：突出集群、环境、实例、发布链路和故障回退。
- 避免无意义装饰，不用与流程无关的插画、emoji 或过度渐变。

## Microservice Reference Shape

当用户没有给具体项目，只给“微服务架构”这类抽象主题时，可以参考下面的**结构拓扑**，但必须标注为**通用示例 / placeholder**，不要伪装成用户真实系统：

```mermaid
flowchart LR
    subgraph 服务中心
        subgraph 服务器集群1
            BS1[业务服务]
            BS2[业务服务]
        end
        subgraph 服务器集群2
            BS3[业务服务]
            BS4[业务服务]
        end
        BS1 -->|feign/ribbon| BS3
        BS2 -->|feign/ribbon| BS4

        subgraph 配置中心
            Dev[dev]
            Test[test]
            Prod[prod]
        end
    end

    subgraph 中间件
        subgraph MQ
            ActiveMQ
            RabbitMQ
            RocketMQ
            Kafka
        end
        subgraph Redis
            排行榜[zset]
            地理位置[geo]
            管道[pipeline]
        end
        subgraph 分库分表
            TDDL
            Atlas
            Sharding[JDBC]
            Mycat
        end
    end

    subgraph 存储
        RedisCluster[redis哨兵配置]
        MySQL[主库 -> 从库 -> 备库]
        FastDFS[fastdfs分布式集群]
        Stream[流媒体服务器集群]
    end

    subgraph 持续集成
        Docker
        Maven
        K8s
        Jenkins
        GitLab
    end

    注册中心 --> 服务中心
    服务中心 --> 中间件
    中间件 --> 存储
    存储 --> 持续集成
```

这类图只有**架构结构**和**技术依赖**。实际项目中必须继续分析业务链路，例如“下单请求 -> 订单服务 -> 库存服务 -> MQ -> 支付服务 -> MySQL/Redis”，并把这些逻辑用**箭头标签**叠加到拓扑图上。
