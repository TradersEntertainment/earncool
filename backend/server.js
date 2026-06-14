const fs = require('fs');
const path = require('path');

// Setup log interception
const logPath = path.join(__dirname, 'server.log');
const logStream = fs.createWriteStream(logPath, { flags: 'a' });
const originalLog = console.log;
const originalError = console.error;

console.log = function(...args) {
  const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ');
  logStream.write(`[LOG] ${new Date().toISOString()}: ${msg}\n`);
  originalLog.apply(console, args);
};

console.error = function(...args) {
  const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ');
  logStream.write(`[ERROR] ${new Date().toISOString()}: ${msg}\n`);
  originalError.apply(console, args);
};

console.log("Server logger initialized.");

const express = require('express');
const cors = require('cors');
const nacl = require('tweetnacl');
const bs58 = require('bs58');
const axios = require('axios');
const { getEarnPriceUsd, getSolPriceUsd, autoBuyEarnFromTreasury, TREASURY_PUBKEY } = require('./jupiter');

// Security middleware
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
const allowedOrigins = [
  'https://earn.cool', 
  'https://www.earn.cool', 
  'http://localhost:3005', 
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`);
  next();
});

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please try again later.' }
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // stricter for auth
  message: { success: false, error: 'Too many authentication attempts. Please try again later.' }
});
app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter);

// Serve Vite static files from dist (if they exist)
const distPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// JSON File Database Setup (Uses mounted Railway Volume "/data" in production for persistence)
const DB_PATH = process.env.NODE_ENV === 'production' ? '/data/database.json' : path.join(__dirname, 'database.json');

// Initial seed database state
const initialDbState = {
  tasks: [],
  users: {},
  vault: {
    balance: 0,
    contributions: []
  }
};

// Load database helper
function loadDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(initialDbState, null, 2), 'utf8');
      return JSON.parse(JSON.stringify(initialDbState));
    }
    const rawData = fs.readFileSync(DB_PATH, 'utf8');
    const db = JSON.parse(rawData);
    
    // Safety migrations: ensure all required keys exist
    if (!db.tasks) db.tasks = [];
    if (!db.users) db.users = {};
    if (!db.vault) {
      db.vault = {
        balance: 0,
        contributions: []
      };
    } else {
      if (db.vault.balance === undefined) db.vault.balance = 0;
      if (!db.vault.contributions) db.vault.contributions = [];
    }
    
    return db;
  } catch (error) {
    console.error("Database loading error, returning seed state:", error);
    return JSON.parse(JSON.stringify(initialDbState));
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
    // Block demo bypass attempts in production
    if (message === 'DEMO_BYPASS' || signature === 'DEMO_BYPASS') {
      if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ success: false, error: 'Demo mode is disabled in production.' });
      }
    }

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
  // Public market only gets active tasks
  const activeTasks = db.tasks.filter(t => t.status === 'active');
  res.json({ success: true, tasks: activeTasks });
});

// 3. GET CURRENT PRICES
app.get('/api/price', async (req, res) => {
  const earnPrice = await getEarnPriceUsd();
  const solPrice = await getSolPriceUsd();
  res.json({ success: true, earnPriceUsd: earnPrice, solPriceUsd: solPrice });
});

// 4. CREATE TASK (accepts frontend campaign payload - creates pending task draft)
app.post('/api/tasks/create', async (req, res) => {
  const { task, creatorAddress, usdBudget, totalCostEarn, totalCostSol } = req.body;
  
  if (!task || !creatorAddress) {
    return res.status(400).json({ success: false, error: 'Missing data: task and creatorAddress are required.' });
  }
  
  try {
    const db = loadDb();
    const user = db.users[creatorAddress];
    
    // Calculate the cost in $EARN tokens
    const rewardPerUser = task.reward || 100;
    const capacity = task.capacity || 100;
    const baseReward = rewardPerUser * capacity;
    const fee = baseReward * 0.02;
    let qualityFee = 0;
    if (task.verifiedOnly) qualityFee = baseReward * 0.20;
    else if (task.minSorsa > 0) qualityFee = baseReward * 0.15;
    const totalCostE = totalCostEarn || (baseReward + fee + qualityFee);
    
    const newTaskId = `task-${Date.now()}`;
    const newTask = {
      id: newTaskId,
      type: task.type || 'follow',
      title: task.title || 'Untitled Task',
      link: task.link || '',
      reward: rewardPerUser,
      budgetEarn: totalCostE,
      budgetSol: totalCostSol || 0.015,
      budgetUsd: usdBudget || 1.02,
      creator: creatorAddress.slice(0, 6) + '...' + creatorAddress.slice(-4),
      creatorFullAddress: creatorAddress,
      capacity: capacity,
      completedCount: 0,
      completedBy: [],
      verifiedOnly: task.verifiedOnly || false,
      minSorsa: task.minSorsa || 0,
      status: 'pending' // starts as pending, waiting for payment
    };
    
    db.tasks.unshift(newTask);
    saveDb(db);
    
    res.json({
      success: true,
      task: newTask,
      user: user || { balanceEARN: 1250.0, balanceSOL: 4.25 }
    });
  } catch (error) {
    console.error('Task creation error:', error);
    res.status(500).json({ success: false, error: 'Failed to create task draft.' });
  }
});

// 5. CONFIRM TASK PAYMENT & AUTO-BUY
app.post('/api/tasks/confirm', async (req, res) => {
  const { taskId, txSignature } = req.body;
  
  if (!taskId || !txSignature) {
    return res.status(400).json({ success: false, error: 'taskId and txSignature are required.' });
  }

  try {
    const db = loadDb();
    const taskIndex = db.tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      return res.status(404).json({ success: false, error: 'Task not found.' });
    }

    const task = db.tasks[taskIndex];
    console.log(`Auto-Buy triggered for task ${taskId} with budget $${task.budgetUsd}`);
    
    // Trigger Backend Auto-Buy!
    const swapResult = await autoBuyEarnFromTreasury(task.budgetUsd || 1.02);

    db.tasks[taskIndex].status = 'active';
    
    if (swapResult.success) {
        db.tasks[taskIndex].rewardEarnRaw = swapResult.expectedEarnAmount;
        // platform commission contribution to vault
        const commission = (task.reward || 100) * (task.capacity || 100) * 0.10;
        db.vault.balance += commission;
        db.vault.contributions.unshift({
          time: 'just now',
          amount: `${commission.toFixed(2)} $EARN`,
          job: `#${taskId.slice(0, 8)}`,
          reason: 'Campaign creation fee (Auto-Buy 10%)'
        });
        if (db.vault.contributions.length > 50) db.vault.contributions.pop();
        
        saveDb(db);
        res.json({ 
            success: true, 
            message: 'Task activated and Auto-Buy successful!', 
            txid: swapResult.txid, 
            task: db.tasks[taskIndex] 
        });
    } else {
        // Fallback: set rewardEarnRaw using static calculation
        db.tasks[taskIndex].rewardEarnRaw = Math.floor((task.reward || 100) * (task.capacity || 100) * 1e6);
        saveDb(db);
        res.json({ 
            success: true, 
            message: 'Task activated, but Auto-Buy delayed or failed (see logs).', 
            error: swapResult.error,
            task: db.tasks[taskIndex]
        });
    }
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ success: false, error: 'Confirm payment execution error' });
  }
});

// 6. PAY TASK WITH SOL/EARN BALANCE
app.post('/api/tasks/pay-balance', async (req, res) => {
  const { taskId, creatorAddress, currency } = req.body;
  if (!taskId || !creatorAddress) {
    return res.status(400).json({ success: false, error: 'taskId and creatorAddress are required.' });
  }

  try {
    const db = loadDb();
    const taskIndex = db.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ success: false, error: 'Task not found.' });
    }
    const task = db.tasks[taskIndex];
    const user = db.users[creatorAddress];
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    if (currency === 'SOL') {
      const costSol = task.budgetSol || 0.015;
      if (user.balanceSOL < costSol) {
        return res.status(400).json({ success: false, error: `Insufficient SOL balance! Required: ${costSol} SOL, Balance: ${user.balanceSOL} SOL.` });
      }
      user.balanceSOL -= costSol;
      task.status = 'active';

      // Trigger auto-buy!
      const swapResult = await autoBuyEarnFromTreasury(task.budgetUsd);
      if (swapResult.success) {
        task.rewardEarnRaw = swapResult.expectedEarnAmount;
      } else {
        task.rewardEarnRaw = Math.floor((task.reward || 100) * (task.capacity || 100) * 1e6);
      }
      
      const commission = (task.reward || 100) * (task.capacity || 100) * 0.10;
      db.vault.balance += commission;
      db.vault.contributions.unshift({
        time: 'just now',
        amount: `${commission.toFixed(2)} $EARN`,
        job: `#${taskId.slice(0, 8)}`,
        reason: 'Campaign creation fee (Balance 10%)'
      });
      if (db.vault.contributions.length > 50) db.vault.contributions.pop();
    } else {
      // Pay with EARN balance
      const costEarn = task.budgetEarn || 0;
      if (user.balanceEARN < costEarn) {
        return res.status(400).json({ success: false, error: `Insufficient $EARN balance! Required: ${costEarn} $EARN, Balance: ${user.balanceEARN} $EARN.` });
      }
      user.balanceEARN -= costEarn;
      task.status = 'active';
      task.rewardEarnRaw = Math.floor(costEarn * 1e6); // raw microtokens

      db.vault.balance += costEarn * 0.10; // platform commission
    }

    saveDb(db);
    res.json({
      success: true,
      message: 'Campaign successfully paid and activated!',
      task,
      user
    });
  } catch (error) {
    console.error('Pay balance error:', error);
    res.status(500).json({ success: false, error: 'Failed to process balance payment.' });
  }
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
  
  // Note: verified and sorsaScore should come from server-side verification
  // Do NOT trust client-sent values in production
  // user.verified and user.sorsaScore are kept from their existing DB values
  
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
  
  // Calculate individual reward (2% commission taken from total pool)
  const totalEarn = task.rewardEarnRaw || 0;
  const rawRewardPerUser = Math.floor((totalEarn * 0.98) / (task.capacity || 100)); 
  const earnReward = rawRewardPerUser / 1e6; // Pump.fun tokens use 6 decimals
  
  user.balanceEARN += earnReward;
  
  // Add platform commission (2%) contribution to the Vault
  const commRaw = Math.floor((totalEarn * 0.02) / (task.capacity || 100));
  const comm = (commRaw / 1e6).toFixed(4);
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
2. The Official Token: The platform's native utility token is $EARN. The real smart contract (mint address) is 8s7AXPTwGCr6hGkrYVx1iHQhjRrfYn7DoecwMuCXpump. It is officially launched on pump.fun!
3. Two Main User Roles:
   - Workers: Complete social tasks (follows, likes, reposts on X/Twitter) to instantly earn $EARN tokens and SOL. They connect their Solana wallets (Phantom, Solflare, etc.) and X accounts to verify actions automatically.
   - Creators / Advertisers: Create campaigns/tasks to boost their social reach. They fund these tasks by locking $EARN tokens. They can filter participants by requirements like "Verified Accounts Only" or "Sorsa Score > 0" to filter bots.
4. Interactive Features of the Platform:
   - Task Market: A live portal of X/Twitter tasks with real-time verification and instant token rewards.
   - $EARN Trade (Bonding Curve): A pump.fun-like bonding curve terminal where users can buy and sell $EARN using SOL. The official token address is 8s7AXPTwGCr6hGkrYVx1iHQhjRrfYn7DoecwMuCXpump. When progress hits 100% (target: 85,000 SOL), the liquidity automatically migrates to Raydium DEX.
   - EARN Vault: Staking portal where users lock their $EARN tokens to earn high-yield passive rewards paid in SOL (derived from platform commission distributions).
   - Leaderboard: Shows the top earners (Workers) and top campaigns (Creators).
5. Goal: Be extremely helpful, guide users on how to use the wallet, create tasks, stake, or trade, and keep them hyped about $EARN! Keep answers concise, highly structured, and engaging. Avoid long paragraphs, use bullet points where helpful.`;

    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama-3.1-8b-instant', // Highly fast and cost-effective llama 3.1 model on Groq
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 800
    }, {
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const data = response.data;
    
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

// Debug logs endpoint
app.get('/api/debug-logs', (req, res) => {
  try {
    if (fs.existsSync(logPath)) {
      const content = fs.readFileSync(logPath, 'utf8');
      res.type('text/plain').send(content);
    } else {
      res.send('No log file found.');
    }
  } catch (err) {
    res.status(500).send('Error reading log: ' + err.message);
  }
});

// Fallback for SPA routing (only if frontend build exists, otherwise 404)
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../frontend/dist/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ success: false, error: 'Endpoint not found' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 earn.cool Express Backend is running on port ${PORT}`);
  console.log(`👉 Static frontend is served directly on: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
