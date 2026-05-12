export function Topbar({
  selectionMode,
  onToggleSelection,
  onExportSnapshot,
  onResetGraph,
}) {
  return (
    <header className="topbar">
      <div>
        <h1>Prompt to HTML Flowchart</h1>
        <p>用于把用户提示词拆解为 HTML Web 页面生成流程，并保留人工微调入口。</p>
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
