import ReactDOM from 'react-dom';
import * as React from 'react';
import Home from './Home';
import DataUpload from "./data_upload";
import CanvasPage from "./CanvasPage";
import Catalogue from './components/catalogue'; // New canvas component
import Song from './song';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MemoryGame from './components/memory';
import SnakeQuizGame from './components/snake';
import ConnectionsGame from './components/match';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/data_upload" element={<DataUpload />} />
        <Route path="/canvas" element={<CanvasPage />} /> 
        <Route path="/song" element={<Song/>} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/memory" element={<MemoryGame />} />
        <Route path="/snake" element={<SnakeQuizGame />} />
        <Route path="/connections" element={<ConnectionsGame />} /> 
      </Routes>
    </BrowserRouter>
  );
}
