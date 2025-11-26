const tournamentCards = document.getElementById("tournamentCards");
const searchInput = document.getElementById("searchInput");
const gameFilter = document.getElementById("gameFilter");
const statusFilter = document.getElementById("statusFilter");
const createBtn = document.getElementById("createTournamentBtn");

let tournaments = [];
let games = [];

// Fetch all games for the filter dropdown
async function loadGames() {
  const { data, error } = await supabaseClient.from("games").select("*");
  if (!error && data) {
    games = data;
    data.forEach(game => {
      const option = document.createElement("option");
      option.value = game.id;
      option.textContent = game.name;
      gameFilter.appendChild(option);
    });
  }
}

// Fetch all tournaments
async function loadTournaments() {
  const { data, error } = await supabaseClient.from("tournaments").select("*");
  if (!error && data) {
    tournaments = data;
    renderTournaments();
  }
}

// Render tournament cards
function renderTournaments() {
  tournamentCards.innerHTML = "";

  let filtered = tournaments.filter(t => {
    const search = searchInput.value.toLowerCase();
    const matchesSearch = t.name.toLowerCase().includes(search);
    const matchesGame = !gameFilter.value || t.game_id === gameFilter.value;
    const matchesStatus = !statusFilter.value || t.status === statusFilter.value;
    return matchesSearch && matchesGame && matchesStatus;
  });

  filtered.forEach(t => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <h3>${t.name}</h3>
      <p>Status: <span class="${t.status}">${t.status}</span></p>
      <a href="tournament-details.html?id=${t.id}">View Details</a>
    `;
    tournamentCards.appendChild(card);
  });
}

// Event listeners
searchInput.addEventListener("input", renderTournaments);
gameFilter.addEventListener("change", renderTournaments);
statusFilter.addEventListener("change", renderTournaments);

// Admin: create tournament
if (createBtn) {
  createBtn.addEventListener("click", () => {
    window.location.href = "tournament-create.html";
  });
}

// Realtime subscription for tournaments
supabaseClient
  .from("tournaments")
  .on("INSERT", payload => {
    tournaments.push(payload.new);
    renderTournaments();
  })
  .subscribe();

loadGames();
loadTournaments();
