const tournamentList = document.getElementById("tournamentList");
const adminMessage = document.getElementById("adminMessage");

async function loadTournaments() {
  const { data, error } = await supabaseClient.from("tournaments").select("*");
  if (!error) {
    renderTournaments(data);
  }
}

function renderTournaments(tournaments) {
  tournamentList.innerHTML = "";
  tournaments.forEach(t => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <h3>${t.name}</h3>
      <p>Status: ${t.status}</p>
      <button onclick="editTournament('${t.id}')">Edit</button>
      <button onclick="deleteTournament('${t.id}')">Delete</button>
    `;
    tournamentList.appendChild(div);
  });
}

async function deleteTournament(id) {
  const { error } = await supabaseClient.from("tournaments").delete().eq("id", id);
  if (!error) {
    adminMessage.textContent = "Tournament deleted!";
    adminMessage.style.color = "green";
    loadTournaments();
  } else {
    adminMessage.textContent = error.message;
    adminMessage.style.color = "red";
  }
}

function editTournament(id) {
  window.location.href = `tournament-create.html?id=${id}`;
}

// Realtime subscription
supabaseClient
  .from("tournaments")
  .on("*", payload => {
    loadTournaments();
  })
  .subscribe();

loadTournaments();
