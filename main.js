const playerListEl = document.getElementById("playerList");

// Store player data; in a real app, you might fetch this from a server
const players = [];
const NUMBER_OF_PLAYERS = 50;

for (let i = 1; i <= NUMBER_OF_PLAYERS; i++) {
  players.push({
    id: i,
    hits: 0,
    timelineEl: null, // will hold a reference to this player's timeline element
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

// SIMULATE GRAPH DATA
function simulateGraphs() {
  players.forEach((player) => {
    if (player.timelineEl) {
      // Generate a random value (0 to 100) to represent this measurement
      const randomValue = Math.floor(Math.random() * 101);
      // Create a new segment element for the timeline
      const segment = document.createElement("div");
      segment.className = "graph-segment";
      // Set the segment height as a percentage of the container's height
      segment.style.height = randomValue + "%";
      // Append the segment to the timeline
      player.timelineEl.appendChild(segment);
      // Auto-scroll to the newest data point
      const graphContainer = player.timelineEl.parentElement;
      graphContainer.scrollLeft = graphContainer.scrollWidth;
    }
  });
}

// Append new graph data every second
setInterval(simulateGraphs, 1000);

// HIT ALERT & LOG SIMULATION
function simulateHit() {
  // Populate modal fields (using dummy data for demonstration)
  document.getElementById("unitNumber").textContent = "4";
  document.getElementById("angAccel").textContent = "65.43";
  document.getElementById("linAccel").textContent = "100.12";
  document.getElementById("hitCount").textContent = "3rd";

  // Display the hit alert modal
  const modalOverlay = document.getElementById("modalOverlay");
  modalOverlay.style.display = "flex";

  // Log the hit alert
  const logContainer = document.getElementById("logContainer");
  const newLogEntry = document.createElement("div");
  newLogEntry.className = "log-entry alert";
  const now = new Date().toLocaleTimeString();
  newLogEntry.textContent = `[${now}] HIT ALERT: Unit 4, Angular=65.43 G, Linear=100.12 G`;
  logContainer.appendChild(newLogEntry);

  // Auto-scroll the log container
  logContainer.scrollTop = logContainer.scrollHeight;
}

function closeModal() {
  document.getElementById("modalOverlay").style.display = "none";
}
