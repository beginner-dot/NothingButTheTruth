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
        const card = `
            <div class="video-card">
                <div class="video-frame">
                    <iframe src="${story.videoUrl}" frameborder="0" allowfullscreen></iframe>
                </div>
                <div class="card-body">
                    <span class="category-badge">${story.category}</span>
                    <h3>${story.title}</h3>
                    <p class="reference"><strong>Reference:</strong> ${story.reference}</p>
                    <button class="toggle-transcript btn-link">Read Transcript</button>
                    <div class="transcript">${story.transcript || ''}</div>
                    <a href="quiz.html?id=${story.quizId}" class="quiz-btn">Explore Related Quiz</a>
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
    attachTranscriptToggles();
}

function attachTranscriptToggles() {
    document.querySelectorAll('.toggle-transcript').forEach(btn => {
        btn.addEventListener('click', () => {
            const trans = btn.nextElementSibling;
            if (trans.classList.contains('open')) {
                trans.classList.remove('open');
                btn.textContent = 'Read Transcript';
            } else {
                trans.classList.add('open');
                btn.textContent = 'Hide Transcript';
            }
        });
    });
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
