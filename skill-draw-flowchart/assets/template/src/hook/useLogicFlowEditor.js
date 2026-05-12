import { useEffect, useRef, useState } from 'react'
import LogicFlow from '@logicflow/core'
import {
  Control,
  DndPanel,
  Menu,
  MiniMap,
  SelectionSelect,
  Snapshot,
} from '@logicflow/extension'
import { INITIAL_GRAPH, PATTERN_ITEMS, STEP_TYPES } from '../data/flowTemplate'
import { stringifyGraph } from '../data/graphUtils'

function applyEditorTheme(lf) {
  lf.setTheme({
    rect: {
      radius: 8,
      stroke: '#32746d',
      strokeWidth: 1.5,
      fill: '#f6fbf9',
    },
    diamond: {
      stroke: '#b85c38',
      strokeWidth: 1.5,
      fill: '#fff7ed',
    },
    circle: {
      stroke: '#485a7d',
      strokeWidth: 1.5,
      fill: '#f4f7ff',
    },
    polyline: {
      stroke: '#6b7280',
      strokeWidth: 1.5,
      hoverStroke: '#32746d',
      selectedStroke: '#32746d',
    },
    text: {
      color: '#172026',
      fontSize: 13,
    },
  })
}

function configureEditorMenus(lf) {
  lf.setMenuConfig({
    nodeMenu: [
      {
        text: '复制节点',
        callback(node) {
          lf.cloneNode(node.id)
        },
      },
      {
        text: '删除节点',
        callback(node) {
          lf.deleteNode(node.id)
        },
      },
    ],
    edgeMenu: [
      {
        text: '删除连线',
        callback(edge) {
          lf.deleteEdge(edge.id)
        },
      },
    ],
    graphMenu: [
      {
        text: '添加提示词节点',
        callback(position) {
          lf.addNode({
            type: 'rect',
            x: position.x,
            y: position.y,
            text: '新提示词',
            properties: STEP_TYPES[0].properties,
          })
        },
      },
    ],
  })
}

export function useLogicFlowEditor() {
  const containerRef = useRef(null)
  const lfRef = useRef(null)
  const [selected, setSelected] = useState(null)
  const [graphText, setGraphText] = useState(() => stringifyGraph(INITIAL_GRAPH))
  const [status, setStatus] = useState('模板已载入')
  const [selectionMode, setSelectionMode] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return undefined

    const lf = new LogicFlow({
      container: containerRef.current,
      grid: true,
      stopScrollGraph: true,
      stopZoomGraph: false,
      adjustEdge: true,
      edgeTextEdit: true,
      nodeTextEdit: true,
      plugins: [Control, DndPanel, Menu, MiniMap, SelectionSelect, Snapshot],
    })

    const syncGraph = () => {
      const data = lf.getGraphData()
      setGraphText(stringifyGraph(data))
      setStatus('流程已更新')
    }

    applyEditorTheme(lf)
    lf.render(INITIAL_GRAPH)
    lf.extension.dndPanel.setPatternItems(PATTERN_ITEMS)
    configureEditorMenus(lf)
    lf.extension.miniMap.show()

    lf.on('node:click,edge:click', ({ data }) => setSelected(data))
    lf.on('blank:click', () => setSelected(null))
    lf.on(
      'node:dnd-add,node:drop,edge:add,node:delete,edge:delete,node:properties-change,text:update',
      syncGraph,
    )

    lfRef.current = lf
    window.FlowchartTemplate = {
      getGraphData: () => lf.getGraphData(),
      renderGraphData: (data) => {
        lf.render(data)
        syncGraph()
      },
      setPrompt: (prompt) => {
        lf.setProperties('prompt', { ...STEP_TYPES[0].properties, prompt })
        syncGraph()
      },
      exportJson: () => stringifyGraph(lf.getGraphData()),
    }

    return () => {
      delete window.FlowchartTemplate
      lfRef.current = null
      lf.destroy()
    }
  }, [])

  const updateSelected = (field, value) => {
    const lf = lfRef.current
    if (!lf || !selected) return

    if (field === 'text') {
      lf.updateText(selected.id, value)
      setSelected((current) => ({ ...current, text: { value } }))
    } else {
      const nextProperties = {
        ...(selected.properties || {}),
        [field]: value,
      }
      lf.setProperties(selected.id, nextProperties)
      setSelected((current) => ({ ...current, properties: nextProperties }))
    }

    setGraphText(stringifyGraph(lf.getGraphData()))
    setStatus('属性已保存')
  }

  const addStep = (step) => {
    const lf = lfRef.current
    if (!lf) return

    const { nodes } = lf.getGraphData()
    const x = 160 + (nodes.length % 4) * 210
    const y = 330 + Math.floor(nodes.length / 4) * 120
    lf.addNode({
      type: step.type,
      x,
      y,
      text: step.text,
      properties: step.properties,
    })
  }

  const renderFromJson = () => {
    const lf = lfRef.current
    if (!lf) return

    try {
      const graph = JSON.parse(graphText)
      lf.render(graph)
      setSelected(null)
      setStatus('JSON 已重新渲染到画布')
    } catch (error) {
      setStatus(`JSON 无法解析: ${error.message}`)
    }
  }

  const resetGraph = () => {
    const lf = lfRef.current
    if (!lf) return

    lf.render(INITIAL_GRAPH)
    setGraphText(stringifyGraph(INITIAL_GRAPH))
    setSelected(null)
    setStatus('已恢复初始流程')
  }

  const toggleSelection = () => {
    const lf = lfRef.current
    if (!lf) return

    const next = !selectionMode
    setSelectionMode(next)
    lf.setSelectionSelectMode(next)
    setStatus(next ? '框选模式已开启' : '框选模式已关闭')
  }

  const exportSnapshot = () => {
    const lf = lfRef.current
    if (!lf) return
    lf.getSnapshot('prompt-html-flowchart')
  }

  return {
    containerRef,
    selected,
    graphText,
    status,
    selectionMode,
    setGraphText,
    updateSelected,
    addStep,
    renderFromJson,
    resetGraph,
    toggleSelection,
    exportSnapshot,
  }
}
