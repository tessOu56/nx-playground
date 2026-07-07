import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

const nodeBase = {
  borderRadius: 8,
  padding: 10,
  fontSize: 13,
  fontWeight: 500,
  border: '1px solid',
  width: 150,
  textAlign: 'center' as const,
};

const nodeStyles = {
  start: {
    ...nodeBase,
    background: '#eff6ff',
    borderColor: '#3b82f6',
    color: '#1d4ed8',
  },
  process: {
    ...nodeBase,
    background: '#fefce8',
    borderColor: '#eab308',
    color: '#a16207',
  },
  decision: {
    ...nodeBase,
    background: '#fdf4ff',
    borderColor: '#a855f7',
    color: '#7e22ce',
  },
  success: {
    ...nodeBase,
    background: '#f0fdf4',
    borderColor: '#22c55e',
    color: '#15803d',
  },
  danger: {
    ...nodeBase,
    background: '#fef2f2',
    borderColor: '#ef4444',
    color: '#b91c1c',
  },
};

const horizontal = {
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
};

const initialNodes: Node[] = [
  {
    id: 'draft',
    position: { x: 0, y: 160 },
    data: { label: '📝 草稿建立' },
    style: nodeStyles.start,
    ...horizontal,
  },
  {
    id: 'submit',
    position: { x: 200, y: 160 },
    data: { label: '📤 送出審核' },
    style: nodeStyles.process,
    ...horizontal,
  },
  {
    id: 'review',
    position: { x: 400, y: 160 },
    data: { label: '🔍 內容審核' },
    style: nodeStyles.decision,
    ...horizontal,
  },
  {
    id: 'rejected',
    position: { x: 400, y: 300 },
    data: { label: '↩️ 退回修改' },
    style: nodeStyles.danger,
    sourcePosition: Position.Left,
    targetPosition: Position.Top,
  },
  {
    id: 'schedule',
    position: { x: 600, y: 160 },
    data: { label: '🗓️ 排程上架' },
    style: nodeStyles.process,
    ...horizontal,
  },
  {
    id: 'published',
    position: { x: 800, y: 160 },
    data: { label: '🚀 已發布' },
    style: nodeStyles.success,
    ...horizontal,
  },
  {
    id: 'closed',
    position: { x: 1000, y: 160 },
    data: { label: '🏁 活動結案' },
    style: nodeStyles.start,
    targetPosition: Position.Left,
  },
];

const edgeDefaults = {
  markerEnd: { type: MarkerType.ArrowClosed },
};

const initialEdges: Edge[] = [
  { id: 'e-draft-submit', source: 'draft', target: 'submit', ...edgeDefaults },
  {
    id: 'e-submit-review',
    source: 'submit',
    target: 'review',
    animated: true,
    label: '待審 3 件',
    ...edgeDefaults,
  },
  {
    id: 'e-review-schedule',
    source: 'review',
    target: 'schedule',
    label: '通過',
    ...edgeDefaults,
  },
  {
    id: 'e-review-rejected',
    source: 'review',
    target: 'rejected',
    label: '不通過',
    style: { stroke: '#ef4444' },
    ...edgeDefaults,
  },
  {
    id: 'e-rejected-draft',
    source: 'rejected',
    target: 'draft',
    type: 'step',
    style: { stroke: '#ef4444', strokeDasharray: '4 4' },
    ...edgeDefaults,
  },
  {
    id: 'e-schedule-published',
    source: 'schedule',
    target: 'published',
    animated: true,
    ...edgeDefaults,
  },
  {
    id: 'e-published-closed',
    source: 'published',
    target: 'closed',
    ...edgeDefaults,
  },
];

/**
 * 活動審核流程視覺化（React Flow POC）
 *
 * 目前為靜態 mock 流程；之後可將 nodes/edges 改為由 API 取得，
 * 並在 node data 帶入各狀態的活動數量。
 */
export function EventWorkflowFlow() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className='h-[480px] w-full rounded-lg border border-border-primary bg-white'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        proOptions={{ hideAttribution: false }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls />
        <MiniMap pannable zoomable />
      </ReactFlow>
    </div>
  );
}
