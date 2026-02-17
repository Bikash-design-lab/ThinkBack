/**
 * Main App Component with React Router
 * 
 * Sets up application routing and navigation structure.
 */
import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Common/navbar';
import Dashboard from './Components/Pages/dashboard';
import Tickets from './Components/Pages/tickets';
import Chat from './Components/Pages/chat';
import About from './Components/Common/about';
import PageNotFound from './Components/Common/pageNotFound';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/ticket/:ticketId" element={<Chat />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

