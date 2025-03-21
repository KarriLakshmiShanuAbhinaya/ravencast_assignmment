function calculateSMA(prices) {
    const sum = prices.reduce((acc, price) => acc + price, 0);
    return sum / prices.length;
  }
  
  module.exports = { calculateSMA };
  