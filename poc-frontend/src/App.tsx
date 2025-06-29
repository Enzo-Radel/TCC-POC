import React, { useState } from 'react';
import './App.css';

// Tipos
import { ViewType, InvestimentoCompleto } from './types';

// Componentes
import InvestimentoForm from './components/InvestimentoForm';
import AporteForm from './components/AporteForm';
import InvestimentosList from './components/InvestimentosList';
import AportesList from './components/AportesList';

function App(): JSX.Element {
  const [currentView, setCurrentView] = useState<ViewType>('investimentos');
  const [selectedInvestimento, setSelectedInvestimento] = useState<InvestimentoCompleto | null>(null);

  const handleEditInvestimento = (investimento: InvestimentoCompleto): void => {
    setSelectedInvestimento(investimento);
    setCurrentView('edit-investimento');
  };

  const handleAddAporte = (investimento: InvestimentoCompleto): void => {
    setSelectedInvestimento(investimento);
    setCurrentView('add-aporte');
  };

  const handleViewAportes = (investimento: InvestimentoCompleto): void => {
    setSelectedInvestimento(investimento);
    setCurrentView('view-aportes');
  };

  const handleViewChange = (view: ViewType): void => {
    setCurrentView(view);
    if (view !== 'edit-investimento' && view !== 'add-aporte' && view !== 'view-aportes') {
      setSelectedInvestimento(null);
    }
  };

  const renderCurrentView = (): JSX.Element => {
    switch (currentView) {
      case 'investimentos':
        return (
          <InvestimentosList 
            onEdit={handleEditInvestimento}
            onAddAporte={handleAddAporte}
            onAddNew={() => handleViewChange('add-investimento')}
            onViewAportes={handleViewAportes}
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
            investimento={selectedInvestimento || undefined}
            onSuccess={() => handleViewChange('investimentos')}
            onCancel={() => handleViewChange('investimentos')}
          />
        );
      case 'add-aporte':
        return (
          <AporteForm 
            investimento={selectedInvestimento || undefined}
            onSuccess={() => handleViewChange('investimentos')}
            onCancel={() => handleViewChange('investimentos')}
          />
        );
      
      case 'view-aportes':
        return (
          <AportesList 
            investimento={selectedInvestimento || undefined}
            onBack={() => handleViewChange('investimentos')}
          />
        );
      
      default:
        return (
          <InvestimentosList 
            onEdit={handleEditInvestimento}
            onAddAporte={handleAddAporte}
            onAddNew={() => handleViewChange('add-investimento')}
            onViewAportes={handleViewAportes}
          />
        );
    }
  };

  return (
    <div className="app">
      <div className="container">
        {/* Main Content */}
        <main className="main-content">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
}

export default App; 