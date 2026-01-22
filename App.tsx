
import React, { useState, useMemo, useEffect } from 'react';
import { User, UserRole, Warehouse, Product, StockMovement, MovementType, MovementStatus, PurchaseRequisition, Alert, WarehouseTransfer } from './types';
import { MOCK_WAREHOUSES, MOCK_PRODUCTS, ICONS, COLORS } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import Inventory from './views/Inventory';
import AuditLogs from './views/AuditLogs';
import WarehouseMap from './views/WarehouseMap';
import ProductionChecklist from './views/ProductionChecklist';
import Approvals from './views/Approvals';
import Transfers from './views/Transfers';
import Procurement from './views/Procurement';
import Finance from './views/Finance';
import UserManagement from './views/UserManagement';
import Handbook from './views/Handbook';
import UserTesting from './views/UserTesting';
import Auth from './components/Auth';
import DemoControls from './components/DemoControls';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nexus_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [transfers, setTransfers] = useState<WarehouseTransfer[]>([]);
  const [requisitions, setRequisitions] = useState<PurchaseRequisition[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('nexus_warehouse_id');
    if (saved) {
      const wh = MOCK_WAREHOUSES.find(w => w.id === Number(saved));
      if (wh) setSelectedWarehouse(wh);
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('nexus_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedWarehouse(null);
    localStorage.removeItem('nexus_user');
    localStorage.removeItem('nexus_warehouse_id');
    setActiveTab('dashboard');
  };

  const handleWarehouseSelect = (wh: Warehouse) => {
    setSelectedWarehouse(wh);
    localStorage.setItem('nexus_warehouse_id', wh.id.toString());
    setActiveTab('dashboard');
  };

  const addMovement = (m: Omit<StockMovement, 'id' | 'createdAt' | 'status'>) => {
    if (currentUser?.role === UserRole.ADMIN) {
      alert("Operational Lock: Admins restricted to oversight only.");
      return;
    }

    const product = MOCK_PRODUCTS.find(p => p.id === m.productId);
    
    if ((m.type === MovementType.OUT || m.type === MovementType.TRANSFER_OUT) && product && (product.currentStock - m.quantity) < 0) {
      alert("Inventory Violation: Insufficient stock for dispatch. Transaction rejected by terminal.");
      return;
    }

    if (m.quantity <= 0) {
      alert("Validation Error: Transaction quantity must be greater than zero.");
      return;
    }

    const isLarge = m.type === MovementType.ADJUST && (m.quantity > 100 || (product && m.quantity * product.unitCost > 5000));

    const newMovement: StockMovement = {
      ...m,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: isLarge ? MovementStatus.REVIEW_REQUIRED : (m.type === MovementType.ADJUST ? MovementStatus.PENDING : MovementStatus.APPROVED),
      unitCost: product?.unitCost || 0
    };

    setMovements(prev => [newMovement, ...prev]);
    
    if (product && newMovement.status === MovementStatus.APPROVED && !m.type.toString().includes('TRANSFER')) {
      product.currentStock += (m.type === MovementType.IN ? m.quantity : -m.quantity);
    }
  };

  const addTransferRequest = (t: Omit<WarehouseTransfer, 'id' | 'createdAt' | 'status'>) => {
    const newTransfer: WarehouseTransfer = {
      ...t,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'PENDING'
    };
    setTransfers(prev => [newTransfer, ...prev]);
  };

  const finalizeTransfer = (id: number, decision: 'APPROVED' | 'REJECTED') => {
    setTransfers(prev => prev.map(t => {
      if (t.id !== id) return t;
      if (t.status !== 'PENDING') return t;

      if (decision === 'APPROVED') {
        const product = MOCK_PRODUCTS.find(p => p.id === t.productId);
        if (!product || product.currentStock < t.quantity) {
          alert("Transfer Failure: Source warehouse stock depleted before approval.");
          return { ...t, status: 'REJECTED' as const, approvedBy: currentUser?.name, approvedAt: new Date().toISOString() };
        }

        const transferOut: StockMovement = {
          id: Date.now() + 1,
          productId: t.productId,
          productName: t.productName,
          sku: t.sku,
          warehouseId: t.sourceWarehouseId,
          warehouseName: MOCK_WAREHOUSES.find(w => w.id === t.sourceWarehouseId)?.name || 'Unknown',
          type: MovementType.TRANSFER_OUT,
          quantity: t.quantity,
          uom: 'Pcs',
          unitCost: product.unitCost,
          status: MovementStatus.APPROVED,
          transferId: t.id,
          createdBy: t.requestedBy,
          createdAt: new Date().toISOString(),
          approvedBy: currentUser?.name
        };

        const transferIn: StockMovement = {
          id: Date.now() + 2,
          productId: t.productId,
          productName: t.productName,
          sku: t.sku,
          warehouseId: t.destinationWarehouseId,
          warehouseName: MOCK_WAREHOUSES.find(w => w.id === t.destinationWarehouseId)?.name || 'Unknown',
          type: MovementType.TRANSFER_IN,
          quantity: t.quantity,
          uom: 'Pcs',
          unitCost: product.unitCost,
          status: MovementStatus.APPROVED,
          transferId: t.id,
          createdBy: t.requestedBy,
          createdAt: new Date().toISOString(),
          approvedBy: currentUser?.name
        };

        setMovements(prev => [transferOut, transferIn, ...prev]);
        product.currentStock -= t.quantity;
      }

      return { ...t, status: decision, approvedBy: currentUser?.name, approvedAt: new Date().toISOString() };
    }));
  };

  const updateMovementStatus = (id: number, status: MovementStatus, role: UserRole) => {
    setMovements(prev => prev.map(m => {
      if (m.id !== id) return m;
      const updated = { ...m, status, approvedAt: new Date().toISOString() };
      if (role === UserRole.ADMIN) updated.adminApprovedBy = currentUser?.name;
      else updated.approvedBy = currentUser?.name;
      
      if (status === MovementStatus.APPROVED) {
        const product = MOCK_PRODUCTS.find(p => p.id === m.productId);
        if (product) product.currentStock += (m.type === MovementType.IN ? m.quantity : -m.quantity);
      }
      
      return updated;
    }));
  };

  const executeScenario = (id: string) => {
    if (id === 'reset') {
      setIsResetting(true);
      setTimeout(() => {
        setMovements([]);
        setTransfers([]);
        setRequisitions([]);
        setAlerts([]);
        setIsResetting(false);
        alert("System sanitized. Reset to baseline mock data.");
      }, 800);
      return;
    }

    if (id === 'sc1') {
      addTransferRequest({
        sourceWarehouseId: 1,
        destinationWarehouseId: 2,
        productId: 1,
        productName: 'Intel Core i9 Processor',
        sku: 'CPU-INT-001',
        quantity: 20,
        reason: 'UAT Simulation Inbound',
        requestedBy: 'Simulation Engine'
      });
      setActiveTab('approvals');
      alert("Scenario 1: Pending transfer created. Go to Authorization to approve.");
    }

    if (id === 'sc2') {
      const cpu = MOCK_PRODUCTS.find(p => p.id === 1);
      const newM: StockMovement = {
        id: Date.now(),
        productId: 1,
        productName: 'Intel Core i9 Processor',
        sku: 'CPU-INT-001',
        warehouseId: 1,
        warehouseName: 'HZIMS HQ (Main Hub)',
        type: MovementType.ADJUST,
        quantity: 500,
        uom: 'Pcs',
        unitCost: cpu?.unitCost || 450,
        status: MovementStatus.REVIEW_REQUIRED,
        createdBy: 'Simulation Engine',
        createdAt: new Date().toISOString()
      };
      setMovements(prev => [newM, ...prev]);
      setActiveTab('approvals');
      alert("Scenario 2: Critical adjustment created. Note: Only ADMIN can approve this.");
    }

    if (id === 'sc3') {
      setActiveTab('users');
      alert("Scenario 3: Navigate to User Directory. Try demoting your own role.");
    }
  };

  if (!currentUser) return <Auth onLogin={handleLogin} />;

  const renderContent = () => {
    const bypassContext = (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.MANAGER) && 
      ['audit', 'map', 'checklist', 'finance', 'users', 'handbook', 'approvals', 'testing'].includes(activeTab);
    
    if (!selectedWarehouse && activeTab !== 'map' && activeTab !== 'handbook' && activeTab !== 'testing' && !bypassContext) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-12 space-y-8 bg-white rounded-[3rem] shadow-sm border border-slate-100">
          <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center animate-bounce shadow-2xl shadow-blue-200">
            <ICONS.Warehouse className="w-16 h-16 text-white" />
          </div>
          <div className="max-w-md">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 text-balance">Select Operational Terminal</h2>
            <p className="text-slate-500 font-medium leading-relaxed">System access restricted to authorized warehouse terminals. Please link a physical location to initialize operational data.</p>
          </div>
          <button 
            onClick={() => setActiveTab('map')}
            className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-black transition-all transform hover:-translate-y-1"
          >
            Launch Hub Map
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard': return <Dashboard warehouse={selectedWarehouse!} movements={movements} user={currentUser} alerts={alerts} />;
      case 'inventory': return <Inventory warehouse={selectedWarehouse!} movements={movements} onAdd={addMovement} user={currentUser} />;
      case 'approvals': return <Approvals movements={movements} transfers={transfers} onUpdate={updateMovementStatus} onTransferUpdate={finalizeTransfer} user={currentUser} />;
      case 'finance': return <Finance movements={movements} products={MOCK_PRODUCTS} />;
      case 'transfers': return <Transfers warehouse={selectedWarehouse!} transfers={transfers} onAdd={addTransferRequest} user={currentUser} />;
      case 'procurement': return <Procurement requisitions={requisitions} onAdd={(pr) => setRequisitions(p => [...p, {...pr, id:Date.now(), createdAt: new Date().toISOString(), status:'SUBMITTED'}])} user={currentUser} />;
      case 'audit': return <AuditLogs movements={movements} user={currentUser} />;
      case 'users': return <UserManagement />;
      case 'handbook': return <Handbook />;
      case 'testing': return <UserTesting onExecuteScenario={executeScenario} isResetting={isResetting} />;
      case 'map': return <WarehouseMap onSelect={handleWarehouseSelect} selectedId={selectedWarehouse?.id} />;
      case 'checklist': return <ProductionChecklist />;
      default: return <Dashboard warehouse={selectedWarehouse!} movements={movements} user={currentUser} alerts={alerts} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden selection:bg-blue-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={currentUser} warehouse={selectedWarehouse} onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto relative p-8 scroll-smooth">
        <header className="mb-8 flex items-center justify-between sticky top-0 bg-slate-50/80 backdrop-blur-md z-40 py-2">
          <div className="flex items-center gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter capitalize">{activeTab.replace('-', ' ')}</h1>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">HZIMS Terminal 04 • Online</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-6 bg-white border border-slate-100 pr-6 pl-2 py-2 rounded-3xl shadow-sm">
              <div className="flex -space-x-3 overflow-hidden p-1">
                <img className="inline-block h-10 w-10 rounded-full ring-4 ring-white shadow-sm" src={`https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.name}`} alt=""/>
              </div>
              <div className="text-right border-l border-slate-100 pl-4">
                <p className="text-sm font-black text-slate-800 leading-none">{currentUser.name}</p>
                <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-1">{currentUser.role}</p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="bg-white hover:bg-rose-50 border border-slate-100 p-4 rounded-2xl shadow-sm text-slate-400 hover:text-rose-500 transition-all group"
              title="Logout"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </header>

        <div className="max-w-[1600px] mx-auto">
          {renderContent()}
        </div>
      </main>

      <DemoControls onSwitchUser={setCurrentUser} currentUser={currentUser} />
    </div>
  );
};

export default App;
