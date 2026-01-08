import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Sprout, MapPin, TrendingUp, Bell } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const { t } = useLanguage();

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
        <LanguageToggle />
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Illustration */}
        <div className="mb-8">
          <div className="w-48 h-48 bg-primary/20 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse-gentle">
            <div className="text-8xl">🌾</div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold leading-tight mb-4 text-foreground">
          {t('welcomeTitle')}
        </h1>

        {/* Subtitle */}
        <p className="text-muted-foreground mb-8 max-w-sm">
          {t('welcomeSubtitle')}
        </p>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-8 w-full max-w-sm">
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
