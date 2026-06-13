const axios = require('axios');

const EARN_TOKEN_MINT = '8s7AXPTwGCr6hGkrYVx1iHQhjRrfYn7DoecwMuCXpump';
const SOL_MINT = 'So11111111111111111111111111111111111111112';

// Treasury public key (read from env or fallback for demo)
const TREASURY_PUBKEY = process.env.TREASURY_PUBLIC_KEY || '36pHYRhbntUAJkR2RjudM7eaTXtNoMibnmVyNEnWMaqt';

// ------------------------------------------
// Price Functions
// ------------------------------------------
async function getEarnPriceUsd() {
    try {
        const response = await axios.get(`https://price.jup.ag/v6/price?ids=${EARN_TOKEN_MINT}`);
        const data = response.data;
        if (data && data.data && data.data[EARN_TOKEN_MINT]) {
            return data.data[EARN_TOKEN_MINT].price;
        }
        return 0;
    } catch (error) {
        console.error('Error fetching EARN price:', error.message);
        return 0;
    }
}

async function getSolPriceUsd() {
    try {
        const response = await axios.get(`https://price.jup.ag/v6/price?ids=${SOL_MINT}`);
        const data = response.data;
        if (data && data.data && data.data[SOL_MINT]) {
            return data.data[SOL_MINT].price;
        }
        return 0;
    } catch (error) {
        console.error('Error fetching SOL price:', error.message);
        return 0;
    }
}

// ------------------------------------------
// Auto-Buy EARN Token (API-only, no on-chain signing)
// ------------------------------------------
// Gets a Jupiter quote for swapping SOL → EARN.
// Actual on-chain execution requires a separate signing service or manual trigger.
async function autoBuyEarnFromTreasury(usdAmount) {
    try {
        const solPrice = await getSolPriceUsd();
        if (!solPrice) throw new Error('Could not fetch SOL price');
        
        const totalSolAmount = usdAmount / solPrice;
        
        // Use 90% of the SOL to buy EARN, keep 10% in Treasury
        const buySolAmount = totalSolAmount * 0.90;
        const lamports = Math.floor(buySolAmount * 1e9);

        // 1. Get Quote from Jupiter
        const quoteUrl = `https://quote-api.jup.ag/v6/quote?inputMint=${SOL_MINT}&outputMint=${EARN_TOKEN_MINT}&amount=${lamports}&slippageBps=500`;
        const quoteResponse = await axios.get(quoteUrl);
        const quoteData = quoteResponse.data;
        
        if (quoteData.error) throw new Error(`Jupiter Quote Error: ${quoteData.error}`);

        // Return the quote data (actual swap execution deferred to signing service)
        return {
            success: true,
            txid: `quote_${Date.now()}`,
            expectedEarnAmount: quoteData.outAmount,
            solAmount: buySolAmount
        };

    } catch (error) {
        console.error('Auto-Buy execution failed:', error.message);
        return { success: false, error: error.message };
    }
}

module.exports = {
    getEarnPriceUsd,
    getSolPriceUsd,
    autoBuyEarnFromTreasury,
    EARN_TOKEN_MINT,
    TREASURY_PUBKEY
};
