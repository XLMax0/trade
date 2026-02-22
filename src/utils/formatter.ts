import type { PositionResult, AccountRiskSummary, PositionInput } from '../models/types.js';
import type { ValidationResult } from '../services/trade-validator.js';

/**
 * Konsol çıktı formatlayıcı
 * Tüm sonuçları okunabilir formatta gösterir
 */

const LINE = '─'.repeat(55);
const DOUBLE_LINE = '═'.repeat(55);

function pad(label: string, value: string, width: number = 40): string {
  const padding = Math.max(1, width - label.length);
  return `  ${label}${'.'.repeat(padding)} ${value}`;
}

export function formatPositionResult(
  input: PositionInput,
  result: PositionResult
): string {
  const lines: string[] = [];

  lines.push('');
  lines.push(DOUBLE_LINE);
  lines.push('  POZİSYON HESAPLAMA SONUCU');
  lines.push(DOUBLE_LINE);
  lines.push('');

  // Enstrüman bilgisi
  lines.push(`  ${input.instrument.name} (${input.instrument.symbol})`);
  lines.push(`  Yön: ${input.direction === 'long' ? 'ALIŞ (LONG)' : 'SATIŞ (SHORT)'}`);
  lines.push(LINE);

  // Fiyatlar
  lines.push('  FİYATLAR');
  lines.push(pad('Giriş fiyatı', `$${input.entryPrice}`));
  lines.push(pad('Stop Loss', `$${input.stopLossPrice}`));
  if (input.takeProfitPrice !== undefined) {
    lines.push(pad('Take Profit', `$${input.takeProfitPrice}`));
  }
  lines.push(LINE);

  // Pozisyon büyüklüğü
  lines.push('  POZİSYON BÜYÜKLÜĞÜ');
  lines.push(pad('Önerilen lot', `${result.recommendedLotSize}`));
  lines.push(pad('Maksimum lot', `${result.maxLotSize}`));
  lines.push(LINE);

  // Risk analizi
  lines.push('  RİSK ANALİZİ');
  lines.push(pad('Risk tutarı', `$${result.riskAmount.toFixed(2)}`));
  lines.push(pad('Risk oranı', `%${result.riskPercentage.toFixed(2)}`));
  lines.push(pad('SL mesafesi', `${result.stopLossDistancePips.toFixed(0)} pip ($${result.stopLossDistanceUsd.toFixed(2)})`));
  if (result.takeProfitDistancePips !== undefined) {
    lines.push(pad('TP mesafesi', `${result.takeProfitDistancePips.toFixed(0)} pip ($${result.takeProfitDistanceUsd?.toFixed(2)})`));
  }
  if (result.riskRewardRatio !== undefined) {
    lines.push(pad('Risk/Ödül', `1:${result.riskRewardRatio.toFixed(2)}`));
  }
  lines.push(LINE);

  // Teminat bilgisi
  lines.push('  TEMİNAT BİLGİSİ');
  lines.push(pad('Gerekli teminat', `$${result.requiredMargin.toFixed(2)}`));
  lines.push(pad('Serbest teminat', `$${result.freeMargin.toFixed(2)}`));
  lines.push(pad('Teminat seviyesi', `%${result.marginLevel.toFixed(0)}`));
  lines.push(pad('Stop-out mesafesi', `$${result.distanceToStopOut.toFixed(2)}`));
  lines.push(LINE);

  // Maliyet
  lines.push('  MALİYET');
  lines.push(pad('Tahmini makas maliyeti', `$${result.spreadCost.toFixed(2)}`));
  if (result.estimatedNetProfit !== undefined) {
    lines.push(pad('Tahmini net kazanç (vergi sonrası)', `$${result.estimatedNetProfit.toFixed(2)}`));
  }
  lines.push(LINE);

  // Uyarılar
  if (result.warnings.length > 0) {
    lines.push('');
    lines.push('  !! UYARILAR !!');
    for (const warning of result.warnings) {
      lines.push(`  * ${warning}`);
    }
  }

  lines.push(DOUBLE_LINE);
  lines.push('');

  return lines.join('\n');
}

export function formatAccountSummary(summary: AccountRiskSummary): string {
  const lines: string[] = [];

  lines.push('');
  lines.push(DOUBLE_LINE);
  lines.push('  HESAP RİSK ÖZETİ');
  lines.push(DOUBLE_LINE);
  lines.push('');
  lines.push(pad('Toplam bakiye', `$${summary.totalBalance.toFixed(2)}`));
  lines.push(pad('İşlem başına maks risk', `$${summary.maxRiskPerTrade.toFixed(2)}`));
  lines.push(pad('Günlük kayıp limiti', `$${summary.dailyLossLimit.toFixed(2)}`));
  lines.push(pad('Haftalık kayıp limiti', `$${summary.weeklyLossLimit.toFixed(2)}`));
  lines.push(pad('Kullanılabilir teminat', `$${summary.availableMargin.toFixed(2)}`));
  lines.push(pad('Maks pozisyon değeri (1:10)', `$${summary.maxPositionValue.toFixed(2)}`));
  lines.push('');
  lines.push(DOUBLE_LINE);
  lines.push('');

  return lines.join('\n');
}

export function formatValidation(validation: ValidationResult): string {
  const lines: string[] = [];

  lines.push('');
  lines.push(DOUBLE_LINE);
  lines.push(
    validation.passed
      ? '  DOGRULAMA: GECTI - Islem acilabilir'
      : '  DOGRULAMA: BASARISIZ - Islem acmayin!'
  );
  lines.push(DOUBLE_LINE);
  lines.push('');

  for (const rule of validation.rules) {
    const icon = rule.passed ? '[OK]' : '[X] ';
    const severity = rule.passed ? '' : ` (${rule.severity === 'error' ? 'HATA' : 'UYARI'})`;
    lines.push(`  ${icon} ${rule.description}${severity}`);
  }

  if (validation.errors.length > 0) {
    lines.push('');
    lines.push('  HATALAR:');
    for (const error of validation.errors) {
      lines.push(`    ${error}`);
    }
  }

  if (validation.warnings.length > 0) {
    lines.push('');
    lines.push('  UYARILAR:');
    for (const warning of validation.warnings) {
      lines.push(`    ${warning}`);
    }
  }

  lines.push('');
  lines.push(DOUBLE_LINE);
  return lines.join('\n');
}

export function formatChecklist(checklist: string[]): string {
  return '\n' + checklist.join('\n') + '\n';
}
