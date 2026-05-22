'use client';

import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { useTranslation } from '@/context/TranslationContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FileText, Download, Search, Filter } from 'lucide-react';
import Link from 'next/link';

// Mock data for reports
const REPORTS = [
  { id: 1, title: 'Global Soybean Market Outlook - Q1 2024', category: 'grains', date: '2024-01-15', size: '2.4 MB' },
  { id: 2, title: 'Brazilian Corn Harvest Forecast', category: 'grains', date: '2024-01-10', size: '1.8 MB' },
  { id: 3, title: 'Sugar & Ethanol Weekly Update', category: 'softs', date: '2024-01-08', size: '1.2 MB' },
  { id: 4, title: 'Wheat Trade Flow Analysis: Black Sea Region', category: 'grains', date: '2024-01-05', size: '3.1 MB' },
  { id: 5, title: 'Energy Markets: Oil vs Biofuels', category: 'energy', date: '2023-12-28', size: '2.9 MB' },
  { id: 6, title: 'Cotton Production Estimates 2023/24', category: 'softs', date: '2023-12-20', size: '1.5 MB' },
  { id: 7, title: 'Fertilizer Market Trends', category: 'energy', date: '2023-12-15', size: '2.2 MB' },
  { id: 8, title: 'Coffee Market Report: Arabica vs Robusta', category: 'softs', date: '2023-12-10', size: '1.9 MB' },
];

export default function MarketReportsPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const handleDownload = (report: typeof REPORTS[0]) => {
    try {
      console.log(`Starting download for report: ${report.title}`);
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(22);
      doc.setTextColor(40, 40, 40);
      doc.text("FoodPrice Global Market Report", 20, 20);
      
      // Subtitle / Report Title
      doc.setFontSize(16);
      doc.setTextColor(60, 60, 60);
      doc.text(report.title, 20, 35);
      
      // Metadata
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Date: ${report.date}`, 20, 50);
      doc.text(`Category: ${report.category.charAt(0).toUpperCase() + report.category.slice(1)}`, 20, 58);
      doc.text(`Size: ${report.size}`, 20, 66);
      
      // Content (Mock)
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Executive Summary", 20, 85);
      
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      const lorem = "This is a sample market report generated for demonstration purposes. " + 
                    "In a real production environment, this PDF would contain detailed analysis, " +
                    "charts, and price forecasts for the selected commodity.\n\n" +
                    "Key highlights:\n" +
                    "- Market trends analysis\n" +
                    "- Supply and demand factors\n" +
                    "- Price volatility assessment\n" +
                    "- Global logistics impact\n\n" +
                    "For full access to real-time data, please visit the Market Intelligence dashboard.";
      
      doc.text(lorem, 20, 95, { maxWidth: 170 });
      
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("© 2024 FoodPrice Global - Confidential & Proprietary", 20, 280);
      
      // Save
      const filename = `${report.title.replace(/[^a-zA-Z0-9]/g, '_')}_Report.pdf`;
      console.log(`Saving file: ${filename}`);
      doc.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Erro ao baixar o relatório. Por favor, tente novamente.");
    }
  };

  const filteredReports = REPORTS.filter(report => {
    const matchesFilter = filter === 'all' || report.category === filter;
    const matchesSearch = report.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-24 pb-12 px-4 container mx-auto">
        <div className="mb-8">
            <Link href="/#analise-mercado" className="text-blue-600 hover:underline mb-4 inline-block">
                ← Voltar
            </Link>
            <h1 className="text-4xl font-bold text-slate-900">{t('reports_page_title')}</h1>
            <p className="text-slate-600 mt-2">{t('reports_page_desc')}</p>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            {['all', 'grains', 'softs', 'energy'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  filter === cat 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t(`reports_filter_${cat}`)}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t('reports_search_placeholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Reports List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                report.category === 'grains' ? 'bg-amber-100 text-amber-600' :
                report.category === 'softs' ? 'bg-emerald-100 text-emerald-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                <FileText size={24} />
              </div>
              
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-lg font-bold text-slate-900">{report.title}</h3>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-sm text-slate-500">
                  <span className="capitalize px-2 py-0.5 bg-slate-100 rounded text-xs font-medium">{report.category}</span>
                  <span>{t('reports_date')}: {report.date}</span>
                  <span>{t('reports_size')}: {report.size}</span>
                </div>
              </div>

              <button 
                onClick={() => handleDownload(report)}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Download size={18} />
                {t('reports_download')}
              </button>
            </div>
          ))}
          
          {filteredReports.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              Nenhum relatório encontrado.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
