import type {
  PositionInput,
  PositionResult,
  AccountRiskSummary,
  BrokerConstraints,
  Instrument,
} from '../models/types.js';
import { TURKEY_BROKER_DEFAULTS } from '../models/types.js';

/**
 * Pozisyon büyüklüğü ve risk hesaplayıcı
 * Türkiye forex piyasası koşullarına özel
 *
 * Temel kurallar:
 * - İşlem başına maksimum %1-2 risk
 * - Stop loss ZORUNLU
 * - Teminat seviyesi kontrolü
 * - Makas maliyeti dahil
 * - Vergi hesabı dahil
 */
export class PositionCalculator {
  private readonly broker: BrokerConstraints;

  constructor(broker: BrokerConstraints = TURKEY_BROKER_DEFAULTS) {
    this.broker = broker;
  }

  /**
   * Bir enstrüman için gerekli teminatı hesaplar
   * Teminat = (Lot * Lot Büyüklüğü * Fiyat) / Kaldıraç
   */
  calculateMargin(instrument: Instrument, lotSize: number, price: number): number {
    return (lotSize * instrument.lotSize * price) / this.broker.leverage;
  }

  /**
   * Pip mesafesini hesaplar
   */
  calculatePipDistance(entryPrice: number, exitPrice: number, pipSize: number): number {
    return Math.abs(entryPrice - exitPrice) / pipSize;
  }

  /**
   * Pip cinsinden kayıp/kazanç tutarını $ olarak hesaplar
   */
  calculatePipValueInUsd(
    instrument: Instrument,
    lotSize: number,
    pips: number
  ): number {
    return pips * instrument.pipValue * lotSize;
  }

  /**
   * Makas (spread) maliyetini hesaplar
   */
  calculateSpreadCost(instrument: Instrument, lotSize: number): number {
    return instrument.typicalSpreadPips * instrument.pipValue * lotSize;
  }

  /**
   * Risk yönetimine göre önerilen lot büyüklüğünü hesaplar
   *
   * Formül:
   * Risk Tutarı = Bakiye * Risk Yüzdesi
   * Lot = Risk Tutarı / (SL Mesafesi pip * Pip Değeri)
   */
  calculateRecommendedLotSize(
    accountBalance: number,
    riskPercentage: number,
    stopLossDistancePips: number,
    instrument: Instrument
  ): number {
    const riskAmount = accountBalance * (riskPercentage / 100);
    const rawLot = riskAmount / (stopLossDistancePips * instrument.pipValue);

    // Lot adımına yuvarla (aşağı)
    const adjustedLot =
      Math.floor(rawLot / instrument.lotStep) * instrument.lotStep;

    // Minimum lot kontrolü
    return Math.max(adjustedLot, 0);
  }

  /**
   * Kaldıraç ve teminat kısıtlamalarına göre açılabilecek maksimum lot
   */
  calculateMaxLotSize(
    accountBalance: number,
    instrument: Instrument,
    entryPrice: number
  ): number {
    // Maksimum pozisyon değeri = bakiye * kaldıraç
    const maxPositionValue = accountBalance * this.broker.leverage;

    // Maksimum lot = pozisyon değeri / (lot büyüklüğü * fiyat)
    const maxLot = maxPositionValue / (instrument.lotSize * entryPrice);

    // Lot adımına yuvarla (aşağı)
    return Math.floor(maxLot / instrument.lotStep) * instrument.lotStep;
  }

  /**
   * Teminat seviyesini hesaplar
   * Teminat Seviyesi = (Öz Varlık / Kullanılan Teminat) * 100
   */
  calculateMarginLevel(equity: number, usedMargin: number): number {
    if (usedMargin === 0) return Infinity;
    return (equity / usedMargin) * 100;
  }

  /**
   * Stop-out'a kalan mesafeyi hesaplar
   * Stop-out bakiyesi = Kullanılan Teminat * (Stop-out Seviyesi / 100)
   */
  calculateDistanceToStopOut(
    equity: number,
    usedMargin: number
  ): number {
    const stopOutEquity = usedMargin * (this.broker.stopOutLevel / 100);
    return equity - stopOutEquity;
  }

  /**
   * Vergi sonrası net kazancı hesaplar
   */
  calculateNetProfit(grossProfit: number): number {
    if (grossProfit <= 0) return grossProfit;
    return grossProfit * (1 - this.broker.withholdingTax / 100);
  }

  /**
   * Ana hesaplama fonksiyonu - tüm parametreleri alır, tüm sonuçları döner
   */
  calculate(input: PositionInput): PositionResult {
    const broker = input.broker ?? this.broker;
    const riskPercentage = input.riskPercentage ?? 1; // varsayılan %1
    const warnings: string[] = [];

    // 1. Stop loss mesafesi
    const stopLossDistancePips = this.calculatePipDistance(
      input.entryPrice,
      input.stopLossPrice,
      input.instrument.pipSize
    );

    // Stop loss yönü doğrulama
    if (input.direction === 'long' && input.stopLossPrice >= input.entryPrice) {
      warnings.push('HATA: Long pozisyonda stop loss, giriş fiyatının altında olmalı!');
    }
    if (input.direction === 'short' && input.stopLossPrice <= input.entryPrice) {
      warnings.push('HATA: Short pozisyonda stop loss, giriş fiyatının üstünde olmalı!');
    }

    // 2. Önerilen lot büyüklüğü (risk yönetimine göre)
    const recommendedLotSize = this.calculateRecommendedLotSize(
      input.accountBalance,
      riskPercentage,
      stopLossDistancePips,
      input.instrument
    );

    // 3. Maksimum lot büyüklüğü (kaldıraç kısıtlamasına göre)
    const maxLotSize = this.calculateMaxLotSize(
      input.accountBalance,
      input.instrument,
      input.entryPrice
    );

    // Önerilen lot, maksimumdan büyükse uyarı
    const effectiveLot = Math.min(recommendedLotSize, maxLotSize);
    if (recommendedLotSize > maxLotSize) {
      warnings.push(
        `Risk oranına göre ${recommendedLotSize} lot gerekiyor ama teminat yetersiz. ` +
        `Maksimum ${maxLotSize} lot açabilirsiniz.`
      );
    }

    // 4. Teminat hesabı
    const requiredMargin = this.calculateMargin(
      input.instrument,
      effectiveLot,
      input.entryPrice
    );
    const freeMargin = input.accountBalance - requiredMargin;

    // 5. Risk tutarları
    const stopLossDistanceUsd = this.calculatePipValueInUsd(
      input.instrument,
      effectiveLot,
      stopLossDistancePips
    );
    const actualRiskPercentage = (stopLossDistanceUsd / input.accountBalance) * 100;

    // 6. Makas maliyeti
    const spreadCost = this.calculateSpreadCost(input.instrument, effectiveLot);

    // 7. Teminat seviyesi
    const marginLevel = this.calculateMarginLevel(
      input.accountBalance,
      requiredMargin
    );

    // 8. Stop-out mesafesi
    const distanceToStopOut = this.calculateDistanceToStopOut(
      input.accountBalance,
      requiredMargin
    );

    // 9. Take profit hesapları (varsa)
    let takeProfitDistancePips: number | undefined;
    let takeProfitDistanceUsd: number | undefined;
    let riskRewardRatio: number | undefined;
    let estimatedNetProfit: number | undefined;

    if (input.takeProfitPrice !== undefined) {
      // TP yönü doğrulama
      if (input.direction === 'long' && input.takeProfitPrice <= input.entryPrice) {
        warnings.push('UYARI: Long pozisyonda take profit, giriş fiyatının üstünde olmalı!');
      }
      if (input.direction === 'short' && input.takeProfitPrice >= input.entryPrice) {
        warnings.push('UYARI: Short pozisyonda take profit, giriş fiyatının altında olmalı!');
      }

      takeProfitDistancePips = this.calculatePipDistance(
        input.entryPrice,
        input.takeProfitPrice,
        input.instrument.pipSize
      );
      takeProfitDistanceUsd = this.calculatePipValueInUsd(
        input.instrument,
        effectiveLot,
        takeProfitDistancePips
      );

      // R:R oranı
      riskRewardRatio =
        stopLossDistancePips > 0
          ? takeProfitDistancePips / stopLossDistancePips
          : 0;

      // Vergi sonrası net kazanç
      const grossProfit = takeProfitDistanceUsd - spreadCost;
      estimatedNetProfit = this.calculateNetProfit(grossProfit);
    }

    // 10. Uyarılar
    if (actualRiskPercentage > 2) {
      warnings.push(
        `DİKKAT: Risk oranı %${actualRiskPercentage.toFixed(1)} - önerilen maksimum %2'dir!`
      );
    }

    if (marginLevel < 150) {
      warnings.push(
        `DİKKAT: Teminat seviyesi %${marginLevel.toFixed(0)} - tehlikeli derecede düşük!`
      );
    }

    if (freeMargin < input.accountBalance * 0.3) {
      warnings.push(
        'UYARI: Serbest teminat çok düşük. Ek pozisyon açma kapasitesi kısıtlı.'
      );
    }

    if (riskRewardRatio !== undefined && riskRewardRatio < 1.5) {
      warnings.push(
        `UYARI: Risk/Ödül oranı ${riskRewardRatio.toFixed(2)} - minimum 1.5 önerilir.`
      );
    }

    if (effectiveLot === 0) {
      warnings.push(
        'Bu pozisyon açılamaz: hesap bakiyesi yetersiz veya stop loss çok uzak.'
      );
    }

    if (spreadCost > stopLossDistanceUsd * 0.1 && effectiveLot > 0) {
      warnings.push(
        `UYARI: Makas maliyeti ($${spreadCost.toFixed(2)}) risk tutarının %${((spreadCost / stopLossDistanceUsd) * 100).toFixed(0)}'ini oluşturuyor.`
      );
    }

    return {
      maxLotSize,
      recommendedLotSize: effectiveLot,
      requiredMargin,
      freeMargin,
      riskAmount: stopLossDistanceUsd,
      riskPercentage: actualRiskPercentage,
      stopLossDistancePips,
      stopLossDistanceUsd,
      takeProfitDistancePips,
      takeProfitDistanceUsd,
      riskRewardRatio,
      spreadCost,
      estimatedNetProfit,
      marginLevel,
      distanceToStopOut,
      warnings,
    };
  }

  /**
   * Hesap risk özetini oluşturur
   */
  getAccountRiskSummary(
    accountBalance: number,
    maxRiskPercentage: number = 1
  ): AccountRiskSummary {
    return {
      totalBalance: accountBalance,
      maxRiskPerTrade: accountBalance * (maxRiskPercentage / 100),
      dailyLossLimit: accountBalance * 0.03, // günlük %3 kayıp limiti
      weeklyLossLimit: accountBalance * 0.06, // haftalık %6 kayıp limiti
      availableMargin: accountBalance,
      maxPositionValue: accountBalance * this.broker.leverage,
    };
  }
}
