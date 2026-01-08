import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
      className="rounded-full px-4 font-medium"
    >
      {language === 'hi' ? 'EN' : 'हिं'}
    </Button>
  );
}
