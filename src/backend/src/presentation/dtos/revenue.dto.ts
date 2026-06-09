import { OccasionalRevenue } from '../../domain/entities/OccasionalRevenue.js';
import { RecurringRevenue } from '../../domain/entities/RecurringRevenue.js';

export interface RevenueResponse {
  id: string;
  name: string;
  notes: string | null;
  price: number;
  date?: string;
  installments: number | null;
  categoryId: string | null;
}

export function occasionalRevenueToResponse(revenue: OccasionalRevenue): RevenueResponse {
  const json = revenue.toJSON();
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

export function recurringRevenueToResponse(revenue: RecurringRevenue): RevenueResponse {
  const json = revenue.toJSON();
  return {
    id: json.id,
    name: json.name,
    notes: json.notes,
    price: json.price,
    installments: json.installments,
    categoryId: json.categoryId,
  };
}

export function occasionalRevenuesToResponse(revenues: OccasionalRevenue[]): RevenueResponse[] {
  return revenues.map(occasionalRevenueToResponse);
}

export function recurringRevenuesToResponse(revenues: RecurringRevenue[]): RevenueResponse[] {
  return revenues.map(recurringRevenueToResponse);
}
