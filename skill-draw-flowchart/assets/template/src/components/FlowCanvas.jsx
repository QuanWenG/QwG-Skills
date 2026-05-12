export function FlowCanvas({ containerRef, status }) {
  return (
    <section className="canvas-panel" aria-label="流程图画布">
      <div ref={containerRef} className="logicflow-canvas" />
      <div className="canvas-status">{status}</div>
    </section>
  )
}
