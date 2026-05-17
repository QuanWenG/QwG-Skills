# 迪米特法则 LOD

## 摘要

迪米特法则，Law of Demeter，简称 LOD，也叫最少知识原则：一个对象应该尽量少了解其他对象，只和直接朋友通信。

它限制的是对象之间的过度导航和过度暴露，目标是降低耦合，而不是完全禁止对象协作。

## 解决的问题

如果代码经常出现 `order.getCustomer().getAddress().getCity().getName()`，调用方就了解了订单、客户、地址、城市的内部结构。任意中间结构变化都会影响调用方。

原始笔记中的 Socket 例子方向正确：如果一个方法只需要 IP 地址，就传 IP 地址或提供明确查询方法，不要把整个 Socket 暴露给它随便取。

## 核心思想

对象应优先和这些对象交互：

- 自己。
- 方法参数。
- 自己创建的对象。
- 自己字段持有的对象。
- 全局稳定服务。

避免对陌生对象进行长链式访问。需要的信息可以由拥有者提供一个更语义化的方法。

## 结构与角色

- 发起者：需要完成任务的对象。
- 直接朋友：发起者持有或接收的协作者。
- 陌生对象：通过朋友再获取到的对象，应避免直接依赖。
- 委派方法：由直接朋友提供的高层行为。

## 适用场景

- 链式 getter 很多。
- 对象内部结构变化经常影响外部。
- 调用方为了完成任务了解太多细节。
- 领域对象需要保护不变量。

## 不适用场景

- 流式 API 或 Builder 这类有意设计的链式调用。
- 数据传输对象 DTO 的简单读取。
- 过度封装导致只剩大量空洞转发方法。

## 多语言实现

### Java

```java
final class Customer {
    private final Address address;

    Customer(Address address) {
        this.address = address;
    }

    boolean livesIn(String city) {
        return address.isIn(city);
    }
}

final class Address {
    private final String city;

    Address(String city) {
        this.city = city;
    }

    boolean isIn(String city) {
        return this.city.equals(city);
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
class SocketInfo:
    def __init__(self, remote_ip: str) -> None:
        self.remote_ip = remote_ip


def log_remote_ip(remote_ip: str) -> None:
    print(remote_ip)


def handle(info: SocketInfo) -> None:
    log_remote_ip(info.remote_ip)
```

### JavaScript

```js
class Impl { run() {} }
const service = new Impl();
service.run();
```

### TypeScript

```ts
class Order {
  constructor(private readonly customer: Customer) {}

  shippingCity(): string {
    return this.customer.shippingCity();
  }
}

class Customer {
  constructor(private readonly address: Address) {}

  shippingCity(): string {
    return this.address.cityName();
  }
}
```

## 优点

- 降低对象间耦合。
- 内部结构更容易重构。
- 调用方更关注业务语义。
- 不变量更容易由拥有者维护。

## 代价与风险

- 可能增加委派方法。
- 过度使用会让模型变得贫血或啰嗦。
- 对纯数据对象强套 LOD 可能得不偿失。

## 常见误区

- 误区：不能使用链式调用。
  正解：问题不是语法链式，而是调用方是否依赖了陌生对象结构。
- 误区：所有字段都不能暴露。
  正解：DTO、配置对象、不可变值对象可以适度暴露数据。
- 误区：LOD 要求对象不依赖任何对象。
  正解：它要求依赖少而明确。

## 和其他原则/模式的关系

- 外观模式通过统一入口隐藏子系统细节。
- 中介者模式减少对象之间的网状依赖。
- SRP 和封装良好的对象更容易满足 LOD。

## 检查清单

- 是否存在长 getter 链？
- 调用方是否知道太多内部结构？
- 能否用一个语义化方法隐藏导航细节？
- 委派方法是否真的表达业务，而不是机械转发？
