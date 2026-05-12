import { FlowCanvas } from '../components/FlowCanvas'
import { NodeLibrary } from '../components/NodeLibrary'
import { PropertyPanel } from '../components/PropertyPanel'
import { Topbar } from '../components/Topbar'
import { STEP_TYPES } from '../data/flowTemplate'
import { useLogicFlowEditor } from '../hook/useLogicFlowEditor'

export function FlowchartTemplatePage() {
  const editor = useLogicFlowEditor()

  return (
    <main className="app-shell">
      <Topbar
        selectionMode={editor.selectionMode}
        onToggleSelection={editor.toggleSelection}
        onExportSnapshot={editor.exportSnapshot}
        onResetGraph={editor.resetGraph}
      />

      <section className="workspace">
        <NodeLibrary stepTypes={STEP_TYPES} onAddStep={editor.addStep} />
        <FlowCanvas containerRef={editor.containerRef} status={editor.status} />
        <PropertyPanel
          selected={editor.selected}
          graphText={editor.graphText}
          onGraphTextChange={editor.setGraphText}
          onRenderFromJson={editor.renderFromJson}
          onUpdateSelected={editor.updateSelected}
        />
      </section>
    </main>
  )
}
