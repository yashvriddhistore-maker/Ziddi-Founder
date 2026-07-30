// ── STATE ──
let lang = 'en';
let selectedChapter = 'all';
let selectedDiff = 'easy';
let quizQuestions = [];
let currentIdx = 0;
let score = 0;
let correctCount = 0;
let wrongCount = 0;
let skipCount = 0;
let timerInterval = null;
let timeLeft = 30;
let answered = false;
let userAnswers = [];

// ── UI TRANSLATIONS ──
const TRANSLATIONS = {
  en: {
    banner1: "ZIDDI FOUNDER SIX SIGMA DIAGNOSTIC",
    banner2: "TEST YOUR PROCESS ARCHITECTURE KNOWLEDGE",
    banner3: "SYSTEMS THINKING OVER MOTIVATIONAL HYPE",
    langLabel: "Lang:",
    eyebrow: "Diagnostic Engine",
    appTitle: "Six Sigma Readiness Check",
    appSub: "Validate your knowledge of process architecture and DMAIC frameworks.",
    allChapters: "All Modules",
    allSub: "100+ Parameters",
    mod1Sub: "What is 6σ",
    mod5Sub: "Base Concepts",
    mod6Sub: "Approach",
    mod7Sub: "Process Layer",
    mod8Sub: "Quality Specs",
    mod9Sub: "Project Scale",
    mod10Sub: "Team Struct",
    chapter: "Module",
    difficulty: "STRESS LEVEL:",
    easy: "STANDARD",
    hard: "ELEVATED",
    mixed: "MIXED LOAD",
    start: "INITIATE DIAGNOSTIC",
    tminus: "T-MINUS:",
    score: "EFFICIENCY RATE:",
    skip: "BYPASS PARAMETER //",
    diagComplete: "DIAGNOSTIC COMPLETE",
    sysAnalysis: "System Analysis",
    calcSigma: "Calculated Sigma Level",
    validated: "Validated",
    errors: "Errors",
    bypassed: "Bypassed",
    reboot: "REBOOT DIAGNOSTIC",
    mainConsole: "MAIN CONSOLE",
    auditLog: "AUDIT LOG",
    yourAns: "Your Choice:",
    rightAns: "Correct Choice:",
    yourAnsSkip: "Bypassed",
    timeUp: "TIME EXPIRED",
    correctMsg: "CORRECT PARAMETER",
    wrongMsg: "PARAMETER MISALIGNMENT",
    noQuest: "No questions for this selection. Try Mixed load."
  },
  hi: {
    banner1: "ज़िद्दी फाउंडर सिक्स सिग्मा डायग्नोस्टिक",
    banner2: "अपनी प्रोसेस आर्किटेक्चर ज्ञान की जाँच करें",
    banner3: "सिस्टम्स थिंकिंग बनाम केवल मोटिवेशन",
    langLabel: "भाषा:",
    eyebrow: "डायग्नोस्टिक इंजन",
    appTitle: "सिक्स सिग्मा रेडीनेस चेक",
    appSub: "प्रोसेस आर्किटेक्चर और DMAIC फ्रेमवर्क के अपने ज्ञान का परीक्षण करें।",
    allChapters: "सभी मॉड्यूल",
    allSub: "100+ पैरामीटर्स",
    mod1Sub: "6σ क्या है",
    mod5Sub: "मूल अवधारणाएं",
    mod6Sub: "दृष्टिकोण",
    mod7Sub: "प्रोसेस लेयर",
    mod8Sub: "गुणवत्ता मानक",
    mod9Sub: "प्रोजेक्ट स्केल",
    mod10Sub: "टीम संरचना",
    chapter: "मॉड्यूल",
    difficulty: "कठिनाई स्तर:",
    easy: "मानक (सामान्य)",
    hard: "उच्च (कठिन)",
    mixed: "मिश्रित (दोनों)",
    start: "डायग्नोस्टिक शुरू करें",
    tminus: "शेष समय:",
    score: "दक्षता दर:",
    skip: "प्रश्न छोड़ें //",
    diagComplete: "डायग्नोस्टिक पूर्ण",
    sysAnalysis: "सिस्टम विश्लेषण",
    calcSigma: "परिणामी सिग्मा स्तर",
    validated: "सही उत्तर",
    errors: "गलत उत्तर",
    bypassed: "छोड़े गए",
    reboot: "पुनः जाँच शुरू करें",
    mainConsole: "मुख्य कंसोल",
    auditLog: "ऑडिट लॉग",
    yourAns: "आपका उत्तर:",
    rightAns: "सही उत्तर:",
    yourAnsSkip: "छोड़ा गया",
    timeUp: "समय समाप्त!",
    correctMsg: "सही उत्तर!",
    wrongMsg: "गलत उत्तर!",
    noQuest: "इस चयन के लिए कोई प्रश्न नहीं मिला। मिश्रित कठिनाई चुनें।"
  }
};

// ── LANGUAGE SWITCHER ──
function setLang(l) {
  lang = l;
  document.getElementById('lang-select').value = l;
  applyTranslations();

  const qText = document.getElementById('question-text');
  if (qText && quizQuestions.length > 0 && currentIdx < quizQuestions.length) {
    if (document.getElementById('screen-quiz').classList.contains('active')) {
      loadQuestion(true);
    }
  }
}

function applyTranslations() {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Header & Eyebrow & Subtitles
  const langLabel = document.querySelector('.lang-label');
  if (langLabel) langLabel.textContent = t.langLabel;

  const eyebrow = document.querySelector('.eyebrow');
  if (eyebrow) eyebrow.textContent = t.eyebrow;

  const appTitle = document.getElementById('app-title');
  if (appTitle) appTitle.textContent = t.appTitle;

  const appSub = document.getElementById('app-sub');
  if (appSub) appSub.textContent = t.appSub;

  const lblDiff = document.getElementById('lbl-diff');
  if (lblDiff) lblDiff.textContent = t.difficulty;

  const btnEasy = document.getElementById('btn-easy');
  if (btnEasy) btnEasy.textContent = t.easy;

  const btnHard = document.getElementById('btn-hard');
  if (btnHard) btnHard.textContent = t.hard;

  const btnMixed = document.getElementById('btn-mixed');
  if (btnMixed) btnMixed.textContent = t.mixed;

  const btnStart = document.getElementById('btn-start');
  if (btnStart) btnStart.textContent = t.start;

  // Quiz screen
  const timerLabel = document.querySelector('.timer-label');
  if (timerLabel) timerLabel.textContent = t.tminus;

  const lblScore = document.getElementById('lbl-score');
  if (lblScore) lblScore.textContent = t.score;

  const btnSkip = document.getElementById('btn-skip');
  if (btnSkip) btnSkip.textContent = t.skip;

  // Result screen
  const readoutTag = document.querySelector('.readout-tag');
  if (readoutTag) readoutTag.textContent = t.diagComplete;

  const slLabel = document.querySelector('.sl-label');
  if (slLabel) slLabel.textContent = t.calcSigma;

  const sCorrectSpan = document.querySelector('.s-correct span');
  if (sCorrectSpan) sCorrectSpan.textContent = t.validated;

  const sWrongSpan = document.querySelector('.s-wrong span');
  if (sWrongSpan) sWrongSpan.textContent = t.errors;

  const sSkipSpan = document.querySelector('.s-skip span');
  if (sSkipSpan) sSkipSpan.textContent = t.bypassed;

  const reviewHeader = document.querySelector('.review-header');
  if (reviewHeader) reviewHeader.textContent = t.auditLog;

  const resultBtns = document.querySelectorAll('.result-btns button');
  if (resultBtns.length >= 2) {
    resultBtns[0].textContent = t.reboot;
    resultBtns[1].textContent = t.mainConsole;
  }

  // Chapter cards mapping
  const subMap = {
    'all': { name: t.allChapters, count: t.allSub },
    '1': { name: t.chapter + ' 1', count: t.mod1Sub },
    '5': { name: t.chapter + ' 5', count: t.mod5Sub },
    '6': { name: t.chapter + ' 6', count: t.mod6Sub },
    '7': { name: t.chapter + ' 7', count: t.mod7Sub },
    '8': { name: t.chapter + ' 8', count: t.mod8Sub },
    '9': { name: t.chapter + ' 9', count: t.mod9Sub },
    '10': { name: t.chapter + ' 10', count: t.mod10Sub }
  };

  document.querySelectorAll('.chap-card').forEach(card => {
    const spanName = card.querySelector('.chap-name');
    const spanCount = card.querySelector('.chap-count');
    const onclickStr = card.getAttribute('onclick') || '';
    let key = 'all';
    const match = onclickStr.match(/'([^']+)'/);
    if (match && match[1]) key = match[1];

    if (subMap[key]) {
      if (spanName) spanName.textContent = subMap[key].name;
      if (spanCount) spanCount.textContent = subMap[key].count;
    }
  });

  // Apply custom data-en / data-hi attributes
  document.querySelectorAll('[data-' + lang + ']').forEach(el => {
    el.textContent = el.getAttribute('data-' + lang);
  });
}

// ── CHAPTER SELECT ──
function selectChapter(ch) {
  selectedChapter = ch;
  document.querySelectorAll('.chap-card').forEach(c => c.classList.remove('selected'));
  if (event && event.currentTarget) {
    event.currentTarget.classList.add('selected');
  }
}

// ── DIFFICULTY ──
function setDiff(d) {
  selectedDiff = d;
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active');
  }
}

// ── SCREEN SWITCH ──
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

// ── START QUIZ ──
function startQuiz() {
  const allQ = window.QUESTIONS || [];
  let pool = allQ.filter(q => {
    const chapMatch = selectedChapter === 'all' || q.ch === selectedChapter;
    const diffMatch = selectedDiff === 'both' ? true : (selectedDiff === 'easy' ? q.diff === 'easy' : q.diff === 'hard');
    return chapMatch && diffMatch;
  });

  if (pool.length === 0) {
    alert(TRANSLATIONS[lang].noQuest);
    return;
  }

  // Shuffle
  quizQuestions = pool.sort(() => Math.random() - 0.5).slice(0, Math.min(20, pool.length));
  currentIdx = 0; score = 0; correctCount = 0; wrongCount = 0; skipCount = 0;
  userAnswers = [];
  showScreen('screen-quiz');
  loadQuestion();
}

// ── LOAD QUESTION ──
function loadQuestion(isLangChange = false) {
  if (currentIdx >= quizQuestions.length) { showResult(); return; }
  
  if (!isLangChange) answered = false;
  
  const q = quizQuestions[currentIdx];
  const t = TRANSLATIONS[lang];

  // Chapter tag
  const chapNames = {
    '1': lang === 'hi' ? 'मॉड्यूल 1' : 'Module 1',
    '5': lang === 'hi' ? 'मॉड्यूल 5' : 'Module 5',
    '6': lang === 'hi' ? 'मॉड्यूल 6' : 'Module 6',
    '7': lang === 'hi' ? 'मॉड्यूल 7' : 'Module 7',
    '8': lang === 'hi' ? 'मॉड्यूल 8' : 'Module 8',
    '9': lang === 'hi' ? 'मॉड्यूल 9' : 'Module 9',
    '10': lang === 'hi' ? 'मॉड्यूल 10' : 'Module 10',
    'num': lang === 'hi' ? 'गणना' : 'Numerical'
  };
  
  document.getElementById('q-chapter').textContent = chapNames[q.ch] || (lang === 'hi' ? `मॉड्यूल ${q.ch}` : `Module ${q.ch}`);
  document.getElementById('q-counter').textContent = `Q ${currentIdx + 1}/${quizQuestions.length}`;
  
  // Question text (Hindi vs English)
  const questionStr = (lang === 'hi' && q.hi_q) ? q.hi_q : q.en_q;
  document.getElementById('question-text').textContent = questionStr;
  document.getElementById('live-score').textContent = score;

  // Progress
  const pct = (currentIdx / quizQuestions.length) * 100;
  document.getElementById('progress-bar').style.width = pct + '%';

  // Options
  const grid = document.getElementById('options-grid');
  grid.innerHTML = '';
  const labels = ['A', 'B', 'C', 'D'];
  const optsArray = (lang === 'hi' && q.hi_opts && q.hi_opts.length > 0) ? q.hi_opts : q.en_opts;
  
  optsArray.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="opt-label">${labels[i]}</span><span>${opt}</span>`;
    
    if (answered) {
       btn.disabled = true;
       const lastAns = userAnswers[userAnswers.length - 1];
       const chosen = lastAns ? lastAns.chosen : -1;
       if (i === q.ans) btn.classList.add('correct');
       else if (i === chosen && chosen !== q.ans) btn.classList.add('wrong');
    } else {
       btn.onclick = () => selectAnswer(i);
    }
    grid.appendChild(btn);
  });

  if (!isLangChange) startTimer();
}

// ── TIMER ──
function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 30;
  updateTimerUI();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerUI();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      autoSkip();
    }
  }, 1000);
}

function updateTimerUI() {
  const tVal = document.getElementById('timer-val');
  tVal.textContent = timeLeft;
  tVal.style.color = timeLeft > 10 ? 'var(--accent-green)' : timeLeft > 5 ? 'var(--accent-amber)' : 'var(--accent-red)';
}

function autoSkip() {
  if (answered) return;
  answered = true;
  userAnswers.push({ q: quizQuestions[currentIdx], chosen: -1, correct: false });
  skipCount++;
  showFlash(TRANSLATIONS[lang].timeUp, 'no');
  revealAnswer(-1);
  setTimeout(nextQuestion, 1500);
}

// ── SELECT ANSWER ──
function selectAnswer(chosen) {
  if (answered) return;
  answered = true;
  clearInterval(timerInterval);

  const q = quizQuestions[currentIdx];
  const isCorrect = chosen === q.ans;

  if (isCorrect) {
    score += 10;
    correctCount++;
    showFlash(TRANSLATIONS[lang].correctMsg, 'ok');
  } else {
    wrongCount++;
    showFlash(TRANSLATIONS[lang].wrongMsg, 'no');
  }

  userAnswers.push({ q, chosen, correct: isCorrect });
  revealAnswer(chosen);
  setTimeout(nextQuestion, 1800);
}

function revealAnswer(chosen) {
  const q = quizQuestions[currentIdx];
  const btns = document.querySelectorAll('.option-btn');
  btns.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.ans) btn.classList.add('correct');
    else if (i === chosen && chosen !== q.ans) btn.classList.add('wrong');
  });
}

// ── SKIP ──
function skipQuestion() {
  if (answered) return;
  answered = true;
  clearInterval(timerInterval);
  userAnswers.push({ q: quizQuestions[currentIdx], chosen: -1, correct: false });
  skipCount++;
  nextQuestion();
}

function nextQuestion() {
  currentIdx++;
  loadQuestion();
}

// ── FLASH FEEDBACK ──
function showFlash(msg, type) {
  const old = document.querySelector('.feedback-flash');
  if (old) old.remove();
  const el = document.createElement('div');
  el.className = `feedback-flash ${type}`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1400);
}

// ── RESULT ──
function showResult() {
  showScreen('screen-result');
  const total = quizQuestions.length;
  const pct = Math.round((correctCount / total) * 100);

  document.getElementById('stat-correct').textContent = correctCount;
  document.getElementById('stat-wrong').textContent = wrongCount;
  document.getElementById('stat-skip').textContent = skipCount;

  let title;
  if (pct >= 90) { title = lang === 'hi' ? 'सिस्टम अनुकूलित (इष्टतम)' : 'System Optimized'; }
  else if (pct >= 75) { title = lang === 'hi' ? 'स्थिर आर्किटेक्चर' : 'Stable Architecture'; }
  else if (pct >= 60) { title = lang === 'hi' ? 'कार्यशील परंतु संवेदनशील' : 'Functional but Fragile'; }
  else if (pct >= 40) { title = lang === 'hi' ? 'संरचनात्मक त्रुटियां' : 'Structural Leaks'; }
  else { title = lang === 'hi' ? 'गंभीर विफलता' : 'Critical Failure'; }

  document.getElementById('result-title').textContent = title;

  let sigmaLvl;
  if (pct >= 90) sigmaLvl = '5σ – 6σ';
  else if (pct >= 75) sigmaLvl = '4σ';
  else if (pct >= 60) sigmaLvl = '3σ';
  else sigmaLvl = '2σ';

  document.getElementById('sigma-level').textContent = sigmaLvl;

  const t = TRANSLATIONS[lang];
  const reviewList = document.getElementById('review-list');
  reviewList.innerHTML = '';
  userAnswers.forEach((ua, i) => {
    const div = document.createElement('div');
    div.className = `review-item ${ua.correct ? 'r-correct' : 'r-wrong'}`;
    const labels = ['A','B','C','D'];
    const questText = (lang === 'hi' && ua.q.hi_q) ? ua.q.hi_q : ua.q.en_q;
    const optsArray = (lang === 'hi' && ua.q.hi_opts && ua.q.hi_opts.length > 0) ? ua.q.hi_opts : ua.q.en_opts;
    const yourAns = ua.chosen === -1 ? (t.yourAnsSkip || 'Skipped') : labels[ua.chosen] + ') ' + optsArray[ua.chosen];
    const correctAns = labels[ua.q.ans] + ') ' + optsArray[ua.q.ans];
    div.innerHTML = `
      <p class="review-q">${i+1}. ${questText}</p>
      <p class="review-ans">
        <span class="${ua.correct ? 'ans-correct' : 'ans-wrong'}">${t.yourAns} ${yourAns}</span><br>
        <span class="ans-correct">${t.rightAns} ${correctAns}</span>
      </p>`;
    reviewList.appendChild(div);
  });

  applyTranslations();
}

// ── RETRY & HOME ──
function retryQuiz() {
  currentIdx = 0; score = 0; correctCount = 0; wrongCount = 0; skipCount = 0;
  userAnswers = [];
  quizQuestions = quizQuestions.sort(() => Math.random() - 0.5);
  showScreen('screen-quiz');
  loadQuestion();
}

function goHome() {
  clearInterval(timerInterval);
  showScreen('screen-home');
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();
});
