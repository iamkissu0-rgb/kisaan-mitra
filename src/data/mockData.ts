// Mock data for Mandi Mitra - structured for easy API integration later

export interface Crop {
  id: string;
  nameKey: string;
  icon: string;
  color: string;
}

export const crops: Crop[] = [
  { id: 'wheat', nameKey: 'wheat', icon: '🌾', color: 'bg-amber-100' },
  { id: 'soybean', nameKey: 'soybean', icon: '🫘', color: 'bg-green-100' },
  { id: 'chana', nameKey: 'chana', icon: '🟤', color: 'bg-yellow-100' },
  { id: 'rice', nameKey: 'rice', icon: '🍚', color: 'bg-slate-100' },
  { id: 'maize', nameKey: 'maize', icon: '🌽', color: 'bg-yellow-50' },
  { id: 'tomato', nameKey: 'tomato', icon: '🍅', color: 'bg-red-100' },
  { id: 'onion', nameKey: 'onion', icon: '🧅', color: 'bg-purple-100' },
  { id: 'potato', nameKey: 'potato', icon: '🥔', color: 'bg-amber-50' },
  { id: 'garlic', nameKey: 'garlic', icon: '🧄', color: 'bg-slate-50' },
  { id: 'moong', nameKey: 'moong', icon: '🫛', color: 'bg-lime-100' },
  { id: 'masoor', nameKey: 'masoor', icon: '🔴', color: 'bg-orange-100' },
];

export interface District {
  id: string;
  name: string;
  nameHi: string;
}

export const districts: District[] = [
  { id: 'indore', name: 'Indore', nameHi: 'इंदौर' },
  { id: 'bhopal', name: 'Bhopal', nameHi: 'भोपाल' },
  { id: 'ujjain', name: 'Ujjain', nameHi: 'उज्जैन' },
  { id: 'gwalior', name: 'Gwalior', nameHi: 'ग्वालियर' },
  { id: 'jabalpur', name: 'Jabalpur', nameHi: 'जबलपुर' },
  { id: 'neemuch', name: 'Neemuch', nameHi: 'नीमच' },
  { id: 'mandsaur', name: 'Mandsaur', nameHi: 'मंदसौर' },
  { id: 'dewas', name: 'Dewas', nameHi: 'देवास' },
  { id: 'ratlam', name: 'Ratlam', nameHi: 'रतलाम' },
  { id: 'sagar', name: 'Sagar', nameHi: 'सागर' },
];

export type PriceTrend = 'rising' | 'stable' | 'falling';
export type DemandLevel = 'high' | 'medium' | 'low';

export interface Mandi {
  id: string;
  name: string;
  nameHi: string;
  districtId: string;
  distance: number; // in km
}

export const mandis: Mandi[] = [
  { id: 'neemuch-mandi', name: 'Neemuch Mandi', nameHi: 'नीमच मंडी', districtId: 'neemuch', distance: 12 },
  { id: 'mandsaur-mandi', name: 'Mandsaur Mandi', nameHi: 'मंदसौर मंडी', districtId: 'mandsaur', distance: 28 },
  { id: 'indore-mandi', name: 'Indore Mandi', nameHi: 'इंदौर मंडी', districtId: 'indore', distance: 45 },
  { id: 'ujjain-mandi', name: 'Ujjain Mandi', nameHi: 'उज्जैन मंडी', districtId: 'ujjain', distance: 35 },
  { id: 'dewas-mandi', name: 'Dewas Mandi', nameHi: 'देवास मंडी', districtId: 'dewas', distance: 52 },
  { id: 'ratlam-mandi', name: 'Ratlam Mandi', nameHi: 'रतलाम मंडी', districtId: 'ratlam', distance: 40 },
];

export interface MandiPrice {
  mandiId: string;
  cropId: string;
  price: number;
  trend: PriceTrend;
  demand: DemandLevel;
  lastUpdated: string;
  priceHistory: { date: string; price: number }[];
}

// Generate mock price data
function generatePriceHistory(basePrice: number, trend: PriceTrend): { date: string; price: number }[] {
  const history: { date: string; price: number }[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    let variance = (Math.random() - 0.5) * 100;
    if (trend === 'rising') variance += 30 * (6 - i);
    if (trend === 'falling') variance -= 30 * (6 - i);
    
    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(basePrice + variance),
    });
  }
  
  return history;
}

export const mandiPrices: MandiPrice[] = [
  // Wheat prices
  { mandiId: 'neemuch-mandi', cropId: 'wheat', price: 2450, trend: 'rising', demand: 'high', lastUpdated: new Date().toISOString(), priceHistory: generatePriceHistory(2450, 'rising') },
  { mandiId: 'mandsaur-mandi', cropId: 'wheat', price: 2380, trend: 'stable', demand: 'medium', lastUpdated: new Date().toISOString(), priceHistory: generatePriceHistory(2380, 'stable') },
  { mandiId: 'indore-mandi', cropId: 'wheat', price: 2420, trend: 'rising', demand: 'high', lastUpdated: new Date().toISOString(), priceHistory: generatePriceHistory(2420, 'rising') },
  
  // Soybean prices
  { mandiId: 'neemuch-mandi', cropId: 'soybean', price: 4850, trend: 'rising', demand: 'high', lastUpdated: new Date().toISOString(), priceHistory: generatePriceHistory(4850, 'rising') },
  { mandiId: 'mandsaur-mandi', cropId: 'soybean', price: 4780, trend: 'stable', demand: 'medium', lastUpdated: new Date().toISOString(), priceHistory: generatePriceHistory(4780, 'stable') },
  { mandiId: 'indore-mandi', cropId: 'soybean', price: 4720, trend: 'falling', demand: 'low', lastUpdated: new Date().toISOString(), priceHistory: generatePriceHistory(4720, 'falling') },
  
  // Chana prices
  { mandiId: 'neemuch-mandi', cropId: 'chana', price: 5200, trend: 'stable', demand: 'medium', lastUpdated: new Date().toISOString(), priceHistory: generatePriceHistory(5200, 'stable') },
  { mandiId: 'mandsaur-mandi', cropId: 'chana', price: 5350, trend: 'rising', demand: 'high', lastUpdated: new Date().toISOString(), priceHistory: generatePriceHistory(5350, 'rising') },
  { mandiId: 'ujjain-mandi', cropId: 'chana', price: 5180, trend: 'falling', demand: 'low', lastUpdated: new Date().toISOString(), priceHistory: generatePriceHistory(5180, 'falling') },
  
  // Tomato prices
  { mandiId: 'indore-mandi', cropId: 'tomato', price: 1800, trend: 'falling', demand: 'medium', lastUpdated: new Date().toISOString(), priceHistory: generatePriceHistory(1800, 'falling') },
  { mandiId: 'dewas-mandi', cropId: 'tomato', price: 2100, trend: 'rising', demand: 'high', lastUpdated: new Date().toISOString(), priceHistory: generatePriceHistory(2100, 'rising') },
  { mandiId: 'ujjain-mandi', cropId: 'tomato', price: 1950, trend: 'stable', demand: 'medium', lastUpdated: new Date().toISOString(), priceHistory: generatePriceHistory(1950, 'stable') },
  
  // Onion prices
  { mandiId: 'neemuch-mandi', cropId: 'onion', price: 1200, trend: 'rising', demand: 'high', lastUpdated: new Date().toISOString(), priceHistory: generatePriceHistory(1200, 'rising') },
  { mandiId: 'indore-mandi', cropId: 'onion', price: 1150, trend: 'stable', demand: 'medium', lastUpdated: new Date().toISOString(), priceHistory: generatePriceHistory(1150, 'stable') },
  { mandiId: 'ratlam-mandi', cropId: 'onion', price: 1080, trend: 'falling', demand: 'low', lastUpdated: new Date().toISOString(), priceHistory: generatePriceHistory(1080, 'falling') },
  
  // Potato prices
  { mandiId: 'indore-mandi', cropId: 'potato', price: 1400, trend: 'stable', demand: 'medium', lastUpdated: new Date().toISOString(), priceHistory: generatePriceHistory(1400, 'stable') },
  { mandiId: 'dewas-mandi', cropId: 'potato', price: 1350, trend: 'falling', demand: 'low', lastUpdated: new Date().toISOString(), priceHistory: generatePriceHistory(1350, 'falling') },
  { mandiId: 'ujjain-mandi', cropId: 'potato', price: 1480, trend: 'rising', demand: 'high', lastUpdated: new Date().toISOString(), priceHistory: generatePriceHistory(1480, 'rising') },
];

// Helper function to get mandi prices for a specific crop
export function getMandiPricesForCrop(cropId: string): (MandiPrice & { mandi: Mandi })[] {
  return mandiPrices
    .filter(p => p.cropId === cropId)
    .map(p => ({
      ...p,
      mandi: mandis.find(m => m.id === p.mandiId)!,
    }))
    .sort((a, b) => b.price - a.price); // Sort by price descending (best price first)
}

// Helper function to generate decision insight
export function getDecisionInsight(cropId: string): { type: 'wait' | 'sell'; reason: string } {
  const prices = getMandiPricesForCrop(cropId);
  const risingCount = prices.filter(p => p.trend === 'rising').length;
  const fallingCount = prices.filter(p => p.trend === 'falling').length;
  
  if (risingCount > fallingCount) {
    return { type: 'wait', reason: 'pricesRising' };
  } else if (fallingCount > risingCount) {
    return { type: 'sell', reason: 'pricesFalling' };
  }
  return { type: 'wait', reason: 'pricesRising' };
}
