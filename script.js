// script.js
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    // 1. Loading Screen Animation
    const loadingScreen = document.querySelector('.loading-screen');
    const heartbeat = document.querySelector('.heartbeat');
    
    gsap.to(heartbeat, {
        strokeDashoffset: 0,
        duration: 2,
        ease: "power2.inOut",
        onComplete: () => {
            gsap.to(loadingScreen, {
                yPercent: -100,
                duration: 0.8,
                ease: "power3.inOut",
                onComplete: () => initAnimations() // Start main animations after loading
            });
        }
    });

    // 2. Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    const cursorFollower = document.querySelector('.custom-cursor-follower');
    const interactives = document.querySelectorAll('.interactive, a, button, input, select, textarea');

    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
        gsap.to(cursorFollower, { x: e.clientX, y: e.clientY, duration: 0.3 });
    });

    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => cursorFollower.classList.add('hover-active'));
        el.addEventListener('mouseleave', () => cursorFollower.classList.remove('hover-active'));
    });

    // 3. Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
    });

    // 4. Scroll Progress & Back to Top
    const progressBar = document.querySelector('.scroll-progress-bar');
    const backToTop = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', () => {
        // Progress Bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';

        // Back to Top Visibility
        if (winScroll > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 5. Booking Form Success Animation
    const bookingForm = document.getElementById('bookingForm');
    const bookingSuccess = document.querySelector('.booking-success');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = bookingForm.querySelectorAll('input, select');
            const data = {
                department: inputs[0].value,
                doctorName: inputs[1].value,
                appointmentDate: inputs[2].value,
                timeSlot: inputs[3].value,
                patientName: inputs[4].value
            };
            fetch('/api/public/bookings', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(() => {
                const text = `Hello, I would like to confirm my appointment booking.
Name: ${data.patientName}
Department: ${data.department}
Doctor: ${data.doctorName}
Date: ${data.appointmentDate}
Time: ${data.timeSlot}`;
                const waUrl = `https://wa.me/916398363290?text=${encodeURIComponent(text)}`;
                window.open(waUrl, '_blank');

                gsap.to(bookingForm, { opacity: 0, height: 0, duration: 0.5, onComplete: () => {
                    bookingForm.classList.add('hidden');
                    bookingSuccess.classList.remove('hidden');
                    gsap.fromTo(bookingSuccess, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' });
                }});
            }).catch(err => console.error("Error booking:", err));
        });
    }

    // 6. Testimonial Carousel
    let carouselInterval;
    window.initCarousel = function(totalSlides) {
        const track = document.querySelector('.carousel-track');
        const dots = document.querySelectorAll('.dot');
        let currentSlide = 0;
        if(carouselInterval) clearInterval(carouselInterval);

        if (track && dots.length > 0) {
            carouselInterval = setInterval(() => {
                currentSlide = (currentSlide + 1) % totalSlides;
                gsap.to(track, { xPercent: -(currentSlide * (100 / totalSlides)), duration: 0.8, ease: 'power3.inOut' });
                dots.forEach((dot, index) => {
                    if (index === currentSlide) dot.classList.add('active');
                    else dot.classList.remove('active');
                });
            }, 6000);
        }
    }
    
    // Fallback static init
    initCarousel(2);

    // --- Dynamic Data Fetching ---
    function fetchDynamicData() {
        const API_BASE = '/api/public';
        
        // Fetch Doctors
        fetch(`${API_BASE}/doctors`)
            .then(res => res.json())
            .then(data => {
                const grid = document.querySelector('.mag-doctors-grid');
                if(data && data.length > 0 && grid) {
                    grid.innerHTML = '';
                    data.forEach((doc, i) => {
                        let fallbackImg = 'assets/doctor.png';
                        let imgUrl = doc.imageUrl ? doc.imageUrl : fallbackImg;
                        grid.innerHTML += `
                            <div class="mag-doctor-card interactive fade-up stagger-${i%3+1}">
                                <img src="${imgUrl}" alt="${doc.name}" class="mag-doc-img">
                                <div class="mag-doc-overlay">
                                    <div class="mag-doc-content">
                                        <h4>${doc.name}</h4>
                                        <p class="mag-doc-spec">${doc.specialization} &bull; ${doc.yearsOfExperience}</p>
                                        <a href="#booking" class="btn btn-outline slide-up-btn">Book Consultation</a>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                }
            }).catch(e => console.log('Error fetching doctors:', e));

        // Fetch Gallery
        fetch(`${API_BASE}/gallery`)
            .then(res => res.json())
            .then(data => {
                const grid = document.querySelector('.masonry-grid');
                if(data && data.length > 0 && grid) {
                    grid.innerHTML = '';
                    data.forEach(img => {
                        let imgUrl = img.imageUrl ? img.imageUrl : '';
                        grid.innerHTML += `
                            <div class="masonry-item interactive">
                                <img src="${imgUrl}" alt="${img.altText}">
                            </div>
                        `;
                    });
                }
            }).catch(e => console.log('Error fetching gallery:', e));

        // Fetch Testimonials
        fetch(`${API_BASE}/testimonials`)
            .then(res => res.json())
            .then(data => {
                const track = document.querySelector('.carousel-track');
                const dotsContainer = document.querySelector('.carousel-dots');
                if(data && data.length > 0 && track) {
                    track.innerHTML = '';
                    dotsContainer.innerHTML = '';
                    track.style.width = (data.length * 100) + '%';
                    data.forEach((t, i) => {
                        let stars = '★'.repeat(t.starRating) + '☆'.repeat(5-t.starRating);
                        let imgUrl = t.imageUrl ? t.imageUrl : 'assets/patient_1.png';
                        let imgHtml = `<img src="${imgUrl}" alt="Patient" class="patient-img">`;
                        track.innerHTML += `
                            <div class="testimonial-slide" style="width: ${100/data.length}%">
                                <div class="stars">${stars}</div>
                                <p class="quote">"${t.quote}"</p>
                                <div class="patient-info">
                                    ${imgHtml}
                                    <span class="patient-name">${t.patientName}</span>
                                </div>
                            </div>
                        `;
                        dotsContainer.innerHTML += `<button class="dot ${i===0 ? 'active' : ''}"></button>`;
                    });
                    initCarousel(data.length);
                }
            }).catch(e => console.log('Error fetching testimonials:', e));

        // Fetch Health Packages
        fetch(`${API_BASE}/packages`)
            .then(res => res.json())
            .then(data => {
                const grid = document.getElementById('packagesGrid');
                if(data && data.length > 0 && grid) {
                    grid.innerHTML = '';
                    data.forEach((pkg, i) => {
                        let featuresHtml = pkg.features.split(',').map(f => 
                            `<li><svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg> ${f.trim()}</li>`
                        ).join('');

                        let premiumClass = pkg.premium ? 'featured-glow' : '';
                        let badgeHtml = pkg.premium ? `<div class="glow-border"></div><div class="popular-badge">Premium Selection</div>` : '';
                        let btnClass = pkg.premium ? 'btn-primary' : 'btn-outline';

                        grid.innerHTML += `
                            <div class="package-card ${premiumClass} interactive fade-up stagger-${i%3+1}">
                                ${badgeHtml}
                                <h3>${pkg.title}</h3>
                                <div class="price">₹${pkg.price}</div>
                                <ul class="package-features">
                                    ${featuresHtml}
                                </ul>
                                <a href="#booking" class="btn ${btnClass} full-width">Select Package</a>
                            </div>
                        `;
                    });
                }
            }).catch(e => console.log('Error fetching packages:', e));
    }
    
    fetchDynamicData();

    // --- Core Animations Initialization ---
    function initAnimations() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        // Hero Reveal
        const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });
        
        heroTl.fromTo('.hero-bg-image', { scale: 1.1 }, { scale: 1, duration: 2 })
              .fromTo('.fade-up.eyebrow', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, "-=1.5")
              .fromTo('.fade-up.stagger-1', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, "-=1.3")
              .fromTo('.fade-up.stagger-2', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, "-=1.1")
              .fromTo('.fade-up.stagger-3', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.9")
              .fromTo('.float-anim-1', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.8")
              .fromTo('.float-anim-2', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
              .fromTo('.float-anim-3', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.4")
              .fromTo('.float-anim-4', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.2");

        // Counter Animations triggered when Hero Stats enter viewport
        ScrollTrigger.create({
            trigger: '.hero-stats',
            start: 'top 90%',
            onEnter: () => {
                document.querySelectorAll('.stat-num').forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    gsap.to(counter, {
                        innerHTML: target,
                        duration: 2,
                        snap: { innerHTML: 1 },
                        ease: "power2.out"
                    });
                });
            },
            once: true
        });

        // Parallax Hero BG
        gsap.to('.hero-bg-image', {
            yPercent: 30,
            ease: "none",
            ScrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

        // Global Scroll Reveals for .fade-up elements
        gsap.utils.toArray('.fade-up').forEach(element => {
            // Skip hero elements as they are animated in the initial timeline
            if (element.closest('.hero')) return; 
            
            gsap.fromTo(element, 
                { opacity: 0, y: 40 },
                { 
                    opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        // Sticky Journey Timeline highlights
        const stickySteps = gsap.utils.toArray('.huge-step');
        if (stickySteps.length > 0) {
            stickySteps.forEach((step, i) => {
                ScrollTrigger.create({
                    trigger: step,
                    start: 'top center',
                    end: 'bottom center',
                    toggleClass: 'active',
                });
            });
        }
    }
});
