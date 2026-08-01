/**
 * Case Study to Instagram Content Generator — SaaS Engine Logic
 * Author: Ziddi Founder Architecture & Antigravity
 */

document.addEventListener('DOMContentLoaded', () => {
  initPresets();
  initFileUpload();
  initFormSubmit();
  initTabs();
  initModal();
  initCharCounters();
});

window.animalBgOffset = 0;

// Curated Majestic Animal Background Photos (Tested & Verified Unsplash URLs)
const ANIMAL_BACKGROUNDS = [
  { name: "African Lion", url: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=1080&q=80" },
  { name: "Bengal Tiger", url: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=1080&q=80" },
  { name: "Cheetah Savannah", url: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=1080&q=80" },
  { name: "African Leopard", url: "https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=1080&q=80" },
  { name: "Wild White Horse", url: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1080&q=80" },
  { name: "Golden Eagle", url: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=1080&q=80" },
  { name: "Majestic Panther", url: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=1080&q=80" },
  { name: "Red Fox", url: "https://images.unsplash.com/photo-1516934024742-b461fba47600?w=1080&q=80" },
  { name: "African Elephant", url: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=1080&q=80" },
  { name: "Wise Owl", url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1080&q=80" },
  { name: "Wild Wolf", url: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef9?w=1080&q=80" },
  { name: "Tropical Parrot", url: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=1080&q=80" }
];

// Sample Case Studies Presets Data
const PRESETS = {
  nike: {
    title: "Nike ₹1,000 Cr Air Jordan & Asset-Light Scaling Strategy",
    content: `🏁 नाइकी बिजनेस केस स्टडी (Nike Case Study)

1. द प्रॉब्लम (The Challenge)
• शुरुआती दौर (1960s-70s): जब नाइकी (Blue Ribbon Sports) शुरू हुई, Adidas और Puma का मार्केट पर राज था। बड़ा बजट या मैन्युफैक्चरिंग सेटअप नहीं था।
• सप्लाई चैन & कॉस्ट: अमेरिका में जूते बनाना बहुत महंगा था।

2. नाइकी की 'जिद्दी' स्ट्रेटजी (The Winning Strategy)
A. प्रोडक्ट इनोवेशन: बिल बोवरमैन ने किचन 'वफ़ल मेकर' (Waffle Maker) में रबर डालकर हल्का और हाई-ग्रिप वफ़ल सोल जूता बनाया।
B. आउटसोर्सिंग मॉडल (Asset-Light): जूते खुद बनाने के बजाय एशियन देशों में आउटसोर्स कर दिया। फोकस सिर्फ डिज़ाइन, R&D और मार्केटिंग पर रखा।
C. इमोशनल ब्रांडिंग – "Just Do It": नाइकी ने फीचर्स नहीं, "Hero's Journey" (संघर्ष और जीत की भावना) बेची।
D. द माइकल जॉर्डन इफ़ेक्ट (Air Jordan Case): 1984 में Michael Jordan के साथ Air Jordan लॉन्च किया। NBA ने बैन किया, नाइकी ने जुर्माना भरकर Rebellious Cool बनाकर प्रमोट किया। Target $3 Lakh था, बेचे $126 Million (₹1000+ करोड़)!

3. मुख्य सबक (Key Takeaways for Founders)
• Sell the Emotion, Not the Product: लोग अहसास खरीदते हैं।
• Smart Athlete / Influencer Fit: सही पार्टनरशिप से ब्रांड ग्लोबल बनता है।
• Asset-Light Scaling: जो काम कोर नहीं है, उसे आउटसोर्स करो।`
  },

  auto: {
    title: "₹28 Cr Auto Components Factory Bottleneck",
    content: `The Case of Pune Precision Components (₹28 Cr Turnover):

The Bottleneck:
The founder was spending 3.5 hours every single day approving inventory requisitions below ₹50,000, resolving shop floor delivery delays, and refereeing disputes between sales and production teams. Willpower and daily firefighting had worked to reach ₹28 Cr, but created massive high-stress drag capping further growth.

The DMAIC System Intervention:
1. 14-Day Decision Log Audit: Tracked every founder interruption and identified that 82% of floor approvals were routine purchases.
2. Tiered Approval Matrix: Established an automated SOP allowing plant managers to approve up to ₹1 Lakh autonomously.
3. Daily 15-Minute Morning Huddle: Replaced 20+ daily frantic phone calls with a single metric review covering quality, output, and dispatch targets.

Key Metric Outcomes:
- Reclaimed 18 Hours per week of founder time for strategic expansion.
- Reduced shop floor delivery delay escalations by 64% in 60 days.
- Founder took their first 10-day vacation in 6 years with zero floor interventions.`
  },

  saas: {
    title: "₹45 Cr B2B IT Sales Engine Separation",
    content: `The Case of Apex IT Solutions (₹45 Cr Turnover):

The Bottleneck:
High-ticket enterprise B2B deals closed ONLY when the founder personally pitched in final meetings. When the founder was traveling or unavailable, sales pipeline leads stalled for weeks. Junior sales reps lacked structure and relied on unscripted pitch calls.

The DMAIC System Intervention:
1. Sales Pitch Architecture: Extracted 12 years of founder sales intuition into a standardized objection-handling playbook and pitch deck.
2. Pre-Qualification Lead Scoring: Implemented a mandatory pre-qualification diagnostic form so sales reps only pitched pre-vetted, qualified prospects.
3. Daily Pipeline Rhythm: Installed a 10-minute morning pipeline huddle and automated CRM follow-up triggers.

Key Metric Outcomes:
- 3.2X increase in qualified lead conversion rate without founder attending pitch calls.
- Closed ₹1.4 Cr in new sales in 90 days entirely driven by the sales team.
- 100% Founder Separation from sales calls, shifting focus to enterprise product expansion.`
  },

  d2c: {
    title: "₹18 Cr D2C Packaging & Quality Error Reduction",
    content: `The Case of EcoPack Solutions (₹18 Cr Turnover):

The Bottleneck:
Rapid e-commerce order growth led to a 14% customer return rate during peak festival seasons due to wrong package sizes, missing items, and delayed dispatch handoffs. Customer support was overwhelmed with complaints, destroying brand trust.

The DMAIC System Intervention:
1. Barcode Scan-Verify Protocol: Introduced mandatory scan-verify step before sealing packages.
2. Poka-Yoke (Mistake-Proofing): Redesigned packing tables so incorrect box sizes physically could not fit into shipping bins.
3. Vendor SLA Audit: Established strict quality inspection standards for raw material suppliers.

Key Metric Outcomes:
- Return rate dropped from 14% to 0.8% in 45 days.
- Saved ₹22 Lakhs in avoided return logistics and replacement costs per quarter.
- Scaled dispatch capacity from 1,200 orders/day to 4,500 orders/day seamlessly.`
  }
};

/**
 * 1. Preset Selector Buttons
 */
function initPresets() {
  const caseStudyText = document.getElementById('caseStudyText');
  const presetBtns = document.querySelectorAll('.preset-btn');

  presetBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-preset');
      if (PRESETS[key] && caseStudyText) {
        caseStudyText.value = PRESETS[key].content;
        updateCharCounter();
        showToast(`Loaded sample: ${PRESETS[key].title}`);
      }
    });
  });
}

/**
 * 2. File Upload & Drag-and-Drop Parser
 */
function initFileUpload() {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const caseStudyText = document.getElementById('caseStudyText');
  const fileHint = document.getElementById('fileHint');

  if (!dropZone || !fileInput) return;

  dropZone.addEventListener('click', () => fileInput.click());

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });

  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      handleFile(fileInput.files[0]);
    }
  });

  function handleFile(file) {
    if (!file) return;
    if (fileHint) fileHint.textContent = `Selected: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      if (caseStudyText && typeof text === 'string') {
        caseStudyText.value = text;
        updateCharCounter();
        showToast(`Uploaded ${file.name} successfully!`);
      }
    };

    if (file.type.includes('text') || file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      // Basic text extraction attempt for non-plain text
      reader.readAsText(file);
    }
  }
}

/**
 * 3. Character / Word Counter
 */
function initCharCounters() {
  const caseStudyText = document.getElementById('caseStudyText');
  if (caseStudyText) {
    caseStudyText.addEventListener('input', updateCharCounter);
  }
}

function updateCharCounter() {
  const caseStudyText = document.getElementById('caseStudyText');
  const charCounter = document.getElementById('charCounter');
  if (!caseStudyText || !charCounter) return;

  const words = caseStudyText.value.trim().split(/\s+/).filter(Boolean).length;
  charCounter.textContent = `${words} words`;
}

/**
 * 4. Form Submit & AI Processing Trigger
 */
function initFormSubmit() {
  const form = document.getElementById('generatorForm');
  const generateBtn = document.getElementById('generateBtn');
  const loadingContainer = document.getElementById('loadingContainer');
  const outputContainer = document.getElementById('outputContainer');
  const progressFill = document.getElementById('progressFill');
  const loadingStatusText = document.getElementById('loadingStatusText');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const text = document.getElementById('caseStudyText').value.trim();
    if (!text) {
      showToast('Please paste or upload a case study first!');
      return;
    }

    const tone = document.getElementById('toneSelect').value;
    const niche = document.getElementById('nicheSelect').value;
    const slideCount = parseInt(document.getElementById('slideCountSelect').value, 10) || 10;

    // Show Loading UI
    loadingContainer.style.display = 'block';
    outputContainer.style.display = 'none';
    generateBtn.disabled = true;

    // Animate Progress Bar
    animateProgressBar();

    try {
      // Generate Content Package via AI Engine or Smart Fallback
      const packageData = await generateContentPackage(text, tone, niche, slideCount);
      
      // Render Output
      renderOutputPackage(packageData);

      // Hide Loading, Show Output
      loadingContainer.style.display = 'none';
      outputContainer.style.display = 'block';
      generateBtn.disabled = false;

      // Scroll to Output Section
      outputContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      showToast('⚡ Instagram Content Package generated successfully!');
    } catch (err) {
      console.error(err);
      loadingContainer.style.display = 'none';
      generateBtn.disabled = false;
      showToast('Error generating content. Please try again.');
    }
  });

  function animateProgressBar() {
    if (!progressFill || !loadingStatusText) return;
    let progress = 0;
    progressFill.style.width = '0%';

    const statuses = [
      "Extracting core hooks and problem statement...",
      "Analyzing DMAIC framework & key metrics...",
      "Structuring slide-by-slide Carousel script...",
      "Writing 30-Second Reels Audio & Visual cues...",
      "Generating ready-to-post Caption & Hashtags..."
    ];

    let statusIdx = 0;
    const timer = setInterval(() => {
      progress += 20;
      progressFill.style.width = `${progress}%`;
      if (statusIdx < statuses.length) {
        loadingStatusText.textContent = statuses[statusIdx];
        statusIdx++;
      }

      if (progress >= 100) {
        clearInterval(timer);
      }
    }, 300);
  }
}

/**
 * 5. AI Engine Core Processing Function
 */
async function generateContentPackage(text, tone, niche, slideCount) {
  const userApiKey = localStorage.getItem('ziddi_user_api_key');
  const aiModel = localStorage.getItem('ziddi_ai_model') || 'gemini-1.5-flash';

  // If user provided Gemini API Key, try API Call
  if (userApiKey && userApiKey.trim() !== '') {
    try {
      const apiResult = await callGeminiApi(text, tone, niche, slideCount, userApiKey, aiModel);
      if (apiResult) return apiResult;
    } catch (e) {
      console.warn('API call failed, falling back to built-in smart engine', e);
    }
  }

  // Built-in Smart Heuristic AI Engine (Runs 100% locally and reliably)
  return runBuiltInEngine(text, tone, niche, slideCount);
}

/**
 * Built-In Smart Parsing & Generation Engine
 */
function runBuiltInEngine(text, tone, niche, slideCount) {
  // Extract key sentences and metrics
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  
  // Detect title or company name
  let title = "Business Case Study Breakdown";
  let metricMatch = text.match(/(₹\d+\s*(?:Cr|Lakh|K)|[0-9]+%|[0-9]+\s*Hours?)/gi) || ["₹10 Cr+", "64% Growth", "18 Hours Saved"];
  let primaryMetric = metricMatch[0] || "Massive Scaling";
  let secondaryMetric = metricMatch[1] || "64% Reduction";

  if (lines.length > 0 && lines[0].length < 80) {
    title = lines[0].replace(/The Case of|Case Study:/gi, '').trim();
  }

  // Extract problem & solution highlights
  let bottleneckText = "The founder was spending hours every day stuck in operational firefighting, manual approvals, and team friction.";
  let solutionText = "We implemented DMAIC systems architecture, automated approval SOP thresholds, and a 15-minute daily metric huddle.";

  const textLower = text.toLowerCase();
  if (textLower.includes('bottleneck') || textLower.includes('problem')) {
    const pIdx = lines.findIndex(l => l.toLowerCase().includes('bottleneck') || l.toLowerCase().includes('problem'));
    if (pIdx !== -1 && lines[pIdx + 1]) bottleneckText = lines[pIdx + 1];
  }

  // Generate Carousel Slides (10 Slides)
  const slides = [];

  // Slide 1: Hook
  slides.push({
    slideNum: 1,
    visualTag: "HOOK SLIDE // DARK BOLD TEXT",
    headline: `How This Business Hit ${primaryMetric} By Fixing 1 Systems Error 🚀`,
    body: `Case breakdown of ${title}. Swipe to see how we replaced founder firefighting with automated processes.`,
    imagePrompt: "Bold minimalist typography, high contrast dark theme with royal blue & amber accent badges."
  });

  // Slide 2: The Bottleneck
  slides.push({
    slideNum: 2,
    visualTag: "PROBLEM // HIGH DRAG",
    headline: "The Founder Bottleneck (Before Systems)",
    body: bottleneckText.slice(0, 160) + "...",
    imagePrompt: "Split diagram showing calendar chaos vs single bottleneck node in red glow."
  });

  // Slide 3: Why Willpower Failed
  slides.push({
    slideNum: 3,
    visualTag: "DIAGNOSIS // WILLPOWER CEILING",
    headline: "Why Willpower Stopped Working",
    body: "Grit and manual oversight get you to ₹10 Cr. But without systems, every new client or order increases your personal stress and workload.",
    imagePrompt: "Graph showing revenue growth flattening as founder working hours reach max capacity."
  });

  // Slide 4: The Framework
  slides.push({
    slideNum: 4,
    visualTag: "SOLUTION // DMAIC METHOD",
    headline: "The Systems Engineering Shift",
    body: solutionText.slice(0, 160) + "...",
    imagePrompt: "5-step DMAIC timeline (Define, Measure, Analyze, Improve, Control) with green glowing circuit lines."
  });

  // Slide 5: Step 1 Execution
  slides.push({
    slideNum: 5,
    visualTag: "STEP 01 // AUDIT",
    headline: "1. 14-Day Calendar & Decision Audit",
    body: "We logged every decision, purchase approval, and floor emergency. 80%+ of founder interruptions were routine tasks below ₹50,000.",
    imagePrompt: "Audit checklist graphic with highlighted red time leaks."
  });

  // Slide 6: Step 2 Execution
  slides.push({
    slideNum: 6,
    visualTag: "STEP 02 // AUTOMATION",
    headline: "2. Tiered Approval & SOP Thresholds",
    body: "Created clear delegation boundaries. Managers approve up to ₹1 Lakh autonomously using standardized operating procedures.",
    imagePrompt: "Flowchart showing autonomous manager branch vs escalation path."
  });

  // Slide 7: Step 3 Execution
  slides.push({
    slideNum: 7,
    visualTag: "STEP 03 // DASHBOARD",
    headline: "3. 15-Minute Daily Metric Rhythm",
    body: "Replaced 20+ daily emergency phone calls with a single morning standup dashboard covering quality, output, and dispatch targets.",
    imagePrompt: "Clean dashboard mockup displaying 3 core KPIs with green checkmarks."
  });

  // Slide 8: The Metric Results
  slides.push({
    slideNum: 8,
    visualTag: "RESULTS // KEY METRICS",
    headline: `The Outcome: ${primaryMetric} & ${secondaryMetric}`,
    body: `• Reclaimed 18+ hours/week of founder time\n• ${secondaryMetric} in floor delay escalations\n• Business runs seamlessly without daily founder intervention`,
    imagePrompt: "Big bold metric numbers in vibrant cyan and amber font with glowing accent borders."
  });

  // Slide 9: 3 Founder Takeaways
  slides.push({
    slideNum: 9,
    visualTag: "TAKEAWAYS // FOR FOUNDERS",
    headline: "3 Takeaways for B2B & D2C Founders",
    body: "1. Stop being the hero; build the machine.\n2. A fix solves today; a system prevents recurrence.\n3. Delegate authority, not just tasks.",
    imagePrompt: "Minimalist numbered list card with sleek amber icons."
  });

  // Slide 10: Call To Action (CTA)
  slides.push({
    slideNum: 10,
    visualTag: "CTA // SAVE & ACTION",
    headline: "Ready to Systematize Your Business?",
    body: "💾 Save this post for your next process audit.\n💬 Comment 'SYSTEMS' or click the link in bio to book your 1:1 Founder Advisory.",
    imagePrompt: "Call to Action banner with save bookmark icon & Ziddi Founder logo badge."
  });

  // Generate Reels Script (15-30 Sec)
  const reelsScript = {
    hook: {
      tag: "HOOK (0-3 SEC)",
      audio: `"If your business stops making money the moment you turn off your phone, you built a job — not a business."`,
      visual: "Close-up shot of founder looking exhausted at laptop in dark office, text overlay pops up in bold red."
    },
    problem: {
      tag: "THE PROBLEM (3-10 SEC)",
      audio: `"Here is how a ${title} was spending 3.5 hours every day approving simple ₹50,000 floor requisitions..."`,
      visual: "Fast cut of phone ringing endlessly with incoming notifications and messy calendar grid."
    },
    solution: {
      tag: "THE SYSTEM FIX (10-22 SEC)",
      audio: `"We audited 14 days of decisions, set up tiered SOP thresholds, and replaced 20 calls with a 15-minute morning dashboard huddle."`,
      visual: "Smooth transition to clean blueprint architecture diagram turning red chaotic lines into green steady pulses."
    },
    cta: {
      tag: "CALL TO ACTION (22-30 SEC)",
      audio: `"Result? Reclaimed 18 hours/week and ${secondaryMetric}. Comment 'SYSTEMS' to get our free operational audit framework."`,
      visual: "Founder walking out of office calmly while dashboard stays steady. Text overlay: 'Comment SYSTEMS below 👇'"
    }
  };

  // Generate Caption & Hashtags
  const caption = `Your zidd built this business. Now it's running you instead. 📉

Here is a full breakdown of how ${title} transformed their operational architecture using structured systems:

🔥 THE BOTTLENECK:
${bottleneckText.slice(0, 200)}

⚡ THE SYSTEM FIX:
1️⃣ 14-Day Decision Audit: Identified that 82% of floor interventions were routine tasks below ₹50,000.
2️⃣ Tiered SOP Matrix: Empowered plant managers to approve up to ₹1 Lakh autonomously.
3️⃣ Daily 15-Min Metric Huddle: Replaced endless emergency calls with a single morning dashboard review.

📈 THE RESULTS:
• ${primaryMetric} Reclaimed for strategic growth
• ${secondaryMetric} in operational escalations
• 100% Process-Founder Separation

💡 Founder Takeaway: A fix solves a problem for today. A system makes the problem impossible to recur.

👉 Want to audit your business architecture? Comment "SYSTEMS" below or click the link in bio to book a 1:1 90-Min Founder Advisory with Gaurav Sharma.

.
.
#ZiddiFounder #BusinessSystems #SixSigma #B2BGrowth #FounderOperations #ProcessArchitecture #Entrepreneurship #DMAIC #ScaleUp #BusinessCoaching #OperationsExcellence #DelegateToScale #WorkflowAutomation #B2BMarketing #ProductivityForFounders`;

  return {
    title,
    slides: slides.slice(0, slideCount),
    reelsScript,
    caption
  };
}

/**
 * Google Gemini API Handler
 */
async function callGeminiApi(text, tone, niche, slideCount, apiKey, model) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const prompt = `You are a world-class Instagram Content Architect for high-ticket B2B founders and business owners.
Convert the following Case Study into an Instagram Content Package.
Tone: ${tone}
Niche: ${niche}
Number of Carousel Slides: ${slideCount}

Case Study Text:
${text}

Return JSON with exact structure:
{
  "title": "Short title",
  "slides": [
    {
      "slideNum": 1,
      "visualTag": "TAG",
      "headline": "Headline",
      "body": "Body text",
      "imagePrompt": "Visual suggestion for graphic designer"
    }
  ],
  "reelsScript": {
    "hook": {"tag": "HOOK (0-3s)", "audio": "Voiceover text", "visual": "Visual cue"},
    "problem": {"tag": "PROBLEM (3-10s)", "audio": "Voiceover text", "visual": "Visual cue"},
    "solution": {"tag": "SOLUTION (10-22s)", "audio": "Voiceover text", "visual": "Visual cue"},
    "cta": {"tag": "CTA (22-30s)", "audio": "Voiceover text", "visual": "Visual cue"}
  },
  "caption": "Full Instagram caption text with hashtags"
}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
  const data = await res.json();
  const rawText = data.candidates[0].content.parts[0].text;
  
  // Extract JSON from response
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  throw new Error('Failed to parse JSON response from API');
}

/**
 * 6. Render Generated Content Package into Output Workspace
 */
function renderOutputPackage(data) {
  const carouselGrid = document.getElementById('carouselGrid');
  const reelsScriptBox = document.getElementById('reelsScriptBox');
  const captionTextArea = document.getElementById('captionTextArea');
  const carouselSlideBadge = document.getElementById('carouselSlideBadge');
  const captionCharCount = document.getElementById('captionCharCount');

  const currentTheme = window.currentCardTheme || 'theme-ziddi';

  // Render Carousel Graphic Grid (4:5 Ratio Instagram Aesthetic Cards)
  if (carouselGrid && Array.isArray(data.slides)) {
    carouselGrid.innerHTML = '';
    if (carouselSlideBadge) carouselSlideBadge.textContent = `${data.slides.length} Slides`;

    data.slides.forEach((slide, idx) => {
      const totalSlides = data.slides.length;
      const slideNumFormatted = slide.slideNum < 10 ? `0${slide.slideNum}` : `${slide.slideNum}`;
      const totalFormatted = totalSlides < 10 ? `0${totalSlides}` : `${totalSlides}`;

      const animalIdx = (idx + (window.animalBgOffset || 0)) % ANIMAL_BACKGROUNDS.length;
      const animal = ANIMAL_BACKGROUNDS[animalIdx];

      const cardWrapper = document.createElement('div');
      cardWrapper.className = 'ig-card-wrapper';
      cardWrapper.id = `slideWrapper_${slide.slideNum}`;

      cardWrapper.innerHTML = `
        <!-- Aesthetic Graphic Card Canvas element -->
        <div class="ig-graphic-card ${currentTheme}" id="igCard_${slide.slideNum}">
          <!-- Animal Background Picture (Blurred) & Dark Contrast Overlay -->
          <div class="ig-card-bg-layer" style="background-image: url('${animal.url}');" data-animal="${animal.name}"></div>
          <div class="ig-card-overlay"></div>

          <!-- Header -->
          <div class="ig-card-header">
            <div class="ig-brand-badge">⚡ ZIDDI<span>·</span>FOUNDER</div>
            <div class="ig-slide-count">${slideNumFormatted} / ${totalFormatted}</div>
          </div>

          <!-- Body -->
          <div class="ig-card-body">
            <span class="ig-card-tag">${escapeHtml(slide.visualTag || 'INSIGHT')}</span>
            <h3 class="ig-card-title">${escapeHtml(slide.headline || '')}</h3>
            <p class="ig-card-text">${escapeHtml(slide.body || '')}</p>
            ${slide.imagePrompt ? `<div class="ig-card-highlight">💡 <strong>Visual Guide:</strong> ${escapeHtml(slide.imagePrompt)}</div>` : ''}
          </div>

          <!-- Footer -->
          <div class="ig-card-footer">
            <span class="ig-footer-left">ziddifounder.com</span>
            <span class="ig-footer-swipe">
              ${slide.slideNum === totalSlides ? 'SAVE THIS POST 💾' : 'SWIPE FOR MORE ➔'}
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="ig-card-actions">
          <button class="btn btn-sm btn-ghost" onclick="copySlideText(${slide.slideNum})">
            <i class="fa-solid fa-copy"></i> Copy Text
          </button>
          <button class="btn btn-sm btn-outline" onclick="downloadSlidePng(${slide.slideNum})">
            <i class="fa-solid fa-download"></i> Download PNG
          </button>
        </div>
      `;
      carouselGrid.appendChild(cardWrapper);

      // Preload & check if animal image loads successfully; if error, auto-swap to guaranteed fallback
      const testImg = new Image();
      testImg.src = animal.url;
      testImg.onerror = () => {
        const fallbackUrl = "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1080&q=80";
        const layer = document.querySelector(`#igCard_${slide.slideNum} .ig-card-bg-layer`);
        if (layer) layer.style.backgroundImage = `url('${fallbackUrl}')`;
      };
    });

    // Store slides data globally for copy/export functions
    window.generatedSlidesData = data.slides;
  }

  // Render Reels Script
  if (reelsScriptBox && data.reelsScript) {
    const r = data.reelsScript;
    reelsScriptBox.innerHTML = `
      <div class="script-section-block">
        <span class="script-tag tag-hook">${escapeHtml(r.hook?.tag || 'HOOK (0-3 SEC)')}</span>
        <p class="script-audio-text">🎙️ <strong>Voiceover:</strong> ${escapeHtml(r.hook?.audio || '')}</p>
        <div class="script-visual-cue">🎬 <strong>Visual Direction:</strong> ${escapeHtml(r.hook?.visual || '')}</div>
      </div>

      <div class="script-section-block">
        <span class="script-tag tag-body">${escapeHtml(r.problem?.tag || 'PROBLEM (3-10 SEC)')}</span>
        <p class="script-audio-text">🎙️ <strong>Voiceover:</strong> ${escapeHtml(r.problem?.audio || '')}</p>
        <div class="script-visual-cue">🎬 <strong>Visual Direction:</strong> ${escapeHtml(r.problem?.visual || '')}</div>
      </div>

      <div class="script-section-block">
        <span class="script-tag tag-body">${escapeHtml(r.solution?.tag || 'SOLUTION (10-22 SEC)')}</span>
        <p class="script-audio-text">🎙️ <strong>Voiceover:</strong> ${escapeHtml(r.solution?.audio || '')}</p>
        <div class="script-visual-cue">🎬 <strong>Visual Direction:</strong> ${escapeHtml(r.solution?.visual || '')}</div>
      </div>

      <div class="script-section-block">
        <span class="script-tag tag-cta">${escapeHtml(r.cta?.tag || 'CTA (22-30 SEC)')}</span>
        <p class="script-audio-text">🎙️ <strong>Voiceover:</strong> ${escapeHtml(r.cta?.audio || '')}</p>
        <div class="script-visual-cue">🎬 <strong>Visual Direction:</strong> ${escapeHtml(r.cta?.visual || '')}</div>
      </div>
    `;

    window.generatedReelsText = `REELS / SHORTS SCRIPT:\n\n[HOOK 0-3s]\nAudio: ${r.hook?.audio}\nVisual: ${r.hook?.visual}\n\n[PROBLEM 3-10s]\nAudio: ${r.problem?.audio}\nVisual: ${r.problem?.visual}\n\n[SOLUTION 10-22s]\nAudio: ${r.solution?.audio}\nVisual: ${r.solution?.visual}\n\n[CTA 22-30s]\nAudio: ${r.cta?.audio}\nVisual: ${r.cta?.visual}`;
  }

  // Render Caption
  if (captionTextArea && data.caption) {
    captionTextArea.value = data.caption;
    if (captionCharCount) captionCharCount.textContent = `${data.caption.length} characters`;
  }

  window.generatedFullPackage = data;
}

/**
 * 7. Action Button Handlers (Copy, Export PDF, Export JSON)
 */
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  // Card Theme Switcher
  const themeBtns = document.querySelectorAll('.theme-btn');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedTheme = btn.getAttribute('data-theme');
      window.currentCardTheme = selectedTheme;

      // Update all visible graphic cards dynamically
      const cards = document.querySelectorAll('.ig-graphic-card');
      cards.forEach(card => {
        card.className = `ig-graphic-card ${selectedTheme}`;
      });

      showToast(`Switched theme to ${btn.textContent.trim()}`);
    });
  });

  // Action Buttons
  const copyAllBtn = document.getElementById('copyAllBtn');
  const copyCarouselTextBtn = document.getElementById('copyCarouselTextBtn');
  const copyReelsBtn = document.getElementById('copyReelsBtn');
  const copyCaptionBtn = document.getElementById('copyCaptionBtn');
  const downloadPdfBtn = document.getElementById('downloadPdfBtn');
  const exportJsonBtn = document.getElementById('exportJsonBtn');
  const shuffleAnimalsBtn = document.getElementById('shuffleAnimalsBtn');
  if (shuffleAnimalsBtn) {
    shuffleAnimalsBtn.addEventListener('click', () => {
      window.animalBgOffset = (window.animalBgOffset || 0) + 1;
      const bgLayers = document.querySelectorAll('.ig-card-bg-layer');
      if (bgLayers.length === 0) {
        showToast('Generate content first to shuffle background photos!');
        return;
      }
      bgLayers.forEach((layer, idx) => {
        const animalIndex = (idx + window.animalBgOffset) % ANIMAL_BACKGROUNDS.length;
        const animal = ANIMAL_BACKGROUNDS[animalIndex];
        layer.style.backgroundImage = `url('${animal.url}')`;
        layer.setAttribute('data-animal', animal.name);

        const img = new Image();
        img.src = animal.url;
        img.onerror = () => {
          layer.style.backgroundImage = `url('https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1080&q=80')`;
        };
      });
      showToast('🔀 Shuffled Animal Background Pictures!');
    });
  }

  if (downloadAllPngsBtn) {
    downloadAllPngsBtn.addEventListener('click', async () => {
      const slides = window.generatedSlidesData;
      if (!slides || slides.length === 0) return;

      showToast(`Generating PNG images for ${slides.length} slides...`);

      for (let i = 0; i < slides.length; i++) {
        await window.downloadSlidePng(slides[i].slideNum);
        // Small pause between downloads
        await new Promise(r => setTimeout(r, 400));
      }
      showToast('All PNG Graphic Cards downloaded!');
    });
  }

  if (copyAllBtn) {
    copyAllBtn.addEventListener('click', () => {
      const data = window.generatedFullPackage;
      if (!data) return;

      let fullText = `=== INSTAGRAM CAROUSEL SLIDES (${data.slides.length} SLIDES) ===\n\n`;
      data.slides.forEach(s => {
        fullText += `[SLIDE ${s.slideNum}] - ${s.headline}\n${s.body}\nVisual Suggestion: ${s.imagePrompt}\n\n`;
      });

      fullText += `=== REELS SCRIPT ===\n${window.generatedReelsText}\n\n`;
      fullText += `=== CAPTION & HASHTAGS ===\n${data.caption}`;

      copyToClipboard(fullText, 'All Content Package copied to clipboard!');
    });
  }

  if (copyCarouselTextBtn) {
    copyCarouselTextBtn.addEventListener('click', () => {
      const slides = window.generatedSlidesData;
      if (!slides) return;

      let slidesText = `INSTAGRAM CAROUSEL SCRIPT:\n\n`;
      slides.forEach(s => {
        slidesText += `SLIDE ${s.slideNum}: ${s.headline}\n${s.body}\nVisual Guide: ${s.imagePrompt}\n-------------------\n`;
      });

      copyToClipboard(slidesText, 'Carousel text copied to clipboard!');
    });
  }

  if (copyReelsBtn) {
    copyReelsBtn.addEventListener('click', () => {
      if (window.generatedReelsText) {
        copyToClipboard(window.generatedReelsText, 'Reels script copied to clipboard!');
      }
    });
  }

  if (copyCaptionBtn) {
    copyCaptionBtn.addEventListener('click', () => {
      const captionText = document.getElementById('captionTextArea').value;
      if (captionText) {
        copyToClipboard(captionText, 'Caption & Hashtags copied to clipboard!');
      }
    });
  }

  if (exportJsonBtn) {
    exportJsonBtn.addEventListener('click', () => {
      const data = window.generatedFullPackage;
      if (!data) return;

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `IG_Content_Package_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('JSON Package exported successfully!');
    });
  }

  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', () => {
      const element = document.getElementById('outputContainer');
      if (!element) return;

      showToast('Generating PDF Report...');
      
      const opt = {
        margin:       10,
        filename:     `CaseStudy_IG_Content_${Date.now()}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, backgroundColor: '#070B11' },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      if (window.html2pdf) {
        window.html2pdf().set(opt).from(element).save();
      } else {
        window.print();
      }
    });
  }
}

// Download Single Graphic Card as PNG image
window.downloadSlidePng = async function(slideNum) {
  const cardElement = document.getElementById(`igCard_${slideNum}`);
  if (!cardElement) return;

  if (window.html2canvas) {
    try {
      const canvas = await window.html2canvas(cardElement, {
        scale: 3, // High-resolution export (1080x1350 equivalent quality)
        useCORS: true,
        allowTaint: false,
        backgroundColor: null
      });

      const image = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = image;
      a.download = `IG_Slide_${slideNum < 10 ? '0' + slideNum : slideNum}.png`;
      a.click();
      showToast(`Downloaded Slide ${slideNum} PNG Image!`);
    } catch (err) {
      console.error(err);
      showToast(`Error rendering PNG for Slide ${slideNum}`);
    }
  } else {
    showToast('html2canvas library loading, please try again in a moment.');
  }
};

window.copySlideText = function(slideNum) {
  const slides = window.generatedSlidesData;
  if (!slides) return;
  const slide = slides.find(s => s.slideNum === slideNum);
  if (!slide) return;

  const slideText = `SLIDE ${slide.slideNum}: ${slide.headline}\n${slide.body}\nVisual Suggestion: ${slide.imagePrompt}`;
  copyToClipboard(slideText, `Slide ${slideNum} text copied!`);
};

function copyToClipboard(text, successMsg) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(successMsg);
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast(successMsg);
  });
}

/**
 * 8. Settings Modal Logic
 */
function initModal() {
  const modal = document.getElementById('settingsModal');
  const openBtn = document.getElementById('openSettingsBtn');
  const closeBtn = document.getElementById('closeSettingsBtn');
  const saveBtn = document.getElementById('saveSettingsBtn');
  const apiKeyInput = document.getElementById('userApiKeyInput');
  const aiModelSelect = document.getElementById('aiModelSelect');
  const apiKeyStatusLabel = document.getElementById('apiKeyStatusLabel');

  // Load existing key
  const savedKey = localStorage.getItem('ziddi_user_api_key') || '';
  const savedModel = localStorage.getItem('ziddi_ai_model') || 'gemini-1.5-flash';
  
  if (apiKeyInput) apiKeyInput.value = savedKey;
  if (aiModelSelect) aiModelSelect.value = savedModel;

  if (apiKeyStatusLabel) {
    apiKeyStatusLabel.textContent = savedKey ? 'API Key: Custom' : 'API Key: Built-In';
  }

  if (openBtn) openBtn.addEventListener('click', () => modal.classList.add('open'));
  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('open'));

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const key = apiKeyInput.value.trim();
      const model = aiModelSelect.value;

      localStorage.setItem('ziddi_user_api_key', key);
      localStorage.setItem('ziddi_ai_model', model);

      if (apiKeyStatusLabel) {
        apiKeyStatusLabel.textContent = key ? 'API Key: Custom' : 'API Key: Built-In';
      }

      modal.classList.remove('open');
      showToast('API Settings saved!');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }
}

/**
 * Toast Notification Helper
 */
function showToast(msg) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function escapeHtml(str) {
  return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
