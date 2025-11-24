import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IssueList from './pages/IssueList';
import IssueDetail from './pages/IssueDetail';
import AIRecommendation from './pages/AIRecommendation';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IssueList />} />
        <Route path="/issue/:issueId" element={<IssueDetail />} />
        <Route path="/ai-recommendation" element={<AIRecommendation />} />
      </Routes>
    </Router>
  );
};

export default App;