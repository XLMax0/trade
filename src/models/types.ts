/**
 * Türkiye forex piyasası koşullarına özel tip tanımları
 * Type definitions specific to Turkish forex market conditions
 */

/** Desteklenen enstrüman türleri */
export type InstrumentType = 'commodity' | 'stock' | 'forex';

/** Enstrüman bilgisi */
export interface Instrument {
  readonly symbol: string;
  readonly name: string;
  readonly type: InstrumentType;
  /** 1 lot büyüklüğü (örn: altın için 1 lot = 100 ons) */
  readonly lotSize: number;
  /** Minimum lot büyüklüğü */
  readonly minLot: number;
  /** Lot adımı */
  readonly lotStep: number;
  /** Ortalama makas (spread) - pip cinsinden */
  readonly typicalSpreadPips: number;
  /** Pip değeri (1 pip = kaç $) - 1 lot için */
  readonly pipValue: number;
  /** Pip büyüklüğü (fiyat hareketi) */
  readonly pipSize: number;
}

/** Türkiye broker kısıtlamaları */
export interface BrokerConstraints {
  /** Kaldıraç oranı (Türkiye'de sabit 1:10) */
  readonly leverage: number;
  /** Minimum teminat seviyesi (%) - bu seviyenin altında pozisyon açılamaz */
  readonly marginCallLevel: number;
  /** Stop-out seviyesi (%) - bu seviyede pozisyon otomatik kapatılır */
  readonly stopOutLevel: number;
  /** Stopaj vergisi oranı (%) */
  readonly withholdingTax: number;
}

/** Türkiye varsayılan broker kısıtlamaları */
export const TURKEY_BROKER_DEFAULTS: BrokerConstraints = {
  leverage: 10,
  marginCallLevel: 100,
  stopOutLevel: 20,
  withholdingTax: 10,
};

/** İşlem yönü */
export type TradeDirection = 'long' | 'short';

/** Pozisyon hesaplama girdileri */
export interface PositionInput {
  /** Hesap bakiyesi ($) */
  readonly accountBalance: number;
  /** İşlem yapılacak enstrüman */
  readonly instrument: Instrument;
  /** Güncel fiyat */
  readonly entryPrice: number;
  /** Stop loss fiyatı */
  readonly stopLossPrice: number;
  /** Take profit fiyatı (opsiyonel) */
  readonly takeProfitPrice?: number;
  /** İşlem yönü */
  readonly direction: TradeDirection;
  /** İşlem başına risk oranı (%) - varsayılan %1 */
  readonly riskPercentage?: number;
  /** Broker kısıtlamaları */
  readonly broker?: BrokerConstraints;
}

/** Pozisyon hesaplama sonucu */
export interface PositionResult {
  /** Açılabilecek maksimum lot miktarı */
  readonly maxLotSize: number;
  /** Önerilen lot miktarı (risk yönetimine göre) */
  readonly recommendedLotSize: number;
  /** Gerekli teminat ($) */
  readonly requiredMargin: number;
  /** Serbest teminat ($) */
  readonly freeMargin: number;
  /** Risk tutarı ($) */
  readonly riskAmount: number;
  /** Risk oranı (%) */
  readonly riskPercentage: number;
  /** Stop loss mesafesi (pip) */
  readonly stopLossDistancePips: number;
  /** Stop loss mesafesi ($) */
  readonly stopLossDistanceUsd: number;
  /** Take profit mesafesi (pip) - varsa */
  readonly takeProfitDistancePips?: number;
  /** Take profit mesafesi ($) - varsa */
  readonly takeProfitDistanceUsd?: number;
  /** Risk/Ödül oranı - varsa */
  readonly riskRewardRatio?: number;
  /** Tahmini makas maliyeti ($) */
  readonly spreadCost: number;
  /** Vergi sonrası tahmini kazanç ($) - varsa */
  readonly estimatedNetProfit?: number;
  /** Teminat seviyesi (%) */
  readonly marginLevel: number;
  /** Stop-out'a kalan mesafe ($) */
  readonly distanceToStopOut: number;
  /** Uyarılar */
  readonly warnings: string[];
}

/** Hesap risk özeti */
export interface AccountRiskSummary {
  /** Toplam hesap bakiyesi */
  readonly totalBalance: number;
  /** Tek işlemde riske edilebilecek maksimum tutar */
  readonly maxRiskPerTrade: number;
  /** Günlük maksimum kayıp limiti */
  readonly dailyLossLimit: number;
  /** Haftalık maksimum kayıp limiti */
  readonly weeklyLossLimit: number;
  /** Kullanılabilir teminat */
  readonly availableMargin: number;
  /** 1:10 kaldıraçla maksimum pozisyon değeri */
  readonly maxPositionValue: number;
}
