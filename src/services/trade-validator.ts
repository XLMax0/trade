import type { PositionInput, PositionResult } from '../models/types.js';
import { PositionCalculator } from './position-calculator.js';

/**
 * İşlem doğrulama servisi
 *
 * Her işlem açılmadan önce bu kontrol listesinden geçmeli.
 * Psikolojik disiplin için ZORUNLU kontroller.
 */

export interface ValidationRule {
  readonly name: string;
  readonly description: string;
  readonly check: (input: PositionInput, result: PositionResult) => boolean;
  readonly severity: 'error' | 'warning';
}

export interface ValidationResult {
  readonly passed: boolean;
  readonly rules: ReadonlyArray<{
    readonly rule: string;
    readonly description: string;
    readonly passed: boolean;
    readonly severity: 'error' | 'warning';
  }>;
  readonly errors: string[];
  readonly warnings: string[];
}

/** Temel doğrulama kuralları */
const CORE_RULES: ValidationRule[] = [
  {
    name: 'STOP_LOSS_REQUIRED',
    description: 'Stop loss ZORUNLUDUR - stop loss olmadan işlem açılamaz',
    check: (input) => {
      if (input.direction === 'long') {
        return input.stopLossPrice < input.entryPrice;
      }
      return input.stopLossPrice > input.entryPrice;
    },
    severity: 'error',
  },
  {
    name: 'MAX_RISK_PER_TRADE',
    description: 'İşlem başına maksimum %2 risk',
    check: (_input, result) => result.riskPercentage <= 2,
    severity: 'error',
  },
  {
    name: 'MARGIN_LEVEL_SAFE',
    description: 'Teminat seviyesi en az %200 olmalı',
    check: (_input, result) => result.marginLevel >= 200,
    severity: 'error',
  },
  {
    name: 'RISK_REWARD_MINIMUM',
    description: 'Risk/Ödül oranı en az 1.5 olmalı',
    check: (_input, result) => {
      if (result.riskRewardRatio === undefined) return true; // TP yoksa atla
      return result.riskRewardRatio >= 1.5;
    },
    severity: 'warning',
  },
  {
    name: 'LOT_SIZE_VALID',
    description: 'Lot büyüklüğü 0\'dan büyük olmalı',
    check: (_input, result) => result.recommendedLotSize > 0,
    severity: 'error',
  },
  {
    name: 'SPREAD_COST_CHECK',
    description: 'Makas maliyeti risk tutarının %15\'inden fazla olmamalı',
    check: (_input, result) => {
      if (result.riskAmount === 0) return false;
      return result.spreadCost / result.riskAmount <= 0.15;
    },
    severity: 'warning',
  },
  {
    name: 'FREE_MARGIN_BUFFER',
    description: 'Serbest teminat bakiyenin en az %40\'ı olmalı',
    check: (input, result) => {
      return result.freeMargin >= input.accountBalance * 0.4;
    },
    severity: 'warning',
  },
  {
    name: 'STOP_OUT_DISTANCE',
    description: 'Stop-out mesafesi en az bakiyenin %50\'si olmalı',
    check: (input, result) => {
      return result.distanceToStopOut >= input.accountBalance * 0.5;
    },
    severity: 'warning',
  },
];

export class TradeValidator {
  private readonly calculator: PositionCalculator;
  private readonly rules: ValidationRule[];

  constructor(calculator: PositionCalculator, extraRules?: ValidationRule[]) {
    this.calculator = calculator;
    this.rules = [...CORE_RULES, ...(extraRules ?? [])];
  }

  /**
   * İşlemi tüm kurallardan geçirir
   */
  validate(input: PositionInput): ValidationResult {
    const result = this.calculator.calculate(input);
    const ruleResults = this.rules.map((rule) => ({
      rule: rule.name,
      description: rule.description,
      passed: rule.check(input, result),
      severity: rule.severity,
    }));

    const errors = ruleResults
      .filter((r) => !r.passed && r.severity === 'error')
      .map((r) => `[HATA] ${r.description}`);

    const warnings = ruleResults
      .filter((r) => !r.passed && r.severity === 'warning')
      .map((r) => `[UYARI] ${r.description}`);

    return {
      passed: errors.length === 0,
      rules: ruleResults,
      errors,
      warnings,
    };
  }

  /**
   * İşlem kontrol listesi - interaktif onay için
   * Her madde tek tek kontrol edilir
   */
  generateChecklist(input: PositionInput): string[] {
    const result = this.calculator.calculate(input);
    const checklist: string[] = [];

    checklist.push('=== İŞLEM ÖNCESİ KONTROL LİSTESİ ===');
    checklist.push('');

    // 1. Trend onayı (kullanıcı doğrulamalı)
    checklist.push('[ ] 1. Ana trend yönünü onayladım (günlük/4 saatlik grafik)');
    checklist.push('[ ] 2. İşlem yönü ana trend ile uyumlu');
    checklist.push('[ ] 3. Giriş seviyesinde destek/direnç onayı var');
    checklist.push('[ ] 4. En az 2 teknik indikatör onay veriyor');
    checklist.push('');

    // 2. Risk yönetimi (otomatik kontrol)
    const riskCheck = result.riskPercentage <= 2 ? '[X]' : '[ ]';
    checklist.push(
      `${riskCheck} 5. Risk oranı: %${result.riskPercentage.toFixed(2)} (maks %2)`
    );

    const marginCheck = result.marginLevel >= 200 ? '[X]' : '[ ]';
    checklist.push(
      `${marginCheck} 6. Teminat seviyesi: %${result.marginLevel.toFixed(0)} (min %200)`
    );

    const rrCheck =
      result.riskRewardRatio !== undefined && result.riskRewardRatio >= 1.5
        ? '[X]'
        : '[ ]';
    checklist.push(
      `${rrCheck} 7. R:R oranı: ${result.riskRewardRatio?.toFixed(2) ?? 'Belirlenmedi'} (min 1.5)`
    );

    checklist.push('');

    // 3. Psikolojik kontrol
    checklist.push('[ ] 8. Duygusal karar vermiyorum (intikam işlemi değil)');
    checklist.push('[ ] 9. Bu işlemi kaybetsem bile soğukkanlı kalabilirim');
    checklist.push('[ ] 10. Günlük kayıp limitimi aşmadım');
    checklist.push('');

    checklist.push('=== TÜMÜNÜ ONAYLAMADAN İŞLEM AÇMAYIN ===');

    return checklist;
  }
}
