---
name: skill-novelai-helper
description: Use when the user wants to convert Chinese or natural-language image ideas, reference images, character concepts, multi-character scenes, text-in-image requirements, artist-string style prompts, or existing prompts into NovelAI/NAI-style English tag prompts. Always produce separated Base prompt, Character prompt, and Undesired Content sections, include an immutable artist string plus its undesired_content from `references/artist-string-collection.md` or the user's exact artist string, and optionally add text prompts, weights, and concise Chinese notes; ask for clarification when the request is too broad or uncertain.
---

# NovelAI 标签提示词助手

这个 skill 用于把用户的中文或自然语言图像需求整理成 NovelAI/NAI 英文 tag prompt，始终拆分为 `Base prompt`、`Character prompt` 和 `Undesired Content`，并从画师串数据源中加入不可改写的画师串。

## 适用场景

- 用户描述想生成的角色、场景、姿势、服装、画风、构图、光照或氛围。
- 用户要求优化、整理、翻译或重写 NovelAI/NAI prompt。
- 用户给出参考图片，希望根据图片内容生成提示词，或说明相对原图的保留与变化。
- 用户需要多角色提示词、角色互动、角色台词、画面文字、固定角色名或作品名写法。
- 用户要求添加权重、调整 tag 顺序、补充 `Undesired Content` 或排除特定元素。
- 用户提供画师串，或需要根据画风从内置画师串目录选择合适的画师串。

## 核心原则

- `Base prompt` 和 `Character prompt` 默认使用英文 tag，tag 之间用英文逗号分隔。
- 说明、追问和取舍解释使用用户当前语言；用户用中文时用中文回应。
- 保留用户明确要求的角色、服装、场景、动作、画风、构图和禁忌元素。
- 优先使用常见、明确、可组合的 NovelAI tag，拼写保持准确。
- 用单词或短语写 tag，长句式描述只用于必要的自然语言补充。
- 不确定的细节使用通用 tag 或向用户追问；涉及特定角色、画师、版权作品或敏感属性时，避免自行编造。
- 每次生成 prompt 都必须包含画师串。用户提供画师串时原样保留；用户未提供时，从 `references/artist-string-collection.md` 选择并原样复制一个 `artist_string`。
- 每次生成 prompt 都必须输出 `Undesired Content`。优先使用所选画师串条目的 `undesired_content`，再按用户禁忌元素补充。
- 画师串是不可变数据，不能翻译、排序、去重、增删、改权重、改括号、改空格或改标点。
- `Base prompt` 只放画师串、质量、整体画风、环境、光照、氛围、镜头、构图和画幅等全局 tag。
- `Character prompt` 只放角色身份、来源、外观、服饰、动作、表情、角色专属道具和互动 tag。

## 工作流

```text
Phase 1  理解输入
   提取主体、人数、角色、身体特征、服饰、动作、表情、背景、光照、风格、构图、画师串、质量要求和限制条件
   判断是否需要追问：需求过宽、关键信息冲突、角色/来源/画师不确定、图片相似度未说明
   ▼
Phase 2  确定画师串
   有用户画师串时原样使用；没有时读取 references/artist-string-collection.md 并复制匹配的 artist_string 与 undesired_content
   ▼
Phase 3  生成 tag
   使用英文 NovelAI tag，按 Base prompt 与 Character prompt 分区，保留用户核心意图
   处理角色名、作品名、官方外观、变音符号和特殊符号
   ▼
Phase 4  处理结构
   按需要加入权重、Undesired Content、文本内容、多角色分段和互动 tag
   ▼
Phase 5  交付与自检
   输出可复制的 Base prompt、Character prompt 和 Undesired Content
   检查是否遗漏用户要求、权重是否合理、Undesired Content 是否与 Base/Character prompt 冲突
```

## 输入理解规则

识别这些信息，并只补全合理的通用细节：

- 风格：用户所需的艺术家、流派、模型倾向或整体画风。
- 画师串：用户提供的完整画师串，或需要从画师串目录选择的风格方向。
- 主体：角色数量、性别表达、年龄感、身份和角色关系。
- 角色特征：发色、发型、眼睛颜色、体型、表情、姿势和动作。
- 服饰配件：制服、休闲装、盔甲、饰品、道具和材质。
- 环境背景：室内、室外、自然风光、城市街道、时间和天气。
- 光照氛围：日光、夜景、柔光、逆光、阴影、情绪和色调。
- 镜头构图：特写、半身、全身、俯视、仰视、景深和画面比例。
- 质量限制：分辨率、细节程度、画面干净程度、禁止元素和风格偏差。

当用户只给一句很宽泛的描述时，先追问主体、场景、风格、构图或用途。用户提供图片时，先理解图片内容，再询问希望与原图保持多少相似度、哪些元素需要改变。

## 画师串数据源

画师串目录见 `references/artist-string-collection.md`。每次生成、重写或优化 prompt 时都读取该文件；读取后用于选择一个 `artist_string` 放进 `Base prompt`，并选择同条目的 `undesired_content` 作为 `Undesired Content` 基础。

画师串处理规则：

- 用户提供完整画师串时，将该画师串作为最高优先级数据源，原样放入 `Base prompt`。
- 用户要求整理已有 prompt 且其中包含可识别的完整画师串时，将该画师串原样迁移到 `Base prompt`；无法确认完整边界时先追问。
- 用户同时提供 `Undesired Content` 时，以用户原文为基础；用户只提供画师串时，从目录中选择最接近条目的 `undesired_content`。
- 用户没有提供画师串时，根据用户的画风、题材、氛围和镜头需求，从目录中选择最贴近的一条 `artist_string`，并使用同条目的 `undesired_content`。
- 复制目录里的 `artist_string` 时，完整复制该字段代码块内容；不能临时从多个条目拼接新画师串。
- `undesired_content` 与 `artist_string` 分开维护；输出时可追加用户明确排除项，也可移除与正向需求冲突的排除项。
- 输出说明可以写选择理由，但不能改写画师串本体。
- 需要新增、删除或修订画师串数据或默认 `undesired_content` 时，只修改 `references/artist-string-collection.md`，主 `SKILL.md` 不维护画师串正文。

## Tag 写法规则

- tag 必须以英文为主，使用英文逗号分隔。
- 优先选择 NovelAI 常用标签，避免非标准缩写和自造词。
- 固定角色写成 `character(source)`。
- 角色存在不同官方外观时，写成 `character(official appearance)(source)`。
- 人物名和作品名使用西文符号、空格和括号；人物名与作品名可以按 `character(source)` 紧邻书写。
- 含变音符号的角色名转换为音译写法。
- 特殊作品名或人物来源保留官方符号，例如 `Fate/Grand Order`、`NieR:Automata`、`Genshin Impact`。
- 特定细节不确定时先追问；可以用通用 tag 表达的细节，使用通用 tag。

## Prompt 分区与权重

默认按以下顺序组织 prompt：

```text
Base prompt: 画师串, 质量, 整体画风, 环境, 光照, 氛围, 构图, 镜头, 画幅
Character prompt: 角色身份与来源, 外观, 服饰, 动作, 表情, 专属道具, 角色互动, 细节补充
```

分区规则：

- 单角色、普通场景和多角色都使用 `Base prompt` + `Character prompt` 结构。
- 画风、镜头、环境、光照、色调、画幅和全局质量 tag 留在 `Base prompt`，不要混进角色段。
- 角色名、作品名、发型、眼睛、服装、姿势、表情、身体特征和角色专属道具放进对应 `Character prompt`。
- 多角色共用的动作或关系可在各角色段中用方向明确的互动 tag 表达；全局关系氛围可放在 `Base prompt`。
- 避免同一 tag 在 `Base prompt` 和角色段重复出现，除非用户明确要求强化。

权重规则：

- `{tag}` 强化约 1.1 倍。
- `{{tag}}` 可进一步强化，但只用于用户明确强调的核心元素。
- `[tag]` 弱化约 0.9 倍。
- `n::tag::` 表示按数字 `n` 强化，前一个 `数字::` 为开始，后一个 `::` 为结束。
- 使用 `n::tag::` 时，如果 tag 末尾是数字，在 tag 后加空格再闭合，避免数字和 `::` 连在一起造成解析歧义。
- 权重会影响该 tag 背后关联的参考元素；权重过高或过低容易引入不想要的内容，默认保持克制。

## Undesired Content

每次都输出 `Undesired Content`。默认来自所选画师串条目的 `undesired_content`，并可用于排除：

- 低质量、低分辨率、模糊、过曝、欠曝。
- 错误肢体、手指错误、额外肢体、解剖问题。
- 额外人物、错误人数、重复角色。
- 文字、水印、签名、logo。
- 用户不想要的风格、服装、场景、表情或构图。

如果用户要求画面文字，`Undesired Content` 中不要加入会冲突的 `text`、`letters` 等排除项；如果画师串条目的 `undesired_content` 已包含这些排除项，输出时删除冲突项。

## 文本提示词

当用户要求画面中出现文字、标语、对白或台词时：

- 将文本内容放在 prompt 末尾，和 tag 段落之间空一行。
- 第一段文本写成 `TEXT:内容`。
- 多个文本内容继续换行分段，只有第一个文本内容需要写 `TEXT:`。
- 多角色说不同文本时，用简短自然语言描述谁说了什么，或先向用户确认角色和台词对应关系，降低歧义。

示例格式：

```text
masterpiece, best quality, 1girl, smile, classroom

TEXT:Hello

Good morning
```

## 多角色提示词

用户说明多角色时：

- 先输出 `Base prompt`，其中包含画师串、质量、画风、环境、光照、镜头和共同氛围。
- 再分别输出 `Character 1 prompt`、`Character 2 prompt` 等角色段，每段只写该角色的身份、特征、动作、服饰、表情和专属道具。
- 多角色互动时，目标角色使用 `target#action`，动作源使用 `source#action`。
- 多个角色做相同或镜像动作时，使用 `mutual#action`。
- 角色差异容易混淆时，保持分段输出；必要时提醒用户在使用前按平台支持格式合并。

## 输出格式

单角色或普通场景默认输出：

````markdown
Base prompt
```text
<artist_string>, <quality, global style, scene, lighting, mood, composition, camera>
```

Character prompt
```text
<identity, source, appearance, clothing, pose, expression, character-specific props>
```

Undesired Content
```text
<undesired_content, user-specific exclusions>
```

说明：<必要时用一小段中文说明关键取舍>
````

多角色默认输出：

````markdown
Base prompt
```text
<artist_string>, <quality, global style, scene, lighting, mood, composition, camera>
```

Character 1 prompt
```text
<identity, appearance, clothing, pose, expression>
```

Character 2 prompt
```text
<identity, appearance, clothing, pose, expression>
```

Undesired Content
```text
<undesired_content, user-specific exclusions>
```
````

用户明确要求“只给提示词”时，只输出可复制的 prompt，不附说明。

## 自检清单

交付前检查：

- `Base prompt` 和 `Character prompt` 是否以英文 tag 为主，并用英文逗号分隔。
- 是否输出了 `Base prompt` 和 `Character prompt`，且单角色、多角色都遵守该结构。
- `Base prompt` 是否包含一个画师串，且该画师串来自用户原文或 `references/artist-string-collection.md`。
- 画师串是否保持原样，没有翻译、排序、去重、增删、改权重、改括号、改空格或改标点。
- tag 是否按 Base/Character 分区，画风、镜头和环境没有混入角色段。
- 用户明确要求的角色、服装、场景、动作、文字和禁忌元素是否保留。
- 不确定的角色、画师、来源、敏感属性或图片相似度是否已追问或用通用 tag 处理。
- 权重是否只用于核心元素，且没有过度堆叠。
- 多角色是否拆分清楚，共有元素是否前置，互动 tag 是否标明方向。
- `Undesired Content` 是否输出，是否使用了所选画师串条目的 `undesired_content`，且没有和 Base/Character prompt 冲突。
- 输出是否可以直接复制使用。

## 资源索引

| 资源 | 何时读取 | 用途 |
|---|---|---|
| `references/artist-string-collection.md` | 每次生成、重写或优化 NovelAI/NAI prompt 时 | 选择并原样复制 `artist_string`，读取同条目的 `undesired_content` 作为 Undesired Content 基础 |

## 语言规则

当用户使用中文交流时，使用中文回应。代码标识符、命令、路径、API 名称和错误信息保持原文。生成面向用户的文档时，优先使用用户要求的语言；用户未说明时，沿用用户当前使用的语言。
