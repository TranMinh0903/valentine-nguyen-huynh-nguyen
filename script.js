/* ================================================
   Valentine's Day Website - JavaScript
   Interactive Effects & Animations
   ================================================ */

// === GLOBAL STATE ===
let musicPlaying = false;

// === ENVELOPE CLICK → OPEN MAIN CONTENT ===
document.getElementById('envelope').addEventListener('click', function () {
    const introScreen = document.getElementById('introScreen');
    const mainContent = document.getElementById('mainContent');

    // Launch confetti!
    launchConfetti();

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
    const audio = document.getElementById('bgMusic');
    const toggle = document.getElementById('musicToggle');
    const icon = document.getElementById('musicIcon');

    if (musicPlaying) {
        audio.pause();
        toggle.classList.remove('playing');
        icon.textContent = '🎵';
    } else {
        audio.play().catch(() => {
            // Autoplay blocked — that's okay
            console.log('Autoplay blocked by browser');
        });
        toggle.classList.add('playing');
        icon.textContent = '🎶';
    }
    musicPlaying = !musicPlaying;
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
