---
name: skill-template
description: Template and tooling for creating empty Codex skill folders with Chinese Markdown guidance. Use when scaffolding a new skill, generating a standard Chinese SKILL.md plus agents/openai.yaml skeleton, or checking that a skill folder follows the recommended Codex skill structure. 用于生成中文 Markdown 的 Codex skill 模板。
---

# Skill 模板

使用这个 skill 从可复用骨架创建一个新的空 Codex skill。

## 工作流程

1. 选择小写短横线格式的 skill 名称，例如 `web-video-presentation`。
2. 运行 `scripts/new-skill.ps1 <skill-name> <output-parent-dir>` 生成新的 skill 文件夹。
3. 编辑生成的 `SKILL.md` 中的 `description`，明确说明 Codex 应该在什么场景使用这个 skill。
4. 仅在确实需要时添加可选资源：
   - `references/`：放置 Codex 需要按需读取的详细指南。
   - `scripts/`：放置可重复执行、容易出错或需要确定性的自动化脚本。
   - `assets/`：放置模板、示例、媒体文件，或会被复制到用户输出中的文件。
5. 在使用或发布 skill 前，运行 `scripts/validate-skill.ps1 <path-to-skill>` 检查结构和元数据。

## 资源

- 从 `assets/skill-skeleton/` 复制起始文件。
- 使用 `scripts/new-skill.ps1` 从骨架创建新的 skill。
- 使用 `scripts/validate-skill.ps1` 检查基础结构和元数据。

## 推荐结构

```text
skill-name/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── references/
├── scripts/
└── assets/
```

保持生成的 skill 精简。除非这个 skill 是大型公开集合的一部分，并且确实需要仓库级文档，否则不要添加 README、变更日志或额外说明文档。

## 中文化原则

`name` 必须保持小写英文短横线格式。`description` 是触发入口，建议保留关键英文词并补充中文说明。正文可以使用中文 Markdown，但代码标识符、命令、路径、API 名称和错误信息应保留原文。
