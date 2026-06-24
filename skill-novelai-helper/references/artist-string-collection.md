# 画师串收集 Skill

本文件是 `skill-novelai-helper` 的画师串数据源。主 skill 生成、重写或优化 NovelAI/NAI prompt 时，必须从这里选择一条 `artist_string` 和同条目的 `undesired_content`，或使用用户提供的完整画师串。

## 使用规则

- `artist_string` 是不可变数据。复制时保持代码块内容完全一致。
- 不能翻译、排序、去重、增删、改权重、改括号、改空格或改标点。
- 主 skill 不能从多个条目拼接新画师串。
- `undesired_content` 是同条目的默认反向提示词，输出时可追加用户明确排除项，也可删除与正向需求冲突的项。
- 用户提供完整画师串时，用户原文优先于本文件目录。
- 新增画师串时，按现有条目格式追加：`id`、`description`、`best_for`、`artist_string`、`undesired_content`。

## 画师串目录

### balanced-anime-clean

description: 干净明亮的通用二次元插画风，适合单角色、半身、头像、日常服饰和轻场景。

best_for: 通用角色图、校园、室内、清爽色彩、轻柔光照。

artist_string:

```text
1girl, 1.44::artist:houkisei ::, 1.40::artist:ogipote ::, 1.38::artist:melailai ::, 1.44::artist:tidsean ::, 1.48::artist:atdan ::, 1.42::artist:arsenixc
::, 1.48::artist:yolanda ::, 1.46::artist:sylvia_(huajiuhuajiu) ::, 1.40::artist:fal_maro ::, 1.36::artist:hiten_(hitenkei) ::, 1.40::artist:miv4t ::,
1.44::artist:mocha_(cotton) ::, 1.46::artist:momoko_(momopoco) ::, 1.46::artist:piromizu ::, 1.34::artist:huwari_(dnwls3010) ::,
1.38::artist:shanguier ::, 1.44::artist:hjl ::, 1.48::artist:meion ::, 1.48::artist:neko_(yanshoujie) ::, 1.52::artist:haneru ::, 1.52::artist:aoi
sakura (seak5545) ::, 1.42::artist:yuyu_(yuyuworks) ::, 1.48::artist:paint_musume ::, 1.42::artist:torino_aqua ::, year 2024, realistic,
perspective, colorful, amazing quality, absurdres, highly detailed, very aesthetic, masterpiece, no tex
```

undesired_content:

```text
artist collaboration, ai-generated, ai-assisted, 2.00::chibi, character doll, button badge, card background, photo (object), bad hands,
everyone, bad feet, wrong foot ::
```
