const createTournamentForm = document.getElementById("createTournamentForm");
const addPlayerForm = document.getElementById("addPlayerForm");
const gameSelect = document.getElementById("gameSelect");
const playerList = document.getElementById("playerList");
const message = document.getElementById("message");

let players = [];

// Load games for tournament
async function loadGames() {
  const { data, error } = await supabaseClient.from("games").select("*");
  if (!error && data) {
    data.forEach(game => {
      const option = document.createElement("option");
      option.value = game.id;
      option.textContent = game.name;
      gameSelect.appendChild(option);
    });
  }
}

// Create tournament
createTournamentForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("tournamentName").value;
  const game_id = gameSelect.value;
  const start_date = document.getElementById("startDate").value;
  const end_date = document.getElementById("endDate").value;
  const description = document.getElementById("description").value;

  const { data, error } = await supabaseClient.from("tournaments").insert([
    { name, game_id, start_date, end_date, description, status: "upcoming" }
  ]).select().single();

  if (!error) {
    message.textContent = "Tournament created successfully!";
    message.style.color = "green";
    // Add initial players
    players.forEach(async p => {
      await supabaseClient.from("players").insert([{ tournament_id: data.id, user_email: p }]);
    });
    players = [];
    renderPlayerList();
    createTournamentForm.reset();
  } else {
    message.textContent = error.message;
    message.style.color = "red";
  }
});

// Add player to list (temporary before saving)
addPlayerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("playerEmail").value;
  if (!players.includes(email)) {
    players.push(email);
    renderPlayerList();
    addPlayerForm.reset();
  }
});

function renderPlayerList() {
  playerList.innerHTML = "";
  players.forEach((p, index) => {
    const div = document.createElement("div");
    div.textContent = p + " ";
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.style.padding = "2px 5px";
    removeBtn.style.marginLeft = "5px";
    removeBtn.addEventListener("click", () => {
      players.splice(index, 1);
      renderPlayerList();
    });
    div.appendChild(removeBtn);
    playerList.appendChild(div);
  });
}

loadGames();
