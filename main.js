const playerListEl = document.getElementById("playerList");

const players = [];
const NUMBER_OF_PLAYERS = 3;

const threshold = 95;

for (let i = 1; i <= NUMBER_OF_PLAYERS; i++) {
    players.push({
        id: i,
        hits: 0,
        timelineEl: null, // reference to this player's hit timeline element
    });
}

// Create DOM elements for each player
players.forEach((player) => {
    const playerDiv = document.createElement("div");
    playerDiv.className = "player";
    // Create a timeline container inside the player's graph area
    playerDiv.innerHTML = `
    <h3>Player ${player.id}</h3>
    <div class="player-stats">
      <span>Hits: <span class="hits-count">${player.hits}</span></span>
      <span>ID: #${player.id}</span>
    </div>
    <div class="player-graph">
      <div class="graph-timeline"></div>
    </div>
  `;
    // Save reference to the timeline element for later updates
    player.timelineEl = playerDiv.querySelector(".graph-timeline");
    playerListEl.appendChild(playerDiv);
});

function logMetric(player, metricValue) {
    const now = new Date().toLocaleTimeString();
    const logContainer = document.getElementById("logContainer");
    const newLogEntry = document.createElement("div");
    
    // Choose style and message based on threshold
    if (metricValue >= threshold) {
      newLogEntry.className = "log-entry alert";
      showHitAlert(player, metricValue);
      newLogEntry.textContent = `[${now}] HIT ALERT: Player ${player.id} - Hit: ${metricValue.toFixed(2)}`;
    } else {
      newLogEntry.className = "log-entry info";
      newLogEntry.textContent = `[${now}] Player ${player.id} - Hit: ${metricValue.toFixed(2)}`;
    }
    
    logContainer.appendChild(newLogEntry);
    logContainer.scrollTop = logContainer.scrollHeight;
  }

// Receives a metric and appends a new segment to the player's graph timeline.
function updatePlayerChart(player, metricValue) {
    if (player.timelineEl) {
        const segment = document.createElement("div");
        segment.className = "graph-segment";
        if (metricValue > threshold) {
            segment.classList.add("hit");
        }
        segment.style.height = metricValue + "%";
        player.timelineEl.appendChild(segment);
        // Auto-scroll the player's timeline container to show the new data
        const graphContainer = player.timelineEl.parentElement;
        graphContainer.scrollLeft = graphContainer.scrollWidth;
    }
    // Check if the metric exceeds the threshold (50)
    logMetric(player, metricValue);
}

//Purpose: Simulate metric values by generating random numbers and passing
function simulateRandomMetrics() {
    players.forEach((player) => {
        const randomValue = Math.floor(Math.random() * 101); // random value between 0 and 100
        updatePlayerChart(player, randomValue);
    });
}

// Call simulateRandomMetrics every second (1000ms) for simulation
setInterval(simulateRandomMetrics, 2000);


function showHitAlert(player, metricValue) {
    const modalOverlay = document.getElementById("modalOverlay");

    // If the modal is already visible, do not display another alert.
    // if (modalOverlay.style.display === "flex") {
    //     return;
    // }

    // Populate modal fields with the player's information and metric
    document.getElementById("unitNumber").textContent = player.id;
    document.getElementById("angAccel").textContent = metricValue.toFixed(2);
    document.getElementById("linAccel").textContent = metricValue.toFixed(2);

    // For demonstration, increment player's hit count and update its display
    player.hits += 1;
    const playerDiv = playerListEl.querySelector(`.player:nth-child(${player.id})`);
    if (playerDiv) {
        const hitsCountEl = playerDiv.querySelector(".hits-count");
        hitsCountEl.textContent = player.hits;
    }
    document.getElementById("hitCount").textContent = player.hits;

    // Show the modal
    modalOverlay.style.display = "flex";
}


function closeModal() {
    document.getElementById("modalOverlay").style.display = "none";
}
