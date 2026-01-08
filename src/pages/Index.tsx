import { useState } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { WelcomeScreen } from '@/components/screens/WelcomeScreen';
import { LocationScreen } from '@/components/screens/LocationScreen';
import { CropSelectionScreen } from '@/components/screens/CropSelectionScreen';
import { MarketComparisonScreen } from '@/components/screens/MarketComparisonScreen';
import { PriceTrendScreen } from '@/components/screens/PriceTrendScreen';
import { PriceAnalyticsScreen } from '@/components/screens/PriceAnalyticsScreen';
import { PriceAlertsScreen } from '@/components/screens/PriceAlertsScreen';
import { SettingsScreen } from '@/components/screens/SettingsScreen';
import { Crop, District, MandiPrice, Mandi } from '@/data/mockData';

type Screen = 'welcome' | 'location' | 'crop' | 'market' | 'trend' | 'analytics' | 'alerts' | 'settings';

function MandiMitraApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number | undefined>();
  const [selectedMandiPrice, setSelectedMandiPrice] = useState<(MandiPrice & { mandi: Mandi }) | null>(null);
  const [previousScreen, setPreviousScreen] = useState<Screen>('market');

  const handleLocationConfirm = (district: District) => {
    setSelectedDistrict(district);
    setCurrentScreen('crop');
  };

  const handleCropSelect = (crop: Crop, quantity?: number) => {
    setSelectedCrop(crop);
    setSelectedQuantity(quantity);
    setCurrentScreen('market');
  };

  const handleViewTrend = (mandiPrice: MandiPrice & { mandi: Mandi }) => {
    setSelectedMandiPrice(mandiPrice);
    setCurrentScreen('trend');
  };

  const handleViewAnalytics = () => {
    setPreviousScreen(currentScreen);
    setCurrentScreen('analytics');
  };

  const handleViewAlerts = () => {
    setPreviousScreen(currentScreen);
    setCurrentScreen('alerts');
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background">
      {currentScreen === 'welcome' && (
        <WelcomeScreen onGetStarted={() => setCurrentScreen('location')} />
      )}
      
      {currentScreen === 'location' && (
        <LocationScreen 
          onConfirm={handleLocationConfirm}
          onBack={() => setCurrentScreen('welcome')}
        />
      )}
      
      {currentScreen === 'crop' && selectedDistrict && (
        <CropSelectionScreen 
          district={selectedDistrict}
          onSelectCrop={handleCropSelect}
          onBack={() => setCurrentScreen('location')}
        />
      )}
      
      {currentScreen === 'market' && selectedCrop && selectedDistrict && (
        <MarketComparisonScreen 
          crop={selectedCrop}
          district={selectedDistrict}
          quantity={selectedQuantity}
          onViewTrend={handleViewTrend}
          onBack={() => setCurrentScreen('crop')}
          onSettings={() => setCurrentScreen('settings')}
          onViewAnalytics={handleViewAnalytics}
          onViewAlerts={handleViewAlerts}
        />
      )}
      
      {currentScreen === 'trend' && selectedMandiPrice && selectedCrop && (
        <PriceTrendScreen 
          mandiPrice={selectedMandiPrice}
          crop={selectedCrop}
          onBack={() => setCurrentScreen('market')}
        />
      )}

      {currentScreen === 'analytics' && selectedCrop && (
        <PriceAnalyticsScreen
          crop={selectedCrop}
          onBack={() => setCurrentScreen(previousScreen)}
          onSettings={() => setCurrentScreen('settings')}
        />
      )}

      {currentScreen === 'alerts' && (
        <PriceAlertsScreen onBack={() => setCurrentScreen(previousScreen)} />
      )}
      
      {currentScreen === 'settings' && (
        <SettingsScreen onBack={() => setCurrentScreen(previousScreen)} />
      )}
    </div>
  );
}

const Index = () => {
  return (
    <LanguageProvider>
      <MandiMitraApp />
    </LanguageProvider>
  );
};

export default Index;
