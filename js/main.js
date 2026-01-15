// Inicializar aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Verificar que todos los componentes necesarios están disponibles
    if (typeof renderProducts === 'function') {
        renderProducts();
    }
    
    if (typeof initCartEvents === 'function') {
        initCartEvents();
    }
    
    // Configurar filtros de categorías
    setupCategoryFilters();
    
    // Configurar event listeners para añadir al carrito
    setupAddToCartButtons();
    
    // Configurar smooth scroll
    setupSmoothScroll();
});

// Configurar filtros de categorías
function setupCategoryFilters() {
    document.querySelectorAll('[data-filter]').forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Actualizar estado activo
            document.querySelectorAll('[data-filter]').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Filtrar productos
            if (typeof renderProducts === 'function') {
                renderProducts(filter);
                
                // Re-configurar botones de añadir al carrito
                setTimeout(() => {
                    setupAddToCartButtons();
                }, 100);
            }
        });
    });
}

// Configurar botones de añadir al carrito
function setupAddToCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            
            // Usar productos desde el archivo products.js
            if (typeof products !== 'undefined' && typeof addToCart === 'function') {
                addToCart(productId, products);
            }
        });
    });
}

// Configurar smooth scroll para enlaces internos
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Función para buscar productos (si se implementa búsqueda)
function searchProducts(query) {
    // Implementación de búsqueda
    console.log('Buscando:', query);
}

// Función para validar formularios (si se añaden)
function validateForm(form) {
    // Implementación de validación
    return true;
}

// Manejar errores globales
window.addEventListener('error', function(e) {
    console.error('Error en la aplicación:', e.error);
});

// Exportar funciones para testing si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        setupCategoryFilters, 
        setupAddToCartButtons, 
        setupSmoothScroll 
    };
}

// Configuración de carruseles
function setupCarousels() {
    // Configurar carrusel hero
    const heroCarousel = document.getElementById('heroCarousel');
    if (heroCarousel) {
        const carousel = new bootstrap.Carousel(heroCarousel, {
            interval: 5000, // 5 segundos entre slides
            wrap: true, // vuelve al inicio
            pause: 'hover', // pausa al hacer hover
            touch: true // permite navegación táctil
        });
        
        // Pausar automáticamente cuando el usuario interactúa
        heroCarousel.addEventListener('slid.bs.carousel', function() {
            console.log('Carrusel cambió de slide');
        });
    }
    
    // Configurar carrusel de productos destacados
    const featuredCarousel = document.getElementById('featuredCarousel');
    if (featuredCarousel) {
        const featured = new bootstrap.Carousel(featuredCarousel, {
            interval: 6000, // 6 segundos
            wrap: true
        });
    }
    
    // Configurar carrusel de testimonios
    const testimonialCarousel = document.getElementById('testimonialCarousel');
    if (testimonialCarousel) {
        const testimonials = new bootstrap.Carousel(testimonialCarousel, {
            interval: 7000, // 7 segundos
            wrap: true
        });
    }
}

// Llamar la función cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    setupCarousels();
    
    // También configurar los botones de añadir al carrito en los productos del carrusel
    document.querySelectorAll('.carousel .add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            
            // Usar la función addToCart de cart.js
            if (typeof addToCart === 'function' && typeof products !== 'undefined') {
                addToCart(productId, products);
            }
        });
    });
});
