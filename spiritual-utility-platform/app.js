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
    function generateShareCard() {
        const ctx = elements.canvas.getContext('2d');
        if (!ctx) return;

        // Render loading state/background structure
        const width = 1080;
        const height = 1920;
        elements.canvas.width = width;
        elements.canvas.height = height;

        // Background Gradient (Deep Saffron-Maroon Sunset Glow)
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#100b16');
        bgGrad.addColorStop(0.3, '#321008');
        bgGrad.addColorStop(0.7, '#6b2005');
        bgGrad.addColorStop(1, '#d35400');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Draw Subtle Gold Borders
        ctx.strokeStyle = 'rgba(241, 196, 15, 0.4)';
        ctx.lineWidth = 15;
        ctx.strokeRect(30, 30, width - 60, height - 60);

        // Draw Elegant Thin Inner Border
        ctx.strokeStyle = 'rgba(241, 196, 15, 0.15)';
        ctx.lineWidth = 4;
        ctx.strokeRect(55, 55, width - 110, height - 110);

        // Header: Sacred OM symbol
        ctx.fillStyle = '#f1c40f';
        ctx.shadowColor = 'rgba(241, 196, 15, 0.5)';
        ctx.shadowBlur = 30;
        ctx.font = 'normal 130px "Yatra One", cursive, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ॐ', width / 2, 240);
        ctx.shadowBlur = 0; // Reset shadow

        // App/Source Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px "Outfit", sans-serif';
        ctx.letterSpacing = '5px';
        ctx.fillText('HINDU UTILITY PLATFORM', width / 2, 320);

        // Divider
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(width / 4, 360, width / 2, 3);

        // Date Display
        const today = new Date();
        const dateStr = today.toLocaleDateString('hi-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        ctx.fillStyle = '#f39c12';
        ctx.font = '600 42px "Outfit", sans-serif';
        ctx.fillText(dateStr, width / 2, 430);

        // Render Dynamic Panchang details
        const p = window.PanchangEngine.getPanchang(today, state.coords.lat, state.coords.lng, state.timezoneOffset);
        
        // Draw Glassmorphic Card Container for Panchang details
        const cardX = 100;
        const cardY = 500;
        const cardW = width - 200;
        const cardH = 460;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 3;
        // Rounded card draw helper
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, 30);
        ctx.fill();
        ctx.stroke();

        // Write Panchang Info inside card
        ctx.textAlign = 'left';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 44px "Outfit", sans-serif';
        ctx.fillText('📜 दैनिक पंचांग विवरण', cardX + 60, cardY + 80);

        // Draw sub-divider
        ctx.fillStyle = 'rgba(241, 196, 15, 0.3)';
        ctx.fillRect(cardX + 60, cardY + 110, cardW - 120, 2);

        // Panchang Grid Entries (Left Col)
        ctx.font = '400 36px "Outfit", sans-serif';
        ctx.fillStyle = '#a0a7c4';
        ctx.fillText(' तिथि (Tithi):', cardX + 60, cardY + 190);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px "Outfit", sans-serif';
        ctx.fillText(p.tithi, cardX + 340, cardY + 190);

        ctx.font = '400 36px "Outfit", sans-serif';
        ctx.fillStyle = '#a0a7c4';
        ctx.fillText(' नक्षत्र (Nakshatra):', cardX + 60, cardY + 270);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px "Outfit", sans-serif';
        ctx.fillText(p.nakshatra, cardX + 340, cardY + 270);

        ctx.font = '400 36px "Outfit", sans-serif';
        ctx.fillStyle = '#a0a7c4';
        ctx.fillText(' राहुकाल (Rahu Kaal):', cardX + 60, cardY + 350);
        ctx.fillStyle = '#e74c3c';
        ctx.font = 'bold 36px "Outfit", sans-serif';
        ctx.fillText(p.rahuKaal, cardX + 340, cardY + 350);

        // Auspicious Muhurat Col
        ctx.font = '400 36px "Outfit", sans-serif';
        ctx.fillStyle = '#a0a7c4';
        ctx.fillText(' शुभ मुहूर्त (Muhurat):', cardX + 60, cardY + 420);
        ctx.fillStyle = '#2ecc71';
        ctx.font = 'bold 36px "Outfit", sans-serif';
        ctx.fillText(p.shubhMuhurat, cardX + 340, cardY + 420);

        // Devotional Quote Box
        const quoteY = 1040;
        const activeQuote = state.quotes[state.activeQuoteIndex];
        
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'italic bold 52px "Outfit", sans-serif';
        // Wrap text if needed
        ctx.fillText(`"${activeQuote.shlok}"`, width / 2, quoteY);
        
        ctx.fillStyle = '#f1c40f';
        ctx.font = '500 40px "Outfit", sans-serif';
        ctx.fillText(`— ${activeQuote.translation}`, width / 2, quoteY + 80);

        // Add a beautiful illustration symbol in center space
        ctx.fillStyle = 'rgba(241, 196, 15, 0.08)';
        ctx.font = 'normal 260px "Outfit", sans-serif';
        ctx.fillText('🚩', width / 2, quoteY + 380);

        // B2B White Label Footer configuration
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(100, height - 260, width - 200, 2);

        ctx.textAlign = 'center';
        if (state.whiteLabel.enabled) {
            ctx.fillStyle = '#f1c40f';
            ctx.font = '600 36px "Outfit", sans-serif';
            ctx.fillText(`📿 सप्रेम भेंट: ${state.whiteLabel.panditName}`, width / 2, height - 190);
            
            ctx.fillStyle = '#a0a7c4';
            ctx.font = '400 28px "Outfit", sans-serif';
            ctx.fillText(`📍 ${state.whiteLabel.templeName}`, width / 2, height - 130);
        } else {
            ctx.fillStyle = '#f39c12';
            ctx.font = '600 36px "Outfit", sans-serif';
            ctx.fillText('धर्मार्थ सेवा हेतु सनातन पंचांग यूटिलिटी', width / 2, height - 190);
            
            ctx.fillStyle = '#a0a7c4';
            ctx.font = '400 28px "Outfit", sans-serif';
            ctx.fillText('100% निस्वार्थ धार्मिक सेवा एवं साधना मंच', width / 2, height - 130);
        }

        // Little footer info
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.font = '300 24px "Outfit", sans-serif';
        ctx.fillText('Certified Devotional Utility Platform', width / 2, height - 80);
    }

    // Toggle different quotes on status card tap
    elements.canvas.addEventListener('click', () => {
        state.activeQuoteIndex = (state.activeQuoteIndex + 1) % state.quotes.length;
        generateShareCard();
        playBeadSound(800, 0.08, 'sine');
    });

    // Handle Download Image Action
    elements.downloadCardBtn.addEventListener('click', () => {
        const imageURI = elements.canvas.toDataURL("image/jpeg");
        const link = document.createElement('a');
        link.download = `Panchang_Status_${state.coords.name}_${new Date().toISOString().slice(0,10)}.jpg`;
        link.href = imageURI;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        sendSimulatedWhatsAppAlert("Image Downloaded", `💾 Daily Panchang Status Card saved to device. Ready for WhatsApp status upload.`);
    });

    // Handle WhatsApp Share Action
    elements.whatsappShareBtn.addEventListener('click', () => {
        // Build simulated share message link
        const text = `🚩 *दैनिक पंचांग व शुभ मुहूर्त* 🚩\n\nस्थान: ${state.coords.name}\nतिथि: ${elements.tithiVal.textContent}\nनक्षत्र: ${elements.nakshatraVal.textContent}\nशुभ मुहूर्त: ${elements.muhuratVal.textContent}\n\nसाधना एवं दैनिक पंचांग के लिए जुड़े: https://spiritual-utility-platform.in`;
        const encoded = encodeURIComponent(text);
        const waURL = `https://api.whatsapp.com/send?text=${encoded}`;
        
        // Open link or simulate
        window.open(waURL, '_blank');
        sendSimulatedWhatsAppAlert("Shared to WhatsApp", `📲 Shared Panchang alert template to WhatsApp Contacts. Status loop active.`);
    });

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
        const name = elements.b2bPanditName.value.trim() || "Pandit Ji";
        const temple = elements.b2bTempleName.value.trim() || "Local Mandir Trust";
        const initial = name.charAt(0) || "P";
        
        state.whiteLabel.panditName = name;
        state.whiteLabel.templeName = temple;
        state.whiteLabel.logoLetter = initial.toUpperCase();
        
        elements.b2bPreviewLogo.textContent = state.whiteLabel.logoLetter;
        elements.b2bPreviewName.textContent = name;
        elements.b2bPreviewTemple.textContent = temple;
    }

    elements.b2bPanditName.addEventListener('input', updateB2BPreview);
    elements.b2bTempleName.addEventListener('input', updateB2BPreview);

    elements.b2bSaveBtn.addEventListener('click', () => {
        alert("B2B ब्रैंडिंग सफलतापूर्वक सहेज ली गई है! अब स्टेटस कार्ड और शेयर लिंक्स पर आपका नाम प्रदर्शित होगा।");
        sendSimulatedWhatsAppAlert("B2B White-Label Active", `⚙️ B2B Partner Portal configured. Shared templates will now reflect: *"${state.whiteLabel.panditName}"* branding.`);
        if (state.activeTab === 'share') generateShareCard();
    });

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
    // 11. INITIAL RUNS
    // -------------------------------------------------------------
    // Initializing views
    renderPanchang();
    updateJaapUI();
    updateSankalpUI();
    toggleB2BFields(false);

    // Push initial WhatsApp Onboarding greetings
    setTimeout(() => {
        sendSimulatedWhatsAppAlert(
            "Welcome to Spiritual Tech Platform", 
            `🌟 नमस्कार! श्री ${state.whiteLabel.panditName || "साधक"} जी,\n\nधार्मिक यूटिलिटी बॉट में आपका स्वागत है।\n\n📌 *आज का पंचांग विवरण:*\n• तिथि: ${elements.tithiVal.textContent}\n• राहुकाल: ${elements.rahuKaalTime.textContent}\n\n📿 जाप काउंटर एवं दैनिक पंचांग देखने के लिए ऐप का उपयोग करें!`
        );
    }, 1500);
});
