/**
 * Forex Risk Yönetimi ve Pozisyon Hesaplayıcı
 * Türkiye piyasa koşullarına özel
 *
 * Kullanım: npx tsx src/index.ts
 */

import { PositionCalculator } from './services/position-calculator.js';
import { TradeValidator } from './services/trade-validator.js';
import { XAUUSD, TSLA, NVDA } from './models/instruments.js';
import { TURKEY_BROKER_DEFAULTS } from './models/types.js';
import type { PositionInput } from './models/types.js';
import {
  formatPositionResult,
  formatAccountSummary,
  formatValidation,
  formatChecklist,
} from './utils/formatter.js';

// Hesaplayıcı ve doğrulayıcı oluştur
const calculator = new PositionCalculator(TURKEY_BROKER_DEFAULTS);
const validator = new TradeValidator(calculator);

// === HESAP ÖZETİ ===
const ACCOUNT_BALANCE = 2000; // $2000 başlangıç bakiyesi
const accountSummary = calculator.getAccountRiskSummary(ACCOUNT_BALANCE, 1);
console.log(formatAccountSummary(accountSummary));

// === ÖRNEK 1: Altın İşlemi ===
console.log('\n--- ORNEK 1: Altin (XAUUSD) Long Islemi ---');

const goldTrade: PositionInput = {
  accountBalance: ACCOUNT_BALANCE,
  instrument: XAUUSD,
  entryPrice: 2650.00,
  stopLossPrice: 2635.00,   // 1500 pip ($15) stop loss
  takeProfitPrice: 2680.00, // 3000 pip ($30) take profit
  direction: 'long',
  riskPercentage: 1,        // %1 risk
};

const goldResult = calculator.calculate(goldTrade);
console.log(formatPositionResult(goldTrade, goldResult));

const goldValidation = validator.validate(goldTrade);
console.log(formatValidation(goldValidation));

const goldChecklist = validator.generateChecklist(goldTrade);
console.log(formatChecklist(goldChecklist));

// === ÖRNEK 2: Tesla Hisse İşlemi ===
console.log('\n--- ORNEK 2: Tesla (TSLA) Long Islemi ---');

const teslaTrade: PositionInput = {
  accountBalance: ACCOUNT_BALANCE,
  instrument: TSLA,
  entryPrice: 350.00,
  stopLossPrice: 340.00,    // $10 stop loss
  takeProfitPrice: 375.00,  // $25 take profit
  direction: 'long',
  riskPercentage: 1,
};

const teslaResult = calculator.calculate(teslaTrade);
console.log(formatPositionResult(teslaTrade, teslaResult));

const teslaValidation = validator.validate(teslaTrade);
console.log(formatValidation(teslaValidation));

// === ÖRNEK 3: NVIDIA Short İşlemi ===
console.log('\n--- ORNEK 3: NVIDIA (NVDA) Short Islemi ---');

const nvdaTrade: PositionInput = {
  accountBalance: ACCOUNT_BALANCE,
  instrument: NVDA,
  entryPrice: 800.00,
  stopLossPrice: 820.00,    // $20 stop loss
  takeProfitPrice: 760.00,  // $40 take profit
  direction: 'short',
  riskPercentage: 1,
};

const nvdaResult = calculator.calculate(nvdaTrade);
console.log(formatPositionResult(nvdaTrade, nvdaResult));

const nvdaValidation = validator.validate(nvdaTrade);
console.log(formatValidation(nvdaValidation));
