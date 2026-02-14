/* ================================================
   Valentine's Day Website - JavaScript
   Interactive Effects & Animations
   ================================================ */

// === GLOBAL STATE ===
let musicPlaying = false;
let audioCtx = null;
let melodyInterval = null;
let gainNode = null;

// === ROMANTIC PIANO SYNTHESIZER ===
function createRomanticPiano() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // Master volume
    gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.35;

    // Reverb via convolver (simple delay-based)
    const convolver = audioCtx.createConvolver();
    const reverbTime = 2.5;
    const sampleRate = audioCtx.sampleRate;
    const length = sampleRate * reverbTime;
    const impulse = audioCtx.createBuffer(2, length, sampleRate);
    for (let ch = 0; ch < 2; ch++) {
        const data = impulse.getChannelData(ch);
        for (let i = 0; i < length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
        }
    }
    convolver.buffer = impulse;

    // Dry/Wet mix
    const dryGain = audioCtx.createGain();
    dryGain.gain.value = 0.6;
    const wetGain = audioCtx.createGain();
    wetGain.gain.value = 0.4;

    gainNode.connect(dryGain);
    gainNode.connect(convolver);
    convolver.connect(wetGain);
    dryGain.connect(audioCtx.destination);
    wetGain.connect(audioCtx.destination);

    return { audioCtx, gainNode };
}

function playNote(freq, startTime, duration, velocity = 0.5) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const noteGain = audioCtx.createGain();

    // Soft piano-like tone (sine + quiet harmonics)
    osc.type = 'sine';
    osc.frequency.value = freq;

    // Piano envelope: quick attack, gradual decay
    const t = startTime;
    noteGain.gain.setValueAtTime(0, t);
    noteGain.gain.linearRampToValueAtTime(velocity, t + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(velocity * 0.3, t + duration * 0.5);
    noteGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(noteGain);
    noteGain.connect(gainNode);

    osc.start(t);
    osc.stop(t + duration);

    // Add a subtle second harmonic for warmth
    const osc2 = audioCtx.createOscillator();
    const noteGain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 2;
    noteGain2.gain.setValueAtTime(0, t);
    noteGain2.gain.linearRampToValueAtTime(velocity * 0.15, t + 0.02);
    noteGain2.gain.exponentialRampToValueAtTime(0.001, t + duration * 0.7);
    osc2.connect(noteGain2);
    noteGain2.connect(gainNode);
    osc2.start(t);
    osc2.stop(t + duration);
}

function noteFreq(note) {
    const notes = {
        'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
        'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
        'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
        'Eb3': 155.56, 'Ab3': 207.65, 'Bb3': 233.08,
        'Eb4': 311.13, 'Ab4': 415.30, 'Bb4': 466.16,
        'Eb5': 622.25, 'Ab5': 830.61, 'Bb5': 932.33
    };
    return notes[note] || 440;
}

function playRomanticMelody() {
    if (!audioCtx) createRomanticPiano();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    // Beautiful romantic melody in C major / A minor
    const melody = [
        // Phrase 1 - gentle ascending
        { note: 'E4', time: 0.0, dur: 0.8, vel: 0.4 },
        { note: 'G4', time: 0.7, dur: 0.6, vel: 0.35 },
        { note: 'A4', time: 1.3, dur: 0.9, vel: 0.45 },
        { note: 'G4', time: 2.1, dur: 0.5, vel: 0.3 },
        { note: 'E4', time: 2.6, dur: 1.0, vel: 0.4 },

        // Phrase 2 - tender descending
        { note: 'C5', time: 3.8, dur: 1.0, vel: 0.5 },
        { note: 'B4', time: 4.7, dur: 0.5, vel: 0.35 },
        { note: 'A4', time: 5.2, dur: 0.8, vel: 0.4 },
        { note: 'G4', time: 5.9, dur: 0.6, vel: 0.35 },
        { note: 'F4', time: 6.5, dur: 1.2, vel: 0.45 },

        // Phrase 3 - emotional peak
        { note: 'E4', time: 7.8, dur: 0.5, vel: 0.35 },
        { note: 'A4', time: 8.3, dur: 0.5, vel: 0.4 },
        { note: 'C5', time: 8.8, dur: 0.6, vel: 0.5 },
        { note: 'D5', time: 9.4, dur: 0.8, vel: 0.55 },
        { note: 'E5', time: 10.2, dur: 1.4, vel: 0.5 },

        // Phrase 4 - gentle resolution
        { note: 'D5', time: 11.7, dur: 0.6, vel: 0.4 },
        { note: 'C5', time: 12.3, dur: 0.7, vel: 0.45 },
        { note: 'A4', time: 13.0, dur: 0.5, vel: 0.35 },
        { note: 'G4', time: 13.5, dur: 0.8, vel: 0.4 },
        { note: 'E4', time: 14.3, dur: 1.5, vel: 0.35 },

        // Phrase 5 - dreamy ending
        { note: 'F4', time: 16.0, dur: 0.7, vel: 0.3 },
        { note: 'A4', time: 16.7, dur: 0.6, vel: 0.4 },
        { note: 'G4', time: 17.3, dur: 0.8, vel: 0.45 },
        { note: 'E4', time: 18.1, dur: 0.6, vel: 0.35 },
        { note: 'C4', time: 18.7, dur: 2.0, vel: 0.4 },
    ];

    // Left hand chords (soft accompaniment)
    const chords = [
        { notes: ['C3', 'G3', 'E4'], time: 0.0, dur: 3.5, vel: 0.15 },
        { notes: ['A3', 'E4', 'C4'], time: 3.8, dur: 3.0, vel: 0.15 },
        { notes: ['F3', 'C4', 'A3'], time: 6.5, dur: 1.2, vel: 0.12 },
        { notes: ['C3', 'G3', 'E4'], time: 7.8, dur: 2.5, vel: 0.15 },
        { notes: ['F3', 'A3', 'C4'], time: 10.2, dur: 1.5, vel: 0.18 },
        { notes: ['G3', 'B3', 'D4'], time: 11.7, dur: 2.0, vel: 0.15 },
        { notes: ['A3', 'C4', 'E4'], time: 13.5, dur: 2.5, vel: 0.12 },
        { notes: ['F3', 'A3', 'C4'], time: 16.0, dur: 2.0, vel: 0.12 },
        { notes: ['C3', 'E3', 'G3'], time: 18.1, dur: 2.5, vel: 0.15 },
    ];

    const now = audioCtx.currentTime + 0.1;
    const melodyLength = 21; // seconds per loop

    // Play melody
    melody.forEach(n => {
        playNote(noteFreq(n.note), now + n.time, n.dur, n.vel);
    });

    // Play chords
    chords.forEach(c => {
        c.notes.forEach(note => {
            playNote(noteFreq(note), now + c.time, c.dur, c.vel);
        });
    });

    // Loop the melody
    melodyInterval = setTimeout(() => {
        if (musicPlaying) playRomanticMelody();
    }, melodyLength * 1000);
}

function stopMusic() {
    musicPlaying = false;
    if (melodyInterval) {
        clearTimeout(melodyInterval);
        melodyInterval = null;
    }
}

function startMusic() {
    musicPlaying = true;
    playRomanticMelody();
}

// === ENVELOPE CLICK → OPEN MAIN CONTENT ===
document.getElementById('envelope').addEventListener('click', function () {
    const introScreen = document.getElementById('introScreen');
    const mainContent = document.getElementById('mainContent');

    // Launch confetti!
    launchConfetti();

    // Auto-play romantic piano music on user interaction
    const toggle = document.getElementById('musicToggle');
    const icon = document.getElementById('musicIcon');
    startMusic();
    toggle.classList.add('playing');
    icon.textContent = '🎶';

    // Hide intro
    setTimeout(() => {
        introScreen.classList.add('hidden');
    }, 200);

    // Show main content
    setTimeout(() => {
        mainContent.classList.add('visible');
        initScrollReveal();
    }, 900);

    // Remove intro completely after animation
    setTimeout(() => {
        introScreen.style.display = 'none';
    }, 1700);
});

// === FLOATING HEARTS BACKGROUND ===
function createFloatingHearts() {
    const heartsBg = document.getElementById('heartsBg');
    const hearts = ['❤️', '💗', '💖', '💕', '💝', '🩷', '♥️', '💘', '🌹'];

    function spawnHeart() {
        const heart = document.createElement('span');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

        const size = Math.random() * 20 + 12;
        const left = Math.random() * 100;
        const duration = Math.random() * 8 + 8;
        const delay = Math.random() * 2;

        heart.style.cssText = `
            left: ${left}%;
            font-size: ${size}px;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;

        heartsBg.appendChild(heart);

        // Remove heart after animation
        setTimeout(() => {
            if (heart.parentNode) {
                heart.remove();
            }
        }, (duration + delay) * 1000);
    }

    // Spawn hearts periodically
    setInterval(spawnHeart, 600);

    // Initial batch
    for (let i = 0; i < 15; i++) {
        setTimeout(spawnHeart, i * 200);
    }
}

// === SPARKLE CURSOR EFFECT ===
function initSparkles() {
    const container = document.getElementById('sparkleContainer');
    const sparkles = ['✨', '💫', '⭐', '💕', '🩷'];
    let lastSparkle = 0;

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastSparkle < 80) return; // Throttle
        lastSparkle = now;

        const sparkle = document.createElement('span');
        sparkle.className = 'sparkle';
        sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];

        const dx = (Math.random() - 0.5) * 60;
        const dy = (Math.random() - 0.5) * 60 - 20;

        sparkle.style.left = e.clientX + 'px';
        sparkle.style.top = e.clientY + 'px';
        sparkle.style.setProperty('--dx', dx + 'px');
        sparkle.style.setProperty('--dy', dy + 'px');

        container.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 800);
    });
}

// === FLIP CARD ===
function flipCard(card) {
    card.classList.toggle('flipped');

    // Small heart burst on flip
    if (card.classList.contains('flipped')) {
        createHeartBurst(card);
    }
}

// === HEART BURST EFFECT ===
function createHeartBurst(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const hearts = ['❤️', '💗', '💖', '💕'];

    for (let i = 0; i < 8; i++) {
        const heart = document.createElement('span');
        heart.className = 'sparkle';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.fontSize = '18px';

        const angle = (Math.PI * 2 * i) / 8;
        const distance = 60 + Math.random() * 40;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        heart.style.left = centerX + 'px';
        heart.style.top = centerY + 'px';
        heart.style.setProperty('--dx', dx + 'px');
        heart.style.setProperty('--dy', dy + 'px');

        document.getElementById('sparkleContainer').appendChild(heart);
        setTimeout(() => heart.remove(), 800);
    }
}

// === CONFETTI LAUNCH ===
function launchConfetti() {
    const colors = ['#ff4b8a', '#ff8fab', '#ffd700', '#e91e63', '#ff6b6b', '#ff1493', '#ffd6e7'];
    const emojis = ['❤️', '💗', '💖', '💕', '🌹', '🎀', '✨'];

    for (let i = 0; i < 60; i++) {
        setTimeout(() => {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';

            // Mix of emoji and colored squares
            if (Math.random() > 0.5) {
                piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                piece.style.fontSize = (12 + Math.random() * 16) + 'px';
            } else {
                piece.style.width = (6 + Math.random() * 8) + 'px';
                piece.style.height = (6 + Math.random() * 8) + 'px';
                piece.style.background = colors[Math.floor(Math.random() * colors.length)];
                piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            }

            piece.style.left = Math.random() * 100 + 'vw';
            piece.style.animationDuration = (2 + Math.random() * 3) + 's';
            piece.style.animationDelay = Math.random() * 0.5 + 's';

            document.body.appendChild(piece);

            setTimeout(() => piece.remove(), 5500);
        }, i * 30);
    }
}

// === SCROLL REVEAL ===
function initScrollReveal() {
    const sections = document.querySelectorAll('.love-letter-section, .reasons-section, .wish-section, .gallery-section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal', 'visible');

                // Animate children with stagger
                const cards = entry.target.querySelectorAll('.reason-card, .wish-card, .mosaic-item');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    sections.forEach(section => observer.observe(section));
}

// === MUSIC TOGGLE ===
function toggleMusic() {
    const toggle = document.getElementById('musicToggle');
    const icon = document.getElementById('musicIcon');

    if (musicPlaying) {
        stopMusic();
        toggle.classList.remove('playing');
        icon.textContent = '🎵';
    } else {
        startMusic();
        toggle.classList.add('playing');
        icon.textContent = '🎶';
    }
}

// === TYPING EFFECT FOR LETTER (Optional Enhancement) ===
function typewriterEffect(element, text, speed = 30) {
    let index = 0;
    element.textContent = '';

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }
    type();
}

// === PARALLAX ON HERO HEARTS ===
function initParallax() {
    const heroHearts = document.querySelectorAll('.hero-heart');

    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        heroHearts.forEach((heart, index) => {
            const speed = (index + 1) * 8;
            heart.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });
}

// === SMOOTH SCROLL FOR SCROLL INDICATOR ===
document.addEventListener('click', (e) => {
    if (e.target.closest('.scroll-indicator')) {
        const letterSection = document.getElementById('loveLetter');
        if (letterSection) {
            letterSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// === EASTER EGG: Double-click anywhere for heart explosion ===
document.addEventListener('dblclick', (e) => {
    const hearts = ['❤️', '💗', '💖', '💕', '💝', '🩷', '💘'];
    for (let i = 0; i < 12; i++) {
        const heart = document.createElement('span');
        heart.className = 'sparkle';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.fontSize = (16 + Math.random() * 20) + 'px';

        const angle = (Math.PI * 2 * i) / 12;
        const distance = 80 + Math.random() * 60;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        heart.style.left = e.clientX + 'px';
        heart.style.top = e.clientY + 'px';
        heart.style.setProperty('--dx', dx + 'px');
        heart.style.setProperty('--dy', dy + 'px');
        heart.style.animationDuration = '1.2s';

        document.getElementById('sparkleContainer').appendChild(heart);
        setTimeout(() => heart.remove(), 1200);
    }
});

// === INITIALIZE EVERYTHING ===
document.addEventListener('DOMContentLoaded', () => {
    createFloatingHearts();
    initSparkles();
    initParallax();
});
