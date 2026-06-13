// ==========================================
// earn.cool v2 - Tasks & Swap Logic
// ==========================================

const API = '/api';

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    setupCreateTaskForm();
});

// ------------------------------------------
// Load Tasks
// ------------------------------------------
async function loadTasks() {
    const container = document.getElementById('tasksContainer');
    try {
        const res = await fetch(`${API}/tasks`);
        const data = await res.json();
        
        if (data.success) {
            renderTasks(data.tasks);
        }
    } catch (err) {
        container.innerHTML = `<div class="empty-state text-danger">Failed to load tasks.</div>`;
    }
}

function renderTasks(tasks) {
    const container = document.getElementById('tasksContainer');
    
    // Filter active tasks only
    const activeTasks = tasks.filter(t => t.status !== 'pending_payment');
    
    if (activeTasks.length === 0) {
        container.innerHTML = `<div class="empty-state">No tasks created today yet. Be the first!</div>`;
        return;
    }
    
    container.innerHTML = activeTasks.map(task => `
        <div class="task-card">
            <div class="task-info">
                <div class="task-icon">
                    <i class="${getIconForType(task.type)}"></i>
                </div>
                <div class="task-details">
                    <h4>${task.title || 'Complete Social Task'}</h4>
                    <div class="task-meta">
                        <span><i class="ri-link"></i> ${task.type.toUpperCase()}</span>
                        <span><i class="ri-user-smile-line"></i> ${task.completedCount}/${task.capacity} Users</span>
                    </div>
                </div>
            </div>
            <div class="task-reward">
                <span class="reward-amount">+${formatNumber(task.rewardEarnRaw ? task.rewardEarnRaw / 1e6 : 100)} EARN</span>
                <button class="btn-outline" style="padding: 0.35rem 1rem; margin-top: 0.5rem;" onclick="window.open('${task.link}', '_blank')">Do Task</button>
            </div>
        </div>
    `).join('');
}

function getIconForType(type) {
    if (type === 'follow') return 'ri-user-add-line';
    if (type === 'like') return 'ri-heart-line text-danger';
    if (type === 'repost') return 'ri-repeat-2-line text-accent';
    return 'ri-links-line';
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num);
}

// ------------------------------------------
// Create Task & Web3 Swap Flow
// ------------------------------------------
function setupCreateTaskForm() {
    const form = document.getElementById('createTaskForm');
    const budgetInput = document.getElementById('taskBudget');
    const quoteSummary = document.getElementById('quoteSummary');
    const quoteSol = document.getElementById('quoteSol');
    const quoteEarn = document.getElementById('quoteEarn');
    
    // Live Quote Preview
    budgetInput.addEventListener('input', () => {
        const usd = parseFloat(budgetInput.value);
        if (isNaN(usd) || usd <= 0) {
            quoteSummary.classList.add('hidden');
            return;
        }
        
        if (window.appState && window.appState.solPriceUsd && window.appState.earnPriceUsd) {
            const sol = usd / window.appState.solPriceUsd;
            const earn = usd / window.appState.earnPriceUsd;
            
            quoteSol.innerText = `${sol.toFixed(4)} SOL`;
            quoteEarn.innerText = `${formatNumber(earn)} $EARN`;
            quoteSummary.classList.remove('hidden');
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!window.appState || !window.appState.wallet) {
            alert("Please connect your wallet first!");
            return;
        }

        const type = document.getElementById('taskType').value;
        const link = document.getElementById('taskLink').value;
        const budget = parseFloat(document.getElementById('taskBudget').value);
        const submitBtn = document.getElementById('createTaskSubmitBtn');
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="ri-loader-4-line spin"></i> Generating Transaction...';

        try {
            // 1. Call backend to get swap transaction
            const createRes = await fetch(`${API}/tasks/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    task: { type, link, title: `New ${type} Campaign` },
                    creatorAddress: window.appState.wallet,
                    usdBudget: budget
                })
            });
            
            const createData = await createRes.json();
            if (!createData.success) throw new Error(createData.error);
            
            submitBtn.innerHTML = '<i class="ri-fingerprint-line"></i> Please Sign in Wallet';

            // 2. Generate Transfer Transaction
            const { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } = solanaWeb3;
            const connection = new solanaWeb3.Connection("https://api.mainnet-beta.solana.com");
            
            const fromPubkey = new PublicKey(window.appState.wallet);
            const toPubkey = new PublicKey(createData.treasuryAddress);
            const lamports = Math.floor(createData.solAmount * LAMPORTS_PER_SOL);

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey,
                    toPubkey,
                    lamports
                })
            );

            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = fromPubkey;

            // 3. Ask Phantom to sign and send
            const signedTransaction = await window.solana.signTransaction(transaction);
            
            submitBtn.innerHTML = '<i class="ri-loader-4-line spin"></i> Confirming on Chain...';
            
            const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
                skipPreflight: false,
                maxRetries: 2
            });

            // 4. Notify backend of confirmation
            const confirmRes = await fetch(`${API}/tasks/confirm`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    taskId: createData.taskId,
                    txSignature: signature
                })
            });
            
            const confirmData = await confirmRes.json();
            if (confirmData.success) {
                alert("Task Created Successfully! The SOL was swapped for $EARN.");
                document.getElementById('createTaskModal').classList.add('hidden');
                loadTasks(); // reload
            } else {
                throw new Error(confirmData.error);
            }

        } catch (error) {
            console.error("Task creation failed:", error);
            alert("Transaction failed or was rejected: " + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Pay with Wallet';
        }
    });
}
