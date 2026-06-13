// ==========================================
// earn.cool v2 - Main Application Logic
// ==========================================

const API_BASE = '/api';

const state = {
    wallet: null,
    earnPriceUsd: 0,
    solPriceUsd: 0,
    userBalanceEarn: 0,
    userBalanceSol: 0
};

// ------------------------------------------
// Initialization
// ------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initPrices();
    initWallet();
    setupModalEvents();
    
    // Tab title trick
    let originalTitle = document.title;
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            document.title = "Come back & earn! 💰";
        } else {
            document.title = originalTitle;
        }
    });
});

// ------------------------------------------
// Prices
// ------------------------------------------
async function initPrices() {
    try {
        const res = await fetch(`${API_BASE}/price`);
        const data = await res.json();
        if (data.success) {
            state.earnPriceUsd = data.earnPriceUsd;
            state.solPriceUsd = data.solPriceUsd;
            document.getElementById('earnPriceDisplay').innerText = `$${data.earnPriceUsd.toFixed(6)}`;
        }
    } catch (error) {
        console.error("Failed to fetch prices:", error);
        document.getElementById('earnPriceDisplay').innerText = "Unavailable";
    }
}

// ------------------------------------------
// Wallet Management
// ------------------------------------------
async function initWallet() {
    const connectBtn = document.getElementById('connectWalletBtn');
    
    // Auto connect if phantom is authorized
    if (window.solana && window.solana.isPhantom) {
        try {
            const resp = await window.solana.connect({ onlyIfTrusted: true });
            handleWalletConnected(resp.publicKey.toString());
        } catch (err) {
            // Not connected previously
        }
    }

    connectBtn.addEventListener('click', async () => {
        if (!window.solana || !window.solana.isPhantom) {
            alert('Please install Phantom Wallet to use earn.cool');
            return;
        }
        try {
            const resp = await window.solana.connect();
            handleWalletConnected(resp.publicKey.toString());
        } catch (err) {
            console.error("User rejected request");
        }
    });
}

function handleWalletConnected(address) {
    state.wallet = address;
    
    document.getElementById('connectWalletBtn').classList.add('hidden');
    
    const profile = document.getElementById('userProfile');
    profile.classList.remove('hidden');
    
    const shortAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;
    document.getElementById('walletAddressBtn').innerText = shortAddress;
    
    // For demo purposes, we set some mock balances
    // In production, we would query the Solana RPC for SPL token balances
    state.userBalanceSol = 2.5;
    state.userBalanceEarn = 5000;
    
    document.getElementById('userSolBalance').innerText = `${state.userBalanceSol.toFixed(2)} SOL`;
    document.getElementById('userEarnBalance').innerText = `${state.userBalanceEarn.toFixed(2)} EARN`;
    
    // Dispatch event so tasks.js knows wallet is connected
    window.dispatchEvent(new CustomEvent('walletConnected', { detail: { address } }));
}

// ------------------------------------------
// Modal Management
// ------------------------------------------
function setupModalEvents() {
    const modal = document.getElementById('createTaskModal');
    const openBtn = document.getElementById('openCreateTaskModal');
    const closeBtn = modal.querySelector('.close-modal');

    openBtn.addEventListener('click', () => {
        if (!state.wallet) {
            alert('Please connect your wallet first!');
            return;
        }
        modal.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
}

window.appState = state; // expose state to other modules
