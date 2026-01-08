import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { PriceWidget } from '@/components/PriceWidget';
import { useLivePrices } from '@/hooks/useLivePrices';
import { Sprout, MapPin, TrendingUp, Bell, Wifi, WifiOff } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const { t, language } = useLanguage();
  const { prices, isLoading, lastUpdated, source, refetch } = useLivePrices();

  // Transform prices for widget display
  const widgetPrices = prices.slice(0, 3).map(p => ({
    cropId: p.cropId,
    cropName: language === 'hi' ? t(p.cropId) : p.cropName,
    price: p.price,
    trend: p.trend,
    mandiName: p.mandiName,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-background to-background flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Sprout className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">{t('appName')}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Connection status indicator */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {source === 'cached' ? (
              <WifiOff className="w-3 h-3" />
            ) : (
              <Wifi className="w-3 h-3 text-green-600" />
            )}
            <span>{source === 'cached' ? (language === 'hi' ? 'कैश्ड' : 'Cached') : 'Live'}</span>
          </div>
          <LanguageToggle />
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center px-6 pt-4">
        {/* Price Widget - Home Screen Style */}
        <div className="w-full max-w-sm mb-6">
          <PriceWidget 
            prices={widgetPrices}
            isLoading={isLoading}
            onRefresh={refetch}
            lastUpdated={lastUpdated || undefined}
          />
        </div>

        {/* Illustration */}
        <div className="mb-4">
          <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <div className="text-6xl">🌾</div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold leading-tight mb-2 text-foreground text-center">
          {t('welcomeTitle')}
        </h1>

        {/* Subtitle */}
        <p className="text-muted-foreground mb-6 max-w-sm text-center text-sm">
          {t('welcomeSubtitle')}
        </p>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
          <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card">
            <MapPin className="w-6 h-6 text-primary" />
            <span className="text-xs text-muted-foreground">Location</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card">
            <TrendingUp className="w-6 h-6 text-primary" />
            <span className="text-xs text-muted-foreground">Prices</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card">
            <Bell className="w-6 h-6 text-primary" />
            <span className="text-xs text-muted-foreground">Alerts</span>
          </div>
        </div>
      </main>

      {/* CTA Button */}
      <footer className="p-6">
        <Button 
          onClick={onGetStarted}
          className="w-full h-14 text-lg font-semibold rounded-xl shadow-lg"
          size="lg"
        >
          {t('getStarted')}
        </Button>
      </footer>
    </div>
  );
}
