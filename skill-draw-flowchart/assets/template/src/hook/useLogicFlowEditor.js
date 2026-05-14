import { useEffect, useRef, useState } from 'react'
import LogicFlow, { OverlapMode } from '@logicflow/core'
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

const GROUP_Z_INDEX = 0
const EDGE_Z_INDEX = 100
const NODE_Z_INDEX = 200
const EDGE_LABEL_Z_INDEX = 300
const SOURCE_GRAPH = normalizeGraphLayering(cloneGraph(INITIAL_GRAPH))

function cloneGraph(graph) {
  return JSON.parse(JSON.stringify(graph))
}

function normalizeGraphLayering(graph) {
  return {
    ...graph,
    nodes: (graph.nodes || []).map((node) => ({
      ...node,
      zIndex:
        node.properties?.role === 'topology-group'
          ? GROUP_Z_INDEX
          : node.properties?.role === 'edge-label'
            ? EDGE_LABEL_Z_INDEX
            : NODE_Z_INDEX,
    })),
    edges: (graph.edges || []).map((edge) => ({
      ...edge,
      zIndex: EDGE_Z_INDEX,
    })),
  }
}

function registerTopologyGroupNode(lf) {
  lf.register('group-node', ({ RectNode, RectNodeModel }) => {
    class GroupNodeModel extends RectNodeModel {
      setAttributes() {
        super.setAttributes()
        const { width = 300, height = 180 } = this.properties || {}
        this.width = width
        this.height = height
        this.text = {
          ...this.text,
          x: this.x,
          y: this.y - this.height / 2 + 25,
        }
        this.zIndex = GROUP_Z_INDEX
        this.autoToFront = false
        this.rotatable = false
        this.resizable = true
      }

      getDefaultAnchor() {
        return []
      }

      getNodeStyle() {
        const style = super.getNodeStyle()
        return {
          ...style,
          fill: '#ffffff',
          fillOpacity: 0.46,
          stroke: '#94a3b8',
          strokeDasharray: '8 6',
          strokeWidth: 1.4,
          ...(this.properties?.style || {}),
        }
      }

      getTextStyle() {
        const style = super.getTextStyle()
        return {
          ...style,
          color: '#334155',
          fontSize: 13,
          fontWeight: 700,
        }
      }
    }

    return {
      view: RectNode,
      model: GroupNodeModel,
    }
  })
}

function registerEdgeLabelNode(lf) {
  lf.register('edge-label-node', ({ RectNode, RectNodeModel }) => {
    class EdgeLabelNodeModel extends RectNodeModel {
      setAttributes() {
        super.setAttributes()
        this.width = this.properties?.width || 118
        this.height = this.properties?.height || 30
        this.zIndex = EDGE_LABEL_Z_INDEX
        this.autoToFront = false
        this.rotatable = false
        this.resizable = false
      }

      getDefaultAnchor() {
        return []
      }

      getNodeStyle() {
        const style = super.getNodeStyle()
        return {
          ...style,
          fill: this.properties?.labelFill || '#ffffff',
          fillOpacity: 0.98,
          stroke: this.properties?.labelStroke || '#d8dee4',
          strokeWidth: 1.2,
          radius: 5,
        }
      }

      getTextStyle() {
        const style = super.getTextStyle()
        return {
          ...style,
          color: this.properties?.labelColor || '#172026',
          fontSize: 12,
          fontWeight: 650,
          lineHeight: 1.2,
          overflowMode: 'autoWrap',
          textWidth: this.width - 16,
        }
      }
    }

    return {
      view: RectNode,
      model: EdgeLabelNodeModel,
    }
  })
}

function registerColoredPolyline(lf) {
  lf.register('colored-polyline', ({ PolylineEdge, PolylineEdgeModel }) => {
    class ColoredPolylineModel extends PolylineEdgeModel {
      getEdgeStyle() {
        const style = super.getEdgeStyle()
        const stroke = this.properties?.stroke || '#64748b'
        return {
          ...style,
          stroke,
          strokeWidth: this.properties?.strokeWidth || 2,
          strokeDasharray: this.properties?.strokeDasharray,
          hoverStroke: this.properties?.hoverStroke || stroke,
          selectedStroke: this.properties?.selectedStroke || stroke,
        }
      }

      getArrowStyle() {
        const style = super.getArrowStyle()
        const stroke = this.properties?.stroke || '#64748b'
        return {
          ...style,
          stroke,
          fill: this.properties?.arrowFill || stroke,
          strokeWidth: this.properties?.strokeWidth || 2,
          endArrowType: this.properties?.arrowType || 'solid',
          offset: this.properties?.arrowOffset || 12,
          verticalLength: this.properties?.arrowLength || 6,
        }
      }
    }

    return {
      view: PolylineEdge,
      model: ColoredPolylineModel,
    }
  })
}

function enforceLayering(lf) {
  const { nodes, edges } = lf.getGraphData()
  nodes.forEach((node) => {
    const nextZIndex =
      node.properties?.role === 'topology-group'
        ? GROUP_Z_INDEX
        : node.properties?.role === 'edge-label'
          ? EDGE_LABEL_Z_INDEX
          : NODE_Z_INDEX
    if (node.zIndex !== nextZIndex) {
      lf.setElementZIndex(node.id, nextZIndex)
    }
  })
  edges.forEach((edge) => {
    if (edge.zIndex !== EDGE_Z_INDEX) {
      lf.setElementZIndex(edge.id, EDGE_Z_INDEX)
    }
  })
}

function resetHistoryBaseline(lf) {
  const currentData = lf.graphModel.modelToHistoryData?.() || lf.getGraphData()
  lf.history.undos = [cloneGraph(currentData)]
  lf.history.redos = []
  lf.history.curData = null
  lf.emit('history:change', {
    data: {
      undos: lf.history.undos,
      redos: lf.history.redos,
      undoAble: false,
      redoAble: false,
    },
  })
}

function applyEditorTheme(lf) {
  lf.setTheme({
    rect: {
      radius: 6,
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
    edgeText: {
      textWidth: 90,
      fontSize: 12,
      color: '#334155',
      background: {
        fill: '#ffffff',
        stroke: '#d8dee4',
        radius: 4,
        wrapPadding: '3px,6px',
      },
    },
    nodeText: {
      color: '#172026',
      fontSize: 13,
    },
    text: {
      color: '#172026',
      fontSize: 13,
    },
  })
}

function configureEditorMenus(lf) {
  const servicePattern =
    STEP_TYPES.find((item) => item.properties.category === 'business-service') ||
    STEP_TYPES[0]

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
        text: '添加业务服务',
        callback(position) {
          lf.addNode({
            type: servicePattern.type,
            x: position.x,
            y: position.y,
            text: servicePattern.text,
            properties: servicePattern.properties,
          })
        },
      },
    ],
  })
}

export function useLogicFlowEditor() {
  const containerRef = useRef(null)
  const lfRef = useRef(null)
  const sourceGraphRef = useRef(cloneGraph(SOURCE_GRAPH))
  const [selected, setSelected] = useState(null)
  const [graphText, setGraphText] = useState(() => stringifyGraph(SOURCE_GRAPH))
  const [status, setStatus] = useState('架构拓扑模板已载入')
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
      edgeTextDraggable: true,
      nodeTextEdit: true,
      history: false,
      overlapMode: OverlapMode.STATIC,
      plugins: [Control, DndPanel, Menu, MiniMap, SelectionSelect, Snapshot],
    })

    const syncGraph = () => {
      const data = lf.getGraphData()
      setGraphText(stringifyGraph(data))
      setStatus('拓扑图已更新')
    }

    applyEditorTheme(lf)
    registerTopologyGroupNode(lf)
    registerEdgeLabelNode(lf)
    registerColoredPolyline(lf)
    lf.render(sourceGraphRef.current)
    enforceLayering(lf)
    lf.extension.dndPanel.setPatternItems(PATTERN_ITEMS)
    configureEditorMenus(lf)
    lf.extension.miniMap.show()
    lf.options.history = true
    lf.history.watch(lf.graphModel)

    lf.on('node:click,edge:click', ({ data }) => setSelected(data))
    lf.on('blank:click', () => setSelected(null))
    lf.on('history:change', () => {
      window.requestAnimationFrame(() => {
        setGraphText(stringifyGraph(lf.getGraphData()))
      })
    })
    lf.on(
      'graph:updated,node:dnd-add,node:drop,node:resize,edge:add,edge:adjust,edge:exchange-node,node:delete,edge:delete,node:properties-change,text:update,text:drop,label:update,label:drop',
      syncGraph,
    )
    resetHistoryBaseline(lf)

    lfRef.current = lf
    const templateApi = {
      getGraphData: () => lf.getGraphData(),
      getSourceGraphData: () => cloneGraph(sourceGraphRef.current),
      renderGraphData: (data) => {
        lf.render(normalizeGraphLayering(data))
        enforceLayering(lf)
        resetHistoryBaseline(lf)
        syncGraph()
      },
      resetToSource: () => {
        lf.render(sourceGraphRef.current)
        enforceLayering(lf)
        resetHistoryBaseline(lf)
        syncGraph()
      },
      exportJson: () => stringifyGraph(lf.getGraphData()),
    }
    window.TopologyTemplate = templateApi
    window.FlowchartTemplate = templateApi

    return () => {
      delete window.TopologyTemplate
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
      const nextValue = ['width', 'height'].includes(field)
        ? Number.parseInt(value, 10) || ''
        : value
      const nextProperties = {
        ...(selected.properties || {}),
        [field]: nextValue,
      }
      lf.setProperties(selected.id, nextProperties)
      setSelected((current) => ({ ...current, properties: nextProperties }))
      if (selected.properties?.role === 'topology-group') {
        enforceLayering(lf)
      }
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
    const isGroupNode = step.properties?.role === 'topology-group'
    const isEdgeLabel = step.properties?.role === 'edge-label'
    lf.addNode({
      type: step.type,
      x,
      y,
      text: step.text,
      properties: step.properties,
      zIndex: isGroupNode
        ? GROUP_Z_INDEX
        : isEdgeLabel
          ? EDGE_LABEL_Z_INDEX
          : NODE_Z_INDEX,
    })
    enforceLayering(lf)
  }

  const renderFromJson = () => {
    const lf = lfRef.current
    if (!lf) return

    try {
      const graph = JSON.parse(graphText)
      lf.render(normalizeGraphLayering(graph))
      enforceLayering(lf)
      resetHistoryBaseline(lf)
      setSelected(null)
      setStatus('JSON 已重新渲染到画布')
    } catch (error) {
      setStatus(`JSON 无法解析: ${error.message}`)
    }
  }

  const resetGraph = () => {
    const lf = lfRef.current
    if (!lf) return

    lf.render(sourceGraphRef.current)
    enforceLayering(lf)
    resetHistoryBaseline(lf)
    setGraphText(stringifyGraph(sourceGraphRef.current))
    setSelected(null)
    setStatus('已恢复初始拓扑图')
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
    enforceLayering(lf)
    setGraphText(stringifyGraph(lf.getGraphData()))
    lf.getSnapshot('architecture-topology', {
      fileType: 'png',
      backgroundColor: '#eef2f6',
      padding: 24,
      partial: false,
      safetyFactor: 1.2,
      safetyMargin: 80,
    })
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
