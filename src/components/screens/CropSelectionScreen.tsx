import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Check, Mic, MicOff } from 'lucide-react';
import { crops, Crop, District } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { toast } from 'sonner';

interface CropSelectionScreenProps {
  district: District;
  onSelectCrop: (crop: Crop, quantity?: number) => void;
  onBack: () => void;
}

// Mapping of Hindi/English crop names to crop IDs for voice matching
const cropNameMappings: Record<string, string> = {
  // Hindi names
  'गेहूं': 'wheat',
  'गेहूँ': 'wheat',
  'सोयाबीन': 'soybean',
  'चना': 'chana',
  'धान': 'rice',
  'चावल': 'rice',
  'मक्का': 'maize',
  'टमाटर': 'tomato',
  'प्याज': 'onion',
  'आलू': 'potato',
  'लहसुन': 'garlic',
  'मूंग': 'moong',
  'मसूर': 'masoor',
  // English names
  'wheat': 'wheat',
  'soybean': 'soybean',
  'soya': 'soybean',
  'chana': 'chana',
  'chickpea': 'chana',
  'rice': 'rice',
  'paddy': 'rice',
  'maize': 'maize',
  'corn': 'maize',
  'tomato': 'tomato',
  'onion': 'onion',
  'potato': 'potato',
  'garlic': 'garlic',
  'moong': 'moong',
  'mung': 'moong',
  'masoor': 'masoor',
  'lentil': 'masoor',
};

export function CropSelectionScreen({ district, onSelectCrop, onBack }: CropSelectionScreenProps) {
  const { t, language } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [quantity, setQuantity] = useState<string>('');

  const findCropFromVoice = (transcript: string) => {
    const normalizedTranscript = transcript.toLowerCase().trim();
    
    // Check each mapping
    for (const [name, cropId] of Object.entries(cropNameMappings)) {
      if (normalizedTranscript.includes(name.toLowerCase())) {
        const matchedCrop = crops.find(c => c.id === cropId);
        if (matchedCrop) {
          setSelectedCrop(matchedCrop);
          toast.success(
            language === 'hi' 
              ? `${t(matchedCrop.nameKey)} चुना गया` 
              : `Selected ${t(matchedCrop.nameKey)}`
          );
          return;
        }
      }
    }
    
    // No match found
    toast.error(
      language === 'hi' 
        ? 'फसल नहीं मिली, फिर से बोलें' 
        : 'Crop not found, try again'
    );
  };

  const { isListening, isSupported, startListening, stopListening } = useVoiceInput({
    language: language === 'hi' ? 'hi-IN' : 'en-IN',
    onResult: findCropFromVoice,
    onError: (error) => {
      console.error('Voice error:', error);
      toast.error(
        language === 'hi' 
          ? 'आवाज़ समझ नहीं आई' 
          : 'Could not understand speech'
      );
    },
  });

  const handleVoiceClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
      toast.info(
        language === 'hi' 
          ? 'बोलिए... "गेहूं", "सोयाबीन"...' 
          : 'Speak... "Wheat", "Soybean"...'
      );
    }
  };

  const handleContinue = () => {
    if (selectedCrop) {
      onSelectCrop(selectedCrop, quantity ? parseFloat(quantity) : undefined);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b">
        <button onClick={onBack} className="p-2 -ml-2 touch-friendly">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <span className="font-semibold block">{t('selectCrop')}</span>
          <span className="text-xs text-muted-foreground">
            {language === 'hi' ? district.nameHi : district.name}
          </span>
        </div>
        <LanguageToggle />
      </header>

      <main className="flex-1 p-4 pb-32 overflow-auto">
        {/* Voice Input Button */}
        {isSupported && (
          <Card 
            className={cn(
              'mb-4 p-4 flex items-center justify-between cursor-pointer transition-all',
              isListening && 'ring-2 ring-primary bg-primary/10'
            )}
            onClick={handleVoiceClick}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center transition-all',
                isListening ? 'bg-primary animate-pulse' : 'bg-primary/20'
              )}>
                {isListening ? (
                  <MicOff className="w-6 h-6 text-primary-foreground" />
                ) : (
                  <Mic className="w-6 h-6 text-primary" />
                )}
              </div>
              <div>
                <p className="font-medium">
                  {language === 'hi' ? 'बोलकर चुनें' : 'Select by voice'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isListening 
                    ? (language === 'hi' ? 'सुन रहे हैं...' : 'Listening...')
                    : (language === 'hi' ? 'टैप करके बोलें' : 'Tap and speak')
                  }
                </p>
              </div>
            </div>
            {isListening && (
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
          </Card>
        )}

        {/* Crop Grid */}
        <div className="grid grid-cols-3 gap-3">
          {crops.map(crop => (
            <Card
              key={crop.id}
              onClick={() => setSelectedCrop(crop)}
              className={cn(
                'p-4 flex flex-col items-center gap-2 cursor-pointer transition-all active:scale-95',
                crop.color,
                selectedCrop?.id === crop.id && 'ring-2 ring-primary ring-offset-2'
              )}
            >
              {selectedCrop?.id === crop.id && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              <span className="text-3xl">{crop.icon}</span>
              <span className="text-sm font-medium text-center">
                {t(crop.nameKey)}
              </span>
            </Card>
          ))}
        </div>

        {/* Quantity Input */}
        {selectedCrop && (
          <Card className="mt-6 p-4">
            <label className="block text-sm font-medium mb-2">
              {t('quantity')} <span className="text-muted-foreground">({t('optional')})</span>
            </label>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon"
                className="h-12 w-12"
                onClick={() => setQuantity(prev => Math.max(0, (parseFloat(prev) || 0) - 1).toString())}
              >
                −
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                className="h-12 text-center text-lg font-semibold"
              />
              <Button 
                variant="outline" 
                size="icon"
                className="h-12 w-12"
                onClick={() => setQuantity(prev => ((parseFloat(prev) || 0) + 1).toString())}
              >
                +
              </Button>
            </div>
          </Card>
        )}
      </main>

      {/* Fixed Bottom CTA */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <Button 
          onClick={handleContinue}
          disabled={!selectedCrop}
          className="w-full h-14 text-lg font-semibold rounded-xl"
          size="lg"
        >
          {t('viewMarket')} →
        </Button>
      </footer>
    </div>
  );
}
