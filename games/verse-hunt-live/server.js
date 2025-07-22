// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

const questions = [
  {
    verse: "I can do all things through Christ who strengthens me.",
    reference: "Philippians 4:13",
    options: ["Philippians 4:13", "Romans 8:28", "Joshua 1:9", "John 3:16"]
  },
  {
    verse: "For God so loved the world...",
    reference: "John 3:16",
    options: ["Psalm 23:1", "John 3:16", "1 Corinthians 13:4", "Matthew 5:14"]
  },
  {
    verse: "The Lord is my shepherd; I shall not want.",
    reference: "Psalm 23:1",
    options: ["Psalm 23:1", "Psalm 121:1", "Psalm 100:4", "Psalm 34:8"]
  }
];

let currentQuestionIndex = 0;
let questionTime = 30; // seconds per question
let interval;
let players = {}; // { socketId: {name, score} }

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex >= questions.length) {
    currentQuestionIndex = 0;
  }
  io.emit("newQuestion", {
    question: questions[currentQuestionIndex].verse,
    options: questions[currentQuestionIndex].options,
    time: questionTime,
    index: currentQuestionIndex
  });
  io.emit("scoresUpdate", players);

  let timeLeft = questionTime;
  clearInterval(interval);
  interval = setInterval(() => {
    timeLeft--;
    io.emit("timer", timeLeft);
    if (timeLeft <= 0) {
      clearInterval(interval);
      io.emit("timeUp");
      // Move to next question after 5 seconds pause
      setTimeout(nextQuestion, 5000);
    }
  }, 1000);
}

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);
  players[socket.id] = { name: `Player-${socket.id.slice(0,4)}`, score: 0 };

  // Send current question immediately to new player
  socket.emit("newQuestion", {
    question: questions[currentQuestionIndex].verse,
    options: questions[currentQuestionIndex].options,
    time: questionTime,
    index: currentQuestionIndex
  });
  socket.emit("scoresUpdate", players);

  // When player sends answer
  socket.on("answer", (data) => {
    const player = players[socket.id];
    if (!player) return;
    const currentQ = questions[currentQuestionIndex];
    if (data.index !== currentQuestionIndex) {
      // Answer for old question, ignore
      return;
    }
    // Check if answer is correct
    if (data.answer === currentQ.reference) {
      // Add points if not already answered correctly
      if (!player.answered) {
        player.score += 10;
        player.answered = true; // prevent multiple scoring
        io.emit("scoresUpdate", players);
        socket.emit("correctAnswer");
      } else {
        socket.emit("alreadyAnswered");
      }
    } else {
      socket.emit("wrongAnswer");
    }
  });

  socket.on("setName", (name) => {
    if (typeof name === "string" && name.trim() !== "") {
      players[socket.id].name = name.trim().substring(0, 20);
      io.emit("scoresUpdate", players);
    }
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
    delete players[socket.id];
    io.emit("scoresUpdate", players);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  nextQuestion();
});
