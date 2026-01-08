import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { PriceWidget } from '@/components/PriceWidget';
import { WeatherWidget } from '@/components/WeatherWidget';
import { useLivePrices } from '@/hooks/useLivePrices';
import { Sprout, MapPin, TrendingUp, Bell, Wifi, WifiOff, Calendar } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onViewCalendar?: () => void;
}

export function WelcomeScreen({ onGetStarted, onViewCalendar }: WelcomeScreenProps) {
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
      <main className="flex-1 flex flex-col items-center px-6 pt-2 overflow-auto pb-4">
        {/* Weather Widget (Compact) */}
        <div className="w-full max-w-sm mb-4">
          <WeatherWidget />
        </div>

        {/* Price Widget - Home Screen Style */}
        <div className="w-full max-w-sm mb-4">
          <PriceWidget 
            prices={widgetPrices}
            isLoading={isLoading}
            onRefresh={refetch}
            lastUpdated={lastUpdated || undefined}
          />
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold leading-tight mb-2 text-foreground text-center">
          {t('welcomeTitle')}
        </h1>

        {/* Subtitle */}
        <p className="text-muted-foreground mb-4 max-w-sm text-center text-sm">
          {t('welcomeSubtitle')}
        </p>

        {/* Features */}
        <div className="grid grid-cols-4 gap-3 w-full max-w-sm">
          <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-card">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="text-xs text-muted-foreground">
              {language === 'hi' ? 'स्थान' : 'Location'}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-card">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-xs text-muted-foreground">
              {language === 'hi' ? 'भाव' : 'Prices'}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-card">
            <Bell className="w-5 h-5 text-primary" />
            <span className="text-xs text-muted-foreground">
              {language === 'hi' ? 'अलर्ट' : 'Alerts'}
            </span>
          </div>
          <button 
            onClick={onViewCalendar}
            className="flex flex-col items-center gap-1 p-2 rounded-xl bg-card hover:bg-primary/10 transition-colors"
          >
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-xs text-muted-foreground">
              {language === 'hi' ? 'कैलेंडर' : 'Calendar'}
            </span>
          </button>
        </div>
      </main>

      {/* CTA Button */}
      <footer className="p-6 pt-2">
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
