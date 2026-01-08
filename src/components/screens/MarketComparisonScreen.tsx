import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, TrendingUp, TrendingDown, Minus, MapPin, Star, Lightbulb, ChevronRight, Settings, Share2 } from 'lucide-react';
import { Crop, District, getMandiPricesForCrop, getDecisionInsight, MandiPrice, Mandi } from '@/data/mockData';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MarketComparisonScreenProps {
  crop: Crop;
  district: District;
  quantity?: number;
  onViewTrend: (mandiPrice: MandiPrice & { mandi: Mandi }) => void;
  onBack: () => void;
  onSettings: () => void;
}

export function MarketComparisonScreen({ 
  crop, 
  district, 
  quantity,
  onViewTrend, 
  onBack,
  onSettings 
}: MarketComparisonScreenProps) {
  const { t, language } = useLanguage();
  const mandiPrices = getMandiPricesForCrop(crop.id);
  const insight = getDecisionInsight(crop.id);

  const shareOnWhatsApp = () => {
    const cropName = language === 'hi' ? t(crop.nameKey) : crop.nameKey;
    const districtName = language === 'hi' ? district.nameHi : district.name;
    
    let message = language === 'hi' 
      ? `🌾 *${cropName} के आज के भाव*\n📍 ${districtName}, मध्य प्रदेश\n\n`
      : `🌾 *Today's ${cropName} Prices*\n📍 ${districtName}, Madhya Pradesh\n\n`;

    mandiPrices.slice(0, 3).forEach((mp, index) => {
      const mandiName = language === 'hi' ? mp.mandi.nameHi : mp.mandi.name;
      const trendEmoji = mp.trend === 'rising' ? '📈' : mp.trend === 'falling' ? '📉' : '➡️';
      message += `${index + 1}. *${mandiName}*\n   ₹${mp.price.toLocaleString()}/क्विंटल ${trendEmoji}\n\n`;
    });

    message += language === 'hi' 
      ? `\n_मंडी मित्र ऐप से भेजा गया_`
      : `\n_Sent via Mandi Mitra app_`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast.success(language === 'hi' ? 'WhatsApp खुल रहा है...' : 'Opening WhatsApp...');
  };

  const getTrendIcon = (trend: 'rising' | 'stable' | 'falling') => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="w-5 h-5 text-status-positive" />;
      case 'falling':
        return <TrendingDown className="w-5 h-5 text-status-negative" />;
      default:
        return <Minus className="w-5 h-5 text-status-neutral" />;
    }
  };

  const getTrendText = (trend: 'rising' | 'stable' | 'falling') => {
    switch (trend) {
      case 'rising': return t('rising');
      case 'stable': return t('stable');
      case 'falling': return t('falling');
    }
  };

  const getDemandColor = (demand: 'high' | 'medium' | 'low') => {
    switch (demand) {
      case 'high': return 'bg-status-positive/20 text-status-positive border-status-positive/30';
      case 'medium': return 'bg-status-neutral/20 text-status-neutral border-status-neutral/30';
      case 'low': return 'bg-status-negative/20 text-status-negative border-status-negative/30';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b bg-card">
        <button onClick={onBack} className="p-2 -ml-2 touch-friendly">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-center flex-1">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">{crop.icon}</span>
            <span className="font-semibold">{t(crop.nameKey)}</span>
          </div>
          <span className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <MapPin className="w-3 h-3" />
            {language === 'hi' ? district.nameHi : district.name}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={shareOnWhatsApp} className="p-2 touch-friendly text-primary">
            <Share2 className="w-5 h-5" />
          </button>
          <button onClick={onSettings} className="p-2 -mr-2 touch-friendly">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 pb-6 overflow-auto space-y-4">
        {/* Decision Support Card */}
        <Card className={cn(
          'p-4 border-l-4',
          insight.type === 'wait' ? 'border-l-status-positive bg-status-positive/5' : 'border-l-status-negative bg-status-negative/5'
        )}>
          <div className="flex items-start gap-3">
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
              insight.type === 'wait' ? 'bg-status-positive/20' : 'bg-status-negative/20'
            )}>
              <Lightbulb className={cn(
                'w-5 h-5',
                insight.type === 'wait' ? 'text-status-positive' : 'text-status-negative'
              )} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">{t('todaySignal')}</h3>
              <p className="font-medium mb-1">
                {insight.type === 'wait' ? t('waitBeneficial') : t('sellNow')}
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                {t(insight.reason)}
              </p>
              <p className="text-xs text-muted-foreground italic">
                {t('disclaimer')}
              </p>
            </div>
          </div>
        </Card>

        {/* Nearby Mandis Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{t('nearbyMandis')}</h2>
          <span className="text-sm text-muted-foreground">
            {mandiPrices.length} {language === 'hi' ? 'मंडी' : 'mandis'}
          </span>
        </div>

        {/* Mandi Cards */}
        {mandiPrices.map((mp, index) => (
          <Card 
            key={mp.mandiId}
            className={cn(
              'p-4 cursor-pointer transition-all active:scale-[0.98]',
              index === 0 && 'ring-2 ring-primary'
            )}
            onClick={() => onViewTrend(mp)}
          >
            {index === 0 && (
              <Badge className="absolute -top-2 left-4 bg-primary text-primary-foreground gap-1">
                <Star className="w-3 h-3" />
                {t('bestOption')}
              </Badge>
            )}
            
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg">
                  {language === 'hi' ? mp.mandi.nameHi : mp.mandi.name}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {mp.mandi.distance} {t('kmAway')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">₹{mp.price.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{t('perQuintal')}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Trend */}
                <div className="flex items-center gap-1">
                  {getTrendIcon(mp.trend)}
                  <span className="text-sm">{getTrendText(mp.trend)}</span>
                </div>
                
                {/* Demand */}
                <Badge variant="outline" className={cn('text-xs', getDemandColor(mp.demand))}>
                  {t('demand')}: {t(mp.demand)}
                </Badge>
              </div>
              
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>
        ))}

        {/* Total Value Estimate */}
        {quantity && (
          <Card className="p-4 bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">
              {quantity} क्विंटल × ₹{mandiPrices[0]?.price.toLocaleString()}
            </p>
            <p className="text-xl font-bold">
              ≈ ₹{(quantity * (mandiPrices[0]?.price || 0)).toLocaleString()}
            </p>
          </Card>
        )}
      </main>
    </div>
  );
}
