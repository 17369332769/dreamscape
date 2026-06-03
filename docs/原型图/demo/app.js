// App JS for Xianxia Novel Homepage Prototype

document.addEventListener('DOMContentLoaded', () => {
    // 1. Generate Background Particles
    initParticles();

    // 2. Crystal Increment Interactions
    initCrystals();

    // 3. Stat Tooltips
    initStatTooltips();

    // 4. Chapter Reward Chest
    initChapterChest();

    // 5. Portal Button Interactions
    initPortalButton();

    // 6. Menu Modals & Sub-functionality
    initMenuModals();
});

/* ==========================================
   1. BACKGROUND PARTICLES GENERATION
   ========================================== */
function initParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;

    // Create glowing particles
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random styles
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.bottom = `-${Math.random() * 20}px`;
        particle.style.width = `${Math.random() * 4 + 2}px`;
        particle.style.height = particle.style.width;
        particle.style.animationDelay = `${Math.random() * 8}s`;
        particle.style.animationDuration = `${Math.random() * 6 + 6}s`;
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        
        container.appendChild(particle);
    }

    // Create glowing butterflies
    const butterflyCount = 6;
    for (let i = 0; i < butterflyCount; i++) {
        const butterfly = document.createElement('div');
        butterfly.classList.add('butterfly-particle');
        
        butterfly.style.left = `${Math.random() * 90}%`;
        butterfly.style.bottom = `-${Math.random() * 40}px`;
        butterfly.style.animationDelay = `${Math.random() * 10}s`;
        butterfly.style.animationDuration = `${Math.random() * 8 + 8}s`;
        
        container.appendChild(butterfly);
    }
}

/* ==========================================
   2. CRYSTALS COUNT & ADDITION FLOW
   ========================================== */
let crystalBalance = 1268;

function initCrystals() {
    const addBtn = document.getElementById('add-crystals-btn');
    const crystalCountEl = document.getElementById('crystal-count');
    const widget = document.getElementById('crystal-widget');

    if (!addBtn || !crystalCountEl || !widget) return;

    addBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Stop click from triggering parent
        
        // Add balance
        crystalBalance += 100;
        updateCrystalDisplay();

        // Play float text effect
        const rect = addBtn.getBoundingClientRect();
        const floatText = document.createElement('div');
        floatText.classList.add('floating-num');
        floatText.innerText = '+100';
        floatText.style.left = `${e.clientX - 15}px`;
        floatText.style.top = `${e.clientY - 25}px`;
        
        document.body.appendChild(floatText);

        // Remove element after animation
        setTimeout(() => {
            floatText.remove();
        }, 1000);

        // Scale widget micro-animation
        widget.style.transform = 'scale(1.08)';
        setTimeout(() => {
            widget.style.transform = '';
        }, 150);
    });
}

function updateCrystalDisplay() {
    const crystalCountEl = document.getElementById('crystal-count');
    if (crystalCountEl) {
        crystalCountEl.innerText = crystalBalance.toLocaleString();
    }
}

/* ==========================================
   3. ATTRIBUTES TOOLTIPS
   ========================================== */
const statDescriptions = {
    wuli: {
        name: '武力',
        desc: '影响角色的身体素质、物理攻防能力以及飞剑伤害。武力越高，在正面交锋中越占优势。'
    },
    zhimou: {
        name: '智谋',
        desc: '影响法术威能、参悟功法速度以及梦境中的解密选择。智谋过人者常可不战而屈人之兵。'
    },
    meili: {
        name: '魅力',
        desc: '影响梦境中偶遇NPC的好感度、社交说服概率。绝世容颜或独特气质，常能免去许多无妄之灾。'
    },
    qiyun: {
        name: '气运',
        desc: '决定偶遇奇遇的几率、宝箱掉落品质以及绝地求生的概率。福源深厚之人，摔落悬崖亦能获得神兵。'
    },
    yizhi: {
        name: '意志',
        desc: '决定对幻境及心魔的抵抗力、濒死时的抗击打力。修仙之路漫长，坚忍不拔的意志是突破境界之根本。'
    }
};

function initStatTooltips() {
    const statItems = document.querySelectorAll('.stat-item');
    const tooltip = document.getElementById('stat-tooltip');
    const tooltipName = document.getElementById('tooltip-stat-name');
    const tooltipDesc = document.getElementById('tooltip-stat-desc');

    if (!tooltip || !tooltipName || !tooltipDesc) return;

    statItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const statKey = item.getAttribute('data-stat');
            const data = statDescriptions[statKey];

            if (!data) return;

            // Set content
            tooltipName.innerText = data.name;
            tooltipDesc.innerText = data.desc;

            // Position tooltip relative to clicked item
            const rect = item.getBoundingClientRect();
            
            // Adjust position so it displays centered above the item
            tooltip.style.display = 'block';
            tooltip.style.left = `${rect.left + (rect.width / 2) - 90}px`; // 90px is half tooltip max-width
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;

            // Trigger animation frame
            requestAnimationFrame(() => {
                tooltip.classList.add('active');
            });
        });
    });

    // Close tooltip when clicking anywhere else
    document.addEventListener('click', () => {
        if (tooltip.classList.contains('active')) {
            tooltip.classList.remove('active');
            setTimeout(() => {
                tooltip.style.display = 'none';
            }, 200);
        }
    });
}

/* ==========================================
   4. CHAPTER REWARD CHEST
   ========================================== */
let isChestClaimed = false;

function initChapterChest() {
    const chestBtn = document.getElementById('reward-chest-btn');
    const rewardModal = document.getElementById('reward-modal');
    const claimBtn = document.getElementById('claim-reward-btn');
    const modalOverlay = document.getElementById('modal-overlay');

    if (!chestBtn || !rewardModal || !claimBtn || !modalOverlay) return;

    chestBtn.addEventListener('click', () => {
        if (isChestClaimed) {
            showToast('章节奖励已领完');
            return;
        }

        // Open Reward Modal
        modalOverlay.classList.add('active');
        rewardModal.classList.add('active');
    });

    claimBtn.addEventListener('click', () => {
        // Collect reward
        crystalBalance += 100;
        updateCrystalDisplay();

        // Close modal
        rewardModal.classList.remove('active');
        modalOverlay.classList.remove('active');

        // Disable chest
        isChestClaimed = true;
        chestBtn.style.opacity = '0.5';
        const label = chestBtn.querySelector('.reward-label');
        if (label) label.innerText = '已领取';

        showToast('获得 100 灵石！');
    });
}

/* ==========================================
   5. PORTAL BUTTON (CONTINUE DREAM)
   ========================================== */
let currentChapter = 3;
let currentRound = 7;
let currentProgress = 65;

const narrativePrompts = [
    "你在梦境深处前行，感知到前方传来微弱的飞剑轰鸣声...",
    "迷雾散去，一座断裂的浮空仙桥阻断了前路，你在此感悟了片刻...",
    "林中穿出一头受伤的噬灵蛛，正不怀好意地盯着你的钱袋...",
    "一位垂死的青云门同门塞给你一块染血的玉简，随即便化为光尘...",
    "虚空中凭空出现一道天雷，狠狠劈在你脚边，将你震退了数步..."
];

function initPortalButton() {
    const portalBtn = document.getElementById('continue-dream-btn');
    const roundText = document.getElementById('round-text');
    const progressBar = document.getElementById('progress-bar-fill');
    const progressText = document.getElementById('progress-text');

    if (!portalBtn || !roundText || !progressBar || !progressText) return;

    portalBtn.addEventListener('click', () => {
        // 1. Advance state
        currentRound++;
        
        // Increase progress by a random amount (5-10%)
        currentProgress += Math.floor(Math.random() * 6) + 5;
        if (currentProgress >= 100) {
            currentProgress = 0;
            currentChapter++;
            showToast(`进入第 ${currentChapter} 章！`);
        }

        // Update DOM
        roundText.innerText = `第${currentChapter}章 · 第${currentRound}轮`;
        progressBar.style.width = `${currentProgress}%`;
        progressText.innerText = `${currentProgress}%`;

        // 2. Play Ripple Portal Effect
        playPortalRipple(portalBtn);

        // 3. Show narrative toast
        const randomNarrative = narrativePrompts[Math.floor(Math.random() * narrativePrompts.length)];
        showNarrativePopup(randomNarrative);
    });
}

function playPortalRipple(btn) {
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.width = '120px';
    ripple.style.height = '120px';
    ripple.style.borderRadius = '50%';
    ripple.style.border = '2.5px solid #ffd166';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.transform = 'translate(-50%, -50%) scale(1)';
    ripple.style.opacity = '1';
    ripple.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '5';
    
    btn.appendChild(ripple);

    requestAnimationFrame(() => {
        ripple.style.transform = 'translate(-50%, -50%) scale(2.2)';
        ripple.style.opacity = '0';
    });

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

/* ==========================================
   6. MENU MODALS & SUB-FUNCTIONALITY
   ========================================== */
function initMenuModals() {
    const menuItems = document.querySelectorAll('.menu-item');
    const overlay = document.getElementById('modal-overlay');
    const closeBtns = document.querySelectorAll('.close-modal-btn');
    const modals = document.querySelectorAll('.custom-modal');

    if (!overlay) return;

    // Toggle Modal Open
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const menuType = item.getAttribute('data-menu');
            const targetModal = document.getElementById(`modal-${menuType}`);

            if (targetModal) {
                overlay.classList.add('active');
                targetModal.classList.add('active');
            }
        });
    });

    // Close Modals
    const closeAllModals = () => {
        modals.forEach(m => m.classList.remove('active'));
        overlay.classList.remove('active');
        
        // Also close the reward modal if open
        const rewardModal = document.getElementById('reward-modal');
        if (rewardModal) rewardModal.classList.remove('active');
    };

    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    overlay.addEventListener('click', closeAllModals);

    // Setup Specific Modals Internal Behaviors
    setupProfileModal();
    setupPouchModal();
    setupBookModal();
    setupPavilionModal();
}

// PROFILE (创建角色) modal behavior
function setupProfileModal() {
    const confirmBtn = document.getElementById('create-confirm-btn');
    const nameInput = document.getElementById('char-name-input');
    const fateSelect = document.getElementById('char-fate-select');
    const displayCharName = document.querySelector('.character-name');
    const realmBadge = document.querySelector('.realm-badge');

    if (!confirmBtn || !nameInput || !fateSelect || !displayCharName) return;

    confirmBtn.addEventListener('click', () => {
        const nameVal = nameInput.value.trim();
        if (nameVal === '') {
            showToast('仙号不能为空！');
            return;
        }

        // Apply changes
        displayCharName.innerText = nameVal;
        
        // Depending on fate option, update realm badge or display status message
        const fateIndex = fateSelect.value;
        let fateName = "";
        let statBonusText = "";

        if (fateIndex === "1") {
            fateName = "天生剑骨";
            statBonusText = "武力 +10, 智谋 -2";
            updateSingleStat('wuli', 82);
            updateSingleStat('zhimou', 66);
        } else if (fateIndex === "2") {
            fateName = "仙根宿慧";
            statBonusText = "智谋 +10, 魅力 +2";
            updateSingleStat('zhimou', 78);
            updateSingleStat('meili', 77);
        } else if (fateIndex === "3") {
            fateName = "天命眷顾";
            statBonusText = "气运 +12, 意志 -2";
            updateSingleStat('qiyun', 73);
            updateSingleStat('yizhi', 68);
        } else if (fateIndex === "4") {
            fateName = "百折不挠";
            statBonusText = "意志 +12, 武力 +2";
            updateSingleStat('yizhi', 82);
            updateSingleStat('wuli', 74);
        }

        showToast(`已塑造仙躯！命运觉醒：${fateName} (${statBonusText})`);

        // Close modal
        document.getElementById('modal-profile').classList.remove('active');
        document.getElementById('modal-overlay').classList.remove('active');
    });
}

function updateSingleStat(statKey, newValue) {
    const valEl = document.querySelector(`.stat-item[data-stat="${statKey}"] .stat-top .val`);
    const bottomEl = document.querySelector(`.stat-item[data-stat="${statKey}"] .stat-bottom`);
    if (valEl) valEl.innerText = newValue;
    if (bottomEl) bottomEl.innerText = newValue;
}

// POUCH (背包) inventory modal behavior
const itemDetails = {
    '青锋剑': '【稀有·武器】 昆仑山凡铁掺以微量青铜精炼而成的长剑，剑刃锋利，武力+15。',
    '洗髓丹': '【珍贵·丹药】 服用可洗经伐髓，小幅重构基础经脉。永久提升智谋与意志各3点。',
    '引气诀': '【普通·功法】 基础修行功法，青云门外门弟子人手一册。参悟可开启仙途。',
    '九转金丹': '【绝世·灵丹】 传说中太上老君金炉所炼之神丹，可直助武者突破凡尘。点击可用于突破练气巅峰！'
};

function setupPouchModal() {
    const invItems = document.querySelectorAll('.inventory-item');
    const detailBox = document.querySelector('.item-detail-box');

    if (!detailBox) return;

    invItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active highlight from all items
            invItems.forEach(i => i.classList.remove('active'));
            
            // Highlight current
            item.classList.add('active');

            const name = item.querySelector('.item-name').innerText;
            const desc = itemDetails[name] || '普通物品';

            // Show description details
            detailBox.innerHTML = `
                <h4 class="detail-title">${name}</h4>
                <p class="detail-desc">${desc}</p>
                ${name === '九转金丹' ? `<button class="primary-btn" style="margin-top:10px; padding:6px 12px; font-size:11px;" id="use-jindan-btn">吞服突破</button>` : ''}
            `;

            // If it's Jindan, bind click to trigger a custom breakthrough state change!
            const useBtn = document.getElementById('use-jindan-btn');
            if (useBtn) {
                useBtn.addEventListener('click', () => {
                    const realmBadge = document.querySelector('.realm-badge');
                    if (realmBadge) {
                        realmBadge.innerText = '筑基初期';
                        realmBadge.style.color = '#ef476f';
                        realmBadge.style.borderColor = '#ef476f';
                        realmBadge.style.boxShadow = '0 0 10px rgba(239, 71, 111, 0.4)';
                        showToast('轰隆隆！你服下九转金丹，天降雷劫，成功破境至 筑基初期！');
                        
                        // Update inventory count
                        const countEl = item.querySelector('.item-count');
                        if (countEl) countEl.innerText = 'x0';
                        
                        detailBox.innerHTML = `<p class="select-prompt">九转金丹已耗尽，你已破境成功！</p>`;
                    }
                });
            }
        });
    });
}

// BOOK (图鉴) encyclopedia tab-pane changing behavior
function setupBookModal() {
    const tabBtns = document.querySelectorAll('#modal-book .tab-btn');
    const tabPanes = document.querySelectorAll('#modal-book .tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Set button active
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show proper pane
            tabPanes.forEach(pane => {
                if (pane.id === `tab-${targetTab}`) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });
        });
    });
}

// PAVILION (社区广场) send posts
function setupPavilionModal() {
    const sendBtn = document.querySelector('.send-post-btn');
    const input = document.querySelector('.post-input-box input');
    const postsContainer = document.querySelector('.forum-posts');

    if (!sendBtn || !input || !postsContainer) return;

    const handleSend = () => {
        const txt = input.value.trim();
        if (txt === '') return;

        // Create HTML post node
        const post = document.createElement('div');
        post.classList.add('forum-post');
        post.innerHTML = `
            <div class="post-meta">
                <span class="author">夜行舟 (我)</span>
                <span class="time">刚刚</span>
            </div>
            <p class="post-content">${txt}</p>
            <div class="post-actions">
                <span class="like-btn" onclick="let likes = parseInt(this.innerText.split(' ')[1]) || 0; this.innerHTML = '<i class=&quot;fa-solid fa-thumbs-up&quot;></i> ' + (likes + 1)"><i class="fa-regular fa-thumbs-up"></i> 0</span>
                <span class="reply-btn"><i class="fa-regular fa-comment"></i> 0</span>
            </div>
        `;

        // Prepend post
        postsContainer.insertBefore(post, postsContainer.firstChild);

        // Clear input
        input.value = '';
        
        // Scroll list to top
        const body = postsContainer.parentElement;
        if (body) body.scrollTop = 0;
    };

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
}

/* ==========================================
   GLOBAL UTILITIES: TOASTS & NARRATIVES
   ========================================== */
function showToast(message) {
    const toast = document.createElement('div');
    toast.style.position = 'absolute';
    toast.style.bottom = '125px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    toast.style.background = 'rgba(15, 23, 42, 0.9)';
    toast.style.border = '1px solid #d4af37';
    toast.style.borderRadius = '8px';
    toast.style.padding = '8px 16px';
    toast.style.color = '#fff';
    toast.style.fontSize = '12px';
    toast.style.zIndex = '999';
    toast.style.boxShadow = '0 5px 15px rgba(0,0,0,0.5)';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.innerText = message;

    // Check if phone container is available to append inside phone layout
    const container = document.querySelector('.phone-container');
    if (container) {
        container.appendChild(toast);
    } else {
        document.body.appendChild(toast);
    }

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-10px)';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 2200);
}

function showNarrativePopup(text) {
    const popup = document.createElement('div');
    popup.style.position = 'absolute';
    popup.style.top = '340px';
    popup.style.left = '16px';
    popup.style.right = '16px';
    popup.style.background = 'linear-gradient(to right, rgba(14, 20, 35, 0.95), rgba(7, 9, 19, 0.95))';
    popup.style.borderLeft = '3px solid #d4af37';
    popup.style.borderRight = '1.5px solid rgba(255,255,255,0.08)';
    popup.style.borderTop = '1.5px solid rgba(255,255,255,0.08)';
    popup.style.borderBottom = '1.5px solid rgba(255,255,255,0.08)';
    popup.style.borderRadius = '6px';
    popup.style.padding = '12px 14px';
    popup.style.color = '#cbd5e1';
    popup.style.fontSize = '12px';
    popup.style.lineHeight = '1.5';
    popup.style.zIndex = '40';
    popup.style.boxShadow = '0 10px 25px rgba(0,0,0,0.6)';
    popup.style.opacity = '0';
    popup.style.transform = 'translateY(15px)';
    popup.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    
    // Add decorative tag
    popup.innerHTML = `
        <div style="font-size: 10px; font-weight: bold; color: #b583ff; margin-bottom: 4px; letter-spacing: 0.5px;">梦境历程：</div>
        <div>${text}</div>
    `;

    const container = document.querySelector('.phone-container');
    if (container) {
        // Clear previous narratives
        const oldPopups = container.querySelectorAll('.narrative-popup');
        oldPopups.forEach(p => p.remove());

        popup.classList.add('narrative-popup');
        container.appendChild(popup);
    }

    requestAnimationFrame(() => {
        popup.style.opacity = '1';
        popup.style.transform = 'translateY(0)';
    });

    // Fade out after 4 seconds
    setTimeout(() => {
        popup.style.opacity = '0';
        popup.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            popup.remove();
        }, 450);
    }, 4500);
}
