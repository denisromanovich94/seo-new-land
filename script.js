// Smooth scroll functionality
document.addEventListener('DOMContentLoaded', function() {
    // Handle smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
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

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('[class*="animate-"]');
    animatedElements.forEach(el => observer.observe(el));

    // Services button click handler
    const servicesBtn = document.getElementById('servicesBtn');
    if (servicesBtn) {
        servicesBtn.addEventListener('click', function() {
            const servicesSection = document.getElementById('services');
            if (servicesSection) {
                const headerOffset = 80;
                const elementPosition = servicesSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Header scroll effect
    let lastScroll = 0;
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.style.boxShadow = 'none';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });

    // Add visible class to elements already in viewport on page load
    setTimeout(() => {
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('visible');
            }
        });
    }, 100);

    // Price Calculator
    const keywordsSelect = document.getElementById('keywords');
    const siteTypeSelect = document.getElementById('siteType');
    const competitionSelect = document.getElementById('competition');
    const calculatedPrice = document.getElementById('calculatedPrice');

    function updatePrice() {
        if (keywordsSelect && siteTypeSelect && competitionSelect && calculatedPrice) {
            const keywordsPrice = parseInt(keywordsSelect.value) || 0;
            const siteTypePrice = parseInt(siteTypeSelect.value) || 0;
            const competitionPrice = parseInt(competitionSelect.value) || 0;

            const totalPrice = keywordsPrice + siteTypePrice + competitionPrice;

            // Format number with spaces
            calculatedPrice.textContent = totalPrice.toLocaleString('ru-RU');
        }
    }

    if (keywordsSelect) keywordsSelect.addEventListener('change', updatePrice);
    if (siteTypeSelect) siteTypeSelect.addEventListener('change', updatePrice);
    if (competitionSelect) competitionSelect.addEventListener('change', updatePrice);

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });

    // Form submissions (basic handling - prevents default)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
            form.reset();
            if (form.id === 'calcForm') {
                updatePrice();
            }
        });
    });

    // Duplicate logos for smooth marquee effect
    const logosTrack = document.querySelector('.logos-track');
    if (logosTrack) {
        const logosContent = logosTrack.innerHTML;
        logosTrack.innerHTML = logosContent + logosContent;
    }

    // Initialize Cases Swiper
    const casesSwiper = new Swiper('.casesSwiper', {
        // Slides per view configuration
        slidesPerView: 1,
        spaceBetween: 20,

        // Breakpoints for responsive design
        breakpoints: {
            // When window width is >= 640px (tablet)
            640: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            // When window width is >= 1024px (desktop)
            1024: {
                slidesPerView: 3,
                spaceBetween: 30
            }
        },

        // Enable loop mode
        loop: true,

        // Autoplay configuration
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },

        // Enable mouse wheel scrolling
        mousewheel: {
            forceToAxis: true,
            sensitivity: 1,
        },

        // Enable keyboard control
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },

        // Enable grab cursor
        grabCursor: true,

        // Smooth animations
        speed: 600,

        // Accessibility
        a11y: {
            enabled: true,
            prevSlideMessage: 'Предыдущий слайд',
            nextSlideMessage: 'Следующий слайд',
        },
    });
});

// Console log for debugging
console.log('SEO BURO - Website loaded successfully');
