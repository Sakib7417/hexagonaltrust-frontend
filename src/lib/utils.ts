import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hexagonaltrust-production.up.railway.app/api/v1';
// export const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://hexagonaltrust-production.up.railway.app';

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? (process.env.NODE_ENV === 'development' ? '/api/v1' : 'https://hexagonaltrust-production.up.railway.app/api/v1');
export const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://hexagonaltrust-production.up.railway.app';

export const CONSTANTS = {
  MIN_CONTRIBUTION: 25000,
  WEEKLY_REWARD: 500,
  MAX_REWARDS: 100,
  MAX_TOTAL_REWARD: 50000,
  COUNTRIES: [
    'India',
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'Singapore',
    'UAE',
    'Other',
  ],
};
