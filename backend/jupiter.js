const { Connection, Keypair, VersionedTransaction } = require('@solana/web3.js');

const EARN_TOKEN_MINT = '8s7AXPTwGCr6hGkrYVx1iHQhjRrfYn7DoecwMuCXpump';
const SOL_MINT = 'So11111111111111111111111111111111111111112';

// ------------------------------------------
// Treasury Wallet Setup
// ------------------------------------------
let treasuryKeypair = null;
try {
    if (process.env.TREASURY_SECRET_KEY) {
        const secretKey = Uint8Array.from(JSON.parse(process.env.TREASURY_SECRET_KEY));
        treasuryKeypair = Keypair.fromSecretKey(secretKey);
    } else {
        // Fallback for local testing
        treasuryKeypair = Keypair.fromSecretKey(Uint8Array.from([177,109,145,78,125,108,194,159,198,29,93,120,24,39,195,205,63,196,84,238,20,11,183,60,71,222,104,232,27,120,135,119,31,52,190,82,165,25,9,75,59,85,20,128,49,183,153,77,118,113,83,102,102,15,237,196,233,74,57,86,197,35,197,135]));
    }
} catch (e) {
    console.warn("Failed to load TREASURY_SECRET_KEY", e.message);
}

const TREASURY_PUBKEY = treasuryKeypair ? treasuryKeypair.publicKey.toString() : '36pHYRhbntUAJkR2RjudM7eaTXtNoMibnmVyNEnWMaqt';

// ------------------------------------------
// Price Functions
// ------------------------------------------
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

// ------------------------------------------
// Auto-Buy Execution
// ------------------------------------------
// Uses 90% of the SOL in the treasury to buy EARN automatically (10% remains as platform commission)
async function autoBuyEarnFromTreasury(usdAmount) {
    try {
        const solPrice = await getSolPriceUsd();
        if (!solPrice) throw new Error('Could not fetch SOL price');
        
        const totalSolAmount = usdAmount / solPrice;
        
        // Use 90% of the SOL to buy EARN, keep 10% in Treasury
        const buySolAmount = totalSolAmount * 0.90;
        const lamports = Math.floor(buySolAmount * 1e9);

        // 1. Get Quote
        const quoteUrl = `https://quote-api.jup.ag/v6/quote?inputMint=${SOL_MINT}&outputMint=${EARN_TOKEN_MINT}&amount=${lamports}&slippageBps=500`;
        const quoteResponse = await fetch(quoteUrl);
        const quoteData = await quoteResponse.json();
        
        if (quoteData.error) throw new Error(`Jupiter Quote Error: ${quoteData.error}`);

        // 2. Get Swap Transaction for Treasury Wallet
        const swapRequestBody = {
            quoteResponse: quoteData,
            userPublicKey: TREASURY_PUBKEY,
            wrapAndUnwrapSol: true
        };

        const swapResponse = await fetch('https://quote-api.jup.ag/v6/swap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(swapRequestBody)
        });

        const swapData = await swapResponse.json();
        if (swapData.error) throw new Error(`Jupiter Swap Error: ${swapData.error}`);

        // 3. Sign and Execute via Web3
        if (!treasuryKeypair) throw new Error("Treasury keypair is not configured");

        const connection = new Connection("https://api.mainnet-beta.solana.com");
        
        // Decode base64 transaction
        const txBytes = Uint8Array.from(Buffer.from(swapData.swapTransaction, 'base64'));
        const transaction = VersionedTransaction.deserialize(txBytes);

        // Sign with treasury's secret key
        transaction.sign([treasuryKeypair]);

        // Broadcast to Solana Mainnet
        const txid = await connection.sendRawTransaction(transaction.serialize(), {
            skipPreflight: true,
            maxRetries: 2
        });

        return {
            success: true,
            txid: txid,
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
