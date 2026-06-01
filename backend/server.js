const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const nacl = require('tweetnacl');
const bs58 = require('bs58');

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files on the root url
app.use(express.static(path.join(__dirname, '../frontend')));

// JSON File Database Setup (Uses mounted Railway Volume "/data" in production for persistence)
const DB_PATH = process.env.NODE_ENV === 'production' ? '/data/database.json' : path.join(__dirname, 'database.json');

// Initial seed database state
const initialDbState = {
  tasks: [
    {
      id: 'task-1',
      type: 'follow',
      title: 'Follow earn.cool Official X Account',
      link: 'https://x.com/earndotcool', // can be earn.cool in description
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
      verifiedOnly: true,
      minSorsa: 0
    },
    {
      id: 'task-3',
      type: 'repost',
      title: 'Sorsa Score > 0 Trusted Account Raid (Bonk Team)',
      link: 'https://x.com/earndotcool/status/179920199',
      reward: 115,
      creator: 'Bonk Official',
      capacity: 250,
      completedCount: 102,
      completedBy: [],
      verifiedOnly: false,
      minSorsa: 1
    },
    {
      id: 'task-4',
      type: 'feedback',
      title: 'Leave Feedback About earn.cool Interface on Our Website',
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
      title: 'Follow @solana Official Developer Account',
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
      title: 'Like Phantom Wallet Multi-Chain Update',
      link: 'https://x.com/phantom/status/18892012',
      reward: 60,
      creator: 'Phantom Wallet',
      capacity: 1200,
      completedCount: 802,
      completedBy: [],
      verifiedOnly: false,
      minSorsa: 0
    }
  ],
  users: {},
  vault: {
    balance: 4467250.00,
    contributions: [
      { time: '1m ago', amount: '2.40 $EARN', job: '#a9e96dc0', reason: 'Worker completed task (Commission)' },
      { time: '2m ago', amount: '1.00 $EARN', job: '#c123df10', reason: 'Worker completed task (Commission)' },
      { time: '3m ago', amount: '3.00 $EARN', job: '#e23d9b01', reason: 'Worker completed task (Commission)' },
      { time: '4m ago', amount: '4.00 $EARN', job: '#b4819d20', reason: 'Worker completed task (Commission)' },
      { time: '5m ago', amount: '2.40 $EARN', job: '#a9e96dc0', reason: 'Worker completed task (Commission)' }
    ]
  }
};

// Load database helper
function loadDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(initialDbState, null, 2), 'utf8');
      return initialDbState;
    }
    const rawData = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Database loading error, returning seed state:", error);
    return initialDbState;
  }
}

// Save database helper
function saveDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error("Database write error:", error);
  }
}

// -------------------------------------------------------------
// ENDPOINTS
// -------------------------------------------------------------

// 1. CRYPTOGRAPHIC SIGNATURE WALLET AUTHENTICATION
app.post('/api/auth', (req, res) => {
  const { address, message, signature } = req.body;
  
  if (!address || !message || !signature) {
    return res.status(400).json({ success: false, error: 'Missing credentials: address, message and signature are required.' });
  }
  
  try {
    // Convert inputs to Uint8Arrays for tweetnacl verification
    const publicKeyBytes = bs58.decode(address);
    const signatureBytes = bs58.decode(signature);
    const messageBytes = new TextEncoder().encode(message);
    
    // Verify using NaCl
    const isSignatureValid = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
    
    if (!isSignatureValid) {
      return res.status(401).json({ success: false, error: 'Cryptographic signature invalid! Please sign again with your wallet.' });
    }
    
    // Signature verified! Load user profile from DB or initialize
    const db = loadDb();
    if (!db.users[address]) {
      db.users[address] = {
        address: address,
        balanceSOL: 4.25, // Mock initial devnet balance
        balanceEARN: 1250.00, // Seed initial tokens
        verified: false, // Sim Verified status
        sorsaScore: 0 // Sim Sorsa score
      };
      saveDb(db);
    }
    
    res.json({
      success: true,
      message: 'Wallet successfully authenticated cryptographically!',
      user: db.users[address]
    });
    
  } catch (error) {
    console.error("Auth verification error:", error);
    res.status(500).json({ success: false, error: 'Server error during authentication verification.' });
  }
});

// 2. GET ACTIVE TASKS
app.get('/api/tasks', (req, res) => {
  const db = loadDb();
  res.json({ success: true, tasks: db.tasks });
});

// 3. CREATE TASK (LOCK BUDGET)
app.post('/api/tasks', (req, res) => {
  const { task, creatorAddress } = req.body;
  
  if (!task || !creatorAddress) {
    return res.status(400).json({ success: false, error: 'Missing data: task and creatorAddress are required.' });
  }
  
  const db = loadDb();
  const user = db.users[creatorAddress];
  
  if (!user) {
    return res.status(404).json({ success: false, error: 'User profile not found. Please verify your wallet first.' });
  }
  
  const baseReward = task.reward * task.capacity;
  const fee = baseReward * 0.02;
  let qualityFee = 0;
  
  if (task.verifiedOnly) qualityFee = baseReward * 0.20;
  else if (task.minSorsa > 0) qualityFee = baseReward * 0.15;
  
  const totalCost = baseReward + fee + qualityFee;
  
  if (user.balanceEARN < totalCost) {
    return res.status(400).json({ success: false, error: `Insufficient balance! Required: ${totalCost} $EARN, Available: ${user.balanceEARN} $EARN` });
  }
  
  // Deduct cost and save
  user.balanceEARN -= totalCost;
  
  // Insert new task
  const newTask = {
    id: `task-${Date.now()}`,
    type: task.type,
    title: task.title,
    link: task.link,
    reward: task.reward,
    creator: creatorAddress.slice(0, 6) + '...' + creatorAddress.slice(-4),
    capacity: task.capacity,
    completedCount: 0,
    completedBy: [],
    verifiedOnly: task.verifiedOnly,
    minSorsa: task.minSorsa
  };
  
  db.tasks.unshift(newTask);
  saveDb(db);
  
  res.json({ success: true, task: newTask, totalCost, user });
});

// 4. VERIFY AND PAY TASK COMPLETION
app.post('/api/tasks/:id/verify', (req, res) => {
  const taskId = req.params.id;
  const { walletAddress, verifiedSim, sorsaScoreSim, proofMethod, tweetUrl } = req.body;
  
  if (!walletAddress) {
    return res.status(400).json({ success: false, error: 'Missing data: walletAddress is required.' });
  }
  
  const db = loadDb();
  const task = db.tasks.find(t => t.id === taskId);
  const user = db.users[walletAddress];
  
  if (!task) {
    return res.status(404).json({ success: false, error: 'Task not found.' });
  }
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found.' });
  }
  
  if (task.completedBy.includes(walletAddress)) {
    return res.status(400).json({ success: false, error: 'You have already completed this task.' });
  }
  
  if (task.completedCount >= task.capacity) {
    return res.status(400).json({ success: false, error: 'This task has reached capacity.' });
  }
  
  // Save simulated verification toggles to database
  user.verified = verifiedSim;
  user.sorsaScore = sorsaScoreSim;
  
  // 1. Check verified condition
  if (task.verifiedOnly && !user.verified) {
    return res.status(400).json({ success: false, error: 'Audience Filter Mismatch: You must be X Verified (Blue Tick).' });
  }
  
  // 2. Check sorsa condition
  if (task.minSorsa > 0 && user.sorsaScore <= 0) {
    return res.status(400).json({ success: false, error: 'Audience Filter Mismatch: Your Sorsa score must be greater than 0.' });
  }
  
  // Everything checks out! Process reward
  task.completedBy.push(walletAddress);
  task.completedCount += 1;
  
  user.balanceEARN += task.reward;
  
  // Add platform commission (2%) contribution to the Vault
  const comm = (task.reward * 0.02).toFixed(2);
  db.vault.balance += parseFloat(comm);
  db.vault.contributions.unshift({
    time: 'just now',
    amount: `${comm} $EARN`,
    job: `#${task.id.slice(0, 8)}`,
    reason: 'Worker completed task (Commission)'
  });
  
  if (db.vault.contributions.length > 50) db.vault.contributions.pop();
  
  saveDb(db);
  
  res.json({
    success: true,
    task,
    user,
    commissionAdded: comm
  });
});

// 5. UPDATE USER PROFILE SIMULATOR STATES
app.post('/api/user/profile', (req, res) => {
  const { walletAddress, verified, sorsaScore } = req.body;
  if (!walletAddress) {
    return res.status(400).json({ success: false, error: 'Missing data: walletAddress is required.' });
  }
  
  const db = loadDb();
  const user = db.users[walletAddress];
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found.' });
  }
  
  user.verified = verified;
  user.sorsaScore = sorsaScore;
  saveDb(db);
  
  res.json({ success: true, user });
});

// 6. GET VAULT STATUS
app.get('/api/vault', (req, res) => {
  const db = loadDb();
  res.json({ success: true, vault: db.vault });
});

// 7. GROQ AI CHAT COMPLETIONS ENDPOINT
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ success: false, error: 'Missing field: message is required.' });
  }

  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey) {
    // Elegant fallback if Groq API key is not entered in environment variables yet
    return res.json({
      success: true,
      reply: "👾 **[SYSTEM DEMO MODE]**\n\nBeep boop! I am your **Cyber Watcher** assistant! To unlock my full Llama-3 AI capabilities, please add the `GROQ_API_KEY` environment variable in your Railway dashboard.\n\nBut for now, I can tell you that **earn.cool** is a premium Solana Web3 micro-task platform! Here, you can connect your Solana wallet and X (Twitter) account to start earning **$EARN** tokens instantly by completing follows, likes, and repost tasks! You can also trade $EARN on our live bonding curve or lock your tokens in the Vault to earn passive SOL rewards!"
    });
  }

  try {
    const systemPrompt = `You are "Cyber Watcher", the elite artificial intelligence mascot and guide for the earn.cool platform. 
Your personality is futuristic, energetic, sleek, Web3-native, and slightly cybernetic (use cool emojis like 🤖, ⚡, 💎, 📈, 👾, 🔒).
Always respond in the SAME language the user addresses you in (if they ask in Turkish, answer in Turkish; if English, answer in English).

Here is everything you know about earn.cool:
1. Core Concept: earn.cool is a Web3 social-media micro-task network built on the Solana blockchain.
2. Two Main User Roles:
   - Workers: Complete social tasks (follows, likes, reposts on X/Twitter) to instantly earn $EARN tokens and SOL. They connect their Solana wallets (Phantom, Solflare, etc.) and X accounts to verify actions automatically.
   - Creators / Advertisers: Create campaigns/tasks to boost their social reach. They fund these tasks by locking $EARN tokens. They can filter participants by requirements like "Verified Accounts Only" or "Sorsa Score > 0" to filter bots.
3. Interactive Features of the Platform:
   - Task Market: A live portal of X/Twitter tasks with real-time verification and instant token rewards.
   - $EARN Trade (Bonding Curve): A pump.fun-like bonding curve terminal where users can buy and sell $EARN using SOL. When progress hits 100% (target: 85,000 SOL), the liquidity automatically migrates to Raydium DEX.
   - EARN Vault: Staking portal where users lock their $EARN tokens to earn high-yield passive rewards paid in SOL (derived from platform commission distributions).
   - Leaderboard: Shows the top earners (Workers) and top campaigns (Creators).
4. Goal: Be extremely helpful, guide users on how to use the wallet, create tasks, stake, or trade, and keep them hyped about $EARN! Keep answers concise, highly structured, and engaging. Avoid long paragraphs, use bullet points where helpful.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // Highly fast and cost-effective llama 3.1 model on Groq
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      res.json({
        success: true,
        reply: data.choices[0].message.content
      });
    } else {
      console.error('Groq API Error:', data);
      res.json({
        success: true,
        reply: "🤖 Beep... boop... I encountered a connection glitch in the siber-matrix. Please try again!"
      });
    }
  } catch (error) {
    console.error('Groq Chat Server Error:', error);
    res.status(500).json({ success: false, error: 'Internal server error while calling AI service.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 earn.cool Express Backend is running on port ${PORT}`);
  console.log(`👉 Static frontend is served directly on: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
