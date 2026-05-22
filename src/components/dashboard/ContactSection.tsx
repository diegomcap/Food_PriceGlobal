'use client';

import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';

export default function ContactSection() {
  const { t } = useTranslation();

  return (
    <section id="contato" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">{t('contact_title')}</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <div className="p-8 md:p-12 bg-slate-50">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">{t('contact_send_message')}</h3>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">{t('contact_name')}</label>
                <input type="text" id="name" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder={t('contact_name_placeholder')} />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-1">{t('contact_company')}</label>
                <input type="text" id="company" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder={t('contact_company_placeholder')} />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">{t('contact_email')}</label>
                <input type="email" id="email" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder={t('contact_email_placeholder')} />
              </div>
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-slate-700 mb-1">{t('contact_department')}</label>
                <select id="department" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white">
                  <option value="trading">{t('contact_dept_trading')}</option>
                  <option value="intelligence">{t('contact_dept_intelligence')}</option>
                  <option value="logistics">{t('contact_dept_logistics')}</option>
                  <option value="military">{t('contact_dept_military')}</option>
                  <option value="investor">{t('contact_dept_investor')}</option>
                  <option value="other">{t('contact_dept_other')}</option>
                </select>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">{t('contact_subject')}</label>
                <input type="text" id="subject" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder={t('contact_subject_placeholder')} />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">{t('contact_message')}</label>
                <textarea id="message" rows={4} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder={t('contact_message_placeholder')}></textarea>
              </div>
              <button type="button" className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                {t('contact_button')} <Send size={18} />
              </button>
            </form>
          </div>
          
          <div className="p-8 md:p-12 bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-6">{t('contact_info_title')}</h3>
              <p className="text-slate-300 mb-8 leading-relaxed">
                {t('contact_info_desc')}
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{t('contact_address_title')}</h4>
                    <p className="text-slate-300 whitespace-pre-line">{t('contact_address_val')}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Phone size={20} className="text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{t('contact_phone_title')}</h4>
                    <p className="text-slate-300">+55 (11) 9999-9999</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Mail size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{t('contact_email_title')}</h4>
                    <p className="text-slate-300">contato@foodpriceglobal.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <h4 className="font-semibold text-white mb-4">{t('contact_follow_us')}</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-sky-500 transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-600 transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
