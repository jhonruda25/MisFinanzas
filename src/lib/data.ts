import type { User, Account, Category, Transaction, Budget } from './definitions';

export const users: User[] = [
  {
    userId: "user_001",
    name: "Ana García",
    email: "ana.garcia@example.com",
    passwordHash: "hashed_password_string_example",
    createdAt: "2025-09-22T08:30:00Z"
  }
];

export const accounts: Account[] = [
  {
    accountId: "acc_001",
    userId: "user_001",
    accountName: "Bancolombia Ahorros",
    accountType: "Débito",
    initialBalance: 1500000,
    createdAt: "2025-09-22T08:35:00Z"
  },
  {
    accountId: "acc_002",
    userId: "user_001",
    accountName: "Tarjeta de Crédito Visa",
    accountType: "Crédito",
    initialBalance: 0,
    createdAt: "2025-09-22T08:36:00Z"
  }
];

export const categories: Category[] = [
  {
    categoryId: "cat_001",
    userId: "user_001",
    name: "Comida",
    type: "Gasto",
    icon: "restaurant_icon"
  },
  {
    categoryId: "cat_002",
    userId: "user_001",
    name: "Salario",
    type: "Ingreso",
    icon: "work_icon"
  },
  {
    categoryId: "cat_003",
    userId: "user_001",
    name: "Transporte",
    type: "Gasto",
    icon: "directions_bus_icon"
  },
  {
    categoryId: "cat_004",
    userId: "user_001",
    name: "Entretenimiento",
    type: "Gasto",
    icon: "entertainment_icon"
  },
  {
    categoryId: "cat_005",
    userId: "user_001",
    name: "Salud",
    type: "Gasto",
    icon: "health_icon"
  }
];

export const transactions: Transaction[] = [
  {
    transactionId: "txn_001",
    userId: "user_001",
    accountId: "acc_001",
    categoryId: "cat_002",
    type: "Ingreso",
    amount: 2500000,
    description: "Pago de quincena",
    date: "2025-09-15T10:00:00Z",
    createdAt: "2025-09-15T10:01:00Z"
  },
  {
    transactionId: "txn_002",
    userId: "user_001",
    accountId: "acc_001",
    categoryId: "cat_001",
    type: "Gasto",
    amount: 35000,
    description: "Almuerzo en el centro",
    date: "2025-09-22T12:30:00Z",
    createdAt: "2025-09-22T12:31:00Z"
  },
  {
    transactionId: "txn_003",
    userId: "user_001",
    accountId: "acc_001",
    categoryId: "cat_003",
    type: "Gasto",
    amount: 12000,
    description: "Transporte al trabajo",
    date: "2025-09-22T07:00:00Z",
    createdAt: "2025-09-22T07:01:00Z"
  },
  {
    transactionId: "txn_004",
    userId: "user_001",
    accountId: "acc_002",
    categoryId: "cat_004",
    type: "Gasto",
    amount: 50000,
    description: "Cine",
    date: "2025-09-20T19:00:00Z",
    createdAt: "2025-09-20T19:01:00Z"
  },
  {
    transactionId: "txn_005",
    userId: "user_001",
    accountId: "acc_001",
    categoryId: "cat_001",
    type: "Gasto",
    amount: 80000,
    description: "Mercado semanal",
    date: "2025-09-18T16:00:00Z",
    createdAt: "2025-09-18T16:01:00Z"
  }
];

export const budgets: Budget[] = [
  {
    budgetId: "bud_001",
    userId: "user_001",
    categoryId: "cat_001",
    amount: 400000,
    startDate: "2025-09-01T00:00:00Z",
    endDate: "2025-09-30T23:59:59Z",
    createdAt: "2025-09-01T09:00:00Z"
  },
  {
    budgetId: "bud_002",
    userId: "user_001",
    categoryId: "cat_003",
    amount: 150000,
    startDate: "2025-09-01T00:00:00Z",
    endDate: "2025-09-30T23:59:59Z",
    createdAt: "2025-09-01T09:05:00Z"
  }
];
