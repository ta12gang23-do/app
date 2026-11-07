const { createClient } = supabase;
const client = createClient(window.SUPABASE_URL, window.SUPABASE_KEY);

async function checkSupabase() {
  const dot = document.getElementById("sb-dot");
  const status = document.getElementById("sb-status");
  const out = document.getElementById("out");

  dot.className = "dot";
  status.textContent = "checking…";
  out.textContent = "Checking Supabase…";

  try {
    // Real network call to the project's Auth API.
    const res = await fetch(`${window.SUPABASE_URL}/auth/v1/settings`, {
      headers: { apikey: window.SUPABASE_KEY },
    });
    if (!res.ok) throw new Error(`Supabase responded with HTTP ${res.status}`);

    // Also make sure the client initialised correctly.
    await client.auth.getSession();

    dot.className = "dot ok";
    status.textContent = "connected";
    out.textContent = `Supabase connected ✅\nURL: ${window.SUPABASE_URL}`;
  } catch (err) {
    dot.className = "dot bad";
    status.textContent = "failed";
    out.textContent = `Supabase connection failed ❌\n${err}`;
  }
}

document.getElementById("test").addEventListener("click", checkSupabase);
checkSupabase();
