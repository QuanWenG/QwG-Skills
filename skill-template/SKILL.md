---
name: skill-template
description: Template and tooling for creating empty Codex skill folders. Use when scaffolding a new skill, generating a standard SKILL.md plus agents/openai.yaml skeleton, or checking that a skill folder follows the recommended Codex skill structure.
---

# Skill Template

Use this skill to create a new empty Codex skill from a reusable skeleton.

## Workflow

1. Choose a lowercase hyphen-case skill name, for example `web-video-presentation`.
2. Run `scripts/new-skill.ps1 <skill-name> <output-parent-dir>` to generate a new skill folder.
3. Edit the generated `SKILL.md` description so it clearly states when Codex should use the skill.
4. Add optional resources only when needed:
   - `references/` for detailed guidance Codex should read on demand.
   - `scripts/` for repeatable executable automation.
   - `assets/` for templates, examples, media, or files copied into user output.
5. Run `scripts/validate-skill.ps1 <path-to-skill>` before using or publishing the skill.

## Resources

- Copy starter files from `assets/skill-skeleton/`.
- Use `scripts/new-skill.ps1` to create a fresh skill from the skeleton.
- Use `scripts/validate-skill.ps1` to check basic structure and metadata.

## Recommended Structure

```text
skill-name/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── references/
├── scripts/
└── assets/
```

Keep the generated skill lean. Do not add README files, changelogs, or extra docs unless the skill is part of a larger public collection that needs repository-level documentation.
