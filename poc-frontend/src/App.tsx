import React, { useState } from 'react';
import './App.css';

// Tipos
import { ViewType, InvestimentoCompleto } from './types';

// Componentes
import InvestimentoForm from './components/InvestimentoForm';
import AporteForm from './components/AporteForm';
import RetiradaForm from './components/RetiradaForm';
import InvestimentosList from './components/InvestimentosList';
import Extrato from './components/Extrato';

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

  const handleAddRetirada = (investimento: InvestimentoCompleto): void => {
    setSelectedInvestimento(investimento);
    setCurrentView('add-retirada');
  };

  const handleViewExtrato = (investimento: InvestimentoCompleto): void => {
    setSelectedInvestimento(investimento);
    setCurrentView('extrato');
  };

  const handleViewChange = (view: ViewType): void => {
    setCurrentView(view);
    if (view !== 'edit-investimento' && view !== 'add-aporte' && view !== 'add-retirada' && view !== 'extrato') {
      setSelectedInvestimento(null);
    }
  };

  const renderCurrentView = (): JSX.Element => {
    switch (currentView) {
      case 'investimentos':
        return (
          <InvestimentosList 
            onEdit={handleEditInvestimento}
            onAddNew={() => handleViewChange('add-investimento')}
            onViewExtrato={handleViewExtrato}
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
            onSuccess={() => handleViewChange('extrato')}
            onCancel={() => handleViewChange('extrato')}
          />
        );
      case 'add-retirada':
        return (
          <RetiradaForm 
            investimento={selectedInvestimento || undefined}
            onSuccess={() => handleViewChange('extrato')}
            onCancel={() => handleViewChange('extrato')}
          />
        );
      case 'extrato':
        return (
          <Extrato 
            investimento={selectedInvestimento || undefined}
            onBack={() => handleViewChange('investimentos')}
            onAddAporte={() => handleViewChange('add-aporte')}
            onAddRetirada={() => handleViewChange('add-retirada')}
          />
        );
      
      default:
        return (
          <InvestimentosList 
            onEdit={handleEditInvestimento}
            onAddNew={() => handleViewChange('add-investimento')}
            onViewExtrato={handleViewExtrato}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-app-bg p-5">
      <div className="max-w-6xl mx-auto">
        {/* Main Content */}
        <main className="rounded-2xl p-8 mb-8">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
}

export default App; 