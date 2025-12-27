
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AppModule {
  id: string;
  name: string;
  icon: string;
  description: string;
  path: string;
  color: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  status: 'New' | 'Qualified' | 'Proposition' | 'Won' | 'Lost';
  value: number;
}

export interface SaleOrder {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: 'Quotation' | 'Sales Order' | 'Invoiced';
}

export interface StockEntry {
  id: string;
  date: string;
  quantity: number;
  note: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number; // Current total
  category: string;
  stockHistory?: StockEntry[];
}

export interface Task {
  id: string;
  title: string;
  project: string;
  assignee: string;
  status: 'Todo' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: string;
}

export interface Invoice {
  id: string;
  customer: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Paid';
  dueDate: string;
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  role: string;
  attendance: 'Present' | 'Absent' | 'On Leave';
  employmentStatus?: 'Active' | 'Leaving';
}

export interface GeneratedSolution {
  id: string;
  userId: string;
  title: string;
  timestamp: number;
  challenge: string;
  summary: string;
  services: string[];
  architecture: string;
  bestPractices: string[];
}
