
  (() => {
    const weeklyQuestions = [
      {
        question: "Who was swallowed by a great fish?",
        options: ["Jonah", "Peter", "Moses", "Elijah"],
        answer: "Jonah",
        detail: "Jonah was swallowed by a great fish as told in the Book of Jonah."
      },
      {
        question: "What did God create on the first day?",
        options: ["Light", "Earth", "Animals", "Humans"],
        answer: "Light",
        detail: "God created light on the first day as described in Genesis 1:3-5."
      },
      {
        question: "Which book is the last in the Bible?",
        options: ["Revelation", "Genesis", "Psalms", "Acts"],
        answer: "Revelation",
        detail: "Revelation is the last book in the Christian Bible."
      },
      {
        question: "Who led the Israelites out of Egypt?",
        options: ["Moses", "Abraham", "David", "Joshua"],
        answer: "Moses",
        detail: "Moses led the Israelites out of Egypt, as narrated in Exodus."
      },
      {
        question: "How many disciples did Jesus have?",
        options: ["12", "7", "10", "3"],
        answer: "12",
        detail: "Jesus had 12 disciples who followed Him."
      }
    ];

    // Helper to get week number for weekly question
    function getWeekNumber(d = new Date()) {
      const target = new Date(d.valueOf());
      const dayNum = (d.getDay() + 6) % 7;
      target.setDate(target.getDate() - dayNum + 3);
      const firstThursday = target.valueOf();
      target.setMonth(0, 1);
      if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
      }
      return 1 + Math.ceil((firstThursday - target) / 604800000);
    }
    const weekIndex = getWeekNumber() % weeklyQuestions.length;

    const questionText = document.getElementById('weekly-question-text');
    const optionsContainer = document.getElementById('weekly-options');
    const submitBtn = document.getElementById('submit-answer-btn');
    const exploreMoreBtn = document.getElementById('explore-more-btn');
    const scoreDisplay = document.getElementById('score-display');

    let selectedOption = null;
    let answered = false;

    function clearSelected() {
      const btns = optionsContainer.querySelectorAll('button');
      btns.forEach(btn => {
        btn.classList.remove('selected');
        btn.setAttribute('aria-pressed', 'false');
      });
    }

    function loadWeeklyQuestion() {
      const q = weeklyQuestions[weekIndex];
      questionText.textContent = q.question;
      optionsContainer.innerHTML = '';
      selectedOption = null;
      answered = false;
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-disabled', 'true');
      scoreDisplay.textContent = '';
      exploreMoreBtn.classList.remove('visible');
      exploreMoreBtn.setAttribute('aria-expanded', 'false');

      q.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.type = 'button';
        btn.textContent = option;
        btn.setAttribute('aria-pressed', 'false');
        btn.addEventListener('click', () => {
          if (answered) return;
          clearSelected();
          btn.classList.add('selected');
          btn.setAttribute('aria-pressed', 'true');
          selectedOption = option;
          submitBtn.disabled = false;
          submitBtn.removeAttribute('aria-disabled');
        });
        optionsContainer.appendChild(btn);
      });
    }

    submitBtn.addEventListener('click', () => {
      if (answered || !selectedOption) return;
      answered = true;

      const q = weeklyQuestions[weekIndex];
      const isCorrect = selectedOption === q.answer;

      const btns = optionsContainer.querySelectorAll('button');
      btns.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === q.answer) btn.classList.add('correct');
        if (btn.textContent === selectedOption && !isCorrect) btn.classList.add('incorrect');
      });

      scoreDisplay.textContent = isCorrect 
        ? '🎉 Correct! Well done!' 
        : `❌ Incorrect. The right answer is "${q.answer}".`;

      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-disabled', 'true');

      // Show Explore More button now
      exploreMoreBtn.classList.add('visible');
    });

    // ----------- EXPLORE MORE QUIZ WITH TIMER & AUTO NEXT -----------

    const gameQuestions = [
      {
        question: "Who baptized Jesus?",
        options: ["John the Baptist", "Peter", "Paul", "James"],
        answer: "John the Baptist"
      },
      {
        question: "What miracle did Jesus perform at the wedding in Cana?",
        options: ["Turned water into wine", "Healed a blind man", "Walked on water", "Fed 5000 people"],
        answer: "Turned water into wine"
      },
      {
        question: "Where was Jesus born?",
        options: ["Bethlehem", "Nazareth", "Jerusalem", "Capernaum"],
        answer: "Bethlehem"
      },
      {
        question: "Who denied Jesus three times?",
        options: ["Peter", "John", "Judas", "Thomas"],
        answer: "Peter"
      },
      {
        question: "How many days did Jesus fast in the wilderness?",
        options: ["40", "7", "3", "12"],
        answer: "40"
      }
    ];

    const gameQuizContainer = document.getElementById('game-quiz-container');
    const gameQuestionEl = document.getElementById('game-question');
    const gameOptionsContainer = document.getElementById('game-options');
    const gameFeedback = document.getElementById('game-feedback');
    const timerBar = document.getElementById('timer-bar');
    const progressText = document.getElementById('progress-text');

    let currentGameIndex = 0;
    let score = 0;
    const timerDuration = 15; // seconds
    let timerInterval = null;
    let timerStartTime = null;
    let answeredGameQuestion = false;

    // Shuffle function to randomize options
    function shuffleArray(array) {
      for (let i = array.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    function startTimer() {
      clearInterval(timerInterval);
      timerBar.style.width = '100%';
      timerStartTime = Date.now();

      timerInterval = setInterval(() => {
        const elapsed = (Date.now() - timerStartTime) / 1000;
        const remaining = Math.max(timerDuration - elapsed, 0);
        const widthPercent = (remaining / timerDuration) * 100;
        timerBar.style.width = widthPercent + '%';

        if (remaining <= 0) {
          clearInterval(timerInterval);
          if (!answeredGameQuestion) {
            showFeedback(null); // Time up, no answer selected
          }
        }
      }, 200);
    }

    function showFinalScore() {
      gameQuestionEl.textContent = `🏆 Quiz Complete! Your Score: ${score} / ${gameQuestions.length}`;
      gameOptionsContainer.innerHTML = '';
      gameFeedback.textContent = 'Thanks for playing! Click "Explore More Questions" to restart.';
      progressText.textContent = '';
      timerBar.style.width = '0%';
      exploreMoreBtn.textContent = 'Restart Quiz';
      currentGameIndex = 0;
      score = 0;
    }

    function loadGameQuestion() {
      answeredGameQuestion = false;
      gameFeedback.textContent = '';
      timerBar.style.width = '100%';

      if (currentGameIndex >= gameQuestions.length) {
        showFinalScore();
        return;
      }

      progressText.textContent = `Question ${currentGameIndex + 1} of ${gameQuestions.length}`;
      gameQuestionEl.textContent = gameQuestions[currentGameIndex].question;
      gameOptionsContainer.innerHTML = '';

      const optionsShuffled = shuffleArray([...gameQuestions[currentGameIndex].options]);

      optionsShuffled.forEach(option => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = option;
        btn.disabled = false;
        btn.className = '';
        btn.addEventListener('click', () => {
          if (answeredGameQuestion) return;
          showFeedback(option);
        });
        gameOptionsContainer.appendChild(btn);
      });

      startTimer();
    }

    function showFeedback(selectedOption) {
      answeredGameQuestion = true;
      clearInterval(timerInterval);

      const currentQ = gameQuestions[currentGameIndex];
      const buttons = gameOptionsContainer.querySelectorAll('button');

      buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === currentQ.answer) {
          btn.classList.add('correct');
        }
        if (selectedOption && btn.textContent === selectedOption && selectedOption !== currentQ.answer) {
          btn.classList.add('incorrect');
        }
      });

      if (selectedOption === currentQ.answer) {
        gameFeedback.textContent = "✅ Correct!";
        score++;
      } else if (selectedOption === null) {
        gameFeedback.textContent = `⏰ Time's up! The correct answer was "${currentQ.answer}".`;
      } else {
        gameFeedback.textContent = `❌ Incorrect! The correct answer is "${currentQ.answer}".`;
      }

      // Auto-move to next question after 3 seconds
      setTimeout(() => {
        currentGameIndex++;
        loadGameQuestion();
      }, 3000);
    }

    exploreMoreBtn.addEventListener('click', () => {
      const isVisible = gameQuizContainer.style.display === 'block';
      if (isVisible) {
        gameQuizContainer.style.display = 'none';
        exploreMoreBtn.setAttribute('aria-expanded', 'false');
        exploreMoreBtn.textContent = 'Explore More Questions';
      } else {
        gameQuizContainer.style.display = 'block';
        exploreMoreBtn.setAttribute('aria-expanded', 'true');
        if (!gameQuestionEl.textContent.trim() || gameQuestionEl.textContent.startsWith('🏆')) {
          loadGameQuestion();
          exploreMoreBtn.textContent = 'Hide Quiz';
        }
        gameQuizContainer.focus();
      }
    });

    // Load the weekly question on page load
    loadWeeklyQuestion();

  })();

