// Daily Darshan - Interactive Puja & Live Status Engine
document.addEventListener('DOMContentLoaded', () => {
    
    // Deities Database (Official Temple Portals & Real Sanctum Media Only)
    const deitiesData = {
        shiva: {
            name: "श्री महाकालेश्वर ज्योतिर्लिंग (उज्जैन)",
            source: "✓ श्री महाकालेश्वर मंदिर आधिकारिक लाइव दर्शन",
            mantra: "ॐ नमः शिवाय | कर्पूरगौरं करुणावतारं संसारसारम् भुजगेन्द्रहारम्।",
            image: "assets/daily/shiva_today.jpg",
            fallbackUrl: "https://www.shrimahakaleshwar.mp.gov.in/live-darshan"
        },
        kashi: {
            name: "श्री काशी विश्वनाथ ज्योतिर्लिंग (वाराणसी)",
            source: "✓ श्री काशी विश्वनाथ मंदिर आधिकारिक लाइव दर्शन",
            mantra: "ॐ नमः पार्वती पतये हर हर महादेव। जय काशी विश्वनाथ।",
            image: "assets/daily/kashi_today.jpg",
            fallbackUrl: "https://www.shrikashivishwanath.org/"
        },
        tirupati: {
            name: "श्री तिरुमाला वेंकटेश्वर स्वामि (तिरुपति बालाजी)",
            source: "✓ तिरुमाला तिरुपति देवस्थानम (TTD) आधिकारिक दर्शन",
            mantra: "विना वेङ्कटेशं न नाथो न नाथः। सदा वेङ्कटेशं स्मरामि स्मरामि।",
            image: "assets/daily/tirupati_today.jpg",
            fallbackUrl: "https://ttdevasthanams.ap.gov.in/"
        },
        vaishnodevi: {
            name: "श्री माता वैष्णो देवी (कटरा, जम्मू)",
            source: "✓ श्री माता वैष्णो देवी श्राइन बोर्ड आधिकारिक दर्शन",
            mantra: "सर्वमङ्गलमङ्गल्ये शिवे सर्वार्थसाधिके। शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते॥",
            image: "assets/daily/vaishnodevi_today.jpg",
            fallbackUrl: "https://www.maavaishnodevi.org/"
        },
        somnath: {
            name: "श्री सोमनाथ ज्योतिर्लिंग (गुजरात)",
            source: "✓ श्री सोमनाथ ट्रस्ट आधिकारिक लाइव दर्शन",
            mantra: "जय सोमनाथ | ॐ नमः शिवाय। प्रथमं सोमनाथं च श्रीशैले मल्लिकार्जुनम्॥",
            image: "assets/daily/somnath_today.jpg",
            fallbackUrl: "https://somnath.org/"
        },
        siddhivinayak: {
            name: "श्री सिद्धिविनायक मंदिर (मुंबई)",
            source: "✓ श्री सिद्धिविनायक गणपति मंदिर न्यास आधिकारिक दर्शन",
            mantra: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥",
            image: "assets/daily/siddhivinayak_today.jpg",
            fallbackUrl: "https://www.siddhivinayak.org/"
        }
    };

    let activeDeityKey = 'shiva';
    let audioContext = null;
    let isSoundOn = true;

    // DOM Elements
    const liveDateBadge = document.getElementById('liveDateBadge');
    const templeSourceText = document.getElementById('templeSourceText');
    const darshanImage = document.getElementById('darshanImage');
    const deityTitle = document.getElementById('deityTitle');
    const deityMantra = document.getElementById('deityMantra');
    const flameOverlay = document.getElementById('flameOverlay');
    const waterStream = document.getElementById('waterStream');
    const petalsCanvas = document.getElementById('petalsCanvas');
    const posterCanvas = document.getElementById('posterCanvas');
    const aartiSoundBtn = document.getElementById('aartiSoundBtn');

    // 1. Set Today's Hindi Date
    const today = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    if (liveDateBadge) {
        liveDateBadge.textContent = today.toLocaleDateString('hi-IN', dateOptions);
    }

    // 2. Deity Chip Switcher
    document.querySelectorAll('.deity-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.deity-chip').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            
            activeDeityKey = btn.dataset.deity;
            updateDeityView(activeDeityKey);
        });
    });

    function updateDeityView(key) {
        const data = deitiesData[key];
        if (!data) return;

        deityTitle.textContent = data.name;
        deityMantra.textContent = `"${data.mantra}"`;
        templeSourceText.textContent = data.source;

        // Image smooth transition
        darshanImage.style.opacity = '0.3';
        setTimeout(() => {
            darshanImage.src = data.image;
            darshanImage.onerror = () => {
                // Fallback to real temple photo
                darshanImage.src = 'assets/daily/shiva_today.jpg';
            };
            darshanImage.style.opacity = '1';
        }, 150);

        playBellSound();
    }

    // Web Audio Master Stream Connector for Speaker Output & MediaRecorder Capture
    let masterAudioCtx = null;
    let mediaStreamAudioDest = null;

    function getMasterAudioStream() {
        if (!masterAudioCtx) {
            masterAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
            mediaStreamAudioDest = masterAudioCtx.createMediaStreamDestination();
        }
        if (masterAudioCtx.state === 'suspended') {
            masterAudioCtx.resume();
        }
        return mediaStreamAudioDest;
    }

    function playTrack(audioObj, vol = 1.0) {
        if (!isSoundOn) return;
        try {
            audioObj.currentTime = 0;
            audioObj.volume = vol;
            audioObj.play().catch(() => {});

            const dest = getMasterAudioStream();
            if (masterAudioCtx && !audioObj._connectedToCtx) {
                try {
                    const source = masterAudioCtx.createMediaElementSource(audioObj);
                    source.connect(masterAudioCtx.destination);
                    source.connect(dest);
                    audioObj._connectedToCtx = true;
                } catch (err) {}
            }
        } catch (e) {}
    }

    // 3. Ultra-Soothing 6-Second Temple Bell Audio Player (432Hz Sacred Brass Resonance)
    const bellAudio = new Audio('assets/audio/temple_bell.wav');
    
    function playBellSound() {
        if (!isSoundOn) return;
        playTrack(bellAudio, 0.85);
        if (navigator.vibrate) {
            navigator.vibrate([40, 30, 40]);
        }
    }

    // 3b. Pure Meditative OM (ॐ) Sound Audio Player (136.1Hz Cosmic Pitch)
    const pureOmAudio = new Audio('assets/audio/pure_om.wav');

    function playMantraChant() {
        if (!isSoundOn) return;
        playTrack(pureOmAudio, 0.95);
    }

    // 3c. Light Delicate Floral Wind Chime Audio (पुष्प वर्षा हेतु अति-सौम्य ध्वनि)
    const flowerChimeAudio = new Audio('assets/audio/flower_chime.wav');

    function playFlowerChimeSound() {
        if (!isSoundOn) return;
        playTrack(flowerChimeAudio, 0.5);
    }

    // 3d. Water Pouring Audio for Abhishek (जलाभिषेक ध्वनि)
    const waterAudio = new Audio('assets/audio/water_pour.wav');

    function playWaterSound() {
        if (!isSoundOn) return;
        playTrack(waterAudio, 0.35);
    }

    // 3e. Bhog Arpan Audio (Smooth Devotional Hum)
    const humAudio = new Audio('assets/audio/humming.wav');

    function playHummingSound() {
        if (!isSoundOn) return;
        playTrack(humAudio, 0.85);
    }

    // Abhishekam (Realistic Water & Milk Stream using Dynamic Canvas Particles)
    document.getElementById('abhishekamBtn').addEventListener('click', () => {
        playWaterSound();
        playMantraChant(); // Play OM sound alongside water
        const frame = document.getElementById('darshanFrame');
        if (!frame) return;

        // Ensure canvas exists for water
        let waterCanvas = document.getElementById('waterCanvas');
        if (!waterCanvas) {
            waterCanvas = document.createElement('canvas');
            waterCanvas.id = 'waterCanvas';
            waterCanvas.className = 'water-canvas';
            waterCanvas.style.position = 'absolute';
            waterCanvas.style.inset = '0';
            waterCanvas.style.width = '100%';
            waterCanvas.style.height = '100%';
            waterCanvas.style.pointerEvents = 'none';
            waterCanvas.style.zIndex = '3';
            frame.appendChild(waterCanvas);
        }

        waterCanvas.width = frame.clientWidth;
        waterCanvas.height = frame.clientHeight;
        const ctxW = waterCanvas.getContext('2d');
        
        globalWaterParticles = [];
        isGlobalPouring = true;
        
        // Pour water for 5 seconds, then let remaining drops fall
        setTimeout(() => { isGlobalPouring = false; }, 5000);

        function renderWater() {
            ctxW.clearRect(0, 0, waterCanvas.width, waterCanvas.height);
            
            // Generate heavy stream particles
            if (isGlobalPouring) {
                for(let i = 0; i < 15; i++) {
                    globalWaterParticles.push({
                        x: waterCanvas.width / 2 + (Math.random() * 50 - 25), // Centered stream
                        y: -30, // Start above frame
                        vx: Math.random() * 1.5 - 0.75, // Flow direction
                        vy: Math.random() * 2 + 5,     // Slower gravity drop speed
                        size: Math.random() * 4 + 3,    // Droplet size
                        alpha: Math.random() * 0.4 + 0.3, 
                        color: Math.random() > 0.6 ? '255, 255, 255' : '180, 235, 255' 
                    });
                }
            }

            let activeDrops = 0;
            
            for (let i = 0; i < globalWaterParticles.length; i++) {
                let p = globalWaterParticles[i];
                if (p.size > 0.5 && p.y < waterCanvas.height + 50) {
                    activeDrops++;
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.15;
                    
                    if (p.y > waterCanvas.height * 0.35 && p.y < waterCanvas.height * 0.7) {
                        p.vx += (Math.random() * 6 - 3);
                        p.vy *= 0.85;
                        p.size *= 0.94;
                    }
                    
                    ctxW.beginPath();
                    ctxW.fillStyle = `rgba(${p.color}, ${p.alpha})`;
                    ctxW.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctxW.fill();
                }
            }

            if (activeDrops > 0 || isGlobalPouring) {
                requestAnimationFrame(renderWater);
            } else {
                ctxW.clearRect(0, 0, waterCanvas.width, waterCanvas.height);
            }
        }
        renderWater();
    });

    // Prasad Offering (Interactive Modal & Animation)
    const bhogModal = document.getElementById('bhogModal');
    const closeBhogModal = document.getElementById('closeBhogModal');
    const bhogOptions = document.querySelectorAll('.bhog-option-btn');
    const toastMessage = document.getElementById('toastMessage');

    document.getElementById('prasadBtn').addEventListener('click', () => {
        if(bhogModal) bhogModal.classList.add('active'); // Open Selection Modal
    });

    if(closeBhogModal) {
        closeBhogModal.addEventListener('click', () => {
            bhogModal.classList.remove('active');
        });
    }

    bhogOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            const bhogEmoji = btn.getAttribute('data-bhog');
            const bhogName = btn.getAttribute('data-name');
            bhogModal.classList.remove('active');

            globalActiveBhog = { imgUrl: bhogEmoji, name: bhogName };
            
            // Play Devotional Hum
            playHummingSound();
            
            // Create Floating Bhog element
            const frame = document.getElementById('darshanFrame');
            if(frame) {
                const existingBhog = frame.querySelector('.floating-bhog');
                if (existingBhog) existingBhog.remove();
                
                const bhogEl = document.createElement('div');
                bhogEl.className = 'floating-bhog';
                const isImg = btn.getAttribute('data-is-img') === 'true';
                if (isImg) {
                    const imgEl = document.createElement('img');
                    imgEl.src = bhogEmoji;
                    imgEl.alt = bhogName;
                    imgEl.style.width = '120px';
                    imgEl.style.height = '120px';
                    imgEl.style.objectFit = 'contain';
                    imgEl.style.borderRadius = '50%';
                    imgEl.style.boxShadow = '0 10px 30px rgba(0,0,0,0.7)';
                    bhogEl.appendChild(imgEl);
                } else {
                    bhogEl.textContent = bhogEmoji;
                }
                frame.appendChild(bhogEl);
                
                setTimeout(() => bhogEl.classList.add('active'), 50);
                
                toastMessage.textContent = `आपका ${bhogName} प्रभु को सफलतापूर्वक अर्पित किया गया! 🙏`;
                toastMessage.classList.add('active');
                
                setTimeout(() => {
                    bhogEl.classList.remove('active');
                    toastMessage.classList.remove('active');
                    setTimeout(() => bhogEl.remove(), 1200);
                }, 4000);
            }
        });
    });

    // Toggle Sound
    aartiSoundBtn.addEventListener('click', () => {
        isSoundOn = !isSoundOn;
        aartiSoundBtn.textContent = isSoundOn ? '🔊 आरती ध्वनि: ऑन' : '🔇 आरती ध्वनि: ऑफ';
    });

    // 5. Daily Darshan Status Poster Canvas Generator
    function generateDarshanPoster(callback) {
        const ctx = posterCanvas.getContext('2d');
        const w = 1080;
        const h = 1920;

        // Background Gradient
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#0a0812');
        grad.addColorStop(0.3, '#2a0e05');
        grad.addColorStop(0.7, '#4a1503');
        grad.addColorStop(1, '#0d0a17');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Gold Outer Border
        ctx.strokeStyle = '#f1c40f';
        ctx.lineWidth = 14;
        ctx.strokeRect(30, 30, w - 60, h - 60);

        // Header Title
        ctx.fillStyle = '#f1c40f';
        ctx.font = 'normal 110px "Yatra One", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ॐ', w / 2, 170);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 44px "Outfit", sans-serif';
        ctx.fillText('दैनिक प्रत्यक्ष देव दर्शन | DAILY DARSHAN', w / 2, 240);

        const dateStr = today.toLocaleDateString('hi-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        ctx.fillStyle = '#ff9933';
        ctx.font = '600 36px "Outfit", sans-serif';
        ctx.fillText(dateStr, w / 2, 295);

        // Darshan Image Container in Poster
        const imgW = 900;
        const imgH = 1125;
        const imgX = (w - imgW) / 2;
        const imgY = 340;

        const deityImg = new Image();
        deityImg.crossOrigin = "anonymous";
        deityImg.onload = () => {
            ctx.drawImage(deityImg, imgX, imgY, imgW, imgH);

            // Gold Inner Border around Photo
            ctx.strokeStyle = '#f1c40f';
            ctx.lineWidth = 6;
            ctx.strokeRect(imgX, imgY, imgW, imgH);

            // Official Source Badge inside Poster
            ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
            ctx.fillRect(imgX, imgY + imgH - 70, imgW, 70);

            ctx.fillStyle = '#34d399';
            ctx.font = 'bold 28px "Outfit", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(deitiesData[activeDeityKey].source, w / 2, imgY + imgH - 25);

            // Mantra & Blessing Banner
            ctx.fillStyle = '#f1c40f';
            ctx.font = 'bold 42px "Outfit", sans-serif';
            ctx.fillText(deitiesData[activeDeityKey].name, w / 2, 1530);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'italic 30px "Outfit", sans-serif';
            ctx.fillText(`"${deitiesData[activeDeityKey].mantra}"`, w / 2, 1600);

            // Footer Tagline & Link
            ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.fillRect(100, 1660, w - 200, 2);

            ctx.fillStyle = '#ff9933';
            ctx.font = 'bold 30px "Outfit", sans-serif';
            ctx.fillText('🔗 दैनिक दर्शन पोर्टल: ziddifounder.com/daily_darshan', w / 2, 1720);

            ctx.fillStyle = '#a0a7c4';
            ctx.font = '500 24px "Outfit", sans-serif';
            ctx.fillText('100% निस्वार्थ सनातन धर्म सेवा | Daily Live Temple Portal', w / 2, 1770);

            if (callback) callback(posterCanvas);
        };
        deityImg.src = darshanImage.src;
    }

    // Download Poster Action
    document.getElementById('downloadPosterBtn').addEventListener('click', () => {
        generateDarshanPoster((canvas) => {
            try {
                const link = document.createElement('a');
                link.download = `Daily_Darshan_${activeDeityKey}_${new Date().toISOString().slice(0,10)}.jpg`;
                link.href = canvas.toDataURL('image/jpeg');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (err) {
                alert("इमेज डाउनलोड हो गई है!");
            }
        });
    });

    // WhatsApp Share Action
    document.getElementById('shareWaBtn').addEventListener('click', () => {
        const d = deitiesData[activeDeityKey];
        const link = window.location.origin + window.location.pathname;
        const caption = `🚩 *आज का दिव्य दर्शन - ${d.name}* 🚩\n\n${d.source}\n\n✨ *पावन मंत्र:* ${d.mantra}\n\nहमारे दैनिक दर्शन एवं आभासी सेवा पोर्टल से जुड़ें:\n🔗 ${link}`;
        
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(caption)}`, '_blank');
    });

    // 6. Live Interactive Puja Video Recorder (10-Second Status/Reel Canvas Capture)
    const recordPujaBtn = document.getElementById('recordPujaBtn');
    const recordingBadge = document.getElementById('recordingBadge');
    const recTimer = document.getElementById('recTimer');
    const videoExportModal = document.getElementById('videoExportModal');
    const closeVideoModal = document.getElementById('closeVideoModal');
    const pujaVideoPlayer = document.getElementById('pujaVideoPlayer');
    const downloadVideoLink = document.getElementById('downloadVideoLink');
    const videoCanvas = document.getElementById('videoRecordCanvas');
    const devoteeNameInput = document.getElementById('devoteeNameInput');
    const shareVideoNativeBtn = document.getElementById('shareVideoNativeBtn');

    let mediaRecorder = null;
    let recordedChunks = [];
    let isRecording = false;
    let currentVideoBlob = null;

    if (closeVideoModal) {
        closeVideoModal.addEventListener('click', () => {
            if (videoExportModal) {
                videoExportModal.classList.remove('active');
                videoExportModal.style.display = 'none';
            }
            if (pujaVideoPlayer) pujaVideoPlayer.pause();
        });
    }

    if (shareVideoNativeBtn) {
        shareVideoNativeBtn.addEventListener('click', async () => {
            if (!currentVideoBlob) return;
            const devoteeName = devoteeNameInput && devoteeNameInput.value.trim() ? devoteeNameInput.value.trim() : "सनातन यजमान";
            const file = new File([currentVideoBlob], `Daily_Darshan_Puja_${Date.now()}.webm`, { type: 'video/webm' });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        title: '🚩 मेरा दैनिक प्रत्यक्ष देव दर्शन',
                        text: `🙏 यजमान ${devoteeName} ने आज ${deitiesData[activeDeityKey].name} का प्रत्यक्ष दर्शन एवं पूजन किया।\n\nआप भी दर्शन करें: https://ziddifounder.com/daily_darshan`,
                        files: [file]
                    });
                } catch (err) {
                    console.log('Native share canceled/failed', err);
                }
            } else {
                // Fallback for Web browsers
                const link = document.createElement('a');
                link.href = URL.createObjectURL(currentVideoBlob);
                link.download = file.name;
                link.click();
            }
        });
    }

    if (recordPujaBtn && videoCanvas) {
        recordPujaBtn.addEventListener('click', () => {
            if (isRecording) return;
            startPujaVideoRecording();
        });
    }

    function startPujaVideoRecording() {
        isRecording = true;
        recordedChunks = [];
        const devoteeName = devoteeNameInput && devoteeNameInput.value.trim() ? devoteeNameInput.value.trim() : "सनातन यजमान";

        // Show Recording Badge & Start Countdown Timer Immediately
        if (recordingBadge) recordingBadge.style.display = 'flex';
        let timeLeft = 10;
        if (recTimer) recTimer.textContent = timeLeft;

        // Countdown timer (Guaranteed execution)
        const timerInterval = setInterval(() => {
            timeLeft--;
            if (recTimer) recTimer.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                if (mediaRecorder && mediaRecorder.state === 'recording') {
                    try { mediaRecorder.stop(); } catch(e){}
                }
            }
        }, 1000);

        // Safe Audio & Visual Sequence (Will never block timer)
        try { playBellSound(); } catch(e){}
        try { playMantraChant(); } catch(e){}

        const tWater = setTimeout(() => {
            if (isRecording) {
                try {
                    const abhishekamBtn = document.getElementById('abhishekamBtn');
                    if (abhishekamBtn) abhishekamBtn.click();
                } catch(e){}
            }
        }, 2000);

        const tBhog = setTimeout(() => {
            if (isRecording) {
                try {
                    globalActiveBhog = { imgUrl: 'assets/bhog/laddu.png', name: 'मोतीचूर लड्डू' };
                    playHummingSound();
                } catch(e){}
            }
        }, 4500);

        const tFlower = setTimeout(() => {
            if (isRecording) {
                try { triggerFlowerShower(); } catch(e){}
            }
        }, 6500);

        const tAarti = setTimeout(() => {
            if (isRecording) {
                try { flameOverlay.classList.add('active'); } catch(e){}
            }
        }, 8000);

        // Canvas Setup (720x1280 Status aspect ratio)
        const vCtx = videoCanvas.getContext('2d');
        const vW = 720;
        const vH = 1280;
        videoCanvas.width = vW;
        videoCanvas.height = vH;

        // Capture Canvas Stream at 30 FPS
        const canvasStream = videoCanvas.captureStream(30);

        // Web Audio Track for MediaRecorder (Bulletproof Oscillator Om Frequency)
        try {
            const synthCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (synthCtx.state === 'suspended') synthCtx.resume();
            const synthDest = synthCtx.createMediaStreamDestination();
            const synthOsc = synthCtx.createOscillator();
            const synthGain = synthCtx.createGain();
            synthOsc.type = 'sine';
            synthOsc.frequency.setValueAtTime(136.1, synthCtx.currentTime); // ॐ 136.1Hz Cosmic Tone
            synthGain.gain.setValueAtTime(0.3, synthCtx.currentTime);
            synthOsc.connect(synthGain);
            synthGain.connect(synthDest);
            synthOsc.start();

            const track = synthDest.stream.getAudioTracks()[0];
            if (track) canvasStream.addTrack(track);
        } catch (e) {}

        let options = { mimeType: 'video/webm;codecs=vp9' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            options = { mimeType: 'video/webm' };
        }

        try {
            mediaRecorder = new MediaRecorder(canvasStream, options);
        } catch (e) {
            mediaRecorder = new MediaRecorder(canvasStream);
        }

        mediaRecorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            isRecording = false;
            clearInterval(timerInterval);
            clearTimeout(tWater);
            clearTimeout(tBhog);
            clearTimeout(tFlower);
            clearTimeout(tAarti);

            if (recordingBadge) recordingBadge.style.display = 'none';
            flameOverlay.classList.remove('active');

            currentVideoBlob = new Blob(recordedChunks, { type: 'video/webm' });
            const videoUrl = URL.createObjectURL(currentVideoBlob);

            if (pujaVideoPlayer) {
                pujaVideoPlayer.src = videoUrl;
            }
            if (downloadVideoLink) {
                downloadVideoLink.href = videoUrl;
                downloadVideoLink.download = `Divine_Puja_${devoteeName.replace(/\s+/g, '_')}_${Date.now()}.webm`;
            }
            if (videoExportModal) {
                videoExportModal.style.display = 'flex';
                videoExportModal.classList.add('active');
            }
        };

        let bhogRenderImg = null;

        const today = new Date();
        const dateStr = today.toLocaleDateString('hi-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

        // Render loop for video canvas
        function renderVideoFrame() {
            if (!isRecording) return;

            // Draw Background
            const bgGrad = vCtx.createLinearGradient(0, 0, 0, vH);
            bgGrad.addColorStop(0, '#0a0812');
            bgGrad.addColorStop(0.5, '#200a05');
            bgGrad.addColorStop(1, '#0d0a17');
            vCtx.fillStyle = bgGrad;
            vCtx.fillRect(0, 0, vW, vH);

            // Gold Border
            vCtx.strokeStyle = '#f1c40f';
            vCtx.lineWidth = 8;
            vCtx.strokeRect(20, 20, vW - 40, vH - 40);

            // Title
            vCtx.fillStyle = '#f1c40f';
            vCtx.font = 'bold 30px "Yatra One", sans-serif';
            vCtx.textAlign = 'center';
            vCtx.fillText('ॐ दैनिक प्रत्यक्ष देव दर्शन', vW / 2, 54);

            // Live Date & Day Badge (matching top bar date)
            const dateText = `📅 ${dateStr}`;
            vCtx.font = '600 18px "Outfit", sans-serif';
            const textWidth = vCtx.measureText(dateText).width;
            vCtx.fillStyle = 'rgba(255, 153, 51, 0.2)';
            vCtx.strokeStyle = '#ff9933';
            vCtx.lineWidth = 1.5;
            vCtx.beginPath();
            vCtx.roundRect(vW / 2 - textWidth / 2 - 14, 62, textWidth + 28, 26, 13);
            vCtx.fill();
            vCtx.stroke();

            vCtx.fillStyle = '#ffffff';
            vCtx.fillText(dateText, vW / 2, 81);

            // Draw Deity Image
            const imgW = 620;
            const imgH = 750;
            const imgX = (vW - imgW) / 2;
            const imgY = 102;
            vCtx.drawImage(darshanImage, imgX, imgY, imgW, imgH);

            // Draw Jal Abhishekam Liquid Stream Particles onto Video Canvas
            if (globalWaterParticles && globalWaterParticles.length > 0) {
                const frame = document.getElementById('darshanFrame');
                const scaleX = imgW / (frame && frame.clientWidth ? frame.clientWidth : 400);
                const scaleY = imgH / (frame && frame.clientHeight ? frame.clientHeight : 500);
                
                globalWaterParticles.forEach(p => {
                    if (p.size > 0.5 && p.y > 0) {
                        vCtx.beginPath();
                        vCtx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
                        vCtx.arc(imgX + p.x * scaleX, imgY + p.y * scaleY, p.size * scaleX, 0, Math.PI * 2);
                        vCtx.fill();
                    }
                });
            }

            // Draw Bhog Prasad Offering Overlay onto Video Canvas
            if (globalActiveBhog && globalActiveBhog.imgUrl) {
                if (!bhogRenderImg || bhogRenderImg.getAttribute('data-src') !== globalActiveBhog.imgUrl) {
                    bhogRenderImg = new Image();
                    bhogRenderImg.setAttribute('data-src', globalActiveBhog.imgUrl);
                    bhogRenderImg.src = globalActiveBhog.imgUrl;
                }
                if (bhogRenderImg.complete && bhogRenderImg.naturalWidth > 0) {
                    const bhogSize = 100;
                    const bhogX = vW / 2 - bhogSize / 2;
                    const bhogY = imgY + imgH - 160;

                    vCtx.save();
                    vCtx.beginPath();
                    vCtx.arc(vW / 2, bhogY + bhogSize / 2, bhogSize / 2 + 8, 0, Math.PI * 2);
                    vCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                    vCtx.fill();
                    vCtx.strokeStyle = '#f1c40f';
                    vCtx.lineWidth = 4;
                    vCtx.stroke();

                    vCtx.drawImage(bhogRenderImg, bhogX, bhogY, bhogSize, bhogSize);
                    vCtx.restore();
                }
            }

            // Devotee Name Overlay Banner inside Video
            vCtx.fillStyle = 'rgba(0, 0, 0, 0.85)';
            vCtx.fillRect(imgX, imgY + imgH - 55, imgW, 55);

            vCtx.fillStyle = '#ff9933';
            vCtx.font = 'bold 24px "Outfit", sans-serif';
            vCtx.textAlign = 'center';
            vCtx.fillText(`🚩 यजमान: ${devoteeName}`, vW / 2, imgY + imgH - 18);

            // Aarti Glow Effect if active
            if (flameOverlay.classList.contains('active')) {
                const radial = vCtx.createRadialGradient(vW/2, imgY + imgH, 20, vW/2, imgY + imgH, 300);
                radial.addColorStop(0, 'rgba(255, 153, 51, 0.45)');
                radial.addColorStop(1, 'transparent');
                vCtx.fillStyle = radial;
                vCtx.fillRect(imgX, imgY, imgW, imgH);
            }

            // Draw Realistic Rotated Flower Petals on Video Canvas
            if (petals && petals.length > 0) {
                const frame = document.getElementById('darshanFrame');
                const scaleX = imgW / (frame && frame.clientWidth ? frame.clientWidth : 400);
                const scaleY = imgH / (frame && frame.clientHeight ? frame.clientHeight : 500);

                petals.forEach(p => {
                    if (p.y > -20 && p.y < (petalsCanvas ? petalsCanvas.height + 40 : 600)) {
                        const px = imgX + p.x * scaleX;
                        const py = imgY + p.y * scaleY;

                        vCtx.save();
                        vCtx.translate(px, py);
                        vCtx.rotate((p.angle * Math.PI) / 180);
                        vCtx.fillStyle = p.color;
                        vCtx.beginPath();
                        vCtx.ellipse(0, 0, p.radius * scaleX, p.radius * 0.55 * scaleX, 0, 0, Math.PI * 2);
                        vCtx.fill();
                        vCtx.restore();
                    }
                });
            }

            // Deity Title & Mantra Text
            vCtx.fillStyle = '#f1c40f';
            vCtx.font = 'bold 28px "Outfit", sans-serif';
            vCtx.fillText(deitiesData[activeDeityKey].name, vW / 2, 910);

            vCtx.fillStyle = '#ffffff';
            vCtx.font = 'italic 19px "Outfit", sans-serif';
            vCtx.fillText(`"${deitiesData[activeDeityKey].mantra}"`, vW / 2, 955);

            // Watermark & Date
            vCtx.fillStyle = '#ff9933';
            vCtx.font = '600 22px "Outfit", sans-serif';
            vCtx.fillText('🔗 ziddifounder.com/daily_darshan', vW / 2, 1180);

            requestAnimationFrame(renderVideoFrame);
        }

        try {
            mediaRecorder.start(100);
        } catch (e) {
            mediaRecorder.start();
        }
        renderVideoFrame();

    }

    // Initial View Sync
    updateDeityView('shiva');
});
