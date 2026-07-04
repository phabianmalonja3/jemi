// types/transaction.ts

export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';
export type TransactionType = 'CREDIT' | 'DEBIT';

export interface Transaction {
  id: string;
  userName: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  referenceId: string;
  createdAt: string; // ISO Date string
}

// Hii inasaidia sana unapopokea data ya pagination kutoka kwenye Spring Boot
export interface TransactionResponse {
  content: Transaction[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // Current page
}