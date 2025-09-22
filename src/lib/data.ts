import { Account, Transaction, Budget, Category } from './definitions';

export const accounts: Account[] = [
  {
    id: 'acc_1',
    name: 'Cuenta Corriente',
    balance: 1500.75,
    currency: 'USD',
  },
  {
    id: 'acc_2',
    name: 'Ahorros',
    balance: 5000.00,
    currency: 'USD',
  },
];

export const categories: Category[] = [
  {
    id: 'cat_1',
    name: 'Comida',
    type: 'Gasto',
  },
  {
    id: 'cat_2',
    name: 'Salario',
    type: 'Ingreso',
  },
  {
    id: 'cat_3',
    name: 'Transporte',
    type: 'Gasto',
  },
];

export const transactions: Transaction[] = [
  {
    id: 'txn_1',
    accountId: 'acc_1',
    categoryId: 'cat_1',
    amount: -50.25,
    description: 'Supermercado',
    date: '2024-07-28',
  },
  {
    id: 'txn_2',
    accountId: 'acc_1',
    categoryId: 'cat_2',
    amount: 2000.00,
    description: 'Salario de Julio',
    date: '2024-07-25',
  },
  {
    id: 'txn_3',
    accountId: 'acc_2',
    categoryId: 'cat_3',
    amount: -25.50,
    description: 'Gasolina',
    date: '2024-07-27',
  },
];

export const budgets: Budget[] = [
  {
    id: 'bud_1',
    categoryId: 'cat_1',
    amount: 500.00,
    spent: 150.75,
    remaining: 349.25,
  },
  {
    id: 'bud_2',
    categoryId: 'cat_3',
    amount: 100.00,
    spent: 25.50,
    remaining: 74.50,
  },
];
