import React from 'react';
import { Product, BinLocation, Supplier } from './types';

export const MOCK_WAREHOUSES = [
  { id: 1, name: 'HZIMS HQ (Main Hub)', address: 'Kuala Lumpur, Malaysia', latitude: 3.1390, longitude: 101.6869 },
  { id: 2, name: 'HZIMS Industrial Center', address: 'Shah Alam, Selangor', latitude: 3.0738, longitude: 101.5183 },
  { id: 3, name: 'HZIMS South Gateway', address: 'Johor Bahru, Johor', latitude: 1.4927, longitude: 103.7414 }
];

export const MOCK_BINS: BinLocation[] = [
  { id: 'A-01-01', warehouseId: 1, zone: 'A', rack: '01', bin: '01', isFull: false },
  { id: 'B-02-05', warehouseId: 1, zone: 'B', rack: '02', bin: '05', isFull: false },
  { id: 'C-10-10', warehouseId: 2, zone: 'C', rack: '10', bin: '10', isFull: false },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 1, name: 'Global Tech Components', leadTimeDays: 14, reliabilityScore: 95, contactEmail: 'sales@globaltech.com' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 1, sku: 'CPU-INT-001', name: 'Intel Core i9 Processor', minStockLevel: 50, safetyStock: 20, currentStock: 120, unitCost: 450.00, valuationMethod: 'FIFO', category: 'Electronics', uom: 'Units', abcCategory: 'A', supplierId: 1 },
  { id: 2, sku: 'MEM-COR-016', name: 'Corsair 16GB RAM Stick', minStockLevel: 200, safetyStock: 50, currentStock: 450, unitCost: 85.00, valuationMethod: 'FIFO', category: 'Electronics', uom: 'Units', abcCategory: 'B', supplierId: 1 },
  { id: 3, sku: 'CAB-ETH-003', name: 'Ethernet Cable 3m', minStockLevel: 500, safetyStock: 100, currentStock: 80, unitCost: 5.50, valuationMethod: 'WAC', category: 'Accessories', uom: 'Rolls', abcCategory: 'C', supplierId: 1 },
];

export const COLORS = {
  primary: '#2563eb',
  secondary: '#64748b',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};

export const ICONS = {
  Dashboard: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Inventory: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  Reports: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  Audit: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Warehouse: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Checklist: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Transfer: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
  Procurement: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
  History: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Finance: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};