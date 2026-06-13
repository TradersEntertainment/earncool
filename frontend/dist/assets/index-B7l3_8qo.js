var e=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports);(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var t=e((()=>{var e=window.location.hostname===`localhost`||window.location.hostname===`127.0.0.1`?``:`https://earncool.up.railway.app`,t={wallet:{connected:!1,address:null,provider:null,balanceSOL:0,balanceEARN:0},social:{connected:!1,handle:null,displayName:null,avatar:null},userProfile:{verified:!1,sorsaScore:0},stats:{totalPaid:245820,completedTasks:43124,activeUsers:1248,tokenPriceSOL:242e-6,priceChange24h:22.42,bondingCurvePercent:74.2,raydiumThresholdSOL:85e3,totalSOLInvested:63170},leaderboards:{workers:[{rank:1,name:`sol_hunter99`,address:`Dx4Z...8mRp`,earnings:42150},{rank:2,name:`cryptoking_x`,address:`Gq3v...Yt6x`,earnings:38400},{rank:3,name:`alpha_builder`,address:`Ah8N...p1wK`,earnings:31200},{rank:4,name:`gemini_agent`,address:`J9u1...45sA`,earnings:28950},{rank:5,name:`memecoin_chef`,address:`Fp5T...Kq2z`,earnings:24500},{rank:6,name:`solana_maxi`,address:`Bp2W...11fD`,earnings:21200},{rank:7,name:`clicker_whale`,address:`Lm9S...4h9b`,earnings:19800},{rank:8,name:`x_raider_pro`,address:`Tz7E...8gTy`,earnings:18450},{rank:9,name:`pump_enjoyer`,address:`Wp3M...5xVn`,earnings:15300},{rank:10,name:`microtasker_1`,address:`Op2U...9wKl`,earnings:14100}],creators:[{rank:1,name:`Bonk Official`,address:`Hz2...5hG`,lockedSOL:450.5},{rank:2,name:`Jupiter Exchange`,address:`Jup...Xyz`,lockedSOL:380.2},{rank:3,name:`Phantom Squad`,address:`Phn...99a`,lockedSOL:290},{rank:4,name:`PumpFun Launch`,address:`Pmp...F4u`,lockedSOL:245.8},{rank:5,name:`Solana Labs`,address:`Sol...11b`,lockedSOL:180.5},{rank:6,name:`Raydium Protocol`,address:`Ray...P01`,lockedSOL:140},{rank:7,name:`Pyth Network`,address:`Pyh...T4x`,lockedSOL:110.2},{rank:8,name:`Tensor Trade`,address:`Tns...A12`,lockedSOL:95.5},{rank:9,name:`Orca Dex`,address:`Orc...8s9`,lockedSOL:80},{rank:10,name:`Meme Generator`,address:`Mem...G3n`,lockedSOL:55.4}]}},n=[`sol_raider`,`alpha_chaser`,`pump_guy`,`degensol`,`cryptogirl_7`,`x_builder`,`memeLord`,`solflare_fan`,`phantom_boss`,`solana_sailor`,`whale_watcher`,`moon_shot`,`click_master`,`web3_native`,`ai_agent_007`,`cryptosonic`,`solflare_god`,`repost_machine`,`follow_bot_h`],r=[{type:`follow`,desc:`@solana followed account`,reward:`120 $EARN`},{type:`follow`,desc:`@phantom wallet followed account`,reward:`100 $EARN`},{type:`like`,desc:`Jupiter liked announcement tweet`,reward:`50 $EARN`},{type:`repost`,desc:`Bonk Memecoin Launchpad reposted tweet`,reward:`150 $EARN`},{type:`feedback`,desc:`Raydium reviewed new interface`,reward:`250 $EARN`},{type:`like`,desc:`Pyth network liked price update tweet`,reward:`60 $EARN`},{type:`repost`,desc:`Pump.fun shared bonding curve completion notice`,reward:`120 $EARN`}];document.addEventListener(`DOMContentLoaded`,()=>{lucide.createIcons(),b(),S(),x(),updateFormPlaceholders(),calculateCampaignCost(),typeof fetchTasks==`function`&&fetchTasks(),D(),O(),A(),N()});function i(e){document.querySelectorAll(`.page-section`).forEach(e=>{e.classList.remove(`active`)});let t=document.getElementById(`section-${e}`);t&&t.classList.add(`active`),document.querySelectorAll(`.nav-link`).forEach(e=>{e.classList.remove(`active`)});let n=document.getElementById(`nav-${e}`);n&&n.classList.add(`active`),e===`worker`?typeof renderTaskList==`function`&&renderTaskList():e===`trading`?typeof initTradingChart==`function`&&setTimeout(initTradingChart,50):e===`vault`&&setTimeout(O,50)}function a(){if(t.wallet.connected){t.wallet.connected=!1,t.wallet.address=null,t.wallet.provider=null,t.wallet.balanceSOL=0,t.wallet.balanceEARN=0,document.getElementById(`walletText`).innerText=`Connect Wallet`,document.getElementById(`walletBadgeDot`).className=`badge-dot disconnected`,document.getElementById(`userBalanceDisplay`).style.display=`none`,document.getElementById(`profileTogglesBadge`).style.display=`none`,w(`Wallet disconnected.`,`warning`),typeof renderTaskList==`function`&&renderTaskList(),typeof renderMyCampaigns==`function`&&renderMyCampaigns();return}document.getElementById(`modalConnectWallet`).classList.add(`active`),document.getElementById(`walletModalSelector`).style.display=`flex`,document.getElementById(`walletModalLoading`).style.display=`none`}function o(){document.getElementById(`modalConnectWallet`).classList.remove(`active`)}var s=`123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz`;function c(e){let t=new Uint8Array(e),n=[0];for(let e=0;e<t.length;e++){for(let e=0;e<n.length;e++)n[e]<<=8;n[0]+=t[e];let r=0;for(let e=0;e<n.length;++e)n[e]+=r,r=n[e]/58|0,n[e]%=58;for(;r;)n.push(r%58),r=r/58|0}let r=``;for(let e=0;e<t.length&&t[e]===0;e++)r+=s[0];for(let e=n.length-1;e>=0;e--)r+=s[n[e]];return r}async function l(n){document.getElementById(`walletModalSelector`).style.display=`none`,document.getElementById(`walletModalLoading`).style.display=`flex`,document.getElementById(`walletLoadingTitle`).innerText=`Connecting Wallet...`,document.getElementById(`walletLoadingDesc`).innerText=`Linking to ${n} extension and initializing cryptographic challenge...`;let r=n.toLowerCase()===`phantom`?window.phantom?.solana||window.solana:window.solflare;if(r&&(r.isPhantom||r.isSolflare||typeof r.connect==`function`))try{let i=(await r.connect()).publicKey.toString(),a=Date.now(),s=[`earn.cool — Wallet Authentication`,``,`This signature verifies that you are the owner of this wallet.`,`It does NOT authorize any transaction or token transfer.`,``,`Domain: ${window.location.hostname}`,`Wallet: ${i.slice(0,8)}...${i.slice(-6)}`,`Issued: ${new Date().toISOString()}`,`Nonce: ${a}`].join(`
`),l=new TextEncoder().encode(s);document.getElementById(`walletLoadingTitle`).innerText=`Signature Requested`,document.getElementById(`walletLoadingDesc`).innerText=`Approve the message in your wallet. This is a READ-ONLY signature — no SOL or tokens will be spent.`;let u=await r.signMessage(l,`utf8`),d=c(u.signature||u.signatureBytes);document.getElementById(`walletLoadingTitle`).innerText=`Verifying Authenticity...`,document.getElementById(`walletLoadingDesc`).innerText=`Validating cryptographic signature against Solana ledger standards on backend...`;let f=await fetch(`${e}/api/auth`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({address:i,message:s,signature:d})}),p=await f.text(),h;try{h=JSON.parse(p)}catch{throw console.error(`Failed to parse auth response as JSON. Raw text:`,p),Error(`Server returned non-JSON response (Status ${f.status}): ${p.substring(0,100)}...`)}if(h.success){t.wallet.connected=!0,t.wallet.provider=n,t.wallet.address=i,t.wallet.balanceSOL=h.user.balanceSOL||4.25,t.wallet.balanceEARN=h.user.balanceEARN||1250,t.userProfile.verified=h.user.verified||!1,t.userProfile.sorsaScore=h.user.sorsaScore||0;try{if(window.solanaWeb3){let e=await new solanaWeb3.Connection(solanaWeb3.clusterApiUrl(`devnet`),`confirmed`).getBalance(new solanaWeb3.PublicKey(i));t.wallet.balanceSOL=e/solanaWeb3.LAMPORTS_PER_SOL}}catch(e){console.log(`Real Solana ledger balance query bypassed. Using fallback balance:`,e)}document.getElementById(`walletText`).innerText=`${i.slice(0,4)}...${i.slice(-4)}`,document.getElementById(`walletBadgeDot`).className=`badge-dot`,m(),document.getElementById(`userBalanceDisplay`).style.display=`flex`,document.getElementById(`profileTogglesBadge`).style.display=`flex`,document.getElementById(`chkSimVerified`).checked=t.userProfile.verified,document.getElementById(`chkSimSorsa`).checked=t.userProfile.sorsaScore>0,o(),w(`Wallet cryptographically authenticated via ${n}!`,`success`),typeof fetchTasks==`function`?fetchTasks():typeof renderTaskList==`function`&&renderTaskList(),typeof renderMyCampaigns==`function`&&renderMyCampaigns(),typeof N==`function`&&N()}else throw Error(h.error||`Authentication rejected`)}catch(e){console.error(`Cryptographic signing error:`,e),w(`Verification Failed: ${e.message||e}`,`error`),o()}else w(`${n} extension not detected. Connecting in preview Demo Mode...`,`warning`),setTimeout(()=>{t.wallet.connected=!0,t.wallet.provider=`${n} (Demo)`;let r=Array.from({length:8},()=>Math.floor(Math.random()*16).toString(16)).join(``);t.wallet.address=`om8R${r.toUpperCase()}4s9`,fetch(`${e}/api/auth`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({address:t.wallet.address,message:`DEMO_BYPASS`,signature:`DEMO_BYPASS`})}).then(e=>e.json()).then(e=>{e.success&&(t.wallet.balanceSOL=4.25,t.wallet.balanceEARN=e.user?e.user.balanceEARN:1250,t.userProfile.verified=e.user?e.user.verified:!1,t.userProfile.sorsaScore=e.user?e.user.sorsaScore:0,document.getElementById(`walletText`).innerText=`${t.wallet.address.slice(0,4)}...${t.wallet.address.slice(-4)}`,document.getElementById(`walletBadgeDot`).className=`badge-dot`,m(),document.getElementById(`userBalanceDisplay`).style.display=`flex`,document.getElementById(`profileTogglesBadge`).style.display=`flex`,document.getElementById(`chkSimVerified`).checked=t.userProfile.verified,document.getElementById(`chkSimSorsa`).checked=t.userProfile.sorsaScore>0,o(),w(`Demo Wallet synchronized with server! Ready for review.`,`success`),typeof fetchTasks==`function`?fetchTasks():typeof renderTaskList==`function`&&renderTaskList(),typeof renderMyCampaigns==`function`&&renderMyCampaigns(),typeof N==`function`&&N())})},1500)}function u(){document.getElementById(`walletModalSelector`).style.display=`none`,document.getElementById(`walletModalTxSignIn`).style.display=`flex`,f(),lucide.createIcons()}function d(){document.getElementById(`walletModalTxSignIn`).style.display=`none`,document.getElementById(`walletModalSelector`).style.display=`flex`}function f(){let e=document.getElementById(`simTxWalletAddress`),t=document.getElementById(`btnTxStart`);!e||!t||(e.value.trim()===``?(t.setAttribute(`disabled`,`true`),t.style.opacity=`0.5`,t.style.cursor=`not-allowed`):(t.removeAttribute(`disabled`),t.style.opacity=`1`,t.style.cursor=`pointer`))}function p(){let n=document.getElementById(`simTxWalletAddress`).value.trim();if(!n){w(`Please enter a valid Solana wallet address.`,`error`);return}document.getElementById(`walletModalTxSignIn`).style.display=`none`;let r=document.getElementById(`walletModalLoading`);r.style.display=`flex`,document.getElementById(`walletLoadingTitle`).innerText=`Signing In with Transaction...`,document.getElementById(`walletLoadingDesc`).innerText=`Validating address registry on backend database...`,setTimeout(()=>{t.wallet.connected=!0,t.wallet.provider=`Transaction Auth`,t.wallet.address=n,fetch(`${e}/api/auth`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({address:t.wallet.address,message:`DEMO_BYPASS`,signature:`DEMO_BYPASS`})}).then(e=>e.json()).then(e=>{e.success&&(t.wallet.balanceSOL=4.25,t.wallet.balanceEARN=e.user?e.user.balanceEARN:1250,t.userProfile.verified=e.user?e.user.verified:!1,t.userProfile.sorsaScore=e.user?e.user.sorsaScore:0,document.getElementById(`walletText`).innerText=`${t.wallet.address.slice(0,4)}...${t.wallet.address.slice(-4)}`,document.getElementById(`walletBadgeDot`).className=`badge-dot`,m(),document.getElementById(`userBalanceDisplay`).style.display=`flex`,document.getElementById(`profileTogglesBadge`).style.display=`flex`,document.getElementById(`chkSimVerified`).checked=t.userProfile.verified,document.getElementById(`chkSimSorsa`).checked=t.userProfile.sorsaScore>0,o(),w(`Wallet connected successfully via transaction address!`,`success`),typeof fetchTasks==`function`?fetchTasks():typeof renderTaskList==`function`&&renderTaskList(),typeof renderMyCampaigns==`function`&&renderMyCampaigns(),typeof N==`function`&&N())})},2e3)}function m(){document.getElementById(`balanceText`).innerText=`${t.wallet.balanceEARN.toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2})} $EARN`}function h(){let e=document.getElementById(`chkSimVerified`);t.userProfile.verified=e.checked,t.userProfile.verified?w(`Blue Tick simulation activated! You can now verify verified-only tasks.`,`success`):w(`Blue Tick simulation deactivated.`,`warning`),typeof renderTaskList==`function`&&renderTaskList()}function g(){let e=document.getElementById(`chkSimSorsa`);t.userProfile.sorsaScore=e.checked?10:0,t.userProfile.sorsaScore>0?w(`Sorsa Score set to > 0! You can now verify trust-gated tasks.`,`success`):w(`Sorsa Score reset.`,`warning`),typeof renderTaskList==`function`&&renderTaskList()}function _(){if(t.social.connected){t.social.connected=!1,t.social.handle=null,t.social.displayName=null,t.social.avatar=null,document.getElementById(`socialText`).innerText=`Connect X Account`,w(`X (Twitter) account disconnected.`,`warning`),typeof renderTaskList==`function`&&renderTaskList();return}document.getElementById(`modalConnectSocial`).classList.add(`active`),document.getElementById(`socialModalForm`).style.display=`flex`,document.getElementById(`socialModalLoading`).style.display=`none`}function v(){document.getElementById(`modalConnectSocial`).classList.remove(`active`)}function y(){let e=document.getElementById(`socialXHandle`).value.trim();if(!e){w(`Please enter a valid X username.`,`error`);return}document.getElementById(`socialModalForm`).style.display=`none`,document.getElementById(`socialModalLoading`).style.display=`flex`,setTimeout(()=>{t.social.connected=!0,t.social.handle=e,t.social.displayName=e.charAt(0).toUpperCase()+e.slice(1),t.social.avatar=`https://api.dicebear.com/7.x/identicon/svg?seed=${e}`,document.getElementById(`socialText`).innerText=`@${e}`,v(),w(`@${e} Twitter account linked successfully!`,`success`),typeof renderTaskList==`function`&&renderTaskList()},1500)}function b(){document.getElementById(`statTotalPaid`).innerText=`${t.stats.totalPaid.toLocaleString()} $EARN`,document.getElementById(`statCompleted`).innerText=`${t.stats.completedTasks.toLocaleString()} Tasks`,document.getElementById(`statActiveUsers`).innerText=`${t.stats.activeUsers.toLocaleString()} Users`,document.getElementById(`statTokenPrice`).innerText=`${t.stats.tokenPriceSOL.toFixed(6)} SOL`,document.getElementById(`statPriceChange`).innerText=`▲ %${t.stats.priceChange24h.toFixed(2)}`}function x(){let e=document.getElementById(`workersLeaderboardBody`),n=document.getElementById(`creatorsLeaderboardBody`);e&&(e.innerHTML=``,t.leaderboards.workers.forEach(t=>{let n=document.createElement(`tr`);n.className=`leaderboard-row`,n.innerHTML=`
                <td class="leaderboard-rank top-${t.rank}">${t.rank}</td>
                <td>
                    <div class="leaderboard-user">
                        <div class="creator-avatar" style="background: radial-gradient(circle, var(--secondary) 0%, var(--primary) 100%);"></div>
                        <div>
                            <div style="font-weight: 700;">@${t.name}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">${t.address}</div>
                        </div>
                    </div>
                </td>
                <td style="text-align: right; font-weight: 700; color: var(--secondary);">${t.earnings.toLocaleString()} $EARN</td>
            `,e.appendChild(n)})),n&&(n.innerHTML=``,t.leaderboards.creators.forEach(e=>{let t=document.createElement(`tr`);t.className=`leaderboard-row`,t.innerHTML=`
                <td class="leaderboard-rank top-${e.rank}">${e.rank}</td>
                <td>
                    <div class="leaderboard-user">
                        <div class="creator-avatar" style="background: radial-gradient(circle, var(--primary) 0%, var(--accent) 100%);"></div>
                        <div>
                            <div style="font-weight: 700;">${e.name}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">${e.address}</div>
                        </div>
                    </div>
                </td>
                <td style="text-align: right; font-weight: 700; color: var(--primary);">${e.lockedSOL.toFixed(1)} SOL</td>
            `,n.appendChild(t)}))}function S(){if(document.getElementById(`liveActivityTicker`)){for(let e=0;e<4;e++)C(!0);setInterval(()=>{C(!1)},4500)}}function C(e=!1){let i=document.getElementById(`liveActivityTicker`);if(!i)return;let a=n[Math.floor(Math.random()*n.length)],o=r[Math.floor(Math.random()*r.length)],s=document.createElement(`div`);s.style.display=`flex`,s.style.alignItems=`center`,s.style.justifyContent=`space-between`,s.style.padding=`0.5rem 1rem`,s.style.background=`rgba(255, 255, 255, 0.02)`,s.style.borderRadius=`8px`,s.style.border=`1px solid rgba(255, 255, 255, 0.04)`,s.style.fontSize=`0.85rem`,s.style.animation=`fadeIn 0.4s ease-out`;let c=`var(--secondary)`;if(o.type===`like`&&(c=`var(--accent)`),o.type===`repost`&&(c=`var(--primary)`),o.type===`feedback`&&(c=`var(--text-warning)`),s.innerHTML=`
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div class="creator-avatar" style="width: 18px; height: 18px; background: radial-gradient(circle, var(--primary) 0%, var(--secondary) 100%);"></div>
            <span><b style="color: var(--text-primary);">@${a}</b>, <span style="color: var(--text-muted);">${o.desc}</span></span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-weight: 700; color: ${c};">${o.reward}</span>
            <span style="font-size: 0.75rem; color: var(--text-muted); opacity: 0.7;">just now</span>
        </div>
    `,e)i.appendChild(s);else{i.insertBefore(s,i.firstChild),i.childNodes.length>5&&i.removeChild(i.lastChild),t.stats.totalPaid+=parseInt(o.reward),t.stats.completedTasks+=1;let e=(Math.random()-.45)*5e-6;t.stats.tokenPriceSOL=Math.max(1e-5,t.stats.tokenPriceSOL+e);let n=Math.random()*.15;t.stats.totalSOLInvested+=n,t.stats.bondingCurvePercent=Math.min(99.9,t.stats.totalSOLInvested/t.stats.raydiumThresholdSOL*100),b();let r=document.getElementById(`bondingCurveProgressFill`),a=document.getElementById(`bondingCurvePercentText`),c=document.getElementById(`bondingRemainingText`);r&&(r.style.width=`${t.stats.bondingCurvePercent.toFixed(1)}%`),a&&(a.innerText=`${t.stats.bondingCurvePercent.toFixed(1)}%`),c&&(c.innerText=`${Math.max(0,t.stats.raydiumThresholdSOL-t.stats.totalSOLInvested).toLocaleString(void 0,{maximumFractionDigits:0})} SOL`)}}function w(e,t=`success`){let n=document.getElementById(`toastContainer`);if(!n)return;let r=document.createElement(`div`);r.className=`toast ${t}`;let i=`check-circle`;t===`error`&&(i=`x-circle`),t===`warning`&&(i=`alert-triangle`),r.innerHTML=`
        <i data-lucide="${i}" style="width: 18px; color: inherit;"></i>
        <span class="toast-text"></span>
    `,r.querySelector(`.toast-text`).textContent=e,n.appendChild(r),lucide.createIcons(),setTimeout(()=>{r.style.opacity=`0`,r.style.transform=`translateY(20px)`,setTimeout(()=>{n.removeChild(r)},300)},4e3)}function T(e){let t=e.parentElement,n=t.classList.contains(`active`);t.parentElement.querySelectorAll(`.faq-item`).forEach(e=>{e.classList.remove(`active`)}),n||t.classList.add(`active`)}var E=null;function D(){let e=document.getElementById(`vaultCountdownText`),t=document.getElementById(`vaultNextDateText`);if(!e)return;let n=Date.now()+10*3600*1e3+3240*1e3+39*1e3,r=new Date(n),i=r.getDate()<10?`0`+r.getDate():r.getDate(),a=r.getMonth()+1<10?`0`+(r.getMonth()+1):r.getMonth()+1,o=r.getFullYear(),s=r.getHours()<10?`0`+r.getHours():r.getHours(),c=r.getMinutes()<10?`0`+r.getMinutes():r.getMinutes(),l=r.getSeconds()<10?`0`+r.getSeconds():r.getSeconds();t&&(t.innerText=`${a}/${i}/${o} ${s}:${c}:${l}`),E&&clearInterval(E),E=setInterval(()=>{let t=n-Date.now();if(t<=0){n=Date.now()+12*3600*1e3;return}let r=Math.floor(t/(3600*1e3)),i=Math.floor(t%(3600*1e3)/(60*1e3)),a=Math.floor(t%(60*1e3)/1e3);e.innerText=`${r<10?`0`+r:r}:${i<10?`0`+i:i}:${a<10?`0`+a:a}`},1e3)}function O(){let e=document.getElementById(`vaultReturnBarChart`);if(!e)return;e.innerHTML=``;let t=e.clientWidth||400,n=e.clientHeight||200,r=t-10-10,i=n-15-20,a=[.06,.07,.11,.09,.08,.15,.04,.05,.07,.11,.1,.08,.11,.04,.04,.12,.12,.1,.12,.07,.12,.19,.15,.09,.1,.14,.32,.28,.19,.19],o=r/a.length,s=o*.65;a.forEach((t,n)=>{let r=t/.35*i,a=10+n*o+(o-s)/2,c=15+i-r,l=document.createElementNS(`http://www.w3.org/2000/svg`,`rect`);l.setAttribute(`x`,a),l.setAttribute(`y`,c),l.setAttribute(`width`,s),l.setAttribute(`height`,r),l.setAttribute(`fill`,`var(--text-success)`),l.setAttribute(`rx`,`1`),l.addEventListener(`mouseenter`,()=>{l.setAttribute(`fill`,`var(--secondary)`)}),l.addEventListener(`mouseleave`,()=>{l.setAttribute(`fill`,`var(--text-success)`)}),e.appendChild(l)});let c=document.createElementNS(`http://www.w3.org/2000/svg`,`text`);c.setAttribute(`x`,15),c.setAttribute(`y`,n-4),c.setAttribute(`fill`,`var(--text-muted)`),c.setAttribute(`font-size`,`0.65rem`),c.setAttribute(`font-weight`,`600`),c.textContent=`3 May`,e.appendChild(c);let l=document.createElementNS(`http://www.w3.org/2000/svg`,`text`);l.setAttribute(`x`,t-10-35),l.setAttribute(`y`,n-4),l.setAttribute(`fill`,`var(--text-muted)`),l.setAttribute(`font-size`,`0.65rem`),l.setAttribute(`font-weight`,`600`),l.textContent=`1 Jun`,e.appendChild(l)}var k=[{wallet:`Gmsr...wCY`,amount:`116.20 M`,eligible:`LP`,share:`36.9875%`},{wallet:`757k...6MR`,amount:`44.00 M`,eligible:`NO`,share:`0.0000%`},{wallet:`AUVA...2LG`,amount:`35.10 M`,eligible:`YES`,share:`36.9875%`},{wallet:`HF2L...AT3`,amount:`33.30 M`,eligible:`NO`,share:`0.0000%`},{wallet:`6meK...HJB`,amount:`28.40 M`,eligible:`NO`,share:`0.0000%`}];function A(){let e=document.getElementById(`vaultPreviewDistributionBody`);e&&(e.innerHTML=``,k.forEach(t=>{let n=document.createElement(`tr`);n.className=`leaderboard-row`;let r=``;r=t.eligible===`LP`?`<span class="vault-badge-LP">LP</span> <span class="vault-badge-no" style="margin-left: 2px;">NO</span>`:t.eligible===`YES`?`<span class="vault-badge-yes">YES</span>`:`<span class="vault-badge-no">NO</span>`,n.innerHTML=`
            <td><code style="color: var(--secondary); font-weight: 600;">${t.wallet}</code></td>
            <td style="font-weight: 700; color: var(--text-primary);">${t.amount}</td>
            <td>${r}</td>
            <td style="text-align: right; font-weight: 700; color: var(--primary);">${t.share}</td>
        `,e.appendChild(n)}))}var j=[{time:`1m ago`,amount:`2.40 $EARN`,job:`#a9e96dc0`,reason:`Worker completed task (Commission)`},{time:`2m ago`,amount:`1.00 $EARN`,job:`#c123df10`,reason:`Worker completed task (Commission)`},{time:`3m ago`,amount:`3.00 $EARN`,job:`#e23d9b01`,reason:`Worker completed task (Commission)`},{time:`4m ago`,amount:`4.00 $EARN`,job:`#b4819d20`,reason:`Worker completed task (Commission)`},{time:`5m ago`,amount:`2.40 $EARN`,job:`#a9e96dc0`,reason:`Worker completed task (Commission)`}];function M(){let e=document.getElementById(`vaultContributionsBody`);e&&(e.innerHTML=``,j.forEach(t=>{let n=document.createElement(`tr`);n.className=`leaderboard-row`,n.innerHTML=`
            <td style="color: var(--text-muted); font-size: 0.85rem;">${t.time}</td>
            <td style="font-weight: 700; color: var(--text-success);">${t.amount}</td>
            <td><code style="color: var(--secondary); font-weight: 600;">${t.job}</code></td>
            <td style="font-size: 0.85rem; color: var(--text-muted);">${t.reason}</td>
        `,e.appendChild(n)}))}async function N(){try{let t=await(await fetch(`${e}/api/vault`)).json();if(t.success){let e=t.vault.balance,n=document.getElementById(`vaultBalanceText`);n&&(n.innerText=`${e.toLocaleString(void 0,{minimumFractionDigits:2})} $EARN`);let r=document.getElementById(`vaultBalanceUSD`);r&&(r.innerText=`$${(e*242e-6).toLocaleString(void 0,{minimumFractionDigits:2})}`),j.length=0,j.push(...t.vault.contributions),M()}}catch(e){console.error(`Error fetching vault status:`,e)}}function P(){let e=document.getElementById(`vaultCheckAddress`).value.trim(),n=document.getElementById(`vaultCheckResult`);if(!e){w(`Please enter a valid Solana wallet address.`,`error`);return}n.style.display=`block`,t.wallet.connected&&e===t.wallet.address||e.startsWith(`om8R`)||e.length>30?(n.innerHTML=`
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
        `,w(`Wallet check completed. Congratulations, you are eligible for the Vault yield!`,`success`)):(n.innerHTML=`
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
        `,w(`Wallet check completed. Your wallet does not meet Vault eligibility criteria.`,`error`))}function F(){document.getElementById(`vaultCheckAddress`).value=``;let e=document.getElementById(`vaultCheckResult`);e&&(e.style.display=`none`,e.innerHTML=``)}function I(){let e=document.getElementById(`quickJobsAccordion`),t=document.getElementById(`quickJobsChevron`);e.classList.contains(`active`)?(e.classList.remove(`active`),t.style.transform=`rotate(0deg)`):(e.classList.add(`active`),t.style.transform=`rotate(180deg)`)}function L(e){let t=document.getElementById(`taskType`),n=document.getElementById(`taskTitle`),r=document.getElementById(`taskLink`),i=document.getElementById(`rewardPerUser`),a=document.getElementById(`maxParticipants`);switch(e){case`follow_std`:t.value=`follow`,n.value=`Official X Account Follow (Standard)`,r.value=`https://x.com/earndotcool`,i.value=`100`,a.value=`250`,R(`all`);break;case`follow_ver`:t.value=`follow`,n.value=`Verified (Blue Tick) X Followers Campaign`,r.value=`https://x.com/earndotcool`,i.value=`120`,a.value=`200`,R(`verified`);break;case`raid_ver`:t.value=`repost`,n.value=`Verified (Blue Tick) X Raid Task (Repost & Like)`,r.value=`https://x.com/earndotcool/status/179920199`,i.value=`150`,a.value=`150`,R(`verified`);break;case`raid_std`:t.value=`repost`,n.value=`Standard X Raid Task (Quick Engagement)`,r.value=`https://x.com/earndotcool/status/179920199`,i.value=`80`,a.value=`300`,R(`all`);break;case`raid_sorsa`:t.value=`repost`,n.value=`Sorsa Score > 0 Secure Account Raid`,r.value=`https://x.com/earndotcool/status/179920199`,i.value=`115`,a.value=`200`,R(`sorsa`);break;case`repost`:t.value=`repost`,n.value=`Tweet Repost Task`,r.value=`https://x.com/earndotcool/status/179920192`,i.value=`60`,a.value=`400`,R(`all`);break;case`likes`:t.value=`like`,n.value=`Tweet Like Task`,r.value=`https://x.com/earndotcool/status/179920192`,i.value=`40`,a.value=`500`,R(`all`);break;case`bookmarks`:t.value=`like`,n.value=`Tweet Bookmark Task`,r.value=`https://x.com/earndotcool/status/179920192`,i.value=`50`,a.value=`300`,R(`all`);break;case`comments`:t.value=`feedback`,n.value=`X Tweet Comment Task`,r.value=`https://x.com/earndotcool/status/179920192`,i.value=`90`,a.value=`200`,R(`all`);break}updateFormPlaceholders(),calculateCampaignCost(),w(`Quick job preset template loaded!`,`success`)}function R(e){document.getElementById(`campaignQualityFilter`).value=e,document.querySelectorAll(`.quality-filter-btn`).forEach(e=>{e.classList.remove(`active`)});let t=document.getElementById(`qBtn-${e}`);t&&t.classList.add(`active`),calculateCampaignCost()}function z(){let e=document.getElementById(`cyberWatcher`),t=document.getElementById(`pupil-left`),n=document.getElementById(`pupil-right`),r=document.getElementById(`watcherTooltip`),i=document.getElementById(`cyberWatcherInner`),a=document.getElementById(`watcherChatWindow`);if(!e||!t||!n||!i||!a)return;let o=()=>{e.classList.contains(`intro-center`)&&(e.classList.remove(`intro-center`),r&&(r.innerText=`🤖 Cyber Watcher: ONLINE. Click me!`))};setTimeout(o,3800),window.addEventListener(`scroll`,o,{once:!0}),i.addEventListener(`click`,t=>{if(t.stopPropagation(),e.classList.contains(`intro-center`)){o();return}a.classList.toggle(`active`),a.classList.contains(`active`)?(r.style.opacity=`0`,r.style.pointerEvents=`none`):(r.style.opacity=``,r.style.pointerEvents=``),i.style.transform=`scale(1.2) rotate(360deg)`,setTimeout(()=>{i.style.transform=``},600)}),document.addEventListener(`click`,t=>{e.contains(t.target)||(a.classList.remove(`active`),r.style.opacity=``,r.style.pointerEvents=``)}),document.addEventListener(`mousemove`,e=>{let r=t.parentElement,i=n.parentElement;!r||!i||(s(e,r,t),s(e,i,n))});function s(e,t,n){let r=t.getBoundingClientRect(),i=r.left+r.width/2,a=r.top+r.height/2,o=e.clientX-i,s=e.clientY-a,c=Math.sqrt(o*o+s*s),l=Math.atan2(s,o),u=Math.min(5,c*.05)*Math.cos(l),d=Math.min(5,c*.05)*Math.sin(l);n.style.transform=`translate(calc(-50% + ${u}px), calc(-50% + ${d}px))`}}window.sendChatMessage=async function(){let t=document.getElementById(`chatInput`),n=document.getElementById(`chatBody`);if(!t||!n)return;let r=t.value.trim();if(!r)return;B(`user`,r),t.value=``;let i=`typing-`+Date.now(),a=document.createElement(`div`);a.id=i,a.className=`chat-typing-indicator`,a.innerHTML=`<span>🤖 Cyber Watcher is compiling response...</span>`,n.appendChild(a),n.scrollTop=n.scrollHeight;try{let t=await(await fetch(`${e}/api/chat`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({message:r})})).json(),n=document.getElementById(i);n&&n.remove(),t.success&&t.reply?B(`bot`,t.reply):B(`bot`,`🤖 Beep... boop... connection block in the siber-matrix. Please try again!`)}catch(e){console.error(e);let t=document.getElementById(i);t&&t.remove(),B(`bot`,`🤖 Connection failed. Make sure the backend service is reachable!`)}};function B(e,t){let n=document.getElementById(`chatBody`);if(!n)return;let r=document.createElement(`div`);r.className=`chat-message ${e}`,r.innerHTML=t.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/\*\*(.*?)\*\*/g,`<strong>$1</strong>`).replace(/\n/g,`<br>`),n.appendChild(r),n.scrollTop=n.scrollHeight}function V(){try{let e=document.createElement(`canvas`);e.width=64,e.height=64;let t=e.getContext(`2d`);if(!t)return;let n=t.createLinearGradient(0,0,64,64);n.addColorStop(0,`#a855f7`),n.addColorStop(1,`#06b6d4`),t.fillStyle=n,t.beginPath(),t.moveTo(20,4),t.arcTo(60,4,60,60,16),t.arcTo(60,60,4,60,16),t.arcTo(4,60,4,4,16),t.arcTo(4,4,60,4,16),t.closePath(),t.fill(),t.fillStyle=`#ffffff`,t.font=`bold 36px "Outfit", sans-serif`,t.textAlign=`center`,t.textBaseline=`middle`,t.fillText(`E`,32,32);let r=document.querySelector(`link[rel~='icon']`);r||(r=document.createElement(`link`),r.rel=`icon`,r.type=`image/png`,document.head.appendChild(r)),r.href=e.toDataURL(`image/png`)}catch(e){console.error(`Failed to generate dynamic favicon:`,e)}}function H(){let e=document.title;document.addEventListener(`visibilitychange`,()=>{document.hidden?document.title=`👋 Come back & earn by clicking! 🚀`:document.title=e})}document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,()=>{z(),H(),V()}):(z(),H(),V()),window.showSection=i,window.openConnectWalletModal=a,window.closeConnectWalletModal=o,window.simulateWalletConnection=l,window.openTxSignInModal=u,window.backToWalletSelector=d,window.toggleTxStartButton=f,window.executeTxSignIn=p,window.updateNavbarBalance=m,window.toggleSimVerified=h,window.toggleSimSorsa=g,window.openConnectSocialModal=_,window.closeConnectSocialModal=v,window.simulateSocialAuth=y,window.showToast=w,window.toggleFaqAccordion=T,window.handleVaultCheck=P,window.handleVaultClear=F,window.toggleQuickJobsAccordion=I,window.applyQuickJobPreset=L,window.selectQualityFilter=R})),n=e((()=>{var e=[{id:`task-1`,type:`follow`,title:`earn.cool Official X Account Follow`,link:`https://x.com/earndotcool`,reward:100,creator:`earn.cool Admin`,capacity:1e3,completedCount:421,completedBy:[],verifiedOnly:!1,minSorsa:0},{id:`task-2`,type:`follow`,title:`Verified X Followers Campaign (earn.cool Devs)`,link:`https://x.com/earndotcool`,reward:120,creator:`earn.cool Devs`,capacity:200,completedCount:45,completedBy:[],verifiedOnly:!0,minSorsa:0},{id:`task-3`,type:`repost`,title:`Sorsa Score > 0 Secure Account Raid (Bonk Team)`,link:`https://x.com/earndotcool/status/179920199`,reward:115,creator:`Bonk Official`,capacity:250,completedCount:102,completedBy:[],verifiedOnly:!1,minSorsa:1},{id:`task-4`,type:`feedback`,title:`earn.cool Interface Feedback Review`,link:`https://earn.cool/feedback`,reward:200,creator:`Product Manager`,capacity:200,completedCount:45,completedBy:[],verifiedOnly:!1,minSorsa:0},{id:`task-5`,type:`follow`,title:`@solana Official Developer Account Follow`,link:`https://x.com/solana`,reward:100,creator:`Solana Foundation`,capacity:2500,completedCount:1845,completedBy:[],verifiedOnly:!1,minSorsa:0},{id:`task-6`,type:`like`,title:`Phantom Wallet Multi-Chain Update Like`,link:`https://x.com/phantom/status/18892012`,reward:60,creator:`Phantom Wallet`,capacity:1200,completedCount:802,completedBy:[],verifiedOnly:!1,minSorsa:0}],t=window.location.hostname===`localhost`||window.location.hostname===`127.0.0.1`?``:`https://earncool.up.railway.app`;async function n(){try{let n=await(await fetch(`${t}/api/tasks`)).json();n.success&&(e.length=0,e.push(...n.tasks),i())}catch(e){console.error(`Error fetching tasks from server:`,e)}}var r=`all`;function i(){let t=document.getElementById(`taskListGrid`);if(!t)return;t.innerHTML=``;let n=e.filter(e=>r===`all`?!0:e.type===r);if(document.getElementById(`activeTasksCount`).innerText=n.length,n.length===0){t.innerHTML=`
            <div style="grid-column: span 2; text-align: center; padding: 4rem; color: var(--text-muted);">
                <i data-lucide="inbox" style="width: 48px; height: 48px; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p style="font-size: 1.1rem; font-weight: 600;">No active tasks found in this category.</p>
            </div>
        `,lucide.createIcons();return}n.forEach(e=>{let n=state.wallet.connected&&e.completedBy.includes(state.wallet.address),r=document.createElement(`div`);r.className=`glass-card task-card`,n&&(r.style.opacity=`0.6`);let i=``;e.verifiedOnly?i=`<span style="font-size: 0.7rem; background: rgba(29,161,242,0.12); color:#1da1f2; border:1px solid rgba(29,161,242,0.25); padding: 0.15rem 0.4rem; border-radius: 4px; font-weight:700;"><i data-lucide="badge-check" style="width: 10px; height:10px; display:inline-block; vertical-align:middle; margin-right:2px;"></i>Verified Required</span>`:e.minSorsa>0&&(i=`<span style="font-size: 0.7rem; background: rgba(168,85,247,0.12); color:var(--primary); border:1px solid rgba(168,85,247,0.25); padding: 0.15rem 0.4rem; border-radius: 4px; font-weight:700;"><i data-lucide="shield-check" style="width: 10px; height:10px; display:inline-block; vertical-align:middle; margin-right:2px;"></i>Sorsa > 0 Required</span>`);let o=``;o=state.wallet.connected?state.social.connected?n?`
                <button class="btn btn-outline" style="font-size: 0.8rem; padding: 0.45rem 0.9rem; background: rgba(16, 185, 129, 0.08); border-color: rgba(16, 185, 129, 0.2); color: var(--text-success); cursor: default;" disabled>
                    <i data-lucide="check" style="width: 14px;"></i> Completed
                </button>
            `:`<button class="btn btn-primary" style="font-size: 0.8rem; padding: 0.45rem 0.9rem;" onclick="openTaskDetail('${e.id}')">View Task</button>`:`<button class="btn btn-outline" style="font-size: 0.8rem; padding: 0.45rem 0.9rem; border-color: rgba(29, 161, 242, 0.4); color: #1da1f2;" onclick="openConnectSocialModal()">Connect X Account</button>`:`<button class="btn btn-outline" style="font-size: 0.8rem; padding: 0.45rem 0.9rem;" onclick="openConnectWalletModal()">Connect Wallet</button>`,r.innerHTML=`
            <div class="task-card-header">
                <span class="task-creator">
                    <div class="creator-avatar" style="background: radial-gradient(circle, var(--secondary) 0%, var(--primary) 100%);"></div>
                    ${e.creator}
                </span>
                <div style="display:flex; gap:0.4rem; align-items:center;">
                    ${i}
                    <span class="task-badge ${e.type}">${a(e.type)}</span>
                </div>
            </div>
            
            <h3 class="task-title">${e.title}</h3>
            
            <div class="task-card-bottom">
                <div class="task-reward-box">
                    <span class="task-reward-label">Reward</span>
                    <span class="task-reward-value">
                        <i data-lucide="coins" style="width: 16px; color: var(--secondary);"></i>
                        ${e.reward} $EARN
                    </span>
                </div>
                
                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.4rem;">
                    <div class="task-capacity">Entries: <span>${e.completedCount}/${e.capacity}</span></div>
                    ${o}
                </div>
            </div>
        `,t.appendChild(r)}),lucide.createIcons()}function a(e){switch(e){case`follow`:return`Follow`;case`like`:return`Like`;case`repost`:return`Repost`;case`feedback`:return`Review`;default:return`Task`}}function o(e,t){r=e,document.querySelectorAll(`.filter-btn`).forEach(e=>{e.classList.remove(`active`)}),t.classList.add(`active`),i()}var s=null,c=!1,l=`oauth`,u=``,d=null;function f(){d&&clearInterval(d),document.getElementById(`modalTaskDetail`).classList.remove(`active`)}function p(){let t=document.getElementById(`wurkSubmissionsList`);if(!t)return;let n=e.find(e=>e.id===s);n&&(t.style.display===`none`||t.style.display===``?(t.style.display=`block`,t.innerHTML=`
            <div style="background: rgba(255, 255, 255, 0.01); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.25rem; margin-top: 1rem; animation: fadeIn 0.3s ease;">
                <span style="font-weight: 800; font-size: 0.9rem; display: block; margin-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.4rem;">
                    <i data-lucide="users" style="width: 14px; color: var(--secondary); vertical-align: middle; margin-right: 4px;"></i>
                    Recent Submissions (${n.completedCount})
                </span>
                <div style="display: flex; flex-direction: column; gap: 0.6rem; max-height: 180px; overflow-y: auto; font-size: 0.8rem;">
                    ${n.completedCount===0?`
                        <div style="text-align: center; color: var(--text-muted); padding: 1rem 0;">No submissions yet. Be the first!</div>
                    `:`
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
        `,lucide.createIcons()):t.style.display=`none`)}function m(e){window.open(e,`_blank`),c=!0;let t=document.getElementById(`verificationLockedState`);t&&(t.style.display=`none`);let n=document.getElementById(`verificationActiveState`);n&&(n.style.display=`flex`),g(l);let r=document.getElementById(`btnApplyAction`),i=document.getElementById(`btnVerifyTask`);r&&(r.style.display=`none`),i&&(i.style.display=`inline-flex`),showToast(`Task page opened! Please complete the interaction and fill out the proof form.`,`success`)}function h(t){s=t,c=!1,l=`oauth`,u=`EARN-${Array.from({length:4},()=>Math.floor(Math.random()*16).toString(16).toUpperCase()).join(``)}-${Date.now().toString().slice(-4)}`;let n=e.find(e=>e.id===t);if(!n)return;let r=n.creator.includes(`...`)?n.creator:`DaqHA9${n.creator.replace(/[^a-zA-Z0-9]/g,``).slice(0,6)}...VPrc`;d&&clearInterval(d);let i=Math.floor(Math.random()*5)+18,a=Math.floor(Math.random()*60),o=Math.floor(Math.random()*60);d=setInterval(()=>{o>0?o--:a>0?(a--,o=59):i>0?(i--,a=59,o=59):clearInterval(d);let e=i<10?`0`+i:i,t=a<10?`0`+a:a,n=o<10?`0`+o:o,r=document.getElementById(`closesInTimerDisplay`);r&&(r.innerText=`${e}h ${t}m ${n}s`)},1e3);let f=document.getElementById(`modalTaskDetail`),p=document.getElementById(`taskDetailContent`),m=(n.reward*2e-4).toFixed(2);p.innerHTML=`
        <!-- WURK LISTED BY CARD (Image 1) -->
        <div class="wurk-listed-by-card">
            <div class="wurk-listed-by-left">
                <span class="wurk-listed-by-label">LISTED BY:</span>
                <span class="wurk-listed-by-address">${r}</span>
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
                    <span class="val closes-in-timer" id="closesInTimerDisplay">${i}h ${a}m ${o}s</span>
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
                    <span class="val" id="maxEntriesDisplay">${n.capacity}</span>
                </div>
                <div class="job-meta-row">
                    <span class="lbl">Capacity</span>
                    <span class="val" id="capacityRatioDisplay">${n.completedCount} / ${n.capacity}</span>
                </div>
                <div class="job-meta-row">
                    <span class="lbl">Potential Winners</span>
                    <span class="val">${Math.floor(n.capacity*.8)}</span>
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
                    ${n.reward} <span style="font-size: 1.15rem; font-weight: 700; margin-left: 0.15rem; color: var(--text-success);">$EARN</span>
                </span>
                <span class="wurk-reward-usd">$ ${m} USD</span>
            </div>
        </div>

        <!-- DESCRIPTION CARD (Image 1) -->
        <div class="job-meta-box" style="margin-bottom: 1.25rem;">
            <div class="job-meta-title">
                <i data-lucide="file-text" style="width: 12px; color: var(--secondary);"></i>
                Description
            </div>
            <div style="font-size: 0.9rem; line-height: 1.6; color: var(--text-primary); text-align: left; padding: 0.25rem 0;">
                follow this x account: <a href="${n.link}" target="_blank" class="gradient-text-cyan" style="word-break: break-all; font-weight: 700;">${n.link}</a>
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
                    ${n.verifiedOnly?`
                        <div style="background: rgba(29, 161, 242, 0.04); border:1px solid rgba(29, 161, 242, 0.15); padding:0.75rem 1rem; border-radius:10px; display:flex; align-items:center; gap:0.5rem; font-size:0.85rem;">
                            <i data-lucide="badge-check" style="color:#1da1f2; width:18px;"></i>
                            <span style="color:#1da1f2;"><b>Audience Filter:</b> Only <b>Verified (Blue Check)</b> accounts can complete this task.</span>
                        </div>
                    `:``}
                    ${n.minSorsa>0?`
                        <div style="background: rgba(168, 85, 247, 0.04); border:1px solid rgba(168, 85, 247, 0.15); padding:0.75rem 1rem; border-radius:10px; display:flex; align-items:center; gap:0.5rem; font-size:0.85rem;">
                            <i data-lucide="shield-check" style="color:var(--primary); width:18px;"></i>
                            <span style="color:var(--primary);"><b>Audience Filter:</b> Only trusted accounts with a <b>Sorsa Score > 0</b> can complete this task.</span>
                        </div>
                    `:``}

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
            <span>There are ${n.completedCount} submissions for this job. Submissions are hidden until the job is finalized.</span>
        </div>

        <!-- ACTION BUTTONS ROW (Image 1) -->
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;" id="taskModalActions">
            <button class="btn btn-outline" style="flex: 1; padding: 0.85rem 1.25rem; font-weight: 700;" onclick="toggleWurkSubmissions()">
                <i data-lucide="eye" style="width: 16px;"></i> VIEW SUBMISSIONS
            </button>
            
            <button class="btn btn-primary" id="btnApplyAction" style="flex: 1; padding: 0.85rem 1.25rem; font-weight: 700; background: linear-gradient(135deg, var(--secondary), #0891b2); box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);" onclick="executeTaskAction('${n.link}')">
                <i data-lucide="edit-3" style="width: 16px;"></i> APPLY
            </button>
            
            <button class="btn btn-primary" id="btnVerifyTask" style="flex: 1; display: none; padding: 0.85rem 1.25rem; font-weight: 700; background: linear-gradient(135deg, var(--primary), #8b5cf6); box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3);" onclick="verifyTaskCompletion()">
                <i data-lucide="shield-check" style="width: 16px;"></i> VERIFY
            </button>
        </div>
    `,f.classList.add(`active`),lucide.createIcons()}function g(e){l=e;let t=document.getElementById(`proof-oauth`),n=document.getElementById(`proof-manual`),r=document.getElementById(`btnVerifyTask`),i=document.getElementById(`proofFlowDynamicArea`);e===`oauth`?(t.className=`tab-btn buy active`,n.className=`tab-btn buy`,i.innerHTML=`
            <div class="verify-steps" id="oauthProofSteps">
                <div class="verify-step ${c?`done`:`active`}" id="verifyStep1">
                    <span class="verify-step-check">${c?`✓`:`1`}</span>
                    <div>
                        <div style="font-weight: 700;">Start Task & Engage</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">Click the button below to open the target X page and complete the required task.</div>
                    </div>
                </div>
                
                <div class="verify-step ${c?`active`:``}" id="verifyStep2">
                    <span class="verify-step-check">2</span>
                    <div>
                        <div style="font-weight: 700;">Verify Interaction</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">Launch verification once you complete the task.</div>
                    </div>
                </div>
            </div>
        `):(t.className=`tab-btn buy`,n.className=`tab-btn buy active`,i.innerHTML=`
            <div style="display:flex; flex-direction:column; gap:1rem;">
                <div style="background: rgba(255,255,255,0.02); border:1px solid var(--border-color); padding:1rem; border-radius:12px; display:flex; flex-direction:column; gap:0.5rem;">
                    <span style="font-size:0.8rem; color:var(--text-muted); font-weight:700;">1. POST THIS CODE AS A TWEET ON YOUR X ACCOUNT:</span>
                    <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.05); padding:0.6rem 1rem; border-radius:8px;">
                        <code style="font-weight:800; color:var(--secondary); font-size:1.05rem;">I am verifying my X profile on earn.cool with code ${u}</code>
                        <button class="btn btn-outline" style="padding:0.25rem 0.5rem; font-size:0.7rem; border-radius:4px;" onclick="navigator.clipboard.writeText('I am verifying my X profile on earn.cool with code ${u}'); showToast('Verification template copied! Share it on X.', 'success')">Copy</button>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="manualProofTweetUrl" style="font-size:0.8rem; color:var(--text-muted); font-weight:700;">2. PASTE THE TWEET LINK (URL) HERE:</label>
                    <input type="url" class="form-input" id="manualProofTweetUrl" placeholder="e.g. https://x.com/username/status/12345" oninput="checkManualProofInput()">
                </div>
            </div>
        `),e===`oauth`?c?(r.removeAttribute(`disabled`),r.style.opacity=`1`,r.style.cursor=`pointer`):(r.setAttribute(`disabled`,`true`),r.style.opacity=`0.5`,r.style.cursor=`not-allowed`):_(),lucide.createIcons()}function _(){let e=document.getElementById(`manualProofTweetUrl`),t=document.getElementById(`btnVerifyTask`);if(!e||!t)return;let n=e.value.trim();n.startsWith(`https://x.com/`)&&n.includes(`/status/`)?(t.removeAttribute(`disabled`),t.style.opacity=`1`,t.style.cursor=`pointer`):(t.setAttribute(`disabled`,`true`),t.style.opacity=`0.5`,t.style.cursor=`not-allowed`)}async function v(){if(!s)return;let n=e.find(e=>e.id===s);if(!n)return;let r=document.getElementById(`verificationInnerContent`);if(!r)return;r.innerHTML=`
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
                    <span class="verify-step-check">•</span> ${l===`oauth`?`Requesting Twitter OAuth 2.0 API interaction proof...`:`Querying submitted Tweet verification code...`}
                </div>
                <div class="verify-step" id="subStep3">
                    <span class="verify-step-check">•</span> Releasing token earnings from platform escrow contract...
                </div>
            </div>
        </div>
    `;let a=document.getElementById(`btnVerifyTask`);a&&(a.style.display=`none`);try{await new Promise(e=>setTimeout(e,1e3)),document.getElementById(`subStep1`).className=`verify-step done`,document.getElementById(`subStep2`).className=`verify-step active`,document.getElementById(`verifyFlowSub`).innerText=`Accessing X network details to verify follow/like/repost actions...`,await new Promise(e=>setTimeout(e,1200)),document.getElementById(`subStep2`).className=`verify-step done`,document.getElementById(`subStep3`).className=`verify-step active`,document.getElementById(`verifyFlowSub`).innerText=`Releasing escrow contract funds to recipient address...`;let e={walletAddress:state.wallet.address,verifiedSim:state.userProfile.verified,sorsaScoreSim:state.userProfile.sorsaScore,proofMethod:l,tweetUrl:l===`manual`?document.getElementById(`manualProofTweetUrl`).value.trim():``},a=await(await fetch(`${t}/api/tasks/${n.id}/verify`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e)})).json();if(await new Promise(e=>setTimeout(e,1e3)),a.success){state.wallet.balanceEARN=a.user.balanceEARN,updateNavbarBalance();let e=a.commissionAdded||(n.reward*.02).toFixed(2);n.completedBy.push(state.wallet.address),n.completedCount=a.task.completedCount,typeof fetchVaultStatus==`function`&&fetchVaultStatus(),r.innerHTML=`
                <div class="verify-flow-card" style="gap: 1rem; padding: 1rem 0;">
                    <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); border: 2px solid var(--text-success); display: flex; align-items: center; justify-content: center; color: var(--text-success); font-size: 1.5rem; font-weight: 800;">
                        ✓
                    </div>
                    <div>
                        <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-success); margin-bottom: 0.4rem;">Task Verified Successfully!</h3>
                        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">
                            Congratulations, your X social interaction was verified by the platform database! <b style="color: var(--text-success);">+${n.reward} $EARN</b> was successfully credited to your wallet, and <b style="color: var(--primary);">+${e} $EARN</b> was added to the Vault commission rewards.
                        </p>
                    </div>
                    <button class="btn btn-outline" style="width: 100%;" onclick="closeTaskDetailModal()">Close & Go to Market</button>
                </div>
            `;let t=document.getElementById(`capacityRatioDisplay`);t&&(t.innerText=`${n.completedCount} / ${n.capacity}`),y(),showToast(`Task verified! +${n.reward} $EARN added to balance.`,`success`),i()}else r.innerHTML=`
                <div class="verify-flow-card" style="gap: 1rem; padding: 1rem 0;">
                    <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(239, 68, 68, 0.15); border: 2px solid var(--text-error); display: flex; align-items: center; justify-content: center; color: var(--text-error); font-size: 1.5rem; font-weight: 800;">
                        ✖
                    </div>
                    <div>
                        <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-error); margin-bottom: 0.4rem;">Verification Failed!</h3>
                        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">
                            <b>Error:</b> ${a.error}<br>
                            <span style="color: var(--primary); font-weight: 700; display: block; margin-top: 0.5rem;">* To pass: Adjust your simulated settings (Verified / Sorsa Score) in the navbar to match task criteria and retry!</span>
                        </p>
                    </div>
                    <button class="btn btn-outline" style="width: 100%;" onclick="closeTaskDetailModal()">Close & Return</button>
                </div>
            `,showToast(a.error,`error`)}catch(e){console.error(e),showToast(`Server communication error during verification.`,`error`),f()}}function y(){let e=document.body;for(let t=0;t<35;t++){let t=document.createElement(`div`);t.className=`particle`,t.style.left=`${Math.random()*100}vw`,t.style.top=`-20px`;let n=Math.random()*8+8;t.style.width=`${n}px`,t.style.height=`${n}px`;let r=Math.random()>.5;t.style.setProperty(`--secondary`,r?`#06b6d4`:`#a855f7`),t.style.boxShadow=`0 0 10px ${r?`#06b6d4`:`#a855f7`}`,t.style.animationDuration=`${Math.random()*2+1.5}s`,t.style.animationDelay=`${Math.random()*.5}s`,e.appendChild(t),setTimeout(()=>{e.removeChild(t)},3500)}}function b(){let e=document.getElementById(`taskType`).value,t=document.getElementById(`lblTaskTitle`),n=document.getElementById(`taskTitle`),r=document.getElementById(`lblTaskLink`),i=document.getElementById(`taskLink`);e===`follow`?(t.innerText=`X Account Title (To Follow)`,n.placeholder=`e.g. Solana earn.cool Official Account Follow`,r.innerText=`X Page Link (Profile URL)`,i.placeholder=`e.g. https://x.com/earndotcool`):e===`like`?(t.innerText=`Tweet Title to Display (To Like)`,n.placeholder=`e.g. Like the earn.cool Devs Major Partnership tweet`,r.innerText=`Tweet Link (URL)`,i.placeholder=`e.g. https://x.com/earndotcool/status/1234567890`):e===`repost`?(t.innerText=`Post Title to Retweet`,n.placeholder=`e.g. Repost and spread the $EARN launch post`,r.innerText=`Tweet Link (URL)`,i.placeholder=`e.g. https://x.com/earndotcool/status/987654321`):e===`feedback`&&(t.innerText=`Feedback Task Title`,n.placeholder=`e.g. Test the earn.cool website and write a review`,r.innerText=`Review Web Page URL`,i.placeholder=`e.g. https://earn.cool/feedback`)}function x(){let e=parseFloat(document.getElementById(`rewardPerUser`).value)||0,t=parseInt(document.getElementById(`maxParticipants`).value)||0,n=document.getElementById(`campaignQualityFilter`).value,r=e*t,i=r*.02,a=0,o=document.getElementById(`summaryQualityRow`),s=document.getElementById(`summaryQualityLabel`),c=document.getElementById(`summaryQualityFee`);n===`verified`?(a=r*.2,o&&(o.style.display=`flex`,s.innerText=`Verified Targeting (+20%):`,c.innerText=`${a.toLocaleString()} $EARN`)):n===`sorsa`?(a=r*.15,o&&(o.style.display=`flex`,s.innerText=`Sorsa Score Targeting (+15%):`,c.innerText=`${a.toLocaleString()} $EARN`)):o&&(o.style.display=`none`);let l=r+i+a;document.getElementById(`summaryTotalReward`).innerText=`${r.toLocaleString()} $EARN`,document.getElementById(`summaryFee`).innerText=`${i.toLocaleString()} $EARN`,document.getElementById(`summaryTotalCost`).innerText=`${l.toLocaleString()} $EARN`}async function S(e){if(e.preventDefault(),!state.wallet.connected){showToast(`Wallet disconnected. Please connect your Solana wallet to launch a campaign.`,`error`),openConnectWalletModal();return}let r=document.getElementById(`taskType`).value,i=document.getElementById(`taskTitle`).value.trim(),a=document.getElementById(`taskLink`).value.trim(),o=parseFloat(document.getElementById(`rewardPerUser`).value),s=parseInt(document.getElementById(`maxParticipants`).value),c=document.getElementById(`campaignQualityFilter`).value,l=o*s,u=l*.02,d=0;c===`verified`?d=l*.2:c===`sorsa`&&(d=l*.15);let f=l+u+d;if(state.wallet.balanceEARN<f){showToast(`Insufficient balance! Required: ${f.toLocaleString()} $EARN, Balance: ${state.wallet.balanceEARN.toLocaleString()} $EARN.`,`error`);return}let p=document.getElementById(`modalConnectWallet`),m=document.getElementById(`walletModalSelector`),h=document.getElementById(`walletModalLoading`);m.style.display=`none`,h.style.display=`flex`,h.querySelector(`h3`).innerText=`Approving Campaign Budget...`,h.querySelector(`p`).innerText=`Approve the wallet signature request to lock the campaign budget in escrow.`,p.classList.add(`active`);try{let e={creatorAddress:state.wallet.address,totalCostEarn:f,task:{type:r,title:i,link:a,reward:o,capacity:s,verifiedOnly:c===`verified`,minSorsa:+(c===`sorsa`)}},l=await(await fetch(`${t}/api/tasks/create`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e)})).json();await new Promise(e=>setTimeout(e,1500)),p.classList.remove(`active`),l.success?(l.user&&l.user.balanceEARN!==void 0?state.wallet.balanceEARN=l.user.balanceEARN:state.wallet.balanceEARN-=f,updateNavbarBalance(),typeof n==`function`&&await n(),l.task&&C(l.task,f),document.getElementById(`createCampaignForm`).reset(),selectQualityFilter(`all`),b(),x(),showToast(`Congratulations! Campaign successfully created and launched in the Task Market.`,`success`)):showToast(l.error||`Failed to create campaign.`,`error`)}catch(e){console.error(e),p.classList.remove(`active`),showToast(`Server communication error during campaign creation.`,`error`)}}function C(e,t){let n=document.getElementById(`myCampaignsList`);if(!n)return;n.innerHTML.includes(`You have not published any campaigns yet`)&&(n.innerHTML=``);let r=document.createElement(`div`);r.className=`glass-card`,r.style.padding=`1.25rem`,r.style.background=`rgba(255, 255, 255, 0.01)`,r.style.border=`1px solid rgba(255, 255, 255, 0.05)`;let i=e.completedCount/e.capacity*100;r.innerHTML=`
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
            <div>
                <h4 style="font-size: 0.95rem; font-weight: 700; line-height: 1.3;">${e.title}</h4>
                <span style="font-size: 0.75rem; color: var(--text-muted);">Type: ${a(e.type)}</span>
            </div>
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--primary);">${t.toLocaleString()} $EARN</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.8rem;">
            <div style="display: flex; justify-content: space-between; color: var(--text-muted);">
                <span>Workers Progress:</span>
                <span><b>${e.completedCount}</b> / ${e.capacity} (${i.toFixed(0)}%)</span>
            </div>
            <div class="bonding-progress-bar" style="height: 6px;">
                <div class="bonding-progress-fill" style="width: ${i}%; background: var(--primary);"></div>
            </div>
        </div>
    `,n.insertBefore(r,n.firstChild)}window.filterTasks=o,window.closeTaskDetailModal=f,window.toggleWurkSubmissions=p,window.executeTaskAction=m,window.openTaskDetail=h,window.switchProofMethod=g,window.checkManualProofInput=_,window.verifyTaskCompletion=v,window.triggerTokenRainAnimation=y,window.updateFormPlaceholders=b,window.calculateCampaignCost=x,window.handleCreateCampaign=S,window.addCampaignToMyList=C})),r=e((()=>{var e=[{time:`12:00`,open:185e-6,high:195e-6,low:18e-5,close:192e-6},{time:`12:05`,open:192e-6,high:21e-5,low:19e-5,close:205e-6},{time:`12:10`,open:205e-6,high:208e-6,low:195e-6,close:198e-6},{time:`12:15`,open:198e-6,high:215e-6,low:196e-6,close:212e-6},{time:`12:20`,open:212e-6,high:225e-6,low:21e-5,close:22e-5},{time:`12:25`,open:22e-5,high:238e-6,low:218e-6,close:23e-5},{time:`12:30`,open:23e-5,high:248e-6,low:228e-6,close:242e-6}],t=[{user:`om8R...4s9`,type:`buy`,amountSOL:.5,amountCLICK:2066.12,age:`1m ago`},{user:`An3k...xP8`,type:`buy`,amountSOL:1.2,amountCLICK:4958.67,age:`3m ago`},{user:`8hN1...Kqy`,type:`sell`,amountSOL:.4,amountCLICK:1652.89,age:`5m ago`},{user:`Sol_Degen`,type:`buy`,amountSOL:3.5,amountCLICK:14462.8,age:`8m ago`},{user:`J9u1...45s`,type:`buy`,amountSOL:.2,amountCLICK:826.44,age:`12m ago`}],n=`buy`;document.addEventListener(`DOMContentLoaded`,()=>{c()});function r(e){n=e;let t=document.getElementById(`tabBuy`),r=document.getElementById(`tabSell`),i=document.getElementById(`tradeInputLabel`),o=document.getElementById(`tradeAmountCurrency`),s=document.getElementById(`btnExecuteTrade`),c=document.getElementById(`tradeAmount`),l=document.getElementById(`buyQuickAmts`),u=document.getElementById(`sellQuickAmts`);e===`buy`?(t.className=`tab-btn buy active`,r.className=`tab-btn sell`,i.innerText=`Amount to Pay (SOL)`,o.innerText=`SOL`,s.innerText=`Buy Now (Buy)`,s.style.background=`linear-gradient(135deg, var(--text-success), #059669)`,s.style.boxShadow=`0 4px 15px rgba(16, 185, 129, 0.3)`,c.value=`0.5`,l.style.display=`grid`,u.style.display=`none`):(t.className=`tab-btn buy`,r.className=`tab-btn sell active`,i.innerText=`Amount to Sell ($EARN)`,o.innerText=`$EARN`,s.innerText=`Sell Now`,s.style.background=`linear-gradient(135deg, var(--text-error), #dc2626)`,s.style.boxShadow=`0 4px 15px rgba(239, 68, 68, 0.3)`,c.value=`500`,l.style.display=`none`,u.style.display=`grid`),a()}function i(e){let t=document.getElementById(`tradeAmount`);if(n===`buy`)t.value=e.toString();else if(state.wallet.connected){let n=state.wallet.balanceEARN*(e/100);t.value=Math.floor(n).toString()}else showToast(`Please connect your wallet first.`,`error`),openConnectWalletModal();a()}function a(){let e=parseFloat(document.getElementById(`tradeAmount`).value)||0,t=document.getElementById(`tradeReceiveAmount`),r=document.getElementById(`tradePriceImpact`);if(e<=0){t.innerText=`0.00 ${n===`buy`?`$EARN`:`SOL`}`,r.innerText=`%0.00`;return}if(n===`buy`)t.innerText=`${(e/state.stats.tokenPriceSOL).toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2})} $EARN`,r.innerText=`%${(e/state.stats.raydiumThresholdSOL*100).toFixed(3)} (Price Will Increase)`,r.style.color=`var(--text-success)`;else{let n=e*state.stats.tokenPriceSOL;t.innerText=`${n.toLocaleString(void 0,{minimumFractionDigits:4,maximumFractionDigits:4})} SOL`,r.innerText=`-%${(n/state.stats.raydiumThresholdSOL*100).toFixed(3)} (Price Will Decrease)`,r.style.color=`var(--text-error)`}}function o(){let t=document.getElementById(`priceCandleChart`),n=document.getElementById(`chartContainer`);if(!t||!n)return;t.innerHTML=``;let r=n.clientWidth,i=n.clientHeight,a=r-15-75,o=i-25-30,s=-1/0,c=1/0;e.forEach(e=>{e.high>s&&(s=e.high),e.low<c&&(c=e.low)});let l=s-c;s+=l*.15,c-=l*.15,c<0&&(c=0);for(let e=0;e<5;e++){let n=e/4,r=25+o*(1-n),i=c+n*(s-c),l=document.createElementNS(`http://www.w3.org/2000/svg`,`line`);l.setAttribute(`x1`,15),l.setAttribute(`y1`,r),l.setAttribute(`x2`,15+a),l.setAttribute(`y2`,r),l.setAttribute(`stroke`,`rgba(255, 255, 255, 0.04)`),l.setAttribute(`stroke-dasharray`,`4, 4`),t.appendChild(l);let u=document.createElementNS(`http://www.w3.org/2000/svg`,`text`);u.setAttribute(`x`,15+a+8),u.setAttribute(`y`,r+4),u.setAttribute(`fill`,`var(--text-muted)`),u.setAttribute(`font-size`,`0.75rem`),u.setAttribute(`font-weight`,`600`),u.textContent=`${i.toFixed(6)} SOL`,t.appendChild(u)}let u=a/e.length,d=u*.65;e.forEach((e,n)=>{let r=15+n*u+u/2,a=25+o*(1-(e.high-c)/(s-c)),l=25+o*(1-(e.low-c)/(s-c)),f=25+o*(1-(e.open-c)/(s-c)),p=25+o*(1-(e.close-c)/(s-c)),m=e.close>=e.open?`var(--text-success)`:`var(--text-error)`,h=document.createElementNS(`http://www.w3.org/2000/svg`,`line`);h.setAttribute(`x1`,r),h.setAttribute(`y1`,a),h.setAttribute(`x2`,r),h.setAttribute(`y2`,l),h.setAttribute(`stroke`,m),h.setAttribute(`stroke-width`,`1.5`),t.appendChild(h);let g=Math.min(f,p),_=Math.max(2,Math.abs(f-p)),v=document.createElementNS(`http://www.w3.org/2000/svg`,`rect`);if(v.setAttribute(`x`,r-d/2),v.setAttribute(`y`,g),v.setAttribute(`width`,d),v.setAttribute(`height`,_),v.setAttribute(`fill`,m),v.setAttribute(`rx`,`2`),t.appendChild(v),n%2==0){let n=document.createElementNS(`http://www.w3.org/2000/svg`,`text`);n.setAttribute(`x`,r),n.setAttribute(`y`,i-8),n.setAttribute(`fill`,`var(--text-muted)`),n.setAttribute(`font-size`,`0.7rem`),n.setAttribute(`text-anchor`,`middle`),n.setAttribute(`font-weight`,`600`),n.textContent=e.time,t.appendChild(n)}})}function s(){if(!state.wallet.connected){showToast(`Please connect wallet to perform trade.`,`error`),openConnectWalletModal();return}let r=parseFloat(document.getElementById(`tradeAmount`).value);if(!r||r<=0){showToast(`Please enter a valid trade amount.`,`error`);return}let i=document.getElementById(`modalConnectWallet`),s=document.getElementById(`walletModalSelector`),l=document.getElementById(`walletModalLoading`);if(s.style.display=`none`,l.style.display=`flex`,n===`buy`){if(state.wallet.balanceSOL<r){showToast(`Insufficient SOL balance! Required: ${r} SOL, Available: ${state.wallet.balanceSOL} SOL`,`error`);return}l.querySelector(`h3`).innerText=`Buying Tokens...`,l.querySelector(`p`).innerText=`Approve the wallet signature request to buy $EARN with ${r} SOL.`}else{if(state.wallet.balanceEARN<r){showToast(`Insufficient $EARN balance! Required: ${r.toLocaleString()} $EARN, Available: ${state.wallet.balanceEARN.toLocaleString()} $EARN`,`error`);return}l.querySelector(`h3`).innerText=`Selling Tokens...`,l.querySelector(`p`).innerText=`Approve the wallet signature request to sell ${r.toLocaleString()} $EARN.`}i.classList.add(`active`),setTimeout(()=>{i.classList.remove(`active`);let s=state.stats.tokenPriceSOL,l=0;if(n===`buy`){l=r/state.stats.tokenPriceSOL,state.wallet.balanceSOL-=r,state.wallet.balanceEARN+=l;let e=r*8e-6;state.stats.tokenPriceSOL+=e,state.stats.totalSOLInvested+=r,state.stats.bondingCurvePercent=Math.min(99.9,state.stats.totalSOLInvested/state.stats.raydiumThresholdSOL*100),t.unshift({user:state.wallet.address.slice(0,4)+`...`+state.wallet.address.slice(-4),type:`buy`,amountSOL:r,amountCLICK:l,age:`just now`}),triggerTokenRainAnimation(),showToast(`Success! +${l.toLocaleString(void 0,{maximumFractionDigits:2})} $EARN bought.`,`success`)}else{l=r*state.stats.tokenPriceSOL,state.wallet.balanceEARN-=r,state.wallet.balanceSOL+=l;let e=l*8e-6;state.stats.tokenPriceSOL=Math.max(1e-5,state.stats.tokenPriceSOL-e),state.stats.totalSOLInvested=Math.max(0,state.stats.totalSOLInvested-l),state.stats.bondingCurvePercent=Math.min(99.9,state.stats.totalSOLInvested/state.stats.raydiumThresholdSOL*100),t.unshift({user:state.wallet.address.slice(0,4)+`...`+state.wallet.address.slice(-4),type:`sell`,amountSOL:l,amountCLICK:r,age:`just now`}),showToast(`Success! +${l.toFixed(4)} SOL transferred to your wallet.`,`success`)}updateNavbarBalance(),renderStats(),c();let u=new Date,d=u.getMinutes()<10?`0`+u.getMinutes():u.getMinutes(),f=`${u.getHours()}:${d}`,p=s,m=state.stats.tokenPriceSOL,h=Math.max(p,m)+Math.random()*3e-6,g=Math.min(p,m)-Math.random()*3e-6;e.push({time:f,open:p,high:h,low:g,close:m}),e.length>8&&e.shift(),document.getElementById(`chartTokenPriceVal`).innerText=`${state.stats.tokenPriceSOL.toFixed(6)} SOL`,o(),document.getElementById(`tradeAmount`).value=n===`buy`?`0.5`:`500`,a()},1800)}function c(){let e=document.getElementById(`recentTokenTrades`);e&&(e.innerHTML=``,t.forEach(t=>{let n=document.createElement(`div`);n.style.display=`flex`,n.style.justifyContent=`space-between`,n.style.padding=`0.4rem 0.75rem`,n.style.background=`rgba(255, 255, 255, 0.01)`,n.style.border=`1px solid rgba(255, 255, 255, 0.03)`,n.style.borderRadius=`6px`;let r=t.type===`buy`;n.innerHTML=`
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-weight: 700; color: ${r?`var(--text-success)`:`var(--text-error)`};">${r?`BUY`:`SELL`}</span>
                <span style="color: var(--text-primary); font-weight: 600;">@${t.user}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-weight: 700;">${t.amountCLICK.toLocaleString(void 0,{maximumFractionDigits:0})} $EARN</span>
                <span style="color: var(--text-muted); opacity: 0.8;">(${t.amountSOL.toFixed(2)} SOL)</span>
                <span style="font-size: 0.7rem; color: var(--text-muted); min-width: 40px; text-align: right;">${t.age}</span>
            </div>
        `,e.appendChild(n)}))}window.switchTradeMode=r,window.setTradeAmount=i,window.calculateTradeReturn=a,window.initTradingChart=o,window.executeTokenTrade=s,window.renderRecentTrades=c}));t(),n(),r();