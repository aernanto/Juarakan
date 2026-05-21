(function () {
    'use strict';

    // ============ NAVBAR ============
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const toTop = document.getElementById('toTop');

    const onScroll = () => {
        const y = window.scrollY;
        navbar.classList.toggle('scrolled', y > 8);
        toTop.classList.toggle('visible', y > 600);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ============ MOBILE MENU ============
    hamburger.addEventListener('click', () => {
        const open = hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', open);
        mobileMenu.setAttribute('aria-hidden', !open);
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
        });
    });

    // ============ REVEAL ON SCROLL ============
    const revealTargets = document.querySelectorAll(
        '.section-head, .problem-card, .feature-card, .step, .stat-card, .testi-card, .faq-item, .cta-card, .hero-copy, .hero-visual'
    );

    revealTargets.forEach((el) => el.classList.add('reveal'));

    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, i) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => entry.target.classList.add('visible'), i * 60);
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
        );

        revealTargets.forEach((el) => io.observe(el));
    } else {
        revealTargets.forEach((el) => el.classList.add('visible'));
    }

    // ============ STATS COUNTER ============
    const statNums = document.querySelectorAll('.stat-num[data-target]');
    let statsAnimated = false;

    const animateCounter = (el) => {
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.querySelector('span') ? el.querySelector('span').outerHTML : '';
        const duration = 1600;
        const startTime = performance.now();

        const tick = (now) => {
            const t = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            const current = Math.floor(target * eased);
            el.innerHTML = current.toLocaleString('id-ID') + suffix;
            if (t < 1) requestAnimationFrame(tick);
            else el.innerHTML = target.toLocaleString('id-ID') + suffix;
        };

        requestAnimationFrame(tick);
    };

    if (statNums.length && 'IntersectionObserver' in window) {
        const statIO = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !statsAnimated) {
                        statsAnimated = true;
                        statNums.forEach(animateCounter);
                    }
                });
            },
            { threshold: 0.4 }
        );

        const statsSection = document.querySelector('.stats');
        if (statsSection) statIO.observe(statsSection);
    }

    // ============ FAQ ACCORDION (one open at a time) ============
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
        item.addEventListener('toggle', (e) => {
            if (item.open) {
                faqItems.forEach((other) => {
                    if (other !== item) other.open = false;
                });
            }
        });
    });

    // ============ FEATURE CARD KEYBOARD INTERACTION ============
    document.querySelectorAll('.feature-card').forEach((card) => {
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = card.querySelector('.feature-link');
                if (link) link.click();
            }
        });
    });

    // ============ PARALLAX FLOAT CARDS (subtle, desktop only) ============
    const phoneWrap = document.querySelector('.phone-wrap');
    if (phoneWrap && window.matchMedia('(min-width: 1025px) and (hover: hover)').matches) {
        const floatCards = document.querySelectorAll('.float-card');
        const heroSection = document.querySelector('.hero');

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            floatCards.forEach((card, i) => {
                const depth = (i + 1) * 6;
                card.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
            });
        });

        heroSection.addEventListener('mouseleave', () => {
            floatCards.forEach((card) => {
                card.style.transform = '';
            });
        });
    }

    // ============ SMOOTH SCROLL OFFSET ============
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (id.length <= 1) return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const offset = navbar.offsetHeight + 12;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
})();
