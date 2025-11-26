const playerTable = document.getElementById("playerTable");
const playerMessage = document.getElementById("playerMessage");

async function loadPlayers() {
  const { data, error } = await supabaseClient.from("player_info").select("*");
  if (!error) {
    renderPlayers(data);
  }
}

function renderPlayers(players) {
  playerTable.innerHTML = "";
  players.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.email}</td>
      <td>${p.wins}</td>
      <td>${p.losses}</td>
      <td>${p.tier}</td>
      <td>
        <button onclick="removePlayer('${p.id}')">Remove</button>
      </td>
    `;
    playerTable.appendChild(tr);
  });
}

async function removePlayer(id) {
  const { error } = await supabaseClient.from("player_info").delete().eq("id", id);
  if (!error) {
    playerMessage.textContent = "Player removed!";
    playerMessage.style.color = "green";
    loadPlayers();
  } else {
    playerMessage.textContent = error.message;
    playerMessage.style.color = "red";
  }
}

// Realtime subscription
supabaseClient
  .from("player_info")
  .on("*", payload => {
    loadPlayers();
  })
  .subscribe();

loadPlayers();
