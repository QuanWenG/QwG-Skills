function PropertyForm({ selected, selectedProperties, onUpdateSelected }) {
  return (
    <div className="property-form">
      <label>
        节点文案
        <input
          value={selected.text?.value || selected.text || ''}
          onChange={(event) => onUpdateSelected('text', event.target.value)}
        />
      </label>
      <label>
        角色 / 层级
        <input
          value={selectedProperties.role || ''}
          onChange={(event) => onUpdateSelected('role', event.target.value)}
        />
      </label>
      <label>
        架构分组
        <input
          value={selectedProperties.group || ''}
          onChange={(event) => onUpdateSelected('group', event.target.value)}
        />
      </label>
      <label>
        类型
        <input
          value={selectedProperties.category || ''}
          onChange={(event) => onUpdateSelected('category', event.target.value)}
        />
      </label>
      {selectedProperties.role === 'topology-group' ? (
        <div className="dimension-grid">
          <label>
            宽度
            <input
              type="number"
              min="80"
              value={selectedProperties.width || ''}
              onChange={(event) => onUpdateSelected('width', event.target.value)}
            />
          </label>
          <label>
            高度
            <input
              type="number"
              min="60"
              value={selectedProperties.height || ''}
              onChange={(event) => onUpdateSelected('height', event.target.value)}
            />
          </label>
        </div>
      ) : null}
      <label>
        节点说明
        <textarea
          rows="6"
          value={selectedProperties.prompt || ''}
          onChange={(event) => onUpdateSelected('prompt', event.target.value)}
        />
      </label>
      <label>
        备注
        <textarea
          rows="4"
          value={selectedProperties.note || ''}
          onChange={(event) => onUpdateSelected('note', event.target.value)}
        />
      </label>
    </div>
  )
}

export function PropertyPanel({
  selected,
  graphText,
  onGraphTextChange,
  onRenderFromJson,
  onUpdateSelected,
}) {
  const selectedProperties = selected?.properties || {}

  return (
    <aside className="right-panel" aria-label="节点属性">
      <h2>微调</h2>
      {selected ? (
        <PropertyForm
          selected={selected}
          selectedProperties={selectedProperties}
          onUpdateSelected={onUpdateSelected}
        />
      ) : (
        <p className="empty-state">
          选择节点后调整分组、类型和说明；选择连线后可直接双击画布上的标签修改调用、数据流或业务含义。
        </p>
      )}

      <div className="json-panel">
        <div className="json-title">
          <h2>Graph JSON</h2>
          <button type="button" onClick={onRenderFromJson}>
            应用
          </button>
        </div>
        <textarea
          rows="13"
          spellCheck="false"
          value={graphText}
          onChange={(event) => onGraphTextChange(event.target.value)}
        />
      </div>
    </aside>
  )
}
