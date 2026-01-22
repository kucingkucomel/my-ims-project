export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  WAREHOUSE = 'WAREHOUSE'
}

export enum MovementType {
  IN = 'IN',
  OUT = 'OUT',
  ADJUST = 'ADJUST',
  TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT',
  PURCHASE = 'PURCHASE'
}

export enum MovementStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  IN_TRANSIT = 'IN_TRANSIT',
  RECEIVED = 'RECEIVED',
  REVIEW_REQUIRED = 'REVIEW_REQUIRED'
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  assignedWarehouseId?: number;
  lastLogin?: string;
  department?: string;
  forcePasswordReset?: boolean;
}

export interface Warehouse {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface BinLocation {
  id: string;
  warehouseId: number;
  zone: string;
  rack: string;
  bin: string;
  isFull: boolean;
}

export interface Supplier {
  id: number;
  name: string;
  leadTimeDays: number;
  reliabilityScore: number; // 0-100
  contactEmail: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  minStockLevel: number;
  safetyStock: number;
  currentStock: number;
  unitCost: number;
  valuationMethod: 'FIFO' | 'WAC';
  category: string;
  uom: string;
  abcCategory: 'A' | 'B' | 'C';
  supplierId?: number;
}

export interface StockMovement {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  warehouseId: number;
  warehouseName: string;
  locationId?: string; // Bin Location
  destinationWarehouseId?: number;
  transferId?: number; // Linked to WarehouseTransfer
  type: MovementType;
  quantity: number;
  uom: string;
  unitCost: number; // Cost at time of transaction
  status: MovementStatus;
  reason?: string;
  referenceNo?: string;
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  adminApprovedBy?: string; // For dual-control
}

export interface WarehouseTransfer {
  id: number;
  sourceWarehouseId: number;
  destinationWarehouseId: number;
  productId: number;
  productName: string;
  sku: string;
  quantity: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason?: string;
  requestedBy: string;
  approvedBy?: string;
  createdAt: string;
  approvedAt?: string;
}

export interface PurchaseRequisition {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'DRAFT' | 'SUBMITTED' | 'CONVERTED';
  requestedBy: string;
  createdAt: string;
  suggestedQty?: number; // AI Suggesed
}

export interface Alert {
  id: number;
  type: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
  createdAt: string;
  isRead: boolean;
}