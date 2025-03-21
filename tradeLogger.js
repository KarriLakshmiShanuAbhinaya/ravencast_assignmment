const fs = require('fs');

function logTrade(type, price, quantity) {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp} - ${type.toUpperCase()} - Price: $${price}, Quantity: ${quantity}\n`;
  
  fs.appendFile('trades.log', logEntry, (err) => {
    if (err) throw err;
    console.log('Trade logged:', logEntry);
  });
}

module.exports = { logTrade };
