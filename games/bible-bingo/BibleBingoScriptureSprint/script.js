let lineScore = 0;
let highScore = 0;
let teamAScore = 0;
let teamBScore = 0;
let currentTeam = "Team A";
let board = [];
const boardSize = 5;

// Prompts
// Added 50 more questions to prompts array
const prompts = [
  { text: "🧱 Story of Jericho", verse: "Joshua 6:20" },
  { text: "🌟 Beatitude verse", verse: "Matthew 5:3" },
  { text: "🕊️ Verse on peace", verse: "John 14:27" },
  { text: "💪 Verse on strength", verse: "Philippians 4:13" },
  { text: "🌍 Great Commission", verse: "Matthew 28:19" },
  { text: "⏳ Parable of talents", verse: "Matthew 25:14" },
  { text: "👑 King David’s story", verse: "1 Samuel 16:13" },
  { text: "🕯️ Light of the world", verse: "Matthew 5:14" },
  { text: "🍞 Jesus feeds 5000", verse: "John 6:11" },
  { text: "💖 Love your neighbor", verse: "Mark 12:31" },
  { text: "🌿 Jesus’ parable", verse: "Luke 8:4" },
  { text: "⛪ Church unity verse", verse: "Ephesians 4:3" },
  { text: "🕊️ Holy Spirit gift", verse: "Acts 2:38" },
  { text: "🛡️ Armor of God", verse: "Ephesians 6:11" },
  { text: "🌈 Noah’s rainbow", verse: "Genesis 9:13" },
  { text: "💧 Baptism verse", verse: "Matthew 28:19" },
  { text: "📖 Scripture memory", verse: "Psalm 119:11" },
  { text: "🙏 Prayer verse", verse: "1 Thessalonians 5:17" },
  { text: "👩 Woman in the Bible", verse: "Esther 4:14" },
  { text: "🕊️ Verse on hope", verse: "Romans 15:13" },
  { text: "🌟 Beatitude verse", verse: "Matthew 5:8" },
  { text: "💡 Wisdom verse", verse: "Proverbs 3:5" },
  { text: "🛐 Worship verse", verse: "John 4:24" },
  { text: "👣 Jesus’ footsteps", verse: "1 Peter 2:21" },
  { text: "💬 Proverbs quote", verse: "Proverbs 3:6" },
  { text: "🦁 Daniel’s lion story", verse: "Daniel 6:22" },
  { text: "🌊 Miracle by Jesus", verse: "Matthew 14:25" },
  { text: "🛐 Verse on worship", verse: "John 4:24" },
  { text: "😇 Fruit of the Spirit", verse: "Galatians 5:22" },
  { text: "✝️ Name a disciple", verse: "Matthew 10:2" },
  { text: "💬 Proverbs quote", verse: "Proverbs 3:5" },
  { text: "🦁 Story from Daniel", verse: "Daniel 6:22" },
  { text: "📖 Memory verse", verse: "Psalm 119:11" },
  { text: "🌈 Covenant story", verse: "Genesis 9:13" },
  { text: "🕊️ Verse with peace", verse: "Philippians 4:7" },
  { text: "🎵 Psalm about joy", verse: "Psalm 100:1" },
  { text: "📜 OT Prophet", verse: "Isaiah 6:8" },
  { text: "👑 Bible king", verse: "1 Samuel 16:13" },
  { text: "🔥 Story with fire", verse: "Exodus 3:2" },
  { text: "💡 Verse on wisdom", verse: "James 1:5" },
  { text: "🚶 Parable of Jesus", verse: "Luke 15:20" },
  { text: "🛡️ Armor of God", verse: "Ephesians 6:11" },
  { text: "🌿 NT miracle", verse: "John 2:9" },
  { text: "📍 Verse with “trust”", verse: "Proverbs 3:5" },
  { text: "⚓ Hope verse", verse: "Hebrews 11:1" },
  { text: "👼 Angel story", verse: "Luke 1:26" },
  { text: "🧍 Commandment ref", verse: "Exodus 20:1" },
  { text: "💓 God’s love", verse: "John 3:16" },
  { text: "🌟 Beatitude verse", verse: "Matthew 5:9" },
  { text: "🕊️ Verse on faith", verse: "Hebrews 11:6" },
  { text: "💪 Verse on strength", verse: "Isaiah 40:31" },
  { text: "🌍 Great Commission", verse: "Matthew 28:19" }
];

// Shuffle helper
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Initialize board
function createBoard() {
  const grid = document.getElementById("bingoBoard");
  grid.innerHTML = "";
  board = [];

  const shuffledPrompts = shuffle(prompts).slice(0, 25);

  shuffledPrompts.forEach((item, index) => {
    const cell = document.createElement("div");
    cell.className = "bingo-cell";
    cell.textContent = item.text;
    cell.dataset.index = index;
    cell.dataset.verse = item.verse;
    cell.addEventListener("click", () => {
      cell.classList.toggle("completed");
      showVersePopup(item.verse);
      checkWin();
      saveScores();
    });
    board.push(cell);
    grid.appendChild(cell);
  });
}

// Verse popup animation
function showVersePopup(verse) {
  const popup = document.getElementById("versePopup");
  popup.textContent = `📖 ${verse}`;
  popup.classList.remove("hidden");
  popup.classList.add("show");
  setTimeout(() => {
    popup.classList.remove("show");
    popup.classList.add("hidden");
  }, 3000);
}

// Check for bingo lines
function checkWin() {
  const lines = [];

  // Rows and columns
  for (let r = 0; r < boardSize; r++) {
    lines.push([...Array(boardSize)].map((_, i) => r * boardSize + i));
  }
  for (let c = 0; c < boardSize; c++) {
    lines.push([...Array(boardSize)].map((_, i) => i * boardSize + c));
  }

  // Diagonals
  lines.push([0, 6, 12, 18, 24]);
  lines.push([4, 8, 12, 16, 20]);

  let newLines = 0;

  lines.forEach(line => {
    const allCompleted = line.every(i => board[i].classList.contains("completed"));
    const alreadyScored = line.every(i => board[i].classList.contains("winning"));
    if (allCompleted && !alreadyScored) {
      line.forEach(i => board[i].classList.add("winning"));
      newLines++;
    }
  });

  if (newLines > 0) {
    lineScore += newLines;
    if (currentTeam === "Team A") teamAScore += newLines;
    else teamBScore += newLines;
    if (lineScore > highScore) highScore = lineScore;

    updateScoresUI();
    saveScores();

    document.getElementById("bingoFeedback").textContent =
      `🏆 You completed ${newLines} new line${newLines > 1 ? "s" : ""}!`;
    showEncouragement(lineScore);
  }
}

// Update all UI scores
function updateScoresUI() {
  document.getElementById("lineScore").textContent = lineScore;
  document.getElementById("highScore").textContent = highScore;
  document.getElementById("teamAScore").textContent = teamAScore;
  document.getElementById("teamBScore").textContent = teamBScore;
}

// Reset board
function resetBingo() {
  lineScore = 0;
  teamAScore = 0;
  teamBScore = 0;
  highScore = 0;
  updateScoresUI();
  document.getElementById("bingoFeedback").textContent = "";
  document.getElementById("encouragementMessage").textContent = "🌱 Ready for a fresh start!";
  createBoard();
  saveScores();
}

// Encouragement messages
function showEncouragement(score) {
  const message = document.getElementById("encouragementMessage");
  if (score < 2) message.textContent = "🙌 Great start!";
  else if (score < 5) message.textContent = "🔥 You're warming up!";
  else if (score < 10) message.textContent = "💥 Bingo Pro in the making!";
  else message.textContent = "👑 Bingo Legend! Scripture master unlocked!";
}

// Fullscreen toggle
function toggleFullscreen() {
  const elem = document.documentElement;
  if (!document.fullscreenElement) {
    elem.requestFullscreen().catch(err => alert(`Error: ${err.message}`));
  } else {
    document.exitFullscreen();
  }
}

// Team switcher
function setTeam(team) {
  currentTeam = team;
  document.getElementById("teamA").classList.remove("active");
  document.getElementById("teamB").classList.remove("active");
  document.getElementById(team === "Team A" ? "teamA" : "teamB").classList.add("active");
}

// Firestore: Save scores
function saveScores() {
  db.collection("bibleBingoScores").doc(userId).set({
    lineScore,
    highScore,
    teamAScore,
    teamBScore
  }).catch(error => console.error("Error saving scores:", error));
}

// Firestore: Load scores
function loadScores() {
  db.collection("bibleBingoScores").doc(userId).get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      lineScore = data.lineScore || 0;
      highScore = data.highScore || 0;
      teamAScore = data.teamAScore || 0;
      teamBScore = data.teamBScore || 0;
    }
    updateScoresUI();
  }).catch(error => {
    console.error("Error loading scores:", error);
    updateScoresUI();
  });
}

function startGame() {
  document.getElementById("instructionsOverlay").style.display = "none";
  document.querySelector(".bingo-container").classList.remove("hidden");
  loadScores();
  createBoard();
}

// Add event listener for start button
document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  if (startBtn) {
    startBtn.addEventListener("click", startGame);
  }
});

// Init
window.addEventListener("DOMContentLoaded", () => {
  // Show instructions overlay on load
  document.getElementById("instructionsOverlay").style.display = "flex";
  document.querySelector(".bingo-container").classList.add("hidden");
});
