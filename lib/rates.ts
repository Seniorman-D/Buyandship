export type Origin = 'USA' | 'UK' | 'CHINA';

export interface RateResult {
  currency: string;
  amount: number;
  note: string;
}

export function calculateShippingCost(origin: Origin, weightKg: number): RateResult {
  const lbs = weightKg * 2.20462;

  if (origin === 'USA') {
    if (lbs <= 4) {
      return { currency: 'USD', amount: 35, note: 'Flat rate for 0–4 lbs (minimum)' };
    }
    return {
      currency: 'USD',
      amount: parseFloat((lbs * 9).toFixed(2)),
      note: `${lbs.toFixed(2)} lbs × $9/lb`,
    };
  }

  if (origin === 'UK') {
    const kg = Math.max(weightKg, 5);
    return {
      currency: 'GBP',
      amount: parseFloat((kg * 9).toFixed(2)),
      note: weightKg < 5 ? 'Minimum 5kg applied' : `${weightKg}kg × £9/kg`,
    };
  }

  if (origin === 'CHINA') {
    const kg = Math.max(weightKg, 3);
    return {
      currency: 'USD',
      amount: parseFloat((kg * 10).toFixed(2)),
      note: weightKg < 3 ? 'Minimum 3kg applied' : `${weightKg}kg × $10/kg`,
    };
  }

  return { currency: 'USD', amount: 0, note: 'Unknown origin' };
}

export function getWarehouseAddress(origin: Origin, customerName: string): string {
  const n = customerName.toUpperCase();
  if (origin === 'USA') {
    return `BUYANDSHIP – ${n}\n145 Hook Creek Blvd, Bldg B6A\nValley Stream, NY 11581\nAirport Industrial Office Park\nGrandBelle International\nTel: +1 516-256-5666 | Fax: +1 516-256-0606`;
  }
  if (origin === 'UK') {
    return `BUYANDSHIP – ${n}\nEURO-AFRICAN EXPRESS SERVICES LTD.\nUNIT 13A HEATHWAY IND'L ESTATE\nMANCHESTER WAY, WANTZ RD.\nDAGENHAM, RM10 8PN\nTel: +44 208 534 4604 | +44 7956 149 169`;
  }
  if (origin === 'CHINA') {
    return `BUYANDSHIP – ${n}\n+2348029155825\n广东广州市越秀区矿泉街瑶台村沙涌南北站南路17号\n伍福智创1楼126\nContact: 13500032394 | +2348029155825`;
  }
  return '';
}

export const RATE_TABLE = {
  USA: {
    currency: 'USD',
    ratePerUnit: 9,
    unit: 'lb',
    minimum: { lbs: 4, cost: 35 },
    description: '$9/lb (minimum $35 for up to 4 lbs)',
  },
  UK: {
    currency: 'GBP',
    ratePerUnit: 9,
    unit: 'kg',
    minimum: { kg: 5, cost: 45 },
    description: '£9/kg (minimum 5kg = £45)',
    restriction: 'No gadgets/electronics',
  },
  CHINA: {
    currency: 'USD',
    ratePerUnit: 10,
    unit: 'kg',
    minimum: { kg: 3, cost: 30 },
    description: '$10/kg (minimum 3kg = $30)',
  },
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  GBP: '£',
  NGN: '₦',
};

export function formatCurrency(amount: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  return `${symbol}${amount.toFixed(2)}`;
}

export const GADGET_KEYWORDS = [
  'phone', 'laptop', 'tablet', 'ipad', 'iphone', 'airpod',
  'samsung', 'macbook', 'computer', 'electronics', 'gadget',
  'playstation', 'xbox', 'nintendo', 'console', 'headphone',
  'earphone', 'smartwatch', 'watch',
];

export function isGadget(itemName: string): boolean {
  const lower = itemName.toLowerCase();
  return GADGET_KEYWORDS.some((k) => lower.includes(k));
}
