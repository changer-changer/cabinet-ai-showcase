/**
 * TruthTeam v4.0 Showcase — Interactive JavaScript
 * Particle networks, scroll animations, tabs, counters
 */

(function() {
    'use strict';

    // ========================================
    // LOADER
    // ========================================
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.getElementById('loader').classList.add('hidden');
        }, 1600);
    });

    // ========================================
    // PARTICLE NETWORK CANVAS
    // ========================================
    class ParticleNetwork {
        constructor(canvas, options = {}) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.particles = [];
            this.options = {
                particleCount: options.particleCount || 70,
                connectionDistance: options.connectionDistance || 140,
                mouseDistance: options.mouseDistance || 180,
                speed: options.speed || 0.4,
                color: options.color || '212, 168, 83',
                ...options
            };
            this.mouse = { x: null, y: null };
            this.animationId = null;
            this.init();
        }

        init() {
            this.resize();
            this.createParticles();
            this.bindEvents();
            this.animate();
        }

        resize() {
            const rect = this.canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            this.canvas.width = rect.width * dpr;
            this.canvas.height = rect.height * dpr;
            this.ctx.scale(dpr, dpr);
            this.logicalWidth = rect.width;
            this.logicalHeight = rect.height;
        }

        createParticles() {
            this.particles = [];
            const w = this.logicalWidth;
            const h = this.logicalHeight;
            for (let i = 0; i < this.options.particleCount; i++) {
                this.particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * this.options.speed,
                    vy: (Math.random() - 0.5) * this.options.speed,
                    size: Math.random() * 1.5 + 0.5,
                    opacity: Math.random() * 0.4 + 0.1
                });
            }
        }

        bindEvents() {
            window.addEventListener('resize', () => {
                this.resize();
                this.createParticles();
            });

            this.canvas.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
            });

            this.canvas.addEventListener('mouseleave', () => {
                this.mouse.x = null;
                this.mouse.y = null;
            });
        }

        animate() {
            this.ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);
            const w = this.logicalWidth;
            const h = this.logicalHeight;

            // Update and draw particles
            for (let i = 0; i < this.particles.length; i++) {
                const p = this.particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;

                // Mouse repulsion
                if (this.mouse.x !== null && this.mouse.y !== null) {
                    const dx = p.x - this.mouse.x;
                    const dy = p.y - this.mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < this.options.mouseDistance) {
                        const force = (this.options.mouseDistance - dist) / this.options.mouseDistance;
                        p.x += dx * force * 0.02;
                        p.y += dy * force * 0.02;
                    }
                }

                // Draw particle
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(${this.options.color}, ${p.opacity})`;
                this.ctx.fill();
            }

            // Draw connections
            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const dx = this.particles[i].x - this.particles[j].x;
                    const dy = this.particles[i].y - this.particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < this.options.connectionDistance) {
                        const opacity = (1 - dist / this.options.connectionDistance) * 0.15;
                        this.ctx.beginPath();
                        this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        this.ctx.strokeStyle = `rgba(${this.options.color}, ${opacity})`;
                        this.ctx.lineWidth = 0.8;
                        this.ctx.stroke();
                    }
                }
            }

            this.animationId = requestAnimationFrame(() => this.animate());
        }
    }

    // Initialize particle networks
    const heroCanvas = document.getElementById('hero-canvas');
    if (heroCanvas) {
        new ParticleNetwork(heroCanvas, {
            particleCount: 80,
            connectionDistance: 150,
            color: '212, 168, 83'
        });
    }

    const ctaCanvas = document.getElementById('cta-canvas');
    if (ctaCanvas) {
        new ParticleNetwork(ctaCanvas, {
            particleCount: 50,
            connectionDistance: 120,
            color: '45, 125, 210'
        });
    }

    // ========================================
    // NAVBAR SCROLL EFFECT
    // ========================================
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // ========================================
    // MOBILE NAV TOGGLE
    // ========================================
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // ========================================
    // SCROLL REVEAL ANIMATION
    // ========================================
    const revealElements = document.querySelectorAll('.reveal-up');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ========================================
    // COUNTER ANIMATION
    // ========================================
    function animateCounter(el) {
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);
            el.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    const counters = document.querySelectorAll('.stat-number[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // ========================================
    // ARCHIVE EXPLORER TABS
    // ========================================
    const aeFolders = document.querySelectorAll('.ae-folder');
    const aePanels = document.querySelectorAll('.ae-panel');

    aeFolders.forEach(folder => {
        folder.addEventListener('click', () => {
            const target = folder.dataset.folder;

            aeFolders.forEach(f => f.classList.remove('active'));
            aePanels.forEach(p => p.classList.remove('active'));

            folder.classList.add('active');
            const panel = document.querySelector(`.ae-panel[data-panel="${target}"]`);
            if (panel) panel.classList.add('active');
        });
    });

    // ========================================
    // THINKING MODELS TABS
    // ========================================
    const msTabs = document.querySelectorAll('.ms-tab');
    const msPanels = document.querySelectorAll('.ms-panel');

    msTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.model;

            msTabs.forEach(t => t.classList.remove('active'));
            msPanels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const panel = document.querySelector(`.ms-panel[data-panel="${target}"]`);
            if (panel) panel.classList.add('active');
        });
    });

    // ========================================
    // COPY INSTALL COMMAND
    // ========================================
    window.copyInstall = function() {
        const cmd = document.querySelector('.install-cmd').textContent;
        navigator.clipboard.writeText(cmd).then(() => {
            const btn = document.querySelector('.copy-btn');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span>已复制</span>';
            btn.classList.add('copied');
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.classList.remove('copied');
            }, 2000);
        }).catch(() => {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = cmd;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        });
    };

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

})();
