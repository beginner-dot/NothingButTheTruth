const verses = [
  { text: "“Let your light shine before others, so that they may see your good works and give glory to your Father who is in heaven.”", ref: "Matthew 5:16" },
  { text: "“Trust in the Lord with all your heart...”", ref: "Proverbs 3:5" },
  { text: "“I can do all things through Christ who strengthens me.”", ref: "Philippians 4:13" },
  // Add more as you want
];

const devotions = [
  "Reflect on how your actions today can glorify God.",
  "Lean on faith when making difficult decisions today.",
  "Remember Christ’s strength empowers you in every challenge.",
  // Add more as you want
];

const todos = [
  [
    "Pray over today's verse",
    "Reflect on how it applies to your life",
    "Read the chapter from which it comes",
    "Write a journal entry about it",
    "Share the verse with someone today"
  ],
  [
    "Spend time in prayer",
    "Meditate on the verse",
    "Discuss the verse with a friend",
    "Write down your thoughts",
    "Apply the verse in your daily life"
  ],
  [
    "Thank God for His blessings",
    "Memorize the verse",
    "Share a testimony",
    "Journal your prayers",
    "Encourage someone with the verse"
  ]
];

// Helper to get current day index in cycle
function getDailyIndex() {
  const startDate = new Date("2025-07-21"); // Your chosen start date
  const today = new Date();
  const diffDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  return diffDays % verses.length; // assumes verses.length == devotions.length
}

// Update verse and devotion on page
function updateVerseOfTheDay() {
  const index = getDailyIndex();
  const verseTextEl = document.getElementById("verseText");
  const verseRefEl = document.getElementById("verseRef");

  if (verseTextEl && verseRefEl) {
    verseTextEl.textContent = verses[index].text;
    verseRefEl.textContent = `- ${verses[index].ref}`;
  }
}

function updateDevotionOfTheDay() {
  const index = getDailyIndex();
  const devotionTextEl = document.getElementById("devotionText");
  if (devotionTextEl) {
    devotionTextEl.textContent = devotions[index];
  }
}

// Show devotion modal popup and generate todo list dynamically
function toggleDevotion() {
  const modal = document.getElementById('devotionModal');
  if (!modal) return;

  if (modal.style.display === 'block') {
    modal.style.display = 'none';
  } else {
    updateDevotionOfTheDay();

    const dayIndex = getDailyIndex();
    const todoList = document.getElementById("todoList");
    todoList.innerHTML = "";
    todos[dayIndex].forEach(todo => {
      const li = document.createElement("li");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      li.appendChild(checkbox);
      li.appendChild(document.createTextNode(" " + todo));
      todoList.appendChild(li);
    });

    modal.style.display = 'block';
  }
}

// Close devotion modal when clicking outside or on close button
document.addEventListener("DOMContentLoaded", () => {
  updateVerseOfTheDay();

  const modal = document.getElementById('devotionModal');
  const closeBtn = document.getElementById('closeDevotion');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Calculate milliseconds until next midnight
  const now = new Date();
  const nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 0, 0);
  const msUntilMidnight = nextMidnight - now;

  // Set timeout to update verse and devotion at midnight
  setTimeout(() => {
    updateVerseOfTheDay();
    updateDevotionOfTheDay();

    // Then set interval to update every 24 hours
    setInterval(() => {
      updateVerseOfTheDay();
      updateDevotionOfTheDay();
    }, 24 * 60 * 60 * 1000);
  }, msUntilMidnight);
});
