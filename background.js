// Background script for FinWatch extension
// This script handles background tasks and extension lifecycle events

// Extension installation/update handler
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('FinWatch extension installed');
    
    // Set default settings on first install
    chrome.storage.sync.set({
      stockSymbol: 'AAPL',
      refreshInterval: 0,
      newsCount: 10
    });
  } else if (details.reason === 'update') {
    console.log('FinWatch extension updated');
  }
});

// Handle messages from popup script if needed in the future
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Future: Handle background tasks like notifications, alarms, etc.
  console.log('Message received in background:', request);
  
  if (request.action === 'setAlarm') {
    // Future feature: Set price alerts
    console.log('Setting price alarm for', request.data);
  }
  
  sendResponse({ success: true });
});

// Future: Set up alarms for periodic checks
// chrome.alarms.onAlarm.addListener((alarm) => {
//   if (alarm.name === 'priceCheck') {
//     // Check prices and send notifications if thresholds are met
//   }
// });
