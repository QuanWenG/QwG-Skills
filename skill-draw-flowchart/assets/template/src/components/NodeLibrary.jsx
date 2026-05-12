export function NodeLibrary({ stepTypes, onAddStep }) {
  return (
    <aside className="left-panel" aria-label="流程节点库">
      <h2>节点库</h2>
      <div className="node-list">
        {stepTypes.map((step) => (
          <button key={step.label} type="button" onClick={() => onAddStep(step)}>
            <span>{step.label}</span>
            <small>{step.properties.role}</small>
          </button>
        ))}
      </div>
      <div className="hint-box">
        <strong>Skill 接口</strong>
        <code>window.FlowchartTemplate.getGraphData()</code>
        <code>window.FlowchartTemplate.renderGraphData(data)</code>
        <code>window.FlowchartTemplate.setPrompt(prompt)</code>
      </div>
    </aside>
  )
}
