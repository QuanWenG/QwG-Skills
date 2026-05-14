export function FlowCanvas({ containerRef, status }) {
  return (
    <section className="canvas-panel" aria-label="架构系统拓扑图画布">
      <div ref={containerRef} className="logicflow-canvas" />
      <div className="canvas-status">{status}</div>
    </section>
  )
}
