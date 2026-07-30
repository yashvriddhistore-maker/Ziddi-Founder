/**
 * Ziddi Founder - Interactive Website Functionality
 * Author: Gaurav Sharma & Antigravity Assistant
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initQuizEngine();
  initQuotesEngine();
  initEpisodesEngine();
  initSmoothScroll();
});

/**
 * 1. Scroll-Triggered Reveal Animations
 * Uses IntersectionObserver to trigger smooth fade-in-up animations.
 */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null, // Viewport
      rootMargin: '0px 0px -80px 0px', // Trigger slightly before element enters
      threshold: 0.15 // 15% of the element must be visible
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Stop tracking once animated
        }
      });
    }, observerOptions);
    
    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    revealElements.forEach(el => el.classList.add('revealed'));
  }
}

/**
 * 2. Slide-by-Slide Quiz Engine
 * Modern step-by-step quiz that checks readiness for systems coaching.
 */
function initQuizEngine() {
  const questions = [
    "Is your turnover between ₹10–100 Cr, but you're still the last line of defense for everything?",
    "Do you currently have documented SOPs your team can run without you checking daily?",
    "When something breaks, is your first instinct \"let me fix it\" instead of \"let me check the system\"?",
    "Have you gone more than 7 days without checking work messages, even on a planned holiday?",
    "Are you open to being coached only twice a month, with the real work happening between sessions?",
    "Do you currently rely on jugad more than structured process?",
    "Would you rather follow a proven framework than improvise your way through a problem?",
    "Is your ego okay with a coach pointing out that you are the bottleneck?",
    "Are you willing to commit to a 12-month process instead of expecting a fix in weeks?",
    "Do you have the authority to actually change how your business runs?"
  ];

  let currentQuestionIndex = 0;
  const userAnswers = [];

  // DOM Elements
  const meterFill = document.getElementById('meterFill');
  const meterScore = document.getElementById('meterScore');
  const qIndex = document.getElementById('qIndex');
  const qText = document.getElementById('qText');
  const quizActions = document.getElementById('quizActions');
  const quizResult = document.getElementById('quizResult');
  const resultIndicator = document.getElementById('resultIndicator');
  const resultTitle = document.getElementById('resultTitle');
  const resultBody = document.getElementById('resultBody');
  const resultCta = document.getElementById('resultCta');
  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const questionSlide = document.getElementById('questionSlide');

  if (!qText || !btnYes || !btnNo) return; // Exit if quiz elements aren't present

  // Initialize display
  updateQuestionDisplay();

  // Event Listeners for buttons
  btnYes.addEventListener('click', () => handleAnswer(1));
  btnNo.addEventListener('click', () => handleAnswer(0));

  function handleAnswer(value) {
    userAnswers.push(value);
    
    // Animate transition to next question
    questionSlide.classList.add('fade-out');
    
    setTimeout(() => {
      currentQuestionIndex++;
      
      if (currentQuestionIndex < questions.length) {
        updateQuestionDisplay();
        questionSlide.classList.remove('fade-out');
      } else {
        showResults();
      }
    }, 250); // Matches CSS transition time
  }

  function updateQuestionDisplay() {
    // Update Question text and serial number
    qIndex.textContent = `Q${(currentQuestionIndex + 1).toString().padStart(2, '0')}`;
    qText.textContent = questions[currentQuestionIndex];
    
    // Update progress meter bar (based on answered questions)
    const progressPercent = (currentQuestionIndex / questions.length) * 100;
    meterFill.style.width = `${progressPercent}%`;
    
    // Display current running score
    const yesCount = userAnswers.filter(a => a === 1).length;
    meterScore.textContent = `${yesCount}/${questions.length}`;
  }

  function showResults() {
    // 100% fill on progress
    meterFill.style.width = '100%';
    
    // Calculate final score
    const yesCount = userAnswers.filter(a => a === 1).length;
    meterScore.textContent = `${yesCount}/${questions.length}`;
    
    // Hide question actions
    quizActions.style.display = 'none';
    questionSlide.style.display = 'none';
    
    // Setup result parameters
    let titleText = "";
    let bodyText = "";
    let ctaText = "";
    let ctaHref = "";
    let statusClass = "";
    
    if (yesCount >= 8) {
      statusClass = "indicator-green";
      titleText = "You're ready.";
      bodyText = `Your score is ${yesCount}/${questions.length}. Your answers point to a founder who is completely ready to trade willpower for process. Let's schedule an audit session.`;
      ctaText = "Book a Consultation Call";
      ctaHref = `mailto:hello@ziddifounder.com?subject=Readiness%20Check%20-%20Score%20${yesCount}%2F10&body=Hi%20Gaurav%2C%20I%20have%20completed%20the%20Readiness%20Check%20on%20your%20website%20with%20a%20score%20of%20${yesCount}/10.%20I%20am%20interested%20in%20the%2012-month%20systems%20rebuild%20program.`;
    } else if (yesCount >= 4) {
      statusClass = "indicator-amber";
      titleText = "Getting there.";
      bodyText = `Your score is ${yesCount}/${questions.length}. Some parts of your business still depend heavily on your manual execution. Read our Field Notes on process design to prepare.`;
      ctaText = "Read the Field Notes";
      ctaHref = "#notes";
    } else {
      statusClass = "indicator-red";
      titleText = "Not yet — and that's fine.";
      bodyText = `Your score is ${yesCount}/${questions.length}. Currently, the business needs you the way it always has. That's a natural starting phase, not a failure. Read the Field Notes to learn the basics of delegation.`;
      ctaText = "Read the Field Notes";
      ctaHref = "#notes";
    }
    
    // Apply status classes and content
    resultIndicator.className = `result-status-indicator ${statusClass}`;
    resultTitle.textContent = titleText;
    resultBody.textContent = bodyText;
    resultCta.textContent = ctaText;
    resultCta.href = ctaHref;
    
    // Display results block
    quizResult.classList.add('show');
    
    // Smooth scroll to the result block within the container
    quizResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/**
 * 3. Enhanced Smooth Anchor Scrolling
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Calculate offset for sticky header
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * 4. Interactive Motivational Quotes Engine (GitHub / JSON Powered)
 */
function initQuotesEngine() {
  let quotes = [
    {
      text: `"जिद्द से बिज़नेस शुरू होता है, लेकिन सिस्टम से बिज़नेस स्केल होता है।"`,
      author: "— Ziddi Founder Mindset",
      category: "SYSTEMS & WILLPOWER // 01"
    },
    {
      text: `"Your business should run on structured processes, not on your constant daily presence."`,
      author: "— Operations Blueprint",
      category: "PROCESS ARCHITECTURE // 02"
    }
  ];

  let currentIndex = 0;
  let autoPlayTimer = null;

  const quoteCategory = document.getElementById('quoteCategory');
  const quoteCounter = document.getElementById('quoteCounter');
  const quoteText = document.getElementById('quoteText');
  const quoteAuthor = document.getElementById('quoteAuthor');
  const prevBtn = document.getElementById('prevQuoteBtn');
  const nextBtn = document.getElementById('nextQuoteBtn');
  const copyBtn = document.getElementById('copyQuoteBtn');
  const copyToast = document.getElementById('copyToast');
  const dotsContainer = document.getElementById('quoteDots');
  const quoteCard = document.querySelector('.quote-card');

  if (!quoteText || !prevBtn || !nextBtn) return;

  fetch('quotes.json')
    .then(res => {
      if (!res.ok) throw new Error('Network error loading quotes.json');
      return res.json();
    })
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        quotes = data;
        rebuildDots();
        renderQuote(0);
      }
    })
    .catch(() => {
      rebuildDots();
    });

  function rebuildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    quotes.forEach((_, idx) => {
      const span = document.createElement('span');
      span.className = `dot ${idx === currentIndex ? 'active' : ''}`;
      span.setAttribute('data-index', idx);
      dotsContainer.appendChild(span);
    });
  }

  function renderQuote(index) {
    if (!quotes || quotes.length === 0) return;
    const contentWrapper = document.querySelector('.quote-content-wrapper');
    if (contentWrapper) contentWrapper.classList.add('fade-out');

    setTimeout(() => {
      currentIndex = index;
      const item = quotes[currentIndex];

      if (quoteCategory) quoteCategory.textContent = item.category || `MOTIVATION // ${(currentIndex + 1).toString().padStart(2, '0')}`;
      if (quoteCounter) quoteCounter.textContent = `${(currentIndex + 1).toString().padStart(2, '0')} / ${quotes.length.toString().padStart(2, '0')}`;
      if (quoteText) quoteText.textContent = item.text.startsWith('"') ? item.text : `"${item.text}"`;
      if (quoteAuthor) quoteAuthor.textContent = item.author;

      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentIndex);
        });
      }

      if (contentWrapper) contentWrapper.classList.remove('fade-out');
    }, 250);
  }

  function nextQuote() {
    const nextIdx = (currentIndex + 1) % quotes.length;
    renderQuote(nextIdx);
  }

  function prevQuote() {
    const prevIdx = (currentIndex - 1 + quotes.length) % quotes.length;
    renderQuote(prevIdx);
  }

  nextBtn.addEventListener('click', () => {
    nextQuote();
    resetAutoPlay();
  });

  prevBtn.addEventListener('click', () => {
    prevQuote();
    resetAutoPlay();
  });

  if (dotsContainer) {
    dotsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('dot')) {
        const targetIndex = parseInt(e.target.getAttribute('data-index'), 10);
        if (!isNaN(targetIndex) && targetIndex !== currentIndex) {
          renderQuote(targetIndex);
          resetAutoPlay();
        }
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const textToCopy = `${quotes[currentIndex].text}\n${quotes[currentIndex].author}`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        showCopyToast();
      }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showCopyToast();
      });
    });
  }

  function showCopyToast() {
    if (!copyToast) return;
    copyToast.classList.add('show');
    setTimeout(() => {
      copyToast.classList.remove('show');
    }, 2000);
  }

  function startAutoPlay() {
    autoPlayTimer = setInterval(nextQuote, 6000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  if (quoteCard) {
    quoteCard.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
    quoteCard.addEventListener('mouseleave', () => startAutoPlay());
  }

  startAutoPlay();
}

/**
 * 5. Read & Listen Episodes & Article Reader Modal Engine
 */
function initEpisodesEngine() {
  const episodesGrid = document.getElementById('episodesGrid');
  const articleModalOverlay = document.getElementById('articleModalOverlay');
  const closeArticleModalBtn = document.getElementById('closeArticleModalBtn');
  const modalCloseFooterBtn = document.getElementById('modalCloseFooterBtn');
  
  const modalTag = document.getElementById('modalTag');
  const modalTitle = document.getElementById('modalTitle');
  const modalReadTime = document.getElementById('modalReadTime');
  const modalSpotifyLink = document.getElementById('modalSpotifyLink');
  const modalBody = document.getElementById('modalBody');

  if (!episodesGrid) return;

  let episodesData = [];

  // Default fallback data if episodes.json fails to fetch
  const defaultEpisodes = [
    {
      "id": "ep-00",
      "episodeTag": "EPISODE 00",
      "title": "Willpower Got You to ₹10 Cr. Systems Take You to ₹100 Cr.",
      "description": "Why clean thinking can't fix broken operational architecture, and how to transition from daily willpower to DMAIC systems.",
      "readTime": "2 min",
      "spotifyUrl": "https://spotify.com",
      "articleContent": "<h2>The Willpower Ceiling</h2><p>Most ₹10–100 Cr founders are trapped in a self-built execution loop. In the early stage of a business, your personal grit, speed, and willpower are your greatest superpowers.</p><p>However, as operational complexity grows, relying on willpower creates massive high-stress drag. You become the single point of approval, the emergency responder, and the bottleneck for every decision.</p><h3>The DMAIC Transition</h3><p>To scale past ₹10 Cr toward ₹100 Cr without burning out, you must swap willpower for structured business engineering:</p><ul><li><strong>Define:</strong> Map exact operational boundaries where your presence is required vs where SOPs can take over.</li><li><strong>Measure:</strong> Track your calendar audit over 14 days to isolate micro-interruptions.</li><li><strong>Analyze:</strong> Identify root causes for recurring floor emergencies.</li><li><strong>Improve:</strong> Build lightweight, unambiguous SOPs and AI automations.</li><li><strong>Control:</strong> Stress-test your business by stepping out of daily operations.</li></ul><blockquote>\"A fix solves a problem today. A system makes the problem impossible to recur.\"</blockquote>"
    }
  ];

  fetch('episodes.json')
    .then(res => {
      if (!res.ok) throw new Error('Failed to load episodes.json');
      return res.json();
    })
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        episodesData = data;
      } else {
        episodesData = defaultEpisodes;
      }
      renderEpisodes();
    })
    .catch(() => {
      episodesData = defaultEpisodes;
      renderEpisodes();
    });

  function renderEpisodes() {
    episodesGrid.innerHTML = '';
    episodesData.forEach((ep, index) => {
      const card = document.createElement('div');
      card.className = 'media-card reveal-on-scroll revealed';
      card.innerHTML = `
        <div class="media-card-badge">
          <span class="pulse-dot"></span> ${escapeHtml(ep.episodeTag || 'EPISODE ' + index)}
        </div>
        <h3 class="media-card-title">${escapeHtml(ep.title || '')}</h3>
        <p class="media-card-desc">${escapeHtml(ep.description || '')}</p>
        
        <div class="media-card-actions">
          <button class="btn btn-ghost media-btn-read" onclick="openArticleReader('${ep.id || index}')">
            <span>📄</span> Read Article <small>(${escapeHtml(ep.readTime || '2 min')})</small>
          </button>
          <a href="${escapeHtml(ep.spotifyUrl || '#')}" target="_blank" rel="noopener" class="btn btn-solid media-btn-spotify">
            <span>🎧</span> Listen Track on Spotify
          </a>
        </div>
      `;
      episodesGrid.appendChild(card);
    });
  }

  window.openArticleReader = function(epId) {
    const ep = episodesData.find(e => e.id === epId) || episodesData[0];
    if (!ep) return;

    if (modalTag) modalTag.innerHTML = `<span class="pulse-dot"></span> ${escapeHtml(ep.episodeTag || '')}`;
    if (modalTitle) modalTitle.textContent = ep.title || '';
    if (modalReadTime) modalReadTime.textContent = ep.readTime || '2 min';
    if (modalSpotifyLink) modalSpotifyLink.href = ep.spotifyUrl || 'https://spotify.com';
    if (modalBody) modalBody.innerHTML = ep.articleContent || '<p>Article content coming soon.</p>';

    if (articleModalOverlay) articleModalOverlay.classList.add('open');
  };

  function closeModal() {
    if (articleModalOverlay) articleModalOverlay.classList.remove('open');
  }

  if (closeArticleModalBtn) closeArticleModalBtn.addEventListener('click', closeModal);
  if (modalCloseFooterBtn) modalCloseFooterBtn.addEventListener('click', closeModal);

  if (articleModalOverlay) {
    articleModalOverlay.addEventListener('click', (e) => {
      if (e.target === articleModalOverlay) closeModal();
    });
  }

  function escapeHtml(str) {
    return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
}
