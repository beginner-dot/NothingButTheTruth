// script.js - dynamically loads Bible story cards from JSON

const container = document.getElementById('stories-container');

let storiesData = [];

async function loadAndRender(filter = '') {
    try {
        const response = await fetch('commandments.json');
        storiesData = await response.json();
        renderStories(filter);
    } catch (error) {
        console.error("Oops! Could not load the stories:", error);
        container.innerHTML = '<p class="error-message">Unable to load stories at this time. Please try again later.</p>';
    }
}

function renderStories(filter) {
    container.innerHTML = '';
    const normalized = filter.trim().toLowerCase();
    const list = storiesData.filter(s =>
        !normalized || s.title.toLowerCase().includes(normalized) ||
        (s.category && s.category.toLowerCase().includes(normalized))
    );

    list.forEach((story, index) => {
        // choose embed markup: mux-player if we have a playbackId, otherwise legacy iframe
        let videoEmbed;
        if (story.playbackId) {
            videoEmbed = `<mux-player
                                playback-id="${story.playbackId}"
                                style="border-radius:8px;--accent-color:${story.brandColor||'#ff0055'};"
                                metadata-video-title="${story.title}">
                                <div slot="play-button">${story.playEmoji||''}</div>
                                <div slot="pause-button">${story.pauseEmoji||''}</div>
                            </mux-player>`;
        } else if (story.videoUrl) {
            videoEmbed = `<iframe src="${story.videoUrl}" frameborder="0" allowfullscreen></iframe>`;
        } else {
            videoEmbed = '<div class="video-placeholder">(video coming soon)</div>';
        }

        // all homepage videos use uniform 16:9 aspect ratio for professional sizing
        const wrapperClass = 'video-wrapper';

        // structured data JSON-LD for search engines
        let jsonLd = '';
        if (story.playbackId) {
            const contentUrl = `https://stream.mux.com/${story.playbackId}.m3u8`;
            const embedUrl = `https://mux.com/embed/${story.playbackId}`;
            jsonLd = `
<script type="application/ld+json">
${JSON.stringify({
    "@context": "http://schema.org",
    "@type": "VideoObject",
    name: story.title,
    description: story.summary || '',
    thumbnailUrl: story.thumbnail || '',
    uploadDate: new Date().toISOString().split('T')[0],
    contentUrl,
    embedUrl
}, null, 2)}
</script>
`;
        }

        // build action buttons for quiz and study
        let actionButtons = '';
        if (story.quizId && story.quizId !== 'quiz11') {
            actionButtons = `
                <div class="action-buttons">
                    <button class="quiz-btn" onclick="openQuiz('${story.quizId}', '${story.title.replace(/'/g, "\\'")}')">🎯 Take the Quiz</button>
                    <button class="study-btn" onclick="openStudy('${story.id}', '${story.title.replace(/'/g, "\\'")}')">📖 Quick Lesson</button>
                </div>
            `;
        }

        const card = `
            <div class="video-card">
                <div class="${wrapperClass}">
                    ${videoEmbed}
                </div>
                ${jsonLd}
                <div class="card-body">
                    <span class="category-badge">${story.category}</span>
                    <h3>${story.title}</h3>
                    <p class="reference"><strong>Reference:</strong> ${story.reference || ''}</p>
                    ${actionButtons}
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', card);

        if (index === 2) {
            container.insertAdjacentHTML('beforeend',
                `
                <div class="full-series-wrap">
                    <a href="full-series.html" class="full-series-btn">View the Full Series</a>
                </div>
                `
            );
        }
    });
}

// helper: darken/lighten a color
function shadeColor(col, percent) {
    const num = parseInt(col.replace("#",""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, Math.min(255, (num >> 16) + amt));
    const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
    const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
    return "#" + (0x1000000 + R*0x10000 + G*0x100 + B).toString(16).slice(1);
}

// quiz modal system
function openQuiz(quizId, title) {
    const modal = document.createElement('div');
    modal.className = 'quiz-modal';
    modal.innerHTML = `
        <div class="quiz-overlay" onclick="closeQuiz(this)"></div>
        <div class="quiz-content">
            <button class="quiz-close" onclick="closeQuiz(this.parentElement.parentElement)">&times;</button>
            <div id="quiz-${quizId}"></div>
        </div>
    `;
    document.body.appendChild(modal);
    loadQuiz(quizId, document.getElementById(`quiz-${quizId}`));
}

function closeQuiz(modal) {
    if (modal) modal.remove();
}

// load quiz content based on ID
function loadQuiz(quizId, container) {
    const quizzes = {
        'q1': {
            title: 'The Ten Commandments Story',
            questions: [
                {q: 'On which mountain did God give the Ten Commandments to Moses?', options: ['Mount Sinai', 'Mount Carmel', 'Mount Zion'], correct: 0, verse: 'Exodus 19:20'},
                {q: 'How many commandments are there in total?', options: ['5', '10', '12'], correct: 1, verse: 'Exodus 20:1-17'},
                {q: 'What material were the tablets made of?', options: ['Wood', 'Stone', 'Clay'], correct: 1, verse: 'Exodus 24:12'}
            ]
        },
        'q2': {
            title: '1st Commandment Quiz',
            questions: [
                {q: 'What does the first commandment forbid?', options: ['Having other gods', 'Working on Sabbath', 'Taking God\'s name in vain'],correct: 0, verse: 'Exodus 20:3'},
                {q: 'What should be our first priority according to Matthew 6:33?', options: ['Money', 'God\'s kingdom', 'Family'], correct: 1, verse: 'Matthew 6:33'},
                {q: 'When we worship false gods, what do we lose?', options: ['Our home', 'Our relationship with God', 'Our possessions'], correct: 1, verse: '1 John 5:21'}
            ]
        },
        'q3': {
            title: '2nd Commandment Quiz',
            questions: [
                {q: 'What does the second commandment forbid?', options: ['Graven images', 'Talking', 'Eating'], correct: 0, verse: 'Exodus 20:4'},
                {q: 'Why did God forbid idols?', options: ['They cost money', 'To preserve true worship', 'They\'re ugly'], correct: 1, verse: 'Deuteronomy 5:8'},
                {q: 'What form of worship does God require?', options: ['In spirit and truth', 'Only in temples', 'Before idols'], correct: 0, verse: 'John 4:24'}
            ]
        },
        'q4': {
            title: '3rd Commandment Quiz',
            questions: [
                {q: 'The Sabbath is a sign of what between God and His people?', options: ['Wealth', 'A covenant', 'Friendship'], correct: 1, verse: 'Exodus 31:13'},
                {q: 'Which day should be kept holy?', options: ['Sunday', 'Friday', 'Saturday'], correct: 2, verse: 'Exodus 20:8-11'},
                {q: 'Rest on the Sabbath teaches us to trust in whom?', options: ['Ourselves', 'Money', 'God'], correct: 2, verse: 'Hebrews 4:9-10'}
            ]
        },
        'q5': {
            title: '4th Commandment Quiz',
            questions: [
                {q: 'Which commandment says to honor your parents?', options: ['Third', 'Fourth', 'Fifth'], correct: 1, verse: 'Exodus 20:12'},
                {q: 'What does honoring parents lead to?', options: ['Long life', 'Wealth', 'Fame'], correct: 0, verse: 'Ephesians 6:2-3'},
                {q: 'How should we treat those who raised us?', options: ['With disrespect', 'With honor and care', 'Ignore them'], correct: 1, verse: '1 Timothy 5:4'}
            ]
        },
        'q6': {
            title: '5th Commandment Quiz',
            questions: [
                {q: 'The 5th commandment says: \"Thou shalt not__________\"?', options: ['Steal', 'Murder', 'Lie'], correct: 1, verse: 'Exodus 20:13'},
                {q: 'Whose image do humans bear?', options: ['Animals', 'God', 'Angels'], correct: 1, verse: 'Genesis 1:27'},
                {q: 'Jesus said to love whom?', options: ['Enemies', 'Friends only', 'Rich people'], correct: 0, verse: 'Matthew 5:44'}
            ]
        },
        'q7': {
            title: '6th Commandment Quiz',
            questions: [
                {q: 'What does the 6th commandment forbid?', options: ['Adultery', 'Stealing', 'Lying'], correct: 0, verse: 'Exodus 20:14'},
                {q: 'Marriage is a _______ made before God?', options: ['Promise', 'Covenant', 'Contract'], correct: 1, verse: 'Malachi 2:14'},
                {q: 'Faithful love protects what?', options: ['Money', 'The family', 'The home'], correct: 1, verse: '1 Corinthians 13:8'}
            ]
        },
        'q8': {
            title: '7th Commandment Quiz',
            questions: [
                {q: 'What does the 7th commandment forbid?', options: ['Stealing', 'Murder', 'Lying'], correct: 0, verse: 'Exodus 20:15'},
                {q: 'Honest work is better than what?', options: ['Rest', 'Theft', 'Sleep'], correct: 1, verse: 'Proverbs 10:2'},
                {q: 'What should we do with what others own?', options: ['Respect it', 'Ignore it', 'Take it'], correct: 0, verse: 'Romans 13:9'}
            ]
        },
        'q9': {
            title: '8th Commandment Quiz',
            questions: [
                {q: 'Bearing false witness means__________?', options: ['Being quiet', 'Telling lies', 'Speaking truth'], correct: 1, verse: 'Exodus 20:16'},
                {q: 'What does lying separate us from?', options: ['Friends', 'God\'s truth', 'Happiness'], correct: 1, verse: 'John 8:32'},
                {q: 'A truthful tongue is a _______ of life?', options: ['Enemy', 'Tree', 'Stone'], correct: 1, verse: 'Proverbs 15:4'}
            ]
        },
        'q10': {
            title: '9th Commandment Quiz',
            questions: [
                {q: 'What does "covet" mean?', options: ['To bless', 'To desire wrongfully what others have', 'To ignore'], correct: 1, verse: 'Exodus 20:17'},
                {q: 'Contentment comes from knowing what?', options: ['We have everything', 'God provides', 'Money is good'], correct: 1, verse: 'Philippians 4:11-12'},
                {q: 'Envy leads to what?' , options: ['Joy', 'Sin', 'Peace'], correct: 1, verse: 'James 3:16'}
            ]
        }
    };

    const quiz = quizzes[quizId];
    if (!quiz) {
        container.innerHTML = '<p>Quiz not found.</p>';
        return;
    }

    let html = `<h2>${quiz.title}</h2><div class="quiz-questions">`;
    quiz.questions.forEach((q, i) => {
        html += `<div class="quiz-question" style="margin-bottom: 1.5rem;">
                    <p><strong>Q${i+1}: ${q.q}</strong></p>
                    <div class="quiz-options">`;
        q.options.forEach((opt, j) => {
            html += `<label style="display: block; margin: 0.5rem 0; cursor: pointer;">
                        <input type="radio" name="q${i}" value="${j}" style="margin-right: 0.5rem;">
                        ${opt}
                    </label>`;
        });
        html += `</div>
                </div>`;
    });
    html += `</div>
             <button onclick="submitQuiz('${quizId}');" style="width:100%;padding:0.8rem;background:linear-gradient(135deg,#2575fc,#6a11cb);color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:bold;margin-top:1rem;">Submit Quiz</button>`;
    container.innerHTML = html;
}

function submitQuiz(quizId) {
    alert('✨ Great effort! Your answers have been recorded. Keep exploring God\'s Word!');
    closeQuiz(document.querySelector('.quiz-modal'));
}

// study modal system
function openStudy(storyId, title) {
    const modal = document.createElement('div');
    modal.className = 'study-modal';
    modal.innerHTML = `
        <div class="study-overlay" onclick="closeStudy(this)"></div>
        <div class="study-content">
            <button class="study-close" onclick="closeStudy(this.parentElement.parentElement)">&times;</button>
            <div id="study-${storyId}"></div>
        </div>
    `;
    document.body.appendChild(modal);
    loadStudy(storyId, document.getElementById(`study-${storyId}`));
}

function closeStudy(modal) {
    if (modal) modal.remove();
}

function loadStudy(storyId, container) {
    const studies = {
        1: {
            title: 'Understanding God\'s Perfect Law',
            content: `
<style>
.study-text { font-size: 1.1rem; line-height: 1.8; color: #222; }
.study-verse { background: #f3f0fa; padding: 1rem; margin: 1rem 0; border-left: 4px solid #6a11cb; font-style: italic; border-radius: 6px; }
.study-heading { color: #2575fc; font-size: 1.3rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.8rem; }
</style>
<div class="study-text">
<p>🌟 Long ago, on a mountain that shook with the presence of God, something amazing happened. Moses climbed Mount Sinai, and God's finger wrote laws on stone tablets. These were not just rules to follow – they were a gift of love from our Creator.</p>

<div class="study-verse">"I am the Lord your God..." - Exodus 20:1-2</div>

<p>📖 <strong class="study-heading">Why God Gave the Commandments</strong></p>
<p>God did not give the Ten Commandments to be mean or to make us sad. Rather, He gave them because He loves us deeply. A parent makes rules to protect their child. In the same way, God's laws protect us from harm.</p>

<p>Think of it like this: 🚗 A speed limit on a dangerous road saves lives. God's commandments are like that – they show us the safe path of life. When we keep them, we live in harmony with God, with others, and with ourselves.</p>

<div class="study-verse">"The law of the Lord is perfect, converting the soul" - Psalm 19:7</div>

<p>💎 <strong class="study-heading">The Heart of the Law</strong></p>
<p>All ten commands can be summed up in one word: LOVE. The first four commandments teach us to love God with all our heart. The last six teach us to love our neighbor as ourselves.</p>

<p>When you truly love God, you will not want other gods before Him. When you love your neighbor, you won't steal, lie, or hurt them. The commandments are not chains – they are a celebration of freedom through love.</p>

<div class="study-verse">"Love the Lord your God with all your heart... Love your neighbor as yourself" - Matthew 22:37-39</div>

<p>✨ <strong class="study-heading">Living by God's Law Today</strong></p>
<p>Some people think the Ten Commandments are only for ancient people, but they are alive and true for us today. They show us how to live with peace, joy, and purpose. Every time we choose honesty over lies, kindness over cruelty, we are living out these beautiful laws.</p>

<p>The Ten Commandments are God's love letter to humanity – written in stone to show us the path to true freedom and lasting happiness. 🙏</p>
</div>
            `
        },
        2: {
            title: 'No Other Gods - Putting God First',
            content: `
<style>
.study-text { font-size: 1.1rem; line-height: 1.8; color: #222; }
.study-verse { background: #f3f0fa; padding: 1rem; margin: 1rem 0; border-left: 4px solid #6a11cb; font-style: italic; border-radius: 6px; }
.study-heading { color: #2575fc; font-size: 1.3rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.8rem; }
</style>
<div class="study-text">
<p>👑 "You shall have no other gods before Me." These are the first words God speaks from Mount Sinai. Not because God is mean or jealous in a bad way, but because He knows what will make us truly happy.</p>

<div class="study-verse">"I am the Lord your God" - Exodus 20:2</div>

<p>🎯 <strong class="study-heading">What Are Modern "Gods"?</strong></p>
<p>In ancient times, people bowed to carved idols made of stone and gold. Today, we may not have golden statues, but we still have things we worship in our hearts. For some it's money, for others it's fame or success. Some put their trust in video games, social media, or material things. These become our "gods" when we give them the place that only God should have.</p>

<p>📱 Money, possessions, and popularity are not evil by themselves, but when they become more important than God, they become idols – false gods that promise to make us happy but leave us empty.</p>

<div class="study-verse">"No one can serve two masters... You cannot serve both God and money" - Matthew 6:24</div>

<p>❤️ <strong class="study-heading">Why God Must Be First</strong></p>
<p>God asks us to put Him first – not to control us, but to protect us. He knows that anything else we put before Him will let us down. Money can be lost. Friends may disappoint us. Our bodies grow old. But God is eternal, faithful, and perfectly loving.</p>

<p>When God is first in our lives, everything else falls into place. Our relationships improve, our worries decrease, and we find real peace.</p>

<div class="study-verse">"Seek first the kingdom of God and His righteousness, and all these things shall be added to you" - Matthew 6:33</div>

<p>✨ <strong class="study-heading">How to Keep God First</strong></p>
<p>🙏 Pray when you wake up and before sleep. Talk to God like you would a loving friend.</p>
<p>📖 Read His Word regularly. The Bible teaches us who God is and what He values.</p>
<p>⏱️ Spend quiet time thinking about God. Put away your phone for a while.</p>
<p>🤝 Choose friends who also love God. They will help you stay focused on what matters most.</p>

<p>When we put God first, we experience His love, guidance, and protection. That's the blessing of this first commandment! 💝</p>
</div>
            `
        },
        3: {
            title: 'No Graven Images - Pure Worship',
            content: `
<style>
.study-text { font-size: 1.1rem; line-height: 1.8; color: #222; }
.study-verse { background: #f3f0fa; padding: 1rem; margin: 1rem 0; border-left: 4px solid #6a11cb; font-style: italic; border-radius: 6px; }
.study-heading { color: #2575fc; font-size: 1.3rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.8rem; }
</style>
<div class="study-text">
<p>🎨 "You shall not make idols." Long ago, people carved images from wood and stone, then bowed down and worshipped them as if they were gods. God commanded His people not to do this. But why? What's so wrong with a nice statue or picture?</p>

<div class="study-verse">"Do not make idols of any kind" - Exodus 20:4</div>

<p>🔍 <strong class="study-heading">A Picture Cannot Capture God</strong></p>
<p>No carved image, no painting, no sculpture can truly show who God is. God is Spirit – infinite, eternal, and beyond all understanding. Any image we create would actually make God smaller, not bigger. It would be like trying to put the ocean in a cup!</p>

<p>When people bow before an idol and say \"this is god,\" they are limiting God to something finite and created. True worship requires us to bow before the invisible, eternal Creator who cannot be captured in matter.</p>

<div class="study-verse">"God is spirit, and those who worship Him must worship in spirit and truth" - John 4:24</div>

<p>💭 <strong class="study-heading">The Danger of Worship Gone Wrong</strong></p>
<p>When we worship idols – whether ancient statues or modern substitutes – we forget that we are worshipping a reflection, not the reality. It's like watching a shadow on a wall instead of seeing the person casting it. No matter how beautiful the shadow is, it cannot give us what a real relationship with the person can give.</p>

<p>The second commandment protects us from this spiritual mistake. It keeps our worship pure and directed toward the only one worthy of worship – the living God.</p>

<div class="study-verse">"God said, 'You shall not bow down to them or serve them'" - Exodus 20:5</div>

<p>✨ <strong class="study-heading">Real Worship for Today</strong></p>
<p>🎵 Worship in music and songs that praise God's greatness.</p>
<p>🙏 Worship through honest prayer from the heart.</p>
<p>📖 Worship by studying God's Word and obeying what we learn.</p>
<p>💝 Worship through kindness to others, since we are made in God's image.</p>

<p>True worship happens not in front of an idol, but between a person's heart and God's Spirit. That's where real connection happens! 🌟</p>
</div>
            `
        },
        4: {
            title: 'The Sabbath - God\'s Gift of Rest',
            content: `
<style>
.study-text { font-size: 1.1rem; line-height: 1.8; color: #222; }
.study-verse { background: #f3f0fa; padding: 1rem; margin: 1rem 0; border-left: 4px solid #6a11cb; font-style: italic; border-radius: 6px; }
.study-heading { color: #2575fc; font-size: 1.3rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.8rem; }
</style>
<div class="study-text">
<p>😴 "Remember the Sabbath day, to keep it holy." Six days you work, but on the seventh day, God invites you to rest. This is not a punishment – it's a gift!</p>

<div class="study-verse">"In six days the Lord made the heavens and the earth... and He rested on the seventh day" - Exodus 20:8-11</div>

<p>🌍 <strong class="study-heading">God Needed Rest Too</strong></p>
<p>Some people wonder: Did God really need a day off? Of course not! God never gets tired. But God set an example for us. By resting on the seventh day, God showed us that rest is important, valuable, and holy.</p>

<p>If God – who is all-powerful – chose to rest and declare it holy, how much more do we, weak humans, need rest? Rest is not laziness – it's wisdom.</p>

<div class="study-verse">"The Sabbath was made for man, not man for the Sabbath" - Mark 2:27</div>

<p>🎯 <strong class="study-heading">What the Sabbath Teaches Us</strong></p>
<p>📱 In our busy world, we're constantly doing: working, studying, texting, scrolling. We rarely stop. The Sabbath teaches us that our worth is not based on what we do or produce. We are valuable simply because we are God's children.</p>

<p>🙏 The Sabbath teaches us to trust God. By stopping all our work one day a week, we show that we trust God to provide, to protect, and to care for us without our constant effort.</p>

<p>💝 The Sabbath teaches us to remember God. In the midst of our busy lives, we pause and remember the One who created us and loves us.</p>

<div class="study-verse">"Come to Me, all you who are weary... and I will give you rest" - Matthew 11:28</div>

<p>✨ <strong class="study-heading">How to Honor the Sabbath</strong></p>
<p>📚 Spend time reading God's Word and learning more about Him.</p>
<p>⛪ Gather with others who worship God in your church or faith community.</p>
<p>🤝 Spend quality time with family without screens and distractions.</p>
<p>🌲 Enjoy God's creation – take a walk in nature, breathe fresh air, appreciate His work.</p>
<p>🙏 Pray and reflect on the week, giving God thanks for His blessings.</p>

<p>The Sabbath is God's invitation to us: slow down, rest, remember, and reconnect. It's a blessing offered every week! 🌟</p>
</div>
            `
        },
        5: {
            title: 'Honor Father and Mother - Foundation of Family',
            content: `
<style>
.study-text { font-size: 1.1rem; line-height: 1.8; color: #222; }
.study-verse { background: #f3f0fa; padding: 1rem; margin: 1rem 0; border-left: 4px solid #6a11cb; font-style: italic; border-radius: 6px; }
.study-heading { color: #2575fc; font-size: 1.3rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.8rem; }
</style>
<div class="study-text">
<p>👨‍👩‍👧 "Honor your father and mother." This is the first commandment about our relationships with people. It's also the first commandment that has a promise attached to it – long life!</p>

<div class="study-verse">"Honor your father and mother, that your days may be long in the land which the Lord your God is giving you" - Exodus 20:12</div>

<p>❤️ <strong class="study-heading">Why Parents?</strong></p>
<p>Our parents give us life. They feed us when we cannot feed ourselves. They protect us when we are weak. They teach us about the world. Even if our parents aren't perfect – and no parent is – they have made great sacrifices for us.</p>

<p>Honoring parents teaches us respect, gratitude, and humility. It teaches us that we should honor those who care for us and those who came before us.</p>

<div class="study-verse">"The fear of the Lord is the beginning of knowledge, but fools despise wisdom and discipline" - Proverbs 1:7</div>

<p>🏠 <strong class="study-heading">The Family – God's Design</strong></p>
<p>God created the family as the basic unit of society. A strong family is built on love, respect, and honor. When children honor and obey parents, and when parents love and care for children, the family becomes a place of safety, growth, and happiness.</p>

<p>When we reject or dishonor our parents, we reject the foundation that God has built for our good. We also hurt the people who love us most.</p>

<div class="study-verse">"Out of the mouth of babes and nursing infants You have ordained strength" - Psalm 8:2</div>

<p>✨ <strong class="study-heading">How to Honor Your Parents</strong></p>
<p>👂 Listen to them when they speak. Really hear them.</p>
<p>🙏 Respect their wisdom and experience. They have lived longer and learned more.</p>
<p>😊 Speak kindly to them, even when you disagree.</p>
<p>🤝 Help them with chores and responsibilities without complaining.</p>
<p>📱 Appreciate the sacrifices they make for you – sometimes silently, every day.</p>

<p>🌟 <strong class="study-heading">When Parents Are Imperfect</strong></p>
<p>Some people had parents who hurt them or didn't care for them well. This commandment doesn't mean accepting abuse or staying in dangerous situations. It means treating them with dignity and respect, while protecting yourself. We can honor our parents while also seeking help from others who truly care about us.</p>

<p>God's love is perfect where parents' love falls short. He is our heavenly Father who never fails or abandons us. 💝</p>
</div>
            `
        },
        6: {
            title: 'The Sanctity of Life - Do Not Murder',
            content: `
<style>
.study-text { font-size: 1.1rem; line-height: 1.8; color: #222; }
.study-verse { background: #f3f0fa; padding: 1rem; margin: 1rem 0; border-left: 4px solid #6a11cb; font-style: italic; border-radius: 6px; }
.study-heading { color: #2575fc; font-size: 1.3rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.8rem; }
</style>
<div class="study-text">
<p>💚 "You shall not murder." This commandment protects the most precious gift God has given us – life itself. Every human being, from birth until old age, bears the image of God and deserves protection and respect.</p>

<div class="study-verse">"So God created mankind in His own image, in the image of God He created them, male and female" - Genesis 1:27</div>

<p>🌟 <strong class="study-heading">Life Is Sacred</strong></p>
<p>Life is not ours to take. We did not create life, and we do not own it. Life comes from God, and only God has the right to give and take it away. This makes human life incredibly precious and worth protecting.</p>

<p>This is why murder is so serious – it destroys something that belongs to God. It ends the possibilities and potential of another person. It causes terrible pain to families and communities.</p>

<div class="study-verse">"The Lord said to Cain, 'Where is your brother Abel?' ... 'Now you are cursed from the earth'" - Genesis 4:9-11</div>

<p>❤️ <strong class="study-heading">More Than Just Physical Murder</strong></p>
<p>The commandment \"Do not murder\" goes deeper than just physical killing. Jesus expanded this commandment to include anger, hatred, and cruelty in our hearts.</p>

<p>📌 Killing someone with angry words is still destroying their spirit. Bullying someone until they hurt themselves is violence. Hating someone in your heart is breaking this commandment.</p>

<div class="study-verse">"Whoever hates his brother is a murderer" - 1 John 3:15</div>

<p>🕊️ <strong class="study-heading">Protecting Life in All Ways</strong></p>
<p>We protect life when we:</p>
<p>🤝 Treat others with kindness and respect.</p>
<p>💬 Use our words to build people up, not tear them down.</p>
<p>🛡️ Stand up against bullying and cruelty.</p>
<p>🩹 Care for those who are sick or suffering.</p>
<p>🌍 Work for peace instead of violence.</p>
<p>♿ Show compassion to those who are weak or vulnerable.</p>

<p>✨ <strong class="study-heading">Jesus and the Value of Life</strong></p>
<p>Jesus taught that every person has infinite worth. He healed the sick. He ate with outcasts and sinners, showing that everyone deserves love and dignity. He even loved His enemies and taught His followers to do the same.</p>

<div class="study-verse">"Jesus said, 'Love your enemies, bless those who curse you'" - Matthew 5:44</div>

<p>When we truly understand that every person is made in the image of God, we will naturally protect life, defend the vulnerable, and show kindness to all. That's the heart of this commandment! 💝</p>
</div>
            `
        },
        7: {
            title: 'Faithfulness in Marriage - No Adultery',
            content: `
<style>
.study-text { font-size: 1.1rem; line-height: 1.8; color: #222; }
.study-verse { background: #f3f0fa; padding: 1rem; margin: 1rem 0; border-left: 4px solid #6a11cb; font-style: italic; border-radius: 6px; }
.study-heading { color: #2575fc; font-size: 1.3rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.8rem; }
</style>
<div class="study-text">
<p>💍 "You shall not commit adultery." This commandment protects one of the most sacred relationships God has designed – marriage. It's about faithfulness, trust, and covenant.</p>

<div class="study-verse">"Therefore a man shall leave his father and mother and be joined to his wife, and they shall become one flesh" - Genesis 2:24</div>

<p>👰 <strong class="study-heading">What Is Adultery?</strong></p>
<p>Adultery is when a married person has a romantic or sexual relationship with someone who is not their spouse. It breaks the sacred promise made in marriage. It destroys trust, hurts children, and tears families apart.</p>

<p>But this commandment is about more than just the physical act. It's about the heart. Are you being faithful in thought as well as in action? Are you protecting your marriage by guarding your heart?</p>

<div class="study-verse">"Keep your heart with all diligence, for out of it spring the issues of life" - Proverbs 4:23</div>

<p>💑 <strong class="study-heading">The Covenant of Marriage</strong></p>
<p>Marriage is not just feelings or a contract. It's a covenant – a sacred, binding promise made before God and witnesses. In marriage, two people promise to love, honor, and remain faithful to each other for life.</p>

<p>This is why infidelity is so devastating. It breaks a sacred promise. It violates trust at the deepest level. But even more, it shows a lack of respect for God, who designed marriage and asks us to keep our promises.</p>

<div class="study-verse">"Marriage should be honored by all, and the marriage bed kept pure" - Hebrews 13:4</div>

<p>🛡️ <strong class="study-heading">Protecting Your Marriage</strong></p>
<p>For those who are married (or will be):</p>
<p>❤️ Invest in your relationship. Spend time together, communicate honestly, serve each other.</p>
<p>🚫 Avoid situations that tempt unfaithfulness. Guard your eyes and your heart.</p>
<p>🤝 Build friendships based on shared faith and values.</p>
<p>💬 Talk to your spouse about your feelings and struggles.</p>
<p>🙏 Pray together and keep God at the center of your marriage.</p>

<p>✨ <strong class="study-heading">For Those Not Yet Married</strong></p>
<p>💭 Begin now to value faithfulness and honesty in your relationships.</p>
<p>📖 Understand what marriage truly means before you enter into it.</p>
<p>🙏 Ask God to guide you toward a God-fearing partner who shares your values.</p>
<p>💫 Practice purity and self-control in your dating relationships.</p>

<p>God's design for marriage is beautiful and good. Faithfulness is not a burden – it's a blessing! 💝</p>
</div>
            `
        },
        8: {
            title: 'Honesty and Respect - Do Not Steal',
            content: `
<style>
.study-text { font-size: 1.1rem; line-height: 1.8; color: #222; }
.study-verse { background: #f3f0fa; padding: 1rem; margin: 1rem 0; border-left: 4px solid #6a11cb; font-style: italic; border-radius: 6px; }
.study-heading { color: #2575fc; font-size: 1.3rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.8rem; }
</style>
<div class="study-text">
<p>🎁 "You shall not steal." This commandment might seem simple, but it teaches us something much deeper about respect, honesty, and the proper use of what God has given us.</p>

<div class="study-verse">"The thief comes only to steal and kill and destroy" - John 10:10</div>

<p>🏠 <strong class="study-heading">What Is Theft?</strong></p>
<p>Stealing is taking something that belongs to someone else without permission or payment. Whether it's a toy, money, homework answers, or someone's time – if it belongs to them and we take it without right, that's theft.</p>

<p>But why does God care so much about possessions? Because every single thing we have is ultimately God's. He has given us certain possessions to care for, and when we steal from others, we're actually disrespecting God's ownership and His role as provider.</p>

<div class="study-verse">"The earth is the Lord's, and all it contains" - Psalm 24:1</div>

<p>💼 <strong class="study-heading">Hard Work and Honest Gain</strong></p>
<p>God values honest work. He teaches us to earn what we have through effort and integrity. When you work hard and earn something fair and square, you feel proud and satisfied. But when you steal, you feel guilty and ashamed.</p>

<p>Even small thefts – like taking a small item from a store, copying homework, or not paying for something – teach us that dishonesty is easier than work. But it's not! Dishonesty creates fear, shame, and broken relationships.</p>

<div class="study-verse">"The laborer deserves his wages" - 1 Timothy 5:18</div>

<p>🤲 <strong class="study-heading">Generosity As the Opposite</strong></p>
<p>If stealing takes what isn't ours, then the opposite virtue is generosity – sharing what we do have. God blesses those who give freely and help others in need.</p>

<p>💝 When you see someone with less than you, instead of stealing their dignity, help them. Share what you have. Work to build them up instead of taking from them.</p>

<div class="study-verse">"It is more blessed to give than to receive" - Acts 20:35</div>

<p>✨ <strong class="study-heading">Living Honestly</strong></p>
<p>👐 Keep your hands from taking what isn't yours.</p>
<p>💪 Work hard to earn what you need and want.</p>
<p>🤝 Help others who are struggling or in need.</p>
<p>😊 Let your reputation be one of honesty and integrity.</p>
<p>🙏 Trust that God will provide what you truly need.</p>

<p>When we live by this commandment, we live in peace. We don't fear being caught. We don't lose others' trust. We build a life based on integrity! 💚</p>
</div>
            `
        },
        9: {
            title: 'The Power of Truth - Do Not Lie',
            content: `
<style>
.study-text { font-size: 1.1rem; line-height: 1.8; color: #222; }
.study-verse { background: #f3f0fa; padding: 1rem; margin: 1rem 0; border-left: 4px solid #6a11cb; font-style: italic; border-radius: 6px; }
.study-heading { color: #2575fc; font-size: 1.3rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.8rem; }
</style>
<div class="study-text">
<p>🗣️ "You shall not bear false witness." In court, bearing false witness means lying under oath to hurt someone or hide the truth. But this commandment extends far beyond the courtroom. It teaches us the power and importance of truth.</p>

<div class="study-verse">"You belong to your father, the devil, and you want to carry out your father's desires. He was a murderer from the beginning, not holding to the truth" - John 8:44</div>

<p>💬 <strong class="study-heading">Why Lies Are So Destructive</strong></p>
<p>A lie is more than just wrong words. It's a violation of trust between people. When you lie to someone, you're telling them: \"I don't trust you with the truth\" and \"I don't respect you enough to be honest.\"</p>

<p>Lies have consequences:</p>
<p>📉 They destroy trust in relationships.</p>
<p>🔗 They break the bonds that hold families and communities together.</p>
<p>😔 They isolate us – we have to hide and live in fear of being exposed.</p>
<p>🌪️ They multiply – one lie leads to more lies to cover it up.</p>

<div class="study-verse">"A false witness will not go unpunished, and he who speaks lies will not escape" - Proverbs 19:5</div>

<p>✨ <strong class="study-heading">The Freedom of Truth</strong></p>
<p>Here's the beautiful flip side: truth sets you free. When you tell the truth, even when it's hard, you live with a clear conscience. You don't have to remember elaborate stories or live in fear of being caught. Truth simplifies life and builds genuine relationships.</p>

<p>Trust is one of the most precious things in relationships, and trust is built on honesty. When people know you always speak the truth, they respect you and want to be near you.</p>

<div class="study-verse">"You will know the truth, and the truth will set you free" - John 8:32</div>

<p>🛡️ <strong class="study-heading">When Telling the Truth Is Hard</strong></p>
<p>😓 Maybe you did something wrong and are afraid to admit it.</p>
<p>😨 Maybe you're afraid of how others will react to the truth.</p>
<p>🤫 Maybe you think a small lie will protect someone's feelings.</p>

<p>In these moments, remember: telling the truth is always better. Yes, there might be temporary consequences, but there are always bigger consequences for lying. And when you tell the truth, even about mistakes, people respect you more, not less.</p>

<div class="study-verse">"Therefore each of you must put off falsehood and speak truthfully to your neighbor" - Ephesians 4:25</div>

<p>🌟 <strong class="study-heading">Living in Truth</strong></p>
<p>💯 Practice speaking truth, even in small things.</p>
<p>👂 Listen carefully when others speak so you hear the truth.</p>
<p>🤝 Confront falsehood with gentleness and love when you see it.</p>
<p>🧠 Think before you speak – Is it true? Is it necessary? Is it kind?</p>
<p>🙏 Remember that God is the source and lover of all truth.</p>

<p>Truth is not always easy, but it's always right. Build your life and relationships on truth! 💝</p>
</div>
            `
        },
        10: {
            title: 'Contentment Over Envy - Do Not Covet',
            content: `
<style>
.study-text { font-size: 1.1rem; line-height: 1.8; color: #222; }
.study-verse { background: #f3f0fa; padding: 1rem; margin: 1rem 0; border-left: 4px solid #6a11cb; font-style: italic; border-radius: 6px; }
.study-heading { color: #2575fc; font-size: 1.3rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.8rem; }
</style>
<div class="study-text">
<p>😢 "You shall not covet." This is a different kind of commandment. It's not about an action you do – it's about a feeling you have. It tells us not to desire what belongs to someone else in a way that makes us miserable.</p>

<div class="study-verse">"You shall not covet your neighbor's house... nor anything that is your neighbor's\" - Exodus 20:17</div>

<p>😔 <strong class="study-heading">What Is Coveting?</strong></p>
<p>Coveting is more than just noticing that someone has something nice. It's an unhealthy desire that eats away at your happiness. It's looking at what others have and thinking: \"That should be mine! I deserve that! Why do they have it and I don't?\"</p>

<p>This feeling leads to all kinds of trouble. It makes you discontent with your own life. It can lead to stealing, lying, or harming others to get what they have. It poisons friendships and destroys peace.</p>

<div class="study-verse">"For the love of money is a root of all kinds of evil\" - 1 Timothy 6:10</div>

<p>📱 <strong class="study-heading">Coveting in the Modern World</strong></p>
<p>We live in an age of comparison. Social media shows us everyone's highlight reel. We see the nice clothes, the trips, the success. Without meaning to, we start thinking: \"I want that. I wish my life was like that. Why can't I have what they have?\"</p>

<p>This is coveting, and it's making millions of people miserable. They have enough, but it doesn't feel like enough when they're always comparing themselves to others.</p>

<div class="study-verse">"Keep your lives free from the love of money and be content with what you have\" - Hebrews 13:5</div>

<p>💚 <strong class="study-heading">The Gift of Contentment</strong></p>
<p>Contentment is the opposite of coveting. It's looking at what you have and saying: \"This is enough. I can be happy with this. I am grateful.\" Contentment brings peace, joy, and freedom.</p>

<p>This doesn't mean you never want to improve or grow. It means you're not miserable while you're waiting. You're not consuming yourself with envy. You're grateful for what you have while working toward what you need.</p>

<div class="study-verse">"I have learned to be content whatever the circumstances\" - Philippians 4:11</div>

<p>🌟 <strong class="study-heading">How to Develop Contentment</strong></p>
<p>🙏 Practice gratitude. Every morning, write down three things you're grateful for.</p>
<p>👀 Limit your exposure to comparison. Take a break from social media if you need to.</p>
<p>🤝 Focus on relationships, not possessions. Time with people you love brings more joy than any purchase.</p>
<p>📚 Read about people who found happiness with little. Learn from their wisdom.</p>
<p>🎯 Set meaningful goals based on your values, not on what others have.</p>
<p>💪 Work toward improvement, but enjoy the journey, not just the destination.</p>

<p>✨ <strong class="study-heading">The Truth About \"Stuff\"</strong></p>
<p>Here's a secret: the things other people have won't make them happy forever either. The newest phone becomes old. The fancy house needs maintenance. The perfect vacation becomes a memory. Real happiness comes from within – from loving relationships, from purpose, from God.</p>

<div class="study-verse">"For we brought nothing into the world, and we can take nothing out of it\" - 1 Timothy 6:7</div>

<p>When you stop coveting and start appreciating, when you stop comparing and start celebrating others' happiness, life becomes so much sweeter. You are free! 💝</p>
</div>
            `
        }
    };

    const study = studies[storyId];
    if (study) {
        container.innerHTML = `<div style="max-height:80vh;overflow-y:auto;padding:2rem;"><h1 style="color:#2575fc;margin-bottom:1.5rem;">${study.title}</h1>${study.content}</div>`;
    } else {
        container.innerHTML = '<p>Study not found. Please try another lesson.</p>';
    }
}

function attachTranscriptToggles() {
    // This function is intentionally empty since we've removed transcripts
}

// search bar logic
const searchBar = document.getElementById('search-bar');
if (searchBar) {
    searchBar.addEventListener('input', () => {
        renderStories(searchBar.value);
    });
}

// initialize when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => loadAndRender());
} else {
    loadAndRender();
}

// initialize when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', displayStories);
} else {
    displayStories();
}
