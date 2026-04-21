import React, { useState } from 'react';
import InventoryReport  from '../components/InventoryReport';
import SalesReport      from '../components/SalesReport';
import PurchasesReport  from '../components/PurchasesReport';
import ClientsReport    from '../components/ClientsReport';
import '../styles/reports.css';

type ReportTab = 'inventory' | 'sales' | 'purchases' | 'clients';

const tabs = [
  {
    id: 'inventory' as ReportTab,
    label: 'Inventario / Kardex',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
        <path d="M7 8h10M7 12h6" />
      </svg>
    ),
  },
  {
    id: 'sales' as ReportTab,
    label: 'Ventas',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
  {
    id: 'purchases' as ReportTab,
    label: 'Compras',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    id: 'clients' as ReportTab,
    label: 'Clientes y Proveedores',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>('inventory');

  const renderContent = () => {
    switch (activeTab) {
      case 'inventory':  return <InventoryReport />;
      case 'sales':      return <SalesReport />;
      case 'purchases':  return <PurchasesReport />;
      case 'clients':    return <ClientsReport />;
    }
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div className="reports-header-left">
          <h1 className="reports-title">
            <span className="reports-title-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6"  y1="20" x2="6"  y2="14" />
              </svg>
            </span>
            Reportes
          </h1>
          <p className="reports-subtitle">Análisis y estadísticas de tu negocio</p>
        </div>
      </div>

      <div className="reports-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`reports-tab ${activeTab === tab.id ? 'reports-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="reports-tab-icon">{tab.icon}</span>
            <span className="reports-tab-label">{tab.label}</span>
          </button>
        ))}
        <div
          className="reports-tab-indicator"
          style={{ '--tab-index': tabs.findIndex(t => t.id === activeTab) } as React.CSSProperties}
        />
      </div>

      <div className="reports-content">
        {renderContent()}
      </div>
    </div>
  );
}
