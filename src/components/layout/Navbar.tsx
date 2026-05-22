import Link from 'next/link';
import { Menu, Globe, Truck, ShoppingCart, Activity, Shield, Info, Mail, Landmark } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '@/context/TranslationContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { setLanguage, language, t } = useTranslation();

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm fixed w-full z-50 top-0 border-b border-slate-100">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-tr from-green-500 to-emerald-700 p-2 rounded-lg shadow-lg group-hover:scale-105 transition-transform">
             <span className="text-xl text-white font-bold">🌾</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">FoodPrice</span>
            <span className="text-xs font-semibold text-emerald-600 tracking-wider uppercase">Global</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link href="/" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors flex items-center gap-1">
            <Globe className="w-4 h-4" /> {t('nav.home')}
          </Link>
          <Link href="#mercados" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors flex items-center gap-1">
            <ShoppingCart className="w-4 h-4" /> {t('nav.markets')}
          </Link>
          <Link href="#tendencias" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors flex items-center gap-1">
            <Activity className="w-4 h-4" /> {t('nav.trends')}
          </Link>
          <Link href="#fundos-estatais" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors flex items-center gap-1">
            <Landmark className="w-4 h-4" /> {t('nav_funds')}
          </Link>
          
          <div className="h-6 w-px bg-slate-200 mx-2"></div>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 mr-2 bg-slate-100 p-1 rounded-lg">
            {(['pt', 'en', 'es', 'ru', 'ar', 'zh'] as const).map((lang) => (
              <button 
                key={lang}
                onClick={() => setLanguage(lang)} 
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-all ${
                  language === lang 
                    ? 'bg-white text-emerald-600 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <Link href="/global" className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-semibold transition-colors flex items-center gap-1">
            <Globe className="w-3 h-3" /> Global
          </Link>

          <Link href="/brasil" className="px-3 py-1.5 rounded-full bg-green-50 text-green-700 hover:bg-green-100 text-sm font-semibold transition-colors flex items-center gap-1">
            <span className="text-xs">🇧🇷</span> Brasil
          </Link>
          <Link href="/latam" className="px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 hover:bg-orange-100 text-sm font-semibold transition-colors flex items-center gap-1">
            <span className="text-xs">🌎</span> LATAM
          </Link>
           <Link href="/military" className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-semibold transition-colors flex items-center gap-1">
            <Shield className="w-3 h-3" /> MFD
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button className="lg:hidden text-slate-600" onClick={() => setIsOpen(!isOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 absolute w-full shadow-lg">
          <div className="flex flex-col p-4 gap-4">
            <Link href="/" className="text-slate-600 font-medium">{t('nav.home')}</Link>
            <Link href="#tabela-commodities" className="text-slate-600 font-medium">{t('nav.markets')}</Link>
            <Link href="#tendencias" className="text-slate-600 font-medium">{t('nav.trends')}</Link>
            <Link href="#fundos-estatais" className="text-slate-600 font-medium">{t('nav_funds')}</Link>
            <div className="h-px bg-slate-100 my-2"></div>
            <Link href="/global" className="text-blue-600 font-medium">Global Food Transport</Link>
            <Link href="/brasil" className="text-green-600 font-medium">Brasil Export</Link>
            <Link href="/latam" className="text-orange-600 font-medium">LATAM Export</Link>
            <Link href="/military" className="text-slate-700 font-medium">Military Food</Link>
          </div>
        </div>
      )}
    </header>
  );
}
