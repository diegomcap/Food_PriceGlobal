import type { FaoApiResponse, MarketCommodity } from '@/lib/marketOverview';

export type ExportMixItem = {
  key: 'soybeans' | 'corn' | 'wheat' | 'coffee' | 'sugar' | 'meat';
  label: string;
  share: number;
};

export type ExportHubProfile = {
  code3: string;
  country: string;
  lat: number;
  lon: number;
  exportValueBn: number;
  logisticsBase: number;
  route: string;
  destination: string;
  focusSymbol: string;
  mix: ExportMixItem[];
};

export type ExportHubPoint = ExportHubProfile & {
  exportScore: number;
  demandPulse: number;
  logisticsPressure: number;
  commodityChange: number;
  faoPulse: number;
};

export type MacroHubProfile = {
  code3: string;
  country: string;
  lat: number;
  lon: number;
  corridor: string;
  rankBias?: number;
  weights: {
    'DX=F': number;
    'CL=F': number;
    'NG=F': number;
    'GC=F': number;
  };
};

export type DriverSlice = {
  id: 'DX=F' | 'CL=F' | 'NG=F' | 'GC=F';
  label: string;
  price: number;
  unit: string;
  change: number;
  impact: number;
  z: number;
};

export type MacroHubPoint = MacroHubProfile & {
  totalPressure: number;
  slices: DriverSlice[];
};

export type MacroDriverInput = {
  symbol: string;
  label: string;
  price: number;
  previousClose: number;
  unit: string;
};

type MacroCountryArchetype =
  | 'agro-exporter'
  | 'balanced'
  | 'demand-center'
  | 'energy-linked'
  | 'fertilizer-sensitive'
  | 'processing-hub'
  | 'safe-haven';

type MacroCountryTier = 'core' | 'major' | 'standard' | 'emerging';

type MacroCountrySeed = {
  code3: string;
  country: string;
  archetype: MacroCountryArchetype;
  tier: MacroCountryTier;
};

const MAX_EXPORT_VALUE = 190;

const DRIVER_LEVEL_RANGES = {
  'DX=F': 120,
  'CL=F': 120,
  'NG=F': 8,
  'GC=F': 3000,
} as const;

const MACRO_ARCHETYPE_PRESETS: Record<
  MacroCountryArchetype,
  {
    corridor: string;
    rankBias: number;
    weights: MacroHubProfile['weights'];
  }
> = {
  'agro-exporter': {
    corridor: 'Agro export corridor',
    rankBias: 1.08,
    weights: { 'DX=F': 1.08, 'CL=F': 1.02, 'NG=F': 0.92, 'GC=F': 0.66 },
  },
  balanced: {
    corridor: 'Regional food and logistics corridor',
    rankBias: 1,
    weights: { 'DX=F': 1, 'CL=F': 1, 'NG=F': 1, 'GC=F': 0.72 },
  },
  'demand-center': {
    corridor: 'Demand and import corridor',
    rankBias: 1.04,
    weights: { 'DX=F': 0.96, 'CL=F': 1.05, 'NG=F': 1.02, 'GC=F': 0.7 },
  },
  'energy-linked': {
    corridor: 'Energy-linked pricing corridor',
    rankBias: 1.03,
    weights: { 'DX=F': 0.92, 'CL=F': 1.18, 'NG=F': 1.2, 'GC=F': 0.72 },
  },
  'fertilizer-sensitive': {
    corridor: 'Fertilizer-sensitive food corridor',
    rankBias: 1.01,
    weights: { 'DX=F': 1.04, 'CL=F': 1.06, 'NG=F': 1.18, 'GC=F': 0.68 },
  },
  'processing-hub': {
    corridor: 'Processing and trading corridor',
    rankBias: 1.02,
    weights: { 'DX=F': 0.94, 'CL=F': 1, 'NG=F': 1.14, 'GC=F': 0.64 },
  },
  'safe-haven': {
    corridor: 'Defensive capital corridor',
    rankBias: 0.98,
    weights: { 'DX=F': 0.88, 'CL=F': 0.9, 'NG=F': 0.94, 'GC=F': 1.2 },
  },
};

const MACRO_TIER_FACTORS: Record<MacroCountryTier, number> = {
  core: 1.14,
  major: 1.08,
  standard: 1,
  emerging: 0.94,
};

function seedCountries(
  archetype: MacroCountryArchetype,
  tier: MacroCountryTier,
  countries: Array<[string, string]>
): MacroCountrySeed[] {
  return countries.map(([code3, country]) => ({ code3, country, archetype, tier }));
}

const HYBRID_MACRO_COUNTRY_SEEDS: MacroCountrySeed[] = [
  ...seedCountries('agro-exporter', 'major', [
    ['RUS', 'Russia'],
    ['KAZ', 'Kazakhstan'],
    ['NZL', 'New Zealand'],
    ['COL', 'Colombia'],
    ['PER', 'Peru'],
    ['CHL', 'Chile'],
    ['PRY', 'Paraguay'],
    ['URY', 'Uruguay'],
    ['ZAF', 'South Africa'],
    ['ETH', 'Ethiopia'],
    ['KEN', 'Kenya'],
    ['CIV', "Cote d'Ivoire"],
    ['GHA', 'Ghana'],
    ['ROU', 'Romania'],
    ['POL', 'Poland'],
    ['IDN', 'Indonesia'],
    ['MYS', 'Malaysia'],
  ]),
  ...seedCountries('demand-center', 'core', [
    ['JPN', 'Japan'],
    ['KOR', 'South Korea'],
    ['MEX', 'Mexico'],
    ['EGY', 'Egypt'],
    ['TUR', 'Turkey'],
    ['ARE', 'United Arab Emirates'],
  ]),
  ...seedCountries('demand-center', 'major', [
    ['PAK', 'Pakistan'],
    ['BGD', 'Bangladesh'],
    ['PHL', 'Philippines'],
    ['DZA', 'Algeria'],
    ['MAR', 'Morocco'],
    ['NGA', 'Nigeria'],
    ['IRN', 'Iran'],
    ['IRQ', 'Iraq'],
    ['JOR', 'Jordan'],
    ['LBN', 'Lebanon'],
    ['NPL', 'Nepal'],
    ['LKA', 'Sri Lanka'],
  ]),
  ...seedCountries('processing-hub', 'major', [
    ['FRA', 'France'],
    ['DEU', 'Germany'],
    ['ESP', 'Spain'],
    ['ITA', 'Italy'],
    ['GBR', 'United Kingdom'],
    ['BEL', 'Belgium'],
    ['DNK', 'Denmark'],
    ['SGP', 'Singapore'],
  ]),
  ...seedCountries('processing-hub', 'standard', [
    ['PRT', 'Portugal'],
    ['GRC', 'Greece'],
    ['IRL', 'Ireland'],
    ['AUT', 'Austria'],
    ['SWE', 'Sweden'],
    ['FIN', 'Finland'],
    ['CZE', 'Czechia'],
    ['SVK', 'Slovakia'],
    ['HUN', 'Hungary'],
    ['BGR', 'Bulgaria'],
    ['HRV', 'Croatia'],
    ['SVN', 'Slovenia'],
    ['LTU', 'Lithuania'],
    ['LVA', 'Latvia'],
    ['EST', 'Estonia'],
    ['SRB', 'Serbia'],
    ['BIH', 'Bosnia and Herzegovina'],
    ['ALB', 'Albania'],
    ['MKD', 'North Macedonia'],
    ['MDA', 'Moldova'],
    ['GEO', 'Georgia'],
    ['ARM', 'Armenia'],
    ['AZE', 'Azerbaijan'],
  ]),
  ...seedCountries('energy-linked', 'major', [
    ['NOR', 'Norway'],
    ['QAT', 'Qatar'],
    ['KWT', 'Kuwait'],
    ['OMN', 'Oman'],
    ['AZE', 'Azerbaijan'],
    ['DZA', 'Algeria'],
    ['NGA', 'Nigeria'],
  ]),
  ...seedCountries('energy-linked', 'standard', [
    ['AGO', 'Angola'],
    ['TKM', 'Turkmenistan'],
    ['MNG', 'Mongolia'],
    ['PNG', 'Papua New Guinea'],
  ]),
  ...seedCountries('fertilizer-sensitive', 'major', [
    ['SAU', 'Saudi Arabia'],
    ['IND', 'India'],
    ['CHN', 'China'],
    ['EGY', 'Egypt'],
  ]),
  ...seedCountries('fertilizer-sensitive', 'standard', [
    ['UZB', 'Uzbekistan'],
    ['MMR', 'Myanmar'],
    ['KHM', 'Cambodia'],
    ['LAO', 'Laos'],
    ['TZA', 'Tanzania'],
    ['UGA', 'Uganda'],
    ['CMR', 'Cameroon'],
    ['SEN', 'Senegal'],
    ['MLI', 'Mali'],
    ['BFA', 'Burkina Faso'],
    ['SDN', 'Sudan'],
    ['MOZ', 'Mozambique'],
    ['ZMB', 'Zambia'],
    ['ZWE', 'Zimbabwe'],
    ['MAD', 'Madagascar'],
  ]),
  ...seedCountries('balanced', 'major', [
    ['CHE', 'Switzerland'],
    ['ISR', 'Israel'],
    ['BLR', 'Belarus'],
    ['ECU', 'Ecuador'],
  ]),
  ...seedCountries('balanced', 'standard', [
    ['BOL', 'Bolivia'],
    ['GTM', 'Guatemala'],
    ['HND', 'Honduras'],
    ['NIC', 'Nicaragua'],
    ['CRI', 'Costa Rica'],
    ['PAN', 'Panama'],
    ['DOM', 'Dominican Republic'],
    ['CUB', 'Cuba'],
    ['JAM', 'Jamaica'],
    ['FJI', 'Fiji'],
    ['NAM', 'Namibia'],
    ['BWA', 'Botswana'],
    ['COD', 'Democratic Republic of the Congo'],
    ['COG', 'Republic of the Congo'],
  ]),
  ...seedCountries('safe-haven', 'major', [
    ['CHE', 'Switzerland'],
    ['SWE', 'Sweden'],
  ]),
  ...seedCountries('safe-haven', 'standard', [
    ['JPN', 'Japan'],
    ['NOR', 'Norway'],
    ['FIN', 'Finland'],
  ]),
];

export const AGRO_EXPORT_HUBS: ExportHubProfile[] = [
  {
    code3: 'BRA',
    country: 'Brazil',
    lat: -15.8,
    lon: -47.9,
    exportValueBn: 166,
    logisticsBase: 56,
    route: 'Santos / Paranagua / Arco Norte',
    destination: 'China, EU, MENA',
    focusSymbol: 'ZS=F',
    mix: [
      { key: 'soybeans', label: 'Soja', share: 34 },
      { key: 'corn', label: 'Milho', share: 21 },
      { key: 'coffee', label: 'Cafe', share: 18 },
      { key: 'sugar', label: 'Acucar', share: 16 },
      { key: 'meat', label: 'Carnes', share: 11 },
    ],
  },
  {
    code3: 'USA',
    country: 'United States of America',
    lat: 38.9,
    lon: -77.0,
    exportValueBn: 174,
    logisticsBase: 42,
    route: 'Gulf / Pacific Northwest / Great Lakes',
    destination: 'Mexico, China, Japan',
    focusSymbol: 'ZC=F',
    mix: [
      { key: 'corn', label: 'Milho', share: 28 },
      { key: 'soybeans', label: 'Soja', share: 24 },
      { key: 'wheat', label: 'Trigo', share: 17 },
      { key: 'meat', label: 'Carnes', share: 19 },
      { key: 'sugar', label: 'Acucar', share: 12 },
    ],
  },
  {
    code3: 'ARG',
    country: 'Argentina',
    lat: -34.6,
    lon: -58.4,
    exportValueBn: 56,
    logisticsBase: 63,
    route: 'Rosario / Bahia Blanca',
    destination: 'Asia, EU, Maghreb',
    focusSymbol: 'ZL=F',
    mix: [
      { key: 'soybeans', label: 'Soja', share: 38 },
      { key: 'corn', label: 'Milho', share: 23 },
      { key: 'wheat', label: 'Trigo', share: 14 },
      { key: 'meat', label: 'Carnes', share: 15 },
      { key: 'sugar', label: 'Acucar', share: 10 },
    ],
  },
  {
    code3: 'CAN',
    country: 'Canada',
    lat: 45.4,
    lon: -75.7,
    exportValueBn: 66,
    logisticsBase: 37,
    route: 'Vancouver / Prince Rupert / St. Lawrence',
    destination: 'US, China, MENA',
    focusSymbol: 'ZW=F',
    mix: [
      { key: 'wheat', label: 'Trigo', share: 33 },
      { key: 'corn', label: 'Milho', share: 15 },
      { key: 'soybeans', label: 'Soja', share: 17 },
      { key: 'meat', label: 'Carnes', share: 20 },
      { key: 'sugar', label: 'Acucar', share: 15 },
    ],
  },
  {
    code3: 'UKR',
    country: 'Ukraine',
    lat: 50.4,
    lon: 30.5,
    exportValueBn: 29,
    logisticsBase: 74,
    route: 'Danube / Black Sea corridor',
    destination: 'EU, MENA, Asia',
    focusSymbol: 'ZW=F',
    mix: [
      { key: 'wheat', label: 'Trigo', share: 31 },
      { key: 'corn', label: 'Milho', share: 30 },
      { key: 'soybeans', label: 'Soja', share: 14 },
      { key: 'sugar', label: 'Acucar', share: 10 },
      { key: 'meat', label: 'Carnes', share: 15 },
    ],
  },
  {
    code3: 'AUS',
    country: 'Australia',
    lat: -35.3,
    lon: 149.1,
    exportValueBn: 53,
    logisticsBase: 41,
    route: 'Kwinana / Brisbane / Newcastle',
    destination: 'China, SEA, MENA',
    focusSymbol: 'ZW=F',
    mix: [
      { key: 'wheat', label: 'Trigo', share: 32 },
      { key: 'sugar', label: 'Acucar', share: 14 },
      { key: 'meat', label: 'Carnes', share: 24 },
      { key: 'soybeans', label: 'Soja', share: 10 },
      { key: 'corn', label: 'Milho', share: 20 },
    ],
  },
  {
    code3: 'IND',
    country: 'India',
    lat: 28.6,
    lon: 77.2,
    exportValueBn: 51,
    logisticsBase: 58,
    route: 'Kandla / Mundra / Nhava Sheva',
    destination: 'MENA, SEA, Africa',
    focusSymbol: 'SB=F',
    mix: [
      { key: 'sugar', label: 'Acucar', share: 27 },
      { key: 'wheat', label: 'Trigo', share: 18 },
      { key: 'meat', label: 'Carnes', share: 20 },
      { key: 'corn', label: 'Milho', share: 15 },
      { key: 'soybeans', label: 'Soja', share: 20 },
    ],
  },
  {
    code3: 'THA',
    country: 'Thailand',
    lat: 13.7,
    lon: 100.5,
    exportValueBn: 44,
    logisticsBase: 46,
    route: 'Laem Chabang / Bangkok',
    destination: 'Asia, China, MENA',
    focusSymbol: 'SB=F',
    mix: [
      { key: 'sugar', label: 'Acucar', share: 29 },
      { key: 'corn', label: 'Milho', share: 12 },
      { key: 'meat', label: 'Carnes', share: 23 },
      { key: 'wheat', label: 'Trigo', share: 10 },
      { key: 'soybeans', label: 'Soja', share: 11 },
      { key: 'coffee', label: 'Cafe', share: 15 },
    ],
  },
  {
    code3: 'VNM',
    country: 'Vietnam',
    lat: 21.0,
    lon: 105.8,
    exportValueBn: 41,
    logisticsBase: 44,
    route: 'Ho Chi Minh / Hai Phong',
    destination: 'EU, US, China',
    focusSymbol: 'KC=F',
    mix: [
      { key: 'coffee', label: 'Cafe', share: 34 },
      { key: 'sugar', label: 'Acucar', share: 12 },
      { key: 'soybeans', label: 'Soja', share: 11 },
      { key: 'corn', label: 'Milho', share: 18 },
      { key: 'meat', label: 'Carnes', share: 25 },
    ],
  },
];

export const MACRO_HUBS: MacroHubProfile[] = [
  {
    code3: 'BRA',
    country: 'Brazil',
    lat: -15.8,
    lon: -47.9,
    corridor: 'Soy / sugar / coffee export desk',
    weights: { 'DX=F': 1.15, 'CL=F': 1.05, 'NG=F': 0.9, 'GC=F': 0.72 },
  },
  {
    code3: 'USA',
    country: 'United States of America',
    lat: 38.9,
    lon: -77.0,
    corridor: 'Corn / soy / energy-linked logistics',
    weights: { 'DX=F': 0.95, 'CL=F': 1.1, 'NG=F': 1.05, 'GC=F': 0.74 },
  },
  {
    code3: 'ARG',
    country: 'Argentina',
    lat: -34.6,
    lon: -58.4,
    corridor: 'Soy complex / crush margins',
    weights: { 'DX=F': 1.2, 'CL=F': 0.95, 'NG=F': 0.82, 'GC=F': 0.78 },
  },
  {
    code3: 'NLD',
    country: 'Netherlands',
    lat: 52.1,
    lon: 5.3,
    corridor: 'EU import-export processing hub',
    weights: { 'DX=F': 0.9, 'CL=F': 1.0, 'NG=F': 1.22, 'GC=F': 0.64 },
  },
  {
    code3: 'CHN',
    country: 'China',
    lat: 39.9,
    lon: 116.4,
    corridor: 'Feed demand / import pull',
    weights: { 'DX=F': 1.08, 'CL=F': 1.04, 'NG=F': 0.88, 'GC=F': 0.7 },
  },
  {
    code3: 'IND',
    country: 'India',
    lat: 28.6,
    lon: 77.2,
    corridor: 'Sugar / edible oils / fertilizer sensitivity',
    weights: { 'DX=F': 1.12, 'CL=F': 1.08, 'NG=F': 1.14, 'GC=F': 0.82 },
  },
  {
    code3: 'CAN',
    country: 'Canada',
    lat: 45.4,
    lon: -75.7,
    corridor: 'Canola / grains / transpacific freight',
    weights: { 'DX=F': 0.92, 'CL=F': 1.02, 'NG=F': 1.16, 'GC=F': 0.66 },
  },
  {
    code3: 'AUS',
    country: 'Australia',
    lat: -35.3,
    lon: 149.1,
    corridor: 'Wheat / LNG-linked export corridor',
    weights: { 'DX=F': 0.98, 'CL=F': 1.04, 'NG=F': 1.1, 'GC=F': 0.68 },
  },
  {
    code3: 'UKR',
    country: 'Ukraine',
    lat: 50.4,
    lon: 30.5,
    corridor: 'Black Sea grains / war-risk freight',
    weights: { 'DX=F': 1.04, 'CL=F': 1.12, 'NG=F': 1.08, 'GC=F': 0.8 },
  },
  {
    code3: 'THA',
    country: 'Thailand',
    lat: 13.7,
    lon: 100.5,
    corridor: 'Sugar / rice / Asia refining flows',
    weights: { 'DX=F': 1.06, 'CL=F': 1.0, 'NG=F': 0.94, 'GC=F': 0.62 },
  },
  {
    code3: 'VNM',
    country: 'Vietnam',
    lat: 21.0,
    lon: 105.8,
    corridor: 'Coffee / feed / ASEAN import-export desk',
    weights: { 'DX=F': 1.01, 'CL=F': 0.97, 'NG=F': 0.92, 'GC=F': 0.6 },
  },
  {
    code3: 'SAU',
    country: 'Saudi Arabia',
    lat: 24.7,
    lon: 46.7,
    corridor: 'MENA import demand / energy pricing nexus',
    weights: { 'DX=F': 1.1, 'CL=F': 1.18, 'NG=F': 1.02, 'GC=F': 0.76 },
  },
];

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function getFaoChange(current: number, previous: number) {
  if (!previous) {
    return 0;
  }
  return ((current - previous) / previous) * 100;
}

function getCommodityChange(commodities: MarketCommodity[], symbol: string) {
  return commodities.find((item) => item.symbol === symbol)?.change ?? 0;
}

export function buildExportHubPoints(
  commodities: MarketCommodity[],
  faoData: FaoApiResponse | null
): ExportHubPoint[] {
  const foodChange = faoData ? getFaoChange(faoData.latest.food, faoData.previous.food) : 0;
  const cerealsChange = faoData ? getFaoChange(faoData.latest.cereals, faoData.previous.cereals) : 0;
  const oilsChange = faoData ? getFaoChange(faoData.latest.oils, faoData.previous.oils) : 0;
  const sugarChange = faoData ? getFaoChange(faoData.latest.sugar, faoData.previous.sugar) : 0;

  return AGRO_EXPORT_HUBS.map((hub) => {
    const commodityChange = getCommodityChange(commodities, hub.focusSymbol);
    const exposureToOils = hub.mix.find((item) => item.key === 'soybeans')?.share ?? 0;
    const exposureToCereals =
      (hub.mix.find((item) => item.key === 'corn')?.share ?? 0) +
      (hub.mix.find((item) => item.key === 'wheat')?.share ?? 0);
    const exposureToSugar = hub.mix.find((item) => item.key === 'sugar')?.share ?? 0;

    const faoPulse = clamp(
      48 +
        foodChange * 4 +
        (cerealsChange * exposureToCereals) / 22 +
        (oilsChange * exposureToOils) / 24 +
        (sugarChange * exposureToSugar) / 20
    );

    const demandPulse = clamp(
      44 +
        (hub.exportValueBn / MAX_EXPORT_VALUE) * 28 +
        Math.max(commodityChange, 0) * 9 +
        Math.max(foodChange, 0) * 7
    );

    const logisticsPressure = clamp(
      hub.logisticsBase +
        Math.abs(commodityChange) * 4 +
        Math.max(sugarChange, 0) * 2
    );

    const exportScore = clamp(
      38 +
        (hub.exportValueBn / MAX_EXPORT_VALUE) * 28 +
        Math.max(commodityChange, 0) * 10 +
        (faoPulse - 50) * 0.32 +
        (logisticsPressure - 50) * 0.16
    );

    return {
      ...hub,
      exportScore,
      demandPulse,
      logisticsPressure,
      commodityChange: Number(commodityChange.toFixed(2)),
      faoPulse,
    };
  }).sort((a, b) => b.exportScore - a.exportScore);
}

function driverChange(driver: MacroDriverInput) {
  if (!driver.previousClose) {
    return 0;
  }
  return ((driver.price - driver.previousClose) / driver.previousClose) * 100;
}

function getCodeSeed(code3: string, salt: number) {
  return code3.split('').reduce((sum, letter, index) => sum + letter.charCodeAt(0) * (index + salt), 0);
}

function getVariation(code3: string, salt: number, min = 0.92, max = 1.1) {
  const raw = getCodeSeed(code3, salt) % 1000;
  return min + (raw / 1000) * (max - min);
}

function createHybridMacroProfile(seed: MacroCountrySeed): MacroHubProfile {
  const preset = MACRO_ARCHETYPE_PRESETS[seed.archetype];
  const tierFactor = MACRO_TIER_FACTORS[seed.tier];

  return {
    code3: seed.code3,
    country: seed.country,
    lat: 0,
    lon: 0,
    corridor: preset.corridor,
    rankBias: preset.rankBias * tierFactor * getVariation(seed.code3, 7, 0.96, 1.08),
    weights: {
      'DX=F': Number((preset.weights['DX=F'] * tierFactor * getVariation(seed.code3, 3)).toFixed(3)),
      'CL=F': Number((preset.weights['CL=F'] * tierFactor * getVariation(seed.code3, 5)).toFixed(3)),
      'NG=F': Number((preset.weights['NG=F'] * tierFactor * getVariation(seed.code3, 9)).toFixed(3)),
      'GC=F': Number((preset.weights['GC=F'] * tierFactor * getVariation(seed.code3, 11)).toFixed(3)),
    },
  };
}

function buildHybridMacroProfiles() {
  const deduped = new Map<string, MacroHubProfile>(MACRO_HUBS.map((hub) => [hub.code3, hub]));

  for (const seed of HYBRID_MACRO_COUNTRY_SEEDS) {
    if (!deduped.has(seed.code3)) {
      deduped.set(seed.code3, createHybridMacroProfile(seed));
    }
  }

  return Array.from(deduped.values());
}

export function buildMacroHubPoints(drivers: MacroDriverInput[]): MacroHubPoint[] {
  const driverMap = new Map(drivers.map((item) => [item.symbol, item]));
  const macroProfiles = buildHybridMacroProfiles();

  return macroProfiles.map((hub) => {
    const slices: DriverSlice[] = (['DX=F', 'CL=F', 'NG=F', 'GC=F'] as const)
      .map((symbol) => {
        const driver = driverMap.get(symbol);
        if (!driver) {
          return null;
        }

        const change = driverChange(driver);
        const weight = hub.weights[symbol];
        const normalizedLevel = Math.min(driver.price / DRIVER_LEVEL_RANGES[symbol], 1.4);
        const impact = clamp(
          28 +
            Math.abs(change) * 20 * weight +
            normalizedLevel * 24 * weight +
            ((hub.rankBias ?? 1) - 1) * 18
        );

        return {
          id: symbol,
          label: driver.label,
          price: driver.price,
          unit: driver.unit,
          change: Number(change.toFixed(2)),
          impact,
          z: Math.max(8, Math.round(impact * 0.34 + Math.abs(change) * 4)),
        };
      })
      .filter((slice): slice is DriverSlice => Boolean(slice));

    const totalPressure = clamp(
      (slices.reduce((sum, slice) => sum + slice.impact, 0) / Math.max(slices.length, 1)) * (hub.rankBias ?? 1)
    );

    return {
      ...hub,
      totalPressure,
      slices,
    };
  }).sort((a, b) => b.totalPressure - a.totalPressure);
}
