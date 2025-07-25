    let lineScore = parseInt(localStorage.getItem("lineScore")) || 0;
    let highScore = parseInt(localStorage.getItem("highScore")) || 0;
    let teamAScore = parseInt(localStorage.getItem("teamAScore")) || 0;
    let teamBScore = parseInt(localStorage.getItem("teamBScore")) || 0;
    let currentTeam = 'Team A';

    document.getElementById("lineScore").textContent = lineScore;
    document.getElementById("highScore").textContent = highScore;
    document.getElementById("teamAScore").textContent = teamAScore;
    document.getElementById("teamBScore").textContent = teamBScore;

    const prompts = [
      { text: "📘 Pentateuch Book", verse: "Genesis 1:1" },
      { text: "🙏 Verse about prayer", verse: "1 Thessalonians 5:17" },
      { text: "👩 Woman in the Bible", verse: "Esther 4:14" },
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
      { text: "💓 God’s love", verse: "John 3:16" }
    ];

    const boardSize = 5;
    let board = [];

    function setTeam(team) {
      currentTeam = team;
    }

    function shuffle(array) {
      return array.sort(() => Math.random() - 0.5);
    }

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
        });
        board.push(cell);
        grid.appendChild(cell);
      });
    }

    function showVersePopup(verse) {
      const popup = document.getElementById("versePopup");
      popup.textContent = `📖 ${verse}`;
      popup.classList.remove("hidden");
      setTimeout(() => popup.classList.add("hidden"), 3500);
    }

    function checkWin() {
      const lines = [];
      for (let r = 0; r < boardSize; r++) lines.push([...Array(boardSize).keys()].map(i => r * boardSize + i));
      for (let c = 0; c < boardSize; c++) lines.push([...Array(boardSize).keys()].map(i => i * boardSize + c));
      lines.push([0, 6, 12, 18, 24]);
      lines.push([4, 8, 12, 16, 20]);

      let newLines = 0;
      for (const line of lines) {
        if (line.every(i => board[i].classList.contains("completed")) &&
            !line.every(i => board[i].classList.contains("winning"))) {
          line.forEach(i => board[i].classList.add("winning"));
          newLines++;
        }
      }

      if (newLines > 0) {
        lineScore += newLines;
        localStorage.setItem("lineScore", lineScore);
        document.getElementById("lineScore").textContent = lineScore;

        if (currentTeam === "Team A") {
          teamAScore += newLines;
          localStorage.setItem("teamAScore", teamAScore);
          document.getElementById("teamAScore").textContent = teamAScore;
        } else {
          teamBScore += newLines;
          localStorage.setItem("teamBScore", teamBScore);
          document.getElementById("teamBScore").textContent = teamBScore;
        }

        if (lineScore > highScore) {
          highScore = lineScore;
          localStorage.setItem("highScore", highScore);
          document.getElementById("highScore").textContent = highScore;
        }

        document.getElementById("bingoFeedback").textContent =
          `🏆 You completed ${newLines} new line${newLines > 1 ? "s" : ""}!`;
        showEncouragement(lineScore);
      }
    }

    function showEncouragement(score) {
      const message = document.getElementById("encouragementMessage");
      if (score < 2) message.textContent = "🙌 Great start!";
      else if (score < 5) message.textContent = "🔥 You're warming up!";
      else if (score < 10) message.textContent = "💥 Bingo Pro in the making!";
      else message.textContent = "👑 Bingo Legend! Scripture master unlocked!";
    }

    function resetBingo() {
      board.forEach(cell => cell.classList.remove("completed", "winning"));
      document.getElementById("bingoFeedback").textContent = "";
      lineScore = 0;
      localStorage.setItem("lineScore", lineScore);
      document.getElementById("lineScore").textContent = lineScore;
      document.getElementById("encouragementMessage").textContent = "🌱 Ready for a fresh start!";
    }

    function toggleFullscreen() {
      const elem = document.documentElement;
      if (!document.fullscreenElement) {
        elem.requestFullscreen().catch(err => alert(`Error attempting fullscreen: ${err.message}`));
      } else {
        document.exitFullscreen();
      }
    }

    window.addEventListener("DOMContentLoaded", createBoard);