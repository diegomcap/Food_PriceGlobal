export interface Fund {
  name: string;
  country: string;
  website: string;
  instruments: string;
  focus: string[];
  region: 'mena' | 'asia' | 'europe' | 'americas';
  tags: string[];
  logo: string;
}

export const fundsData: Fund[] = [
  {
    name: 'Abu Dhabi Fund for Development (ADFD)',
    country: 'uae',
    website: 'https://www.adfd.ae',
    instruments: 'instruments_adfd',
    focus: ['infrastructure', 'energy', 'health', 'education', 'exports'],
    region: 'mena',
    tags: ['infrastructure', 'exports', 'energy', 'health', 'education'],
    logo: '/img/funds/adfd_hq.png'
  },
  {
    name: 'Saudi Fund for Development (SFD)',
    country: 'saudi_arabia',
    website: 'https://www.sfd.gov.sa',
    instruments: 'instruments_sfd',
    focus: ['social_economic_dev', 'infrastructure'],
    region: 'mena',
    tags: ['infrastructure', 'health', 'education', 'inclusion'],
    logo: '/img/funds/sfd.svg'
  },
  {
    name: 'Kuwait Fund for Arab Economic Development (KFAED)',
    country: 'kuwait',
    website: 'https://www.kuwait-fund.org',
    instruments: 'instruments_kfaed',
    focus: ['infrastructure', 'agriculture', 'health', 'education'],
    region: 'mena',
    tags: ['infrastructure', 'agriculture', 'health', 'education'],
    logo: '/img/funds/kfaed_hq.svg'
  },
  {
    name: 'China International Development Cooperation Agency (CIDCA)',
    country: 'china',
    website: 'https://en.cidca.gov.cn',
    instruments: 'instruments_cidca',
    focus: ['infrastructure', 'health', 'education'],
    region: 'asia',
    tags: ['infrastructure', 'health', 'education'],
    logo: '/img/funds/cidca.jpg'
  },
  {
    name: 'Japan International Cooperation Agency (JICA)',
    country: 'japan',
    website: 'https://www.jica.go.jp',
    instruments: 'instruments_jica',
    focus: ['institutional_capacity', 'infrastructure', 'public_services'],
    region: 'asia',
    tags: ['technical_cooperation', 'financing', 'humanitarian_aid'],
    logo: '/img/funds/jica.svg'
  },
  {
    name: 'Islamic Development Bank (IsDB)',
    country: 'islamic_nations',
    website: 'https://www.isdb.org',
    instruments: 'instruments_isdb',
    focus: ['infrastructure', 'science_technology'],
    region: 'asia',
    tags: ['infrastructure', 'science_technology', 'halal_financing'],
    logo: '/img/funds/isdb_hq.png'
  },
  {
    name: 'KfW Development Bank',
    country: 'germany',
    website: 'https://www.kfw.de',
    instruments: 'instruments_kfw',
    focus: ['infrastructure', 'innovation', 'sustainability'],
    region: 'europe',
    tags: ['infrastructure', 'green_financing', 'innovation'],
    logo: '/img/funds/kfw.svg'
  },
  {
    name: 'Agence Française de Développement (AFD)',
    country: 'france',
    website: 'https://www.afd.fr',
    instruments: 'instruments_afd',
    focus: ['climate', 'biodiversity', 'sustainable_urbanism'],
    region: 'europe',
    tags: ['climate', 'biodiversity', 'sustainable_urbanism'],
    logo: '/img/funds/afd.png'
  },
  {
    name: 'Fundo Europeu de Desenvolvimento Regional (FEDER)',
    country: 'eu',
    website: 'https://commission.europa.eu',
    instruments: 'instruments_feder',
    focus: ['territorial_cohesion', 'innovation', 'employment'],
    region: 'europe',
    tags: ['territorial_cohesion', 'innovation', 'employment'],
    logo: '/img/funds/feder.png'
  },
  {
    name: 'Development Bank of Latin America (CAF)',
    country: 'latam',
    website: 'https://www.caf.com',
    instruments: 'instruments_caf',
    focus: ['regional_integration', 'infrastructure', 'innovation'],
    region: 'americas',
    tags: ['regional_integration', 'infrastructure', 'innovation'],
    logo: '/img/funds/caf.png'
  },
  {
    name: 'Inter-American Development Bank (IDB)',
    country: 'latam_caribe',
    website: 'https://www.iadb.org',
    instruments: 'instruments_idb',
    focus: ['sustainable_dev', 'inclusion', 'digitalization'],
    region: 'americas',
    tags: ['sustainable_dev', 'inclusion', 'digitalization'],
    logo: '/img/funds/idb_hq.svg'
  },
  {
    name: 'Banco Nacional de Desenvolvimento Econômico e Social (BNDES)',
    country: 'brazil',
    website: 'https://www.bndes.gov.br',
    instruments: 'instruments_bndes',
    focus: ['national_industry', 'infrastructure', 'exports'],
    region: 'americas',
    tags: ['industry', 'infrastructure', 'exports'],
    logo: '/img/funds/bndes_official.svg'
  },
  {
    name: 'Fondo de Cooperación para Agua y Saneamiento (FCAS)',
    country: 'spain_latam',
    website: 'https://www.cooperacionespanola.es',
    instruments: 'instruments_fcas',
    focus: ['water', 'sanitation', 'public_health'],
    region: 'europe',
    tags: ['water', 'sanitation', 'public_health'],
    logo: '/img/funds/fcas.png'
  },
  {
    name: 'Asian Development Bank (ADB)',
    country: 'philippines',
    website: 'https://www.adb.org',
    instruments: 'instruments_adb',
    focus: ['infrastructure', 'climate', 'health', 'education'],
    region: 'asia',
    tags: ['infrastructure', 'climate', 'inclusion'],
    logo: '/img/funds/adb.svg'
  },
  {
    name: 'Qatar Investment Authority (QIA)',
    country: 'qatar',
    website: 'https://www.qia.qa',
    instruments: 'instruments_qia',
    focus: ['infrastructure', 'innovation', 'financing'],
    region: 'mena',
    tags: ['financing', 'infrastructure', 'innovation'],
    logo: '/img/funds/qia.svg'
  },
  {
    name: 'United States Agency for International Development (USAID)',
    country: 'usa',
    website: 'https://www.usaid.gov',
    instruments: 'instruments_usaid',
    focus: ['humanitarian_aid', 'health', 'institutional_capacity', 'agriculture'],
    region: 'americas',
    tags: ['humanitarian_aid', 'social_economic_dev', 'health'],
    logo: '/img/funds/usaid.svg'
  }
];
