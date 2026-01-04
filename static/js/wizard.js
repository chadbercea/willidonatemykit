// ========================================
// WILL I DONATE MY KIT? - Wizard Logic
// ========================================

// State
let currentStep = 0;
const totalSteps = 7; // 0-6 (Map, Helmet, Armor, Backpack, Weapon, Ammo, Verdict)

const selections = {
    map: null,
    helmet: null,
    armor: null,
    backpack: null,
    weapon: null,
    ammo: null
};

// Category to step mapping
const categoryToStep = {
    map: 0,
    helmet: 1,
    armor: 2,
    backpack: 3,
    weapon: 4,
    ammo: 5
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

// ========================================
// Initialization
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initCardSelection();
    updateProgress();
    updateButtons();
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
        armorDamage: parseFloat(card.dataset.armorDamage) || 0
    };

    // Update summary bar
    updateSummary(category, card.dataset.name);

    // Enable next button
    updateButtons();
}

function updateSummary(category, value) {
    const summaryEl = document.getElementById(`summary${capitalize(category)}`);
    if (summaryEl) {
        summaryEl.textContent = truncate(value, 12);
        summaryEl.closest('.summary-item').classList.add('filled');
    }
}

// ========================================
// Navigation
// ========================================

function nextStep() {
    const currentCategory = Object.keys(categoryToStep).find(key => categoryToStep[key] === currentStep);

    // Validate selection for current step (except verdict step)
    if (currentStep < 6 && !selections[currentCategory]) {
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

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress() {
    // Update progress bar width
    const progress = (currentStep / (totalSteps - 1)) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;

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

    // Back button
    btnBack.disabled = currentStep === 0;

    // Get current category
    const currentCategory = Object.keys(categoryToStep).find(key => categoryToStep[key] === currentStep);
    const hasSelection = currentCategory ? selections[currentCategory] !== null : false;

    // Show verdict button on last selection step (ammo = step 5)
    if (currentStep === 5) {
        btnNext.style.display = 'none';
        btnVerdict.style.display = 'flex';
        btnVerdict.disabled = !hasSelection;
    } else if (currentStep === 6) {
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
    btn.classList.add('shake');
    setTimeout(() => btn.classList.remove('shake'), 500);
}

// ========================================
// Verdict Calculation
// ========================================

function calculateVerdict() {
    // Go to verdict step
    currentStep = 6;
    showStep(currentStep);
    updateProgress();
    updateButtons();

    // Show loading
    document.getElementById('verdictLoading').style.display = 'flex';
    document.getElementById('verdictResult').style.display = 'none';

    // Cycle through loading messages
    let msgIndex = 0;
    const loadingInterval = setInterval(() => {
        msgIndex = (msgIndex + 1) % loadingMessages.length;
        document.getElementById('loadingText').textContent = loadingMessages[msgIndex];
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
    const totalGearValue = helmetValue + armorValue + backpackValue + weaponValue;

    // Get ammo stats
    const ammoDamage = selections.ammo?.damage || 0;
    const armorDamage = selections.ammo?.armorDamage || 0;

    // Get map difficulty (using raid duration as proxy)
    const mapDifficulty = selections.map?.value || 30;

    // Normalize scores (0-100)
    // Gear: Max reasonable value ~500,000 rubles
    const gearScore = Math.min((totalGearValue / 500000) * 100, 100);

    // Ammo: Damage typically 40-90, armor damage 20-60
    const ammoScore = Math.min(((ammoDamage / 90) * 50 + (armorDamage / 60) * 50), 100);

    // Map: Longer raids = harder (invert so short = easier)
    const mapScore = Math.max(100 - (mapDifficulty / 50) * 30, 40);

    // Weighted final score
    const finalScore = Math.round(
        gearScore * 0.35 +      // Gear value matters most
        ammoScore * 0.35 +      // Ammo quality equally important
        mapScore * 0.15 +       // Map difficulty
        Math.random() * 15      // RNG because it's Tarkov
    );

    return Math.min(Math.max(finalScore, 5), 100); // Clamp between 5-100
}

function showVerdict(score) {
    document.getElementById('verdictLoading').style.display = 'none';
    document.getElementById('verdictResult').style.display = 'block';

    // Animate score number
    animateScore(score);

    // Set score ring color and fill
    const scoreCircle = document.getElementById('scoreCircle');
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

    // Set verdict message
    const message = getVerdictMessage(score);
    document.getElementById('verdictMessage').textContent = message;

    // Show breakdown
    showBreakdown();
}

function animateScore(targetScore) {
    const scoreEl = document.getElementById('scoreNumber');
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
    breakdown.innerHTML = `
        <div class="breakdown-item">
            <span class="breakdown-label">Map</span>
            <span class="breakdown-value">${selections.map?.name || '--'}</span>
        </div>
        <div class="breakdown-item">
            <span class="breakdown-label">Helmet</span>
            <span class="breakdown-value">${selections.helmet?.name || '--'}</span>
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
            <span class="breakdown-label">Ammo</span>
            <span class="breakdown-value">${selections.ammo?.name || '--'}</span>
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

    // Reset UI
    document.querySelectorAll('.gear-card').forEach(card => {
        card.classList.remove('selected');
    });

    document.querySelectorAll('.summary-item').forEach(item => {
        item.classList.remove('filled');
        item.querySelector('.summary-value').textContent = '--';
    });

    // Reset score circle
    document.getElementById('scoreCircle').style.strokeDashoffset = 283;
    document.getElementById('scoreNumber').textContent = '0';

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
