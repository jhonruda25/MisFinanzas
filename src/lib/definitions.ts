export type User = {
  userId: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type Account = {
  accountId: string;
  userId: string;
  accountName: string;
  accountType: 'Débito' | 'Crédito';
  initialBalance: number;
  createdAt: string;
};

export type Category = {
  categoryId: string;
  userId: string;
  name: string;
  type: 'Gasto' | 'Ingreso';
  icon: string;
};

export type Transaction = {
  transactionId: string;
  userId: string;
  accountId: string;
  categoryId: string;
  type: 'Ingreso' | 'Gasto';
  amount: number;
  description: string;
  date: string;
  createdAt: string;
};

export type Budget = {
  budgetId: string;
  userId: string;
  categoryId: string;
  amount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
};
