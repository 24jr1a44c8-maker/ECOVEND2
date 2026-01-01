
import { Reward } from './types';

export const REWARD_CATALOG: Reward[] = [
  {
    id: 'r1',
    name: 'Swiggy',
    category: 'FOOD',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop',
    cashValue: '₹250',
    coinPrice: 750,
    description: '₹250 Food Delivery Credit'
  },
  {
    id: 'r2',
    name: 'Amazon India',
    category: 'SHOPPING',
    image: 'https://images.unsplash.com/photo-1544117518-3baf3ea147b8?w=600&h=400&fit=crop',
    cashValue: '₹500',
    coinPrice: 1500,
    description: '₹500 Online Shopping Voucher'
  },
  {
    id: 'r3',
    name: 'Starbucks India',
    category: 'FOOD',
    image: 'https://images.unsplash.com/photo-1544413660-299165566b1d?w=600&h=400&fit=crop',
    cashValue: '₹100',
    coinPrice: 300,
    description: '₹100 Beverage Credit'
  },
  {
    id: 'r4',
    name: 'Phoenix Mall',
    category: 'MALL',
    image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=600&h=400&fit=crop',
    cashValue: '₹1000',
    coinPrice: 3000,
    description: '₹1000 Shopping Gift Card'
  }
];

export const SYSTEM_PROMPT = `
You are an expert recycling AI for the Indian market. Analyze the image provided.
Identify the object, its material, and determine if it is recyclable.
Assign a reward in "Eco-Coins" between 5 and 100 based on value (e.g., plastic bottles = 10, aluminum cans = 20, glass = 30, electronics = 100).
Return ONLY a JSON object in this format:
{
  "name": "string",
  "material": "string",
  "reward": number,
  "confidence": number (0-1),
  "description": "brief description"
}
`;
