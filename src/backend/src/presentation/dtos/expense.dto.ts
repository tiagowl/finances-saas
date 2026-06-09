import { OccasionalExpense } from '../../domain/entities/OccasionalExpense.js';
import { RecurringExpense } from '../../domain/entities/RecurringExpense.js';

export interface ExpenseResponse {
  id: string;
  name: string;
  notes: string | null;
  price: number;
  date?: string;
  installments: number | null;
  categoryId: string;
}

export function occasionalExpenseToResponse(expense: OccasionalExpense): ExpenseResponse {
  const json = expense.toJSON();
  return {
    id: json.id,
    name: json.name,
    notes: json.notes,
    price: json.price,
    date: json.date,
    installments: null,
    categoryId: json.categoryId,
  };
}

export function recurringExpenseToResponse(expense: RecurringExpense): ExpenseResponse {
  const json = expense.toJSON();
  return {
    id: json.id,
    name: json.name,
    notes: json.notes,
    price: json.price,
    installments: json.installments,
    categoryId: json.categoryId,
  };
}

export function occasionalExpensesToResponse(expenses: OccasionalExpense[]): ExpenseResponse[] {
  return expenses.map(occasionalExpenseToResponse);
}

export function recurringExpensesToResponse(expenses: RecurringExpense[]): ExpenseResponse[] {
  return expenses.map(recurringExpenseToResponse);
}
