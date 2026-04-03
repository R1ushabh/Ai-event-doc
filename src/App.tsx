import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Workspace from './pages/Workspace';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Workspace />} />
      </Routes>
    </Router>
  );
};

export default App;
