import React from 'react';
import GraphComponent from './components/GraphComponent'; // Import your canvas component

export default function CanvasPage() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* 70% for Canvas */}
      <div style={{ width: '70%', borderRight: '1px solid #ccc' }}>
         <GraphComponent /> 
      </div>

      {/* 30% for Additional Information */}
       <div style={{ width: '30%', padding: '20px', backgroundColor: '#f5f5f5' }}>
         <h2>Additional Information</h2>
         <p>This section can contain any additional information you'd like to show or data related to the canvas.</p>
       </div>
    </div>
  );
}
