import type { Instrument } from './types.js';

/**
 * Yaygın işlem enstrümanları - Türkiye broker'larında mevcut
 * Spread ve pip değerleri ortalama değerlerdir, broker'a göre değişebilir.
 */

// ============ Değerli Madenler / Commodities ============

export const XAUUSD: Instrument = {
  symbol: 'XAUUSD',
  name: 'Altın / Gold',
  type: 'commodity',
  lotSize: 100,        // 1 lot = 100 ons
  minLot: 0.01,
  lotStep: 0.01,
  typicalSpreadPips: 30, // ~30 pip ($0.30)
  pipValue: 1,          // 1 pip = $1 (1 lot için)
  pipSize: 0.01,
};

export const XAGUSD: Instrument = {
  symbol: 'XAGUSD',
  name: 'Gümüş / Silver',
  type: 'commodity',
  lotSize: 5000,       // 1 lot = 5000 ons
  minLot: 0.01,
  lotStep: 0.01,
  typicalSpreadPips: 30,
  pipValue: 5,
  pipSize: 0.001,
};

export const XPTUSD: Instrument = {
  symbol: 'XPTUSD',
  name: 'Platinyum / Platinum',
  type: 'commodity',
  lotSize: 100,
  minLot: 0.01,
  lotStep: 0.01,
  typicalSpreadPips: 200,
  pipValue: 1,
  pipSize: 0.01,
};

export const XPDUSD: Instrument = {
  symbol: 'XPDUSD',
  name: 'Paladyum / Palladium',
  type: 'commodity',
  lotSize: 100,
  minLot: 0.01,
  lotStep: 0.01,
  typicalSpreadPips: 500,
  pipValue: 1,
  pipSize: 0.01,
};

export const COPPER: Instrument = {
  symbol: 'COPPER',
  name: 'Bakır / Copper',
  type: 'commodity',
  lotSize: 25000,      // 1 lot = 25000 lbs
  minLot: 0.01,
  lotStep: 0.01,
  typicalSpreadPips: 40,
  pipValue: 2.5,
  pipSize: 0.0001,
};

export const WTI: Instrument = {
  symbol: 'USOIL',
  name: 'WTI Ham Petrol / Crude Oil',
  type: 'commodity',
  lotSize: 1000,       // 1 lot = 1000 varil
  minLot: 0.01,
  lotStep: 0.01,
  typicalSpreadPips: 3,
  pipValue: 10,
  pipSize: 0.01,
};

export const BRENT: Instrument = {
  symbol: 'UKOIL',
  name: 'Brent Ham Petrol / Brent Crude',
  type: 'commodity',
  lotSize: 1000,
  minLot: 0.01,
  lotStep: 0.01,
  typicalSpreadPips: 3,
  pipValue: 10,
  pipSize: 0.01,
};

// ============ Popüler ABD Hisse Senetleri ============

export const AAPL: Instrument = {
  symbol: 'AAPL',
  name: 'Apple Inc.',
  type: 'stock',
  lotSize: 1,           // CFD - 1 lot = 1 hisse
  minLot: 1,
  lotStep: 1,
  typicalSpreadPips: 15,
  pipValue: 0.01,
  pipSize: 0.01,
};

export const TSLA: Instrument = {
  symbol: 'TSLA',
  name: 'Tesla Inc.',
  type: 'stock',
  lotSize: 1,
  minLot: 1,
  lotStep: 1,
  typicalSpreadPips: 30,
  pipValue: 0.01,
  pipSize: 0.01,
};

export const NVDA: Instrument = {
  symbol: 'NVDA',
  name: 'NVIDIA Corp.',
  type: 'stock',
  lotSize: 1,
  minLot: 1,
  lotStep: 1,
  typicalSpreadPips: 20,
  pipValue: 0.01,
  pipSize: 0.01,
};

export const AMZN: Instrument = {
  symbol: 'AMZN',
  name: 'Amazon.com Inc.',
  type: 'stock',
  lotSize: 1,
  minLot: 1,
  lotStep: 1,
  typicalSpreadPips: 20,
  pipValue: 0.01,
  pipSize: 0.01,
};

export const META: Instrument = {
  symbol: 'META',
  name: 'Meta Platforms Inc.',
  type: 'stock',
  lotSize: 1,
  minLot: 1,
  lotStep: 1,
  typicalSpreadPips: 25,
  pipValue: 0.01,
  pipSize: 0.01,
};

export const MSFT: Instrument = {
  symbol: 'MSFT',
  name: 'Microsoft Corp.',
  type: 'stock',
  lotSize: 1,
  minLot: 1,
  lotStep: 1,
  typicalSpreadPips: 15,
  pipValue: 0.01,
  pipSize: 0.01,
};

// ============ Döviz Pariteleri (referans için) ============

export const EURUSD: Instrument = {
  symbol: 'EURUSD',
  name: 'Euro / ABD Doları',
  type: 'forex',
  lotSize: 100000,
  minLot: 0.01,
  lotStep: 0.01,
  typicalSpreadPips: 12,
  pipValue: 10,
  pipSize: 0.0001,
};

export const GBPUSD: Instrument = {
  symbol: 'GBPUSD',
  name: 'İngiliz Sterlini / ABD Doları',
  type: 'forex',
  lotSize: 100000,
  minLot: 0.01,
  lotStep: 0.01,
  typicalSpreadPips: 15,
  pipValue: 10,
  pipSize: 0.0001,
};

/** Tüm enstrümanlar haritası */
export const ALL_INSTRUMENTS: ReadonlyMap<string, Instrument> = new Map([
  ['XAUUSD', XAUUSD],
  ['XAGUSD', XAGUSD],
  ['XPTUSD', XPTUSD],
  ['XPDUSD', XPDUSD],
  ['COPPER', COPPER],
  ['USOIL', WTI],
  ['UKOIL', BRENT],
  ['AAPL', AAPL],
  ['TSLA', TSLA],
  ['NVDA', NVDA],
  ['AMZN', AMZN],
  ['META', META],
  ['MSFT', MSFT],
  ['EURUSD', EURUSD],
  ['GBPUSD', GBPUSD],
]);
