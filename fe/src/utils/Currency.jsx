import currency from 'currency.js';

const currencyFormat = (value, symbol) => currency(value, { 
    pattern: `!#`,
    symbol: `${symbol}`,
    separator: '.',
    precision: '0',
});

export default currencyFormat;