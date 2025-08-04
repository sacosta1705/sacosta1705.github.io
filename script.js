/**
 * @file Script principal para la interactividad del sitio web de Saint.
 * @summary Este script inicializa todos los componentes interactivos del sitio.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializador principal
    setupMobileMenu();
    setupHeroCarousel();
    setupProductCarousel();
    setupNewsCarousel();
    setupDownloadsAccordion();
    setupDownloadTabs();
    setupNewsPagination();
    setupScrollAnimations();
    setupDistributorFilter(); // Se llama a la nueva función de filtro
});

// ... (Aquí van todas las demás funciones como setupMobileMenu, setupHeroCarousel, etc. sin cambios)
function setupMobileMenu() {
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (!menuBtn || !navLinks) { return; }
    menuBtn.addEventListener('click', () => { navLinks.classList.toggle('active'); });
}

function setupHeroCarousel() {
    const heroCarousel = document.querySelector('.hero-carousel');
    if (!heroCarousel) return;
    const slides = heroCarousel.querySelectorAll('.slide');
    if (slides.length <= 1) return;
    let currentSlide = 0;
    const showSlide = (index) => {
        slides.forEach((slide) => slide.classList.remove('active'));
        slides[index].classList.add('active');
    };
    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    };
    setInterval(nextSlide, 5000);
}

function setupGenericCarousel(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    const wrapper = container.querySelector('.product-carousel-wrapper, .news-carousel-wrapper');
    const carousel = container.querySelector('.product-carousel, .news-carousel');
    const prevBtn = container.querySelector('.prev-product, .prev-news');
    const nextBtn = container.querySelector('.next-product, .next-news');
    if (!wrapper || !carousel || !prevBtn || !nextBtn) return;
    const cards = carousel.querySelectorAll('.product-card, .news-card');
    if (cards.length === 0) return;
    let currentIndex = 0;
    const gap = 30;

    function updateCarouselState() {
        const cardWidth = cards[0].offsetWidth;
        const totalCardWidth = cardWidth + gap;
        const wrapperWidth = wrapper.clientWidth;
        const visibleCards = Math.round(wrapperWidth / totalCardWidth);
        const maxIndex = Math.max(0, cards.length - visibleCards);
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIndex;
        const offset = -currentIndex * totalCardWidth;
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

function setupProductCarousel() { setupGenericCarousel('.product-carousel-container'); }

function setupNewsCarousel() { setupGenericCarousel('.news-carousel-container'); }

function setupDownloadsAccordion() {
    const accordions = document.querySelectorAll('.download-card');
    if (!accordions.length) return;
    accordions.forEach(accordion => {
        const header = accordion.querySelector('.download-card-header');
        const list = accordion.querySelector('.download-list');
        if (header && list) {
            header.addEventListener('click', () => {
                header.classList.toggle('active');
                if (list.style.maxHeight) {
                    list.style.maxHeight = null;
                } else {
                    list.style.maxHeight = list.scrollHeight + "px";
                }
            });
        }
    });
}

function setupDownloadTabs() {
    const tabsContainer = document.querySelector('.tabs-container');
    if (!tabsContainer) return;
    const tabLinks = tabsContainer.querySelectorAll('.tab-link');
    const tabContents = tabsContainer.querySelectorAll('.tab-content');
    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetTab = link.getAttribute('data-tab');
            tabLinks.forEach(item => item.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            link.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
    if (tabLinks.length > 0) { tabLinks[0].click(); }
}

function setupNewsPagination() {
    const newsGrid = document.getElementById('news-grid');
    const paginationContainer = document.getElementById('pagination-container');
    if (!newsGrid || !paginationContainer) return;
    const itemsPerPage = 6;
    const allNewsItems = Array.from(newsGrid.getElementsByClassName('news-card'));
    const totalPages = Math.ceil(allNewsItems.length / itemsPerPage);
    let currentPage = 1;
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        allNewsItems.forEach(item => item.style.display = 'flex');
        return;
    }

    function showPage(page) {
        currentPage = page;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        allNewsItems.forEach(item => item.style.display = 'none');
        allNewsItems.slice(startIndex, endIndex).forEach(item => item.style.display = 'flex');
        updatePaginationUI();
        window.scrollTo({ top: newsGrid.offsetTop - 100, behavior: 'smooth' });
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
            if (i === currentPage) { pageButton.classList.add('active'); }
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

function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.product-card, .feature-card, .news-card, .section h2');
    if (animatedElements.length === 0) return;
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `fadeInUp 0.6s ease forwards`;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
    if (!document.getElementById('fadeInUpAnimation')) {
        const styleSheet = document.createElement("style");
        styleSheet.id = 'fadeInUpAnimation';
        styleSheet.innerText = `@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`;
        document.head.appendChild(styleSheet);
    }
}

/**
 * [NUEVA FUNCIÓN] Configura el filtro de distribuidores por país y estado.
 */
function setupDistributorFilter() {
    const countryFilter = document.getElementById('country-filter');
    const stateFilter = document.getElementById('state-filter');
    const distributorCards = document.querySelectorAll('.distributor-card');

    if (!countryFilter || !stateFilter || distributorCards.length === 0) {
        return; // Salir si los elementos no existen
    }

    // Base de datos de estados por país. Esto debería ser llenado con datos reales.
    const statesByCountry = {
        'ar': {
            'buenos-aires': 'Buenos Aires',
            'cordoba': 'Córdoba',
            'santa-fe': 'Santa Fe'
        },
        'co': {
            'cundinamarca': 'Cundinamarca',
            'antioquia': 'Antioquia',
            'valle-del-cauca': 'Valle del Cauca'
        },
        'cl': {
            'santiago': 'Metropolitana de Santiago',
            'valparaiso': 'Valparaíso'
        },
        'bo': {
            'la-paz': 'La Paz',
            'santa-cruz': 'Santa Cruz'
        }
    };

    // Función para actualizar el filtro de estados
    function updateStateFilter() {
        const selectedCountry = countryFilter.value;
        // Limpiar opciones anteriores
        stateFilter.innerHTML = '<option value="todos">Todos los estados</option>';

        if (selectedCountry !== 'todos' && statesByCountry[selectedCountry]) {
            stateFilter.disabled = false;
            const states = statesByCountry[selectedCountry];
            for (const stateValue in states) {
                const option = document.createElement('option');
                option.value = stateValue;
                option.textContent = states[stateValue];
                stateFilter.appendChild(option);
            }
        } else {
            stateFilter.disabled = true;
        }
        filterResults();
    }

    // Función para filtrar los resultados
    function filterResults() {
        const selectedCountry = countryFilter.value;
        const selectedState = stateFilter.value;

        distributorCards.forEach(card => {
            const cardCountry = card.getAttribute('data-country');
            const cardState = card.getAttribute('data-state');

            const countryMatch = selectedCountry === 'todos' || selectedCountry === cardCountry;
            const stateMatch = selectedState === 'todos' || selectedState === cardState || stateFilter.disabled;

            if (countryMatch && stateMatch) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Event Listeners
    countryFilter.addEventListener('change', updateStateFilter);
    stateFilter.addEventListener('change', filterResults);

    // Llamada inicial para asegurar estado correcto
    updateStateFilter();
}