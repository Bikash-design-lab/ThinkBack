/**
 * Main App Component with React Router
 * 
 * Sets up application routing and navigation structure.
 */
import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Common/navbar';
import Dashboard from './Components/Pages/dashboard';
import About from './Components/Common/about';
import PageNotFound from './Components/Common/pageNotFound';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;

