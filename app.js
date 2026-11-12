const startButtonEl = document.querySelector('.start-game-button');
const greenLight = document.querySelector('.green-light');
const redLight = document.querySelector('.red-light');
const blueLight = document.querySelector('.blue-light');
const yellowLight = document.querySelector('.yellow-light');

const lights = [greenLight, redLight, blueLight, yellowLight];

let gameSequence = [];
let playerStep = 0;
let level = 0;
let isPlayerTurn = false;
let isGameActive = false;

// Helper to flash a single light for a specific duration
function flashLight(lightEl, duration) {
    lightEl.classList.add('active');
    setTimeout(() => {
        lightEl.classList.remove('active');
    }, duration);
}

// Calculate speed based on current level (gets faster, caps at 250ms)
function getStepDuration() {
    const baseSpeed = 1000;
    const speedDecrease = level * 60; 
    return Math.max(250, baseSpeed - speedDecrease);
}

function startNextRound() {
    isPlayerTurn = false;
    playerStep = 0;
    level++;

  // Add one random light to the growing sequence
    const randomLight = lights[Math.floor(Math.random() * lights.length)];
    gameSequence.push(randomLight);

    playSequence();
}

function playSequence() {
    const stepDuration = getStepDuration();
    const flashDuration = stepDuration * 0.6; // Light stays on for 60% of the beat

    gameSequence.forEach((lightEl, index) => {
        setTimeout(() => {
        if (!isGameActive) return;
        flashLight(lightEl, flashDuration);
        }, index * stepDuration);
    });

  // Unlock player controls right after the last light finishes flashing
    setTimeout(() => {
        if (isGameActive) {
        isPlayerTurn = true;
        }
    }, gameSequence.length * stepDuration);
}

function handleLightClick(clickedLight) {
  // Ignore clicks if the game hasn't started or the computer is still showing the pattern
    if (!isGameActive || !isPlayerTurn) return;

    // Give visual feedback for the player's click
    flashLight(clickedLight, 200);

    // Check if the clicked light matches the expected light in the sequence
    if (clickedLight === gameSequence[playerStep]) {
        playerStep++;

        // If the player finished the entire sequence for this round
        if (playerStep === gameSequence.length) {
        isPlayerTurn = false;
        setTimeout(startNextRound, 1000); // Pause 1 second before next round
        }
    } else {
        handleGameOver();
    }
}

function handleGameOver() {
    isGameActive = false;
    isPlayerTurn = false;
    alert(`Game Over! You reached Level ${level}.`);
    resetGame();
}

function resetGame() {
    gameSequence = [];
    playerStep = 0;
    level = 0;
    isPlayerTurn = false;
    isGameActive = false;
    lights.forEach(light => light.classList.remove('active'));
}

// Attach click listeners to each of the 4 colored lights
lights.forEach(light => {
    light.addEventListener('click', () => handleLightClick(light));
});

// Start or restart the game
startButtonEl.addEventListener('click', () => {
    resetGame();
    isGameActive = true;
    startNextRound();
});