
export interface Product {
  id: string;
  name: string;
  description: string;
  priceCoins: number;
  priceCash: number;
  category: 'Drink' | 'Snack' | 'Service';
  image: string;
  stockLevel?: 'IN STOCK' | 'LOW STOCK' | 'OUT OF STOCK';
  savings?: number;
}

export interface Reward {
  id: string;
  name: string;
  category: 'FOOD' | 'SHOPPING' | 'MALL';
  image: string;
  cashValue: string;
  coinPrice: number;
  description: string;
}

export interface RecyclableItem {
  name: string;
  material: string;
  reward: number;
  confidence: number;
  description: string;
}

export interface Transaction {
  id: string;
  type: 'recycle' | 'purchase' | 'transfer';
  amount: number;
  description: string;
  timestamp: Date;
}

export interface UserAccount {
  username: string;
  balance: number;
  totalRecycled: number;
  transactions: Transaction[];
}

export type ViewState = 
  | 'landing_choice' 
  | 'auth_choice'
  | 'auth_password'
  | 'auth_qr'
  | 'auth' 
  | 'dashboard' 
  | 'scan' 
  | 'store' 
  | 'wallet' 
  | 'rewards' 
  | 'vouchers' 
  | 'history' 
  | 'dispensing'
  | 'checkout_summary';
