'use strict';

/**
 * lottery-annuity-calculator
 * Estimate US lottery jackpot payouts: cash option vs. 30-payment annuity,
 * before and after federal and state income tax.
 *
 * Full interactive calculator: https://jackpotcalculator.com/
 */

// 2026 US federal ordinary income brackets, single filer (top rate 37%).
const FEDERAL_BRACKETS_SINGLE = [
  [12400, 0.10],
  [50400, 0.12],
  [105700, 0.22],
  [201775, 0.24],
  [256225, 0.32],
  [640600, 0.35],
  [Infinity, 0.37],
];

/** Federal income tax on `income` using progressive brackets. */
function federalTax(income, brackets = FEDERAL_BRACKETS_SINGLE) {
  let tax = 0;
  let lower = 0;
  for (const [upper, rate] of brackets) {
    if (income <= lower) break;
    tax += (Math.min(income, upper) - lower) * rate;
    lower = upper;
  }
  return tax;
}

/**
 * Annuity schedule: 30 payments growing 5% a year (Powerball / Mega Millions style).
 * @param {number} jackpot advertised annuity jackpot
 * @param {object} [opts]
 * @param {number} [opts.payments=30]
 * @param {number} [opts.growth=0.05]
 * @returns {number[]} gross payment per year
 */
function annuitySchedule(jackpot, { payments = 30, growth = 0.05 } = {}) {
  let factor = 0;
  for (let i = 0; i < payments; i++) factor += Math.pow(1 + growth, i);
  const first = jackpot / factor;
  return Array.from({ length: payments }, (_, i) => first * Math.pow(1 + growth, i));
}

/**
 * Compare cash option and annuity after tax.
 * @param {object} p
 * @param {number} p.jackpot advertised jackpot
 * @param {number} [p.cashRatio=0.45] cash value as share of the jackpot (varies by draw)
 * @param {number} [p.stateRate=0] state income tax rate on lottery winnings, e.g. 0.0685 for New York
 */
function compare({ jackpot, cashRatio = 0.45, stateRate = 0 }) {
  const cash = jackpot * cashRatio;
  const cashNet = cash - federalTax(cash) - cash * stateRate;
  const schedule = annuitySchedule(jackpot);
  const annuityNet = schedule.reduce((sum, pay) => sum + pay - federalTax(pay) - pay * stateRate, 0);
  return {
    cash: Math.round(cash),
    cashAfterTax: Math.round(cashNet),
    annuityFirstPayment: Math.round(schedule[0]),
    annuityTotalAfterTax: Math.round(annuityNet),
  };
}

module.exports = { federalTax, annuitySchedule, compare, FEDERAL_BRACKETS_SINGLE };

if (require.main === module) {
  const jackpot = Number(process.argv[2] || 1000000000);
  const stateRate = Number(process.argv[3] || 0);
  console.log(compare({ jackpot, stateRate }));
  console.log('Try every state and live jackpots at https://jackpotcalculator.com/');
}
