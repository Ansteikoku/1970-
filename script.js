const SUPABASE_URL = "https://ghgnpbunnjzuopcxocqa.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function logout() {
  localStorage.removeItem("wakakusa_logged_in");
  location.href = "login.html";
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date)) return "";
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

async function createThread() {
  const name = document.getElementById("name").value || "名無しさん";
  const content = document.getElementById("content").value.trim();
  if (!content) return alert("本文を入力してください");
  const boardId = localStorage.getItem("selected_board_id");
  const { error } = await supabase.from("threads").insert([{ name, content, board_id: boardId }]);
  if (error) return alert("エラー: " + error.message);
  location.reload();
}

async function loadThreads() {
  const boardId = localStorage.getItem("selected_board_id");
  const { data, error } = await supabase.from("threads").select("*").eq("board_id", boardId).order("created_at", { ascending: false });
  const container = document.getElementById("threadList");
  if (error) return container.textContent = "スレッド取得エラー";
  container.innerHTML = data.map((t, i) => `<div>${i + 1}. ${t.content.slice(0, 30)} <small>${formatDate(t.created_at)}</small></div>`).join("");
}

async function loadBoards() {
  const { data, error } = await supabase.from("boards").select("*").order("created_at", { ascending: true });
  const menu = document.getElementById("boardMenu");
  if (error) return menu.textContent = "板の読み込み失敗";
  menu.innerHTML = data.map(b => `<button onclick="selectBoard('${b.id}')">${b.name}</button>`).join(" ");
}

function selectBoard(id) {
  localStorage.setItem("selected_board_id", id);
  loadThreads();
}

window.addEventListener("DOMContentLoaded", () => {
  loadBoards();
  loadThreads();
});