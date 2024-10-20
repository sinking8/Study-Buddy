import React, { useState, useEffect } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, MiniMap, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import apiClient from '../config/axios_config';  // Your axios configuration


const GraphComponent = () => {
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);  // React Flow hooks for nodes
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);  // React Flow hooks for edges
  const [loading, setLoading] = useState(true);  // Track loading state
  const [error, setError] = useState(null);      // Track error state

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await apiClient.get('/get_nodes').then(res=>{
          return res.data;
        }).then(res=>{
          setNodes(res.data.nodes);
          setEdges(res.data.Edges);
          setLoading(false);

        });  // Fetch from FastAPI
      } catch (error) {
        setError("Error fetching graph data: " + error.message);
        setLoading(false);  
      }
    };

    fetchGraphData();
  }, []);  // Run this effect only once on component mount

  

  if (error) {
    return <div>{error}</div>;  // Show error message if there was a problem fetching the data
  }
  
  if (loading) {
    return <div>Loading canvas...</div>; 
  }
  else
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}  // Required for moving nodes
      onEdgesChange={onEdgesChange}  // Handle edge updates
      onConnect={(params) => setEdges((eds) => addEdge(params, eds))}
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
