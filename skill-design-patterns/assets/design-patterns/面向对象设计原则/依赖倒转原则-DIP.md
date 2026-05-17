# 依赖倒转原则 DIP

## 摘要

依赖倒转原则，Dependency Inversion Principle，简称 DIP：高层模块不应该依赖低层模块，二者都应该依赖抽象；抽象不应该依赖细节，细节应该依赖抽象。

DIP 的重点不是“每个类都写接口”，而是让稳定的业务策略不要被数据库、网络、文件系统、第三方 SDK 等细节绑死。

## 解决的问题

如果订单服务直接 `new MySqlOrderRepository()`，那么业务逻辑会被 MySQL 实现细节耦合。换数据库、做单元测试、替换缓存策略都会修改高层业务模块。

DIP 通过抽象边界让依赖方向从“业务依赖细节”变为“业务定义需要什么，细节实现这个需要”。

## 核心思想

高层模块定义它需要的能力，低层模块实现这些能力。依赖注入、构造函数注入、接口、抽象类、函数参数都是常见手段。

原始笔记中提到 SpringBoot 三层架构。更准确地说，Controller、Service、Repository 分层不自动等于 DIP；只有当高层业务依赖稳定抽象、具体实现由容器或组合根注入时，才体现 DIP。

## 结构与角色

- 高层策略：业务规则、用例服务。
- 抽象端口：高层定义的接口，例如 `PaymentGateway`。
- 低层适配器：数据库、HTTP、消息队列、SDK 实现。
- 组合根：创建对象并注入依赖的位置，例如 Spring 容器配置。

## 适用场景

- 业务逻辑需要独立测试。
- 底层设施可能替换。
- 外部服务不稳定或难以直接测试。
- 模块边界需要清晰隔离。

## 不适用场景

- 简单脚本或一次性程序。
- 抽象只有一个实现且没有测试隔离价值。
- 为了形式主义给所有类都生成接口。

## 多语言实现

### Java

```java
interface PaymentGateway {
    void pay(String orderId, int cents);
}

final class CheckoutService {
    private final PaymentGateway gateway;

    CheckoutService(PaymentGateway gateway) {
        this.gateway = gateway;
    }

    void checkout(String orderId, int cents) {
        gateway.pay(orderId, cents);
    }
}

final class StripePaymentGateway implements PaymentGateway {
    public void pay(String orderId, int cents) {
        // call Stripe SDK
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


class PaymentGateway(Protocol):
    def pay(self, order_id: str, cents: int) -> None:
        ...


class CheckoutService:
    def __init__(self, gateway: PaymentGateway) -> None:
        self._gateway = gateway

    def checkout(self, order_id: str, cents: int) -> None:
        self._gateway.pay(order_id, cents)
```

### JavaScript

```js
class Impl { run() {} }
const service = new Impl();
service.run();
```

### TypeScript

```ts
interface PaymentGateway {
  pay(orderId: string, cents: number): Promise<void>;
}

class CheckoutService {
  constructor(private readonly gateway: PaymentGateway) {}

  async checkout(orderId: string, cents: number): Promise<void> {
    await this.gateway.pay(orderId, cents);
  }
}
```

## 优点

- 高层业务逻辑更稳定。
- 更容易替换技术细节。
- 单元测试可以隔离外部系统。
- 模块边界更清晰。

## 代价与风险

- 抽象过多会让代码绕。
- 错误抽象会泄漏底层细节。
- DI 容器配置错误可能推迟到运行时暴露。

## 常见误区

- 误区：DIP 等于每个类一个接口。
  正解：只有存在边界、替换、测试或稳定抽象需求时，接口才有价值。
- 误区：用了 Spring 就自动符合 DIP。
  正解：容器只负责装配，设计仍要看依赖是否指向稳定抽象。
- 误区：抽象必须由低层定义。
  正解：很多架构中抽象应由高层业务定义，低层适配它。

## 和其他原则/模式的关系

- OCP 常通过 DIP 达成。
- 适配器模式常用于让外部 SDK 符合高层接口。
- 策略模式通过抽象注入可替换算法。

## 检查清单

- 业务逻辑是否直接依赖数据库、HTTP SDK、文件系统？
- 测试业务逻辑是否必须启动真实外部服务？
- 抽象是否由稳定需求定义，而不是照搬底层 API？
- 是否能在组合根替换实现？
