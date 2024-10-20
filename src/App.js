import * as React from 'react';
import Home from './Home';
import DataUpload from "./data_upload";
import CanvasPage from "./CanvasPage"; // New canvas component


import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/data_upload" element={<DataUpload />} />
        <Route path="/canvas" element={<CanvasPage />} /> 
      </Routes>
    </BrowserRouter>
  );
}
