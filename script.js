const SUPABASE_URL = "https://your-project.supabase.co";
const SUPABASE_KEY = "your-anon-key";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function logout() {
  localStorage.removeItem("wakakusa_logged_in");
  location.href = "login.html";
}

async function createThread() {
  const name = document.getElementById("name").value || "名無しさん";
  const content = document.getElementById("content").value;
  if (!content) return alert("本文を入力してください");
  await supabase.from("threads").insert([{ name, content }]);
  location.reload();
}

async function loadThreads() {
  const { data, error } = await supabase.from("threads").select("*").order("created_at", { ascending: false });
  const list = document.getElementById("threadList");
  list.innerHTML = data.map((t, i) => `<div class="thread">${i+1}: ${t.content}</div>`).join("");
}
loadThreads();
