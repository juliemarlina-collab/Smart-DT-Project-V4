/* Smart DT Phase 01 Empathy — page interactions */
(function () {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const QUIZ = [
    {
      q: "What is the main purpose of the Empathy phase?",
      options: [
        "To understand users and their real needs",
        "To immediately build the final product",
        "To choose colours and app icons",
        "To present the final pitch"
      ],
      answer: 0
    },
    {
      q: "Which activity helps you collect direct user quotes?",
      options: ["Interview", "Final testing", "Logo design", "Coding"],
      answer: 0
    },
    {
      q: "In an empathy map, 'Says' means...",
      options: [
        "What users directly say or quote",
        "What the team wants to sell",
        "Only what the teacher says",
        "The final project title"
      ],
      answer: 0
    },
    {
      q: "Why should we observe users?",
      options: [
        "To notice what users do, not only what they say",
        "To skip the interview",
        "To copy another project",
        "To avoid collecting evidence"
      ],
      answer: 0
    },
    {
      q: "What should the team produce after empathy activities?",
      options: [
        "Clear user needs and insights",
        "A final certificate",
        "A random product",
        "A completed marketing poster only"
      ],
      answer: 0
    }
  ];

  let current = 0;
  let selected = null;
  let score = 0;

  function showView(view) {
    const overview = $('#overview-section');
    const quiz = $('#quick-check-section');
    const tabs = $$('.segmented-tabs .tab-pill');

    if (!overview || !quiz) return;

    if (view === 'quiz') {
      overview.classList.add('hidden');
      quiz.classList.add('active');
      tabs.forEach(t => t.classList.toggle('active', t.dataset.view === 'quiz'));
      renderQuiz();
      quiz.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      quiz.classList.remove('active');
      overview.classList.remove('hidden');
      tabs.forEach(t => t.classList.toggle('active', t.dataset.view === 'overview'));
      overview.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function renderQuiz() {
    const mount = $('#quiz-mount');
    if (!mount) return;

    if (current >= QUIZ.length) {
      const passed = score >= 3;
      if (passed) {
        localStorage.setItem('df_p01_quiz_passed', 'true');
      }
      mount.innerHTML = `
        <div class="quiz-card">
          <div class="quiz-title">${passed ? 'Great work!' : 'Try again'}</div>
          <p class="panel-sub" style="font-size:13px;margin-top:8px;">
            You scored <strong>${score}/${QUIZ.length}</strong>. ${passed ? 'Templates are now unlocked.' : 'Score at least 3/5 to unlock templates.'}
          </p>
          <div class="quiz-result show"><strong>${passed ? 'Unlocked:' : 'Reminder:'}</strong> ${passed ? 'You can now continue to the Empathy Templates page.' : 'Review the overview and try the quick check again.'}</div>
          <div class="quiz-actions">
            <button class="btn-primary" id="quiz-retry">${passed ? 'Retake Quiz' : 'Try Again'}</button>
            <a class="btn-secondary" href="phase01-templates.html">View Templates →</a>
          </div>
        </div>
      `;
      $('#quiz-retry')?.addEventListener('click', () => {
        current = 0; selected = null; score = 0; renderQuiz();
      });
      return;
    }

    const item = QUIZ[current];
    selected = null;

    mount.innerHTML = `
      <div class="quiz-card">
        <div class="quiz-top">
          <div>
            <p class="quiz-title">Quick Check</p>
            <p class="panel-sub">Answer 5 questions to unlock Empathy Templates.</p>
          </div>
          <div class="quiz-count">${current + 1} / ${QUIZ.length}</div>
        </div>
        <div class="quiz-question">${item.q}</div>
        <div class="quiz-options">
          ${item.options.map((opt, idx) => `
            <button class="quiz-option" data-index="${idx}">
              ${String.fromCharCode(65 + idx)}. ${opt}
            </button>
          `).join('')}
        </div>
        <div class="quiz-actions">
          <button class="btn-secondary" id="quiz-back">Back</button>
          <button class="btn-primary" id="quiz-next">Next →</button>
        </div>
      </div>
    `;

    $$('.quiz-option', mount).forEach(btn => {
      btn.addEventListener('click', () => {
        selected = Number(btn.dataset.index);
        $$('.quiz-option', mount).forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });

    $('#quiz-back')?.addEventListener('click', () => showView('overview'));
    $('#quiz-next')?.addEventListener('click', () => {
      if (selected === null) {
        alert('Please choose one answer first.');
        return;
      }
      if (selected === item.answer) score++;
      current++;
      renderQuiz();
    });
  }

  function initOverviewTabs() {
    $$('.segmented-tabs .tab-pill[data-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        if (view === 'templates') {
          window.location.href = 'phase01-templates.html';
        } else {
          showView(view);
        }
      });
    });

    $$('[data-go-quiz]').forEach(btn => {
      btn.addEventListener('click', () => showView('quiz'));
    });
  }

  function initTemplateTabs() {
    const pills = $$('.template-pill[data-template]');
    const panels = $$('.template-panel[data-template]');
    if (!pills.length) return;

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        const key = pill.dataset.template;
        pills.forEach(p => p.classList.toggle('active', p === pill));
        panels.forEach(panel => panel.classList.toggle('active', panel.dataset.template === key));
      });
    });
  }

  function initAutosave() {
    $$('[data-save]').forEach(field => {
      const key = field.name || field.id || field.dataset.save;
      if (!key) return;
      const saved = localStorage.getItem(key);
      if (saved !== null) field.value = saved;
      field.addEventListener('input', () => localStorage.setItem(key, field.value));
      field.addEventListener('change', () => localStorage.setItem(key, field.value));
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initOverviewTabs();
    initTemplateTabs();
    initAutosave();
  });
}());
