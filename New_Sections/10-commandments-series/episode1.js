function showScripture(reference, message) {
  alert(reference + ": " + message);
}

function openChallengeModal() {
  document.getElementById("cmd1-challenge-modal").classList.remove("hidden");
}

function closeChallengeModal() {
  document.getElementById("cmd1-challenge-modal").classList.add("hidden");
}

function openCmd1Challenge() {
  document.getElementById("cmd1-challenge-modal").classList.remove("hidden");
}

function closeCmd1Challenge() {
  document.getElementById("cmd1-challenge-modal").classList.add("hidden");
}

function openReflectModal() {
  document.getElementById("cmd1-reflect-modal").classList.remove("hidden");
}

function closeReflectModal() {
  document.getElementById("cmd1-reflect-modal").classList.add("hidden");
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('challenge-form');
  const progressContainer = document.getElementById('progress-container');
  const progressList = document.getElementById('progress-list');
  const clearProgressBtn = document.getElementById('clear-progress');
  const notifyCheckbox = document.getElementById('notify');

  // Load saved actions and progress from localStorage
  const savedActions = JSON.parse(localStorage.getItem('challengeActions')) || [];
  const savedProgress = JSON.parse(localStorage.getItem('challengeProgress')) || [];

  function renderProgress() {
    progressList.innerHTML = '';
    if (savedActions.length === 0) {
      progressList.innerHTML = '<li>No actions submitted yet.</li>';
      return;
    }
    savedActions.forEach((action, index) => {
      const li = document.createElement('li');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = savedProgress[index] || false;
      checkbox.addEventListener('change', () => {
        savedProgress[index] = checkbox.checked;
        localStorage.setItem('challengeProgress', JSON.stringify(savedProgress));
      });
      li.appendChild(checkbox);
      li.appendChild(document.createTextNode(' ' + action));
      progressList.appendChild(li);
    });
  }

  if (savedActions.length > 0) {
    progressContainer.classList.remove('hidden');
    renderProgress();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const action1 = form.action1.value.trim();
    const action2 = form.action2.value.trim();
    const action3 = form.action3.value.trim();

    if (!action1 || !action2 || !action3) {
      alert('Please fill in all three actions.');
      return;
    }

    const actions = [action1, action2, action3];
    localStorage.setItem('challengeActions', JSON.stringify(actions));
    localStorage.setItem('challengeProgress', JSON.stringify([false, false, false]));

    savedActions.length = 0;
    savedActions.push(...actions);
    savedProgress.length = 0;
    savedProgress.push(false, false, false);

    renderProgress();
    progressContainer.classList.remove('hidden');

    if (notifyCheckbox.checked) {
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Reminder set', {
              body: 'Remember to work on your spiritual actions today!',
              icon: 'assets/icons/no-idols.svg'
            });
          }
        });
      } else {
        alert('Notifications are not supported by your browser.');
      }
    }

    alert('Your actions have been saved. You can track your progress here.');
  });

  clearProgressBtn.addEventListener('click', () => {
    localStorage.removeItem('challengeActions');
    localStorage.removeItem('challengeProgress');
    savedActions.length = 0;
    savedProgress.length = 0;
    renderProgress();
    progressContainer.classList.add('hidden');
    form.reset();
  });
});

// GSAP animations
if (typeof gsap !== "undefined") {
  gsap.from(".svg-container", { duration: 1.5, scale: 0, ease: "back.out(1.7)" });
  gsap.from(".cmd-title", { duration: 1, y: -50, opacity: 0, delay: 0.5 });
  gsap.from(".cmd-text", { duration: 1, y: 30, opacity: 0, delay: 1 });
  gsap.from(".cmd-btn", { duration: 1, scale: 0, opacity: 0, delay: 1.5 });
}
