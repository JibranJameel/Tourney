// =====================================
// Auth Logic (Login + Register)
// =====================================

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginMessage = document.getElementById("loginMessage");
const registerMessage = document.getElementById("registerMessage");

// ------------------ LOGIN ------------------
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginMessage.textContent = "Processing...";

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      loginMessage.textContent = error.message;
      loginMessage.style.color = "red";
    } else {
      loginMessage.textContent = "Login successful!";
      loginMessage.style.color = "green";

      // redirect after login
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 500);
    }
  });
}

// ------------------ REGISTER ------------------
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    registerMessage.textContent = "Processing...";

    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: null, // disable email confirm
      },
    });

    if (error) {
      registerMessage.textContent = error.message;
      registerMessage.style.color = "red";
    } else {
      registerMessage.textContent =
        "Account created! Logging you in automatically...";
      registerMessage.style.color = "green";

      // AUTO LOGIN after sign-up:
      await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 500);
    }
  });
}
