---
name: skill-design-patterns
description: Use when designing, reviewing, or refactoring code where Design Patterns, SOLID, high cohesion, and low coupling can guide architecture decisions；用于让 Codex 在写代码前主动用设计模式思考职责划分、依赖关系和可维护性。
---

# Skill Design Patterns

## 工作流程

1. 先识别当前代码任务的变化点、稳定点、职责边界和依赖方向，避免为了套用模式而引入不必要抽象。
2. 根据问题形态选择候选设计模式，例如创建型、结构型、行为型模式，或更轻量的 SOLID 原则、组合、接口隔离、依赖倒置。
3. 在实现前简要说明采用或不采用某个模式的理由，重点关注高内聚、低耦合、可测试性、可扩展性和现有代码风格一致性。
4. 编码时优先使用项目已有抽象、命名和模块边界；新增接口、工厂、策略、适配器、装饰器、观察者等结构必须服务于真实复杂度。
5. 完成后检查是否降低了调用方复杂度、隔离了变化点、避免了循环依赖，并补充与风险匹配的测试。

## 资源

- 只有当 Codex 需要按需读取详细资料时，才把内容放入 `references/`。
- 当任务重复、容易出错或需要稳定执行时，把自动化脚本放入 `scripts/`。
- 把可复制的模板、示例或媒体文件放入 `assets/`。

## 语言规则

当用户使用中文交流时，使用中文回应。代码标识符、命令、路径、API 名称和错误信息保持原文。生成面向用户的文档时，优先使用用户要求的语言；用户未说明时，沿用用户当前使用的语言。
