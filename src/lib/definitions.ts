export type User = {
  userId: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'user';
  createdAt: string;
};

export type Account = {
  id: string;
  name: string;
  balance: number;
  currency: string;
};

export type Category = {
  id: string;
  name: string;
  type: 'Ingreso' | 'Gasto';
};

export type Transaction = {
  id: string;
  accountId: string;
  categoryId: string;
  amount: number;
  description: string;
  date: string;
};

export type Budget = {
  id: string;
  categoryId: string;
  amount: number;
  spent: number;
  remaining: number;
};