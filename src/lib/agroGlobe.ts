import 'server-only';

import {
  fetchCommodityQuotesFromBestAvailable,
  fetchMacroDriversFromBestAvailable,
  readLatestCommodityQuotes,
  readLatestMacroDrivers,
  type MacroDriverSnapshot,
} from '@/lib/marketIngestion';
import {
  mapCommodityQuotes,
  type FaoRecord,
} from '@/lib/marketOverview';
import { getFreshnessStatus, type FreshnessStatus } from '@/lib/dataFreshness';
import { getPublicPipelineStatusPayload } from '@/lib/pipelineObservability';

export type AgroGlobeCommodityKey = 'all' | 'soybeans' | 'corn' | 'wheat' | 'coffee' | 'sugar';

export type AgroGlobeCountryPoint = {
  code3: string;
  country: string;
  score: number;
  tradePower: number;
  supplyStress: number;
  climateRisk: number;
  logisticsRisk: number;
  focus: string;
};

type AgroCountryProfile = {
  code3: string;
  country: string;
  tradeBase: number;
  supplyBase: number;
  climateBase: number;
  logisticsBase: number;
};

type CommodityConfig = {
  symbol: string;
  focus: string;
  faoField: keyof Pick<FaoRecord, 'food' | 'cereals' | 'oils' | 'sugar'>;
  profiles: AgroCountryProfile[];
};

export type AgroGlobeSignal = {
  commodityChange: number;
  faoChange: number;
  energyPressure: number;
  dollarPressure: number;
  riskOffPressure: number;
};

export type AgroGlobeDataSource = {
  source: string;
  updatedAt: string;
  freshnessStatus: FreshnessStatus;
  liveMode?: 'primary' | 'secondary' | 'tertiary' | 'backup';
};

export type AgroGlobePayload = {
  generatedAt: string;
  overallStatus: 'healthy' | 'warning' | 'critical';
  baskets: Record<AgroGlobeCommodityKey, AgroGlobeCountryPoint[]>;
  signals: Record<AgroGlobeCommodityKey, AgroGlobeSignal>;
  dataSources: {
    commodities: AgroGlobeDataSource;
    macro: AgroGlobeDataSource;
    fao: AgroGlobeDataSource;
  };
};

const FAO_CSV_URL =
  'https://www.fao.org/media/docs/worldfoodsituationlibraries/default-document-library/food_price_indices_data.csv?sfvrsn=523ebd2a_79&download=true';

const COMMODITY_CONFIG: Record<Exclude<AgroGlobeCommodityKey, 'all'>, CommodityConfig> = {
  soybeans: {
    symbol: 'ZS=F',
    focus: 'Soybeans',
    faoField: 'oils',
    profiles: [
      { code3: 'BRA', country: 'Brazil', tradeBase: 97, supplyBase: 62, climateBase: 58, logisticsBase: 49 },
      { code3: 'USA', country: 'United States of America', tradeBase: 90, supplyBase: 55, climateBase: 44, logisticsBase: 32 },
      { code3: 'ARG', country: 'Argentina', tradeBase: 82, supplyBase: 61, climateBase: 61, logisticsBase: 57 },
      { code3: 'CHN', country: 'China', tradeBase: 69, supplyBase: 68, climateBase: 39, logisticsBase: 41 },
      { code3: 'PRY', country: 'Paraguay', tradeBase: 68, supplyBase: 60, climateBase: 52, logisticsBase: 55 },
      { code3: 'CAN', country: 'Canada', tradeBase: 57, supplyBase: 46, climateBase: 44, logisticsBase: 28 },
    ],
  },
  corn: {
    symbol: 'ZC=F',
    focus: 'Corn',
    faoField: 'cereals',
    profiles: [
      { code3: 'USA', country: 'United States of America', tradeBase: 96, supplyBase: 58, climateBase: 43, logisticsBase: 31 },
      { code3: 'BRA', country: 'Brazil', tradeBase: 91, supplyBase: 61, climateBase: 55, logisticsBase: 48 },
      { code3: 'ARG', country: 'Argentina', tradeBase: 81, supplyBase: 57, climateBase: 59, logisticsBase: 56 },
      { code3: 'UKR', country: 'Ukraine', tradeBase: 84, supplyBase: 55, climateBase: 41, logisticsBase: 74 },
      { code3: 'CHN', country: 'China', tradeBase: 63, supplyBase: 64, climateBase: 38, logisticsBase: 37 },
      { code3: 'MEX', country: 'Mexico', tradeBase: 51, supplyBase: 59, climateBase: 49, logisticsBase: 42 },
    ],
  },
  wheat: {
    symbol: 'ZW=F',
    focus: 'Wheat',
    faoField: 'cereals',
    profiles: [
      { code3: 'RUS', country: 'Russia', tradeBase: 94, supplyBase: 53, climateBase: 46, logisticsBase: 58 },
      { code3: 'USA', country: 'United States of America', tradeBase: 79, supplyBase: 50, climateBase: 42, logisticsBase: 34 },
      { code3: 'CAN', country: 'Canada', tradeBase: 77, supplyBase: 51, climateBase: 54, logisticsBase: 29 },
      { code3: 'AUS', country: 'Australia', tradeBase: 74, supplyBase: 52, climateBase: 62, logisticsBase: 36 },
      { code3: 'UKR', country: 'Ukraine', tradeBase: 82, supplyBase: 49, climateBase: 40, logisticsBase: 72 },
      { code3: 'IND', country: 'India', tradeBase: 48, supplyBase: 60, climateBase: 45, logisticsBase: 33 },
    ],
  },
  coffee: {
    symbol: 'KC=F',
    focus: 'Coffee',
    faoField: 'food',
    profiles: [
      { code3: 'BRA', country: 'Brazil', tradeBase: 95, supplyBase: 60, climateBase: 59, logisticsBase: 44 },
      { code3: 'VNM', country: 'Vietnam', tradeBase: 88, supplyBase: 54, climateBase: 47, logisticsBase: 38 },
      { code3: 'COL', country: 'Colombia', tradeBase: 80, supplyBase: 52, climateBase: 52, logisticsBase: 43 },
      { code3: 'IDN', country: 'Indonesia', tradeBase: 72, supplyBase: 50, climateBase: 56, logisticsBase: 41 },
      { code3: 'ETH', country: 'Ethiopia', tradeBase: 63, supplyBase: 55, climateBase: 61, logisticsBase: 47 },
      { code3: 'HND', country: 'Honduras', tradeBase: 58, supplyBase: 51, climateBase: 60, logisticsBase: 46 },
    ],
  },
  sugar: {
    symbol: 'SB=F',
    focus: 'Sugar',
    faoField: 'sugar',
    profiles: [
      { code3: 'BRA', country: 'Brazil', tradeBase: 98, supplyBase: 59, climateBase: 54, logisticsBase: 45 },
      { code3: 'IND', country: 'India', tradeBase: 77, supplyBase: 56, climateBase: 49, logisticsBase: 37 },
      { code3: 'THA', country: 'Thailand', tradeBase: 81, supplyBase: 54, climateBase: 48, logisticsBase: 34 },
      { code3: 'CHN', country: 'China', tradeBase: 55, supplyBase: 62, climateBase: 41, logisticsBase: 38 },
      { code3: 'PAK', country: 'Pakistan', tradeBase: 51, supplyBase: 61, climateBase: 46, logisticsBase: 43 },
      { code3: 'MEX', country: 'Mexico', tradeBase: 53, supplyBase: 52, climateBase: 44, logisticsBase: 40 },
    ],
  },
};

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function getPercentChange(price: number, previousClose: number) {
  if (!previousClose) {
    return 0;
  }

  return ((price - previousClose) / previousClose) * 100;
}

function parseFaoCsv(csv: string): FaoRecord[] {
  return csv
    .split(/\r?\n/)
    .filter((line) => /^\d{4}-\d{2},/.test(line))
    .map((line) => {
      const [date, food, meat, dairy, cereals, oils, sugar] = line.split(',');

      return {
        date,
        food: Number(food),
        meat: Number(meat),
        dairy: Number(dairy),
        cereals: Number(cereals),
        oils: Number(oils),
        sugar: Number(sugar),
      };
    })
    .filter((record) => Object.values(record).every((value) => value !== '' && !Number.isNaN(value)));
}

async function readFaoSnapshot() {
  const response = await fetch(FAO_CSV_URL, {
    next: { revalidate: 43200 },
    headers: {
      Accept: 'text/csv,text/plain;q=0.9,*/*;q=0.8',
    },
  });

  if (!response.ok) {
    throw new Error(`FAO request failed with status ${response.status}`);
  }

  const csv = await response.text();
  const records = parseFaoCsv(csv);

  if (records.length < 2) {
    throw new Error('Insufficient FAO data to build agro globe payload');
  }

  return {
    latest: records[records.length - 1],
    previous: records[records.length - 2],
    updatedAt: new Date().toISOString(),
    source: 'fao-csv',
  };
}

function getDriverChange(drivers: MacroDriverSnapshot[], symbol: string) {
  const driver = drivers.find((item) => item.symbol === symbol);
  if (!driver) {
    return 0;
  }

  return getPercentChange(driver.price, driver.previousClose);
}

function buildSignal(
  commodityKey: Exclude<AgroGlobeCommodityKey, 'all'>,
  quotes: ReturnType<typeof mapCommodityQuotes>,
  drivers: MacroDriverSnapshot[],
  fao: Awaited<ReturnType<typeof readFaoSnapshot>>
): AgroGlobeSignal {
  const config = COMMODITY_CONFIG[commodityKey];
  const commodity = quotes.find((item) => item.symbol === config.symbol);
  const commodityChange = commodity?.change ?? 0;
  const faoLatest = fao.latest[config.faoField];
  const faoPrevious = fao.previous[config.faoField];
  const faoChange = getPercentChange(faoLatest, faoPrevious);
  const dollarChange = getDriverChange(drivers, 'DX=F');
  const crudeChange = getDriverChange(drivers, 'CL=F');
  const gasChange = getDriverChange(drivers, 'NG=F');
  const goldChange = getDriverChange(drivers, 'GC=F');

  return {
    commodityChange: Number(commodityChange.toFixed(2)),
    faoChange: Number(faoChange.toFixed(2)),
    energyPressure: clamp(48 + crudeChange * 10 + gasChange * 7),
    dollarPressure: clamp(50 + dollarChange * 18),
    riskOffPressure: clamp(47 + goldChange * 11),
  };
}

function buildCountryPoint(
  profile: AgroCountryProfile,
  focus: string,
  signal: AgroGlobeSignal
): AgroGlobeCountryPoint {
  const tradePower = clamp(
    profile.tradeBase +
      signal.commodityChange * 3.2 -
      (signal.dollarPressure - 50) * 0.22
  );
  const supplyStress = clamp(
    profile.supplyBase +
      Math.max(signal.commodityChange, 0) * 8 +
      Math.max(signal.faoChange, 0) * 7 +
      (signal.energyPressure - 50) * 0.35
  );
  const climateRisk = clamp(
    profile.climateBase +
      Math.abs(signal.commodityChange) * 3 +
      (signal.riskOffPressure - 50) * 0.18
  );
  const logisticsRisk = clamp(
    profile.logisticsBase +
      (signal.energyPressure - 50) * 0.42 +
      (signal.dollarPressure - 50) * 0.18
  );

  return {
    code3: profile.code3,
    country: profile.country,
    focus,
    tradePower,
    supplyStress,
    climateRisk,
    logisticsRisk,
    score: clamp(tradePower * 0.34 + supplyStress * 0.3 + climateRisk * 0.18 + logisticsRisk * 0.18),
  };
}

function buildGlobalBasket(
  baskets: Record<Exclude<AgroGlobeCommodityKey, 'all'>, AgroGlobeCountryPoint[]>
) {
  const accumulator = new Map<string, AgroGlobeCountryPoint & { count: number }>();

  (Object.keys(baskets) as Array<Exclude<AgroGlobeCommodityKey, 'all'>>).forEach((key) => {
    baskets[key].forEach((item) => {
      const current = accumulator.get(item.code3);
      if (current) {
        current.score += item.score;
        current.tradePower += item.tradePower;
        current.supplyStress += item.supplyStress;
        current.climateRisk += item.climateRisk;
        current.logisticsRisk += item.logisticsRisk;
        current.count += 1;
      } else {
        accumulator.set(item.code3, { ...item, focus: 'Global basket', count: 1 });
      }
    });
  });

  return Array.from(accumulator.values())
    .map((item) => ({
      code3: item.code3,
      country: item.country,
      focus: item.focus,
      score: clamp(item.score / item.count),
      tradePower: clamp(item.tradePower / item.count),
      supplyStress: clamp(item.supplyStress / item.count),
      climateRisk: clamp(item.climateRisk / item.count),
      logisticsRisk: clamp(item.logisticsRisk / item.count),
    }))
    .sort((a, b) => b.score - a.score);
}

function buildGlobalSignal(signals: Record<Exclude<AgroGlobeCommodityKey, 'all'>, AgroGlobeSignal>): AgroGlobeSignal {
  const items = Object.values(signals);
  const average = (pick: (signal: AgroGlobeSignal) => number) =>
    Number((items.reduce((sum, item) => sum + pick(item), 0) / items.length).toFixed(2));

  return {
    commodityChange: average((signal) => signal.commodityChange),
    faoChange: average((signal) => signal.faoChange),
    energyPressure: clamp(average((signal) => signal.energyPressure)),
    dollarPressure: clamp(average((signal) => signal.dollarPressure)),
    riskOffPressure: clamp(average((signal) => signal.riskOffPressure)),
  };
}

export async function buildAgroGlobePayload(): Promise<AgroGlobePayload> {
  const [persistedQuotes, persistedDrivers] = await Promise.all([
    readLatestCommodityQuotes(),
    readLatestMacroDrivers(),
  ]);

  const [commodities, macro, fao, pipelineStatus] = await Promise.all([
    fetchCommodityQuotesFromBestAvailable({ persisted: persistedQuotes }),
    fetchMacroDriversFromBestAvailable({ persisted: persistedDrivers }),
    readFaoSnapshot(),
    getPublicPipelineStatusPayload(),
  ]);

  const mappedQuotes = mapCommodityQuotes(commodities.items);
  const basketSignals = Object.fromEntries(
    (Object.keys(COMMODITY_CONFIG) as Array<Exclude<AgroGlobeCommodityKey, 'all'>>).map((commodityKey) => [
      commodityKey,
      buildSignal(commodityKey, mappedQuotes, macro.items, fao),
    ])
  ) as Record<Exclude<AgroGlobeCommodityKey, 'all'>, AgroGlobeSignal>;

  const basketCountries = Object.fromEntries(
    (Object.keys(COMMODITY_CONFIG) as Array<Exclude<AgroGlobeCommodityKey, 'all'>>).map((commodityKey) => {
      const config = COMMODITY_CONFIG[commodityKey];
      const signal = basketSignals[commodityKey];

      const rows = config.profiles
        .map((profile) => buildCountryPoint(profile, config.focus, signal))
        .sort((a, b) => b.score - a.score);

      return [commodityKey, rows];
    })
  ) as Record<Exclude<AgroGlobeCommodityKey, 'all'>, AgroGlobeCountryPoint[]>;

  const allSignal = buildGlobalSignal(basketSignals);
  const commoditiesStatus = pipelineStatus.datasets.find((dataset) => dataset.datasetKey === 'commodities');
  const macroStatus = pipelineStatus.datasets.find((dataset) => dataset.datasetKey === 'macro_drivers');

  return {
    generatedAt: new Date().toISOString(),
    overallStatus: pipelineStatus.overallStatus,
    baskets: {
      all: buildGlobalBasket(basketCountries),
      ...basketCountries,
    },
    signals: {
      all: allSignal,
      ...basketSignals,
    },
    dataSources: {
      commodities: {
        source: commodities.source,
        updatedAt: commodities.updatedAt,
        freshnessStatus: getFreshnessStatus('commodities', commodities.updatedAt, commodities.source),
        liveMode: commoditiesStatus?.liveMode,
      },
      macro: {
        source: macro.source,
        updatedAt: macro.updatedAt,
        freshnessStatus: getFreshnessStatus('macro_drivers', macro.updatedAt, macro.source),
        liveMode: macroStatus?.liveMode,
      },
      fao: {
        source: fao.source,
        updatedAt: fao.updatedAt,
        freshnessStatus: getFreshnessStatus('fao_index', fao.updatedAt, fao.source),
      },
    },
  };
}
