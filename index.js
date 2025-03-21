const fetch = require('node-fetch');
const CircularBuffer = require('./circularBuffer');
const { calculateSMA } = require('./sma');
const { logTrade } = require('./tradeLogger');

// API endpoint for cryptocurrency prices
const API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';

// Circular buffers for storing recent prices (5 and 20)
const shortTermBuffer = new CircularBuffer(5);
const longTermBuffer = new CircularBuffer(20);

// Variables for tracking current trade state
let inPosition = false;
let currentPrice = null;

// Polling interval (1 minute)
const POLL_INTERVAL = 60000;

// Fetch the latest price from the API
async function fetchPrice() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    currentPrice = data.bitcoin.usd;
    console.log(`Fetched Price: $${currentPrice}`);
  } catch (error) {
    console.error('Error fetching price:', error);
  }
}

// Check and process trades based on SMA crossover
function processTrade() {
  if (shortTermBuffer.isFull() && longTermBuffer.isFull()) {
    const shortTermSMA = calculateSMA(shortTermBuffer.values());
    const longTermSMA = calculateSMA(longTermBuffer.values());
    
    console.log(`Short-term SMA: ${shortTermSMA}, Long-term SMA: ${longTermSMA}`);
    
    // Generate Buy signal
    if (shortTermSMA > longTermSMA && !inPosition) {
      console.log('Buy signal detected');
      logTrade('buy', currentPrice, 1); // Simulating purchase of 1 unit
      inPosition = true;
    }
    // Generate Sell signal
    else if (shortTermSMA < longTermSMA && inPosition) {
      console.log('Sell signal detected');
      logTrade('sell', currentPrice, 1); // Simulating selling 1 unit
      inPosition = false;
    }
  }
}

// Poll for price data and process trades
async function pollPriceData() {
  await fetchPrice();
  
  // Add price to buffers
  shortTermBuffer.push(currentPrice);
  longTermBuffer.push(currentPrice);
  
  // Process potential trades
  processTrade();
  
  // Set next poll in 1 minute
  setTimeout(pollPriceData, POLL_INTERVAL);
}

// Start the application
pollPriceData();
