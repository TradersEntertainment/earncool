const fetch = require('node-fetch');

const EARN_TOKEN_MINT = '8s7AXPTwGCr6hGkrYVx1iHQhjRrfYn7DoecwMuCXpump';
const SOL_MINT = 'So11111111111111111111111111111111111111112';

// 1. Get EARN Price in USD (USDC)
async function getEarnPriceUsd() {
    try {
        const response = await fetch(`https://price.jup.ag/v6/price?ids=${EARN_TOKEN_MINT}`);
        const data = await response.json();
        if (data && data.data && data.data[EARN_TOKEN_MINT]) {
            return data.data[EARN_TOKEN_MINT].price;
        }
        return 0;
    } catch (error) {
        console.error('Error fetching EARN price:', error);
        return 0;
    }
}

// 2. Get SOL Price in USD
async function getSolPriceUsd() {
    try {
        const response = await fetch(`https://price.jup.ag/v6/price?ids=${SOL_MINT}`);
        const data = await response.json();
        if (data && data.data && data.data[SOL_MINT]) {
            return data.data[SOL_MINT].price;
        }
        return 0;
    } catch (error) {
        console.error('Error fetching SOL price:', error);
        return 0;
    }
}

// 3. Generate Swap Transaction
// Converts a specific USD amount of SOL into EARN and sends to treasury
async function generateSwapTransaction(usdAmount, userPublicKey, treasuryWallet) {
    try {
        // Step 1: Calculate how much SOL is needed for this USD amount
        const solPrice = await getSolPriceUsd();
        if (!solPrice) throw new Error('Could not fetch SOL price');
        
        const solAmount = usdAmount / solPrice;
        const lamports = Math.floor(solAmount * 1e9);

        // Step 2: Get Quote from Jupiter
        const quoteUrl = `https://quote-api.jup.ag/v6/quote?inputMint=${SOL_MINT}&outputMint=${EARN_TOKEN_MINT}&amount=${lamports}&slippageBps=500`; // 5% slippage for volatile tokens
        const quoteResponse = await fetch(quoteUrl);
        const quoteData = await quoteResponse.json();
        
        if (quoteData.error) {
            throw new Error(`Jupiter Quote Error: ${quoteData.error}`);
        }

        // Step 3: Get Swap Transaction
        const swapRequestBody = {
            quoteResponse: quoteData,
            userPublicKey: userPublicKey,
            wrapAndUnwrapSol: true,
            destinationWallet: treasuryWallet // The treasury receives the EARN tokens
        };

        const swapResponse = await fetch('https://quote-api.jup.ag/v6/swap', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(swapRequestBody)
        });

        const swapData = await swapResponse.json();

        if (swapData.error) {
            throw new Error(`Jupiter Swap Error: ${swapData.error}`);
        }

        // Returns base64 encoded transaction
        return {
            transactionBase64: swapData.swapTransaction,
            expectedEarnAmount: quoteData.outAmount, // in raw token units
            solAmount: solAmount
        };

    } catch (error) {
        console.error('Error generating swap tx:', error);
        throw error;
    }
}

module.exports = {
    getEarnPriceUsd,
    getSolPriceUsd,
    generateSwapTransaction,
    EARN_TOKEN_MINT
};
