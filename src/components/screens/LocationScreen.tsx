import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Navigation, Shield, ChevronLeft } from 'lucide-react';
import { districts, District } from '@/data/mockData';

interface LocationScreenProps {
  onConfirm: (district: District) => void;
  onBack: () => void;
}

export function LocationScreen({ onConfirm, onBack }: LocationScreenProps) {
  const { t, language } = useLanguage();
  const [detecting, setDetecting] = useState(false);
  const [detectedDistrict, setDetectedDistrict] = useState<District | null>(null);
  const [showManualSelect, setShowManualSelect] = useState(false);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');

  const requestLocation = () => {
    setDetecting(true);
    
    // Simulate geolocation API with demo district
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // In demo, we'll default to Neemuch as a sample location
          setTimeout(() => {
            setDetectedDistrict(districts.find(d => d.id === 'neemuch')!);
            setDetecting(false);
          }, 1500);
        },
        () => {
          // Fallback if permission denied
          setTimeout(() => {
            setDetectedDistrict(districts.find(d => d.id === 'indore')!);
            setDetecting(false);
          }, 1500);
        }
      );
    } else {
      setTimeout(() => {
        setDetectedDistrict(districts.find(d => d.id === 'indore')!);
        setDetecting(false);
      }, 1500);
    }
  };

  const handleManualSelect = () => {
    if (selectedDistrictId) {
      const district = districts.find(d => d.id === selectedDistrictId);
      if (district) {
        setDetectedDistrict(district);
        setShowManualSelect(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b">
        <button onClick={onBack} className="p-2 -ml-2 touch-friendly">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="font-semibold">{t('appName')}</span>
        <LanguageToggle />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        {!detectedDistrict && !detecting && !showManualSelect && (
          <>
            {/* Location Icon */}
            <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mb-6">
              <MapPin className="w-16 h-16 text-primary" />
            </div>

            {/* Request Button */}
            <Button 
              onClick={requestLocation}
              className="w-full max-w-sm h-14 text-lg font-semibold rounded-xl mb-4"
              size="lg"
            >
              <Navigation className="w-5 h-5 mr-2" />
              {t('allowLocation')}
            </Button>

            {/* Manual Select Option */}
            <button 
              onClick={() => setShowManualSelect(true)}
              className="text-primary underline text-sm"
            >
              {t('selectDistrict')}
            </button>

            {/* Privacy Note */}
            <div className="flex items-center gap-2 mt-8 text-muted-foreground text-sm">
              <Shield className="w-4 h-4" />
              <span>{t('privacyNote')}</span>
            </div>
          </>
        )}

        {detecting && (
          <div className="text-center">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
              <Navigation className="w-10 h-10 text-primary" />
            </div>
            <p className="text-muted-foreground">{t('detectingLocation')}</p>
          </div>
        )}

        {showManualSelect && (
          <Card className="w-full max-w-sm p-6">
            <h2 className="font-semibold mb-4">{t('selectDistrict')}</h2>
            <Select value={selectedDistrictId} onValueChange={setSelectedDistrictId}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder={t('selectDistrict')} />
              </SelectTrigger>
              <SelectContent>
                {districts.map(district => (
                  <SelectItem key={district.id} value={district.id} className="text-base py-3">
                    {language === 'hi' ? district.nameHi : district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-3 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowManualSelect(false)}
                className="flex-1 h-12"
              >
                {t('back')}
              </Button>
              <Button 
                onClick={handleManualSelect}
                disabled={!selectedDistrictId}
                className="flex-1 h-12"
              >
                {t('confirm')}
              </Button>
            </div>
          </Card>
        )}

        {detectedDistrict && !showManualSelect && (
          <Card className="w-full max-w-sm p-6 text-center">
            <div className="w-16 h-16 bg-status-positive/20 rounded-full flex items-center justify-center mb-4 mx-auto">
              <MapPin className="w-8 h-8 text-status-positive" />
            </div>
            
            <p className="text-muted-foreground mb-2">{t('yourArea')}</p>
            <h2 className="text-2xl font-bold mb-1">
              {language === 'hi' ? detectedDistrict.nameHi : detectedDistrict.name}
            </h2>
            <p className="text-muted-foreground mb-6">{t('madhyaPradesh')}</p>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowManualSelect(true)}
                className="flex-1 h-12"
              >
                {t('changeLocation')}
              </Button>
              <Button 
                onClick={() => onConfirm(detectedDistrict)}
                className="flex-1 h-12"
              >
                {t('confirm')}
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
