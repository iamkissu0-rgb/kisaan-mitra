import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Sprout, Scissors, Sun, CloudRain } from 'lucide-react';
import { crops, type Crop } from '@/data/mockData';

interface CropCalendarScreenProps {
  onBack: () => void;
  onSelectCrop?: (crop: Crop) => void;
}

interface CropSeason {
  cropId: string;
  sowingStart: number; // month (1-12)
  sowingEnd: number;
  harvestStart: number;
  harvestEnd: number;
  season: 'kharif' | 'rabi' | 'zaid';
  tips: { hi: string; en: string };
}

// Crop calendar data for Madhya Pradesh
const cropSeasons: CropSeason[] = [
  {
    cropId: 'wheat',
    sowingStart: 10, // October
    sowingEnd: 11,   // November
    harvestStart: 3, // March
    harvestEnd: 4,   // April
    season: 'rabi',
    tips: { hi: 'बुवाई के समय पर्याप्त नमी जरूरी', en: 'Ensure adequate moisture during sowing' },
  },
  {
    cropId: 'soybean',
    sowingStart: 6,  // June
    sowingEnd: 7,    // July
    harvestStart: 10,// October
    harvestEnd: 11,  // November
    season: 'kharif',
    tips: { hi: 'मानसून की पहली बारिश के बाद बुवाई करें', en: 'Sow after first monsoon rains' },
  },
  {
    cropId: 'chana',
    sowingStart: 10, // October
    sowingEnd: 11,   // November
    harvestStart: 2, // February
    harvestEnd: 3,   // March
    season: 'rabi',
    tips: { hi: 'हल्की मिट्टी में अच्छी उपज', en: 'Good yield in light soil' },
  },
  {
    cropId: 'rice',
    sowingStart: 6,  // June
    sowingEnd: 7,    // July
    harvestStart: 10,// October
    harvestEnd: 11,  // November
    season: 'kharif',
    tips: { hi: 'पानी का उचित प्रबंधन जरूरी', en: 'Proper water management essential' },
  },
  {
    cropId: 'maize',
    sowingStart: 6,  // June
    sowingEnd: 7,    // July
    harvestStart: 9, // September
    harvestEnd: 10,  // October
    season: 'kharif',
    tips: { hi: '60-70 दिन में तैयार होता है', en: 'Ready in 60-70 days' },
  },
  {
    cropId: 'tomato',
    sowingStart: 8,  // August
    sowingEnd: 9,    // September
    harvestStart: 11,// November
    harvestEnd: 2,   // February
    season: 'rabi',
    tips: { hi: 'साल भर उगाया जा सकता है', en: 'Can be grown year-round' },
  },
  {
    cropId: 'onion',
    sowingStart: 10, // October
    sowingEnd: 12,   // December
    harvestStart: 2, // February
    harvestEnd: 4,   // April
    season: 'rabi',
    tips: { hi: 'कंद विकास के समय पानी कम करें', en: 'Reduce water during bulb development' },
  },
  {
    cropId: 'potato',
    sowingStart: 10, // October
    sowingEnd: 11,   // November
    harvestStart: 1, // January
    harvestEnd: 2,   // February
    season: 'rabi',
    tips: { hi: 'ठंडे मौसम में अच्छी उपज', en: 'Good yield in cool weather' },
  },
  {
    cropId: 'moong',
    sowingStart: 7,  // July
    sowingEnd: 8,    // August
    harvestStart: 9, // September
    harvestEnd: 10,  // October
    season: 'kharif',
    tips: { hi: 'कम पानी की जरूरत', en: 'Requires less water' },
  },
  {
    cropId: 'masoor',
    sowingStart: 10, // October
    sowingEnd: 11,   // November
    harvestStart: 2, // February
    harvestEnd: 3,   // March
    season: 'rabi',
    tips: { hi: 'ठंड में अच्छी बढ़त', en: 'Grows well in cold' },
  },
];

const months = [
  { short: 'Jan', hi: 'जन' },
  { short: 'Feb', hi: 'फर' },
  { short: 'Mar', hi: 'मार्च' },
  { short: 'Apr', hi: 'अप्रै' },
  { short: 'May', hi: 'मई' },
  { short: 'Jun', hi: 'जून' },
  { short: 'Jul', hi: 'जुल' },
  { short: 'Aug', hi: 'अग' },
  { short: 'Sep', hi: 'सित' },
  { short: 'Oct', hi: 'अक्टू' },
  { short: 'Nov', hi: 'नव' },
  { short: 'Dec', hi: 'दिस' },
];

const seasonColors = {
  kharif: { bg: 'bg-blue-100', text: 'text-blue-700', label: { hi: 'खरीफ', en: 'Kharif' } },
  rabi: { bg: 'bg-amber-100', text: 'text-amber-700', label: { hi: 'रबी', en: 'Rabi' } },
  zaid: { bg: 'bg-green-100', text: 'text-green-700', label: { hi: 'जायद', en: 'Zaid' } },
};

export function CropCalendarScreen({ onBack, onSelectCrop }: CropCalendarScreenProps) {
  const { t, language } = useLanguage();
  const currentMonth = new Date().getMonth() + 1; // 1-12

  const isInRange = (month: number, start: number, end: number) => {
    if (start <= end) {
      return month >= start && month <= end;
    }
    // Handle wrap-around (e.g., Nov to Feb)
    return month >= start || month <= end;
  };

  const getCropInfo = (cropId: string) => crops.find(c => c.id === cropId);

  // Get crops that can be sown this month
  const sowingNow = cropSeasons.filter(cs => isInRange(currentMonth, cs.sowingStart, cs.sowingEnd));
  const harvestingNow = cropSeasons.filter(cs => isInRange(currentMonth, cs.harvestStart, cs.harvestEnd));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 border-b border-border bg-card">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="font-bold text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            {language === 'hi' ? 'फसल कैलेंडर' : 'Crop Calendar'}
          </h1>
          <p className="text-xs text-muted-foreground">
            {language === 'hi' ? 'मध्य प्रदेश के लिए' : 'For Madhya Pradesh'}
          </p>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-4 overflow-auto pb-20">
        {/* Current Month Highlights */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Sun className="w-4 h-4 text-primary" />
              {language === 'hi' 
                ? `${months[currentMonth - 1].hi} - इस महीने` 
                : `${months[currentMonth - 1].short} - This Month`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Sowing Now */}
            {sowingNow.length > 0 && (
              <div>
                <p className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Sprout className="w-4 h-4 text-green-600" />
                  {language === 'hi' ? 'बुवाई का समय:' : 'Sowing Time:'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {sowingNow.map(cs => {
                    const crop = getCropInfo(cs.cropId);
                    return crop ? (
                      <button
                        key={cs.cropId}
                        onClick={() => onSelectCrop?.(crop)}
                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm hover:bg-green-200 transition-colors"
                      >
                        <span>{crop.icon}</span>
                        <span>{t(crop.nameKey)}</span>
                      </button>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Harvesting Now */}
            {harvestingNow.length > 0 && (
              <div>
                <p className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Scissors className="w-4 h-4 text-amber-600" />
                  {language === 'hi' ? 'कटाई का समय:' : 'Harvest Time:'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {harvestingNow.map(cs => {
                    const crop = getCropInfo(cs.cropId);
                    return crop ? (
                      <button
                        key={cs.cropId}
                        onClick={() => onSelectCrop?.(crop)}
                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm hover:bg-amber-200 transition-colors"
                      >
                        <span>{crop.icon}</span>
                        <span>{t(crop.nameKey)}</span>
                      </button>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Season Legend */}
        <div className="flex gap-2 justify-center">
          {Object.entries(seasonColors).map(([key, value]) => (
            <div key={key} className={`flex items-center gap-1 px-3 py-1 rounded-full ${value.bg} ${value.text} text-xs`}>
              {language === 'hi' ? value.label.hi : value.label.en}
            </div>
          ))}
        </div>

        {/* Full Calendar */}
        {cropSeasons.map(cs => {
          const crop = getCropInfo(cs.cropId);
          if (!crop) return null;

          const seasonStyle = seasonColors[cs.season];

          return (
            <Card key={cs.cropId} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{crop.icon}</span>
                    <div>
                      <CardTitle className="text-base">{t(crop.nameKey)}</CardTitle>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${seasonStyle.bg} ${seasonStyle.text}`}>
                        {language === 'hi' ? seasonStyle.label.hi : seasonStyle.label.en}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Timeline */}
                <div className="flex gap-0.5">
                  {months.map((month, idx) => {
                    const monthNum = idx + 1;
                    const isSowing = isInRange(monthNum, cs.sowingStart, cs.sowingEnd);
                    const isHarvest = isInRange(monthNum, cs.harvestStart, cs.harvestEnd);
                    const isCurrent = monthNum === currentMonth;

                    return (
                      <div
                        key={idx}
                        className={`flex-1 h-8 rounded-sm flex items-center justify-center text-xs font-medium transition-all ${
                          isSowing
                            ? 'bg-green-500 text-white'
                            : isHarvest
                            ? 'bg-amber-500 text-white'
                            : 'bg-muted text-muted-foreground'
                        } ${isCurrent ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                        title={`${month.short}: ${isSowing ? 'Sowing' : isHarvest ? 'Harvest' : ''}`}
                      >
                        {language === 'hi' ? month.hi.slice(0, 1) : month.short.slice(0, 1)}
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-green-500" />
                    <span>{language === 'hi' ? 'बुवाई' : 'Sowing'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-amber-500" />
                    <span>{language === 'hi' ? 'कटाई' : 'Harvest'}</span>
                  </div>
                </div>

                {/* Tips */}
                <div className="flex items-start gap-2 p-2 bg-muted/50 rounded-lg">
                  <CloudRain className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    {language === 'hi' ? cs.tips.hi : cs.tips.en}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </main>
    </div>
  );
}
