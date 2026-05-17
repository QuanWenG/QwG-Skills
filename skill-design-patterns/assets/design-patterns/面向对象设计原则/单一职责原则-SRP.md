# 单一职责原则 SRP

## 摘要

单一职责原则，Single Responsibility Principle，简称 SRP，是面向对象设计中控制模块粒度和变化范围的原则。它的经典表述是：一个模块应该只有一个引起它变化的原因。

这里的“模块”可以是类、函数、包、组件或微服务，不只限于类。SRP 不是要求一个类只能有一个方法，也不是要求把所有逻辑拆到极细；它要求同一个模块内的职责属于同一个变化方向。

## 解决的问题

当一个类同时承担多种职责时，不同需求会迫使同一个类反复修改。例如一个 `Report` 类既负责计算报表数据，又负责生成 HTML，又负责发送邮件，那么统计口径、页面样式、邮件渠道任意一个变化都会修改这个类。结果是：

- 修改范围变大。
- 测试范围变大。
- 多人协作容易冲突。
- 一处变化可能意外影响另一处职责。

SRP 的目标是把不同变化原因拆开，让每个模块的修改理由尽量单一。

## 核心思想

判断一个模块是否违反 SRP，不要只看“它做了几件事”，而要看“这些事是否会因为不同原因变化”。

例如用户注册流程可能包含参数校验、密码哈希、保存用户、发送欢迎邮件。它们都服务于“完成注册”这个用例，但密码策略、数据库结构、邮件模板分别有不同变化原因，所以通常应该拆成校验器、密码服务、用户仓储、通知服务，再由注册服务编排。

原始笔记中提到 People、程序员、外卖员的例子。更严谨的理解是：如果“写代码”和“送外卖”属于不同业务能力，不应该都塞进同一个 `People` 类；是否用继承不是重点，很多时候组合和接口比继承更合适。

## 结构与角色

- 职责拥有者：负责一个稳定职责的类或模块。
- 协作者：被职责拥有者调用的外部服务，例如仓储、通知、格式化器。
- 编排者：当一个用例必须串联多个职责时，使用一个较薄的应用服务进行编排。

## 适用场景

- 一个类越来越大，修改频繁且原因不同。
- 测试一个小功能必须构造很多无关依赖。
- 同一个类里同时出现业务计算、数据访问、展示格式、网络调用。
- 团队协作中多人经常修改同一个文件的不同部分。

## 不适用场景

- 为了“纯粹”把几个强相关、总是一起变化的操作拆散。
- 在业务尚不清晰时过早拆出大量只有一个方法的类。
- 把 SRP 理解为“每个类只能有一个 public 方法”。

## 多语言实现

### Java

```java
final class Invoice {
    private final int quantity;
    private final int unitPrice;

    Invoice(int quantity, int unitPrice) {
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    int total() {
        return quantity * unitPrice;
    }
}

final class InvoicePrinter {
    String print(Invoice invoice) {
        return "Total: " + invoice.total();
    }
}

final class InvoiceRepository {
    void save(Invoice invoice) {
        // persist invoice
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
from dataclasses import dataclass


@dataclass(frozen=True)
class Invoice:
    quantity: int
    unit_price: int

    def total(self) -> int:
        return self.quantity * self.unit_price


class InvoiceFormatter:
    def to_text(self, invoice: Invoice) -> str:
        return f"Total: {invoice.total()}"


class InvoiceStore:
    def save(self, invoice: Invoice) -> None:
        pass
```

### JavaScript

```js
class Impl { run() {} }
const service = new Impl();
service.run();
```

### TypeScript

```ts
type Invoice = {
  quantity: number;
  unitPrice: number;
};

function calculateTotal(invoice: Invoice): number {
  return invoice.quantity * invoice.unitPrice;
}

class InvoiceFormatter {
  toText(invoice: Invoice): string {
    return `Total: ${calculateTotal(invoice)}`;
  }
}

class InvoiceApi {
  async save(invoice: Invoice): Promise<void> {
    await fetch("/api/invoices", {
      method: "POST",
      body: JSON.stringify(invoice),
    });
  }
}
```

## 优点

- 修改影响面小。
- 单元测试更直接。
- 模块更容易复用。
- 命名更清楚，代码意图更明显。

## 代价与风险

- 过度拆分会增加跳转成本。
- 太早抽象可能产生无意义的服务类。
- 如果边界划错，会让本该内聚的逻辑分散。

## 常见误区

- 误区：一个类只能做一件非常微小的事。
  正解：一个类可以有多个方法，只要它们服务于同一个职责和变化原因。
- 误区：SRP 必须通过继承实现。
  正解：SRP 更常通过组合、函数拆分、模块拆分、分层实现。
- 误区：工具类天然符合 SRP。
  正解：很多 `Utils` 类会变成无边界职责集合，反而违反 SRP。

## 和其他原则/模式的关系

- 开闭原则：职责拆清后，更容易通过扩展某个职责实现变化。
- 依赖倒转原则：拆分职责后，常用抽象隔离高层策略和底层细节。
- 策略模式：常用于把一组可替换算法从原类中拆出。
- 外观模式：可以用一个统一入口编排多个单一职责模块。

## 检查清单

- 这个模块是否有多个不同的修改理由？
- 这个模块是否同时处理业务、存储、展示、通信？
- 修改一个职责时，是否容易破坏另一个职责？
- 测试某个职责时，是否需要大量无关依赖？
