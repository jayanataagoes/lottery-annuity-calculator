# lottery-annuity-calculator

A tiny, dependency-free JavaScript library for estimating what a US lottery jackpot is really worth: **cash option vs. 30-year annuity**, before and after federal and state income tax.

> Want the interactive version with live Powerball and Mega Millions jackpots and every state's tax rate? Use **[Jackpot Calculator](https://jackpotcalculator.com/)**.

## Why

The advertised jackpot is the annuity total, paid over 30 years. The cash option is usually less than half of it, and then federal tax (up to 37%) and state tax come off the top. This library shows the gap in a few lines of code.

## Install

```bash
git clone https://github.com/jayanataagoes/lottery-annuity-calculator.git
cd lottery-annuity-calculator
node index.js 1000000000 0.0685   # $1B jackpot, New York state rate
```

## Usage

```js
const { compare, annuitySchedule, federalTax } = require('./index');

compare({ jackpot: 1_000_000_000, cashRatio: 0.45, stateRate: 0 });
// => { cash, cashAfterTax, annuityFirstPayment, annuityTotalAfterTax }

annuitySchedule(1_000_000_000); // 30 payments, each 5% larger than the last
federalTax(500_000);            // progressive 2026 single-filer brackets
```

## How it works

- **Annuity:** 30 graduated payments growing 5% a year, the structure Powerball and Mega Millions use.
- **Cash option:** a share of the jackpot (`cashRatio`, default 0.45). The real figure changes every draw with interest rates.
- **Federal tax:** 2026 progressive brackets for a single filer. Lotteries withhold 24% up front, but the final bill on a big win reaches the 37% bracket.
- **State tax:** a flat rate you pass in. Several states, including California, Florida and Texas, don't tax lottery winnings.

## Disclaimer

Estimates only, not tax advice. Real payouts depend on the draw's cash value, filing status, deductions and where you live. For current numbers by state, see [jackpotcalculator.com](https://jackpotcalculator.com/).

## License

MIT
