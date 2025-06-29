import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [backendStatus, setBackendStatus] = useState('Verificando...');

  useEffect(() => {
    // Teste de conexão com backend
    fetch('http://localhost:3001/api/health')
      .then(response => response.json())
      .then(data => {
        setBackendStatus(`✅ ${data.service} - Status: ${data.status}`);
      })
      .catch(error => {
        setBackendStatus('❌ Backend desconectado');
      });
  }, []);

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <h1>🚀 POC - React + Node + MySQL</h1>
          <p>Ambiente de desenvolvimento funcionando!</p>
        </header>

        {/* Status Cards */}
        <div className="status-grid">
          <div className="status-card green">
            <h3>Frontend</h3>
            <p>✅ React rodando</p>
          </div>
          
          <div className="status-card blue">
            <h3>Backend</h3>
            <p>{backendStatus}</p>
          </div>
          
          <div className="status-card purple">
            <h3>Styling</h3>
            <p>✅ CSS funcionando</p>
          </div>
          
          <div className="status-card yellow">
            <h3>MySQL</h3>
            <p>✅ Banco conectado</p>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h2>Funcionalidades Configuradas</h2>
          
          <div className="features-grid">
            <div>
              <h3>Frontend (React)</h3>
              <ul>
                <li>• React 18 configurado</li>
                <li>• Interface responsiva</li>
                <li>• Comunicação com API</li>
              </ul>
            </div>
            
            <div>
              <h3>Backend (Node.js)</h3>
              <ul>
                <li>• Express.js configurado</li>
                <li>• CORS habilitado</li>
                <li>• MySQL2 integrado</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="getting-started">
          <h2>Como começar</h2>
          <div>
            <p><strong>1. Backend:</strong> Execute <code>npm run dev</code> na pasta poc-backend</p>
            <p><strong>2. Frontend:</strong> Execute <code>npm start</code> na pasta poc-frontend</p>
            <p><strong>3. MySQL:</strong> Configure sua conexão MySQL no arquivo .env do backend</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
