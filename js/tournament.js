// Get tournament ID from URL
const params = new URLSearchParams(window.location.search);
const tournamentId = params.get("id");

const tournamentName = document.getElementById("tournamentName");
const tournamentInfo = document.getElementById("tournamentInfo");
const bracketContainer = document.getElementById("bracketContainer");
const voteContainer = document.getElementById("voteContainer");
const message = document.getElementById("message");

let matches = [];
let players = [];

// Load tournament info
async function loadTournament() {
  const { data: tData, error: tError } = await supabaseClient
    .from("tournaments")
    .select("*")
    .eq("id", tournamentId)
    .single();

  if (!tError && tData) {
    tournamentName.textContent = tData.name;
    tournamentInfo.textContent = `Game: ${tData.game_id}, Dates: ${tData.start_date} to ${tData.end_date}, Status: ${tData.status}`;
  }
}

// Load players
async function loadPlayers() {
  const { data, error } = await supabaseClient
    .from("players")
    .select("*")
    .eq("tournament_id", tournamentId);
  
  if (!error) {
    players = data;
    renderBracket();
    renderVoting();
  }
}

// Load matches
async function loadMatches() {
  const { data, error } = await supabaseClient
    .from("matches")
    .select("*")
    .eq("tournament_id", tournamentId);
  
  if (!error) {
    matches = data;
    renderBracket();
    renderVoting();
  }
}

// Render bracket (simple vertical list for demo)
function renderBracket() {
  bracketContainer.innerHTML = "";
  if (matches.length === 0) {
    bracketContainer.textContent = "No matches created yet.";
    return;
  }
  matches.forEach(m => {
    const div = document.createElement("div");
    div.classList.add("match-card");
    div.innerHTML = `
      <p>${m.player1} vs ${m.player2}</p>
      <p>Winner: ${m.winner || "-"}</p>
      <p>Score: ${m.score || "-"}</p>
    `;
    bracketContainer.appendChild(div);
  });
}

// Render voting interface
function renderVoting() {
  voteContainer.innerHTML = "";
  matches.forEach(m => {
    if (!m.winner) { // only allow vote if match not finished
      const div = document.createElement("div");
      div.classList.add("vote-card");
      div.innerHTML = `
        <p>${m.player1} vs ${m.player2}</p>
        <button onclick="vote('${m.id}','${m.player1}')">${m.player1}</button>
        <button onclick="vote('${m.id}','${m.player2}')">${m.player2}</button>
      `;
      voteContainer.appendChild(div);
    }
  });
}

// Voting function
async function vote(matchId, player) {
  const { error } = await supabaseClient.from("votes").insert([
    { match_id: matchId, voted_player: player }
  ]);
  if (!error) {
    message.textContent = `Voted for ${player}`;
    message.style.color = "green";
  } else {
    message.textContent = error.message;
    message.style.color = "red";
  }
}

// Realtime updates
supabaseClient
  .from(`matches:tournament_id=eq.${tournamentId}`)
  .on("*", payload => {
    loadMatches();
  })
  .subscribe();

loadTournament();
loadPlayers();
loadMatches();
