import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, Connection } from '@solana/web3.js';

const API = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? '/api' 
    : 'https://earnc00l.up.railway.app/api';

// Modal controls
const openCreateTaskModalBtn = document.getElementById('openCreateTaskModal');
const createTaskModal = document.getElementById('createTaskModal');
const closeModalBtn = createTaskModal?.querySelector('.close-modal');

openCreateTaskModalBtn?.addEventListener('click', () => {
    createTaskModal.classList.remove('hidden');
});

closeModalBtn?.addEventListener('click', () => {
    createTaskModal.classList.add('hidden');
});

// Render Tasks
async function renderActiveTasks() {
    try {
        const response = await fetch(`${API}/tasks`);
        const data = await response.json();
        
        const tasksList = document.getElementById('tasksContainer');
        if (!tasksList) return;
        tasksList.innerHTML = '';
        
        if (!data.tasks || data.tasks.length === 0) {
            tasksList.innerHTML = `<div class="empty-state">No active tasks at the moment. Create one above!</div>`;
            return;
        }

        data.tasks.forEach(task => {
            if(task.status !== 'active') return;

            const taskCard = document.createElement('div');
            taskCard.className = 'task-card fade-in';
            
            taskCard.innerHTML = `
                <div class="task-info">
                    <span class="task-type">${task.type.toUpperCase()}</span>
                    <h3 class="task-title">${task.title}</h3>
                    <p class="task-meta">By ${task.creator} • ${task.completedCount}/${task.capacity} Participants</p>
                </div>
                <div class="task-reward">
                    <span class="reward-amount">+${Math.floor(task.rewardEarnRaw / 1e6)}</span>
                    <span class="reward-currency">$EARN</span>
                </div>
            `;
            
            tasksList.appendChild(taskCard);
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

// Create Task Flow
document.getElementById('createTaskForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!window.appState.wallet) {
        alert("Please connect your wallet first!");
        return;
    }

    const type = document.getElementById('taskType').value;
    const link = document.getElementById('taskLink').value;
    const budget = parseFloat(document.getElementById('taskBudget').value);

    if (!link || !budget || budget < 1) {
        alert("Please enter a valid link and minimum $1 budget.");
        return;
    }

    const submitBtn = document.getElementById('createTaskSubmitBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="ri-loader-4-line spin"></i> Creating...';

    try {
        // 1. Get transfer intent
        const createRes = await fetch(`${API}/tasks/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                task: { type, title: `Interact with ${link}`, link },
                creatorAddress: window.appState.wallet,
                usdBudget: budget
            })
        });

        const createData = await createRes.json();
        if (!createData.success) throw new Error(createData.error);
        
        submitBtn.innerHTML = '<i class="ri-fingerprint-line"></i> Please Sign in Wallet';

        // 2. Build Transaction
        const connection = new Connection("https://api.mainnet-beta.solana.com");
        const fromPubkey = new PublicKey(window.appState.wallet);
        const toPubkey = new PublicKey(createData.treasuryAddress);
        const lamports = Math.floor(createData.solAmount * LAMPORTS_PER_SOL);

        const transaction = new Transaction().add(
            SystemProgram.transfer({ fromPubkey, toPubkey, lamports })
        );

        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = fromPubkey;

        // 3. Sign and Send (Phantom vs MetaMask)
        let signature;
        
        if (window.appState.walletType === 'metamask') {
            submitBtn.innerHTML = '<i class="ri-loader-4-line spin"></i> Sending via MetaMask...';
            const response = await window.appState.mmClient.signAndSendTransaction(transaction);
            signature = response.signature;
        } else {
            // Phantom Native
            const signedTransaction = await window.solana.signTransaction(transaction);
            submitBtn.innerHTML = '<i class="ri-loader-4-line spin"></i> Confirming on Chain...';
            signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
                skipPreflight: false,
                maxRetries: 2
            });
        }

        // 4. Confirm with Backend
        submitBtn.innerHTML = '<i class="ri-loader-4-line spin"></i> Finalizing Auto-Buy...';
        
        const confirmRes = await fetch(`${API}/tasks/confirm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                taskId: createData.taskId,
                txSignature: signature
            })
        });

        const confirmData = await confirmRes.json();
        if (!confirmData.success) throw new Error(confirmData.error);

        alert("Task Created successfully! " + confirmData.message);
        
        // Reset Form
        document.getElementById('taskLink').value = '';
        document.getElementById('taskBudget').value = '';
        createTaskModal.classList.add('hidden');
        renderActiveTasks();

    } catch (error) {
        console.error(error);
        alert(`Transaction failed: ${error.message}`);
    } finally {
        submitBtn.innerHTML = originalText;
    }
});

// Initial load
renderActiveTasks();
