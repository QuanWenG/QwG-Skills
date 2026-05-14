export function NodeLibrary({ metadata, groups, stepTypes, onAddStep }) {
  return (
    <aside className="left-panel" aria-label="架构拓扑组件库">
      <h2>组件库</h2>
      <div className="node-list">
        {stepTypes.map((step) => (
          <button key={step.label} type="button" onClick={() => onAddStep(step)}>
            <span>{step.label}</span>
            <small>{step.properties.category}</small>
          </button>
        ))}
      </div>
      <div className="group-list">
        <h2>拓扑分区</h2>
        {groups.map((group) => (
          <div key={group.id} className={`group-item group-item-${group.id}`}>
            <strong>{group.label}</strong>
            <span>{group.description}</span>
          </div>
        ))}
      </div>
      <div className="hint-box">
        <strong>读图说明</strong>
        <p>{metadata.layoutNote}</p>
        <strong>Skill 接口</strong>
        <code>window.TopologyTemplate.getGraphData()</code>
        <code>window.TopologyTemplate.getSourceGraphData()</code>
        <code>window.TopologyTemplate.renderGraphData(data)</code>
        <code>window.TopologyTemplate.resetToSource()</code>
        <code>window.TopologyTemplate.exportJson()</code>
      </div>
    </aside>
  )
}
