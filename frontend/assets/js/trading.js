// Candle Stick Database (simulated price movement history)
const dbCandles = [
    { time: '12:00', open: 0.000185, high: 0.000195, low: 0.000180, close: 0.000192 },
    { time: '12:05', open: 0.000192, high: 0.000210, low: 0.000190, close: 0.000205 },
    { time: '12:10', open: 0.000205, high: 0.000208, low: 0.000195, close: 0.000198 },
    { time: '12:15', open: 0.000198, high: 0.000215, low: 0.000196, close: 0.000212 },
    { time: '12:20', open: 0.000212, high: 0.000225, low: 0.000210, close: 0.000220 },
    { time: '12:25', open: 0.000220, high: 0.000238, low: 0.000218, close: 0.000230 },
    { time: '12:30', open: 0.000230, high: 0.000248, low: 0.000228, close: 0.000242 } // last matching state.stats.tokenPriceSOL
];

// Mock Recent Transactions list
const dbRecentTrades = [
    { user: 'om8R...4s9', type: 'buy', amountSOL: 0.5, amountCLICK: 2066.12, age: '1m ago' },
    { user: 'An3k...xP8', type: 'buy', amountSOL: 1.2, amountCLICK: 4958.67, age: '3m ago' },
    { user: '8hN1...Kqy', type: 'sell', amountSOL: 0.4, amountCLICK: 1652.89, age: '5m ago' },
    { user: 'Sol_Degen', type: 'buy', amountSOL: 3.5, amountCLICK: 14462.80, age: '8m ago' },
    { user: 'J9u1...45s', type: 'buy', amountSOL: 0.2, amountCLICK: 826.44, age: '12m ago' }
];

let tradeMode = 'buy'; // 'buy' or 'sell'

// Setup trading terminal listeners
document.addEventListener('DOMContentLoaded', () => {
    // Render transactions
    renderRecentTrades();
});

// Switch Buy vs Sell
function switchTradeMode(mode) {
    tradeMode = mode;
    
    const tabBuy = document.getElementById('tabBuy');
    const tabSell = document.getElementById('tabSell');
    const label = document.getElementById('tradeInputLabel');
    const currency = document.getElementById('tradeAmountCurrency');
    const btn = document.getElementById('btnExecuteTrade');
    const amtInput = document.getElementById('tradeAmount');
    
    const buyQuick = document.getElementById('buyQuickAmts');
    const sellQuick = document.getElementById('sellQuickAmts');
    
    if (mode === 'buy') {
        tabBuy.className = 'tab-btn buy active';
        tabSell.className = 'tab-btn sell';
        label.innerText = 'Amount to Pay (SOL)';
        currency.innerText = 'SOL';
        btn.innerText = 'Buy Now (Buy)';
        btn.style.background = 'linear-gradient(135deg, var(--text-success), #059669)';
        btn.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
        amtInput.value = '0.5';
        
        buyQuick.style.display = 'grid';
        sellQuick.style.display = 'none';
    } else {
        tabBuy.className = 'tab-btn buy';
        tabSell.className = 'tab-btn sell active';
        label.innerText = 'Amount to Sell ($EARN)';
        currency.innerText = '$EARN';
        btn.innerText = 'Sell Now';
        btn.style.background = 'linear-gradient(135deg, var(--text-error), #dc2626)';
        btn.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
        amtInput.value = '500';
        
        buyQuick.style.display = 'none';
        sellQuick.style.display = 'grid';
    }
    
    calculateTradeReturn();
}

function setTradeAmount(val) {
    const amtInput = document.getElementById('tradeAmount');
    if (tradeMode === 'buy') {
        amtInput.value = val.toString();
    } else {
        // Val represents percentage (25, 50, 75, 100)
        if (state.wallet.connected) {
            const amount = state.wallet.balanceEARN * (val / 100);
            amtInput.value = Math.floor(amount).toString();
        } else {
            showToast('Please connect your wallet first.', 'error');
            openConnectWalletModal();
        }
    }
    calculateTradeReturn();
}

function calculateTradeReturn() {
    const amount = parseFloat(document.getElementById('tradeAmount').value) || 0;
    const receiveElement = document.getElementById('tradeReceiveAmount');
    const impactElement = document.getElementById('tradePriceImpact');
    
    if (amount <= 0) {
        receiveElement.innerText = `0.00 ${tradeMode === 'buy' ? '$EARN' : 'SOL'}`;
        impactElement.innerText = '%0.00';
        return;
    }
    
    if (tradeMode === 'buy') {
        const tokens = amount / state.stats.tokenPriceSOL;
        receiveElement.innerText = `${tokens.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} $EARN`;
        
        // Price impact is positive slippage because it buys tokens
        const impact = (amount / state.stats.raydiumThresholdSOL) * 100;
        impactElement.innerText = `%${impact.toFixed(3)} (Price Will Increase)`;
        impactElement.style.color = 'var(--text-success)';
    } else {
        const sol = amount * state.stats.tokenPriceSOL;
        receiveElement.innerText = `${sol.toLocaleString(undefined, {minimumFractionDigits: 4, maximumFractionDigits: 4})} SOL`;
        
        const impact = (sol / state.stats.raydiumThresholdSOL) * 100;
        impactElement.innerText = `-%${impact.toFixed(3)} (Price Will Decrease)`;
        impactElement.style.color = 'var(--text-error)';
    }
}

// -------------------------------------------------------------
// PRICE CHART DRAWING (SVG VECTOR ENGINE)
// -------------------------------------------------------------
function initTradingChart() {
    const svg = document.getElementById('priceCandleChart');
    const container = document.getElementById('chartContainer');
    if (!svg || !container) return;
    
    // Clear svg elements
    svg.innerHTML = '';
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Dimensions offsets
    const paddingLeft = 15;
    const paddingRight = 75;
    const paddingTop = 25;
    const paddingBottom = 30;
    
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    
    // Find min and max prices to auto scale height
    let maxVal = -Infinity;
    let minVal = Infinity;
    dbCandles.forEach(c => {
        if (c.high > maxVal) maxVal = c.high;
        if (c.low < minVal) minVal = c.low;
    });
    
    // Give some breathing room on high/low bounds
    const diff = maxVal - minVal;
    maxVal += diff * 0.15;
    minVal -= diff * 0.15;
    if (minVal < 0) minVal = 0;
    
    // Render Grid lines & Right Price axis
    const gridCount = 5;
    for (let i = 0; i < gridCount; i++) {
        const ratio = i / (gridCount - 1);
        const y = paddingTop + chartHeight * (1 - ratio);
        const priceVal = minVal + ratio * (maxVal - minVal);
        
        // Horizontal grid line
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', paddingLeft);
        line.setAttribute('y1', y);
        line.setAttribute('x2', paddingLeft + chartWidth);
        line.setAttribute('y2', y);
        line.setAttribute('stroke', 'rgba(255, 255, 255, 0.04)');
        line.setAttribute('stroke-dasharray', '4, 4');
        svg.appendChild(line);
        
        // Right axis price text
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', paddingLeft + chartWidth + 8);
        text.setAttribute('y', y + 4);
        text.setAttribute('fill', 'var(--text-muted)');
        text.setAttribute('font-size', '0.75rem');
        text.setAttribute('font-weight', '600');
        text.textContent = `${priceVal.toFixed(6)} SOL`;
        svg.appendChild(text);
    }
    
    // Calculate candle width
    const totalCandles = dbCandles.length;
    const columnWidth = chartWidth / totalCandles;
    const candleWidth = columnWidth * 0.65;
    
    // Draw Candles
    dbCandles.forEach((candle, index) => {
        const xCenter = paddingLeft + (index * columnWidth) + (columnWidth / 2);
        
        // Convert prices to coordinates
        const yHigh = paddingTop + chartHeight * (1 - (candle.high - minVal) / (maxVal - minVal));
        const yLow = paddingTop + chartHeight * (1 - (candle.low - minVal) / (maxVal - minVal));
        const yOpen = paddingTop + chartHeight * (1 - (candle.open - minVal) / (maxVal - minVal));
        const yClose = paddingTop + chartHeight * (1 - (candle.close - minVal) / (maxVal - minVal));
        
        const isBullish = candle.close >= candle.open;
        const color = isBullish ? 'var(--text-success)' : 'var(--text-error)';
        
        // 1. Wick Line
        const wick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        wick.setAttribute('x1', xCenter);
        wick.setAttribute('y1', yHigh);
        wick.setAttribute('x2', xCenter);
        wick.setAttribute('y2', yLow);
        wick.setAttribute('stroke', color);
        wick.setAttribute('stroke-width', '1.5');
        svg.appendChild(wick);
        
        // 2. Candle Body Rectangle
        const rectY = Math.min(yOpen, yClose);
        const rectHeight = Math.max(2, Math.abs(yOpen - yClose));
        
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', xCenter - candleWidth / 2);
        rect.setAttribute('y', rectY);
        rect.setAttribute('width', candleWidth);
        rect.setAttribute('height', rectHeight);
        rect.setAttribute('fill', color);
        rect.setAttribute('rx', '2');
        svg.appendChild(rect);
        
        // 3. Time label at bottom
        if (index % 2 === 0) {
            const timeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            timeText.setAttribute('x', xCenter);
            timeText.setAttribute('y', height - 8);
            timeText.setAttribute('fill', 'var(--text-muted)');
            timeText.setAttribute('font-size', '0.7rem');
            timeText.setAttribute('text-anchor', 'middle');
            timeText.setAttribute('font-weight', '600');
            timeText.textContent = candle.time;
            svg.appendChild(timeText);
        }
    });
}

// -------------------------------------------------------------
// EXECUTE TOKEN TRADE SIMULATION
// -------------------------------------------------------------
function executeTokenTrade() {
    if (!state.wallet.connected) {
        showToast('Please connect wallet to perform trade.', 'error');
        openConnectWalletModal();
        return;
    }
    
    const amount = parseFloat(document.getElementById('tradeAmount').value);
    if (!amount || amount <= 0) {
        showToast('Please enter a valid trade amount.', 'error');
        return;
    }
    
    // Simulate signature overlay
    const overlay = document.getElementById('modalConnectWallet');
    const selector = document.getElementById('walletModalSelector');
    const loader = document.getElementById('walletModalLoading');
    
    selector.style.display = 'none';
    loader.style.display = 'flex';
    
    if (tradeMode === 'buy') {
        if (state.wallet.balanceSOL < amount) {
            showToast(`Insufficient SOL balance! Required: ${amount} SOL, Available: ${state.wallet.balanceSOL} SOL`, 'error');
            return;
        }
        
        loader.querySelector('h3').innerText = 'Buying Tokens...';
        loader.querySelector('p').innerText = `Approve the wallet signature request to buy $EARN with ${amount} SOL.`;
    } else {
        if (state.wallet.balanceEARN < amount) {
            showToast(`Insufficient $EARN balance! Required: ${amount.toLocaleString()} $EARN, Available: ${state.wallet.balanceEARN.toLocaleString()} $EARN`, 'error');
            return;
        }
        
        loader.querySelector('h3').innerText = 'Selling Tokens...';
        loader.querySelector('p').innerText = `Approve the wallet signature request to sell ${amount.toLocaleString()} $EARN.`;
    }
    
    overlay.classList.add('active');
    
    setTimeout(() => {
        // Complete simulated trade
        overlay.classList.remove('active');
        
        const priceBefore = state.stats.tokenPriceSOL;
        let returnVal = 0;
        
        if (tradeMode === 'buy') {
            returnVal = amount / state.stats.tokenPriceSOL;
            
            // Adjust user balances
            state.wallet.balanceSOL -= amount;
            state.wallet.balanceEARN += returnVal;
            
            // Increment token price based on order volume
            const impact = amount * 0.000008;
            state.stats.tokenPriceSOL += impact;
            
            // Increment bonding curve progress
            state.stats.totalSOLInvested += amount;
            state.stats.bondingCurvePercent = Math.min(99.9, (state.stats.totalSOLInvested / state.stats.raydiumThresholdSOL) * 100);
            
            // Add transactions event
            dbRecentTrades.unshift({
                user: state.wallet.address.slice(0, 4) + '...' + state.wallet.address.slice(-4),
                type: 'buy',
                amountSOL: amount,
                amountCLICK: returnVal,
                age: 'just now'
            });
            
            triggerTokenRainAnimation();
            showToast(`Success! +${returnVal.toLocaleString(undefined, {maximumFractionDigits: 2})} $EARN bought.`, 'success');
        } else {
            returnVal = amount * state.stats.tokenPriceSOL;
            
            // Adjust user balances
            state.wallet.balanceEARN -= amount;
            state.wallet.balanceSOL += returnVal;
            
            // Decrement token price based on sell volume
            const impact = returnVal * 0.000008;
            state.stats.tokenPriceSOL = Math.max(0.00001, state.stats.tokenPriceSOL - impact);
            
            // Decrement bonding curve progress
            state.stats.totalSOLInvested = Math.max(0, state.stats.totalSOLInvested - returnVal);
            state.stats.bondingCurvePercent = Math.min(99.9, (state.stats.totalSOLInvested / state.stats.raydiumThresholdSOL) * 100);
            
            // Add transactions event
            dbRecentTrades.unshift({
                user: state.wallet.address.slice(0, 4) + '...' + state.wallet.address.slice(-4),
                type: 'sell',
                amountSOL: returnVal,
                amountCLICK: amount,
                age: 'just now'
            });
            
            showToast(`Success! +${returnVal.toFixed(4)} SOL transferred to your wallet.`, 'success');
        }
        
        // Redraw/Update all trading elements
        updateNavbarBalance();
        renderStats();
        renderRecentTrades();
        
        // Insert new candlestick into db based on this trade action
        const now = new Date();
        const minStr = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
        const timeStr = `${now.getHours()}:${minStr}`;
        
        const open = priceBefore;
        const close = state.stats.tokenPriceSOL;
        const high = Math.max(open, close) + Math.random() * 0.000003;
        const low = Math.min(open, close) - Math.random() * 0.000003;
        
        dbCandles.push({
            time: timeStr,
            open: open,
            high: high,
            low: low,
            close: close
        });
        
        // Maintain last 8 candles to avoid chart clutter
        if (dbCandles.length > 8) {
            dbCandles.shift();
        }
        
        // Update Chart Displays
        document.getElementById('chartTokenPriceVal').innerText = `${state.stats.tokenPriceSOL.toFixed(6)} SOL`;
        initTradingChart();
        
        // Reset input amount
        document.getElementById('tradeAmount').value = tradeMode === 'buy' ? '0.5' : '500';
        calculateTradeReturn();
    }, 1800);
}

function renderRecentTrades() {
    const list = document.getElementById('recentTokenTrades');
    if (!list) return;
    
    list.innerHTML = '';
    
    dbRecentTrades.forEach(trade => {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.justifyContent = 'space-between';
        div.style.padding = '0.4rem 0.75rem';
        div.style.background = 'rgba(255, 255, 255, 0.01)';
        div.style.border = '1px solid rgba(255, 255, 255, 0.03)';
        div.style.borderRadius = '6px';
        
        const isBuy = trade.type === 'buy';
        const color = isBuy ? 'var(--text-success)' : 'var(--text-error)';
        const label = isBuy ? 'BUY' : 'SELL';
        
        div.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-weight: 700; color: ${color};">${label}</span>
                <span style="color: var(--text-primary); font-weight: 600;">@${trade.user}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-weight: 700;">${trade.amountCLICK.toLocaleString(undefined, {maximumFractionDigits: 0})} $EARN</span>
                <span style="color: var(--text-muted); opacity: 0.8;">(${trade.amountSOL.toFixed(2)} SOL)</span>
                <span style="font-size: 0.7rem; color: var(--text-muted); min-width: 40px; text-align: right;">${trade.age}</span>
            </div>
        `;
        list.appendChild(div);
    });
}

// Expose functions globally for legacy inline HTML onclick handlers
window.switchTradeMode = switchTradeMode;
window.setTradeAmount = setTradeAmount;
window.calculateTradeReturn = calculateTradeReturn;
window.initTradingChart = initTradingChart;
window.executeTokenTrade = executeTokenTrade;
window.renderRecentTrades = renderRecentTrades;
