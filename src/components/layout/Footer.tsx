import { useTranslation } from '@/context/TranslationContext';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-900 text-white py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌾</span>
              <span className="text-xl font-bold">FoodPrice Global</span>
            </div>
            <p className="text-slate-400 text-sm">
              {t('footer_description')}
            </p>
          </div>
          
          <div>
            <h5 className="font-bold mb-4">{t('footer_platforms_title')}</h5>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="/global" className="hover:text-emerald-400">{t('footer_platform_global')}</a></li>
              <li><a href="/brasil" className="hover:text-emerald-400">{t('footer_platform_brasil')}</a></li>
              <li><a href="/latam" className="hover:text-emerald-400">{t('footer_platform_latam')}</a></li>
              <li><a href="/military" className="hover:text-emerald-400">{t('footer_platform_military')}</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-4">{t('footer_data_title')}</h5>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-emerald-400">{t('footer_data_api')}</a></li>
              <li><a href="#" className="hover:text-emerald-400">{t('footer_data_reports')}</a></li>
              <li><a href="#" className="hover:text-emerald-400">{t('footer_data_methodology')}</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-4">{t('footer_legal_title')}</h5>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-emerald-400">{t('footer_legal_privacy')}</a></li>
              <li><a href="#" className="hover:text-emerald-400">{t('footer_legal_terms')}</a></li>
              <li><a href="#" className="hover:text-emerald-400">{t('footer_legal_compliance')}</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} {t('footer_copyright_text')}
        </div>
      </div>
    </footer>
  );
}
