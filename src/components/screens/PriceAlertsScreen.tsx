import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Bell, BellOff, Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { crops, type Crop } from '@/data/mockData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PriceAlert {
  id: string;
  device_id: string;
  crop_id: string;
  target_price: number;
  alert_type: 'above' | 'below';
  is_active: boolean;
  triggered_at: string | null;
  created_at: string;
}

type DbPriceAlert = {
  id: string;
  device_id: string;
  crop_id: string;
  target_price: number;
  alert_type: string;
  is_active: boolean;
  triggered_at: string | null;
  created_at: string;
};

interface PriceAlertsScreenProps {
  onBack: () => void;
}

// Get or create device ID for anonymous tracking
function getDeviceId(): string {
  let deviceId = localStorage.getItem('mandi_device_id');
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('mandi_device_id', deviceId);
  }
  return deviceId;
}

export function PriceAlertsScreen({ onBack }: PriceAlertsScreenProps) {
  const { t, language } = useLanguage();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<string>('wheat');
  const [targetPrice, setTargetPrice] = useState<string>('');
  const [alertType, setAlertType] = useState<'above' | 'below'>('above');

  const deviceId = getDeviceId();

  useEffect(() => {
    fetchAlerts();
  }, []);

  async function fetchAlerts() {
    try {
      const { data, error } = await supabase
        .from('price_alerts')
        .select('*')
        .eq('device_id', deviceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Cast alert_type to our union type
      const typedAlerts: PriceAlert[] = (data || []).map((d: DbPriceAlert) => ({
        ...d,
        alert_type: d.alert_type as 'above' | 'below',
      }));
      setAlerts(typedAlerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast.error(language === 'hi' ? 'अलर्ट लोड करने में त्रुटि' : 'Error loading alerts');
    } finally {
      setIsLoading(false);
    }
  }

  async function createAlert() {
    if (!targetPrice || isNaN(Number(targetPrice))) {
      toast.error(language === 'hi' ? 'कृपया सही मूल्य दर्ज करें' : 'Please enter a valid price');
      return;
    }

    try {
      const { error } = await supabase
        .from('price_alerts')
        .insert({
          device_id: deviceId,
          crop_id: selectedCrop,
          target_price: Number(targetPrice),
          alert_type: alertType,
        });

      if (error) throw error;

      toast.success(language === 'hi' ? 'अलर्ट सेट हो गया!' : 'Alert set successfully!');
      setShowAddForm(false);
      setTargetPrice('');
      fetchAlerts();

      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    } catch (error) {
      console.error('Error creating alert:', error);
      toast.error(language === 'hi' ? 'अलर्ट बनाने में त्रुटि' : 'Error creating alert');
    }
  }

  async function toggleAlert(alertId: string, isActive: boolean) {
    try {
      const { error } = await supabase
        .from('price_alerts')
        .update({ is_active: !isActive })
        .eq('id', alertId);

      if (error) throw error;
      fetchAlerts();
    } catch (error) {
      console.error('Error toggling alert:', error);
    }
  }

  async function deleteAlert(alertId: string) {
    try {
      const { error } = await supabase
        .from('price_alerts')
        .delete()
        .eq('id', alertId);

      if (error) throw error;
      toast.success(language === 'hi' ? 'अलर्ट हटा दिया गया' : 'Alert deleted');
      fetchAlerts();
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  }

  const getCropInfo = (cropId: string): Crop | undefined => {
    return crops.find(c => c.id === cropId);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-bold text-foreground">
              {language === 'hi' ? '🔔 मूल्य अलर्ट' : '🔔 Price Alerts'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {language === 'hi' ? 'जब भाव बदलें तो सूचना पाएं' : 'Get notified when prices change'}
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-4 overflow-auto pb-24">
        {/* Info Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              {language === 'hi' 
                ? '💡 जब आपकी फसल का भाव आपके लक्ष्य मूल्य से ऊपर या नीचे जाए, तो तुरंत सूचना प्राप्त करें।'
                : '💡 Get instant notifications when your crop price goes above or below your target.'}
            </p>
          </CardContent>
        </Card>

        {/* Existing Alerts */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-12 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : alerts.length > 0 ? (
          <div className="space-y-3">
            {alerts.map(alert => {
              const crop = getCropInfo(alert.crop_id);
              return (
                <Card key={alert.id} className={!alert.is_active ? 'opacity-50' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                        {crop?.icon || '🌾'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">
                            {crop ? t(crop.nameKey) : alert.crop_id}
                          </p>
                          {alert.alert_type === 'above' ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {alert.alert_type === 'above' 
                            ? (language === 'hi' ? 'जब ऊपर जाए:' : 'When above:')
                            : (language === 'hi' ? 'जब नीचे जाए:' : 'When below:')}
                          <span className="font-bold text-primary ml-1">
                            ₹{alert.target_price.toLocaleString()}
                          </span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleAlert(alert.id, alert.is_active)}
                        >
                          {alert.is_active ? (
                            <Bell className="w-4 h-4 text-primary" />
                          ) : (
                            <BellOff className="w-4 h-4 text-muted-foreground" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteAlert(alert.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {language === 'hi' 
                  ? 'कोई अलर्ट नहीं है। नया अलर्ट जोड़ें!'
                  : 'No alerts yet. Add a new alert!'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Add Alert Form */}
        {showAddForm && (
          <Card className="border-primary">
            <CardContent className="p-4 space-y-4">
              <h3 className="font-medium text-foreground">
                {language === 'hi' ? 'नया अलर्ट जोड़ें' : 'Add New Alert'}
              </h3>
              
              {/* Crop Selection */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  {language === 'hi' ? 'फसल चुनें' : 'Select Crop'}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {crops.slice(0, 8).map(crop => (
                    <button
                      key={crop.id}
                      onClick={() => setSelectedCrop(crop.id)}
                      className={`p-2 rounded-lg text-center transition-all ${
                        selectedCrop === crop.id 
                          ? 'bg-primary text-primary-foreground ring-2 ring-primary' 
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      <span className="text-xl block">{crop.icon}</span>
                      <span className="text-xs">{t(crop.nameKey)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Alert Type */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  {language === 'hi' ? 'अलर्ट प्रकार' : 'Alert Type'}
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={alertType === 'above' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setAlertType('above')}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {language === 'hi' ? 'ऊपर जाए तो' : 'Price Above'}
                  </Button>
                  <Button
                    variant={alertType === 'below' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setAlertType('below')}
                  >
                    <TrendingDown className="w-4 h-4 mr-2" />
                    {language === 'hi' ? 'नीचे जाए तो' : 'Price Below'}
                  </Button>
                </div>
              </div>

              {/* Target Price */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  {language === 'hi' ? 'लक्ष्य मूल्य (₹/क्विंटल)' : 'Target Price (₹/quintal)'}
                </label>
                <Input
                  type="number"
                  placeholder="2500"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className="text-lg"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAddForm(false)}
                >
                  {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </Button>
                <Button
                  className="flex-1"
                  onClick={createAlert}
                >
                  {language === 'hi' ? 'अलर्ट सेट करें' : 'Set Alert'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Add Button */}
      {!showAddForm && (
        <div className="fixed bottom-6 left-0 right-0 px-6">
          <Button
            className="w-full h-14 text-lg font-semibold rounded-xl shadow-lg"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            {language === 'hi' ? 'नया अलर्ट जोड़ें' : 'Add New Alert'}
          </Button>
        </div>
      )}
    </div>
  );
}
