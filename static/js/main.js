const playerListEl = document.getElementById("playerList");

const players = {};
// const NUMBER_OF_PLAYERS = 3;

const threshold = 95;

function load_new_player(id, name) {
  let new_player = {
    id: id,
    name: name,
    hits: 0,
    timelineEl: null, // reference to this player's hit timeline element
  }; 

  const playerDiv = document.createElement("div");
  playerDiv.className = "player";
  // Create a timeline container inside the player's graph area
  playerDiv.innerHTML = `
    <h3>Player ${new_player.id}</h3>
    <div class="player-stats">
      <span>Hits: <span class="hits-count">${new_player.hits}</span></span>
      <span>ID: #${new_player.id}</span>

    </div>
    <div class="player-graph">
      <div class="graph-timeline"></div>
    </div>
  `;
  // Save reference to the timeline element for later updates
  new_player.timelineEl = playerDiv.querySelector(".graph-timeline");
  playerListEl.appendChild(playerDiv);
  
  // Add the new player to the players object
  players[new_player.id] = new_player;
  console.log("New player added:", new_player.name);
}

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

function getPlayerHitData(){
  console.log("Fetching player data...");
  fetch("/data")
  .then(response => response.json())
  .then(data => {
    // Check if the player already exists in the players object
    if (!players[data.player_id]) {
      load_new_player(data.player_id, data.player_name);
    }
    
    const player = players[data.player_id];
    const metricValue = data.hit;
    
    // Update the player's chart with the new metric value
    updatePlayerChart(player, metricValue);
  })
  .catch(error => {
    console.error("Error fetching player data:", error);
  });
  
}

// Call simulateRandomMetrics every second (1000ms) for simulation
setInterval(getPlayerHitData, 2000);


function showHitAlert(player, metricValue) {
    const modalOverlay = document.getElementById("modalOverlay");

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
