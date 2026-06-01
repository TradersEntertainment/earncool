// Global API Base URL definition (Autodetects environment for seamless dev/prod integration)
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? ''
    : 'https://earnc00l.up.railway.app';

// Global App State
const state = {
    wallet: {
        connected: false,
        address: null,
        provider: null,
        balanceSOL: 0.0,
        balanceEARN: 0.0
    },
    social: {
        connected: false,
        handle: null,
        displayName: null,
        avatar: null
    },
    userProfile: {
        verified: false,
        sorsaScore: 0
    },
    stats: {
        totalPaid: 245820,
        completedTasks: 43124,
        activeUsers: 1248,
        tokenPriceSOL: 0.000242,
        priceChange24h: 22.42,
        bondingCurvePercent: 74.2,
        raydiumThresholdSOL: 85000, // Raydium migrate limit
        totalSOLInvested: 63170 // simulated bonding curve progress SOL
    },
    leaderboards: {
        workers: [
            { rank: 1, name: 'sol_hunter99', address: 'Dx4Z...8mRp', earnings: 42150 },
            { rank: 2, name: 'cryptoking_x', address: 'Gq3v...Yt6x', earnings: 38400 },
            { rank: 3, name: 'alpha_builder', address: 'Ah8N...p1wK', earnings: 31200 },
            { rank: 4, name: 'gemini_agent', address: 'J9u1...45sA', earnings: 28950 },
            { rank: 5, name: 'memecoin_chef', address: 'Fp5T...Kq2z', earnings: 24500 },
            { rank: 6, name: 'solana_maxi', address: 'Bp2W...11fD', earnings: 21200 },
            { rank: 7, name: 'clicker_whale', address: 'Lm9S...4h9b', earnings: 19800 },
            { rank: 8, name: 'x_raider_pro', address: 'Tz7E...8gTy', earnings: 18450 },
            { rank: 9, name: 'pump_enjoyer', address: 'Wp3M...5xVn', earnings: 15300 },
            { rank: 10, name: 'microtasker_1', address: 'Op2U...9wKl', earnings: 14100 }
        ],
        creators: [
            { rank: 1, name: 'Bonk Official', address: 'Hz2...5hG', lockedSOL: 450.5 },
            { rank: 2, name: 'Jupiter Exchange', address: 'Jup...Xyz', lockedSOL: 380.2 },
            { rank: 3, name: 'Phantom Squad', address: 'Phn...99a', lockedSOL: 290.0 },
            { rank: 4, name: 'PumpFun Launch', address: 'Pmp...F4u', lockedSOL: 245.8 },
            { rank: 5, name: 'Solana Labs', address: 'Sol...11b', lockedSOL: 180.5 },
            { rank: 6, name: 'Raydium Protocol', address: 'Ray...P01', lockedSOL: 140.0 },
            { rank: 7, name: 'Pyth Network', address: 'Pyh...T4x', lockedSOL: 110.2 },
            { rank: 8, name: 'Tensor Trade', address: 'Tns...A12', lockedSOL: 95.5 },
            { rank: 9, name: 'Orca Dex', address: 'Orc...8s9', lockedSOL: 80.0 },
            { rank: 10, name: 'Meme Generator', address: 'Mem...G3n', lockedSOL: 55.4 }
        ]
    }
};

// Simulated Worker Names & Completed Tasks for Live Stream
const mockTickNames = [
    'sol_raider', 'alpha_chaser', 'pump_guy', 'degensol', 'cryptogirl_7', 'x_builder', 'memeLord',
    'solflare_fan', 'phantom_boss', 'solana_sailor', 'whale_watcher', 'moon_shot', 'click_master',
    'web3_native', 'ai_agent_007', 'cryptosonic', 'solflare_god', 'repost_machine', 'follow_bot_h'
];
const mockTickTasks = [
    { type: 'follow', desc: '@solana followed account', reward: '120 $EARN' },
    { type: 'follow', desc: '@phantom wallet followed account', reward: '100 $EARN' },
    { type: 'like', desc: 'Jupiter liked announcement tweet', reward: '50 $EARN' },
    { type: 'repost', desc: 'Bonk Memecoin Launchpad reposted tweet', reward: '150 $EARN' },
    { type: 'feedback', desc: 'Raydium reviewed new interface', reward: '250 $EARN' },
    { type: 'like', desc: 'Pyth network liked price update tweet', reward: '60 $EARN' },
    { type: 'repost', desc: 'Pump.fun shared bonding curve completion notice', reward: '120 $EARN' }
];

// App Setup on Load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();
    
    // Fill Live Platform Stats
    renderStats();
    
    // Start Live Activity Ticker Simulation
    initLiveActivityTicker();
    
    // Fill leaderboards
    renderLeaderboards();

    // Setup campaign defaults
    updateFormPlaceholders();
    calculateCampaignCost();

    // Fetch active tasks from express API
    if (typeof fetchTasks === 'function') fetchTasks();

    // Vault initializations
    startVaultCountdown();
    drawVaultReturnTrendChart();
    renderVaultPreviews();
    fetchVaultStatus();
});

// Tab Switch Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(`section-${sectionId}`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.getElementById(`nav-${sectionId}`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Custom Section Init Hooks
    if (sectionId === 'worker') {
        if (typeof renderTaskList === 'function') {
            renderTaskList();
        }
    } else if (sectionId === 'trading') {
        if (typeof initTradingChart === 'function') {
            setTimeout(initTradingChart, 50);
        }
    } else if (sectionId === 'vault') {
        setTimeout(drawVaultReturnTrendChart, 50);
    }
}

// -------------------------------------------------------------
// WALLET SIMULATOR OVERLAYS & STATE UPDATER
// -------------------------------------------------------------
function openConnectWalletModal() {
    if (state.wallet.connected) {
        // Disconnect logic
        state.wallet.connected = false;
        state.wallet.address = null;
        state.wallet.provider = null;
        state.wallet.balanceSOL = 0.0;
        state.wallet.balanceEARN = 0.0;
        
        document.getElementById('walletText').innerText = 'Connect Wallet';
        document.getElementById('walletBadgeDot').className = 'badge-dot disconnected';
        document.getElementById('userBalanceDisplay').style.display = 'none';
        document.getElementById('profileTogglesBadge').style.display = 'none';
        
        showToast('Wallet disconnected.', 'warning');
        
        if (typeof renderTaskList === 'function') renderTaskList();
        if (typeof renderMyCampaigns === 'function') renderMyCampaigns();
        return;
    }
    
    const modal = document.getElementById('modalConnectWallet');
    modal.classList.add('active');
    document.getElementById('walletModalSelector').style.display = 'flex';
    document.getElementById('walletModalLoading').style.display = 'none';
}

function closeConnectWalletModal() {
    document.getElementById('modalConnectWallet').classList.remove('active');
}

// Base58 Alphabet & Encoder helper for signature formatting
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
function bufferToBase58(buffer) {
    let bytes = new Uint8Array(buffer);
    let digits = [0];
    for (let i = 0; i < bytes.length; i++) {
        for (let j = 0; j < digits.length; j++) digits[j] <<= 8;
        digits[0] += bytes[i];
        let carry = 0;
        for (let j = 0; j < digits.length; ++j) {
            digits[j] += carry;
            carry = (digits[j] / 58) | 0;
            digits[j] %= 58;
        }
        while (carry) {
            digits.push(carry % 58);
            carry = (carry / 58) | 0;
        }
    }
    let string = '';
    for (let i = 0; i < bytes.length && bytes[i] === 0; i++) {
        string += BASE58_ALPHABET[0];
    }
    for (let i = digits.length - 1; i >= 0; i--) {
        string += BASE58_ALPHABET[digits[i]];
    }
    return string;
}

async function simulateWalletConnection(providerName) {
    document.getElementById('walletModalSelector').style.display = 'none';
    document.getElementById('walletModalLoading').style.display = 'flex';
    document.getElementById('walletLoadingTitle').innerText = 'Connecting Wallet...';
    document.getElementById('walletLoadingDesc').innerText = `Linking to ${providerName} extension and initializing cryptographic challenge...`;
    
    // Check if Phantom/Solflare browser extension is installed
    const isPhantom = providerName.toLowerCase() === 'phantom';
    const provider = isPhantom ? (window.phantom?.solana || window.solana) : window.solflare;
    
    if (provider && (provider.isPhantom || provider.isSolflare || typeof provider.connect === 'function')) {
        try {
            // 1. Establish connection to wallet extension
            const response = await provider.connect();
            const publicKey = response.publicKey.toString();
            
            // 2. Formulate cryptographic message signing challenge
            const message = `Welcome to earn.cool! Sign this message to authenticate your wallet ownership.\n\nNonce: ${Date.now()}`;
            const encodedMessage = new TextEncoder().encode(message);
            
            document.getElementById('walletLoadingTitle').innerText = 'Signature Requested...';
            document.getElementById('walletLoadingDesc').innerText = 'Please sign the security message inside your wallet extension to verify ownership.';
            
            const signedResult = await provider.signMessage(encodedMessage, "utf8");
            const signature = bufferToBase58(signedResult.signature || signedResult.signatureBytes);
            
            // 3. Post signature package to backend API
            document.getElementById('walletLoadingTitle').innerText = 'Verifying Authenticity...';
            document.getElementById('walletLoadingDesc').innerText = 'Validating cryptographic signature against Solana ledger standards on backend...';
            
            const authResponse = await fetch(`${API_BASE}/api/auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: publicKey, message, signature })
            });
            
            const authData = await authResponse.json();
            if (authData.success) {
                state.wallet.connected = true;
                state.wallet.provider = providerName;
                state.wallet.address = publicKey;
                
                // Load states from backend response
                state.wallet.balanceSOL = authData.user.balanceSOL || 4.25;
                state.wallet.balanceEARN = authData.user.balanceEARN || 1250.0;
                state.userProfile.verified = authData.user.verified || false;
                state.userProfile.sorsaScore = authData.user.sorsaScore || 0;
                
                // Get real SOL balance using CDN Solana web3 library
                try {
                    if (window.solanaWeb3) {
                        const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');
                        const balanceVal = await connection.getBalance(new solanaWeb3.PublicKey(publicKey));
                        state.wallet.balanceSOL = balanceVal / solanaWeb3.LAMPORTS_PER_SOL;
                    }
                } catch (err) {
                    console.log("Real Solana ledger balance query bypassed. Using fallback balance:", err);
                }
                
                // Update navbar and wallet badges
                document.getElementById('walletText').innerText = `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;
                document.getElementById('walletBadgeDot').className = 'badge-dot';
                
                updateNavbarBalance();
                document.getElementById('userBalanceDisplay').style.display = 'flex';
                document.getElementById('profileTogglesBadge').style.display = 'flex';
                
                // Synchronize simulator checkboxes
                document.getElementById('chkSimVerified').checked = state.userProfile.verified;
                document.getElementById('chkSimSorsa').checked = state.userProfile.sorsaScore > 0;
                
                closeConnectWalletModal();
                showToast(`Wallet cryptographically authenticated via ${providerName}!`, 'success');
                
                if (typeof fetchTasks === 'function') fetchTasks();
                else if (typeof renderTaskList === 'function') renderTaskList();
                
                if (typeof renderMyCampaigns === 'function') renderMyCampaigns();
                if (typeof fetchVaultStatus === 'function') fetchVaultStatus();
            } else {
                throw new Error(authData.error || "Authentication rejected");
            }
        } catch (error) {
            console.error("Cryptographic signing error:", error);
            showToast(`Verification Failed: ${error.message || error}`, 'error');
            closeConnectWalletModal();
        }
    } else {
        // Fallback to beautiful Sandbox Demo Simulator when wallet extension is missing
        showToast(`${providerName} extension not detected. Connecting in preview Demo Mode...`, 'warning');
        
        setTimeout(() => {
            state.wallet.connected = true;
            state.wallet.provider = `${providerName} (Demo)`;
            const randomHex = Array.from({length: 8}, () => Math.floor(Math.random()*16).toString(16)).join('');
            state.wallet.address = `om8R${randomHex.toUpperCase()}4s9`;
            
            // Post to backend auth (using mock data) to register address in server database
            fetch(`${API_BASE}/api/auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    address: state.wallet.address,
                    message: "DEMO_BYPASS",
                    signature: "DEMO_BYPASS"
                })
            }).then(r => r.json()).then(data => {
                if (data.success) {
                    state.wallet.balanceSOL = 4.25;
                    state.wallet.balanceEARN = data.user ? data.user.balanceEARN : 1250.0;
                    state.userProfile.verified = data.user ? data.user.verified : false;
                    state.userProfile.sorsaScore = data.user ? data.user.sorsaScore : 0;
                    
                    document.getElementById('walletText').innerText = `${state.wallet.address.slice(0, 4)}...${state.wallet.address.slice(-4)}`;
                    document.getElementById('walletBadgeDot').className = 'badge-dot';
                    
                    updateNavbarBalance();
                    document.getElementById('userBalanceDisplay').style.display = 'flex';
                    document.getElementById('profileTogglesBadge').style.display = 'flex';
                    
                    document.getElementById('chkSimVerified').checked = state.userProfile.verified;
                    document.getElementById('chkSimSorsa').checked = state.userProfile.sorsaScore > 0;
                    
                    closeConnectWalletModal();
                    showToast(`Demo Wallet synchronized with server! Ready for review.`, 'success');
                    
                    if (typeof fetchTasks === 'function') fetchTasks();
                    else if (typeof renderTaskList === 'function') renderTaskList();
                    
                    if (typeof renderMyCampaigns === 'function') renderMyCampaigns();
                    if (typeof fetchVaultStatus === 'function') fetchVaultStatus();
                }
            });
        }, 1500);
    }
}

function openTxSignInModal() {
    document.getElementById('walletModalSelector').style.display = 'none';
    document.getElementById('walletModalTxSignIn').style.display = 'flex';
    toggleTxStartButton();
    lucide.createIcons();
}

function backToWalletSelector() {
    document.getElementById('walletModalTxSignIn').style.display = 'none';
    document.getElementById('walletModalSelector').style.display = 'flex';
}

function toggleTxStartButton() {
    const input = document.getElementById('simTxWalletAddress');
    const startBtn = document.getElementById('btnTxStart');
    if (!input || !startBtn) return;
    
    if (input.value.trim() === '') {
        startBtn.setAttribute('disabled', 'true');
        startBtn.style.opacity = '0.5';
        startBtn.style.cursor = 'not-allowed';
    } else {
        startBtn.removeAttribute('disabled');
        startBtn.style.opacity = '1';
        startBtn.style.cursor = 'pointer';
    }
}

function executeTxSignIn() {
    const addressInput = document.getElementById('simTxWalletAddress').value.trim();
    if (!addressInput) {
        showToast('Please enter a valid Solana wallet address.', 'error');
        return;
    }
    
    document.getElementById('walletModalTxSignIn').style.display = 'none';
    const loader = document.getElementById('walletModalLoading');
    loader.style.display = 'flex';
    
    document.getElementById('walletLoadingTitle').innerText = 'Signing In with Transaction...';
    document.getElementById('walletLoadingDesc').innerText = 'Validating address registry on backend database...';
    
    setTimeout(() => {
        state.wallet.connected = true;
        state.wallet.provider = 'Transaction Auth';
        state.wallet.address = addressInput;
        
        fetch(`${API_BASE}/api/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                address: state.wallet.address,
                message: "DEMO_BYPASS",
                signature: "DEMO_BYPASS"
            })
        }).then(r => r.json()).then(data => {
            if (data.success) {
                state.wallet.balanceSOL = 4.25;
                state.wallet.balanceEARN = data.user ? data.user.balanceEARN : 1250.0;
                state.userProfile.verified = data.user ? data.user.verified : false;
                state.userProfile.sorsaScore = data.user ? data.user.sorsaScore : 0;
                
                document.getElementById('walletText').innerText = `${state.wallet.address.slice(0, 4)}...${state.wallet.address.slice(-4)}`;
                document.getElementById('walletBadgeDot').className = 'badge-dot';
                
                updateNavbarBalance();
                document.getElementById('userBalanceDisplay').style.display = 'flex';
                document.getElementById('profileTogglesBadge').style.display = 'flex';
                
                document.getElementById('chkSimVerified').checked = state.userProfile.verified;
                document.getElementById('chkSimSorsa').checked = state.userProfile.sorsaScore > 0;
                
                closeConnectWalletModal();
                showToast(`Wallet connected successfully via transaction address!`, 'success');
                
                if (typeof fetchTasks === 'function') fetchTasks();
                else if (typeof renderTaskList === 'function') renderTaskList();
                
                if (typeof renderMyCampaigns === 'function') renderMyCampaigns();
                if (typeof fetchVaultStatus === 'function') fetchVaultStatus();
            }
        });
    }, 2000);
}

function updateNavbarBalance() {
    document.getElementById('balanceText').innerText = `${state.wallet.balanceEARN.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} $EARN`;
}

// Simulated profile state togglers (for worker restrictions checking)
function toggleSimVerified() {
    const chk = document.getElementById('chkSimVerified');
    state.userProfile.verified = chk.checked;
    
    if (state.userProfile.verified) {
        showToast('Blue Tick simulation activated! You can now verify verified-only tasks.', 'success');
    } else {
        showToast('Blue Tick simulation deactivated.', 'warning');
    }
    if (typeof renderTaskList === 'function') renderTaskList();
}

function toggleSimSorsa() {
    const chk = document.getElementById('chkSimSorsa');
    state.userProfile.sorsaScore = chk.checked ? 10 : 0;
    
    if (state.userProfile.sorsaScore > 0) {
        showToast('Sorsa Score set to > 0! You can now verify trust-gated tasks.', 'success');
    } else {
        showToast('Sorsa Score reset.', 'warning');
    }
    if (typeof renderTaskList === 'function') renderTaskList();
}

// -------------------------------------------------------------
// X (TWITTER) AUTH SIMULATOR OVERLAYS
// -------------------------------------------------------------
function openConnectSocialModal() {
    if (state.social.connected) {
        state.social.connected = false;
        state.social.handle = null;
        state.social.displayName = null;
        state.social.avatar = null;
        
        document.getElementById('socialText').innerText = 'Connect X Account';
        showToast('X (Twitter) account disconnected.', 'warning');
        
        if (typeof renderTaskList === 'function') renderTaskList();
        return;
    }
    
    const modal = document.getElementById('modalConnectSocial');
    modal.classList.add('active');
    document.getElementById('socialModalForm').style.display = 'flex';
    document.getElementById('socialModalLoading').style.display = 'none';
}

function closeConnectSocialModal() {
    document.getElementById('modalConnectSocial').classList.remove('active');
}

function simulateSocialAuth() {
    const handleInput = document.getElementById('socialXHandle').value.trim();
    if (!handleInput) {
        showToast('Please enter a valid X username.', 'error');
        return;
    }
    
    document.getElementById('socialModalForm').style.display = 'none';
    document.getElementById('socialModalLoading').style.display = 'flex';
    
    setTimeout(() => {
        state.social.connected = true;
        state.social.handle = handleInput;
        state.social.displayName = handleInput.charAt(0).toUpperCase() + handleInput.slice(1);
        state.social.avatar = `https://api.dicebear.com/7.x/identicon/svg?seed=${handleInput}`;
        
        document.getElementById('socialText').innerText = `@${handleInput}`;
        
        closeConnectSocialModal();
        showToast(`@${handleInput} Twitter account linked successfully!`, 'success');
        
        if (typeof renderTaskList === 'function') renderTaskList();
    }, 1500);
}

// -------------------------------------------------------------
// INTERACTIVE STATS & LEADERS RENDERERS
// -------------------------------------------------------------
function renderStats() {
    document.getElementById('statTotalPaid').innerText = `${state.stats.totalPaid.toLocaleString()} $EARN`;
    document.getElementById('statCompleted').innerText = `${state.stats.completedTasks.toLocaleString()} Tasks`;
    document.getElementById('statActiveUsers').innerText = `${state.stats.activeUsers.toLocaleString()} Users`;
    document.getElementById('statTokenPrice').innerText = `${state.stats.tokenPriceSOL.toFixed(6)} SOL`;
    document.getElementById('statPriceChange').innerText = `▲ %${state.stats.priceChange24h.toFixed(2)}`;
}

function renderLeaderboards() {
    const workersBody = document.getElementById('workersLeaderboardBody');
    const creatorsBody = document.getElementById('creatorsLeaderboardBody');
    
    if (workersBody) {
        workersBody.innerHTML = '';
        state.leaderboards.workers.forEach(w => {
            const tr = document.createElement('tr');
            tr.className = 'leaderboard-row';
            tr.innerHTML = `
                <td class="leaderboard-rank top-${w.rank}">${w.rank}</td>
                <td>
                    <div class="leaderboard-user">
                        <div class="creator-avatar" style="background: radial-gradient(circle, var(--secondary) 0%, var(--primary) 100%);"></div>
                        <div>
                            <div style="font-weight: 700;">@${w.name}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">${w.address}</div>
                        </div>
                    </div>
                </td>
                <td style="text-align: right; font-weight: 700; color: var(--secondary);">${w.earnings.toLocaleString()} $EARN</td>
            `;
            workersBody.appendChild(tr);
        });
    }
    
    if (creatorsBody) {
        creatorsBody.innerHTML = '';
        state.leaderboards.creators.forEach(c => {
            const tr = document.createElement('tr');
            tr.className = 'leaderboard-row';
            tr.innerHTML = `
                <td class="leaderboard-rank top-${c.rank}">${c.rank}</td>
                <td>
                    <div class="leaderboard-user">
                        <div class="creator-avatar" style="background: radial-gradient(circle, var(--primary) 0%, var(--accent) 100%);"></div>
                        <div>
                            <div style="font-weight: 700;">${c.name}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">${c.address}</div>
                        </div>
                    </div>
                </td>
                <td style="text-align: right; font-weight: 700; color: var(--primary);">${c.lockedSOL.toFixed(1)} SOL</td>
            `;
            creatorsBody.appendChild(tr);
        });
    }
}

// -------------------------------------------------------------
// LIVE ACTIVITY FEED TICKER SIMULATOR
// -------------------------------------------------------------
function initLiveActivityTicker() {
    const ticker = document.getElementById('liveActivityTicker');
    if (!ticker) return;
    
    for (let i = 0; i < 4; i++) {
        addTickerEvent(true);
    }
    
    setInterval(() => {
        addTickerEvent(false);
    }, 4500);
}

function addTickerEvent(isInitial = false) {
    const ticker = document.getElementById('liveActivityTicker');
    if (!ticker) return;
    
    const randomUser = mockTickNames[Math.floor(Math.random() * mockTickNames.length)];
    const randomTask = mockTickTasks[Math.floor(Math.random() * mockTickTasks.length)];
    
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.justifyContent = 'space-between';
    div.style.padding = '0.5rem 1rem';
    div.style.background = 'rgba(255, 255, 255, 0.02)';
    div.style.borderRadius = '8px';
    div.style.border = '1px solid rgba(255, 255, 255, 0.04)';
    div.style.fontSize = '0.85rem';
    div.style.animation = 'fadeIn 0.4s ease-out';
    
    let badgeColor = 'var(--secondary)';
    if (randomTask.type === 'like') badgeColor = 'var(--accent)';
    if (randomTask.type === 'repost') badgeColor = 'var(--primary)';
    if (randomTask.type === 'feedback') badgeColor = 'var(--text-warning)';
    
    div.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div class="creator-avatar" style="width: 18px; height: 18px; background: radial-gradient(circle, var(--primary) 0%, var(--secondary) 100%);"></div>
            <span><b style="color: var(--text-primary);">@${randomUser}</b>, <span style="color: var(--text-muted);">${randomTask.desc}</span></span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-weight: 700; color: ${badgeColor};">${randomTask.reward}</span>
            <span style="font-size: 0.75rem; color: var(--text-muted); opacity: 0.7;">just now</span>
        </div>
    `;
    
    if (isInitial) {
        ticker.appendChild(div);
    } else {
        ticker.insertBefore(div, ticker.firstChild);
        if (ticker.childNodes.length > 5) {
            ticker.removeChild(ticker.lastChild);
        }
        
        state.stats.totalPaid += parseInt(randomTask.reward);
        state.stats.completedTasks += 1;
        
        const change = (Math.random() - 0.45) * 0.000005;
        state.stats.tokenPriceSOL = Math.max(0.00001, state.stats.tokenPriceSOL + change);
        
        const extraSOL = Math.random() * 0.15;
        state.stats.totalSOLInvested += extraSOL;
        state.stats.bondingCurvePercent = Math.min(99.9, (state.stats.totalSOLInvested / state.stats.raydiumThresholdSOL) * 100);
        
        renderStats();
        
        const bFill = document.getElementById('bondingCurveProgressFill');
        const bText = document.getElementById('bondingCurvePercentText');
        const bRemain = document.getElementById('bondingRemainingText');
        
        if (bFill) bFill.style.width = `${state.stats.bondingCurvePercent.toFixed(1)}%`;
        if (bText) bText.innerText = `${state.stats.bondingCurvePercent.toFixed(1)}%`;
        if (bRemain) {
            const remain = Math.max(0, state.stats.raydiumThresholdSOL - state.stats.totalSOLInvested);
            bRemain.innerText = `${remain.toLocaleString(undefined, {maximumFractionDigits: 0})} SOL`;
        }
    }
}

// -------------------------------------------------------------
// CUSTOM TOAST NOTIFICATIONS
// -------------------------------------------------------------
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'check-circle';
    if (type === 'error') icon = 'x-circle';
    if (type === 'warning') icon = 'alert-triangle';
    
    toast.innerHTML = `
        <i data-lucide="${icon}" style="width: 18px; color: inherit;"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    lucide.createIcons();
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, 4000);
}

// -------------------------------------------------------------
// INTERACTIVE FAQ ACCORDION ENGINE
// -------------------------------------------------------------
function toggleFaqAccordion(button) {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    faqItem.parentElement.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// -------------------------------------------------------------
// VAULT REVENUE SHARE TERMINAL SIMULATORS
// -------------------------------------------------------------
let countdownInterval = null;

function startVaultCountdown() {
    const countdownEl = document.getElementById('vaultCountdownText');
    const dateEl = document.getElementById('vaultNextDateText');
    if (!countdownEl) return;
    
    let targetTime = Date.now() + 10 * 3600 * 1000 + 54 * 60 * 1000 + 39 * 1000;
    
    const targetDate = new Date(targetTime);
    const day = targetDate.getDate() < 10 ? '0' + targetDate.getDate() : targetDate.getDate();
    const month = (targetDate.getMonth() + 1) < 10 ? '0' + (targetDate.getMonth() + 1) : (targetDate.getMonth() + 1);
    const yr = targetDate.getFullYear();
    const hr = targetDate.getHours() < 10 ? '0' + targetDate.getHours() : targetDate.getHours();
    const min = targetDate.getMinutes() < 10 ? '0' + targetDate.getMinutes() : targetDate.getMinutes();
    const sec = targetDate.getSeconds() < 10 ? '0' + targetDate.getSeconds() : targetDate.getSeconds();
    
    if (dateEl) dateEl.innerText = `${month}/${day}/${yr} ${hr}:${min}:${sec}`;
    
    if (countdownInterval) clearInterval(countdownInterval);
    
    countdownInterval = setInterval(() => {
        const remain = targetTime - Date.now();
        if (remain <= 0) {
            targetTime = Date.now() + 12 * 3600 * 1000;
            return;
        }
        
        const hrs = Math.floor(remain / (3600 * 1000));
        const mins = Math.floor((remain % (3600 * 1000)) / (60 * 1000));
        const secs = Math.floor((remain % (60 * 1000)) / 1000);
        
        const hrsStr = hrs < 10 ? '0' + hrs : hrs;
        const minsStr = mins < 10 ? '0' + mins : mins;
        const secsStr = secs < 10 ? '0' + secs : secs;
        
        countdownEl.innerText = `${hrsStr}:${minsStr}:${secsStr}`;
    }, 1000);
}

function drawVaultReturnTrendChart() {
    const svg = document.getElementById('vaultReturnBarChart');
    if (!svg) return;
    
    svg.innerHTML = '';
    
    const w = svg.clientWidth || 400;
    const h = svg.clientHeight || 200;
    
    const paddingLeft = 10;
    const paddingRight = 10;
    const paddingTop = 15;
    const paddingBottom = 20;
    
    const chartW = w - paddingLeft - paddingRight;
    const chartH = h - paddingTop - paddingBottom;
    
    const returnData = [
        0.06, 0.07, 0.11, 0.09, 0.08, 0.15, 0.04, 0.05, 0.07, 0.11, 
        0.10, 0.08, 0.11, 0.04, 0.04, 0.12, 0.12, 0.10, 0.12, 0.07, 
        0.12, 0.19, 0.15, 0.09, 0.10, 0.14, 0.32, 0.28, 0.19, 0.19
    ];
    
    const maxVal = 0.35;
    const barSpacing = chartW / returnData.length;
    const barWidth = barSpacing * 0.65;
    
    returnData.forEach((val, i) => {
        const barH = chartH * (val / maxVal);
        const x = paddingLeft + (i * barSpacing) + (barSpacing - barWidth) / 2;
        const y = paddingTop + chartH - barH;
        
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', barWidth);
        rect.setAttribute('height', barH);
        rect.setAttribute('fill', 'var(--text-success)');
        rect.setAttribute('rx', '1');
        
        rect.addEventListener('mouseenter', () => {
            rect.setAttribute('fill', 'var(--secondary)');
        });
        rect.addEventListener('mouseleave', () => {
            rect.setAttribute('fill', 'var(--text-success)');
        });
        
        svg.appendChild(rect);
    });
    
    const tStart = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    tStart.setAttribute('x', paddingLeft + 5);
    tStart.setAttribute('y', h - 4);
    tStart.setAttribute('fill', 'var(--text-muted)');
    tStart.setAttribute('font-size', '0.65rem');
    tStart.setAttribute('font-weight', '600');
    tStart.textContent = '3 May';
    svg.appendChild(tStart);
    
    const tEnd = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    tEnd.setAttribute('x', w - paddingRight - 35);
    tEnd.setAttribute('y', h - 4);
    tEnd.setAttribute('fill', 'var(--text-muted)');
    tEnd.setAttribute('font-size', '0.65rem');
    tEnd.setAttribute('font-weight', '600');
    tEnd.textContent = '1 Jun';
    svg.appendChild(tEnd);
}

const dbVaultPreviews = [
    { wallet: 'Gmsr...wCY', amount: '116.20 M', eligible: 'LP', share: '36.9875%' },
    { wallet: '757k...6MR', amount: '44.00 M', eligible: 'NO', share: '0.0000%' },
    { wallet: 'AUVA...2LG', amount: '35.10 M', eligible: 'YES', share: '36.9875%' },
    { wallet: 'HF2L...AT3', amount: '33.30 M', eligible: 'NO', share: '0.0000%' },
    { wallet: '6meK...HJB', amount: '28.40 M', eligible: 'NO', share: '0.0000%' }
];

function renderVaultPreviews() {
    const body = document.getElementById('vaultPreviewDistributionBody');
    if (!body) return;
    
    body.innerHTML = '';
    dbVaultPreviews.forEach(item => {
        const tr = document.createElement('tr');
        tr.className = 'leaderboard-row';
        
        let elBadge = '';
        if (item.eligible === 'LP') elBadge = '<span class="vault-badge-LP">LP</span> <span class="vault-badge-no" style="margin-left: 2px;">NO</span>';
        else if (item.eligible === 'YES') elBadge = '<span class="vault-badge-yes">YES</span>';
        else elBadge = '<span class="vault-badge-no">NO</span>';
        
        tr.innerHTML = `
            <td><code style="color: var(--secondary); font-weight: 600;">${item.wallet}</code></td>
            <td style="font-weight: 700; color: var(--text-primary);">${item.amount}</td>
            <td>${elBadge}</td>
            <td style="text-align: right; font-weight: 700; color: var(--primary);">${item.share}</td>
        `;
        body.appendChild(tr);
    });
}

const dbVaultContributions = [
    { time: '1m ago', amount: '2.40 $EARN', job: '#a9e96dc0', reason: 'Worker completed task (Commission)' },
    { time: '2m ago', amount: '1.00 $EARN', job: '#c123df10', reason: 'Worker completed task (Commission)' },
    { time: '3m ago', amount: '3.00 $EARN', job: '#e23d9b01', reason: 'Worker completed task (Commission)' },
    { time: '4m ago', amount: '4.00 $EARN', job: '#b4819d20', reason: 'Worker completed task (Commission)' },
    { time: '5m ago', amount: '2.40 $EARN', job: '#a9e96dc0', reason: 'Worker completed task (Commission)' }
];

function renderVaultContributions() {
    const body = document.getElementById('vaultContributionsBody');
    if (!body) return;
    
    body.innerHTML = '';
    dbVaultContributions.forEach(c => {
        const tr = document.createElement('tr');
        tr.className = 'leaderboard-row';
        tr.innerHTML = `
            <td style="color: var(--text-muted); font-size: 0.85rem;">${c.time}</td>
            <td style="font-weight: 700; color: var(--text-success);">${c.amount}</td>
            <td><code style="color: var(--secondary); font-weight: 600;">${c.job}</code></td>
            <td style="font-size: 0.85rem; color: var(--text-muted);">${c.reason}</td>
        `;
        body.appendChild(tr);
    });
}

async function fetchVaultStatus() {
    try {
        const res = await fetch(`${API_BASE}/api/vault`);
        const data = await res.json();
        if (data.success) {
            // Update balance UI
            const bal = data.vault.balance;
            const balanceEl = document.getElementById('vaultBalanceText');
            if (balanceEl) balanceEl.innerText = `${bal.toLocaleString(undefined, {minimumFractionDigits: 2})} $EARN`;
            
            const usdEl = document.getElementById('vaultBalanceUSD');
            if (usdEl) usdEl.innerText = `$${(bal * 0.000242).toLocaleString(undefined, {minimumFractionDigits: 2})}`;
            
            // Sync contributions list
            dbVaultContributions.length = 0;
            dbVaultContributions.push(...data.vault.contributions);
            renderVaultContributions();
        }
    } catch (e) {
        console.error("Error fetching vault status:", e);
    }
}

function handleVaultCheck() {
    const address = document.getElementById('vaultCheckAddress').value.trim();
    const result = document.getElementById('vaultCheckResult');
    if (!address) {
        showToast('Please enter a valid Solana wallet address.', 'error');
        return;
    }
    
    result.style.display = 'block';
    const isUserConnectedWallet = state.wallet.connected && address === state.wallet.address;
    
    if (isUserConnectedWallet || address.startsWith('om8R') || address.length > 30) {
        result.innerHTML = `
            <div class="glass-card" style="padding: 1.25rem; border: 1px solid var(--text-success); background: rgba(16, 185, 129, 0.03); display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); display: flex; align-items: center; justify-content: center; color: var(--text-success); font-weight: 700;">✓</div>
                    <div>
                        <div style="font-weight: 700; color: var(--text-success);">Your Wallet is Eligible! (Eligible)</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">Your current wallet balance meets the Vault snapshot rules.</div>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 0.8rem; color: var(--text-muted);">Share Rate:</div>
                    <div style="font-size: 1.15rem; font-weight: 800; color: var(--primary);">0.0482% (Estimated)</div>
                </div>
            </div>
        `;
        showToast('Wallet check completed. Congratulations, you are eligible for the Vault yield!', 'success');
    } else {
        result.innerHTML = `
            <div class="glass-card" style="padding: 1.25rem; border: 1px solid var(--text-error); background: rgba(239, 68, 68, 0.03); display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(239, 68, 68, 0.15); display: flex; align-items: center; justify-content: center; color: var(--text-error); font-weight: 700;">✖</div>
                    <div>
                        <div style="font-weight: 700; color: var(--text-error);">Wallet is not eligible (Ineligible)</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">Does not meet the minimum $EARN holding requirement (100,000 $EARN).</div>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 0.8rem; color: var(--text-muted);">Share Rate:</div>
                    <div style="font-size: 1.15rem; font-weight: 800; color: var(--text-error);">%0.0000</div>
                </div>
            </div>
        `;
        showToast('Wallet check completed. Your wallet does not meet Vault eligibility criteria.', 'error');
    }
}

function handleVaultClear() {
    document.getElementById('vaultCheckAddress').value = '';
    const result = document.getElementById('vaultCheckResult');
    if (result) {
        result.style.display = 'none';
        result.innerHTML = '';
    }
}

// -------------------------------------------------------------
// CAMPAIGN CREATOR PRESETS & QUALITY FILTER ACTIONS
// -------------------------------------------------------------
function toggleQuickJobsAccordion() {
    const acc = document.getElementById('quickJobsAccordion');
    const chevron = document.getElementById('quickJobsChevron');
    const isActive = acc.classList.contains('active');
    
    if (isActive) {
        acc.classList.remove('active');
        chevron.style.transform = 'rotate(0deg)';
    } else {
        acc.classList.add('active');
        chevron.style.transform = 'rotate(180deg)';
    }
}

// Auto-fills Campaign Form based on quick job selections
function applyQuickJobPreset(preset) {
    const taskType = document.getElementById('taskType');
    const taskTitle = document.getElementById('taskTitle');
    const taskLink = document.getElementById('taskLink');
    const rewardPerUser = document.getElementById('rewardPerUser');
    const maxParticipants = document.getElementById('maxParticipants');
    
    switch(preset) {
        case 'follow_std':
            taskType.value = 'follow';
            taskTitle.value = 'Official X Account Follow (Standard)';
            taskLink.value = 'https://x.com/earndotcool';
            rewardPerUser.value = '100';
            maxParticipants.value = '250';
            selectQualityFilter('all');
            break;
            
        case 'follow_ver':
            taskType.value = 'follow';
            taskTitle.value = 'Verified (Blue Tick) X Followers Campaign';
            taskLink.value = 'https://x.com/earndotcool';
            rewardPerUser.value = '120';
            maxParticipants.value = '200';
            selectQualityFilter('verified');
            break;
            
        case 'raid_ver':
            taskType.value = 'repost';
            taskTitle.value = 'Verified (Blue Tick) X Raid Task (Repost & Like)';
            taskLink.value = 'https://x.com/earndotcool/status/179920199';
            rewardPerUser.value = '150';
            maxParticipants.value = '150';
            selectQualityFilter('verified');
            break;
            
        case 'raid_std':
            taskType.value = 'repost';
            taskTitle.value = 'Standard X Raid Task (Quick Engagement)';
            taskLink.value = 'https://x.com/earndotcool/status/179920199';
            rewardPerUser.value = '80';
            maxParticipants.value = '300';
            selectQualityFilter('all');
            break;
            
        case 'raid_sorsa':
            taskType.value = 'repost';
            taskTitle.value = 'Sorsa Score > 0 Secure Account Raid';
            taskLink.value = 'https://x.com/earndotcool/status/179920199';
            rewardPerUser.value = '115';
            maxParticipants.value = '200';
            selectQualityFilter('sorsa');
            break;
            
        case 'repost':
            taskType.value = 'repost';
            taskTitle.value = 'Tweet Repost Task';
            taskLink.value = 'https://x.com/earndotcool/status/179920192';
            rewardPerUser.value = '60';
            maxParticipants.value = '400';
            selectQualityFilter('all');
            break;
            
        case 'likes':
            taskType.value = 'like';
            taskTitle.value = 'Tweet Like Task';
            taskLink.value = 'https://x.com/earndotcool/status/179920192';
            rewardPerUser.value = '40';
            maxParticipants.value = '500';
            selectQualityFilter('all');
            break;
            
        case 'bookmarks':
            taskType.value = 'like';
            taskTitle.value = 'Tweet Bookmark Task';
            taskLink.value = 'https://x.com/earndotcool/status/179920192';
            rewardPerUser.value = '50';
            maxParticipants.value = '300';
            selectQualityFilter('all');
            break;
            
        case 'comments':
            taskType.value = 'feedback';
            taskTitle.value = 'X Tweet Comment Task';
            taskLink.value = 'https://x.com/earndotcool/status/179920192';
            rewardPerUser.value = '90';
            maxParticipants.value = '200';
            selectQualityFilter('all');
            break;
    }
    
    updateFormPlaceholders();
    calculateCampaignCost();
    showToast('Quick job preset template loaded!', 'success');
}

function selectQualityFilter(type) {
    document.getElementById('campaignQualityFilter').value = type;
    
    // Toggle active state on buttons
    document.querySelectorAll('.quality-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.getElementById(`qBtn-${type}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    calculateCampaignCost();
}

// -------------------------------------------------------------
// CYBER WATCHER MASCOT (FOLLOWING EYES & AI CHAT) LOGIC
// -------------------------------------------------------------
function initCyberWatcher() {
    const watcher = document.getElementById('cyberWatcher');
    const leftPupil = document.getElementById('pupil-left');
    const rightPupil = document.getElementById('pupil-right');
    const tooltip = document.getElementById('watcherTooltip');
    const watcherInner = document.getElementById('cyberWatcherInner');
    const chatWindow = document.getElementById('watcherChatWindow');

    if (!watcher || !leftPupil || !rightPupil || !watcherInner || !chatWindow) return;

    // 1. Intro Center Animation Flow: Smoothly slide to bottom right after a delay or on scroll
    const exitIntroCenter = () => {
        if (watcher.classList.contains('intro-center')) {
            watcher.classList.remove('intro-center');
            if (tooltip) tooltip.innerText = "🤖 Cyber Watcher: ONLINE. Click me!";
        }
    };

    setTimeout(exitIntroCenter, 3800); // 3.8s center stage presentation
    window.addEventListener('scroll', exitIntroCenter, { once: true });

    // 2. Click Mascot to Toggle Chat Window
    watcherInner.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // If it's still in the center intro stage, send it down immediately
        if (watcher.classList.contains('intro-center')) {
            exitIntroCenter();
            return;
        }

        // Toggle chat active state
        chatWindow.classList.toggle('active');
        
        // Hide standard tooltip when chat is active
        if (chatWindow.classList.contains('active')) {
            tooltip.style.opacity = '0';
            tooltip.style.pointerEvents = 'none';
        } else {
            tooltip.style.opacity = '';
            tooltip.style.pointerEvents = '';
        }

        // Mascot interactive feedback animation
        watcherInner.style.transform = 'scale(1.2) rotate(360deg)';
        setTimeout(() => {
            watcherInner.style.transform = '';
        }, 600);
    });

    // Close chat if clicked anywhere outside the widget
    document.addEventListener('click', (e) => {
        if (!watcher.contains(e.target)) {
            chatWindow.classList.remove('active');
            tooltip.style.opacity = '';
            tooltip.style.pointerEvents = '';
        }
    });

    // 3. Track Mouse movements to calculate pupil offsets (Dynamic Eye Vectoring)
    document.addEventListener('mousemove', (e) => {
        const leftEye = leftPupil.parentElement;
        const rightEye = rightPupil.parentElement;

        if (!leftEye || !rightEye) return;

        updatePupil(e, leftEye, leftPupil);
        updatePupil(e, rightEye, rightPupil);
    });

    function updatePupil(e, eye, pupil) {
        const rect = eye.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;

        const dx = e.clientX - eyeCenterX;
        const dy = e.clientY - eyeCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Max translation distance inside the eye white (usually ~4-5px)
        const maxLimit = 5; 
        
        const angle = Math.atan2(dy, dx);
        const px = Math.min(maxLimit, dist * 0.05) * Math.cos(angle);
        const py = Math.min(maxLimit, dist * 0.05) * Math.sin(angle);

        pupil.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px))`;
    }
}

// 4. Chat Sending & Rendering Engine with Groq AI integration
window.sendChatMessage = async function() {
    const input = document.getElementById('chatInput');
    const body = document.getElementById('chatBody');
    if (!input || !body) return;
    
    const text = input.value.trim();
    if (!text) return;
    
    // Render user message locally
    appendChatMessage('user', text);
    input.value = '';
    
    // Show typing status indicator
    const typingId = 'typing-' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.id = typingId;
    typingDiv.className = 'chat-typing-indicator';
    typingDiv.innerHTML = `<span>🤖 Cyber Watcher is compiling response...</span>`;
    body.appendChild(typingDiv);
    body.scrollTop = body.scrollHeight;
    
    try {
        // Send request to Express back-end
        const response = await fetch(`${API_BASE}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        
        const data = await response.json();
        
        // Remove typing indicator
        const indicator = document.getElementById(typingId);
        if (indicator) indicator.remove();
        
        if (data.success && data.reply) {
            appendChatMessage('bot', data.reply);
        } else {
            appendChatMessage('bot', "🤖 Beep... boop... connection block in the siber-matrix. Please try again!");
        }
    } catch (e) {
        console.error(e);
        const indicator = document.getElementById(typingId);
        if (indicator) indicator.remove();
        appendChatMessage('bot', "🤖 Connection failed. Make sure the backend service is reachable!");
    }
}

function appendChatMessage(sender, text) {
    const body = document.getElementById('chatBody');
    if (!body) return;
    
    const div = document.createElement('div');
    div.className = `chat-message ${sender}`;
    
    // Basic Markdown Parser (converts **text** to bold and \n to line breaks)
    let parsedHtml = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
        
    div.innerHTML = parsedHtml;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight; // Auto-scroll
}

// Self-initialize once DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCyberWatcher);
} else {
    initCyberWatcher();
}

