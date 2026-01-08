import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Settings, TrendingUp, TrendingDown, Calendar, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { crops, type Crop } from '@/data/mockData';

interface PriceAnalyticsScreenProps {
  crop: Crop;
  onBack: () => void;
  onSettings: () => void;
}

// Generate mock analytics data
function generateWeeklyData(cropId: string) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const basePrice = cropId === 'wheat' ? 2400 : cropId === 'soybean' ? 4800 : 3000;
  
  return days.map((day, i) => ({
    day,
    price: Math.round(basePrice + (Math.random() - 0.3) * 300 + i * 20),
    volume: Math.round(500 + Math.random() * 300),
  }));
}

function generateMonthlyData(cropId: string) {
  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  const basePrice = cropId === 'wheat' ? 2200 : cropId === 'soybean' ? 4500 : 2800;
  
  return months.map((month, i) => ({
    month,
    avgPrice: Math.round(basePrice + i * 150 + (Math.random() - 0.5) * 200),
    minPrice: Math.round(basePrice + i * 100),
    maxPrice: Math.round(basePrice + i * 200 + 300),
  }));
}

function getBestSellingTimes(cropId: string) {
  const times = [
    { period: 'morning', label: 'सुबह 6-9 बजे', labelEn: '6-9 AM', score: 85 },
    { period: 'midday', label: 'दोपहर 11-2 बजे', labelEn: '11 AM-2 PM', score: 72 },
    { period: 'evening', label: 'शाम 4-6 बजे', labelEn: '4-6 PM', score: 65 },
  ];
  
  // Shuffle scores based on crop
  const shift = cropId.length % 3;
  return times.map((t, i) => ({
    ...t,
    score: times[(i + shift) % 3].score,
  })).sort((a, b) => b.score - a.score);
}

function getSeasonalInsights(cropId: string, language: string) {
  const insights = {
    wheat: {
      hi: 'गेहूं के भाव अप्रैल-मई में सबसे ज्यादा होते हैं',
      en: 'Wheat prices peak in April-May harvest season',
    },
    soybean: {
      hi: 'सोयाबीन अक्टूबर-नवंबर में बेचना फायदेमंद',
      en: 'Best to sell Soybean in October-November',
    },
    chana: {
      hi: 'चना के भाव मार्च में चढ़ते हैं',
      en: 'Chana prices rise in March',
    },
    default: {
      hi: 'सीजन के अनुसार भाव बदलते हैं',
      en: 'Prices vary with season',
    },
  };
  
  const insight = insights[cropId as keyof typeof insights] || insights.default;
  return language === 'hi' ? insight.hi : insight.en;
}

export function PriceAnalyticsScreen({ crop, onBack, onSettings }: PriceAnalyticsScreenProps) {
  const { t, language } = useLanguage();
  
  const weeklyData = generateWeeklyData(crop.id);
  const monthlyData = generateMonthlyData(crop.id);
  const bestTimes = getBestSellingTimes(crop.id);
  const seasonalInsight = getSeasonalInsights(crop.id, language);
  
  // Calculate trend
  const firstPrice = weeklyData[0].price;
  const lastPrice = weeklyData[weeklyData.length - 1].price;
  const trendPercent = ((lastPrice - firstPrice) / firstPrice * 100).toFixed(1);
  const isRising = lastPrice > firstPrice;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{crop.icon}</span>
            <div>
              <h1 className="font-bold text-foreground">{t(crop.nameKey)}</h1>
              <p className="text-xs text-muted-foreground">
                {language === 'hi' ? 'मूल्य विश्लेषण' : 'Price Analytics'}
              </p>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onSettings}>
          <Settings className="w-5 h-5" />
        </Button>
      </header>

      <main className="flex-1 p-4 space-y-4 overflow-auto pb-20">
        {/* Weekly Trend Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                {language === 'hi' ? 'साप्ताहिक रुझान' : 'Weekly Trend'}
              </CardTitle>
              <div className={`flex items-center gap-1 text-sm font-medium ${isRising ? 'text-green-600' : 'text-red-500'}`}>
                {isRising ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {isRising ? '+' : ''}{trendPercent}%
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`₹${value}`, language === 'hi' ? 'भाव' : 'Price']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Price Range */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              {language === 'hi' ? 'मासिक मूल्य सीमा' : 'Monthly Price Range'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value, name) => [
                      `₹${value}`, 
                      name === 'avgPrice' ? (language === 'hi' ? 'औसत' : 'Avg') :
                      name === 'minPrice' ? (language === 'hi' ? 'न्यूनतम' : 'Min') :
                      (language === 'hi' ? 'अधिकतम' : 'Max')
                    ]}
                  />
                  <Bar dataKey="avgPrice" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Best Selling Times */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {language === 'hi' ? '🕐 बेचने का सबसे अच्छा समय' : '🕐 Best Selling Times'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {bestTimes.map((time, index) => (
              <div key={time.period} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {language === 'hi' ? time.label : time.labelEn}
                  </p>
                  <div className="w-full bg-muted rounded-full h-2 mt-1">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${time.score}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-primary">{time.score}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Seasonal Insight */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <p className="font-medium text-foreground">
                  {language === 'hi' ? 'मौसमी सुझाव' : 'Seasonal Insight'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {seasonalInsight}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
