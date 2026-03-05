# Deep Quality Audit — All 15 Games

**Audit Date:** June 2025
**Scope:** Every game in `games/` — code-level analysis of content counts, bugs, validation, replay, and missing features.

---

## EXECUTIVE SUMMARY

| Metric | Count |
|--------|-------|
| Total games audited | 15 |
| Games with critical bugs | 4 (relay-race, bible-bingo, Bible-taboo, bible-word-search) |
| Games with < 20 content items | 7 |
| Games using Firebase multiplayer | 3 (bible-bingo, Bible-taboo, Who-said-it) |
| Games with no answer validation | 2 (bible-bingo, Bible-taboo) |
| Games with proper Fisher-Yates shuffle | 12 |
| Games with biased shuffle | 2 (bible-bingo, prophecy-match) |
| Average content items per quiz game | ~30 (industry standard: 100+) |

---

## GAME-BY-GAME AUDIT

---

### 1. ARK BUILDER (`games/ark-builder/index.html` — 500 lines)

**Type:** Arcade stacking / dropping game
**Content Count:** 18 unique items — 12 ANIMALS + 6 SUPPLIES

| Animals (12) | Supplies (6) |
|---|---|
| 🐘🦒🦁🐻🐑🕊️🐕🐈🐄🐴🦅🐫 | 🌾🪵⚒️🧱🏺🪣 |

**Difficulty Progression:**
- Flood speed increases linearly: `floodSpeed = 0.08 + loaded * 0.003` (line ~170)
- Drop speed constant at 3px/frame
- No discrete difficulty levels — smooth ramp

**Answer Validation:** N/A — action-based (click to drop items onto ark)

**End-Game Flow:**
- Ends when `floodLevel >= deckY` (flood reaches deck)
- Shows overlay: score, items loaded, pairs matched
- Tiered messages: 15+ = "Noah would be proud!", 10+ = "Great job!", <10 = "Keep trying!"
- "Play Again" button calls `startGame()`

**Replay Value:** ★★★☆☆
- Items spawn randomly from pool
- Flood speed creates natural difficulty curve
- But gameplay loop is repetitive — same mechanics every time

**Bugs Found:**
1. **Shared global state** (~line 150): `fallY`, `fallItem`, `fallSpeed` are globals. If `spawnItem()` is called while a previous item is still falling (theoretically possible if frame timing is off), state would be overwritten. Low risk but sloppy architecture.
2. **No pause/resume** — navigating away doesn't pause the game loop.

**Missing vs. Professional Games:**
- No power-ups or special items
- No progressive levels (e.g., "Day 1: Animals, Day 2: Supplies")
- No high score persistence (localStorage)
- No sound effects
- Single gameplay mode

---

### 2. BIBLE BINGO (`games/bible-bingo/BibleBingoScriptureSprint/` — script.js + index.html)

**Type:** 5×5 Bingo grid — click tiles to mark them
**Content Count:** 52 entries in `prompts` array, but contains **significant duplicate entries**:

| Duplicated Prompt | Occurrences |
|---|---|
| "Proverbs 3:5" | 3× |
| "Matthew 28:19" | 3× |
| "Ephesians 6:11" | 2× |
| "Genesis 9:13" | 2× |
| "Psalm 119:11" | 2× |
| "John 4:24" | 2× |
| "Daniel 6:22" | 2× |

**Effective unique prompts: ~35–38** (after deduplication). Board uses 25 per game.

**Difficulty Progression:** None. Single mode, no difficulty selection.

**Answer Validation:** ❌ **NONE** — clicking a tile toggles `completed` CSS class. Pure honor system. No verification that the player actually knows the verse.

**End-Game Flow:**
- `checkBoardComplete()` fires when all 25 cells have `.completed` class
- Shows end screen with score, saves to Firebase Firestore
- "Play Again" reloads the page

**Replay Value:** ★★☆☆☆
- With only ~35 unique prompts for 25 slots, boards will heavily overlap between sessions
- Biased shuffle: uses `array.sort(() => Math.random() - 0.5)` — NOT Fisher-Yates

**Bugs Found:**
1. **CRITICAL — Biased shuffle** (script.js ~line 12): `shuffle()` uses `sort(() => Math.random() - 0.5)`. This produces statistically non-uniform distributions. Some board configurations are significantly more likely than others.
2. **Firebase scope leak** (script.js ~line 147): `saveScores()` references `db` which is defined in the HTML `<script>` tag, not in script.js. Works due to global scope but is fragile — any bundler or strict mode would break it.
3. **No FIREBASE_READY check**: `saveScores()` called without checking if Firebase initialized. If Firebase CDN is slow/blocked, `db.collection()` throws.
4. **New userId on every page load**: `userId = 'user_' + Math.random().toString(36).substr(2,9)` — scores are never associated with a returning player. Leaderboard is effectively meaningless.

**Missing vs. Professional Games:**
- No caller/host mode (real Bingo has a caller who reads prompts)
- No win patterns (standard Bingo supports line, diagonal, full house, four corners)
- No multiplayer sync (Firebase is used but only for leaderboard, not live game state)
- No sound effects or animations
- No timer or competitive pressure

---

### 3. BIBLE CONNECTIONS (`games/bible-connections/index.html` — 883 lines)

**Type:** NYT Connections clone — group 16 words into 4 categories
**Content Count:** **4 static puzzles**, each with 4 groups × 4 words = 16 words per puzzle. **Total: 64 unique words.**

**Puzzle Themes:**
- Puzzle 1-4: Bible-themed word groupings (e.g., "Books of the Bible", "Tribes of Israel", "Fruits of the Spirit", etc.)

**Difficulty Progression:**
- Groups are color-coded Yellow → Green → Blue → Purple (easy → hard) within each puzzle
- Puzzles selected randomly from the 4 available
- No overall difficulty escalation

**Answer Validation:** ✅ Proper — selected 4 words are sorted and joined, compared against group's sorted word list. Checks for "one away" (3 of 4 correct) and gives hint.

**End-Game Flow:**
- Win: All 4 groups found → tiered messages based on remaining lives (👑 Perfect, 🌟 Excellent, 💪 Well Done, 😅 Just Made It)
- Lose: 0 lives → reveals all remaining groups → "Game Over"
- "Play Again" button calls `init()` which picks a new random puzzle

**Replay Value:** ★★☆☆☆
- Only **4 puzzles** — player will see repeats within 4-5 sessions
- NYT Connections publishes a new puzzle daily; this has 4 total
- Once solved, puzzles are memorized — zero challenge on replay

**Bugs Found:**
1. **Duplicate guess check works** — `guessHistory` tracks previous attempts (good).
2. **No bug per se**, but `shuffleArray` modifies `tiles` in place — correct behavior.
3. **Puzzle index is random** (`Math.floor(Math.random() * PUZZLES.length)`) — no tracking of which puzzles have been played. Player can get the same puzzle twice in a row.

**Missing vs. Professional Games:**
- 4 puzzles vs. NYT's 500+ (and growing daily)
- No daily puzzle mechanic
- No sharing results (e.g., colored grid like Wordle/Connections)
- No difficulty selector
- No timer

---

### 4. BIBLE MEMORY MATCH (`games/bible-memory-match/index.html` — ~500 lines)

**Type:** Card flip matching pairs
**Content Count:** **20 pairs** in `PAIR_POOL`

| Examples | Side A → Side B |
|---|---|
| Genesis → Creation | Noah → The Flood |
| Abraham → Father of Faith | Moses → The Exodus |
| David → Shepherd King | Solomon → Wisdom |
| (20 total pairs) | |

**Difficulty Progression:**
- Easy: 4 pairs (8 cards) — `grid-4x4` class
- Medium: 8 pairs (16 cards)
- Hard: 10 pairs (20 cards)

**Answer Validation:** ✅ Correct — matches by `pairId` AND different side (a vs b). Prevents matching a card with itself.

**End-Game Flow:**
- Timer counts up (elapsed time)
- Efficiency-based messages on completion
- Shows moves, pairs found, time
- "Play Again" resets game

**Replay Value:** ★★★☆☆
- Random pair selection from pool of 20
- Proper Fisher-Yates shuffle
- Easy mode only uses 4 of 20 (good variety)
- Hard mode uses 10 of 20 (50%, less variety)

**Bugs Found:**
1. **Grid layout mismatch** (~line 300): Easy mode assigns `grid-4x4` CSS class but only has 8 cards. A 4×4 grid with 8 cards leaves 8 empty slots. Should use `grid-4x2` or `grid-2x4`.
2. **No max-move tracking** — moves counter has no effect on scoring or feedback.

**Missing vs. Professional Games:**
- 20 pairs is adequate for a memory game but could use 30-40
- No card flip animation (just class toggle)
- No localStorage high scores
- No sound effects
- No "hint" or "peek" power-up

---

### 5. BIBLE SEQUENCE (`games/bible-sequence/index.html` — 539 lines)

**Type:** Simon Says / pattern memory game
**Content Count:** 12 symbols in `ALL_SYMBOLS` catalog. Player selects 4, 6, or 9 per game.

**Difficulty Progression:** ✅ Excellent
- Pattern length increases each round (+1 symbol to remember)
- Display speed increases: `Math.max(350, 700 - round * 20)` ms per symbol
- Natural infinite difficulty curve

**Answer Validation:** ✅ Correct — sequence compared element-by-element as player clicks.

**End-Game Flow:**
- Fail: Shows rounds cleared + personal best
- Best score persisted to `localStorage` (one of the few games that does this!)
- "Play Again" restarts

**Replay Value:** ★★★★☆
- Procedurally generated sequences — effectively infinite content
- Different symbol subsets each game
- Proper Fisher-Yates shuffle
- localStorage persistence adds "beat your record" motivation

**Bugs Found:**
- None significant. This is one of the cleanest implementations.

**Missing vs. Professional Games:**
- Could add different sequence types (reverse, skip-one)
- No sound associations for symbols
- No visual themes beyond the default
- Could track statistics (average rounds survived, etc.)

---

### 6. BIBLE TABOO (`games/Bible-taboo/index.html` — 742 lines)

**Type:** Forbidden-word party game (Firebase Realtime Database multiplayer)
**Content Count:** **10 cards only**. Each card has 1 topic + 5 forbidden words.

| Topic | Forbidden Words |
|---|---|
| Noah's Ark | flood, animals, rain, boat, rainbow |
| David and Goliath | giant, stone, sling, shepherd, battle |
| (8 more...) | |

**Difficulty Progression:** None. All 10 cards every game. `totalQuestions = 10`.

**Answer Validation:** ❌ **Manual/honor system** — host clicks "Got It!" button. No actual word detection.

**End-Game Flow:**
- After 10 cards: shows final score, leaderboard from Firebase
- Score formula: `score += 10 + streak * 2`

**Replay Value:** ★☆☆☆☆ — **Worst in entire collection**
- Only 10 cards total, ALL used every game
- `gameDeck = [...cards]` is the full 10-card array
- Players will memorize all cards within 2 sessions
- Real Taboo has 500+ cards; this has 10.

**Bugs Found:**
1. **CRITICAL — All players see answers** (~line 600-650): When a card is displayed, the topic AND all 5 forbidden words are shown to ALL connected players. In real Taboo, only the clue-giver sees the card. This breaks the fundamental game mechanic.
2. **Firebase double init** (~line 20 + ~line 500): `firebase.initializeApp(firebaseConfig)` appears to be called in the HTML scope and potentially conflicts with other Firebase instances.
3. **Timer doesn't stop on page visibility change** — if the user switches tabs, the 60-second timer keeps running.
4. **No input validation on room code** — joining with empty/invalid code silently fails.

**Missing vs. Professional Games:**
- 10 cards vs. 500+ in physical Taboo game
- No role separation (clue-giver vs. guessers)
- No team management
- No pass/skip mechanic
- No buzzer for using forbidden words
- No sound effects

---

### 7. BIBLE TIMELINE (`games/bible-timeline/index.html` — 731 lines)

**Type:** Chronological ordering via drag-and-drop
**Content Count:** **42 events** — 22 OT + 20 NT

| OT Events (22) | NT Events (20) |
|---|---|
| Creation, The Fall, Noah's Flood, Tower of Babel, Abraham's Call, Binding of Isaac, Jacob's Ladder, Joseph in Egypt, The Exodus, Red Sea Crossing, Ten Commandments at Sinai, Wilderness Wandering, Fall of Jericho, Gideon's Fleece, Samson & Delilah, Ruth & Boaz, David & Goliath, Solomon's Temple, Elijah on Mt Carmel, Daniel in Lions' Den, Jonah & the Whale, The Exile to Babylon | Annunciation, Birth of Jesus, Visit of the Magi, Flight to Egypt, Baptism of Jesus, Temptation in Wilderness, Calling of Disciples, Sermon on the Mount, Feeding 5000, Walking on Water, Transfiguration, Raising of Lazarus, Triumphal Entry, Last Supper, Garden of Gethsemane, Crucifixion, Resurrection, Great Commission, Ascension, Day of Pentecost |

**Modes:** Old Testament, New Testament, Mixed
**Structure:** 5 rounds × 5 events per round = 25 events per game

**Difficulty Progression:**
- Each round draws 5 new random events
- Within a round, events must be ordered chronologically
- Mixed mode is inherently harder (wider date range)

**Answer Validation:** ✅ Correct — compares `dataset.correctOrder` (positional within the round's sorted list) against user's drag order.

**End-Game Flow:**
- Shows score, correct count, perfect rounds, accuracy percentage
- Grade emoji based on accuracy (90%+ = 🏆, 70%+ = ⭐, etc.)
- Confetti on 80%+ accuracy
- "Play Again" restarts

**Replay Value:** ★★★☆☆
- 42 events for 25 per session = decent variety
- Proper Fisher-Yates shuffle
- But events will repeat frequently in Mixed mode
- No localStorage persistence

**Bugs Found:**
1. **Events can repeat across rounds** — events are drawn from the full pool each round without removing previously used events. In a 5-round game of 5 events each, some events will appear multiple times.
2. **Touch drag not perfectly smooth on some mobile devices** — `touchmove` handler updates position but doesn't prevent default scrolling in all cases.

**Missing vs. Professional Games:**
- 42 events is decent; 100+ would be better
- No hint system
- No "learn more" links for events
- No scrolling timeline visualization
- No date/era labels on events

---

### 8. BIBLE WORD SEARCH (`games/bible-word-search/index.html` — ~480 lines)

**Type:** Classic word search grid puzzle
**Content Count:** **~59 words across 6 themes**

| Theme | Words | Count |
|---|---|---|
| Gospels | Matthew, Mark, Luke, John, Sermon, Parable, Miracle, Baptism, Resurrection, Ascension | 10 |
| Apostles | Peter, Paul, James, John, Andrew, Philip, Thomas, Barnabas, Timothy, Silas | 10 |
| Fruits of the Spirit | Love, Joy, Peace, Patience, Kindness, Goodness, Faith, Gentleness, Control | 9 |
| Creation | Light, Water, Earth, Stars, Animals, Garden, Adam, Eve, Sabbath, Heaven | 10 |
| Armor of God | Truth, Righteousness, Peace, Faith, Salvation, Spirit, Sword, Shield, Helmet, Belt | 10 |
| Women of the Bible | Sarah, Ruth, Esther, Mary, Martha, Deborah, Hannah, Rahab, Naomi, Miriam | 10 |

**Grid:** 12×12 or 13×13 depending on longest word length
**Timer:** 3 minutes (180 seconds)
**Directions:** All 8 (horizontal, vertical, diagonal, + reverse of each)

**Difficulty Progression:** None — single difficulty. Timer is the only pressure.

**Answer Validation:** ✅ Correct — letter-by-letter comparison against placed word coordinates.

**End-Game Flow:**
- Timer runs out or all words found
- Score: base points per word + time bonus
- Shows words found / total
- "Play Again" regenerates grid

**Replay Value:** ★★★☆☆
- Grid randomly regenerated each game
- 6 themes provide some variety
- But word lists are static — same 9-10 words per theme

**Bugs Found:**
1. **CRITICAL — Silent word placement failure** (~line 280-300): `placeWord()` attempts up to 200 random positions. If it fails (all attempts exhausted), the word is **silently skipped** — it's NOT placed in the grid. But the word **still appears in the word list** that the player must find. **The player literally cannot find a word that doesn't exist in the grid.** There is no fallback or error handling.
2. **No grid size validation** — if multiple long words are in the same theme, the grid may be too small to fit them all, increasing silent placement failures.

**Missing vs. Professional Games:**
- 6 themes vs. 20+ in professional word searches
- No difficulty levels (could adjust grid size, timer, number of words)
- No hint system (e.g., reveal first letter)
- No word definitions/verse references shown on find
- Words have no educational context

---

### 9. FRUIT CATCHER (`games/fruit-catcher/index.html` — ~500 lines)

**Type:** Arcade falling-object catching game
**Content Count:** 9 FRUITS (each with associated verse), 5 BAD items, 1 BONUS type

| Fruits (9) | Bad Items (5) |
|---|---|
| 🍎 Love, 😊 Joy, ☮️ Peace, ⏳ Patience, 💗 Kindness, ⭐ Goodness, 🤝 Faithfulness, 🌸 Gentleness, 🧘 Self-Control | 💀🔥👿🌑⚡ |

**Difficulty Progression:** ✅ Good dynamic difficulty
- Fall speed: `1.5 + score/500` (increases with score)
- Spawn interval decreases over time
- Bad items become more frequent

**Answer Validation:** N/A — action-based catching

**End-Game Flow:**
- 3 lives, lose one per dropped fruit (not bad items)
- End screen shows score + "verses learned" list
- Tiered messages

**Replay Value:** ★★★☆☆
- Procedural gameplay, different each time
- Score-chase motivation
- Limited variety — same 9 fruits every game

**Bugs Found:**
1. **Canvas emoji rendering** (~line 350): Uses `ctx.fillText(emoji)` to draw emojis on HTML5 Canvas. Emoji rendering on canvas is **inconsistent across browsers and operating systems** — some systems render them as black-and-white squares, others as full color. This is a known cross-browser issue.
2. **No pause functionality** — requestAnimationFrame loop runs continuously.

**Missing vs. Professional Games:**
- No power-ups (magnet, slow-mo, shield)
- No progressive levels with themes
- No high score board
- No basket/character customization
- Could add verse pop-ups when catching fruits

---

### 10. PROPHECY MATCH (`games/prophecy-match/index.html` — 1000 lines)

**Type:** OT prophecy → NT fulfillment matching game
**Content Count:** **10 prophecy pairs** in `ALL_PAIRS`

| # | OT Prophecy | NT Fulfillment |
|---|---|---|
| 1 | Born of a virgin (Isaiah 7:14) | Virgin Mary conceives (Matthew 1:22-23) |
| 2 | Born in Bethlehem (Micah 5:2) | Jesus born in Bethlehem (Matthew 2:1-6) |
| 3 | Preceded by messenger (Isaiah 40:3) | John the Baptist (Matthew 3:1-3) |
| 4 | Enter Jerusalem on donkey (Zechariah 9:9) | Palm Sunday (Matthew 21:1-9) |
| 5 | Betrayed for 30 silver (Zechariah 11:12-13) | Judas's betrayal (Matthew 26:14-15) |
| 6 | Silent before accusers (Isaiah 53:7) | Jesus silent before Pilate (Matthew 27:12-14) |
| 7 | Hands and feet pierced (Psalm 22:16) | Crucifixion (John 20:25-27) |
| 8 | Lots cast for garments (Psalm 22:18) | Soldiers gamble for robe (John 19:23-24) |
| 9 | Not a bone broken (Psalm 34:20) | Jesus found dead, no bones broken (John 19:32-36) |
| 10 | Rise from the dead (Psalm 16:10) | Resurrection (Acts 2:31-32) |

**Difficulty Levels:**
- Beginner: 4 pairs
- Scholar: 6 pairs
- Master: 8 pairs (max 8 of 10)

**Answer Validation:** ✅ Correct — `propPair === fulPair` object reference comparison. Works because pairs are objects from the same array.

**End-Game Flow:**
- Timer counts up
- End screen: time, correct/total, best streak
- "Prophecy Pairs Review" section shows all matched pairs with context
- Tiered messages: 0 wrong = 👑, ≤2 wrong = 🌟, else = 📖

**Replay Value:** ★★☆☆☆
- Only 10 pairs. Master mode shows 8 of 10 — near-repeat every game.
- Context explanations are excellent educational content, but once read, not replayed.
- Biased shuffle: `[...ALL_PAIRS].sort(() => Math.random() - 0.5)` — same issue as bible-bingo.

**Bugs Found:**
1. **Biased shuffle** (~line 650): Uses `.sort(() => Math.random() - 0.5)` instead of Fisher-Yates. Results in non-uniform pair selection.
2. **Score can go negative on wrong guesses** (~line 700): `score = Math.max(0, score - 30)` — this is actually handled correctly with `Math.max(0, ...)`. Not a bug.
3. **Context popup timing** — shows for 4 seconds regardless of text length. Longer contexts may not be fully readable in time.

**Missing vs. Professional Games:**
- 10 pairs is critically low — should be 30-50 minimum
- No "learn more" deep links to full prophecy studies
- No progressive difficulty within a session
- Could show prophecy context before matching starts

---

### 11. RELAY RACE (`games/relay-race/index.html` — ~400 lines)

**Type:** Team trivia quiz (Red vs Blue teams)
**Content Count:** **10 questions only**. All 10 used every game.

**Difficulty Progression:** None. Same 10 questions, same order every game.

**Answer Validation:** ❌ **CRITICAL BUG — Exact string matching**

```javascript
userAnswer === correctAnswer  // after .toLowerCase()
```

Examples of impossible validation:
| Question | Expected Answer | What a human might type | Result |
|---|---|---|---|
| "Name one of the Ten Commandments" | "thou shalt not steal" | "do not steal" | ❌ WRONG |
| "What miracle did Jesus perform at a wedding?" | "water into wine" | "turned water to wine" | ❌ WRONG |
| "What did God create on the first day?" | "light" | "Light" | ✅ (lowercase works) |

**End-Game Flow:**
- After 10 questions, inserts new `<div>` at page bottom
- Shows team scores
- No proper end screen

**Replay Value:** ★☆☆☆☆ — **Worst quiz game**
- Same 10 questions every single game
- Same order
- No randomization

**Bugs Found (MULTIPLE CRITICAL):**
1. **CRITICAL — Exact match validation** (~line 180): `userAnswer === correctAnswer` rejects valid answers. "Thou shalt not steal" is the ONLY accepted commandment for a question asking to name ANY commandment.
2. **CRITICAL — `questionsAnswered` not reset** (~line 120): The variable tracking how many questions have been answered is NOT reset in `startGame()`. Playing a second time immediately triggers `endGame()` because `questionsAnswered` is still 10 from the previous game.
3. **CRITICAL — Duplicate end screens** (~line 200): `endGame()` appends a new div to the body each time. Playing multiple rounds creates stacking end-game divs that never get cleaned up.
4. **No input sanitization** — leading/trailing whitespace in the text input will cause incorrect rejections.
5. **Hint system halves score** — but no indication to player of the penalty magnitude.

**Missing vs. Professional Games:**
- 10 questions vs. 50-100+ in any quiz game
- Text input validation is fundamentally broken — should use multiple-choice
- No score persistence
- No actual team management (just alternating input)
- No categories or themes
- No timer countdown visualization (timer exists but no progress bar)

---

### 12. SCRIPTURE SPRINT (`games/scripture-sprint/index.html` — 622 lines)

**Type:** Verse text → reference matching (multiple choice)
**Content Count:** **40 verses** in `VERSES` array

**Difficulty Levels:**
| Level | Timer | Questions |
|---|---|---|
| Easy | 30s per Q | 10 questions |
| Medium | 20s per Q | 15 questions |
| Hard | 12s per Q | 20 questions |

Hard mode uses 20 of 40 verses per session = 50% of pool.

**Answer Validation:** ✅ Correct — 4-option multiple choice. 1 correct + 3 random distractors from the full verse pool.

**End-Game Flow:**
- Score with combo multiplier: `(100 + timeBonus) × min(combo, 5)`
- Progress dots show correct/wrong per question
- Missed verses shown with full text for review
- Grade: 90%+ = 🏆, 70%+ = ⭐, 50%+ = 📖, else = 💪
- "Play Again" button restarts

**Replay Value:** ★★★☆☆
- 40 verses shuffled — decent variety on Easy (10/40)
- Hard mode sees 50% overlap between sessions
- Combo system adds engagement
- Proper Fisher-Yates shuffle ✅

**Bugs Found:**
1. **Distractor collision possible** (~line 430): Distractors are drawn from `VERSES.filter(v => v.ref !== q.ref)` then shuffled and sliced. Extremely unlikely but theoretically a distractor could have the same reference text if there were duplicates in the pool (there aren't currently).
2. **Correct answer highlighting has fragile matching** (~line 460): `b.textContent.substring(1) === q.ref` — attempts to skip the letter prefix ("A", "B", etc.) by taking `substring(1)`. But `textContent` includes the full button text including the letter AND a space. For example, if button text is "AJohn 3:16", `substring(1)` gives "John 3:16" — this works because the letter has no space separator in the innerHTML. If the HTML structure changes, this breaks.

**Missing vs. Professional Games:**
- 40 verses is modest — 100+ would allow true variety
- No verse category filtering (e.g., "Psalms only", "NT only")
- No leaderboard
- No "study mode" to review verses before playing
- Could show verse context after answering

---

### 13. VERSE HUNT (`games/verse-hunt-live/index.html` — 951 lines)

**Type:** Bible knowledge trivia (multiple choice)
**Content Count:** **60 questions total** — 20 per difficulty level

| Difficulty | Questions | Timer |
|---|---|---|
| Easy | 20 unique questions | 32s per Q |
| Medium | 20 unique questions | 20s per Q |
| Hard | 20 unique questions | 12s per Q |

**Per session:** 10 questions drawn from selected difficulty pool.

**Difficulty Progression:**
- Level increases every 3 correct answers (`level++`)
- Points scale with level: `(10 × level) + (streak + 1) × 2`
- Timer is fixed per difficulty (no adaptive timer)

**Answer Validation:** ✅ Correct — multiple choice with 4 options, direct string comparison.

**End-Game Flow:**
- Creates a popup div appended to `document.body`
- Shows final score, max streak, level reached, accuracy
- "Play Again" calls `location.reload()` (full page reload)
- Has background music + sound effects (correct/wrong/beep)

**Replay Value:** ★★★☆☆
- 20 questions per difficulty, 10 per session = 50% overlap
- Different difficulties have entirely different question sets (good!)
- Fisher-Yates shuffle ✅
- But only 2 unique sessions before repetition starts

**Bugs Found:**
1. **Accuracy calculation is wrong** (~line 870): `Math.round((score / (current * 10)) * 100)` — this divides the total score by `current * 10`, but score includes level multipliers and streak bonuses. A player getting all 10 correct will show >100% accuracy. This is not "accuracy" — it's a score ratio.
2. **Popup stacking** (~line 860): `endGame()` creates a new popup div with `document.body.appendChild(popup)`. If the game somehow triggers endGame twice, or if `location.reload()` fails, popups stack. Less critical since reload is used, but architecturally messy.
3. **Audio autoplay** (~line 700): `bgMusic.play().catch(() => {})` — browsers block autoplay. Music silently fails to play on first visit until user interaction occurs. The mute button exists but doesn't trigger the initial play.
4. **External audio CDN dependency** — uses `cdn.pixabay.com` and `assets.mixkit.co` for sound files. If these CDNs go down, the game silently has no audio. No local fallbacks.

**Missing vs. Professional Games:**
- 20 questions per difficulty is low — 50+ per level would be better
- No question categories within a difficulty
- No review screen for wrong answers (unlike scripture-sprint which has this)
- No localStorage high scores
- Duplicate questions across difficulties (e.g., "Proverbs 9:10" appears in both Medium and Hard)

---

### 14. WALLS OF JERICHO (`games/walls-of-jericho/index.html` — 776 lines)

**Type:** Rhythm action game — tap trumpet button in time with scrolling notes
**Content Count:** N/A — procedurally generated rhythm patterns. No quiz content.

**Difficulty Progression:** ✅ Excellent
- 7 laps, each progressively harder
- March speed: `0.6 + currentLap * 0.15` (increases per lap)
- Note speed: `1.5 + currentLap * 0.3`
- Notes per lap: `6 + currentLap` (lap 1 = 7 notes, lap 6 = 12 notes)
- Lap 7: Unique "Shout Phase" — button mashing to fill power bar with auto-decay

**Answer Validation:** N/A — timing-based. "Perfect" (within 25px) vs "Good" (within 50px) vs "Miss".

**End-Game Flow:**
- Victory: Wall collapses (CSS animation), rubble particles, +500 score bonus
- Near-miss: "Almost There!" (wall HP ≤ 30)
- Failure: "The Walls Stand..."
- Score, Perfects, Best Combo displayed
- "March Again" button restarts

**Replay Value:** ★★★★☆
- Procedural rhythm patterns — different every time
- Skill-based — there's always room to improve
- Wall damage system provides tangible progress
- Combo multiplier rewards consistency

**Bugs Found:**
1. **Shout phase timeout race condition** (~line 620): The 8-second timeout fires in `startShoutPhase()` and checks `shoutPower < 100`. But the `checkTimer` interval (100ms) also checks `shoutPower >= 100` and calls `wallsCollapse()`. If `shoutPower` hits 100 between the last `checkTimer` tick and the timeout firing, both could execute. The `gameActive = false` in `wallsCollapse()` mitigates this, but it's a race condition.
2. **No mobile touch prevention on shout button** — `ontouchstart` calls `handleShout()` with `event.preventDefault()`, but rapid tapping may still trigger browser gestures on some devices.

**Missing vs. Professional Games:**
- No music/audio (a rhythm game without actual music is unusual)
- No difficulty selection (always 7 laps)
- No different note patterns per lap (just speed changes)
- No visual note variety (all 🎵)
- Could add actual trumpet sound on each tap

---

### 15. WHO SAID IT? (`games/Who-said-it/who-said/index.html` — 1034 lines)

**Type:** Bible quote attribution quiz (Firebase Realtime Database multiplayer)
**Content Count:** **50 questions** in `quizData` array
**Per session:** 10 questions (shuffled and sliced)

**Difficulty Progression:** None. All questions are equal difficulty. No difficulty selector.

**Answer Validation:** ✅ Correct — multiple choice with 4 options. Direct string comparison.

**End-Game Flow:**
- After 10 questions: `endScreen` displays "Game Over! Final score: X / 10"
- Shows "Exit" button to return to games page
- Confetti every 3-correct streak
- No detailed review of wrong answers

**Replay Value:** ★★★☆☆
- 50 questions, 10 per game = 5 unique sessions before repetition
- Firebase multiplayer adds social replay value
- Fisher-Yates shuffle ✅

**Bugs Found:**
1. **Timer runs on client, not server** (~line 750-770): `questionStartTime` is stored in Firebase, but each client independently calculates elapsed time from `Date.now()`. Clock differences between devices mean players see different remaining times. A player with a slower clock gets more time.
2. **No timer interval cleanup** — `timerInterval` from the `updateQuestionUI` function isn't started/stopped properly. The timer display updates are driven by Firebase `on('value')` callbacks, not by a client-side interval. Timer countdown relies on re-renders triggered by any Firebase data change, which may not happen every second. **The timer display is effectively broken** — it only updates when Firebase pushes a new value.
3. **No end-game cleanup in Firebase** — game sessions are never deleted from Firebase. Over time, the `games/` node accumulates orphan sessions indefinitely.
4. **Host advantage** — only the host can advance questions (`nextQuestion`). If the host disconnects, the game is permanently stuck.
5. **Answer options not always shuffled** — options come directly from `quizData[i].options` array. The array is static, so the correct answer's position is always the same relative position in the options. While questions are shuffled, within each question the option order is fixed.
6. **No reconnection handling** — if a player refreshes, they get a new `userId` and appear as a new player. Their score is lost.

**Missing vs. Professional Games:**
- 50 questions is decent but 100+ would be better
- No difficulty levels
- No categories (OT vs NT, Jesus vs. prophets, etc.)
- No player name customization (shows "HostPlayer" / "GuestPlayer")
- No lobby/waiting room UI
- No spectator mode
- No rematch functionality

---

## CROSS-GAME COMPARISON TABLE

| Game | Content Items | Per Session | Difficulty Levels | Validation | Shuffle | localStorage | Firebase |
|---|---|---|---|---|---|---|---|
| ark-builder | 18 items | All 18 | Dynamic (flood speed) | N/A (action) | N/A | ❌ | ❌ |
| bible-bingo | ~38 unique | 25 | None | ❌ Honor system | ❌ Biased | ❌ | ✅ (Firestore) |
| bible-connections | 64 words (4 puzzles) | 16 (1 puzzle) | None | ✅ Word match | ✅ F-Y | ❌ | ❌ |
| bible-memory-match | 20 pairs | 4–10 | 3 levels | ✅ Pair ID | ✅ F-Y | ❌ | ❌ |
| bible-sequence | 12 symbols | 4–9 | 3 (symbol count) | ✅ Sequence | ✅ F-Y | ✅ Best score | ❌ |
| Bible-taboo | 10 cards | All 10 | None | ❌ Manual | N/A | ❌ | ✅ (RTDB) |
| bible-timeline | 42 events | 25 | 3 modes | ✅ Order check | ✅ F-Y | ❌ | ❌ |
| bible-word-search | 59 words | 9–10 | None | ✅ Grid match | N/A (random grid) | ❌ | ❌ |
| fruit-catcher | 15 items | All 15 | Dynamic (speed) | N/A (action) | N/A | ❌ | ❌ |
| prophecy-match | 10 pairs | 4–8 | 3 levels | ✅ Object ref | ❌ Biased | ❌ | ❌ |
| relay-race | 10 questions | All 10 | None | ❌ Exact match | ❌ No shuffle | ❌ | ❌ |
| scripture-sprint | 40 verses | 10–20 | 3 levels | ✅ MCQ | ✅ F-Y | ❌ | ❌ |
| verse-hunt-live | 60 questions | 10 | 3 levels | ✅ MCQ | ✅ F-Y | ❌ | ❌ |
| walls-of-jericho | N/A (procedural) | 7 laps | Dynamic | N/A (timing) | N/A | ❌ | ❌ |
| Who-said-it | 50 questions | 10 | None | ✅ MCQ | ✅ F-Y | ❌ | ✅ (RTDB) |

---

## INDUSTRY STANDARD COMPARISON

| Category | Your Games (Average) | Industry Standard | Gap |
|---|---|---|---|
| Quiz questions per game | ~30 | 100–200+ | **3–7× below standard** |
| Puzzles per game (connections-type) | 4 | 50+ (daily additions) | **12× below standard** |
| Party game cards (taboo-type) | 10 | 400–500+ | **40–50× below standard** |
| Word search themes | 6 | 20–30+ | **3–5× below standard** |
| Memory match pairs | 20 | 30–50 | **1.5–2.5× below standard** |
| Matching pairs (prophecy-type) | 10 | 30–50 | **3–5× below standard** |

---

## TOP PRIORITY FIXES (Ranked by Impact)

### P0 — Critical (Game-Breaking)

1. **relay-race: Exact string matching** — Makes the game nearly unplayable. Convert to multiple-choice or implement fuzzy matching with `includes()` + alternate accepted answers.
2. **relay-race: `questionsAnswered` not reset** — Second playthrough immediately ends. Add `questionsAnswered = 0` in `startGame()`.
3. **bible-word-search: Silent word placement failure** — Words appear in the find-list but may not exist in the grid. Add fallback: retry with different position/direction, or remove unfound words from the list.
4. **Bible-taboo: All players see answers** — Defeats the core mechanic. The forbidden words must only be visible to the clue-giver.

### P1 — High (Significant Quality Issues)

5. **bible-bingo: Fix biased shuffle** — Replace `sort(() => Math.random() - 0.5)` with Fisher-Yates in script.js.
6. **bible-bingo: Remove duplicate prompts** — Deduplicate the 52-prompt array to ~38 unique entries.
7. **prophecy-match: Fix biased shuffle** — Same `.sort()` issue.
8. **relay-race: Fix duplicate end screens** — Clear previous end-screen divs before creating new ones, or use a fixed container.
9. **verse-hunt-live: Fix accuracy calculation** — Track correct/total separately instead of deriving from score.
10. **Who-said-it: Shuffle answer options** — Options within each question are in static order.

### P2 — Medium (Content & Replay)

11. **Bible-taboo: Add 40+ more cards** (currently 10 — critically low)
12. **relay-race: Add 40+ more questions** (currently 10)
13. **bible-connections: Add 10+ more puzzles** (currently 4)
14. **prophecy-match: Add 15+ more pairs** (currently 10)
15. **All games: Add localStorage high scores** (only bible-sequence does this)

### P3 — Low (Polish & Features)

16. Add sound effects across all games (only verse-hunt-live has audio)
17. Add accessibility attributes (ARIA labels, keyboard navigation)
18. Add share results feature (Wordle-style emoji grids)
19. Add "study mode" / pre-game learning for quiz games
20. Clean up Firebase orphan sessions in Who-said-it and Bible-taboo

---

## CONTENT MULTIPLIER NEEDED

To match the minimum viable content level for each game type:

| Game | Current | Minimum Target | Items to Add |
|---|---|---|---|
| Bible-taboo | 10 cards | 50 cards | +40 cards |
| relay-race | 10 questions | 50 questions | +40 questions |
| bible-connections | 4 puzzles | 20 puzzles | +16 puzzles |
| prophecy-match | 10 pairs | 25 pairs | +15 pairs |
| bible-bingo | 38 unique | 75 unique | +37 prompts |
| scripture-sprint | 40 verses | 80 verses | +40 verses |
| verse-hunt-live | 60 questions | 100 questions | +40 questions |
| bible-memory-match | 20 pairs | 35 pairs | +15 pairs |
| Who-said-it | 50 questions | 100 questions | +50 questions |
| bible-timeline | 42 events | 70 events | +28 events |
| bible-word-search | 59 words / 6 themes | 120 words / 12 themes | +61 words / +6 themes |
