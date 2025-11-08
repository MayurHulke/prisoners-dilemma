import { firebaseConfig, isFirebaseConfigured } from '../shared/firebase-config.js';

// Game state
let gameState = {
    playerName: 'Anonymous',
    currentRound: 1,
    totalRounds: 10,
    fishPopulation: 100,
    totalFishCaught: 0,
    totalEarnings: 0,
    choices: [],
    roundHistory: [],
    lakeDied: false,
    gameId: null
};

// AI villager strategies
const VILLAGER_STRATEGIES = {
    greedy: { name: 'Greedy Gary', baseAmount: 15, adaptability: 0.1 },
    moderate: { name: 'Moderate Mary', baseAmount: 10, adaptability: 0.3 },
    sustainable: { name: 'Sustainable Sam', baseAmount: 5, adaptability: 0.2 },
    adaptive: { name: 'Adaptive Alice', baseAmount: 10, adaptability: 0.8 }
};

const REGENERATION_RATE = 30;
const NUM_VILLAGERS = 4;

// Firebase references
let db = null;
let app = null;

// Initialize Firebase
async function initFirebase() {
    if (!isFirebaseConfigured()) {
        console.log('Firebase not configured - using demo mode');
        return false;
    }

    try {
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
        const { getDatabase } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js');

        app = initializeApp(firebaseConfig);
        db = getDatabase(app);
        return true;
    } catch (error) {
        console.log('Firebase initialization failed:', error);
        return false;
    }
}

// Generate unique game ID
function generateGameId() {
    return `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const resultsScreen = document.getElementById('results-screen');
const startGameBtn = document.getElementById('start-game-btn');
const playerNameInput = document.getElementById('player-name');

// Welcome screen stats
async function loadWelcomeStats() {
    if (!db) {
        document.getElementById('preview-survival-rate').textContent = '42%';
        document.getElementById('preview-avg-greed').textContent = '65%';
        return;
    }

    try {
        const { ref, get } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js');
        const gamesRef = ref(db, 'tragedy-games');
        const snapshot = await get(gamesRef);

        if (snapshot.exists()) {
            const games = Object.values(snapshot.val());

            // Calculate survival rate
            const survived = games.filter(g => !g.lakeDied).length;
            const survivalRate = Math.round((survived / games.length) * 100);
            document.getElementById('preview-survival-rate').textContent = `${survivalRate}%`;

            // Calculate average greed (how much above sustainable level)
            const avgGreed = games.reduce((sum, g) => {
                const avgCatch = g.totalFishCaught / g.totalRounds;
                const greedPercent = Math.min(100, ((avgCatch - 6) / 9) * 100); // 6 is sustainable, 15 is max
                return sum + greedPercent;
            }, 0) / games.length;
            document.getElementById('preview-avg-greed').textContent = `${Math.round(avgGreed)}%`;
        }
    } catch (error) {
        console.log('Error loading welcome stats:', error);
    }
}

// Load player count
async function loadPlayerCount() {
    const playerCountEl = document.getElementById('total-players');

    if (!db) {
        playerCountEl.textContent = '1,584';
        return;
    }

    try {
        const { ref, get } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js');
        const gamesRef = ref(db, 'tragedy-games');
        const snapshot = await get(gamesRef);

        if (snapshot.exists()) {
            const count = Object.keys(snapshot.val()).length;
            playerCountEl.textContent = count.toLocaleString();
        } else {
            playerCountEl.textContent = '0';
        }
    } catch (error) {
        console.log('Error loading player count:', error);
        playerCountEl.textContent = '...';
    }
}

// Start game
startGameBtn.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    gameState.playerName = name || 'Anonymous';
    gameState.gameId = generateGameId();

    welcomeScreen.style.display = 'none';
    gameScreen.style.display = 'block';

    startRound();
});

// Start round
function startRound() {
    if (gameState.lakeDied) {
        endGame();
        return;
    }

    updateRoundHeader();
    updateResourceDisplay();
    showDecisionView();
    updateStats();
}

function updateRoundHeader() {
    document.getElementById('round-number').textContent = gameState.currentRound;
    const progress = (gameState.currentRound / gameState.totalRounds) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
}

function updateResourceDisplay() {
    const fishCount = Math.max(0, Math.round(gameState.fishPopulation));
    const percentage = Math.max(0, Math.min(100, gameState.fishPopulation));

    document.getElementById('fish-count').textContent = `${fishCount} fish`;
    document.getElementById('resource-fill').style.width = `${percentage}%`;

    // Update resource bar color
    const resourceFill = document.getElementById('resource-fill');
    const indicators = document.querySelectorAll('.indicator-label');
    indicators.forEach(ind => ind.style.display = 'none');

    if (percentage <= 0) {
        resourceFill.className = 'resource-fill critical';
        document.querySelector('.indicator-label.dead').style.display = 'inline';
    } else if (percentage < 30) {
        resourceFill.className = 'resource-fill critical';
        document.querySelector('.indicator-label.critical').style.display = 'inline';
    } else if (percentage < 60) {
        resourceFill.className = 'resource-fill warning';
        document.querySelector('.indicator-label.warning').style.display = 'inline';
    } else {
        resourceFill.className = 'resource-fill';
        document.querySelector('.indicator-label.healthy').style.display = 'inline';
    }
}

// Show decision view
function showDecisionView() {
    document.getElementById('decision-view').style.display = 'block';
    document.getElementById('result-view').style.display = 'none';

    // Add click handlers to fishing buttons
    const fishingBtns = document.querySelectorAll('.fishing-btn');
    fishingBtns.forEach(btn => {
        btn.onclick = () => {
            const amount = parseInt(btn.dataset.amount);
            handlePlayerChoice(amount);
        };
    });
}

// Handle player choice
function handlePlayerChoice(playerCatch) {
    // Generate AI villagers' choices
    const villagerCatches = generateVillagerChoices();

    // Calculate total catch
    const totalCatch = playerCatch + villagerCatches.reduce((sum, v) => sum + v.amount, 0);

    // Update fish population
    const previousPopulation = gameState.fishPopulation;
    gameState.fishPopulation += REGENERATION_RATE - totalCatch;

    // Check if lake died
    if (gameState.fishPopulation <= 0) {
        gameState.fishPopulation = 0;
        gameState.lakeDied = true;
    }

    // Calculate earnings (fish value depends on lake health)
    const lakeHealthMultiplier = Math.max(0.1, gameState.fishPopulation / 100);
    const earnings = Math.round(playerCatch * lakeHealthMultiplier * 10);

    // Update game state
    gameState.totalFishCaught += playerCatch;
    gameState.totalEarnings += earnings;
    gameState.choices.push(playerCatch);
    gameState.roundHistory.push({
        round: gameState.currentRound,
        playerCatch,
        totalCatch,
        fishBefore: previousPopulation,
        fishAfter: gameState.fishPopulation,
        earnings
    });

    // Show result
    showRoundResult(playerCatch, villagerCatches, totalCatch, earnings, previousPopulation);
}

// Generate AI villager choices
function generateVillagerChoices() {
    const villagers = Object.values(VILLAGER_STRATEGIES);
    const choices = [];

    villagers.forEach(villager => {
        let amount = villager.baseAmount;

        // Adaptive behavior based on lake health
        if (villager.adaptability > 0) {
            const healthPercent = gameState.fishPopulation / 100;
            if (healthPercent < 0.3) {
                // Lake is dying, reduce fishing based on adaptability
                amount = Math.round(amount * (1 - villager.adaptability * 0.5));
            } else if (healthPercent > 0.8) {
                // Lake is healthy, might fish more
                amount = Math.round(amount * (1 + villager.adaptability * 0.2));
            }
        }

        // Clamp amount
        amount = Math.max(5, Math.min(15, amount));

        choices.push({
            name: villager.name,
            amount: amount
        });
    });

    return choices;
}

// Show round result
function showRoundResult(playerCatch, villagerCatches, totalCatch, earnings, previousPopulation) {
    document.getElementById('decision-view').style.display = 'none';
    document.getElementById('result-view').style.display = 'block';

    const resultContent = document.getElementById('result-content');
    const netChange = gameState.fishPopulation - previousPopulation + totalCatch - REGENERATION_RATE;

    let resultHTML = `
        <p style="margin-bottom: 1rem;"><strong>Round ${gameState.currentRound} Results:</strong></p>
        <p style="margin-bottom: 0.5rem;">You caught: <span style="color: var(--warning-color)">${playerCatch} fish</span></p>
        <p style="margin-bottom: 0.5rem;">You earned: <span style="color: var(--success-color)">$${earnings}</span></p>
        <p style="margin-bottom: 1rem;">Village total: <span style="color: var(--danger-color)">${totalCatch} fish</span></p>

        <div style="background: rgba(0,217,255,0.1); padding: 1rem; margin: 1rem 0; border-left: 3px solid var(--primary-color);">
            <p style="margin-bottom: 0.5rem;">Regeneration: +${REGENERATION_RATE} fish</p>
            <p style="margin-bottom: 0.5rem;">Total catch: -${totalCatch} fish</p>
            <p style="margin-bottom: 0;">Net change: <span style="color: ${netChange >= 0 ? 'var(--success-color)' : 'var(--danger-color)'};">${netChange >= 0 ? '+' : ''}${netChange} fish</span></p>
        </div>
    `;

    if (gameState.lakeDied) {
        resultHTML += `
            <p style="color: var(--danger-color); font-size: 0.8rem; margin-top: 1rem;">
                💀 THE LAKE IS DEPLETED! The village has destroyed its only food source.
            </p>
        `;
    } else if (gameState.fishPopulation < 30) {
        resultHTML += `
            <p style="color: var(--danger-color); margin-top: 1rem;">
                ⚠️ WARNING: The lake is in critical condition!
            </p>
        `;
    }

    resultContent.innerHTML = resultHTML;

    // Update village activity display
    updateVillageActivity(villagerCatches);

    // Add to history
    addToHistory(playerCatch, totalCatch, earnings);

    // Update resource display
    updateResourceDisplay();
    updateStats();

    // Next round button
    document.getElementById('next-round-btn').onclick = () => {
        if (gameState.currentRound < gameState.totalRounds && !gameState.lakeDied) {
            gameState.currentRound++;
            startRound();
        } else {
            endGame();
        }
    };
}

// Update village activity
function updateVillageActivity(villagerCatches) {
    const villageActivity = document.getElementById('village-activity');
    let html = `<p style="margin-bottom: 1rem; color: var(--primary-color);">Round ${gameState.currentRound} Catches:</p>`;

    villagerCatches.forEach(villager => {
        const greedLevel = villager.amount <= 5 ? '🟢' : villager.amount <= 10 ? '🟡' : '🔴';
        html += `
            <div class="villager-action">
                ${greedLevel} <strong>${villager.name}:</strong> ${villager.amount} fish
            </div>
        `;
    });

    villageActivity.innerHTML = html;
}

// Add to history
function addToHistory(playerCatch, totalCatch, earnings) {
    const historyList = document.getElementById('history-list');

    // Remove empty state
    const emptyState = historyList.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }

    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
        <div class="history-item-header">Round ${gameState.currentRound}</div>
        <div class="history-item-detail">
            Caught: ${playerCatch} fish | Earned: $${earnings} | Total: ${totalCatch} caught
        </div>
    `;

    historyList.insertBefore(historyItem, historyList.firstChild);
}

// Update stats
function updateStats() {
    document.getElementById('total-fish').textContent = gameState.totalFishCaught;
    document.getElementById('total-earnings').textContent = `$${gameState.totalEarnings}`;

    const avgCatch = gameState.choices.length > 0
        ? (gameState.totalFishCaught / gameState.choices.length).toFixed(1)
        : 0;
    document.getElementById('avg-catch').textContent = avgCatch;

    // Greed score: how much above sustainable (6 fish per round)
    const greedScore = gameState.choices.length > 0
        ? Math.min(100, Math.max(0, ((avgCatch - 6) / 9) * 100))
        : 0;
    document.getElementById('greed-score').textContent = `${Math.round(greedScore)}%`;
}

// End game
async function endGame() {
    // Save game data to Firebase
    await saveGameData();

    // Show results screen
    gameScreen.style.display = 'none';
    resultsScreen.style.display = 'block';

    displayFinalResults();
}

// Save game data
async function saveGameData() {
    if (!db) {
        console.log('Demo mode - not saving data');
        return;
    }

    try {
        const { ref, set } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js');

        const gameData = {
            gameId: gameState.gameId,
            playerName: gameState.playerName,
            timestamp: Date.now(),
            totalFishCaught: gameState.totalFishCaught,
            totalEarnings: gameState.totalEarnings,
            totalRounds: gameState.currentRound,
            finalLakeHealth: gameState.fishPopulation,
            lakeDied: gameState.lakeDied,
            choices: gameState.choices,
            avgCatch: gameState.totalFishCaught / gameState.choices.length,
            completed: true
        };

        const gameRef = ref(db, `tragedy-games/${gameState.gameId}`);
        await set(gameRef, gameData);

        console.log('Game data saved successfully');
    } catch (error) {
        console.log('Error saving game data:', error);
    }
}

// Display final results
async function displayFinalResults() {
    // Title and outcome message
    const resultsTitle = document.getElementById('results-title');
    const outcomeMessage = document.getElementById('outcome-message');

    if (gameState.lakeDied) {
        resultsTitle.textContent = '💀 The Lake Died';
        outcomeMessage.className = 'outcome-message failure';
        outcomeMessage.innerHTML = `
            <p style="font-size: 1.2rem; margin-bottom: 1rem;">TRAGEDY COMPLETE</p>
            <p>The village's greed destroyed the lake. Everyone starved.</p>
            <p style="margin-top: 1rem; font-size: 0.6rem;">This is exactly what happened to the Grand Banks fishery, Easter Island, and countless other real-world commons.</p>
        `;
    } else if (gameState.fishPopulation >= 80) {
        resultsTitle.textContent = '🎉 Sustainable Success!';
        outcomeMessage.className = 'outcome-message success';
        outcomeMessage.innerHTML = `
            <p style="font-size: 1.2rem; margin-bottom: 1rem;">SUSTAINABILITY ACHIEVED</p>
            <p>The village fished responsibly and the lake thrived!</p>
            <p style="margin-top: 1rem; font-size: 0.6rem;">This is rare. Most players destroy the resource.</p>
        `;
    } else {
        resultsTitle.textContent = '⚠️ Lake Survived... Barely';
        outcomeMessage.className = 'outcome-message';
        outcomeMessage.innerHTML = `
            <p style="font-size: 1.2rem; margin-bottom: 1rem;">CLOSE CALL</p>
            <p>The lake survived, but it's damaged. One more greedy village and it collapses.</p>
        `;
    }

    // Display final stats
    document.getElementById('final-earnings').textContent = `$${gameState.totalEarnings}`;
    document.getElementById('final-fish').textContent = gameState.totalFishCaught;
    document.getElementById('final-lake').textContent = `${Math.round(gameState.fishPopulation)}%`;

    // Load comparison data
    await loadComparisonData();

    // Create resource chart
    createResourceChart();

    // Show insights
    displayInsights();

    // Play again button
    document.getElementById('play-again-btn').onclick = () => {
        location.reload();
    };
}

// Load comparison data
async function loadComparisonData() {
    const comparisonContent = document.getElementById('comparison-content');
    const avgCatch = gameState.totalFishCaught / gameState.choices.length;

    if (!db) {
        comparisonContent.innerHTML = `
            <p style="margin-bottom: 1rem;">Your average catch: <span style="color: var(--warning-color)">${avgCatch.toFixed(1)} fish/round</span></p>
            <p style="margin-bottom: 1rem;">Sustainable level: <span style="color: var(--success-color)">6 fish/round</span></p>
            <p style="color: var(--primary-color);">You were ${avgCatch > 6 ? 'more greedy' : 'more sustainable'} than the sustainable level</p>
            <p style="margin-top: 1.5rem; font-size: 0.55rem; color: var(--text-secondary);">Note: Demo mode - showing simulated data</p>
        `;
        return;
    }

    try {
        const { ref, get } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js');
        const gamesRef = ref(db, 'tragedy-games');
        const snapshot = await get(gamesRef);

        if (snapshot.exists()) {
            const games = Object.values(snapshot.val());

            // Calculate percentiles
            const avgCatches = games.map(g => g.avgCatch).filter(c => c > 0);
            const lowerCount = avgCatches.filter(c => c < avgCatch).length;
            const greedPercentile = avgCatches.length > 0
                ? Math.round((lowerCount / avgCatches.length) * 100)
                : 50;

            // Lake survival comparison
            const survived = games.filter(g => !g.lakeDied).length;
            const survivalRate = Math.round((survived / games.length) * 100);

            comparisonContent.innerHTML = `
                <p style="margin-bottom: 1rem;">Your average: <span style="color: var(--warning-color)">${avgCatch.toFixed(1)} fish/round</span></p>
                <p style="margin-bottom: 1rem;">Sustainable level: <span style="color: var(--success-color)">6 fish/round</span></p>
                <p style="margin-bottom: 1rem;">Greed percentile: <span style="color: var(--warning-color)">${greedPercentile}th</span></p>
                <p style="margin-bottom: 1rem;">Lake survival rate: <span style="color: ${survivalRate > 50 ? 'var(--success-color)' : 'var(--danger-color)'};">${survivalRate}%</span></p>
                <p style="color: var(--primary-color);">${getPlayerArchetype(avgCatch)}</p>
            `;
        }
    } catch (error) {
        console.log('Error loading comparison data:', error);
    }
}

// Get player archetype
function getPlayerArchetype(avgCatch) {
    if (avgCatch <= 6) {
        return '🌱 Conservationist - You prioritize long-term sustainability';
    } else if (avgCatch <= 8) {
        return '⚖️ Pragmatist - You balance profit and sustainability';
    } else if (avgCatch <= 12) {
        return '💰 Opportunist - You maximize gain while the resource lasts';
    } else {
        return '🏴‍☠️ Exploiter - You take as much as possible, consequences be damned';
    }
}

// Create resource chart
function createResourceChart() {
    const ctx = document.getElementById('resourceChart').getContext('2d');

    const labels = gameState.roundHistory.map(r => `R${r.round}`);
    const data = gameState.roundHistory.map(r => r.fishAfter);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Lake Health (%)',
                data: data,
                borderColor: 'rgba(0, 255, 65, 1)',
                backgroundColor: 'rgba(0, 255, 65, 0.1)',
                borderWidth: 3,
                tension: 0.3
            }, {
                label: 'Sustainable Level',
                data: Array(labels.length).fill(60),
                borderColor: 'rgba(255, 221, 0, 1)',
                borderDash: [5, 5],
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 120,
                    ticks: { color: '#a0a8d4' },
                    grid: { color: 'rgba(0, 217, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#a0a8d4' },
                    grid: { color: 'rgba(0, 217, 255, 0.1)' }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#ffffff', font: { size: 10 } }
                }
            }
        }
    });
}

// Display insights
function displayInsights() {
    const insightsGrid = document.getElementById('insights-grid');

    const avgCatch = gameState.totalFishCaught / gameState.choices.length;
    const maxCatch = Math.max(...gameState.choices);
    const minCatch = Math.min(...gameState.choices);

    insightsGrid.innerHTML = `
        <div class="insight-card">
            <h4>Your Strategy</h4>
            <p>Average: ${avgCatch.toFixed(1)} fish/round. Ranged from ${minCatch} to ${maxCatch}. ${avgCatch > 6 ? 'You exceeded sustainable levels.' : 'You stayed within sustainable limits!'}</p>
        </div>
        <div class="insight-card">
            <h4>The Math</h4>
            <p>With 5 fishers and 30 fish regenerating, sustainable catch is 6 fish/person. The village averaged ${(gameState.roundHistory.reduce((sum, r) => sum + r.totalCatch, 0) / gameState.choices.length).toFixed(1)} total (${avgCatch > 6 ? 'OVER' : 'under'} sustainable).</p>
        </div>
        <div class="insight-card">
            <h4>Real World</h4>
            <p>90% of global fisheries are fully exploited or overfished. The same pattern: everyone knows overfishing is happening, but individual incentives drive collective disaster.</p>
        </div>
        <div class="insight-card">
            <h4>The Solution?</h4>
            <p>Successful commons need: defined boundaries, local decision-making, monitoring, graduated sanctions, and conflict resolution. Pure self-interest destroys shared resources.</p>
        </div>
    `;
}

// Initialize game
async function init() {
    await initFirebase();
    await loadPlayerCount();
    await loadWelcomeStats();
}

// Start when page loads
init();
