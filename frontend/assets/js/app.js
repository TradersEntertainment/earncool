import { createSolanaClient, getInfuraRpcUrls } from '@metamask/connect-solana';
import { Connection, PublicKey } from '@solana/web3.js';

window.appState = {
    wallet: null,
    walletType: null, // 'phantom' | 'metamask'
    balances: { earn: 0, solUsd: 0 },
    mmClient: null
};

const API = '/api';
const EARN_MINT = '8s7AXPTwGCr6hGkrYVx1iHQhjRrfYn7DoecwMuCXpump';

// UI Elements
const connectBtn = document.getElementById('connect-wallet-btn');
const walletInfo = document.getElementById('wallet-info');
const shortAddress = document.getElementById('short-address');
const solBalanceElem = document.getElementById('sol-balance');
const earnBalanceElem = document.getElementById('earn-balance');

const walletModal = document.getElementById('wallet-modal');
const closeWalletBtn = document.getElementById('close-wallet-btn');
const btnPhantom = document.getElementById('connect-phantom');
const btnMetamask = document.getElementById('connect-metamask');

// Toggle Modal
connectBtn?.addEventListener('click', () => walletModal.classList.remove('hidden'));
closeWalletBtn?.addEventListener('click', () => walletModal.classList.add('hidden'));

// MetaMask Initialization
async function initMetaMask() {
    try {
        const infuraKey = import.meta.env.VITE_INFURA_API_KEY || 'c9779dfec73a4b67b1407ee293a54b42'; // fallback demo key
        window.appState.mmClient = await createSolanaClient({
            dapp: {
                name: 'earn.cool',
                url: window.location.origin,
            },
            api: {
                supportedNetworks: getInfuraRpcUrls({
                    infuraApiKey: infuraKey,
                    networks: ['mainnet'],
                })
            }
        });
        console.log("MetaMask Client Initialized");
    } catch (error) {
        console.error("MetaMask Init Error:", error);
    }
}
initMetaMask();

// Connect Phantom
btnPhantom?.addEventListener('click', async () => {
    if (window.solana && window.solana.isPhantom) {
        try {
            const resp = await window.solana.connect();
            window.appState.wallet = resp.publicKey.toString();
            window.appState.walletType = 'phantom';
            walletModal.classList.add('hidden');
            updateUI();
            fetchPricesAndBalances();
        } catch (err) {
            console.error("Phantom Error", err);
        }
    } else {
        alert("Phantom Wallet not found!");
    }
});

// Connect MetaMask
btnMetamask?.addEventListener('click', async () => {
    if (!window.appState.mmClient) {
        alert("MetaMask client not initialized properly.");
        return;
    }
    try {
        await window.appState.mmClient.connect();
        const address = await window.appState.mmClient.getAccount();
        if (address) {
            window.appState.wallet = address;
            window.appState.walletType = 'metamask';
            walletModal.classList.add('hidden');
            updateUI();
            fetchPricesAndBalances();
        }
    } catch (err) {
        console.error("MetaMask Error", err);
        alert("Failed to connect MetaMask. Have you installed the Solana Snap?");
    }
});

function updateUI() {
    if (window.appState.wallet) {
        connectBtn.style.display = 'none';
        walletInfo.style.display = 'flex';
        shortAddress.textContent = window.appState.wallet.slice(0, 4) + '...' + window.appState.wallet.slice(-4);
    }
}

async function fetchPricesAndBalances() {
    try {
        const response = await fetch(`${API}/price`);
        const data = await response.json();
        
        if (data.success) {
            window.appState.prices = {
                earn: data.earnPriceUsd,
                sol: data.solPriceUsd
            };
            
            // Mock fetching wallet balance since we are vanilla
            window.appState.balances.solUsd = (1.5 * data.solPriceUsd).toFixed(2);
            window.appState.balances.earn = 125000;
            
            solBalanceElem.textContent = `$${window.appState.balances.solUsd}`;
            earnBalanceElem.textContent = `${window.appState.balances.earn.toLocaleString()} EARN`;
        }
    } catch (error) {
        console.error('Error fetching prices/balances:', error);
    }
}
