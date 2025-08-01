document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    // Lógica para el menú móvil
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // --- LÓGICA DEL CARRUSEL ---
    const slides = document.querySelectorAll('.slide');
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length > 0) {
        // Crear indicadores
        slides.forEach((slide, index) => {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => setSlide(index));
            indicatorsContainer.appendChild(indicator);
        });

        const indicators = document.querySelectorAll('.indicator');

        const showSlide = () => {
            slides.forEach((slide, index) => {
                slide.classList.remove('active');
                indicators[index].classList.remove('active');
            });
            slides[currentSlide].classList.add('active');
            indicators[currentSlide].classList.add('active');
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide();
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide();
        };

        const setSlide = (index) => {
            currentSlide = index;
            showSlide();
            resetInterval();
        };

        const startInterval = () => {
            slideInterval = setInterval(nextSlide, 5000); // Cambia cada 5 segundos
        };

        const resetInterval = () => {
            clearInterval(slideInterval);
            startInterval();
        };

        // Event Listeners
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });

        // Iniciar carrusel
        showSlide();
        startInterval();
    }
});