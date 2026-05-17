# 合成复用原则 CRP

## 摘要

合成复用原则，Composite Reuse Principle，简称 CRP：优先使用对象组合，而不是通过类继承达到复用目的。

它不是禁止继承，而是提醒：继承会把父类实现细节、生命周期和行为契约都带给子类；如果只是想复用能力，组合通常更灵活。

## 解决的问题

为了复用数据库连接、日志、缓存、校验等能力而继承某个工具类，会让子类和父类强耦合。父类一改，子类可能被动变化；子类也会暴露父类不该暴露的方法。

原始笔记中 A 类实现连接数据库，B 类需要复用时不建议继承 A，而是把 A 作为依赖传入 B，这正是 CRP 的核心。

## 核心思想

组合表达“has-a / uses-a”，继承表达“is-a”。如果 B 不是 A 的一种，只是需要 A 的能力，就用组合。

## 结构与角色

- 被复用对象：提供可复用能力。
- 使用者对象：持有被复用对象，通过委派完成工作。
- 抽象接口：可选，用于隔离具体实现。

## 适用场景

- 只是复用代码，不存在严格 is-a 关系。
- 需要运行时替换能力。
- 需要组合多个独立能力。
- 父类变化容易影响子类。

## 不适用场景

- 子类确实是父类的可替换特化。
- 框架要求继承特定基类。
- 模板方法模式中需要通过继承开放步骤。

## 多语言实现

### Java

```java
interface Logger {
    void info(String message);
}

final class ConsoleLogger implements Logger {
    public void info(String message) {
        System.out.println(message);
    }
}

final class UserService {
    private final Logger logger;

    UserService(Logger logger) {
        this.logger = logger;
    }

    void createUser(String name) {
        logger.info("create user " + name);
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
class Cache:
    def get(self, key: str) -> str | None:
        return None


class ProductService:
    def __init__(self, cache: Cache) -> None:
        self._cache = cache

    def find_name(self, product_id: str) -> str:
        cached = self._cache.get(product_id)
        return cached or "unknown"
```

### JavaScript

```js
class Impl { run() {} }
const service = new Impl();
service.run();
```

### TypeScript

```ts
interface Clock {
  now(): Date;
}

class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }
}

class TokenService {
  constructor(private readonly clock: Clock) {}

  expired(expiresAt: Date): boolean {
    return this.clock.now() >= expiresAt;
  }
}
```

## 优点

- 耦合更低。
- 可运行时替换依赖。
- 更容易测试。
- 避免继承层级膨胀。

## 代价与风险

- 需要显式转发方法。
- 对象装配略复杂。
- 如果所有组合都无抽象，也可能产生具体类耦合。

## 常见误区

- 误区：继承一定不好。
  正解：稳定 is-a 关系和框架扩展点中继承仍有价值。
- 误区：组合就是把任何对象塞进字段。
  正解：组合应表达清晰协作关系。
- 误区：组合不需要接口。
  正解：如果需要替换和测试，组合常与 DIP 一起使用。

## 和其他原则/模式的关系

- 装饰、代理、适配器、桥接都大量使用组合。
- LSP 帮助判断继承是否合理。
- DIP 让组合依赖抽象而非具体细节。

## 检查清单

- 当前继承是否只是为了复用代码？
- 子类是否暴露了不该有的父类方法？
- 是否需要运行时替换复用能力？
- 组合后是否能让测试更简单？
