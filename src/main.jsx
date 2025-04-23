import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './AuthContext';
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import ToastProvider from './components/Toasts/ToastProvider.jsx';

createRoot(document.getElementById('root')).render(
  //<StrictMode>
    <AuthProvider> {/* ✅ Wrap App with AuthProvider */}
      <ToastProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  //</StrictMode>,
)