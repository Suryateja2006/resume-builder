import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ResumeProvider } from './context/ResumeContext';
import Navbar from './components/Navbar';
import Templates from './pages/Templates';
import Builder from './pages/Builder';
import ResumeView from './pages/ResumeView';
import Preview from './pages/Preview';
import Home from './pages/Home';
import './index.css';

function App() {
  return (
    <ResumeProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/builder/:templateId" element={<Builder />} />
              <Route path="/resume/:id" element={<ResumeView />} />
              <Route path="/preview/:id" element={<Preview />} />
            </Routes>
          </main>
        </div>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#e2e8f0',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '12px',
            },
            success: { iconTheme: { primary: '#6366f1', secondary: '#e2e8f0' } },
          }}
        />
      </Router>
    </ResumeProvider>
  );
}

export default App;
