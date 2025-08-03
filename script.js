document.addEventListener('DOMContentLoaded', function () {
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
                slideInterval = setInterval(nextSlide, 5000); // Cambia de slide cada 5 segundos
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

    // --- LÓGICA DEL CARRUSEL DE NOTICIAS ---
    const newsContainer = document.querySelector('.news-carousel-container');
    if (newsContainer) {
        const wrapper = newsContainer.querySelector('.news-carousel-wrapper');
        const carousel = newsContainer.querySelector('.news-carousel');
        const prevBtn = newsContainer.querySelector('.prev-news');
        const nextBtn = newsContainer.querySelector('.next-news');
        const cards = carousel.querySelectorAll('.news-card');

        if (cards.length > 0) {
            let currentIndex = 0;
            const gap = 30; // El 'gap' definido en el CSS

            function updateCarouselState() {
                const cardWidth = cards[0].offsetWidth + gap;
                const wrapperWidth = wrapper.clientWidth;
                const visibleCards = Math.floor(wrapperWidth / cardWidth);
                const maxIndex = cards.length - visibleCards;

                prevBtn.disabled = currentIndex === 0;
                nextBtn.disabled = currentIndex >= maxIndex;

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

            updateCarouselState();
            window.addEventListener('resize', updateCarouselState);
        }
    }

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
            const gap = 30;

            function updateCarouselState() {
                if (!cards[0] || !wrapper || !prevBtn || !nextBtn) return;

                const cardWidth = cards[0].offsetWidth + gap;
                const wrapperWidth = wrapper.clientWidth;
                const visibleCards = Math.round(wrapperWidth / cardWidth);
                const maxIndex = cards.length - visibleCards;

                prevBtn.disabled = currentIndex === 0;
                nextBtn.disabled = currentIndex >= maxIndex || maxIndex < 1;

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

            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(updateCarouselState, 250);
            });

            updateCarouselState();
        }
    }

    // --- LÓGICA DE ACORDEÓN PARA PÁGINA DE DESCARGAS ---
    const cardHeaders = document.querySelectorAll('.download-card-header');
    cardHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const list = header.nextElementSibling;

            header.classList.toggle('active');

            if (list.style.maxHeight) {
                list.style.maxHeight = null;
            } else {
                list.style.maxHeight = list.scrollHeight + "px";
            }
        });
    });

    // --- LÓGICA DE PAGINACIÓN PARA LA PÁGINA DE NOTICIAS ---
    const newsGrid = document.getElementById('news-grid');
    const paginationContainer = document.getElementById('pagination-container');

    if (newsGrid && paginationContainer) {
        const itemsPerPage = 6;
        const allNewsItems = Array.from(newsGrid.getElementsByClassName('news-card'));
        const totalPages = Math.ceil(allNewsItems.length / itemsPerPage);
        let currentPage = 1;

        function showPage(page) {
            currentPage = page;
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;

            allNewsItems.forEach(item => item.style.display = 'none');
            allNewsItems.slice(startIndex, endIndex).forEach(item => item.style.display = 'flex');

            updatePaginationUI();
            window.scrollTo(0, 0);
        }

        function updatePaginationUI() {
            paginationContainer.innerHTML = '';

            const prevButton = document.createElement('button');
            prevButton.innerHTML = '&laquo;';
            prevButton.disabled = currentPage === 1;
            prevButton.addEventListener('click', () => showPage(currentPage - 1));
            paginationContainer.appendChild(prevButton);

            for (let i = 1; i <= totalPages; i++) {
                const pageButton = document.createElement('button');
                pageButton.textContent = i;
                if (i === currentPage) {
                    pageButton.classList.add('active');
                }
                pageButton.addEventListener('click', () => showPage(i));
                paginationContainer.appendChild(pageButton);
            }

            const nextButton = document.createElement('button');
            nextButton.innerHTML = '&raquo;';
            nextButton.disabled = currentPage === totalPages;
            nextButton.addEventListener('click', () => showPage(currentPage + 1));
            paginationContainer.appendChild(nextButton);
        }

        showPage(1);
    }
});

// --- LÓGICA PARA INTERFAZ DE PESTAÑAS ---
document.addEventListener('DOMContentLoaded', function () {
    const tabsContainer = document.querySelector('.tabs-container');
    if (tabsContainer) {
        const tabLinks = tabsContainer.querySelectorAll('.tab-link');
        const tabContents = tabsContainer.querySelectorAll('.tab-content');

        tabLinks.forEach(link => {
            link.addEventListener('click', () => {
                const targetTab = link.getAttribute('data-tab');

                // Desactivar todas las pestañas y contenidos
                tabLinks.forEach(item => item.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // Activar la pestaña y el contenido seleccionados
                link.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });

        // Activar la primera pestaña por defecto
        if (tabLinks.length > 0) {
            tabLinks[0].click();
        }
    }
});

// --- LÓGICA PARA ANIMACIONES AL DESPLAZAR (Scroll Animations) ---
document.addEventListener('DOMContentLoaded', function () {
    const animatedElements = document.querySelectorAll('.product-card, .feature-card, .news-card, .section h2');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated', 'fadeInUp');
                observer.unobserve(entry.target); // Para que la animación ocurra solo una vez
            }
        });
    }, {
        threshold: 0.1 // La animación se dispara cuando el 10% del elemento es visible
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });
});