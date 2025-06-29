import React, { useState, useEffect } from 'react';
import './App.css';

// Componentes
import InvestimentoForm from './components/InvestimentoForm';
import AporteForm from './components/AporteForm';
import InvestimentosList from './components/InvestimentosList';

function App() {
  const [currentView, setCurrentView] = useState('investimentos');
  const [selectedInvestimento, setSelectedInvestimento] = useState(null);

  const handleEditInvestimento = (investimento) => {
    setSelectedInvestimento(investimento);
    setCurrentView('edit-investimento');
  };

  const handleAddAporte = (investimento) => {
    setSelectedInvestimento(investimento);
    setCurrentView('add-aporte');
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    if (view !== 'edit-investimento' && view !== 'add-aporte') {
      setSelectedInvestimento(null);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'investimentos':
        return (
          <InvestimentosList 
            onEdit={handleEditInvestimento}
            onAddAporte={handleAddAporte}
            onAddNew={() => handleViewChange('add-investimento')}
          />
        );
      case 'add-investimento':
        return (
          <InvestimentoForm 
            onSuccess={() => handleViewChange('investimentos')}
            onCancel={() => handleViewChange('investimentos')}
          />
        );
      case 'edit-investimento':
        return (
          <InvestimentoForm 
            investimento={selectedInvestimento}
            onSuccess={() => handleViewChange('investimentos')}
            onCancel={() => handleViewChange('investimentos')}
          />
        );
      case 'add-aporte':
        return (
          <AporteForm 
            investimento={selectedInvestimento}
            onSuccess={() => handleViewChange('investimentos')}
            onCancel={() => handleViewChange('investimentos')}
          />
        );
      default:
        return (
          <InvestimentosList 
            onEdit={handleEditInvestimento}
            onAddAporte={handleAddAporte}
            onAddNew={() => handleViewChange('add-investimento')}
          />
        );
    }
  };

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <h1>Seus investimentos - Renda Fixa</h1>
        </header>

        {/* Main Content */}
        <main className="main-content">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
}

export default App;
