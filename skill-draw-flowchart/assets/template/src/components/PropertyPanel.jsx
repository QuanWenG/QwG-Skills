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
        角色
        <input
          value={selectedProperties.role || ''}
          onChange={(event) => onUpdateSelected('role', event.target.value)}
        />
      </label>
      <label>
        提示词片段
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
        <p className="empty-state">选择一个节点或连线后，在这里调整文案和属性。</p>
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
