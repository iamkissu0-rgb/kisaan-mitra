import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react';
import { MandiPrice, Mandi, Crop } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface PriceTrendScreenProps {
  mandiPrice: MandiPrice & { mandi: Mandi };
  crop: Crop;
  onBack: () => void;
}

export function PriceTrendScreen({ mandiPrice, crop, onBack }: PriceTrendScreenProps) {
  const { t, language } = useLanguage();
  
  const { priceHistory } = mandiPrice;
  const maxPrice = Math.max(...priceHistory.map(p => p.price));
  const minPrice = Math.min(...priceHistory.map(p => p.price));
  const priceRange = maxPrice - minPrice || 1;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { 
      day: 'numeric',
      month: 'short'
    });
  };

  const getTrendIcon = (trend: 'rising' | 'stable' | 'falling') => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="w-6 h-6 text-status-positive" />;
      case 'falling':
        return <TrendingDown className="w-6 h-6 text-status-negative" />;
      default:
        return <Minus className="w-6 h-6 text-status-neutral" />;
    }
  };

  const getTrendColor = (trend: 'rising' | 'stable' | 'falling') => {
    switch (trend) {
      case 'rising': return 'text-status-positive';
      case 'falling': return 'text-status-negative';
      default: return 'text-status-neutral';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 border-b bg-card">
        <button onClick={onBack} className="p-2 -ml-2 touch-friendly">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <h1 className="font-semibold">
            {language === 'hi' ? mandiPrice.mandi.nameHi : mandiPrice.mandi.name}
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <span className="text-lg">{crop.icon}</span>
            {t(crop.nameKey)}
          </p>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-4">
        {/* Current Price Card */}
        <Card className="p-4 text-center">
          <p className="text-muted-foreground mb-1">{t('currentPrice')}</p>
          <p className="text-4xl font-bold text-primary mb-2">
            ₹{mandiPrice.price.toLocaleString()}
          </p>
          <div className="flex items-center justify-center gap-2">
            {getTrendIcon(mandiPrice.trend)}
            <span className={cn('font-medium', getTrendColor(mandiPrice.trend))}>
              {t(mandiPrice.trend)}
            </span>
          </div>
        </Card>

        {/* Price Chart */}
        <Card className="p-4">
          <h2 className="font-semibold mb-4">{t('last7Days')}</h2>
          
          {/* Simple Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-40 mb-4">
            {priceHistory.map((point, index) => {
              const height = ((point.price - minPrice) / priceRange) * 100 + 20;
              const isToday = index === priceHistory.length - 1;
              
              return (
                <div key={point.date} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-medium">₹{point.price}</span>
                  <div 
                    className={cn(
                      'w-full rounded-t-md transition-all',
                      isToday ? 'bg-primary' : 'bg-primary/40'
                    )}
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {formatDate(point.date).split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Price Range */}
          <div className="flex justify-between text-sm text-muted-foreground pt-2 border-t">
            <span>Min: ₹{minPrice.toLocaleString()}</span>
            <span>Max: ₹{maxPrice.toLocaleString()}</span>
          </div>
        </Card>

        {/* Last Updated */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{t('lastUpdated')}: {new Date(mandiPrice.lastUpdated).toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN')}</span>
        </div>
      </main>

      {/* Back Button */}
      <footer className="p-4 border-t">
        <Button 
          onClick={onBack}
          variant="outline"
          className="w-full h-12"
        >
          ← {t('back')}
        </Button>
      </footer>
    </div>
  );
}
