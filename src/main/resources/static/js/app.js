// JavaScript file for testing static file caching - Updated for new APIs
console.log('Static JavaScript loaded - this file will be cached by nginx');

// Function to test the Live Stock Price and Cached Product List APIs
function testCaching() {
    const resultsDiv = document.getElementById('cache-results');
    resultsDiv.innerHTML = '<div class="loading">🔄 Testing caching...</div>';

    // Fetch data from the two APIs
    Promise.all([
        fetch('/api/live-stock-price').then(r => r.text()),
        fetch('/api/cached-product-list').then(r => r.text())
    ]).then(responses => {
        const stockPriceResponse = responses[0];
        const productListResponse = responses[1];

        resultsDiv.innerHTML = `
            <div class="cache-demo">
                <h3>🎯 Caching Test Results</h3>

                <div class="cache-row">
                    <div class="cache-type">📈 Live Stock Price</div>
                    <div class="cache-value">${stockPriceResponse}</div>
                    <div class="cache-status never-cached">Never Cached</div>
                </div>

                <div class="cache-row">
                    <div class="cache-type">🛒 Cached Product List</div>
                    <div class="cache-value">${productListResponse}</div>
                    <div class="cache-status cached">Cached 30s</div>
                </div>

                <div class="instruction">
                    👆 Click "Test Caching" multiple times!<br>
                    🔴 Red = Always changes (live data)<br>
                    🟢 Green = Stays same for 30 seconds (cached data)
                </div>
            </div>
        `;
    });
}

// Show cache headers for the two APIs
function showCacheHeaders() {
    Promise.all([
        fetch('/api/live-stock-price'),
        fetch('/api/cached-product-list')
    ]).then(responses => {
        const stockPriceCache = responses[0].headers.get('cache-control') || 'Not set';
        const productListCache = responses[1].headers.get('cache-control') || 'Not set';

        document.getElementById('headers-info').innerHTML = `
            <div class="cache-info">
                <h3>🔍 Cache Headers</h3>
                <div class="header-row">
                    <strong>📈 Live Stock Price:</strong> ${stockPriceCache}
                </div>
                <div class="header-row">
                    <strong>🛒 Cached Product List:</strong> ${productListCache}
                </div>
                <div class="header-explanation">
                    Different headers tell nginx how to handle caching for each API.
                </div>
            </div>
        `;
    });
}

// Counter to show how many times user tested
let testCounter = 0;

// Auto-load cache test on page load
document.addEventListener('DOMContentLoaded', function() {
    const testButton = document.getElementById('test-caching');
    const headersButton = document.getElementById('show-headers');

    if (testButton) {
        testButton.addEventListener('click', function() {
            testCounter++;
            testButton.textContent = `Test Caching (${testCounter} times)`;
            testCaching();
        });
    }

    if (headersButton) headersButton.addEventListener('click', showCacheHeaders);

    // Initial cache test
    testCaching();
});
