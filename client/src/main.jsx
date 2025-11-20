import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import "./index.scss"
import { AuthContextProvider } from '../context/authContext.jsx';
import { SocketContextProvider } from '../context/socketContext.jsx';
import { LanguageContextProvider } from '../context/languageContext.jsx';
import { DarkModeContextProvider } from '../context/darkModeContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DarkModeContextProvider>
      <LanguageContextProvider>
        <AuthContextProvider>
          <SocketContextProvider>
            <App />
          </SocketContextProvider> 
        </AuthContextProvider>
      </LanguageContextProvider>
    </DarkModeContextProvider>
  </React.StrictMode>,
)
