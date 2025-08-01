document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    // Lógica para el menú móvil
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // --- LÓGICA DEL CARRUSEL PRINCIPAL ---
    const heroCarousel = document.querySelector('.hero-carousel');
    if (heroCarousel) {
        const slides = document.querySelectorAll('.slide');
        const nextBtn = document.querySelector('.carousel-control.next');
        const prevBtn = document.querySelector('.carousel-control.prev');
        const indicatorsContainer = document.querySelector('.carousel-indicators');
        let currentSlide = 0;
        let slideInterval;

        if (slides.length > 0) {
            slides.forEach((slide, index) => {
                const indicator = document.createElement('div');
                indicator.classList.add('indicator');
                if (index === 0) indicator.classList.add('active');
                indicator.addEventListener('click', () => setSlide(index));
                if (indicatorsContainer) {
                    indicatorsContainer.appendChild(indicator);
                }
            });

            const indicators = document.querySelectorAll('.indicator');

            const showSlide = () => {
                slides.forEach((slide, index) => {
                    slide.classList.remove('active');
                    if (indicators[index]) {
                       indicators[index].classList.remove('active');
                    }
                });
                slides[currentSlide].classList.add('active');
                if (indicators[currentSlide]) {
                    indicators[currentSlide].classList.add('active');
                }
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
                slideInterval = setInterval(nextSlide, 5000);
            };

            const resetInterval = () => {
                clearInterval(slideInterval);
                startInterval();
            };

            if (nextBtn && prevBtn) {
                nextBtn.addEventListener('click', () => {
                    nextSlide();
                    resetInterval();
                });
                prevBtn.addEventListener('click', () => {
                    prevSlide();
                    resetInterval();
                });
            }
            
            showSlide();
            startInterval();
        }
    }

    // --- LÓGICA DEL CARRUSEL DE NOTICIAS CORREGIDA ---
    const newsContainer = document.querySelector('.news-carousel-container');
    if (newsContainer) {
        const wrapper = newsContainer.querySelector('.news-carousel-wrapper');
        const carousel = newsContainer.querySelector('.news-carousel');
        const prevBtn = newsContainer.querySelector('.prev-news');
        const nextBtn = newsContainer.querySelector('.next-news');
        const cards = carousel.querySelectorAll('.news-card');
        
        if (cards.length > 0) {
            let currentIndex = 0;
            const gap = 25; // El 'gap' definido en el CSS

            function updateCarouselState() {
                const cardWidth = cards[0].offsetWidth + gap;
                const wrapperWidth = wrapper.clientWidth;
                const visibleCards = Math.floor(wrapperWidth / cardWidth);
                const maxIndex = cards.length - visibleCards;

                // Deshabilitar botones si no hay a dónde ir
                prevBtn.disabled = currentIndex === 0;
                nextBtn.disabled = currentIndex >= maxIndex;

                // Calcular el desplazamiento
                const offset = -currentIndex * cardWidth;
                carousel.style.transform = `translateX(${offset}px)`;
            }

            nextBtn.addEventListener('click', () => {
                const cardWidth = cards[0].offsetWidth + gap;
                const wrapperWidth = wrapper.clientWidth;
                const visibleCards = Math.floor(wrapperWidth / cardWidth);
                const maxIndex = cards.length - visibleCards;

                if (currentIndex < maxIndex) {
                    currentIndex++;
                    updateCarouselState();
                }
            });

            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarouselState();
                }
            });

            // Llamada inicial y al redimensionar la ventana
            updateCarouselState();
            window.addEventListener('resize', updateCarouselState);
        }
    }
});

// --- LÓGICA DEL CARRUSEL DE PRODUCTOS ---
const productContainer = document.querySelector('.product-carousel-container');
if (productContainer) {
    const wrapper = productContainer.querySelector('.product-carousel-wrapper');
    const carousel = productContainer.querySelector('.product-carousel');
    const prevBtn = productContainer.querySelector('.prev-product');
    const nextBtn = productContainer.querySelector('.next-product');
    const cards = carousel.querySelectorAll('.product-card');
    
    if (cards.length > 0) {
        let currentIndex = 0;
        const gap = 30; // El 'gap' definido en el CSS

        function updateCarouselState() {
            // Asegurarse que los elementos existen antes de acceder a sus propiedades
            if (!cards[0] || !wrapper || !prevBtn || !nextBtn) return;

            const cardWidth = cards[0].offsetWidth + gap;
            const wrapperWidth = wrapper.clientWidth;
            // Math.round para evitar problemas con decimales en el ancho
            const visibleCards = Math.round(wrapperWidth / cardWidth); 
            const maxIndex = cards.length - visibleCards;

            // Deshabilitar botones si no hay a dónde ir
            prevBtn.disabled = currentIndex === 0;
            // Asegurarse que maxIndex no sea negativo
            nextBtn.disabled = currentIndex >= maxIndex || maxIndex < 1;

            // Calcular el desplazamiento
            const offset = -currentIndex * cardWidth;
            carousel.style.transform = `translateX(${offset}px)`;
        }

        nextBtn.addEventListener('click', () => {
            const cardWidth = cards[0].offsetWidth + gap;
            const wrapperWidth = wrapper.clientWidth;
            const visibleCards = Math.round(wrapperWidth / cardWidth);
            const maxIndex = cards.length - visibleCards;

            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarouselState();
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarouselState();
            }
        });

        // Llamada inicial y al redimensionar la ventana
        // Usar un temporizador en el resize para evitar llamadas excesivas
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateCarouselState, 250);
        });
        
        // Llamada inicial para configurar el estado
        updateCarouselState();
    }
}

// --- LÓGICA DE ACORDEÓN PARA PÁGINA DE DESCARGAS ---
document.addEventListener('DOMContentLoaded', function() {
    // Selecciona todos los encabezados de las tarjetas de descarga
    const cardHeaders = document.querySelectorAll('.download-card-header');

    cardHeaders.forEach(header => {
        header.addEventListener('click', () => {
            // Encuentra el contenedor de la lista de descargas
            const list = header.nextElementSibling;
            
            // Alterna la clase 'active' en el encabezado
            header.classList.toggle('active');

            // Alterna la visibilidad de la lista
            if (list.style.maxHeight) {
                list.style.maxHeight = null; // Colapsar
            } else {
                list.style.maxHeight = list.scrollHeight + "px"; // Expandir
            } 
        });
    });
});