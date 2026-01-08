import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ChevronLeft, Bell, Globe, Database, Clock, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { t, language, setLanguage } = useLanguage();
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [alertThreshold, setAlertThreshold] = useState<number>(100);

  const handleEnableAlerts = async (enabled: boolean) => {
    if (enabled && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setAlertsEnabled(true);
      }
    } else {
      setAlertsEnabled(enabled);
    }
  };

  const thresholds = [50, 100, 200];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 border-b bg-card">
        <button onClick={onBack} className="p-2 -ml-2 touch-friendly">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="font-semibold text-lg">{t('settings')}</h1>
      </header>

      <main className="flex-1 p-4 space-y-4">
        {/* Price Alerts */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{t('priceAlerts')}</h3>
                <p className="text-sm text-muted-foreground">{t('alertDescription')}</p>
              </div>
            </div>
            <Switch
              checked={alertsEnabled}
              onCheckedChange={handleEnableAlerts}
            />
          </div>

          {alertsEnabled && (
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-3">{t('alertThreshold')}</p>
              <div className="flex gap-2">
                {thresholds.map(value => (
                  <Button
                    key={value}
                    variant={alertThreshold === value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAlertThreshold(value)}
                    className="flex-1"
                  >
                    ₹{value}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Language */}
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{t('language')}</h3>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={language === 'hi' ? 'default' : 'outline'}
              onClick={() => setLanguage('hi')}
              className="flex-1"
            >
              हिंदी
            </Button>
            <Button
              variant={language === 'en' ? 'default' : 'outline'}
              onClick={() => setLanguage('en')}
              className="flex-1"
            >
              English
            </Button>
          </div>
        </Card>

        {/* Data Source - Trust Section */}
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{t('dataSource')}</h3>
            </div>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-4 h-4 text-status-positive" />
              <span>{t('govtRecords')}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{t('lastUpdated')}: {new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN')}</span>
            </div>
          </div>
        </Card>

        {/* App Info */}
        <div className="text-center pt-4">
          <p className="text-2xl mb-1">🌾</p>
          <p className="font-semibold">{t('appName')}</p>
          <p className="text-sm text-muted-foreground">{t('appTagline')}</p>
          <p className="text-xs text-muted-foreground mt-2">v1.0.0 (Demo)</p>
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
