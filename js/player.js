const playerName = document.getElementById("playerName");
const playerEmail = document.getElementById("playerEmail");
const playerTier = document.getElementById("playerTier");
const playerRecord = document.getElementById("playerRecord");
const historyTable = document.getElementById("historyTable");
const profileMessage = document.getElementById("profileMessage");

// Assume user is logged in, get session info
async function loadPlayerProfile() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) {
    profileMessage.textContent = "User not logged in";
    return;
  }

  const email = user.email;

  // Load player info
  const { data: playerData, error: pError } = await supabaseClient
    .from("player_info")
    .select("*")
    .eq("email", email)
    .single();

  if (pError || !playerData) {
    profileMessage.textContent = "Player info not found";
    return;
  }

  playerName.textContent = playerData.name;
  playerEmail.textContent = `Email: ${playerData.email}`;
  playerTier.textContent = `Tier: ${playerData.tier}`;
  playerRecord.textContent = `Wins: ${playerData.wins} | Losses: ${playerData.losses}`;

  // Load tournament history
  const { data: history, error: hError } = await supabaseClient
    .from("matches")
    .select("tournament_id, player1, player2, winner, score, tournaments(name, game_id)")
    .or(`player1.eq.${email},player2.eq.${email}`)
    .order("created_at", { ascending: false });

  if (!hError && history) {
    historyTable.innerHTML = "";
    history.forEach(match => {
      const tr = document.createElement("tr");
      const result = match.winner === email ? "Win" : (match.winner ? "Lose" : "-");
      tr.innerHTML = `
        <td>${match.tournaments.name}</td>
        <td>${match.tournaments.game_id}</td>
        <td>${match.player1 === email ? match.score?.player1 || 0 : match.score?.player2 || 0}</td>
        <td>${match.player1 === email ? match.score?.player2 || 0 : match.score?.player1 || 0}</td>
        <td>${result}</td>
      `;
      historyTable.appendChild(tr);
    });
  }
}

// Realtime updates for matches
supabaseClient
  .from("matches")
  .on("*", payload => {
    loadPlayerProfile();
  })
  .subscribe();

loadPlayerProfile();
