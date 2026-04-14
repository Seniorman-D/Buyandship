import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  received_at_warehouse: 'Received at Warehouse',
  in_transit: 'In Transit',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
};

export const PROCUREMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending Review',
  reviewing: 'Under Review',
  cost_sent: 'Cost Estimate Sent',
  approved: 'Approved',
  purchased: 'Item Purchased',
  shipped: 'Shipped to Nigeria',
  delivered: 'Delivered',
};

export const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  received_at_warehouse: 'bg-blue-100 text-blue-800',
  in_transit: 'bg-indigo-100 text-indigo-800',
  out_for_delivery: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  reviewing: 'bg-blue-100 text-blue-800',
  cost_sent: 'bg-orange-100 text-orange-800',
  approved: 'bg-teal-100 text-teal-800',
  purchased: 'bg-cyan-100 text-cyan-800',
  shipped: 'bg-indigo-100 text-indigo-800',
};

export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  unpaid: 'bg-red-100 text-red-800',
  paid: 'bg-green-100 text-green-800',
};
