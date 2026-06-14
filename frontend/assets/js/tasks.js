const state = window.state;

// Initial Mock Tasks Database
const dbTasks = [
    {
        id: 'task-1',
        type: 'follow',
        title: 'earn.cool Official X Account Follow',
        link: 'https://x.com/earndotcool',
        reward: 100,
        creator: 'earn.cool Admin',
        capacity: 1000,
        completedCount: 421,
        completedBy: [],
        verifiedOnly: false,
        minSorsa: 0
    },
    {
        id: 'task-2',
        type: 'follow',
        title: 'Verified X Followers Campaign (earn.cool Devs)',
        link: 'https://x.com/earndotcool',
        reward: 120,
        creator: 'earn.cool Devs',
        capacity: 200,
        completedCount: 45,
        completedBy: [],
        verifiedOnly: true, // Requires X Verified
        minSorsa: 0
    },
    {
        id: 'task-3',
        type: 'repost',
        title: 'Sorsa Score > 0 Secure Account Raid (Bonk Team)',
        link: 'https://x.com/earndotcool/status/179920199',
        reward: 115,
        creator: 'Bonk Official',
        capacity: 250,
        completedCount: 102,
        completedBy: [],
        verifiedOnly: false,
        minSorsa: 1 // Requires Sorsa > 0
    },
    {
        id: 'task-4',
        type: 'feedback',
        title: 'earn.cool Interface Feedback Review',
        link: 'https://earn.cool/feedback',
        reward: 200,
        creator: 'Product Manager',
        capacity: 200,
        completedCount: 45,
        completedBy: [],
        verifiedOnly: false,
        minSorsa: 0
    },
    {
        id: 'task-5',
        type: 'follow',
        title: '@solana Official Developer Account Follow',
        link: 'https://x.com/solana',
        reward: 100,
        creator: 'Solana Foundation',
        capacity: 2500,
        completedCount: 1845,
        completedBy: [],
        verifiedOnly: false,
        minSorsa: 0
    },
    {
        id: 'task-6',
        type: 'like',
        title: 'Phantom Wallet Multi-Chain Update Like',
        link: 'https://x.com/phantom/status/18892012',
        reward: 60,
        creator: 'Phantom Wallet',
        capacity: 1200,
        completedCount: 802,
        completedBy: [],
        verifiedOnly: false,
        minSorsa: 0
    }
];

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? ''
    : 'https://earnc00l.up.railway.app';

async function fetchTasks() {
    try {
        const res = await fetch(`${API_BASE}/api/tasks`);
        const data = await res.json();
        if (data.success) {
            dbTasks.length = 0;
            dbTasks.push(...data.tasks);
            renderTaskList();
        }
    } catch (error) {
        console.error("Error fetching tasks from server:", error);
    }
}

let currentFilter = 'all';

// Render Tasks Grid
function renderTaskList() {
    const grid = document.getElementById('taskListGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    // Filter tasks
    const filtered = dbTasks.filter(task => {
        if (currentFilter === 'all') return true;
        return task.type === currentFilter;
    });
    
    // Update active tasks counter in UI
    document.getElementById('activeTasksCount').innerText = filtered.length;
    
    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: span 2; text-align: center; padding: 4rem; color: var(--text-muted);">
                <i data-lucide="inbox" style="width: 48px; height: 48px; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p style="font-size: 1.1rem; font-weight: 600;">No active tasks found in this category.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }
    
    filtered.forEach(task => {
        const isCompleted = state.wallet.connected && task.completedBy.includes(state.wallet.address);
        
        const card = document.createElement('div');
        card.className = 'glass-card task-card';
        if (isCompleted) card.style.opacity = '0.6';
        
        // Quality Badge display
        let qualityBadgeHTML = '';
        if (task.verifiedOnly) {
            qualityBadgeHTML = `<span style="font-size: 0.7rem; background: rgba(29,161,242,0.12); color:#1da1f2; border:1px solid rgba(29,161,242,0.25); padding: 0.15rem 0.4rem; border-radius: 4px; font-weight:700;"><i data-lucide="badge-check" style="width: 10px; height:10px; display:inline-block; vertical-align:middle; margin-right:2px;"></i>Verified Required</span>`;
        } else if (task.minSorsa > 0) {
            qualityBadgeHTML = `<span style="font-size: 0.7rem; background: rgba(168,85,247,0.12); color:var(--primary); border:1px solid rgba(168,85,247,0.25); padding: 0.15rem 0.4rem; border-radius: 4px; font-weight:700;"><i data-lucide="shield-check" style="width: 10px; height:10px; display:inline-block; vertical-align:middle; margin-right:2px;"></i>Sorsa > 0 Required</span>`;
        }
        
        // Define action button based on state
        let actionBtnHTML = '';
        if (!state.wallet.connected) {
            actionBtnHTML = `<button class="btn btn-outline" style="font-size: 0.8rem; padding: 0.45rem 0.9rem;" onclick="openConnectWalletModal()">Connect Wallet</button>`;
        } else if (!state.social.connected) {
            actionBtnHTML = `<button class="btn btn-outline" style="font-size: 0.8rem; padding: 0.45rem 0.9rem; border-color: rgba(29, 161, 242, 0.4); color: #1da1f2;" onclick="openConnectSocialModal()">Connect X Account</button>`;
        } else if (isCompleted) {
            actionBtnHTML = `
                <button class="btn btn-outline" style="font-size: 0.8rem; padding: 0.45rem 0.9rem; background: rgba(16, 185, 129, 0.08); border-color: rgba(16, 185, 129, 0.2); color: var(--text-success); cursor: default;" disabled>
                    <i data-lucide="check" style="width: 14px;"></i> Completed
                </button>
            `;
        } else {
            actionBtnHTML = `<button class="btn btn-primary" style="font-size: 0.8rem; padding: 0.45rem 0.9rem;" onclick="openTaskDetail('${task.id}')">View Task</button>`;
        }
        
        card.innerHTML = `
            <div class="task-card-header">
                <span class="task-creator">
                    <div class="creator-avatar" style="background: radial-gradient(circle, var(--secondary) 0%, var(--primary) 100%);"></div>
                    ${task.creator}
                </span>
                <div style="display:flex; gap:0.4rem; align-items:center;">
                    ${qualityBadgeHTML}
                    <span class="task-badge ${task.type}">${getTaskTypeLabel(task.type)}</span>
                </div>
            </div>
            
            <h3 class="task-title">${task.title}</h3>
            
            <div class="task-card-bottom">
                <div class="task-reward-box">
                    <span class="task-reward-label">Reward</span>
                    <span class="task-reward-value">
                        <i data-lucide="coins" style="width: 16px; color: var(--secondary);"></i>
                        ${task.reward} $EARN
                    </span>
                </div>
                
                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.4rem;">
                    <div class="task-capacity">Entries: <span>${task.completedCount}/${task.capacity}</span></div>
                    ${actionBtnHTML}
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
    
    lucide.createIcons();
}

function getTaskTypeLabel(type) {
    switch (type) {
        case 'follow': return 'Follow';
        case 'like': return 'Like';
        case 'repost': return 'Repost';
        case 'feedback': return 'Review';
        default: return 'Task';
    }
}

function filterTasks(category, btnElement) {
    currentFilter = category;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    btnElement.classList.add('active');
    
    renderTaskList();
}

// -------------------------------------------------------------
// TASK DETAIL MODAL & DUAL METHOD PROOF FLOW
// -------------------------------------------------------------
let activeTaskId = null;
let stepActionDone = false;
let selectedProofMethod = 'oauth'; // 'oauth' or 'manual'
let simulatedTaskCode = '';
let taskCountdownInterval = null;

function closeTaskDetailModal() {
    if (taskCountdownInterval) clearInterval(taskCountdownInterval);
    document.getElementById('modalTaskDetail').classList.remove('active');
}

function toggleWurkSubmissions() {
    const listDiv = document.getElementById('wurkSubmissionsList');
    if (!listDiv) return;
    
    const task = dbTasks.find(t => t.id === activeTaskId);
    if (!task) return;
    
    if (listDiv.style.display === 'none' || listDiv.style.display === '') {
        listDiv.style.display = 'block';
        listDiv.innerHTML = `
            <div style="background: rgba(255, 255, 255, 0.01); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.25rem; margin-top: 1rem; animation: fadeIn 0.3s ease;">
                <span style="font-weight: 800; font-size: 0.9rem; display: block; margin-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.4rem;">
                    <i data-lucide="users" style="width: 14px; color: var(--secondary); vertical-align: middle; margin-right: 4px;"></i>
                    Recent Submissions (${task.completedCount})
                </span>
                <div style="display: flex; flex-direction: column; gap: 0.6rem; max-height: 180px; overflow-y: auto; font-size: 0.8rem;">
                    ${task.completedCount === 0 ? `
                        <div style="text-align: center; color: var(--text-muted); padding: 1rem 0;">No submissions yet. Be the first!</div>
                    ` : `
                        <div style="display: flex; justify-content: space-between; padding: 0.4rem 0.5rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); border-radius: 6px;">
                            <span style="color: var(--secondary); font-family: monospace;">om8R...4s9 (Siz)</span>
                            <span style="color: var(--text-success); font-weight: 700;">APPROVED</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.4rem 0.5rem; background: rgba(255,255,255,0.01); border-radius: 6px;">
                            <span style="color: var(--text-muted); font-family: monospace;">An3k...xP8</span>
                            <span style="color: var(--text-success); font-weight: 700;">APPROVED</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.4rem 0.5rem; background: rgba(255,255,255,0.01); border-radius: 6px;">
                            <span style="color: var(--text-muted); font-family: monospace;">8hN1...Kqy</span>
                            <span style="color: var(--text-success); font-weight: 700;">APPROVED</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.4rem 0.5rem; background: rgba(255,255,255,0.01); border-radius: 6px;">
                            <span style="color: var(--text-muted); font-family: monospace;">Sol_Degen</span>
                            <span style="color: var(--text-warning); font-weight: 700;">UNDER REVIEW</span>
                        </div>
                    `}
                </div>
            </div>
        `;
        lucide.createIcons();
    } else {
        listDiv.style.display = 'none';
    }
}

function executeTaskAction(link) {
    window.open(link, '_blank');
    stepActionDone = true;
    
    // 1. Hide the locked state warning
    const lockedEl = document.getElementById('verificationLockedState');
    if (lockedEl) lockedEl.style.display = 'none';
    
    // 2. Show the active proof method form
    const activeEl = document.getElementById('verificationActiveState');
    if (activeEl) activeEl.style.display = 'flex';
    
    // 3. Update verification tabs or dynamic inputs
    switchProofMethod(selectedProofMethod);
    
    // 4. Update action buttons: Hide APPLY button, Show VERIFY button!
    const btnApply = document.getElementById('btnApplyAction');
    const btnVerify = document.getElementById('btnVerifyTask');
    if (btnApply) btnApply.style.display = 'none';
    if (btnVerify) btnVerify.style.display = 'inline-flex';
    
    showToast('Task page opened! Please complete the interaction and fill out the proof form.', 'success');
}

function openTaskDetail(taskId) {
    activeTaskId = taskId;
    stepActionDone = false;
    selectedProofMethod = 'oauth';
    
    // Generate simulated tweet verification code
    const rCode = Array.from({length: 4}, () => Math.floor(Math.random()*16).toString(16).toUpperCase()).join('');
    simulatedTaskCode = `EARN-${rCode}-${Date.now().toString().slice(-4)}`;
    
    const task = dbTasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Generate simulated Listed By address from creator name
    const listedAddress = task.creator.includes('...') ? task.creator : `DaqHA9${task.creator.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6)}...VPrc`;
    
    // Initialize closes-in countdown timer
    if (taskCountdownInterval) clearInterval(taskCountdownInterval);
    let hours = Math.floor(Math.random() * 5) + 18;
    let minutes = Math.floor(Math.random() * 60);
    let seconds = Math.floor(Math.random() * 60);
    
    taskCountdownInterval = setInterval(() => {
        if (seconds > 0) {
            seconds--;
        } else {
            if (minutes > 0) {
                minutes--;
                seconds = 59;
            } else {
                if (hours > 0) {
                    hours--;
                    minutes = 59;
                    seconds = 59;
                } else {
                    clearInterval(taskCountdownInterval);
                }
            }
        }
        
        const hStr = hours < 10 ? '0' + hours : hours;
        const mStr = minutes < 10 ? '0' + minutes : minutes;
        const sStr = seconds < 10 ? '0' + seconds : seconds;
        
        const timerEl = document.getElementById('closesInTimerDisplay');
        if (timerEl) {
            timerEl.innerText = `${hStr}h ${mStr}m ${sStr}s`;
        }
    }, 1000);

    const modal = document.getElementById('modalTaskDetail');
    const content = document.getElementById('taskDetailContent');
    
    // Equivalent USD calculations
    const usdVal = (task.reward * 0.0002).toFixed(2);
    
    content.innerHTML = `
        <!-- WURK LISTED BY CARD (Image 1) -->
        <div class="wurk-listed-by-card">
            <div class="wurk-listed-by-left">
                <span class="wurk-listed-by-label">LISTED BY:</span>
                <span class="wurk-listed-by-address">${listedAddress}</span>
            </div>
            <div class="wurk-listed-by-actions">
                <button class="wurk-listed-by-action-btn" onclick="showToast('Report simulated.', 'warning')">
                    <i data-lucide="alert-triangle" style="width: 14px;"></i> Report
                </button>
                <button class="wurk-listed-by-action-btn" onclick="showToast('Developer info is in a verified Solana escrow wallet.', 'success')">
                    <i data-lucide="info" style="width: 14px;"></i> Info
                </button>
                <button class="wurk-listed-by-action-btn" onclick="showToast('Task added to bookmarks!', 'success')" style="padding: 0.4rem;">
                    <i data-lucide="bookmark" style="width: 16px;"></i>
                </button>
            </div>
        </div>

        <!-- CONFIGURATION & PARTICIPATION GRIDS (Image 1) -->
        <div class="job-meta-grid">
            <div class="job-meta-box">
                <div class="job-meta-title">
                    <i data-lucide="settings" style="width: 12px; color: var(--secondary);"></i>
                    Configuration
                </div>
                <div class="job-meta-row">
                    <span class="lbl">Status</span>
                    <span class="val" style="color: var(--text-success); display: flex; align-items: center; gap: 0.25rem;">
                        <span class="badge-dot" style="width: 6px; height: 6px;"></span> Open
                    </span>
                </div>
                <div class="job-meta-row">
                    <span class="lbl">Mode</span>
                    <span class="val">challenge</span>
                </div>
                <div class="job-meta-row">
                    <span class="lbl">Selection Type</span>
                    <span class="val">Random</span>
                </div>
                <div class="job-meta-row">
                    <span class="lbl">Closes In</span>
                    <span class="val closes-in-timer" id="closesInTimerDisplay">${hours}h ${minutes}m ${seconds}s</span>
                </div>
                <div class="job-meta-row">
                    <span class="lbl">Category</span>
                    <span class="val">others / general</span>
                </div>
            </div>
            
            <div class="job-meta-box">
                <div class="job-meta-title">
                    <i data-lucide="users" style="width: 12px; color: var(--primary);"></i>
                    Participation
                </div>
                <div class="job-meta-row">
                    <span class="lbl">Community</span>
                    <span class="val">All</span>
                </div>
                <div class="job-meta-row">
                    <span class="lbl">Max Entries</span>
                    <span class="val" id="maxEntriesDisplay">${task.capacity}</span>
                </div>
                <div class="job-meta-row">
                    <span class="lbl">Capacity</span>
                    <span class="val" id="capacityRatioDisplay">${task.completedCount} / ${task.capacity}</span>
                </div>
                <div class="job-meta-row">
                    <span class="lbl">Potential Winners</span>
                    <span class="val">${Math.floor(task.capacity * 0.8)}</span>
                </div>
                <div class="job-meta-row">
                    <span class="lbl">Winners Selected</span>
                    <span class="val">0</span>
                </div>
            </div>
        </div>

        <!-- REWARD PER WINNER BOX (Image 1) -->
        <div class="wurk-reward-card">
            <div class="wurk-reward-icon">
                $
            </div>
            <div class="wurk-reward-texts">
                <span class="wurk-reward-label">REWARD PER WINNER</span>
                <span class="wurk-reward-value">
                    ${task.reward} <span style="font-size: 1.15rem; font-weight: 700; margin-left: 0.15rem; color: var(--text-success);">$EARN</span>
                </span>
                <span class="wurk-reward-usd">$ ${usdVal} USD</span>
            </div>
        </div>

        <!-- DESCRIPTION CARD (Image 1) -->
        <div class="job-meta-box" style="margin-bottom: 1.25rem;">
            <div class="job-meta-title">
                <i data-lucide="file-text" style="width: 12px; color: var(--secondary);"></i>
                Description
            </div>
            <div style="font-size: 0.9rem; line-height: 1.6; color: var(--text-primary); text-align: left; padding: 0.25rem 0;">
                follow this x account: <a href="${task.link}" target="_blank" class="gradient-text-cyan" style="word-break: break-all; font-weight: 700;">${task.link}</a>
            </div>
            <div style="text-align: right; margin-top: 0.5rem;">
                <button class="wurk-listed-by-action-btn" onclick="showToast('Description translated!', 'success')" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">
                    <i data-lucide="globe" style="width: 12px;"></i> Translate description
                </button>
            </div>
        </div>

        <!-- INTERACTIVE VERIFICATION SYSTEM PANEL -->
        <div class="job-meta-box" style="margin-bottom: 1.25rem; border-color: rgba(168, 85, 247, 0.2); background: rgba(168, 85, 247, 0.01);" id="verificationContainerBox">
            <div class="job-meta-title" style="border-bottom-color: rgba(168,85,247,0.1); color: var(--primary);">
                <i data-lucide="shield-check" style="width: 14px; color: var(--primary);"></i>
                Proof Verification System
            </div>
            
            <div id="verificationInnerContent">
                <!-- Locked / Before Action State -->
                <div style="text-align: center; padding: 1rem 0;" id="verificationLockedState">
                    <i data-lucide="lock" style="width: 24px; height: 24px; color: var(--primary); margin-bottom: 0.5rem; opacity: 0.8;"></i>
                    <p style="font-size: 0.85rem; color: var(--text-muted); text-align: center;">Please click APPLY first to launch the task and unlock the verification steps.</p>
                </div>

                <!-- Active State (hidden initially, shown on executeTaskAction) -->
                <div style="display: none; flex-direction: column; gap: 1rem; text-align: left;" id="verificationActiveState">
                    <!-- Quality Restrictions Warn -->
                    ${task.verifiedOnly ? `
                        <div style="background: rgba(29, 161, 242, 0.04); border:1px solid rgba(29, 161, 242, 0.15); padding:0.75rem 1rem; border-radius:10px; display:flex; align-items:center; gap:0.5rem; font-size:0.85rem;">
                            <i data-lucide="badge-check" style="color:#1da1f2; width:18px;"></i>
                            <span style="color:#1da1f2;"><b>Audience Filter:</b> Only <b>Verified (Blue Check)</b> accounts can complete this task.</span>
                        </div>
                    ` : ''}
                    ${task.minSorsa > 0 ? `
                        <div style="background: rgba(168, 85, 247, 0.04); border:1px solid rgba(168, 85, 247, 0.15); padding:0.75rem 1rem; border-radius:10px; display:flex; align-items:center; gap:0.5rem; font-size:0.85rem;">
                            <i data-lucide="shield-check" style="color:var(--primary); width:18px;"></i>
                            <span style="color:var(--primary);"><b>Audience Filter:</b> Only trusted accounts with a <b>Sorsa Score > 0</b> can complete this task.</span>
                        </div>
                    ` : ''}

                    <!-- Proof Method Selection tabs -->
                    <div class="tab-buttons" style="background: rgba(255,255,255,0.02); border-color:var(--border-color);">
                        <button type="button" class="tab-btn buy active" id="proof-oauth" onclick="switchProofMethod('oauth')" style="font-size:0.8rem; padding:0.5rem; font-weight: 700;">Auto Verify (OAuth API)</button>
                        <button type="button" class="tab-btn buy" id="proof-manual" onclick="switchProofMethod('manual')" style="font-size:0.8rem; padding:0.5rem; font-weight: 700;">Verify with Tweet Code (Manual)</button>
                    </div>

                    <!-- Dynamic proof flow area -->
                    <div id="proofFlowDynamicArea">
                        <!-- Step List for standard OAuth -->
                        <div class="verify-steps" id="oauthProofSteps">
                            <div class="verify-step done" id="verifyStep1">
                                <span class="verify-step-check">✓</span>
                                <div>
                                    <div style="font-weight: 700; color: var(--text-success);">Start Task & Engage</div>
                                    <div style="font-size: 0.75rem; color: var(--text-muted);">Target page opened. Complete the interaction on X. Now complete the verification.</div>
                                </div>
                            </div>
                            
                            <div class="verify-step active" id="verifyStep2">
                                <span class="verify-step-check">2</span>
                                <div>
                                    <div style="font-weight: 700;">Verify Interaction</div>
                                    <div style="font-size: 0.75rem; color: var(--text-muted);">Launch verification once you complete the task.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- MOCK SUBMISSIONS LIST CONTAINER -->
        <div id="wurkSubmissionsList" style="display: none; margin-bottom: 1.25rem;"></div>

        <!-- SUBMISSIONS SUMMARY WARNING BANNER (Image 1) -->
        <div class="wurk-info-banner">
            <i data-lucide="alert-circle" style="width: 18px; color: #a855f7; flex-shrink: 0;"></i>
            <span>There are ${task.completedCount} submissions for this job. Submissions are hidden until the job is finalized.</span>
        </div>

        <!-- ACTION BUTTONS ROW (Image 1) -->
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;" id="taskModalActions">
            <button class="btn btn-outline" style="flex: 1; padding: 0.85rem 1.25rem; font-weight: 700;" onclick="toggleWurkSubmissions()">
                <i data-lucide="eye" style="width: 16px;"></i> VIEW SUBMISSIONS
            </button>
            
            <button class="btn btn-primary" id="btnApplyAction" style="flex: 1; padding: 0.85rem 1.25rem; font-weight: 700; background: linear-gradient(135deg, var(--secondary), #0891b2); box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);" onclick="executeTaskAction('${task.link}')">
                <i data-lucide="edit-3" style="width: 16px;"></i> APPLY
            </button>
            
            <button class="btn btn-primary" id="btnVerifyTask" style="flex: 1; display: none; padding: 0.85rem 1.25rem; font-weight: 700; background: linear-gradient(135deg, var(--primary), #8b5cf6); box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3);" onclick="verifyTaskCompletion()">
                <i data-lucide="shield-check" style="width: 16px;"></i> VERIFY
            </button>
        </div>
    `;
    
    modal.classList.add('active');
    lucide.createIcons();
}

function switchProofMethod(method) {
    selectedProofMethod = method;
    
    const pOauth = document.getElementById('proof-oauth');
    const pManual = document.getElementById('proof-manual');
    const verifyBtn = document.getElementById('btnVerifyTask');
    const dynamicArea = document.getElementById('proofFlowDynamicArea');
    
    if (method === 'oauth') {
        pOauth.className = 'tab-btn buy active';
        pManual.className = 'tab-btn buy';
        
        dynamicArea.innerHTML = `
            <div class="verify-steps" id="oauthProofSteps">
                <div class="verify-step ${stepActionDone ? 'done' : 'active'}" id="verifyStep1">
                    <span class="verify-step-check">${stepActionDone ? '✓' : '1'}</span>
                    <div>
                        <div style="font-weight: 700;">Start Task & Engage</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">Click the button below to open the target X page and complete the required task.</div>
                    </div>
                </div>
                
                <div class="verify-step ${stepActionDone ? 'active' : ''}" id="verifyStep2">
                    <span class="verify-step-check">2</span>
                    <div>
                        <div style="font-weight: 700;">Verify Interaction</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">Launch verification once you complete the task.</div>
                    </div>
                </div>
            </div>
        `;
    } else {
        pOauth.className = 'tab-btn buy';
        pManual.className = 'tab-btn buy active';
        
        dynamicArea.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:1rem;">
                <div style="background: rgba(255,255,255,0.02); border:1px solid var(--border-color); padding:1rem; border-radius:12px; display:flex; flex-direction:column; gap:0.5rem;">
                    <span style="font-size:0.8rem; color:var(--text-muted); font-weight:700;">1. POST THIS CODE AS A TWEET ON YOUR X ACCOUNT:</span>
                    <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.05); padding:0.6rem 1rem; border-radius:8px;">
                        <code style="font-weight:800; color:var(--secondary); font-size:1.05rem;">I am verifying my X profile on earn.cool with code ${simulatedTaskCode}</code>
                        <button class="btn btn-outline" style="padding:0.25rem 0.5rem; font-size:0.7rem; border-radius:4px;" onclick="navigator.clipboard.writeText('I am verifying my X profile on earn.cool with code ${simulatedTaskCode}'); showToast('Verification template copied! Share it on X.', 'success')">Copy</button>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="manualProofTweetUrl" style="font-size:0.8rem; color:var(--text-muted); font-weight:700;">2. PASTE THE TWEET LINK (URL) HERE:</label>
                    <input type="url" class="form-input" id="manualProofTweetUrl" placeholder="e.g. https://x.com/username/status/12345" oninput="checkManualProofInput()">
                </div>
            </div>
        `;
    }
    
    // Check state of verify button
    if (method === 'oauth') {
        if (stepActionDone) {
            verifyBtn.removeAttribute('disabled');
            verifyBtn.style.opacity = '1';
            verifyBtn.style.cursor = 'pointer';
        } else {
            verifyBtn.setAttribute('disabled', 'true');
            verifyBtn.style.opacity = '0.5';
            verifyBtn.style.cursor = 'not-allowed';
        }
    } else {
        checkManualProofInput();
    }
    
    lucide.createIcons();
}

function checkManualProofInput() {
    const input = document.getElementById('manualProofTweetUrl');
    const verifyBtn = document.getElementById('btnVerifyTask');
    if (!input || !verifyBtn) return;
    
    const val = input.value.trim();
    if (val.startsWith('https://x.com/') && val.includes('/status/')) {
        verifyBtn.removeAttribute('disabled');
        verifyBtn.style.opacity = '1';
        verifyBtn.style.cursor = 'pointer';
    } else {
        verifyBtn.setAttribute('disabled', 'true');
        verifyBtn.style.opacity = '0.5';
        verifyBtn.style.cursor = 'not-allowed';
    }
}

async function verifyTaskCompletion() {
    if (!activeTaskId) return;
    
    const task = dbTasks.find(t => t.id === activeTaskId);
    if (!task) return;
    
    const verificationBox = document.getElementById('verificationInnerContent');
    if (!verificationBox) return;
    
    verificationBox.innerHTML = `
        <div class="verify-flow-card" style="padding: 1rem 0;">
            <div class="loading-spinner" style="width: 42px; height: 42px; border-width: 4px; margin-bottom: 0.5rem; border-top-color: var(--primary);"></div>
            <div>
                <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.25rem;" id="verifyFlowStatus">Querying Verification Proof...</h3>
                <p style="font-size: 0.75rem; color: var(--text-muted);" id="verifyFlowSub">Connecting to Express API and performing on-chain signature matches...</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); padding: 0.75rem 1rem; border-radius: 10px; width: 100%; text-align: left; display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.8rem; color: var(--text-muted);">
                <div class="verify-step active" id="subStep1">
                    <span class="verify-step-check">•</span> Verifying profile rank and audience quality matches...
                </div>
                <div class="verify-step" id="subStep2">
                    <span class="verify-step-check">•</span> ${selectedProofMethod === 'oauth' ? 'Requesting Twitter OAuth 2.0 API interaction proof...' : 'Querying submitted Tweet verification code...'}
                </div>
                <div class="verify-step" id="subStep3">
                    <span class="verify-step-check">•</span> Releasing token earnings from platform escrow contract...
                </div>
            </div>
        </div>
    `;
    
    const btnVerify = document.getElementById('btnVerifyTask');
    if (btnVerify) btnVerify.style.display = 'none';
    
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        document.getElementById('subStep1').className = 'verify-step done';
        document.getElementById('subStep2').className = 'verify-step active';
        document.getElementById('verifyFlowSub').innerText = 'Accessing X network details to verify follow/like/repost actions...';
        
        await new Promise(resolve => setTimeout(resolve, 1200));
        document.getElementById('subStep2').className = 'verify-step done';
        document.getElementById('subStep3').className = 'verify-step active';
        document.getElementById('verifyFlowSub').innerText = 'Releasing escrow contract funds to recipient address...';
        
        const payload = {
            walletAddress: state.wallet.address,
            verifiedSim: state.userProfile.verified,
            sorsaScoreSim: state.userProfile.sorsaScore,
            proofMethod: selectedProofMethod,
            tweetUrl: selectedProofMethod === 'manual' ? document.getElementById('manualProofTweetUrl').value.trim() : ''
        };
        
        const response = await fetch(`${API_BASE}/api/tasks/${task.id}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (data.success) {
            state.wallet.balanceEARN = data.user.balanceEARN;
            updateNavbarBalance();
            
            const comm = data.commissionAdded || (task.reward * 0.02).toFixed(2);
            
            task.completedBy.push(state.wallet.address);
            task.completedCount = data.task.completedCount;
            
            if (typeof fetchVaultStatus === 'function') fetchVaultStatus();
            
            verificationBox.innerHTML = `
                <div class="verify-flow-card" style="gap: 1rem; padding: 1rem 0;">
                    <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); border: 2px solid var(--text-success); display: flex; align-items: center; justify-content: center; color: var(--text-success); font-size: 1.5rem; font-weight: 800;">
                        ✓
                    </div>
                    <div>
                        <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-success); margin-bottom: 0.4rem;">Task Verified Successfully!</h3>
                        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">
                            Congratulations, your X social interaction was verified by the platform database! <b style="color: var(--text-success);">+${task.reward} $EARN</b> was successfully credited to your wallet, and <b style="color: var(--primary);">+${comm} $EARN</b> was added to the Vault commission rewards.
                        </p>
                    </div>
                    <button class="btn btn-outline" style="width: 100%;" onclick="closeTaskDetailModal()">Close & Go to Market</button>
                </div>
            `;
            
            const capRatio = document.getElementById('capacityRatioDisplay');
            if (capRatio) capRatio.innerText = `${task.completedCount} / ${task.capacity}`;
            
            triggerTokenRainAnimation();
            showToast(`Task verified! +${task.reward} $EARN added to balance.`, 'success');
            renderTaskList();
        } else {
            verificationBox.innerHTML = `
                <div class="verify-flow-card" style="gap: 1rem; padding: 1rem 0;">
                    <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(239, 68, 68, 0.15); border: 2px solid var(--text-error); display: flex; align-items: center; justify-content: center; color: var(--text-error); font-size: 1.5rem; font-weight: 800;">
                        ✖
                    </div>
                    <div>
                        <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-error); margin-bottom: 0.4rem;">Verification Failed!</h3>
                        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">
                            <b>Error:</b> ${data.error}<br>
                            <span style="color: var(--primary); font-weight: 700; display: block; margin-top: 0.5rem;">* To pass: Adjust your simulated settings (Verified / Sorsa Score) in the navbar to match task criteria and retry!</span>
                        </p>
                    </div>
                    <button class="btn btn-outline" style="width: 100%;" onclick="closeTaskDetailModal()">Close & Return</button>
                </div>
            `;
            showToast(data.error, 'error');
        }
    } catch (err) {
        console.error(err);
        showToast("Server communication error during verification.", "error");
        closeTaskDetailModal();
    }
}

// Floating click tokens particles animation
function triggerTokenRainAnimation() {
    const container = document.body;
    const count = 35;
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `-20px`;
        
        const size = Math.random() * 8 + 8;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        const isCyan = Math.random() > 0.5;
        particle.style.setProperty('--secondary', isCyan ? '#06b6d4' : '#a855f7');
        particle.style.boxShadow = `0 0 10px ${isCyan ? '#06b6d4' : '#a855f7'}`;
        
        particle.style.animationDuration = `${Math.random() * 2 + 1.5}s`;
        particle.style.animationDelay = `${Math.random() * 0.5}s`;
        
        container.appendChild(particle);
        
        setTimeout(() => {
            container.removeChild(particle);
        }, 3500);
    }
}

// -------------------------------------------------------------
// CAMPAIGN CREATION HUB (REDESIGNED 2-STEP WIZARD)
// -------------------------------------------------------------

const TREASURY_PUBKEY = '36pHYRhbntUAJkR2RjudM7eaTXtNoMibnmVyNEnWMaqt';

const PRESETS_MAP = {
    'x_views': { label: 'X views', unitPrice: 0.005, type: 'view', reward: 25, defaultCount: 200 },
    'x_followers': { label: 'X followers', unitPrice: 0.03, type: 'follow', reward: 100, defaultCount: 34 },
    'x_followers_verified': { label: 'X followers verified', unitPrice: 0.05, type: 'follow', reward: 120, defaultCount: 20, verifiedOnly: true },
    'x_raid_verified': { label: 'X Raid Verified', unitPrice: 0.035, type: 'repost', reward: 150, defaultCount: 30, verifiedOnly: true },
    'x_raid': { label: 'X Raid', unitPrice: 0.02, type: 'repost', reward: 80, defaultCount: 50 },
    'x_raid_sorsa': { label: 'X Raid Sorsa > 0', unitPrice: 0.025, type: 'repost', reward: 115, defaultCount: 40, minSorsa: 1 },
    'repost': { label: 'Reposts', unitPrice: 0.01, type: 'repost', reward: 60, defaultCount: 100 },
    'likes': { label: 'Likes', unitPrice: 0.008, type: 'like', reward: 40, defaultCount: 125 },
    'bookmarks': { label: 'Bookmarks', unitPrice: 0.01, type: 'feedback', reward: 50, defaultCount: 100 },
    'comments': { label: 'X comments', unitPrice: 0.02, type: 'feedback', reward: 90, defaultCount: 50 }
};

const creatorState = {
    step: 1,
    mode: 'preset', // 'preset', 'custom_raid', 'custom_job'
    selectedPresetId: 'x_followers',
    actionCount: 34,
    targetUrl: '',
    
    // custom job parameters
    customTitle: '',
    customReward: 100,
    customCapacity: 100,
    customFilter: 'all',

    // step 2 payment options
    paymentCurrency: 'SOL',
    prices: { sol: 150, earn: 0.0002 }, // Live rates loaded from API
    
    // draft task generated by backend
    draftTask: null
};

// 1. Accordion Toggling for categories
function toggleCreatorCategory(categoryId) {
    const content = document.getElementById(`acc-content-${categoryId}`);
    const btn = document.getElementById(`acc-btn-${categoryId}`);
    if (!content) return;

    // Toggle active state
    const isActive = content.classList.contains('active');
    
    // Collapse all categories first
    document.querySelectorAll('.category-acc-content').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelectorAll('.category-acc-btn').forEach(el => {
        el.classList.remove('active');
    });

    if (!isActive) {
        content.classList.add('active');
        if (btn) btn.classList.add('active');
    }
}

// 2. Select Preset Item
function selectCreatorPreset(presetId) {
    const preset = PRESETS_MAP[presetId];
    if (!preset) return;

    creatorState.selectedPresetId = presetId;
    creatorState.actionCount = preset.defaultCount;
    
    // Highlight selected preset row, unhighlight others
    document.querySelectorAll('.preset-row-btn').forEach(el => {
        el.classList.remove('active');
    });
    const selectedBtn = document.getElementById(`preset-row-${presetId}`);
    if (selectedBtn) selectedBtn.classList.add('active');

    // Update preset setup form inputs
    document.getElementById('setup-preset-name').innerText = `Configure ${preset.label}`;
    document.getElementById('preset-unit-price').innerText = `$${preset.unitPrice} / action`;
    
    const slider = document.getElementById('preset-action-slider');
    const input = document.getElementById('preset-action-input');
    if (slider) slider.value = preset.defaultCount;
    if (input) input.value = preset.defaultCount;

    // Show setup form
    const setupPanel = document.getElementById('quick-preset-setup');
    if (setupPanel) setupPanel.classList.add('active');

    calculatePresetCost();
}

function syncActionSlider(val) {
    creatorState.actionCount = parseInt(val) || 10;
    const input = document.getElementById('preset-action-input');
    if (input) input.value = creatorState.actionCount;
    calculatePresetCost();
}

function syncActionInput(val) {
    let count = parseInt(val) || 10;
    if (count < 10) count = 10;
    if (count > 2000) count = 2000;
    creatorState.actionCount = count;
    const slider = document.getElementById('preset-action-slider');
    if (slider) slider.value = creatorState.actionCount;
    calculatePresetCost();
}

function calculatePresetCost() {
    const preset = PRESETS_MAP[creatorState.selectedPresetId];
    if (!preset) return;

    const usdVal = (preset.unitPrice * creatorState.actionCount).toFixed(2);
    document.getElementById('preset-price-label').innerText = `$${usdVal} (${creatorState.actionCount} actions)`;
}

// 3. Custom Job form controls
function toggleCustomJobForm() {
    const form = document.getElementById('custom-job-form');
    if (!form) return;
    
    if (form.classList.contains('active')) {
        form.classList.remove('active');
    } else {
        form.classList.add('active');
        calculateCustomJobCosts();
    }
}

function setCustomJobFilter(filterId) {
    document.querySelectorAll('[id^="cj-q-"]').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.getElementById(`cj-q-${filterId}`);
    if (activeBtn) activeBtn.classList.add('active');
    
    document.getElementById('custom-job-filter-val').value = filterId;
    calculateCustomJobCosts();
}

function calculateCustomJobCosts() {
    const reward = parseFloat(document.getElementById('custom-job-reward').value) || 0;
    const capacity = parseInt(document.getElementById('custom-job-capacity').value) || 0;
    const filter = document.getElementById('custom-job-filter-val').value;

    const baseReward = reward * capacity;
    const fee = baseReward * 0.02; // 2% service fee
    let qualityFee = 0;
    
    const qualityRow = document.getElementById('cj-summary-quality-row');
    const qualityLbl = document.getElementById('cj-summary-quality-lbl');
    const qualityVal = document.getElementById('cj-summary-quality-fee');

    if (filter === 'verified') {
        qualityFee = baseReward * 0.20;
        if (qualityRow) {
            qualityRow.style.display = 'flex';
            qualityLbl.innerText = 'Verified Audience (+20%):';
            qualityVal.innerText = `${qualityFee.toLocaleString()} $EARN`;
        }
    } else if (filter === 'sorsa') {
        qualityFee = baseReward * 0.15;
        if (qualityRow) {
            qualityRow.style.display = 'flex';
            qualityLbl.innerText = 'Sorsa Score (+15%):';
            qualityVal.innerText = `${qualityFee.toLocaleString()} $EARN`;
        }
    } else {
        if (qualityRow) qualityRow.style.display = 'none';
    }

    const totalEarn = baseReward + fee + qualityFee;
    
    // Simulate usd price calculation using fallback rate
    const usdVal = (totalEarn * creatorState.prices.earn).toFixed(2);

    document.getElementById('cj-summary-pool').innerText = `${baseReward.toLocaleString()} $EARN`;
    document.getElementById('cj-summary-fee').innerText = `${fee.toLocaleString()} $EARN`;
    document.getElementById('cj-summary-usd').innerText = `$${usdVal} USD`;
}

// 4. Create Draft and Proceed to Step 2 Payment
async function proceedToPayment(mode) {
    creatorState.mode = mode;
    
    if (!state.wallet.connected) {
        showToast('Please connect your Solana wallet first.', 'error');
        openConnectWalletModal();
        return;
    }

    let payload = {
        creatorAddress: state.wallet.address,
        task: {}
    };

    if (mode === 'preset') {
        const preset = PRESETS_MAP[creatorState.selectedPresetId];
        const link = document.getElementById('preset-link-input').value.trim();
        if (!link.startsWith('http')) {
            showToast('Please enter a valid target URL (starting with http/https).', 'error');
            return;
        }
        
        const usdBudget = preset.unitPrice * creatorState.actionCount;
        payload.usdBudget = usdBudget;
        payload.task = {
            type: preset.type,
            title: `${preset.label} preset campaign`,
            link: link,
            reward: preset.reward,
            capacity: creatorState.actionCount,
            verifiedOnly: preset.verifiedOnly || false,
            minSorsa: preset.minSorsa || 0
        };
    } else if (mode === 'custom_raid') {
        const link = document.getElementById('custom-raid-url').value.trim();
        if (!link.startsWith('http://') && !link.startsWith('https://')) {
            showToast('Please enter a valid X/Twitter post URL.', 'error');
            return;
        }
        // Standard Custom Raid parameters
        payload.usdBudget = 1.50; // Flat $1.50 for Custom Raid
        payload.task = {
            type: 'repost',
            title: 'Custom X Raid boost campaign',
            link: link,
            reward: 75,
            capacity: 50,
            verifiedOnly: false,
            minSorsa: 0
        };
    } else if (mode === 'custom_job') {
        const title = document.getElementById('custom-job-title').value.trim();
        const link = document.getElementById('custom-job-link').value.trim();
        const reward = parseFloat(document.getElementById('custom-job-reward').value) || 0;
        const capacity = parseInt(document.getElementById('custom-job-capacity').value) || 0;
        const filter = document.getElementById('custom-job-filter-val').value;

        if (!title || !link.startsWith('http')) {
            showToast('Please enter a valid title and URL link.', 'error');
            return;
        }

        const baseReward = reward * capacity;
        const fee = baseReward * 0.02;
        let qualityFee = 0;
        if (filter === 'verified') qualityFee = baseReward * 0.20;
        else if (filter === 'sorsa') qualityFee = baseReward * 0.15;
        const totalEarn = baseReward + fee + qualityFee;
        const usdBudget = totalEarn * creatorState.prices.earn;

        payload.usdBudget = usdBudget;
        payload.totalCostEarn = totalEarn;
        payload.task = {
            type: 'feedback',
            title: title,
            link: link,
            reward: reward,
            capacity: capacity,
            verifiedOnly: filter === 'verified',
            minSorsa: filter === 'sorsa' ? 1 : 0
        };
    }

    // Call API to fetch prices first
    try {
        const priceRes = await fetch(`${API_BASE}/api/price`);
        const priceData = await priceRes.json();
        if (priceData.success) {
            creatorState.prices.sol = priceData.solPriceUsd || 150.0;
            creatorState.prices.earn = priceData.earnPriceUsd || 0.0002;
        }
    } catch (e) {
        console.warn('Price fetch failed, using fallbacks:', e);
    }

    // Compute SOL total cost
    const totalCostSol = creatorState.prices.sol ? (payload.usdBudget / creatorState.prices.sol) : 0.015;
    payload.totalCostSol = parseFloat(totalCostSol.toFixed(6));

    // Display loading overlay
    const overlay = document.getElementById('modalConnectWallet');
    const selector = document.getElementById('walletModalSelector');
    const loader = document.getElementById('walletModalLoading');
    if (overlay) {
        selector.style.display = 'none';
        loader.style.display = 'flex';
        loader.querySelector('h3').innerText = 'Creating Job Draft...';
        loader.querySelector('p').innerText = 'Initializing campaign draft on express backend database...';
        overlay.classList.add('active');
    }

    try {
        const response = await fetch(`${API_BASE}/api/tasks/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        
        if (overlay) overlay.classList.remove('active');

        if (data.success) {
            creatorState.draftTask = data.task;
            
            // Redirect step panels
            document.getElementById('creator-step1-panel').classList.remove('active');
            document.getElementById('creator-step2-panel').classList.add('active');
            
            // Populate step 2 screen details
            updatePaymentDetailsUI();
            showToast('Job draft successfully created! Proceed with payment.', 'success');
        } else {
            showToast(data.error || 'Failed to create job draft.', 'error');
        }
    } catch (err) {
        console.error(err);
        if (overlay) overlay.classList.remove('active');
        showToast('Server communication error during draft creation.', 'error');
    }
}

function updatePaymentDetailsUI() {
    const task = creatorState.draftTask;
    if (!task) return;

    // 1. Compute amounts
    const usd = task.budgetUsd;
    const sol = task.budgetSol;
    const earn = task.budgetEarn;

    // Show correct currency price
    const amountEl = document.getElementById('payment-total-amount');
    const usdEl = document.getElementById('payment-total-usd');

    if (creatorState.paymentCurrency === 'SOL') {
        amountEl.innerText = `${sol.toFixed(6)} SOL`;
        usdEl.innerText = `$${usd.toFixed(2)} USD`;
    } else if (creatorState.paymentCurrency === 'EARN') {
        amountEl.innerText = `${earn.toLocaleString()} $EARN`;
        usdEl.innerText = `$${usd.toFixed(2)} USD`;
    } else {
        // USDC
        amountEl.innerText = `${usd.toFixed(2)} USDC`;
        usdEl.innerText = `$${usd.toFixed(2)} USD`;
    }

    // 2. Overview items
    const platformVaultPct = earn * 0.10;
    document.getElementById('overview-vault-fee').innerText = `~${platformVaultPct.toFixed(1)} $EARN`;
    document.getElementById('overview-winners-count').innerText = task.capacity;
    
    const rewardPerWinner = (earn * 0.90) / task.capacity;
    document.getElementById('overview-reward-per-winner').innerText = `~${rewardPerWinner.toFixed(1)} $EARN`;
    
    // Overview pay label
    const totalPayDesc = creatorState.paymentCurrency === 'SOL' 
        ? `${sol.toFixed(5)} SOL ($${usd.toFixed(2)})`
        : creatorState.paymentCurrency === 'EARN'
            ? `${earn.toLocaleString()} $EARN ($${usd.toFixed(2)})`
            : `${usd.toFixed(2)} USDC ($${usd.toFixed(2)})`;
    document.getElementById('overview-total-pay-desc').innerText = totalPayDesc;

    // 3. Job details
    document.getElementById('details-job-id').innerText = task.id;
    document.getElementById('details-verified').innerText = task.verifiedOnly ? 'Yes' : 'No';

    // 4. Preview panel
    document.getElementById('preview-tag-type').innerText = getTaskTypeLabel(task.type);
    document.getElementById('preview-tag-type').className = `task-badge ${task.type}`;
    document.getElementById('preview-task-title').innerText = task.title;
    document.getElementById('preview-reward-val').innerText = `${task.reward} $EARN`;
    document.getElementById('preview-capacity').innerText = `Entries: 0/${task.capacity}`;

    // 5. Update wallet action buttons
    const btnWalletPay = document.getElementById('btn-wallet-pay-action');
    if (state.wallet.connected) {
        btnWalletPay.innerText = `Pay ${creatorState.paymentCurrency === 'SOL' ? sol.toFixed(5) + ' SOL' : earn.toLocaleString() + ' $EARN'}`;
        btnWalletPay.disabled = false;
        btnWalletPay.style.opacity = '1';
    } else {
        btnWalletPay.innerText = 'Connect Wallet';
        btnWalletPay.disabled = false;
    }

    // Balance pay text
    const balanceText = document.getElementById('pay-method-available-balance');
    const btnBalancePay = document.getElementById('btn-balance-pay-action');
    if (creatorState.paymentCurrency === 'SOL') {
        balanceText.innerText = `${state.wallet.balanceSOL.toFixed(3)} SOL`;
        btnBalancePay.innerText = `Pay with SOL balance`;
        if (state.wallet.balanceSOL < sol) {
            btnBalancePay.disabled = true;
            btnBalancePay.style.opacity = '0.5';
        } else {
            btnBalancePay.disabled = false;
            btnBalancePay.style.opacity = '1';
        }
    } else {
        balanceText.innerText = `${state.wallet.balanceEARN.toLocaleString()} $EARN`;
        btnBalancePay.innerText = `Pay with $EARN balance`;
        if (state.wallet.balanceEARN < earn) {
            btnBalancePay.disabled = true;
            btnBalancePay.style.opacity = '0.5';
        } else {
            btnBalancePay.disabled = false;
            btnBalancePay.style.opacity = '1';
        }
    }

    // Recipient Manual pay fields
    document.getElementById('manual-exact-amount').innerText = creatorState.paymentCurrency === 'SOL' ? sol.toFixed(6) : earn.toFixed(0);
}

function selectPaymentCurrency(currency) {
    creatorState.paymentCurrency = currency;
    
    document.querySelectorAll('.currency-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (currency === 'SOL') document.getElementById('pay-curr-sol').classList.add('active');
    else if (currency === 'EARN') document.getElementById('pay-curr-earn').classList.add('active');
    else document.getElementById('pay-curr-usdc').classList.add('active');
    
    updatePaymentDetailsUI();
}

// 5. Wallet Payment Handler (triggers real/simulated SOL transfer)
async function handleWalletPayment() {
    if (!state.wallet.connected) {
        openConnectWalletModal();
        return;
    }

    const task = creatorState.draftTask;
    if (!task) return;

    const solAmount = task.budgetSol;
    
    // Trigger overlay spinner
    const overlay = document.getElementById('modalConnectWallet');
    const selector = document.getElementById('walletModalSelector');
    const loader = document.getElementById('walletModalLoading');
    if (overlay) {
        selector.style.display = 'none';
        loader.style.display = 'flex';
        loader.querySelector('h3').innerText = 'Sending Solana Transaction...';
        loader.querySelector('p').innerText = `Approve the Phantom transaction to send ${solAmount.toFixed(5)} SOL to treasury escrow.`;
        overlay.classList.add('active');
    }

    // Try executing transaction via Phantom/Solflare
    try {
        let txSignature = `mock_sig_${Date.now()}`;
        
        // If web3 and window.solana is active, build real transaction
        if (window.solana && window.solanaWeb3 && state.wallet.provider && !state.wallet.provider.includes('Demo')) {
            const rpcUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'https://api.devnet.solana.com'
                : 'https://rpc.ankr.com/solana';
            const connection = new solanaWeb3.Connection(rpcUrl, 'confirmed');
            const transaction = new solanaWeb3.Transaction().add(
                solanaWeb3.SystemProgram.transfer({
                    fromPubkey: new solanaWeb3.PublicKey(state.wallet.address),
                    toPubkey: new solanaWeb3.PublicKey(TREASURY_PUBKEY),
                    lamports: Math.floor(solAmount * solanaWeb3.LAMPORTS_PER_SOL)
                })
            );
            
            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = new solanaWeb3.PublicKey(state.wallet.address);
            
            const signed = await window.solana.signAndSendTransaction(transaction);
            txSignature = signed.signature;
            
            // Wait for block confirmation
            await connection.confirmTransaction(txSignature);
        } else {
            // Simulated transaction delay
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Send transaction signature to confirm endpoint to trigger auto-buy
        loader.querySelector('h3').innerText = 'Swapping SOL to $EARN via Jupiter...';
        loader.querySelector('p').innerText = 'Payment confirmed! Platform is auto-buying reward tokens via Jupiter router.';
        
        const confirmRes = await fetch(`${API_BASE}/api/tasks/confirm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                taskId: task.id,
                txSignature: txSignature
            })
        });
        const confirmData = await confirmRes.json();
        
        if (overlay) overlay.classList.remove('active');

        if (confirmData.success) {
            // Deduct mock SOL
            state.wallet.balanceSOL -= solAmount;
            updateNavbarBalance();
            
            if (typeof fetchTasks === 'function') await fetchTasks();
            
            addCampaignToMyList(confirmData.task, task.budgetEarn);
            showToast('Job paid & activated! Jupiter Auto-buy triggered successfully.', 'success');
            triggerTokenRainAnimation();
            backToStep1();
        } else {
            showToast(confirmData.error || 'Failed to confirm payment swap.', 'error');
        }

    } catch (err) {
        console.error(err);
        if (overlay) overlay.classList.remove('active');
        showToast(err.message || 'Transaction cancelled or failed.', 'error');
    }
}

// 6. Balance Payment Handler
async function handleBalancePayment() {
    const task = creatorState.draftTask;
    if (!task) return;

    const overlay = document.getElementById('modalConnectWallet');
    const selector = document.getElementById('walletModalSelector');
    const loader = document.getElementById('walletModalLoading');
    if (overlay) {
        selector.style.display = 'none';
        loader.style.display = 'flex';
        loader.querySelector('h3').innerText = 'Processing balance payment...';
        loader.querySelector('p').innerText = 'Deducting cost from your local platform balance...';
        overlay.classList.add('active');
    }

    try {
        const response = await fetch(`${API_BASE}/api/tasks/pay-balance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                taskId: task.id,
                creatorAddress: state.wallet.address,
                currency: creatorState.paymentCurrency
            })
        });
        const data = await response.json();
        
        if (overlay) overlay.classList.remove('active');

        if (data.success) {
            state.wallet.balanceSOL = data.user.balanceSOL;
            state.wallet.balanceEARN = data.user.balanceEARN;
            updateNavbarBalance();

            if (typeof fetchTasks === 'function') await fetchTasks();
            
            addCampaignToMyList(data.task, task.budgetEarn);
            showToast('Job successfully paid and activated using balance!', 'success');
            triggerTokenRainAnimation();
            backToStep1();
        } else {
            showToast(data.error || 'Failed to pay using balance.', 'error');
        }
    } catch (err) {
        console.error(err);
        if (overlay) overlay.classList.remove('active');
        showToast('Server communication error during balance payment.', 'error');
    }
}

// 7. Manual Payment simulated verification
async function handleManualPaymentConfirmation() {
    const task = creatorState.draftTask;
    if (!task) return;

    const confirmBtn = document.getElementById('btn-manual-confirm');
    confirmBtn.innerText = 'Verifying Transfer...';
    confirmBtn.disabled = true;

    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const confirmRes = await fetch(`${API_BASE}/api/tasks/confirm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                taskId: task.id,
                txSignature: `manual_pay_${Date.now()}`
            })
        });
        const confirmData = await confirmRes.json();
        
        if (confirmData.success) {
            if (typeof fetchTasks === 'function') await fetchTasks();
            
            addCampaignToMyList(confirmData.task, task.budgetEarn);
            showToast('Manual payment verified! Campaign is now active.', 'success');
            triggerTokenRainAnimation();
            backToStep1();
        } else {
            showToast('Payment verification pending. Try again in a minute.', 'warning');
        }
    } catch (e) {
        console.error(e);
        showToast('Error during payment check.', 'error');
    } finally {
        confirmBtn.innerText = 'I Have Made the Payment';
        confirmBtn.disabled = false;
    }
}

// 8. Back button and UI reset
function backToStep1() {
    document.getElementById('creator-step2-panel').classList.remove('active');
    document.getElementById('creator-step1-panel').classList.add('active');
    
    // Clear inputs in Step 1
    const presetLink = document.getElementById('preset-link-input');
    if (presetLink) presetLink.value = '';
    
    const customLink = document.getElementById('custom-job-link');
    if (customLink) customLink.value = '';
    
    const raidUrl = document.getElementById('custom-raid-url');
    if (raidUrl) raidUrl.value = '';
}

// 9. Simple Copy helper
function copyText(elementId, msg) {
    const txt = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(txt);
    showToast(msg || 'Copied to clipboard!', 'success');
}

// Expose functions globally for legacy inline HTML onclick handlers
window.filterTasks = filterTasks;
window.closeTaskDetailModal = closeTaskDetailModal;
window.toggleWurkSubmissions = toggleWurkSubmissions;
window.executeTaskAction = executeTaskAction;
window.openTaskDetail = openTaskDetail;
window.switchProofMethod = switchProofMethod;
window.checkManualProofInput = checkManualProofInput;
window.verifyTaskCompletion = verifyTaskCompletion;
window.triggerTokenRainAnimation = triggerTokenRainAnimation;

// Step-by-step Campaign Creation exposures
window.toggleCreatorCategory = toggleCreatorCategory;
window.selectCreatorPreset = selectCreatorPreset;
window.syncActionSlider = syncActionSlider;
window.syncActionInput = syncActionInput;
window.calculatePresetCost = calculatePresetCost;
window.toggleCustomJobForm = toggleCustomJobForm;
window.setCustomJobFilter = setCustomJobFilter;
window.calculateCustomJobCosts = calculateCustomJobCosts;
window.proceedToPayment = proceedToPayment;
window.selectPaymentCurrency = selectPaymentCurrency;
window.handleWalletPayment = handleWalletPayment;
window.handleBalancePayment = handleBalancePayment;
window.handleManualPaymentConfirmation = handleManualPaymentConfirmation;
window.backToStep1 = backToStep1;
window.copyText = copyText;
window.addCampaignToMyList = addCampaignToMyList;

