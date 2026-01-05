// ========================================
// WILL I DONATE MY KIT? - Wizard Logic
// ========================================

// State
let currentStep = 0;
const totalSteps = 12; // 0-11 (Map, Helmet, EarPro, Armor, Backpack, Weapon, Magazine, Ammo, Food, Water, Meds, Verdict)

const selections = {
    map: null,
    helmet: null,
    headphones: null,
    armor: null,
    backpack: null,
    weapon: null,
    magazine: null,
    ammo: null,
    food: null,
    drink: null,
    meds: null
};

// Track selected weapon's caliber for ammo filtering
let selectedWeaponCaliber = null;
let selectedWeaponName = null;

// Category to step mapping
const categoryToStep = {
    map: 0,
    helmet: 1,
    headphones: 2,
    armor: 3,
    backpack: 4,
    weapon: 5,
    magazine: 6,
    ammo: 7,
    food: 8,
    drink: 9,
    meds: 10
};

// Funny loading messages
const loadingMessages = [
    "Calculating head-eyes probability...",
    "Consulting with Fence...",
    "Checking if Killa is nearby...",
    "Analyzing your rat vs chad ratio...",
    "Pinging scav karma database...",
    "Asking Therapist for prognosis...",
    "Running away from Tagilla...",
    "Checking flea market prices...",
    "Simulating 1000 raids...",
    "Predicting extract camper locations..."
];

// Verdict messages based on score tiers
const verdictMessages = {
    trash: [
        "You're donating your kit to Reshala. Say goodbye.",
        "Hope you like the death screen music.",
        "Your kit is basically charity for PMCs.",
        "Scavs will fight over your corpse.",
        "You're about to fund someone else's raid."
    ],
    poor: [
        "You might survive... if everyone else disconnects.",
        "The rats will feast tonight.",
        "Your extract odds are 'thoughts and prayers'.",
        "Insurance might actually pay out this time.",
        "Budget loadout, budget expectations."
    ],
    mediocre: [
        "50/50. Flip a coin, same odds.",
        "You're the average PMC experience.",
        "Not great, not terrible. Just Tarkov.",
        "You'll probably make it to extract... maybe.",
        "Perfectly balanced, as all raids should be."
    ],
    decent: [
        "You might actually extract... if you don't get head-eyes'd.",
        "Looking decent. Don't get cocky.",
        "Solid kit. Now don't do anything stupid.",
        "You've got a fighting chance. Emphasis on fighting.",
        "Not bad. Killa might actually need a second mag."
    ],
    chad: [
        "Chad loadout. Tagilla fears YOU.",
        "Labs? More like your personal playground.",
        "Other PMCs will write Reddit posts about you.",
        "You're not looting. You ARE the loot.",
        "God-tier kit. Now don't die to a Mosin scav."
    ]
};

// Snarky map-specific roasts
const mapRoasts = {
    'Factory': "Factory with that kit? Bold strategy. Tagilla sends his regards.",
    'Night Factory': "Night Factory? Can't get head-eyes'd if you can't see. Big brain.",
    'Customs': "Customs? Hope you practiced your dorms speedrun. Reshala's boys are waiting.",
    'Woods': "Woods? Bring a lunch. And maybe binoculars. And therapy for when Shturman one-taps you.",
    'Shoreline': "Shoreline? 45 minutes of looting resort, 2 seconds of dying to Sanitar.",
    'Interchange': "Interchange? Killa's gonna turn you into a loot pinata in ULTRA.",
    'Reserve': "Reserve? Raiders, Glukhar, and extract campers. Pick your poison.",
    'Lighthouse': "Lighthouse? The Rogues have already zeroed their .50 cals on your spawn.",
    'Streets of Tarkov': "Streets? Your PC is already crying. Kaban and Kollontay are loading in.",
    'The Lab': "Labs?! With THAT loadout? The Raiders are going to laugh before they dome you.",
    'Ground Zero': "Ground Zero? Baby's first map. You might actually survive this one.",
    'Ground Zero 21+': "Ground Zero 21+? Cultists at night, extract campers by day. Classic.",
    'Terminal': "Terminal? Black Division and AF operators vs you. Good luck lmao.",
    'The Labyrinth': "The Labyrinth? Shadow Tagilla is already sharpening his hammer.",
    'default': "Interesting map choice. The scavs thank you for your donation."
};

// Snarky helmet roasts
const helmetRoasts = {
    'paca': "PACA? That's not armor, that's a strongly worded letter.",
    'Altyn': "Altyn? Can't get head-eyes'd if your whole head is a tank. 200 IQ.",
    'FAST MT': "FAST MT? Look at Mr. Moneybags over here.",
    'Kiver': "Kiver-M? Retro. Respect the drip.",
    'ZSh': "ZSh? The face shield fogs up faster than your raid ends.",
    'UNTAR': "UNTAR helmet? Peacekeeping your way to the lobby.",
    'Pumpkin': "Pumpkin helmet? Festive. The scavs will appreciate the holiday spirit.",
    '6B47': "6B47 Ratnik? Standard issue, standard death.",
    'default': "Interesting head protection choice. Your skull disagrees."
};

// Snarky armor roasts
const armorRoasts = {
    'PACA': "PACA? Might as well wear a t-shirt that says 'free loot'.",
    '6B43': "6B43 Zabralo? You move like a refrigerator but at least you're protected.",
    'Slick': "Slick plate carrier? Chef's kiss. Now don't prone in a bush.",
    'Gzhel': "Gzhel-K? Solid choice. Until someone breathes on it and it zeroes.",
    'Module-3M': "Module-3M? The official armor of 'I just started playing'.",
    'Korund': "Korund-VM? Repairs like a dream, dies like a nightmare.",
    'default': "That armor might stop a strongly worded insult. Maybe."
};

// Snarky weapon roasts
const weaponRoasts = {
    'M4A1': "M4A1? The official weapon of 'I watched a YouTube guide'.",
    'AK-74': "AK-74? Reliable. Like your impending death.",
    'AKM': "AKM? 7.62 go brrrr. Recoil also go brrrr.",
    'AS VAL': "AS VAL? Sneaky boi loadout. Until you run out of 30-round mags.",
    'MP5': "MP5? Ah yes, the 'I want to be close and personal with my killer' choice.",
    'MP7': "MP7? Leg meta enjoyer detected.",
    'VSS': "VSS Vintorez? 20-round mags of pure anxiety.",
    'DVL': "DVL-10? Sniper gaming. Hope your aim is better than your kit.",
    'RSASS': "RSASS? Semi-auto chad energy.",
    'default': "Interesting weapon choice. The person who loots it will appreciate it."
};

// Snarky ammo roasts
const ammoRoasts = {
    'PS': "PS ammo? Might as well throw the bullets by hand.",
    'BP': "BP? Budget penetration for budget players.",
    'BS': "BS ammo? Now we're talking. Armor fears you.",
    'M855': "M855? Green tip go ping off helmets.",
    'M855A1': "M855A1? Solid. Your aim is still the problem though.",
    'M995': "M995? Your wallet is crying but your enemies will too.",
    'SNB': "SNB? One-tap potential. If you can aim.",
    '7N40': "7N40? Basically cheating. Nikita pls nerf.",
    'Pst': "Pst gzh? The sound of 'I'm going for legs'.",
    'default': "That ammo choice is... a choice. Certainly a choice."
};

// Snarky headphone roasts
const headphoneRoasts = {
    'ComTac': "ComTacs? Hear them before they head-eyes you.",
    'GSSH': "GSSH? The official headset of 'I'm broke but aware'.",
    'Sordin': "Sordins? Fancy ears won't save you from bad aim.",
    'XCEL': "XCEL? Premium hearing for premium dying.",
    'RAC': "RAC headset? Tacticool to the max.",
    'default': "Those ears better help you hear the bullet that kills you."
};

// Snarky food/drink roasts
const consumableRoasts = {
    'MRE': "MRE? At least you'll die with a full stomach.",
    'Slickers': "Slickers bar? Nothing like chocolate before combat.",
    'Aquamari': "Aquamari? Hydrated corpse incoming.",
    'Water': "Water bottle? Stay hydrated, stay dead.",
    'Moonshine': "Moonshine? Dutch courage won't save you.",
    'default': "Gotta eat. Shame it won't matter in 30 seconds."
};

function generateSnarkyCommentary() {
    const comments = [];

    // Map roast
    if (selections.map?.name) {
        const mapName = selections.map.name;
        const mapRoast = Object.keys(mapRoasts).find(key => mapName.includes(key));
        comments.push(mapRoasts[mapRoast] || mapRoasts['default']);
    }

    // Helmet roast
    if (selections.helmet?.name) {
        const helmetName = selections.helmet.name;
        const helmetRoast = Object.keys(helmetRoasts).find(key => helmetName.toLowerCase().includes(key.toLowerCase()));
        if (helmetRoast) comments.push(helmetRoasts[helmetRoast]);
    }

    // Headphones roast
    if (selections.headphones?.name) {
        const hpName = selections.headphones.name;
        const hpRoast = Object.keys(headphoneRoasts).find(key => hpName.toLowerCase().includes(key.toLowerCase()));
        if (hpRoast) comments.push(headphoneRoasts[hpRoast]);
    }

    // Armor roast
    if (selections.armor?.name) {
        const armorName = selections.armor.name;
        const armorRoast = Object.keys(armorRoasts).find(key => armorName.toLowerCase().includes(key.toLowerCase()));
        if (armorRoast) comments.push(armorRoasts[armorRoast]);
    }

    // Weapon roast
    if (selections.weapon?.name) {
        const weaponName = selections.weapon.name;
        const weaponRoast = Object.keys(weaponRoasts).find(key => weaponName.includes(key));
        if (weaponRoast) comments.push(weaponRoasts[weaponRoast]);
    }

    // Ammo roast
    if (selections.ammo?.name) {
        const ammoName = selections.ammo.name;
        const ammoRoast = Object.keys(ammoRoasts).find(key => ammoName.includes(key));
        if (ammoRoast) comments.push(ammoRoasts[ammoRoast]);
    }

    // Food/Drink roast
    if (selections.food?.name || selections.drink?.name) {
        const consumableName = selections.food?.name || selections.drink?.name;
        const consumableRoast = Object.keys(consumableRoasts).find(key => consumableName?.toLowerCase().includes(key.toLowerCase()));
        if (consumableRoast) comments.push(consumableRoasts[consumableRoast]);
    }

    // Pick 2-3 random roasts from what we have
    const shuffled = comments.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(3, shuffled.length));
}

// ========================================
// Initialization
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initCardSelection();
    updateProgress();
    updateButtons();
    updateSidebar();
    updateDrawerCount();
});

// ========================================
// Card Selection
// ========================================

function initCardSelection() {
    document.querySelectorAll('.gear-card').forEach(card => {
        card.addEventListener('click', function() {
            selectCard(this);
        });
    });
}

function selectCard(card) {
    const category = card.dataset.category;
    const cardsInCategory = document.querySelectorAll(`.gear-card[data-category="${category}"]`);

    // Remove selection from other cards in same category
    cardsInCategory.forEach(c => c.classList.remove('selected'));

    // Select this card
    card.classList.add('selected');

    // Store selection
    selections[category] = {
        id: card.dataset.id,
        name: card.dataset.name,
        value: parseFloat(card.dataset.value) || 0,
        damage: parseFloat(card.dataset.damage) || 0,
        armorDamage: parseFloat(card.dataset.armorDamage) || 0,
        caliber: card.dataset.caliber || null,
        image: card.dataset.image || null,
        capacity: parseInt(card.dataset.capacity) || 0,
        energy: parseInt(card.dataset.energy) || 0,
        hydration: parseInt(card.dataset.hydration) || 0,
        hitpoints: parseInt(card.dataset.hitpoints) || 0
    };

    // If weapon selected, store caliber and filter ammo
    if (category === 'weapon' && card.dataset.caliber) {
        selectedWeaponCaliber = card.dataset.caliber;
        selectedWeaponName = card.dataset.name;
        filterAmmoByCaliber(selectedWeaponCaliber);
        filterMagazinesByWeapon(card.dataset.name);
    }

    // Update sidebar
    updateSidebar();
    updateDrawerCount();

    // Enable next button
    updateButtons();
}

function filterAmmoByCaliber(caliber) {
    const ammoCards = document.querySelectorAll('.ammo-card');
    let visibleCount = 0;

    // Handle caliber compatibility (9x18PMM can use 9x18PM ammo)
    const compatibleCalibers = [caliber];
    if (caliber === 'Caliber9x18PMM') {
        compatibleCalibers.push('Caliber9x18PM');
    }

    ammoCards.forEach(card => {
        const ammoCaliber = card.dataset.caliber;
        if (compatibleCalibers.includes(ammoCaliber)) {
            card.style.display = '';
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.style.display = 'none';
            card.classList.add('hidden');
        }
    });

    // Update subtitle to show what caliber we're filtering for
    const subtitle = document.getElementById('ammoSubtitle');
    if (subtitle && caliber) {
        const caliberName = caliber.replace('Caliber', '');
        if (visibleCount === 0) {
            subtitle.textContent = `No ammo found for ${caliberName}. That's rough, buddy.`;
        } else {
            subtitle.textContent = `Showing ${caliberName} ammo for your weapon (${visibleCount} options)`;
        }
    }

    // Clear any previous ammo selection since caliber changed
    selections.ammo = null;
    ammoCards.forEach(c => c.classList.remove('selected'));
}

function filterMagazinesByWeapon(weaponName) {
    const magCards = document.querySelectorAll('.magazine-card');
    let visibleCount = 0;

    // Get magazines data from window object (set in HTML)
    const magazines = window.magazines || [];

    magCards.forEach(card => {
        const magName = card.dataset.name;
        // Find this magazine in our data
        const magData = magazines.find(m => m.shortName === magName);

        // For now, show all magazines - proper filtering would need weapon-magazine compatibility data
        // which isn't directly available in the API
        card.style.display = '';
        card.classList.remove('hidden');
        visibleCount++;
    });

    // Update subtitle
    const subtitle = document.getElementById('magSubtitle');
    if (subtitle) {
        subtitle.textContent = `Select a magazine for your loadout (${visibleCount} options)`;
    }

    // Clear previous magazine selection
    selections.magazine = null;
    magCards.forEach(c => c.classList.remove('selected'));
}

function updateSidebar() {
    // Update each loadout slot in the sidebar
    const slotMappings = {
        'map': 'slotMap',
        'helmet': 'slotHelmet',
        'headphones': 'slotEarPro',
        'armor': 'slotArmor',
        'backpack': 'slotBackpack',
        'weapon': 'slotWeapon',
        'magazine': 'slotMagazine',
        'ammo': 'slotAmmo',
        'food': 'slotFood',
        'drink': 'slotDrink',
        'meds': 'slotMeds'
    };

    Object.keys(slotMappings).forEach(category => {
        const slot = document.getElementById(slotMappings[category]);
        if (!slot) return;

        const selection = selections[category];
        const valueEl = slot.querySelector('.slot-value');
        const iconEl = slot.querySelector('.slot-icon');

        if (selection) {
            slot.classList.add('filled');
            if (valueEl) {
                valueEl.textContent = truncate(selection.name, 15);
            }
            // Update icon to show image if available
            if (iconEl && selection.image) {
                iconEl.innerHTML = `<img src="${selection.image}" alt="${selection.name}" class="slot-image">`;
            }
        } else {
            slot.classList.remove('filled');
            if (valueEl) {
                valueEl.textContent = 'Empty';
            }
        }
    });
}

function updateDrawerCount() {
    const countEl = document.getElementById('drawerCount');
    if (countEl) {
        const filledCount = Object.values(selections).filter(s => s !== null).length;
        countEl.textContent = filledCount;
    }
}

function toggleDrawer() {
    const sidebar = document.querySelector('.loadout-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

// ========================================
// Navigation
// ========================================

function nextStep() {
    const currentCategory = Object.keys(categoryToStep).find(key => categoryToStep[key] === currentStep);

    // Validate selection for current step (except verdict step)
    if (currentStep < 11 && !selections[currentCategory]) {
        shakeButton();
        return;
    }

    if (currentStep < totalSteps - 1) {
        currentStep++;
        showStep(currentStep);
        updateProgress();
        updateButtons();
    }
}

function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
        updateProgress();
        updateButtons();
    }
}

function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.wizard-step').forEach(el => {
        el.classList.remove('active');
    });

    // Show target step
    const targetStep = document.querySelector(`.wizard-step[data-step="${step}"]`);
    if (targetStep) {
        targetStep.classList.add('active');
    }

    // Scroll to top of main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function updateProgress() {
    // Update progress bar width
    const progress = (currentStep / (totalSteps - 1)) * 100;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }

    // Update step indicators
    document.querySelectorAll('.progress-steps .step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index === currentStep) {
            step.classList.add('active');
        } else if (index < currentStep) {
            step.classList.add('completed');
        }
    });
}

function updateButtons() {
    const btnBack = document.getElementById('btnBack');
    const btnNext = document.getElementById('btnNext');
    const btnVerdict = document.getElementById('btnVerdict');

    if (!btnBack || !btnNext || !btnVerdict) return;

    // Back button
    btnBack.disabled = currentStep === 0;

    // Get current category
    const currentCategory = Object.keys(categoryToStep).find(key => categoryToStep[key] === currentStep);
    const hasSelection = currentCategory ? selections[currentCategory] !== null : false;

    // Show verdict button on last selection step (meds = step 10)
    if (currentStep === 10) {
        btnNext.style.display = 'none';
        btnVerdict.style.display = 'flex';
        btnVerdict.disabled = !hasSelection;
    } else if (currentStep === 11) {
        // On verdict screen, hide both
        btnNext.style.display = 'none';
        btnVerdict.style.display = 'none';
    } else {
        btnNext.style.display = 'flex';
        btnVerdict.style.display = 'none';
        btnNext.disabled = !hasSelection;
    }
}

function shakeButton() {
    const btn = document.getElementById('btnNext');
    if (btn) {
        btn.classList.add('shake');
        setTimeout(() => btn.classList.remove('shake'), 500);
    }
}

// ========================================
// Verdict Calculation
// ========================================

function calculateVerdict() {
    // Go to verdict step
    currentStep = 11;
    showStep(currentStep);
    updateProgress();
    updateButtons();

    // Show loading
    const loadingEl = document.getElementById('verdictLoading');
    const resultEl = document.getElementById('verdictResult');

    if (loadingEl) loadingEl.style.display = 'flex';
    if (resultEl) resultEl.style.display = 'none';

    // Cycle through loading messages
    let msgIndex = 0;
    const loadingTextEl = document.getElementById('loadingText');
    const loadingInterval = setInterval(() => {
        msgIndex = (msgIndex + 1) % loadingMessages.length;
        if (loadingTextEl) {
            loadingTextEl.textContent = loadingMessages[msgIndex];
        }
    }, 800);

    // Calculate score (simulate delay for effect)
    setTimeout(() => {
        clearInterval(loadingInterval);

        // Calculate the actual score
        const score = calculateScore();

        // Show result
        showVerdict(score);
    }, 3000);
}

function calculateScore() {
    // Get gear values
    const helmetValue = selections.helmet?.value || 0;
    const armorValue = selections.armor?.value || 0;
    const backpackValue = selections.backpack?.value || 0;
    const weaponValue = selections.weapon?.value || 0;
    const headphonesValue = selections.headphones?.value || 0;
    const magazineValue = selections.magazine?.value || 0;
    const totalGearValue = helmetValue + armorValue + backpackValue + weaponValue + headphonesValue + magazineValue;

    // Get ammo stats
    const ammoDamage = selections.ammo?.damage || 0;
    const armorDamage = selections.ammo?.armorDamage || 0;

    // Get consumable bonuses
    const foodEnergy = selections.food?.energy || 0;
    const drinkHydration = selections.drink?.hydration || 0;
    const medsHitpoints = selections.meds?.hitpoints || 0;

    // Get map difficulty (using raid duration as proxy)
    const mapDifficulty = selections.map?.value || 30;

    // Magazine capacity bonus
    const magCapacity = selections.magazine?.capacity || 30;

    // Normalize scores (0-100)
    // Gear: Max reasonable value ~600,000 rubles (with new items)
    const gearScore = Math.min((totalGearValue / 600000) * 100, 100);

    // Ammo: Damage typically 40-90, armor damage 20-60
    const ammoScore = Math.min(((ammoDamage / 90) * 50 + (armorDamage / 60) * 50), 100);

    // Map: Longer raids = harder (invert so short = easier)
    const mapScore = Math.max(100 - (mapDifficulty / 50) * 30, 40);

    // Consumables bonus (energy + hydration + healing = survival bonus)
    const consumableScore = Math.min(((foodEnergy / 100) * 30 + (drinkHydration / 100) * 30 + (medsHitpoints / 400) * 40), 100);

    // Magazine capacity bonus (bigger mag = more dakka)
    const magScore = Math.min((magCapacity / 60) * 100, 100);

    // Weighted final score
    const finalScore = Math.round(
        gearScore * 0.30 +      // Gear value
        ammoScore * 0.25 +      // Ammo quality
        mapScore * 0.10 +       // Map difficulty
        consumableScore * 0.10 + // Consumables
        magScore * 0.10 +       // Magazine capacity
        Math.random() * 15      // RNG because it's Tarkov
    );

    return Math.min(Math.max(finalScore, 5), 100); // Clamp between 5-100
}

function showVerdict(score) {
    const loadingEl = document.getElementById('verdictLoading');
    const resultEl = document.getElementById('verdictResult');

    if (loadingEl) loadingEl.style.display = 'none';
    if (resultEl) resultEl.style.display = 'block';

    // Animate score number
    animateScore(score);

    // Set score ring color and fill
    const scoreCircle = document.getElementById('scoreCircle');
    if (scoreCircle) {
        scoreCircle.classList.remove('low', 'medium', 'high');

        if (score < 30) {
            scoreCircle.classList.add('low');
        } else if (score < 70) {
            scoreCircle.classList.add('medium');
        } else {
            scoreCircle.classList.add('high');
        }

        // Animate ring fill (circumference = 2 * PI * 45 = 283)
        const circumference = 283;
        const offset = circumference - (score / 100) * circumference;
        setTimeout(() => {
            scoreCircle.style.strokeDashoffset = offset;
        }, 100);
    }

    // Set verdict message
    const message = getVerdictMessage(score);
    const messageEl = document.getElementById('verdictMessage');
    if (messageEl) {
        messageEl.textContent = message;
    }

    // Show breakdown with snarky commentary
    showBreakdown();
}

function animateScore(targetScore) {
    const scoreEl = document.getElementById('scoreNumber');
    if (!scoreEl) return;

    let current = 0;
    const duration = 1500;
    const increment = targetScore / (duration / 16);

    const animate = () => {
        current += increment;
        if (current >= targetScore) {
            scoreEl.textContent = targetScore;
        } else {
            scoreEl.textContent = Math.round(current);
            requestAnimationFrame(animate);
        }
    };

    requestAnimationFrame(animate);
}

function getVerdictMessage(score) {
    let tier;
    if (score < 20) tier = 'trash';
    else if (score < 40) tier = 'poor';
    else if (score < 60) tier = 'mediocre';
    else if (score < 80) tier = 'decent';
    else tier = 'chad';

    const messages = verdictMessages[tier];
    return messages[Math.floor(Math.random() * messages.length)];
}

function showBreakdown() {
    const breakdown = document.getElementById('verdictBreakdown');
    if (!breakdown) return;

    // Get snarky commentary based on selections
    const roasts = generateSnarkyCommentary();

    // Build roasts HTML
    let roastsHtml = '';
    if (roasts.length > 0) {
        roastsHtml = `
            <div class="roasts-container">
                <h4 class="roasts-title"><i class="bi bi-chat-quote"></i> The Scav Boss Council Says:</h4>
                ${roasts.map(roast => `<p class="roast-text">"${roast}"</p>`).join('')}
            </div>
        `;
    }

    breakdown.innerHTML = `
        ${roastsHtml}
        <div class="breakdown-grid">
            <div class="breakdown-item">
                <span class="breakdown-label">Map</span>
                <span class="breakdown-value">${selections.map?.name || '--'}</span>
            </div>
            <div class="breakdown-item">
                <span class="breakdown-label">Helmet</span>
                <span class="breakdown-value">${selections.helmet?.name || '--'}</span>
            </div>
            <div class="breakdown-item">
                <span class="breakdown-label">Ear Pro</span>
                <span class="breakdown-value">${selections.headphones?.name || '--'}</span>
            </div>
            <div class="breakdown-item">
                <span class="breakdown-label">Armor</span>
                <span class="breakdown-value">${selections.armor?.name || '--'}</span>
            </div>
            <div class="breakdown-item">
                <span class="breakdown-label">Backpack</span>
                <span class="breakdown-value">${selections.backpack?.name || '--'}</span>
            </div>
            <div class="breakdown-item">
                <span class="breakdown-label">Weapon</span>
                <span class="breakdown-value">${selections.weapon?.name || '--'}</span>
            </div>
            <div class="breakdown-item">
                <span class="breakdown-label">Magazine</span>
                <span class="breakdown-value">${selections.magazine?.name || '--'}</span>
            </div>
            <div class="breakdown-item">
                <span class="breakdown-label">Ammo</span>
                <span class="breakdown-value">${selections.ammo?.name || '--'}</span>
            </div>
            <div class="breakdown-item">
                <span class="breakdown-label">Food</span>
                <span class="breakdown-value">${selections.food?.name || '--'}</span>
            </div>
            <div class="breakdown-item">
                <span class="breakdown-label">Drink</span>
                <span class="breakdown-value">${selections.drink?.name || '--'}</span>
            </div>
            <div class="breakdown-item">
                <span class="breakdown-label">Meds</span>
                <span class="breakdown-value">${selections.meds?.name || '--'}</span>
            </div>
        </div>
    `;
}

// ========================================
// Restart
// ========================================

function restartWizard() {
    // Reset selections
    Object.keys(selections).forEach(key => {
        selections[key] = null;
    });

    // Reset caliber filter
    selectedWeaponCaliber = null;
    selectedWeaponName = null;

    // Reset UI
    document.querySelectorAll('.gear-card').forEach(card => {
        card.classList.remove('selected');
        card.style.display = '';  // Show all cards again
        card.classList.remove('hidden');
    });

    // Reset ammo subtitle
    const ammoSubtitle = document.getElementById('ammoSubtitle');
    if (ammoSubtitle) {
        ammoSubtitle.textContent = 'PS ammo players, we see you.';
    }

    // Reset magazine subtitle
    const magSubtitle = document.getElementById('magSubtitle');
    if (magSubtitle) {
        magSubtitle.textContent = 'Choose your mag capacity.';
    }

    // Reset score circle
    const scoreCircle = document.getElementById('scoreCircle');
    if (scoreCircle) {
        scoreCircle.style.strokeDashoffset = 283;
    }

    const scoreNumber = document.getElementById('scoreNumber');
    if (scoreNumber) {
        scoreNumber.textContent = '0';
    }

    // Reset sidebar
    updateSidebar();
    updateDrawerCount();

    // Close drawer on mobile
    const sidebar = document.querySelector('.loadout-sidebar');
    if (sidebar) {
        sidebar.classList.remove('open');
    }

    // Go to first step
    currentStep = 0;
    showStep(currentStep);
    updateProgress();
    updateButtons();
}

// ========================================
// Utilities
// ========================================

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function truncate(str, length) {
    if (!str) return '--';
    return str.length > length ? str.substring(0, length) + '...' : str;
}
