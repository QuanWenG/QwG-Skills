export function Topbar({
  metadata,
  selectionMode,
  onToggleSelection,
  onExportSnapshot,
  onResetGraph,
}) {
  return (
    <header className="topbar">
      <div>
        <h1>{metadata.title}</h1>
        <p>{metadata.subtitle}</p>
        {metadata.description ? <small>{metadata.description}</small> : null}
      </div>
      <div className="topbar-actions">
        <button type="button" onClick={onToggleSelection}>
          {selectionMode ? '关闭框选' : '开启框选'}
        </button>
        <button type="button" onClick={onExportSnapshot}>
          导出图片
        </button>
        <button type="button" onClick={onResetGraph}>
          重置
        </button>
      </div>
    </header>
  )
}
