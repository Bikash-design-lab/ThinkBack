/**
 * Main App Component with React Router
 * 
 * Sets up application routing and navigation structure.
 */
import { Routes, Route } from 'react-router-dom';
import { TicketProvider } from './Context/TicketContext';
import { ToastProvider } from './Context/ToastContext';
import Toast from './Components/Common/toast';
import Navbar from './Components/Common/navbar';
import Dashboard from './Components/Pages/dashboard';
import Tickets from './Components/Pages/tickets';
import Chat from './Components/Pages/chat';
import About from './Components/Common/about';
import PageNotFound from './Components/Common/pageNotFound';
import './App.css';

function App() {
  return (
    <ToastProvider>
      <TicketProvider>
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
          <Toast />
        </div>
      </TicketProvider>
    </ToastProvider>
  );
}

export default App;

