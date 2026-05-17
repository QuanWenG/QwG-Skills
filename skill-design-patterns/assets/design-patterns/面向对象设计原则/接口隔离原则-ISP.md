# 接口隔离原则 ISP

## 摘要

接口隔离原则，Interface Segregation Principle，简称 ISP：客户端不应该依赖它不需要的接口。

它强调接口粒度要服务于使用者。一个大而全的接口会迫使实现类提供无意义方法，也会让调用方依赖不相关能力。

## 解决的问题

假设 `Device` 接口包含 `getCpu()`、`getMemory()`、`rotate()`、`print()`。电脑、风扇、打印机都实现这个接口时，大量方法对某些设备没有意义，只能返回空值或抛异常。这会破坏可替换性，也让调用方难以知道哪些能力真实可用。

## 核心思想

按客户端需要拆分接口，而不是按“对象可能拥有的所有能力”堆叠接口。接口应该小而内聚，多个能力可以通过组合接口表达。

原始笔记中“精密计算机设备类”和“普通类”的方向是对的：不要让普通设备依赖 CPU、内存等计算机专属能力。

## 结构与角色

- 客户端接口：面向某一类调用方的最小能力集合。
- 具体实现：可实现一个或多个小接口。
- 组合接口：当某些场景确实需要多个能力时再组合。

## 适用场景

- 接口方法很多，实现类经常空实现。
- 调用方只使用接口的一小部分。
- 一个接口被多类对象勉强实现。
- 需要提升 LSP，避免“不支持”的方法。

## 不适用场景

- 方法天然内聚且总是一起使用。
- 过度拆分导致调用方需要携带大量微接口。
- 为了拆而拆，破坏领域概念完整性。

## 多语言实现

### Java

```java
interface Printable {
    void print(String text);
}

interface Scannable {
    byte[] scan();
}

final class SimplePrinter implements Printable {
    public void print(String text) {}
}

final class MultiFunctionPrinter implements Printable, Scannable {
    public void print(String text) {}
    public byte[] scan() { return new byte[0]; }
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


class Printable(Protocol):
    def print(self, text: str) -> None:
        ...


def print_report(printer: Printable, text: str) -> None:
    printer.print(text)
```

### JavaScript

```js
class Impl { run() {} }
const service = new Impl();
service.run();
```

### TypeScript

```ts
interface CpuInfo {
  cpu(): string;
}

interface MemoryInfo {
  memoryGb(): number;
}

interface Rotatable {
  rotate(speed: number): void;
}

class Fan implements Rotatable {
  rotate(speed: number): void {}
}
```

## 优点

- 实现类不需要无意义方法。
- 调用方依赖更少。
- 更符合 LSP。
- 接口变更影响范围更小。

## 代价与风险

- 接口数量会增加。
- 拆分边界不当会让使用变繁琐。
- 需要良好命名，否则小接口难以理解。

## 常见误区

- 误区：接口越小越好。
  正解：接口要围绕客户端需求保持内聚，不是机械拆到单方法。
- 误区：一个类只能实现一个接口。
  正解：一个对象可以组合多个能力接口。
- 误区：ISP 只适用于 Java 接口。
  正解：函数参数、TypeScript interface、Python Protocol 都适用。

## 和其他原则/模式的关系

- LSP：小接口减少子类禁用方法的可能。
- DIP：高层依赖小接口比依赖大接口更稳定。
- 适配器模式：可以把大接口或旧接口适配成客户端需要的小接口。

## 检查清单

- 实现类是否有空实现、默认异常或无意义返回值？
- 调用方是否只使用接口的一两个方法？
- 接口变化是否影响很多无关客户端？
- 是否可以按能力或使用场景拆分？
