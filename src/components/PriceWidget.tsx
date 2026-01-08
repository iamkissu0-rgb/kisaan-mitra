import { useLanguage } from '@/contexts/LanguageContext';
import { TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';
import { crops, type PriceTrend } from '@/data/mockData';

interface WidgetPrice {
  cropId: string;
  cropName: string;
  price: number;
  trend: PriceTrend;
  mandiName: string;
}

interface PriceWidgetProps {
  prices: WidgetPrice[];
  isLoading?: boolean;
  onRefresh?: () => void;
  lastUpdated?: string;
}

export function PriceWidget({ prices, isLoading, onRefresh, lastUpdated }: PriceWidgetProps) {
  const { t, language } = useLanguage();

  const getTrendIcon = (trend: PriceTrend) => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'falling':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getCropIcon = (cropId: string) => {
    const crop = crops.find(c => c.id === cropId);
    return crop?.icon || '🌾';
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-card rounded-2xl shadow-lg border border-border p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-foreground">
          {language === 'hi' ? 'आज के शीर्ष भाव' : "Today's Top Prices"}
        </h3>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Refresh prices"
          >
            <RefreshCw className={`w-4 h-4 text-muted-foreground ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {/* Price List */}
      {isLoading && prices.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 bg-muted rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-24 mb-1" />
                <div className="h-3 bg-muted rounded w-16" />
              </div>
              <div className="h-5 bg-muted rounded w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {prices.slice(0, 3).map((item, index) => (
            <div
              key={`${item.cropId}-${index}`}
              className="flex items-center gap-3 p-2 rounded-xl bg-muted/50"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                {getCropIcon(item.cropId)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {item.cropName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {item.mandiName}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(item.trend)}
                <span className="font-bold text-primary">
                  ₹{item.price.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {lastUpdated && (
        <p className="text-xs text-muted-foreground mt-3 text-center">
          {language === 'hi' ? 'अपडेट: ' : 'Updated: '}
          {formatTime(lastUpdated)}
        </p>
      )}
    </div>
  );
}
