import React from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, MiniMap, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  { id: '1', data: { label: 'Node 1' }, position: { x: 250, y: 0 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', label: 'Edge from 1 to 2' },
];

const GraphComponent = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      style={{ width: '100%', height: '100%' }}
    >
      <MiniMap />
      <Controls />
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  );
};

export default GraphComponent;
