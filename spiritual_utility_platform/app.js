/**
 * app.js - Main Application State and Logic
 * Author: Antigravity Team
 * 
 * Manages the state, tabs, Jaap counter mechanics, Canvas card generation,
 * B2C soft-remarketing triggers, B2B white-label updates, and WhatsApp push simulation.
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. STATE & GLOBAL CONFIGURATION
    // -------------------------------------------------------------
    const state = {
        activeTab: 'panchang',
        coords: { lat: 28.6139, lng: 77.2090, name: "New Delhi" },
        timezoneOffset: 5.5,
        
        // Jaap Counter
        jaapCount: 0,
        jaapTarget: 108,
        completedMalas: 0,
        selectedMantra: "ॐ नमः शिवाय (Om Namah Shivaya)",
        soundEnabled: true,
        vibrateEnabled: true,
        
        // Sankalp Tracker
        sankalp: {
            title: "Mahamrityunjaya Mantra Sankalp",
            current: 0,
            target: 11000
        },
        
        // B2B White-Labeling
        whiteLabel: {
            enabled: false,
            panditName: "Acharya Sharma",
            templeName: "Dharma Sewa Sansthan",
            logoLetter: "A"
        },
        
        // UI Quotes List
        quotes: [
            { shlok: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।", translation: "कर्म पर ही तुम्हारा अधिकार है, फल पर नहीं।" },
            { shlok: "यतो धर्मस्ततो जयः।", translation: "जहाँ धर्म है, वहीं विजय है।" },
            { shlok: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्।", translation: "हम त्रि-नेत्रधारी शिव की पूजा करते हैं जो जीवन शक्ति बढ़ाते हैं।" },
            { shlok: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनंजय।", translation: "आसक्ति का त्याग कर समत्व बुद्धि से अपने कर्तव्य कर्म करो।" }
        ],
        activeQuoteIndex: 0
    };

    // -------------------------------------------------------------
    // 2. DOM ELEMENT CACHING
    // -------------------------------------------------------------
    const elements = {
        // Tab Navigation
        navItems: document.querySelectorAll('.nav-item'),
        tabContents: document.querySelectorAll('.tab-content'),
        
        // Location Selector
        citySelector: document.getElementById('citySelect'),
        gpsButton: document.getElementById('gpsBtn'),
        locationDisplay: document.getElementById('activeLocationName'),
        
        // Panchang Fields
        tithiVal: document.getElementById('tithiVal'),
        nakshatraVal: document.getElementById('nakshatraVal'),
        deityVal: document.getElementById('deityVal'),
        sunriseVal: document.getElementById('sunriseVal'),
        sunsetVal: document.getElementById('sunsetVal'),
        rahuKaalTime: document.getElementById('rahuKaalTime'),
        rahuKaalBanner: document.getElementById('rahuKaalBanner'),
        muhuratVal: document.getElementById('muhuratVal'),
        choghadiyaTimeline: document.getElementById('choghadiyaTimeline'),
        choghadiyaModeBtns: document.querySelectorAll('.choghadiya-toggle button'),
        
        // Jaap Counter
        jaapSelector: document.getElementById('jaapMantraSelect'),
        jaapRing: document.getElementById('jaapRing'),
        jaapCircleProgress: document.getElementById('progressCircle'),
        jaapBeadVisual: document.getElementById('jaapBeadVisual'),
        countDisplay: document.getElementById('jaapCountDisplay'),
        targetDisplay: document.getElementById('jaapTargetDisplay'),
        malaDisplay: document.getElementById('malaCountDisplay'),
        resetJaapBtn: document.getElementById('resetJaapBtn'),
        soundToggleBtn: document.getElementById('soundToggleBtn'),
        vibrateToggleBtn: document.getElementById('vibrateToggleBtn'),
        
        // Sankalp Tracker
        sankalpTitle: document.getElementById('sankalpTitle'),
        sankalpSubtitle: document.getElementById('sankalpSubtitle'),
        sankalpCurrentDisplay: document.getElementById('sankalpCurrent'),
        sankalpTargetDisplay: document.getElementById('sankalpTarget'),
        sankalpPercentDisplay: document.getElementById('sankalpPercent'),
        sankalpProgressBar: document.getElementById('sankalpProgressBar'),
        sankalpInputTitle: document.getElementById('sankalpInputTitle'),
        sankalpInputTarget: document.getElementById('sankalpInputTarget'),
        sankalpUpdateBtn: document.getElementById('sankalpUpdateBtn'),
        sankalpResetBtn: document.getElementById('sankalpResetBtn'),
        
        // Share / Media Generator
        canvas: document.getElementById('statusCanvas'),
        downloadCardBtn: document.getElementById('downloadCardBtn'),
        whatsappShareBtn: document.getElementById('whatsappShareBtn'),
        
        // B2C Remarketing Card
        remarketingCard: document.getElementById('remarketingCard'),
        remarketingIcon: document.getElementById('remarketingIcon'),
        remarketingTag: document.getElementById('remarketingTag'),
        remarketingText: document.getElementById('remarketingText'),
        remarketingLink: document.getElementById('remarketingLink'),
        
        // B2B White Label Form
        b2bEnabledToggle: document.getElementById('b2bEnabledToggle'),
        b2bPanditName: document.getElementById('b2bPanditName'),
        b2bTempleName: document.getElementById('b2bTempleName'),
        b2bPreviewLogo: document.getElementById('b2bPreviewLogo'),
        b2bPreviewName: document.getElementById('b2bPreviewName'),
        b2bPreviewTemple: document.getElementById('b2bPreviewTemple'),
        b2bSaveBtn: document.getElementById('b2bSaveBtn'),
        b2bCopyLinkBtn: document.getElementById('b2bCopyLinkBtn'),
        
        // WhatsApp Simulator Drawer
        whatsappSimBtn: document.getElementById('whatsappSimBtn'),
        whatsappDrawer: document.getElementById('whatsappDrawer'),
        closeDrawerBtn: document.getElementById('closeDrawerBtn'),
        whatsappFeed: document.getElementById('whatsappFeed')
    };

    // Initialize Web Audio context for bell sound
    let audioCtx = null;
    function playBeadSound(frequency = 600, duration = 0.05, type = 'sine') {
        if (!state.soundEnabled) return;
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = type;
            osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
            
            // Sound envelope
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            console.error("Audio playback error", e);
        }
    }

    function playBellSound() {
        if (!state.soundEnabled) return;
        // Synthesize temple bell sound with multiple harmonics
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioCtx.currentTime;
            const harmonics = [440, 554, 659, 880]; // Major chord structure
            
            harmonics.forEach((freq, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now);
                
                gain.gain.setValueAtTime(0.1 / (idx + 1), now);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5 - idx * 0.2);
                
                osc.start(now);
                osc.stop(now + 1.5 - idx * 0.2);
            });
        } catch (e) {
            console.error("Bell audio playback error", e);
        }
    }

    // -------------------------------------------------------------
    // 3. TAB CONTROLLER
    // -------------------------------------------------------------
    function switchTab(tabId) {
        state.activeTab = tabId;
        
        elements.navItems.forEach(item => {
            if (item.dataset.tab === tabId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        elements.tabContents.forEach(content => {
            if (content.id === `${tabId}Tab`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        // Trigger Canvas updates when entering the Share tab
        if (tabId === 'share') {
            generateShareCard();
        }
        
        // Refresh Panchang details on load
        if (tabId === 'panchang') {
            renderPanchang();
        }
    }

    elements.navItems.forEach(item => {
        item.addEventListener('click', () => {
            switchTab(item.dataset.tab);
        });
    });

    // -------------------------------------------------------------
    // 4. PANCHANG RENDERING ENGINE
    // -------------------------------------------------------------
    let activeChoghadiyaMode = 'day'; // 'day' or 'night'

    function renderPanchang() {
        if (typeof window.PanchangEngine === 'undefined') return;
        
        const now = new Date();
        const pData = window.PanchangEngine.getPanchang(now, state.coords.lat, state.coords.lng, state.timezoneOffset);
        
        // Update basic displays
        elements.locationDisplay.textContent = state.coords.name;
        elements.sunriseVal.textContent = pData.sunrise + " AM";
        elements.sunsetVal.textContent = pData.sunset + " PM";
        elements.tithiVal.textContent = pData.tithi;
        elements.nakshatraVal.textContent = pData.nakshatra;
        elements.deityVal.textContent = pData.deity;
        elements.rahuKaalTime.textContent = pData.rahuKaal;
        elements.muhuratVal.textContent = pData.shubhMuhurat;

        // Rahu Kaal Warning Active State
        if (pData.isRahuKaalActive) {
            elements.rahuKaalBanner.classList.add('active');
            elements.rahuKaalBanner.querySelector('.rahu-badge').textContent = "ACTIVE NOW";
        } else {
            elements.rahuKaalBanner.classList.remove('active');
            elements.rahuKaalBanner.querySelector('.rahu-badge').textContent = "Inauspicious";
        }

        // Choghadiya List Rendering
        renderChoghadiyaTimeline(pData.choghadiya, pData.activeChoghadiya);
        
        // Trigger B2C Soft-Remarketing based on Panchang values
        triggerB2CMonetization(pData, now);
    }

    function renderChoghadiyaTimeline(choghadiyaList, activeItem) {
        elements.choghadiyaTimeline.innerHTML = '';
        
        // Filter choghadiyas based on active mode (Day vs Night)
        const isNightTab = activeChoghadiyaMode === 'night';
        const filtered = choghadiyaList.filter(item => item.isNight === isNightTab);
        
        filtered.forEach(item => {
            const row = document.createElement('div');
            row.className = 'timeline-item';
            
            // Check if active now
            const isActive = activeItem && activeItem.name === item.name && activeItem.isNight === item.isNight && activeItem.start === item.start;
            if (isActive) {
                row.classList.add('active');
            }
            
            row.innerHTML = `
                <div class="time-range">${item.start} - ${item.end}</div>
                <div class="choghadiya-details">
                    <span class="choghadiya-name">${item.name}</span>
                    <span class="choghadiya-status ${item.status}">${item.status.toUpperCase()}</span>
                </div>
            `;
            elements.choghadiyaTimeline.appendChild(row);
        });
    }

    elements.choghadiyaModeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.choghadiyaModeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeChoghadiyaMode = btn.dataset.mode;
            
            const now = new Date();
            const pData = window.PanchangEngine.getPanchang(now, state.coords.lat, state.coords.lng, state.timezoneOffset);
            renderChoghadiyaTimeline(pData.choghadiya, pData.activeChoghadiya);
        });
    });

    // Handle City Selector changes
    elements.citySelector.addEventListener('change', (e) => {
        const cityName = e.target.value;
        const cityData = window.PanchangEngine.CITIES.find(c => c.name === cityName);
        if (cityData) {
            state.coords = { lat: cityData.lat, lng: cityData.lng, name: cityData.name };
            renderPanchang();
            // Automatically push alert to simulated notifications
            sendSimulatedWhatsAppAlert("Location Update", `📍 Location changed to *${cityData.name}*. Today's Rahu Kaal, Sunrise, and Shubh Muhurats have been updated.`);
        }
    });

    // Handle GPS trigger
    elements.gpsButton.addEventListener('click', () => {
        if (navigator.geolocation) {
            elements.gpsButton.textContent = "⏳...";
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    elements.gpsButton.textContent = "🛰️ GPS";
                    state.coords = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        name: "Live Coordinates"
                    };
                    // Update dropdown display
                    const customOpt = document.createElement('option');
                    customOpt.value = "GPS";
                    customOpt.textContent = "📡 GPS Position";
                    customOpt.selected = true;
                    elements.citySelector.appendChild(customOpt);
                    
                    renderPanchang();
                    sendSimulatedWhatsAppAlert("Location Update", `🛰️ Dynamic location fetched via GPS. Coordinates synced. Panchang refreshed.`);
                },
                (err) => {
                    elements.gpsButton.textContent = "🛰️ GPS";
                    alert("GPS permissions denied. Falling back to default.");
                }
            );
        } else {
            alert("Geolocation not supported by this browser.");
        }
    });

    // -------------------------------------------------------------
    // 5. B2C SOFT-REMARKETING AUTOMATION
    // -------------------------------------------------------------
    function triggerB2CMonetization(panchangData, currentDate) {
        // Contextual values mapping based on day metrics
        const deity = panchangData.deity.toLowerCase();
        
        let pitch = {
            icon: "🪔",
            tag: "Certified Devotional Purity",
            text: "आज की पूजा के लिए शत-प्रतिशत शुद्ध, रसायनों से रहित पारंपरिक धूप एवं पीतल सामग्री का ही उपयोग करें।",
            link: "#pure-dhoop-kit",
            label: "शुद्ध धूप किट देखें →"
        };

        if (deity.includes("shiva")) {
            pitch = {
                icon: "🔱",
                tag: "Shivratri Special",
                text: "भगवान शिव की उपासना हेतु विशेष रूप से वैदिक पद्धति से तैयार पंचगव्य हवन सामग्री किट प्राप्त करें।",
                link: "#pure-shiva-kit",
                label: "शिव पूजा किट देखें →"
            };
        } else if (deity.includes("ganesha")) {
            pitch = {
                icon: "🐘",
                tag: "Ganesh Purity Kit",
                text: "गणपति पूजन में सर्वकल्याण हेतु प्रामाणिक अष्टगंध और शुद्ध केसर चंदन का उपयोग करें।",
                link: "#pure-ganesh-kit",
                label: "चंदन एवं केसर सामग्री देखें →"
            };
        } else if (panchangData.isRahuKaalActive) {
            pitch = {
                icon: "🛡️",
                tag: "Rahu Kaal Protection",
                text: "राहुकाल के अशुभ प्रभावों को दूर करने हेतु घर में शत-प्रतिशत शुद्ध भीमसेनी कपूर प्रज्वलित करें।",
                link: "#pure-camphor-kit",
                label: "शुद्ध भीमसेनी कपूर देखें →"
            };
        }

        // Render Pitch Card
        elements.remarketingIcon.textContent = pitch.icon;
        elements.remarketingTag.textContent = pitch.tag;
        elements.remarketingText.textContent = pitch.text;
        elements.remarketingLink.href = pitch.link;
        elements.remarketingLink.innerHTML = `${pitch.label} <span style="font-size: 10px;">🛡️ Certified Purity</span>`;
    }

    // -------------------------------------------------------------
    // 6. JAAP COUNTER LOGIC
    // -------------------------------------------------------------
    // Progress ring calculations
    const strokeRadius = 110;
    const strokeCircumference = 2 * Math.PI * strokeRadius;
    
    function setJaapProgress(percent) {
        const offset = strokeCircumference - (percent / 100) * strokeCircumference;
        elements.jaapCircleProgress.style.strokeDashoffset = offset;
    }

    elements.jaapSelector.addEventListener('change', (e) => {
        state.selectedMantra = e.target.value;
        sendSimulatedWhatsAppAlert("Mantra Changed", `📿 You have selected a new mantra for Jaap: *${state.selectedMantra}*. Your counts have been refreshed.`);
    });

    elements.jaapRing.addEventListener('click', (e) => {
        // Trigger haptic ripple effect
        const rect = elements.jaapRing.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.className = 'tap-ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        elements.jaapRing.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);

        // Core increment calculations
        state.jaapCount++;
        state.sankalp.current++;
        
        // Haptic feedback
        if (state.vibrateEnabled && navigator.vibrate) {
            navigator.vibrate(30);
        }
        
        // Trigger bead rotate
        const rotationAngle = (state.jaapCount * (360 / 108)) % 360;
        elements.jaapBeadVisual.style.transform = `rotate(${rotationAngle}deg)`;

        // Check targets & Mala completion
        const percentage = (state.jaapCount / state.jaapTarget) * 100;
        
        if (state.jaapCount >= state.jaapTarget) {
            state.completedMalas++;
            state.jaapCount = 0;
            
            // Highlight vibration & sound on completion
            if (state.vibrateEnabled && navigator.vibrate) {
                navigator.vibrate([100, 50, 100, 50, 150]);
            }
            playBellSound();
            
            // Send automated WhatsApp progress notification
            sendSimulatedWhatsAppAlert(
                "Mala Completed! 🎉", 
                `📿 जय श्री राम! आपकी *1 माला (108 जाप)* पूर्ण हो चुकी है।\n\n🎯 *संकल्प प्रगति:* ${state.sankalp.current}/${state.sankalp.target} मंत्र पूरे।\n🚩 आपकी साधना निर्विघ्न चलती रहे!`
            );
            
            setJaapProgress(0);
        } else {
            playBeadSound(600 + (state.jaapCount * 2), 0.05, 'triangle');
            setJaapProgress(percentage);
        }

        updateJaapUI();
        updateSankalpUI();
    });

    function updateJaapUI() {
        elements.countDisplay.textContent = state.jaapCount;
        elements.targetDisplay.textContent = state.jaapTarget;
        elements.malaDisplay.textContent = state.completedMalas;
    }

    elements.resetJaapBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm("क्या आप जाप काउंटर रीसेट करना चाहते हैं?")) {
            state.jaapCount = 0;
            state.completedMalas = 0;
            setJaapProgress(0);
            updateJaapUI();
            playBeadSound(300, 0.2, 'sawtooth');
        }
    });

    elements.soundToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        state.soundEnabled = !state.soundEnabled;
        elements.soundToggleBtn.innerHTML = state.soundEnabled ? '🔊 Sound: On' : '🔇 Sound: Off';
        elements.soundToggleBtn.classList.toggle('accent', state.soundEnabled);
    });

    elements.vibrateToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        state.vibrateEnabled = !state.vibrateEnabled;
        elements.vibrateToggleBtn.innerHTML = state.vibrateEnabled ? '📳 Vibrate: On' : '📳 Vibrate: Off';
        elements.vibrateToggleBtn.classList.toggle('accent', state.vibrateEnabled);
    });

    // -------------------------------------------------------------
    // 7. SANKALP TRACKER
    // -------------------------------------------------------------
    function updateSankalpUI() {
        const pct = Math.min((state.sankalp.current / state.sankalp.target) * 100, 100).toFixed(1);
        
        elements.sankalpTitle.textContent = state.sankalp.title;
        elements.sankalpSubtitle.textContent = `Daily meditation milestone logs & alerts`;
        elements.sankalpCurrentDisplay.textContent = state.sankalp.current.toLocaleString();
        elements.sankalpTargetDisplay.textContent = state.sankalp.target.toLocaleString();
        elements.sankalpPercentDisplay.textContent = `${pct}%`;
        elements.sankalpProgressBar.style.width = `${pct}%`;
    }

    elements.sankalpUpdateBtn.addEventListener('click', () => {
        const newTitle = elements.sankalpInputTitle.value.trim();
        const newTarget = parseInt(elements.sankalpInputTarget.value, 10);
        
        if (newTitle) state.sankalp.title = newTitle;
        if (!isNaN(newTarget) && newTarget > 0) {
            state.sankalp.target = newTarget;
            state.sankalp.current = 0; // reset for new milestone
        }
        
        updateSankalpUI();
        alert("संकल्प अपडेट कर दिया गया है!");
        sendSimulatedWhatsAppAlert("Sankalp Updated", `🚩 New religious milestone started: *"${state.sankalp.title}"* with a target of *${state.sankalp.target}* chants.`);
    });

    if (elements.sankalpResetBtn) {
        elements.sankalpResetBtn.addEventListener('click', () => {
            if (confirm("क्या आप वर्तमान संकल्प काउंटर (Current Count) को 0 करना चाहते हैं?")) {
                state.sankalp.current = 0;
                updateSankalpUI();
                sendSimulatedWhatsAppAlert("Sankalp Reset", `🔄 Sankalp count reset to 0 for: *"${state.sankalp.title}"*. Ready for fresh counting.`);
            }
        });
    }

    // -------------------------------------------------------------
    // 8. VERNACULAR MEDIA STATUS CARD GENERATOR (CANVAS ENGINE)
    // -------------------------------------------------------------
    // Polyfill for CanvasRenderingContext2D.roundRect for cross-device compatibility
    if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
        CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, radii) {
            let r = typeof radii === 'number' ? radii : (Array.isArray(radii) ? radii[0] : 10);
            if (w < 2 * r) r = w / 2;
            if (h < 2 * r) r = h / 2;
            this.beginPath();
            this.moveTo(x + r, y);
            this.arcTo(x + w, y, x + w, y + h, r);
            this.arcTo(x + w, y + h, x, y + h, r);
            this.arcTo(x, y + h, x, y, r);
            this.arcTo(x, y, x + w, y, r);
            this.closePath();
            return this;
        };
    }

    // Theme Wallpaper Preloading Cache
    const themeBgImages = {
        shiva: new Image(),
        ram: new Image(),
        hanuman: new Image()
    };
    themeBgImages.shiva.src = 'assets/shiva_bg.png';
    themeBgImages.ram.src = 'assets/ram_bg.png';
    themeBgImages.hanuman.src = 'assets/hanuman_bg.png';

    Object.values(themeBgImages).forEach(img => {
        img.onload = () => { if (elements.canvas) generateShareCard(); };
    });

    function generateShareCard() {
        const ctx = elements.canvas.getContext('2d');
        if (!ctx) return;

        const width = 1080;
        const height = 1920;
        elements.canvas.width = width;
        elements.canvas.height = height;

        // 1. Draw Active Theme Background Wallpaper or Sunset Gradient
        const activeTheme = state.posterTheme || 'shiva';
        const activeThemeImg = themeBgImages[activeTheme];

        if (activeThemeImg && activeThemeImg.complete && activeThemeImg.naturalWidth > 0 && activeTheme !== 'gold') {
            ctx.drawImage(activeThemeImg, 0, 0, width, height);

            // Overlay Dark Semi-Transparent Vignette for High Text Legibility & Contrast
            const overlayGrad = ctx.createLinearGradient(0, 0, 0, height);
            overlayGrad.addColorStop(0, 'rgba(10, 8, 18, 0.78)');
            overlayGrad.addColorStop(0.25, 'rgba(15, 10, 25, 0.65)');
            overlayGrad.addColorStop(0.65, 'rgba(25, 10, 15, 0.72)');
            overlayGrad.addColorStop(1, 'rgba(10, 5, 12, 0.94)');
            ctx.fillStyle = overlayGrad;
            ctx.fillRect(0, 0, width, height);
        } else {
            // Default Saffron Sunset Linear Gradient
            const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
            bgGrad.addColorStop(0, '#0a0812');
            bgGrad.addColorStop(0.25, '#280c05');
            bgGrad.addColorStop(0.65, '#5e1b04');
            bgGrad.addColorStop(1, '#c0392b');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);
        }

        // 2. Outer Decorative Gold Borders
        ctx.strokeStyle = 'rgba(241, 196, 15, 0.45)';
        ctx.lineWidth = 14;
        ctx.strokeRect(30, 30, width - 60, height - 60);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 3;
        ctx.strokeRect(52, 52, width - 104, height - 104);

        // 3. Dynamic White Label Top Branding + Custom Photo Layer
        if (state.whiteLabel.enabled || state.userPhotoImg) {
            // Gold Badge Container Background
            ctx.fillStyle = 'rgba(241, 196, 15, 0.12)';
            ctx.strokeStyle = 'rgba(241, 196, 15, 0.35)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(100, 90, width - 200, 190, 24);
            ctx.fill();
            ctx.stroke();

            if (state.userPhotoImg) {
                // Render Custom Circular Photo Avatar with Glowing Gold Border
                ctx.save();
                const avatarX = 190;
                const avatarY = 185;
                const avatarR = 65;

                // Outer Gold Glow Ring
                ctx.beginPath();
                ctx.arc(avatarX, avatarY, avatarR + 5, 0, Math.PI * 2);
                ctx.fillStyle = '#f1c40f';
                ctx.shadowColor = 'rgba(241, 196, 15, 0.8)';
                ctx.shadowBlur = 15;
                ctx.fill();
                ctx.shadowBlur = 0;

                // Clip Circle for Photo
                ctx.beginPath();
                ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(state.userPhotoImg, avatarX - avatarR, avatarY - avatarR, avatarR * 2, avatarR * 2);
                ctx.restore();

                // Text aligned to the right of custom photo
                ctx.textAlign = 'left';
                ctx.fillStyle = '#f1c40f';
                ctx.font = 'bold 26px "Outfit", sans-serif';
                ctx.fillText('🚩 अधिकृत डिजिटल यूटिलिटी पोर्टल', 280, 140);

                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 44px "Outfit", sans-serif';
                ctx.fillText(state.whiteLabel.panditName || 'Acharya Devrat', 280, 195);

                ctx.fillStyle = '#e67e22';
                ctx.font = '500 28px "Outfit", sans-serif';
                ctx.fillText(`🛕 ${state.whiteLabel.templeName || 'Pracheen Shiva Mandir'}`, 280, 240);
            } else {
                ctx.textAlign = 'center';
                ctx.fillStyle = '#f1c40f';
                ctx.font = 'bold 28px "Outfit", sans-serif';
                ctx.fillText('🚩 अधिकृत डिजिटल यूटिलिटी पोर्टल 🚩', width / 2, 140);

                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 50px "Outfit", sans-serif';
                ctx.fillText(state.whiteLabel.panditName || 'Acharya Devrat', width / 2, 205);

                ctx.fillStyle = '#e67e22';
                ctx.font = '500 32px "Outfit", sans-serif';
                ctx.fillText(`🛕 ${state.whiteLabel.templeName || 'Pracheen Shiva Mandir'}`, width / 2, 250);
            }
        } else {
            // Standard Sacred OM Header
            ctx.fillStyle = '#f1c40f';
            ctx.shadowColor = 'rgba(241, 196, 15, 0.5)';
            ctx.shadowBlur = 30;
            ctx.font = 'normal 120px "Yatra One", cursive, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('ॐ', width / 2, 190);
            ctx.shadowBlur = 0;

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 42px "Outfit", sans-serif';
            ctx.fillText('धर्म-मार्ग | SPIRITUAL UTILITY', width / 2, 260);
        }

        // Divider Line
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(150, 315, width - 300, 2);

        // Today's Date
        const today = new Date();
        const dateStr = today.toLocaleDateString('hi-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        ctx.fillStyle = '#f39c12';
        ctx.font = '600 38px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(dateStr, width / 2, 375);

        // Get Panchang Data
        const p = window.PanchangEngine.getPanchang(today, state.coords.lat, state.coords.lng, state.timezoneOffset);

        // Panchang Details Card Container
        const cardX = 90;
        const cardY = 420;
        const cardW = width - 180;
        const cardH = 430;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.strokeStyle = 'rgba(241, 196, 15, 0.25)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, 28);
        ctx.fill();
        ctx.stroke();

        ctx.textAlign = 'left';
        ctx.fillStyle = '#f1c40f';
        ctx.font = 'bold 40px "Outfit", sans-serif';
        ctx.fillText('📜 आज का दैनिक पंचांग', cardX + 50, cardY + 70);

        ctx.fillStyle = 'rgba(241, 196, 15, 0.2)';
        ctx.fillRect(cardX + 50, cardY + 95, cardW - 100, 2);

        // Panchang Items
        ctx.font = '400 34px "Outfit", sans-serif';
        ctx.fillStyle = '#a0a7c4';
        ctx.fillText('🗓️ तिथि:', cardX + 50, cardY + 165);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 34px "Outfit", sans-serif';
        ctx.fillText(p.tithi, cardX + 320, cardY + 165);

        ctx.font = '400 34px "Outfit", sans-serif';
        ctx.fillStyle = '#a0a7c4';
        ctx.fillText('✨ नक्षत्र:', cardX + 50, cardY + 240);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 34px "Outfit", sans-serif';
        ctx.fillText(p.nakshatra, cardX + 320, cardY + 240);

        ctx.font = '400 34px "Outfit", sans-serif';
        ctx.fillStyle = '#a0a7c4';
        ctx.fillText('🚫 राहुकाल:', cardX + 50, cardY + 315);
        ctx.fillStyle = '#e74c3c';
        ctx.font = 'bold 34px "Outfit", sans-serif';
        ctx.fillText(p.rahuKaal, cardX + 320, cardY + 315);

        ctx.font = '400 34px "Outfit", sans-serif';
        ctx.fillStyle = '#a0a7c4';
        ctx.fillText('💫 शुभ मुहूर्त:', cardX + 50, cardY + 385);
        ctx.fillStyle = '#2ecc71';
        ctx.font = 'bold 34px "Outfit", sans-serif';
        ctx.fillText(p.shubhMuhurat, cardX + 320, cardY + 385);

        // Portal Offerings Card (White-Label / Services Showcase)
        const servY = 880;
        const servH = 430;

        ctx.fillStyle = 'rgba(15, 18, 30, 0.65)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(cardX, servY, cardW, servH, 28);
        ctx.fill();
        ctx.stroke();

        ctx.textAlign = 'left';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 38px "Outfit", sans-serif';
        ctx.fillText('✨ मुख्य डिजिटल सेवाएं (Digital Services)', cardX + 50, servY + 65);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(cardX + 50, servY + 90, cardW - 100, 2);

        const services = [
            { icon: '📜', text: 'सटीक पंचांग व शुभ मुहूर्त अलर्ट' },
            { icon: '📿', text: 'डिजिटल जाप माला काउंटर एवं ध्वनि' },
            { icon: '🛕', text: 'पूजा संकल्प एवं साधना ट्रैकिंग' },
            { icon: '📦', text: 'प्रामाणिक वैदिक पूजन सामग्री आपूर्ति' }
        ];

        services.forEach((s, idx) => {
            const itemY = servY + 155 + (idx * 68);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.beginPath();
            ctx.roundRect(cardX + 40, itemY - 42, cardW - 80, 56, 14);
            ctx.fill();

            ctx.font = '500 32px "Outfit", sans-serif';
            ctx.fillStyle = '#f1c40f';
            ctx.fillText(s.icon, cardX + 60, itemY - 4);
            ctx.fillStyle = '#ffffff';
            ctx.fillText(s.text, cardX + 120, itemY - 4);
        });

        // Devotional Shlok Quote Box
        const quoteY = 1350;
        const activeQuote = state.quotes[state.activeQuoteIndex];

        ctx.textAlign = 'center';
        ctx.fillStyle = '#f1c40f';
        ctx.font = 'italic bold 44px "Outfit", sans-serif';
        ctx.fillText(`"${activeQuote.shlok}"`, width / 2, quoteY + 40);

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '400 32px "Outfit", sans-serif';
        ctx.fillText(`— ${activeQuote.translation}`, width / 2, quoteY + 100);

        // Footer White-Label & Link Section
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(90, height - 290, width - 180, 2);

        // Gold Pill Container for Short Link
        const linkPillY = height - 250;
        ctx.fillStyle = 'rgba(241, 196, 15, 0.15)';
        ctx.strokeStyle = '#f1c40f';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(100, linkPillY, width - 200, 110, 22);
        ctx.fill();
        ctx.stroke();

        const baseUrl = window.location.origin + window.location.pathname;
        const pName = state.whiteLabel.panditName || 'Acharya Devrat';
        const tName = state.whiteLabel.templeName || 'Pracheen Shiva Mandir';
        const shortUrlDisplay = state.whiteLabel.enabled 
            ? `${baseUrl}?p=${encodeURIComponent(pName)}&t=${encodeURIComponent(tName)}`
            : baseUrl;

        ctx.textAlign = 'center';
        ctx.fillStyle = '#a0a7c4';
        ctx.font = '500 24px "Outfit", sans-serif';
        ctx.fillText('🔗 आधिकारिक पोर्टल लिंक (Click/Scan Link):', width / 2, linkPillY + 40);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px "Outfit", sans-serif';
        const dispUrl = shortUrlDisplay.length > 55 ? shortUrlDisplay.substring(0, 52) + '...' : shortUrlDisplay;
        ctx.fillText(dispUrl, width / 2, linkPillY + 82);

        // Footer Tagline
        ctx.fillStyle = '#f39c12';
        ctx.font = '600 28px "Outfit", sans-serif';
        if (state.whiteLabel.enabled) {
            ctx.fillText(`सौजन्य से: ${pName} (${tName})`, width / 2, height - 85);
        } else {
            ctx.fillText('100% निस्वार्थ सनातन धर्म सेवा मंच | Spiritual Tech', width / 2, height - 85);
        }
    }

    // Devotional Theme Selector Handlers
    document.querySelectorAll('.theme-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.theme-chip').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            state.posterTheme = btn.dataset.theme;
            generateShareCard();
        });
    });

    // Custom Photo Layer Upload Handlers (Shared logic for B2B tab and Status Share tab)
    function setupPhotoUpload(triggerId, inputId, removeId, previewContainerId, previewImgId) {
        const inputEl = document.getElementById(inputId);
        const triggerBtn = document.getElementById(triggerId);
        const removeBtn = document.getElementById(removeId);
        const previewContainer = document.getElementById(previewContainerId);
        const previewImg = document.getElementById(previewImgId);

        if (triggerBtn && inputEl) {
            triggerBtn.addEventListener('click', () => inputEl.click());
            inputEl.addEventListener('change', (e) => {
                const file = e.target.files && e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                        const img = new Image();
                        img.onload = () => {
                            state.userPhotoImg = img;
                            if (previewImg) previewImg.src = evt.target.result;
                            if (previewContainer) previewContainer.style.display = 'flex';
                            if (removeBtn) removeBtn.style.display = 'block';

                            // Sync preview in other tab if present
                            const otherImg = document.getElementById(previewImgId === 'b2bPhotoPreviewImg' ? 'shareTabPhotoPreviewImg' : 'b2bPhotoPreviewImg');
                            const otherContainer = document.getElementById(previewContainerId === 'b2bPhotoPreviewContainer' ? 'shareTabPhotoPreviewContainer' : 'b2bPhotoPreviewContainer');
                            const otherRemove = document.getElementById(removeId === 'b2bRemovePhotoBtn' ? 'shareTabRemovePhotoBtn' : 'b2bRemovePhotoBtn');
                            if (otherImg) otherImg.src = evt.target.result;
                            if (otherContainer) otherContainer.style.display = 'flex';
                            if (otherRemove) otherRemove.style.display = 'block';

                            generateShareCard();
                        };
                        img.src = evt.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                state.userPhotoImg = null;
                if (inputEl) inputEl.value = '';
                if (previewContainer) previewContainer.style.display = 'none';
                removeBtn.style.display = 'none';
                
                const b2bInput = document.getElementById('b2bPhotoInput');
                const shareInput = document.getElementById('shareTabPhotoInput');
                if (b2bInput) b2bInput.value = '';
                if (shareInput) shareInput.value = '';
                const b2bCont = document.getElementById('b2bPhotoPreviewContainer');
                const shareCont = document.getElementById('shareTabPhotoPreviewContainer');
                if (b2bCont) b2bCont.style.display = 'none';
                if (shareCont) shareCont.style.display = 'none';

                generateShareCard();
            });
        }
    }

    setupPhotoUpload('b2bPhotoTriggerBtn', 'b2bPhotoInput', 'b2bRemovePhotoBtn', 'b2bPhotoPreviewContainer', 'b2bPhotoPreviewImg');
    setupPhotoUpload('shareTabPhotoTriggerBtn', 'shareTabPhotoInput', 'shareTabRemovePhotoBtn', 'shareTabPhotoPreviewContainer', 'shareTabPhotoPreviewImg');

    // Toggle different quotes on status card tap
    elements.canvas.addEventListener('click', () => {
        state.activeQuoteIndex = (state.activeQuoteIndex + 1) % state.quotes.length;
        generateShareCard();
        playBeadSound(800, 0.08, 'sine');
    });

    // Handle Download Image Action
    elements.downloadCardBtn.addEventListener('click', () => {
        try {
            const imageURI = elements.canvas.toDataURL("image/jpeg");
            const link = document.createElement('a');
            link.download = `Panchang_Status_${state.coords.name}_${new Date().toISOString().slice(0,10)}.jpg`;
            link.href = imageURI;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            sendSimulatedWhatsAppAlert("Image Downloaded", `💾 Daily Panchang Status Card saved to device. Ready for WhatsApp status upload.`);
        } catch (err) {
            console.warn("Download image fallback:", err);
            alert("लोकल (file://) ब्राउज़र सुरक्षा नीति के कारण डायरेक्ट इमेज डाउनलोड सीमित है। लाइव सर्वर (HTTP/HTTPS) पर इमेज डाउनलोड 100% कार्य करेगी।");
        }
    });

    // Handle WhatsApp Share Action
    elements.whatsappShareBtn.addEventListener('click', () => {
        shareCreativeStatus(false);
    });

    // -------------------------------------------------------------
    // CREATIVE STATUS SHARE ENGINE (Native Web Share API + Blob URL + Visual Modal)
    // -------------------------------------------------------------
    async function shareCreativeStatus(isB2B = false) {
        try {
            generateShareCard(); // Refresh canvas to latest state

            const isFileProtocol = window.location.protocol === 'file:';
            const baseUrl = isFileProtocol 
                ? 'https://ziddifounder.com/spiritual_utility_platform/index.html' 
                : (window.location.origin + window.location.pathname);

            const priest = state.whiteLabel.panditName || 'Acharya Devrat';
            const temple = state.whiteLabel.templeName || 'Pracheen Shiva Mandir';
            const priestEnc = encodeURIComponent(priest);
            const templeEnc = encodeURIComponent(temple);

            const shortUrl = state.whiteLabel.enabled 
                ? `${baseUrl}?p=${priestEnc}&t=${templeEnc}`
                : baseUrl;

            let captionText = '';
            if (state.whiteLabel.enabled) {
                captionText = `🚩 *${priest} - ${temple}*\n\nहमारे पंचांग एवं आध्यात्मिक सेवाओं के आधिकारिक डिजिटल पोर्टल से जुड़ें:\n\n✨ *पोर्टल पर उपलब्ध मुख्य सुविधाएं:*\n📜 1. सटीक दैनिक पंचांग एवं शुभ मुहूर्त\n📿 2. डिजिटल जाप माला काउंटर\n🛕 3. विशेष पूजा संकल्प एवं यजमान ट्रैकिंग\n📦 4. वैदिक पूजन सामग्री डायरेक्ट आपूर्ति\n\n🔗 *यजमान पोर्टल लिंक:* ${shortUrl}\n\nसौजन्य से: ${priest} (${temple})`;
            } else {
                captionText = `🚩 *दैनिक पंचांग व शुभ मुहूर्त* 🚩\n\nहमारे पंचांग एवं आध्यात्मिक सेवाओं के आधिकारिक डिजिटल पोर्टल से जुड़ें:\n\n✨ *पोर्टल पर उपलब्ध मुख्य सुविधाएं:*\n📜 1. सटीक दैनिक पंचांग एवं शुभ मुहूर्त\n📿 2. डिजिटल जाप माला काउंटर\n🛕 3. विशेष पूजा संकल्प एवं यजमान ट्रैकिंग\n📦 4. वैदिक पूजन सामग्री डायरेक्ट आपूर्ति\n\n🔗 *यजमान पोर्टल लिंक:* ${shortUrl}`;
            }

            const fileName = `Status_Creative_${priest.replace(/\s+/g, '_')}.png`;

            // Copy caption text to clipboard
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(captionText).catch(e => console.log(e));
            }

            const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(captionText)}`;

            // Check if canvas is exportable (not tainted by local file:// images)
            let canExportCanvas = true;
            try {
                elements.canvas.toDataURL('image/png');
            } catch (taintErr) {
                canExportCanvas = false;
            }

            if (!canExportCanvas) {
                // Smooth fallback when testing locally via file:// protocol
                window.open(waUrl, '_blank');
                sendSimulatedWhatsAppAlert("WhatsApp Shared", `🚩 मैसेज एवं शॉर्ट लिंक व्हाट्सएप पर भेज दिया गया है!\n(नोट: लोकल file:// में ब्राउज़र सुरक्षा के कारण इमेज अटैचमेंट सीमित है। लाइव सर्वर पर इमेज भी ऑटो-अटैच होगी)`);
                return;
            }

            // Convert Canvas to Blob for Blob URL & File Share
            elements.canvas.toBlob(async (blob) => {
                if (!blob) {
                    window.open(waUrl, '_blank');
                    return;
                }

                const blobUrl = URL.createObjectURL(blob);
                const imageFile = new File([blob], fileName, { type: 'image/png' });

                // 1. Try Native Web Share API (Passes native PNG Image + Caption to WhatsApp directly!)
                if (navigator.canShare && navigator.canShare({ files: [imageFile] })) {
                    try {
                        await navigator.share({
                            title: `${priest} - Custom Status Creative`,
                            text: captionText,
                            files: [imageFile]
                        });
                        sendSimulatedWhatsAppAlert("Creative Shared", "🎨 Native image file & caption shared to WhatsApp!");
                        return;
                    } catch (err) {
                        if (err.name === 'AbortError') return; // User closed share sheet
                        console.warn('Native file share sheet skipped/failed, proceeding to blob download modal:', err);
                    }
                }

                // 2. Fallback: Download via Blob URL & Display Visual Poster Modal
                const downloadLink = document.createElement('a');
                downloadLink.download = fileName;
                downloadLink.href = blobUrl;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);

                const modal = document.getElementById('creativePosterModal');
                const modalImg = document.getElementById('posterModalImg');
                const modalWaLink = document.getElementById('posterModalWaLink');
                const modalDownloadBtn = document.getElementById('posterModalDownloadBtn');
                const closeModalBtn = document.getElementById('closePosterModalBtn');

                if (modal && modalImg && modalWaLink) {
                    modalImg.src = blobUrl;
                    modalWaLink.href = waUrl;
                    modal.style.display = 'flex';

                    if (closeModalBtn) {
                        closeModalBtn.onclick = () => { modal.style.display = 'none'; };
                    }
                    if (modalDownloadBtn) {
                        modalDownloadBtn.onclick = () => {
                            const l = document.createElement('a');
                            l.download = fileName;
                            l.href = blobUrl;
                            l.click();
                        };
                    }
                } else {
                    window.open(waUrl, '_blank');
                }

                sendSimulatedWhatsAppAlert("Poster Saved", `🖼️ Poster image downloaded & link copied!`);
            }, 'image/png');
        } catch (err) {
            console.error("Creative Share Error:", err);
            const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent("🚩 *दैनिक पंचांग व शुभ मुहूर्त* 🚩\n\nhttps://ziddifounder.com/spiritual_utility_platform/index.html")}`;
            window.open(waUrl, '_blank');
        }
    }

    function fallbackShare(shortUrl, captionText, blob = null, fileName = 'Panchang_Status_Creative.png') {
        shareCreativeStatus(true);
    }

    // -------------------------------------------------------------
    // 9. B2B WHITE-LABEL MANAGEMENT
    // -------------------------------------------------------------
    elements.b2bEnabledToggle.addEventListener('change', (e) => {
        state.whiteLabel.enabled = e.target.checked;
        toggleB2BFields(state.whiteLabel.enabled);
    });

    function toggleB2BFields(enabled) {
        elements.b2bPanditName.disabled = !enabled;
        elements.b2bTempleName.disabled = !enabled;
        if (!enabled) {
            elements.b2bPreviewLogo.textContent = "🛡️";
            elements.b2bPreviewName.textContent = "Neutral Front-End";
            elements.b2bPreviewTemple.textContent = "Confidential D2C Platform";
        } else {
            updateB2BPreview();
        }
    }

    function updateB2BPreview() {
        const name = elements.b2bPanditName.value.trim() || "Acharya Devrat";
        const temple = elements.b2bTempleName.value.trim() || "Pracheen Shiva Mandir";
        const initial = name.charAt(0) || "A";
        
        state.whiteLabel.panditName = name;
        state.whiteLabel.templeName = temple;
        state.whiteLabel.logoLetter = initial.toUpperCase();
        
        // Sync phone mockup preview elements
        const previewPriest = document.getElementById('previewPriestName');
        const previewTemple = document.getElementById('previewTempleName');
        const previewFooter = document.getElementById('previewFooterBrand');
        const liveLinkBtn = document.getElementById('liveLinkBtn');
        const shortUrlDisplay = document.getElementById('shortUrlDisplay');

        if (previewPriest) previewPriest.textContent = name;
        if (previewTemple) previewTemple.textContent = temple;
        if (previewFooter) previewFooter.textContent = `${name} (${temple})`;

        // Dynamic URL generation (Full & Shorthand Compact Short Link)
        const isFileProtocol = window.location.protocol === 'file:';
        const baseUrl = isFileProtocol 
            ? 'https://ziddifounder.com/spiritual_utility_platform/index.html' 
            : (window.location.origin + window.location.pathname);
            
        const priestEnc = encodeURIComponent(name);
        const templeEnc = encodeURIComponent(temple);
        const customUrl = `${baseUrl}?priest=${priestEnc}&temple=${templeEnc}`;
        const shortUrl = `${baseUrl}?p=${priestEnc}&t=${templeEnc}`;

        if (liveLinkBtn) liveLinkBtn.href = customUrl;
        if (shortUrlDisplay) shortUrlDisplay.textContent = `.../index.html?p=${priestEnc}&t=${templeEnc}`;
        
        // Refresh canvas card preview
        generateShareCard();
    }

    elements.b2bPanditName.addEventListener('input', updateB2BPreview);
    elements.b2bTempleName.addEventListener('input', updateB2BPreview);

    // Initial sync call
    updateB2BPreview();

    elements.b2bSaveBtn.addEventListener('click', () => {
        alert("✨ आपकी डिजिटल पहचान सफलतापूर्वक सक्रिय हो गई है! अब आप लाइव प्रीव्यू देखकर शॉर्ट लिंक व स्टेटस क्रिएटिव व्हाट्सएप पर शेयर कर सकते हैं।");
        sendSimulatedWhatsAppAlert("B2B White-Label Active", `⚙️ B2B Partner Portal configured. Shared templates will now reflect: *"${state.whiteLabel.panditName}"* branding.`);
        generateShareCard();
    });

    // B2B Creative Share Button Action
    const b2bCreativeShareBtn = document.getElementById('b2bCreativeShareBtn');
    if (b2bCreativeShareBtn) {
        b2bCreativeShareBtn.addEventListener('click', () => {
            shareCreativeStatus(true);
        });
    }

    // B2B Poster Download Button Action
    const b2bDownloadPosterBtn = document.getElementById('b2bDownloadPosterBtn');
    if (b2bDownloadPosterBtn) {
        b2bDownloadPosterBtn.addEventListener('click', () => {
            try {
                generateShareCard();
                const priest = state.whiteLabel.panditName || 'Acharya_Devrat';
                const link = document.createElement('a');
                link.download = `Status_Creative_${priest.replace(/\s+/g, '_')}.png`;
                link.href = elements.canvas.toDataURL("image/png");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                sendSimulatedWhatsAppAlert("Poster Image Downloaded", `💾 Customized White-Label Status Poster saved to device.`);
            } catch (err) {
                alert("लोकल (file://) ब्राउज़र सुरक्षा नीति के कारण डायरेक्ट पोस्टर डाउनलोड सीमित है। लाइव सर्वर (HTTP/HTTPS) पर यह 100% डाउनलोड होगा।");
            }
        });
    }

    if (elements.b2bCopyLinkBtn) {
        elements.b2bCopyLinkBtn.addEventListener('click', () => {
            const baseUrl = window.location.origin + window.location.pathname;
            const priest = encodeURIComponent(state.whiteLabel.panditName || 'Acharya Devrat');
            const temple = encodeURIComponent(state.whiteLabel.templeName || 'Pracheen Shiva Mandir');
            // Compact Short URL format
            const shortUrl = `${baseUrl}?p=${priest}&t=${temple}`;
            
            navigator.clipboard.writeText(shortUrl).then(() => {
                alert(`✂️ यजमान शॉर्ट लिंक (Short Link) कॉपी हो गया है!\n\n${shortUrl}\n\nइसे आप WhatsApp समूहों व यजमानों के साथ आसानी से साझा कर सकते हैं।`);
                sendSimulatedWhatsAppAlert("Short Link Copied", `📋 Shortened Link created: *${shortUrl}* ready for WhatsApp distribution.`);
            }).catch(() => {
                prompt("यहाँ से अपना कस्टमाइज्ड शॉर्ट लिंक कॉपी करें:", shortUrl);
            });
        });
    }

    const shareWhatsAppBtn = document.getElementById('shareWhatsAppBtn');
    if (shareWhatsAppBtn) {
        shareWhatsAppBtn.addEventListener('click', () => {
            shareCreativeStatus(true);
        });
    }

    // -------------------------------------------------------------
    // 10. WHATSAPP SIMULATION LOGIC
    // -------------------------------------------------------------
    function sendSimulatedWhatsAppAlert(type, messageText) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'wa-message';
        
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        msgDiv.innerHTML = `
            <strong>🚩 ${type} Alert</strong><br>
            <span style="font-size:12px; display:inline-block; margin-top:4px;">${messageText.replace(/\n/g, '<br>')}</span>
            <div class="wa-msg-meta">
                <span>Devotional Automation Bot</span>
                <span>${timeStr}</span>
            </div>
            <button class="wa-msg-btn" onclick="this.parentElement.style.display='none'">Mark as Read ✓</button>
        `;
        
        elements.whatsappFeed.insertBefore(msgDiv, elements.whatsappFeed.firstChild);
        
        // Show indicator on WA button
        elements.whatsappSimBtn.style.background = '#00a884';
        elements.whatsappSimBtn.style.transform = 'scale(1.1)';
        setTimeout(() => {
            elements.whatsappSimBtn.style.transform = 'scale(1)';
        }, 300);
    }

    elements.whatsappSimBtn.addEventListener('click', () => {
        elements.whatsappDrawer.classList.toggle('active');
        elements.whatsappSimBtn.style.background = '#25d366'; // reset glow
    });

    elements.closeDrawerBtn.addEventListener('click', () => {
        elements.whatsappDrawer.classList.remove('active');
    });

    // -------------------------------------------------------------
    // 11. INITIAL RUNS & URL PARAMETER PARSING
    // -------------------------------------------------------------
    // Auto-parse URL Query Parameters for White-Label links (supports both ?priest= & shorthand ?p= and ?t=)
    const urlParams = new URLSearchParams(window.location.search);
    const priestParam = urlParams.get('priest') || urlParams.get('pandit') || urlParams.get('p');
    const templeParam = urlParams.get('temple') || urlParams.get('t');

    if (priestParam || templeParam) {
        state.whiteLabel.enabled = true;
        if (priestParam) state.whiteLabel.panditName = priestParam;
        if (templeParam) state.whiteLabel.templeName = templeParam;
        
        elements.b2bEnabledToggle.checked = true;
        elements.b2bPanditName.value = state.whiteLabel.panditName;
        elements.b2bTempleName.value = state.whiteLabel.templeName;
        toggleB2BFields(true);

        const noticeEl = document.getElementById('sharedLinkNotice');
        const priestTxt = document.getElementById('sharedLinkPriestText');
        if (noticeEl) noticeEl.style.display = 'block';
        if (priestTxt) priestTxt.textContent = state.whiteLabel.panditName;
    } else {
        toggleB2BFields(false);
    }

    // Initializing views
    renderPanchang();
    updateJaapUI();
    updateSankalpUI();

});
