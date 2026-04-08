export const SITE_NAME = 'bodyscrub.sk';
export const SITE_DESCRIPTION = 'Prírodné body scrubs vyrobené na Slovensku. Olejové, kávové a prírodné scrubs pre dokonalú starostlivosť o telo.';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bodyscrub.sk';

export const FREE_SHIPPING_THRESHOLD = 40;
export const SHIPPING_COST = 3.90;

export const CATEGORIES = [
  { key: 'all', label: 'Všetky' },
  { key: 'coffee', label: 'Kávové' },
  { key: 'oil', label: 'Olejové' },
  { key: 'matcha', label: 'Matcha' },
  { key: 'salt', label: 'Soľné' },
  { key: 'charcoal', label: 'Charcoal' },
  { key: 'lavender', label: 'Levanduľové' },
] as const;

export const ORDER_STATUSES = {
  pending: 'Čaká na platbu',
  paid: 'Zaplatená',
  shipped: 'Odoslaná',
  delivered: 'Doručená',
  cancelled: 'Zrušená',
} as const;
