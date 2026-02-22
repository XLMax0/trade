import { describe, it, expect } from 'vitest';
import { PositionCalculator } from '../../src/services/position-calculator.js';
import { TURKEY_BROKER_DEFAULTS } from '../../src/models/types.js';
import { XAUUSD, TSLA, EURUSD } from '../../src/models/instruments.js';
import type { PositionInput } from '../../src/models/types.js';

describe('PositionCalculator', () => {
  const calculator = new PositionCalculator(TURKEY_BROKER_DEFAULTS);

  describe('calculateMargin', () => {
    it('should calculate margin correctly for gold', () => {
      // 0.01 lot * 100 ons * $2650 / 10 leverage = $265
      const margin = calculator.calculateMargin(XAUUSD, 0.01, 2650);
      expect(margin).toBeCloseTo(265, 2);
    });

    it('should calculate margin correctly for stocks', () => {
      // 1 lot * 1 hisse * $350 / 10 leverage = $35
      const margin = calculator.calculateMargin(TSLA, 1, 350);
      expect(margin).toBeCloseTo(35, 2);
    });

    it('should calculate margin correctly for forex', () => {
      // 0.01 lot * 100000 * $1.1000 / 10 leverage = $110
      const margin = calculator.calculateMargin(EURUSD, 0.01, 1.1);
      expect(margin).toBeCloseTo(110, 2);
    });
  });

  describe('calculatePipDistance', () => {
    it('should calculate pip distance for gold', () => {
      // ($2650 - $2635) / 0.01 = 1500 pips
      const pips = calculator.calculatePipDistance(2650, 2635, 0.01);
      expect(pips).toBeCloseTo(1500, 0);
    });

    it('should calculate pip distance for forex', () => {
      // (1.1050 - 1.1000) / 0.0001 = 50 pips
      const pips = calculator.calculatePipDistance(1.105, 1.1, 0.0001);
      expect(pips).toBeCloseTo(50, 0);
    });
  });

  describe('calculateRecommendedLotSize', () => {
    it('should calculate correct lot size for 1% risk on gold', () => {
      // Balance: $2000, Risk: 1% = $20
      // SL: 1500 pips, pip value: $1/lot
      // Lot = $20 / (1500 * $1) = 0.0133 -> rounded to 0.01
      const lot = calculator.calculateRecommendedLotSize(2000, 1, 1500, XAUUSD);
      expect(lot).toBe(0.01);
    });

    it('should calculate correct lot size for 2% risk on gold', () => {
      // Balance: $2000, Risk: 2% = $40
      // SL: 1500 pips, pip value: $1/lot
      // Lot = $40 / (1500 * $1) = 0.0266 -> rounded to 0.02
      const lot = calculator.calculateRecommendedLotSize(2000, 2, 1500, XAUUSD);
      expect(lot).toBe(0.02);
    });

    it('should return 0 when lot is too small', () => {
      // Balance: $100, Risk: 1% = $1
      // SL: 5000 pips, pip value: $1/lot
      // Lot = $1 / (5000 * $1) = 0.0002 -> rounded to 0
      const lot = calculator.calculateRecommendedLotSize(100, 1, 5000, XAUUSD);
      expect(lot).toBe(0);
    });
  });

  describe('calculateMaxLotSize', () => {
    it('should calculate max lot for gold with $2000', () => {
      // Max position value: $2000 * 10 = $20000
      // Max lot: $20000 / (100 * $2650) = 0.0754 -> rounded to 0.07
      const maxLot = calculator.calculateMaxLotSize(2000, XAUUSD, 2650);
      expect(maxLot).toBe(0.07);
    });

    it('should calculate max lot for stocks', () => {
      // Max position value: $2000 * 10 = $20000
      // Max lot: $20000 / (1 * $350) = 57
      const maxLot = calculator.calculateMaxLotSize(2000, TSLA, 350);
      expect(maxLot).toBe(57);
    });
  });

  describe('calculateMarginLevel', () => {
    it('should calculate margin level correctly', () => {
      // Equity: $2000, Used margin: $265
      // Level = ($2000 / $265) * 100 = 754.7%
      const level = calculator.calculateMarginLevel(2000, 265);
      expect(level).toBeCloseTo(754.7, 0);
    });

    it('should return Infinity when no margin used', () => {
      const level = calculator.calculateMarginLevel(2000, 0);
      expect(level).toBe(Infinity);
    });
  });

  describe('calculateDistanceToStopOut', () => {
    it('should calculate stop-out distance correctly', () => {
      // Equity: $2000, Used margin: $265
      // Stop-out equity: $265 * 0.20 = $53
      // Distance: $2000 - $53 = $1947
      const distance = calculator.calculateDistanceToStopOut(2000, 265);
      expect(distance).toBeCloseTo(1947, 0);
    });
  });

  describe('calculateNetProfit', () => {
    it('should apply 10% tax on profit', () => {
      const net = calculator.calculateNetProfit(100);
      expect(net).toBe(90);
    });

    it('should not apply tax on losses', () => {
      const net = calculator.calculateNetProfit(-50);
      expect(net).toBe(-50);
    });
  });

  describe('calculate (full position)', () => {
    it('should calculate a complete gold long position', () => {
      const input: PositionInput = {
        accountBalance: 2000,
        instrument: XAUUSD,
        entryPrice: 2650,
        stopLossPrice: 2635,
        takeProfitPrice: 2680,
        direction: 'long',
        riskPercentage: 1,
      };

      const result = calculator.calculate(input);

      // SL: 1500 pips
      expect(result.stopLossDistancePips).toBeCloseTo(1500, 0);

      // Recommended lot should be 0.01
      expect(result.recommendedLotSize).toBe(0.01);

      // Required margin for 0.01 lot at $2650: $265
      expect(result.requiredMargin).toBeCloseTo(265, 0);

      // R:R ratio: 3000/1500 = 2
      expect(result.riskRewardRatio).toBeCloseTo(2, 1);

      // No errors expected
      expect(result.warnings.some(w => w.includes('HATA'))).toBe(false);
    });

    it('should warn when stop loss is on wrong side for long', () => {
      const input: PositionInput = {
        accountBalance: 2000,
        instrument: XAUUSD,
        entryPrice: 2650,
        stopLossPrice: 2660, // wrong side!
        direction: 'long',
        riskPercentage: 1,
      };

      const result = calculator.calculate(input);
      expect(result.warnings.some(w => w.includes('giriş fiyatının altında olmalı'))).toBe(true);
    });

    it('should warn when risk is above 2%', () => {
      // Use a stock with lower price so margin constraint doesn't cap the lot
      const input: PositionInput = {
        accountBalance: 2000,
        instrument: TSLA,
        entryPrice: 100,
        stopLossPrice: 99.50, // $0.50 SL, 50 pips
        direction: 'long',
        riskPercentage: 3, // 3% = $60, lot = $60 / (50 * 0.01) = 120 shares
        // Max lot = $20000 / (1 * 100) = 200 shares, so 120 fits
        // Risk = 120 * 50 * 0.01 = $60, 60/2000 = 3%
      };

      const result = calculator.calculate(input);
      expect(result.riskPercentage).toBeGreaterThan(2);
      expect(result.warnings.some(w => w.includes('DİKKAT: Risk oranı'))).toBe(true);
    });

    it('should warn when R:R is below 1.5', () => {
      const input: PositionInput = {
        accountBalance: 2000,
        instrument: XAUUSD,
        entryPrice: 2650,
        stopLossPrice: 2635,      // 1500 pip SL
        takeProfitPrice: 2660,    // 1000 pip TP -> R:R = 0.67
        direction: 'long',
        riskPercentage: 1,
      };

      const result = calculator.calculate(input);
      expect(result.riskRewardRatio).toBeLessThan(1.5);
      expect(result.warnings.some(w => w.includes('Risk/Ödül oranı'))).toBe(true);
    });
  });

  describe('getAccountRiskSummary', () => {
    it('should calculate account summary correctly', () => {
      const summary = calculator.getAccountRiskSummary(2000, 1);

      expect(summary.totalBalance).toBe(2000);
      expect(summary.maxRiskPerTrade).toBe(20); // %1 of $2000
      expect(summary.dailyLossLimit).toBe(60); // %3 of $2000
      expect(summary.weeklyLossLimit).toBe(120); // %6 of $2000
      expect(summary.maxPositionValue).toBe(20000); // $2000 * 10 leverage
    });
  });
});
