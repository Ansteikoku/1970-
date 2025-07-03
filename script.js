
const SUPABASE_URL = "https://ghgnpbunnjzuopcxocqa.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZ25wYnVubmp6dW9wY3hvY3FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MzA2MjIsImV4cCI6MjA2NzAwNjYyMn0.dgaTQXunx3__argTQar8qMpX6dQlqC7LZGlcdloz8NY";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function logout() {
  localStorage.removeItem("wakakusa_logged_in");
  localStorage.removeItem("is_admin");
  location.href = "login.html";
}

async function loadBoards() {
  const { data, error } = await supabase.from("boards").select("*").order("id");
  if (error) {
    console.error("Error fetching boards:", error.message);
    return;
  }
  const boardList = document.getElementById("boardList");
  boardList.innerHTML = data.map(b => 
    `<a href="index.html?board_id=${b.id}">[${b.name}]</a>`
  ).join(" ");
}

async function createBoard() {
  const name = document.getElementById("boardName").value.trim();
  if (!name) return alert("板名を入力してください");

  const { error } = await supabase.from("boards").insert([{ name }]);
  if (error) {
    alert("板の作成に失敗しました: " + error.message);
    return;
  }

  alert("板を作成しました");
  document.getElementById("boardName").value = "";
  loadBoards();
}

window.onload = () => {
  loadBoards();
  if (localStorage.getItem("is_admin") === "true") {
    document.getElementById("createBoardForm").style.display = "block";
  }
};
