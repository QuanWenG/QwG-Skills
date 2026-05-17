# 开闭原则 OCP

## 摘要

开闭原则，Open Closed Principle，简称 OCP：软件实体应当对扩展开放，对修改关闭。

它不是说代码永远不能修改，而是说当一个变化点已经被识别并稳定出现时，后续新增同类变化应尽量通过新增实现、配置或组合完成，而不是反复修改原有稳定代码。

## 解决的问题

如果每新增一种支付方式、导出格式、消息渠道都要修改同一个 `if/else` 或 `switch`，旧逻辑会不断被影响，回归测试范围也会越来越大。OCP 要解决的是这种“新增功能必须改旧代码”的问题。

## 核心思想

找到变化点，把变化点抽象出来，让稳定部分依赖抽象，让新增部分实现抽象。

原始笔记中的程序员例子可以理解为：不同语言程序员的“写代码方式”不同，可以抽象为统一的 `Developer` 接口；新增 Go 程序员时新增一个实现，而不用修改已有 Java、Python 程序员类。

## 结构与角色

- 稳定调用方：使用抽象，不关心具体实现。
- 抽象接口：描述可扩展行为。
- 具体扩展：新增的实现类、函数或插件。
- 注册机制：通过构造函数、依赖注入、配置、工厂或映射表接入扩展。

## 适用场景

- 同类分支不断增加。
- 业务规则、渠道、算法、格式经常扩展。
- 旧逻辑稳定，新增逻辑不应影响旧逻辑。
- 需要插件化、策略化、框架扩展点。

## 不适用场景

- 变化方向尚不明确时，不应过早抽象。
- 只有一两个稳定分支时，简单条件判断可能更清楚。
- 修改的是 bug 或原有需求本身，不能为了 OCP 拒绝修改。

## 多语言实现

### Java

```java
interface DiscountPolicy {
    int discount(int cents);
}

final class VipDiscount implements DiscountPolicy {
    public int discount(int cents) {
        return (int) (cents * 0.8);
    }
}

final class OrderService {
    private final DiscountPolicy policy;

    OrderService(DiscountPolicy policy) {
        this.policy = policy;
    }

    int checkout(int cents) {
        return policy.discount(cents);
    }
}
```

### C++

```cpp
struct Service { virtual void run() = 0; virtual ~Service() = default; };
struct Impl : Service { void run() override {} };
```

### Go

```go
type Service interface{ Run() }
type Impl struct{}
func (Impl) Run() {}
```

### Kotlin

```kotlin
interface Service { fun run() }
class Impl : Service { override fun run() {} }
```

### C#

```csharp
public interface IService { void Run(); }
public sealed class Impl : IService { public void Run() {} }
```

### Python

```python
from typing import Protocol


class DiscountPolicy(Protocol):
    def discount(self, cents: int) -> int:
        ...


class VipDiscount:
    def discount(self, cents: int) -> int:
        return int(cents * 0.8)


class OrderService:
    def __init__(self, policy: DiscountPolicy) -> None:
        self._policy = policy

    def checkout(self, cents: int) -> int:
        return self._policy.discount(cents)
```

### JavaScript

```js
class Impl { run() {} }
const service = new Impl();
service.run();
```

### TypeScript

```ts
interface DiscountPolicy {
  discount(cents: number): number;
}

class VipDiscount implements DiscountPolicy {
  discount(cents: number): number {
    return Math.floor(cents * 0.8);
  }
}

class OrderService {
  constructor(private readonly policy: DiscountPolicy) {}

  checkout(cents: number): number {
    return this.policy.discount(cents);
  }
}
```

## 优点

- 新增功能影响范围小。
- 旧代码稳定性更高。
- 更容易测试新增实现。
- 支持插件化和配置化。

## 代价与风险

- 抽象过早会增加复杂度。
- 抽象设计错误会导致所有实现被迫迁就。
- 过多小类可能增加导航成本。

## 常见误区

- 误区：OCP 意味着不能修改任何旧代码。
  正解：稳定抽象尽量少改，但 bug、错误抽象、需求变化仍然需要修改。
- 误区：所有 `switch` 都违反 OCP。
  正解：稳定枚举或局部简单分支可以保留；频繁扩展的分支才更适合抽象。
- 误区：接口越多越符合 OCP。
  正解：接口必须围绕真实变化点。

## 和其他原则/模式的关系

- DIP 是实现 OCP 的常见手段。
- 策略模式、工厂方法、抽象工厂、模板方法都常用于支持 OCP。
- SRP 能帮助识别不同变化原因，从而建立扩展点。

## 检查清单

- 新增同类功能是否总要修改旧分支？
- 是否已经有稳定的变化方向？
- 调用方能否依赖抽象而非具体实现？
- 新增实现是否能独立测试？
