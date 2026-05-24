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

const MAX_EXPORT_VALUE = 190;

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

export function buildMacroHubPoints(drivers: MacroDriverInput[]): MacroHubPoint[] {
  const driverMap = new Map(drivers.map((item) => [item.symbol, item]));

  return MACRO_HUBS.map((hub) => {
    const slices: DriverSlice[] = (['DX=F', 'CL=F', 'NG=F', 'GC=F'] as const)
      .map((symbol) => {
        const driver = driverMap.get(symbol);
        if (!driver) {
          return null;
        }

        const change = driverChange(driver);
        const weight = hub.weights[symbol];
        const impact = clamp(40 + Math.abs(change) * 16 * weight + driver.price * 0.02 * weight);

        return {
          id: symbol,
          label: driver.label,
          price: driver.price,
          unit: driver.unit,
          change: Number(change.toFixed(2)),
          impact,
          z: Math.max(8, Math.round(Math.abs(change) * 22 + weight * 18)),
        };
      })
      .filter((slice): slice is DriverSlice => Boolean(slice));

    const totalPressure = clamp(
      slices.reduce((sum, slice) => sum + slice.impact, 0) / Math.max(slices.length, 1)
    );

    return {
      ...hub,
      totalPressure,
      slices,
    };
  }).sort((a, b) => b.totalPressure - a.totalPressure);
}
