import { useState, useEffect, useCallback } from 'react';
import { mandiPrices, mandis, crops, type PriceTrend, type DemandLevel } from '@/data/mockData';

interface LivePrice {
  cropId: string;
  cropName: string;
  price: number;
  trend: PriceTrend;
  demand: DemandLevel;
  mandiName: string;
  source: 'live' | 'cached';
}

interface UseLivePricesResult {
  prices: LivePrice[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  source: string;
  refetch: () => Promise<void>;
}

export function useLivePrices(district?: string, cropId?: string): UseLivePricesResult {
  const [prices, setPrices] = useState<LivePrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [source, setSource] = useState<string>('cached');

  const getCropName = (id: string, language: string = 'en'): string => {
    const crop = crops.find(c => c.id === id);
    return crop?.nameKey || id;
  };

  // Map API commodity names back to our crop IDs
  const mapCommodityToCropId = (commodity: string): string | null => {
    const mapping: Record<string, string> = {
      'wheat': 'wheat',
      'soyabean': 'soybean',
      'soybean': 'soybean',
      'bengal gram': 'chana',
      'gram': 'chana',
      'chana': 'chana',
      'paddy': 'rice',
      'rice': 'rice',
      'maize': 'maize',
      'tomato': 'tomato',
      'onion': 'onion',
      'potato': 'potato',
      'garlic': 'garlic',
      'green gram': 'moong',
      'moong': 'moong',
      'lentil': 'masoor',
      'masur': 'masoor',
    };

    const lowerCommodity = commodity.toLowerCase();
    for (const [key, value] of Object.entries(mapping)) {
      if (lowerCommodity.includes(key)) {
        return value;
      }
    }
    return null;
  };

  const fetchPrices = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set('state', 'Madhya Pradesh');
      if (district) params.set('district', district);
      if (cropId) params.set('crop', cropId);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mandi-prices?${params.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch live prices');
      }

      const data = await response.json();

      if (data.success && data.prices) {
        const livePrices: LivePrice[] = data.prices.map((p: any) => {
          const cropIdMapped = mapCommodityToCropId(p.commodity);
          return {
            cropId: cropIdMapped || 'unknown',
            cropName: p.commodity,
            price: p.modalPrice,
            trend: (p.trend as PriceTrend) || 'stable',
            demand: (p.demand as DemandLevel) || 'medium',
            mandiName: p.market,
            source: data.source === 'cached' ? 'cached' : 'live',
          };
        }).filter((p: LivePrice) => p.cropId !== 'unknown');

        setPrices(livePrices);
        setSource(data.source);
        setLastUpdated(data.lastUpdated);
      }
    } catch (err) {
      console.error('Error fetching live prices:', err);
      setError('Unable to fetch live prices, using cached data');
      
      // Fallback to mock data
      const fallbackPrices: LivePrice[] = mandiPrices.slice(0, 6).map(mp => {
        const mandi = mandis.find(m => m.id === mp.mandiId);
        return {
          cropId: mp.cropId,
          cropName: getCropName(mp.cropId),
          price: mp.price,
          trend: mp.trend,
          demand: mp.demand,
          mandiName: mandi?.name || '',
          source: 'cached' as const,
        };
      });
      
      setPrices(fallbackPrices);
      setSource('cached');
      setLastUpdated(new Date().toISOString());
    } finally {
      setIsLoading(false);
    }
  }, [district, cropId]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  return {
    prices,
    isLoading,
    error,
    lastUpdated,
    source,
    refetch: fetchPrices,
  };
}
