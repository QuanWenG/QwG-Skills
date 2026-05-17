# 里氏替换原则 LSP

## 摘要

里氏替换原则，Liskov Substitution Principle，简称 LSP：所有引用基类的地方，都必须能够透明地使用其子类对象。

更严格地说，子类型必须保持父类型承诺的行为契约。子类可以扩展能力，但不能让调用者在不知道具体子类的情况下得到违背预期的行为。

## 解决的问题

继承容易让人误以为“代码复用”就是“语义上是同一种东西”。如果子类破坏父类行为，调用方会被迫判断具体类型，继承体系也会失去多态价值。

典型例子是正方形继承长方形。如果父类允许独立设置宽和高，正方形重写 setter 强制宽高相等，会破坏长方形调用方的预期。

## 核心思想

子类必须遵守父类契约：

- 前置条件不能更强：父类能接受的输入，子类也应接受。
- 后置条件不能更弱：父类承诺的结果，子类也要满足。
- 不变量不能被破坏：父类一直成立的状态约束，子类也要保持。
- 异常不能更意外：子类不应对父类正常支持的场景抛出新异常。

原始笔记里“子类不能覆盖父类非抽象方法”需要修正：子类可以重写方法，但重写后的行为必须符合父类契约。

## 结构与角色

- 父类型：定义稳定契约。
- 子类型：在不破坏契约的前提下扩展或特化。
- 调用方：只依赖父类型，不需要识别具体子类型。

## 适用场景

- 设计继承层级。
- 抽象类或接口有多个实现。
- 框架回调、插件、策略实现需要可替换。
- 单元测试中用 fake/mock 替换真实实现。

## 不适用场景

- 只是为了复用代码而建立继承。
- 子类和父类没有稳定的“is-a”关系。
- 子类需要禁用父类大部分能力。

## 多语言实现

### Java

```java
interface Bird {
    void eat();
}

interface FlyingBird extends Bird {
    void fly();
}

final class Sparrow implements FlyingBird {
    public void eat() {}
    public void fly() {}
}

final class Penguin implements Bird {
    public void eat() {}
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


class Readable(Protocol):
    def read(self) -> bytes:
        ...


class FileReader:
    def read(self) -> bytes:
        return b"data"


class BrokenReader:
    def read(self) -> bytes:
        raise RuntimeError("not supported")
```

### JavaScript

```js
class Impl { run() {} }
const service = new Impl();
service.run();
```

### TypeScript

```ts
interface Storage {
  get(key: string): string | undefined;
  set(key: string, value: string): void;
}

class MemoryStorage implements Storage {
  private data = new Map<string, string>();

  get(key: string): string | undefined {
    return this.data.get(key);
  }

  set(key: string, value: string): void {
    this.data.set(key, value);
  }
}
```

## 优点

- 多态调用可靠。
- 继承层级更符合业务语义。
- 测试替身更可信。
- 调用方不需要类型判断。

## 代价与风险

- 需要认真定义契约，而不仅是方法签名。
- 有时必须拆出更细接口，类数量会增加。
- 继承复用受限，需要更多组合。

## 常见误区

- 误区：只要编译通过就符合 LSP。
  正解：LSP 关注行为契约，类型系统只能检查一部分。
- 误区：子类永远不能重写父类方法。
  正解：可以重写，但不能破坏父类承诺。
- 误区：真实世界是“is-a”就适合继承。
  正解：软件中的继承取决于可替换行为，不取决于自然分类。

## 和其他原则/模式的关系

- ISP 能把过大的父接口拆开，减少 LSP 违规。
- CRP 提醒优先组合，避免错误继承。
- 策略模式要求所有策略实现都满足同一契约，本质上依赖 LSP。

## 检查清单

- 子类是否会拒绝父类允许的输入？
- 子类是否削弱父类承诺的结果？
- 调用方是否需要 `instanceof` 或类型分支？
- 子类是否通过抛异常禁用父类方法？
