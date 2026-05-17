---
name: skill-template
description: Template and tooling for bootstrapping empty Codex skill folders with Chinese Markdown guidance. Use when scaffolding a new skill, generating a minimal SKILL.md plus agents/openai.yaml skeleton, or validating that a skill folder keeps the standard structure while preserving self-hosted template generation. 用于自举创建中文 Codex skill 空框架并校验基础结构。
---

# Skill 模板

使用这个 skill 从仓库内置骨架自举创建新的空 Codex skill 文件夹，并在生成后补齐最小必要元数据。

核心产出是一个可继续编辑的空框架。`assets/skill-skeleton/`、`scripts/new-skill.ps1` 和 `scripts/validate-skill.ps1` 共同构成自举链；修改本 skill 时要保持这条链可运行。

## 工作流程

1. 确认新 skill 名称，使用小写字母、数字和短横线，例如 `web-video-presentation`。
2. 运行 `scripts/new-skill.ps1 <skill-name> <output-parent-dir>`，从 `assets/skill-skeleton/` 复制标准空框架。
3. 编辑生成的 `SKILL.md`，至少补齐 `description`，写清触发场景、输入、输出和关键边界。
4. 按目标 skill 的真实需要保留或填充可选资源目录：
   - `references/`：放 Codex 按需读取的详细指南、长示例或规范。
   - `scripts/`：放重复、容易出错或需要确定性执行的自动化脚本。
   - `assets/`：放模板、示例、媒体文件，或会被复制到用户产出中的文件。
5. 同步检查生成的 `agents/openai.yaml`，确保 `display_name`、`short_description` 和 `default_prompt` 没有停留在无效占位内容。
6. 运行 `scripts/validate-skill.ps1 <path-to-skill>` 检查生成结果；失败时先修复结构和元数据，再交付。

## 自举约束

- 保持 `assets/skill-skeleton/` 作为唯一默认骨架来源。
- 保持 `scripts/new-skill.ps1` 能在给定名称和输出父目录时创建完整目录结构。
- 保持 `scripts/validate-skill.ps1` 能校验 `SKILL.md`、`agents/openai.yaml` 和标准资源目录。
- 修改骨架文件时保留 `{{SKILL_NAME}}` 和 `{{DISPLAY_NAME}}` 占位符替换能力。
- 生成的新 skill 默认保持精简；复杂规则、长示例和领域资料由新 skill 后续放入自己的 `references/`。

## 资源

| 路径 | 用途 |
|---|---|
| `assets/skill-skeleton/` | 新 skill 的默认空框架来源 |
| `scripts/new-skill.ps1` | 从骨架创建新 skill 文件夹并替换基础占位符 |
| `scripts/validate-skill.ps1` | 检查 skill 目录的基础结构和元数据 |
| `agents/openai.yaml` | 展示名称、短描述和默认提示词 |

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

保持生成的 skill 精简。仓库级 README、变更日志或额外说明文档只在发布集合、协作维护或用户明确要求时添加。

## 验证规则

生成或修改 skill 后检查：

- `SKILL.md` 以 YAML frontmatter 开头，包含合法的 `name` 和非空 `description`。
- `name` 与 skill 文件夹名一致，且使用小写短横线格式。
- `agents/openai.yaml` 存在，展示元数据与 skill 定位一致。
- `references/`、`scripts/`、`assets/` 目录存在；空目录可用 `.gitkeep` 保留。
- 新 skill 仍可由 `scripts/new-skill.ps1` 生成，并可由 `scripts/validate-skill.ps1` 通过校验。

## 中文化原则

`name` 必须保持小写英文短横线格式。`description` 是触发入口，建议保留关键英文词并补充中文说明。正文可以使用中文 Markdown，但代码标识符、命令、路径、API 名称和错误信息应保留原文。
