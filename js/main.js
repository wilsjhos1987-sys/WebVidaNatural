// Inicializar aplicación
document.addEventListener("DOMContentLoaded", async function () {
  // Verificar que todos los componentes necesarios están disponibles
  if (typeof renderProducts === "function") {
    // Ahora renderProducts es async y carga los datos
    await renderProducts();
  }

  if (typeof initCartEvents === "function") {
    initCartEvents();
  }

  // Configurar filtros de categorías
  setupCategoryFilters();

  // Configurar event listeners para añadir al carrito
  // Ahora que los productos están cargados, podemos asignar los eventos
  setupAddToCartButtons();

  // Configurar smooth scroll
  setupSmoothScroll();

  // Configurar carruseles
  if (typeof setupCarousels === "function") {
    setupCarousels();
  }
});

// Configurar filtros de categorías
function setupCategoryFilters() {
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");

      // Actualizar estado activo
      document.querySelectorAll("[data-filter]").forEach((btn) => {
        btn.classList.remove("active");
      });
      this.classList.add("active");

      // Filtrar productos
      if (typeof renderProducts === "function") {
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
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = parseInt(this.getAttribute("data-id"));

      // Usar productos desde el archivo products.js
      if (typeof products !== "undefined" && typeof addToCart === "function") {
        addToCart(productId, products);
      }
    });
  });
}

// Configurar smooth scroll para enlaces internos
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });
}

// Función para buscar productos (si se implementa búsqueda)
function searchProducts(query) {
  // Implementación de búsqueda
  console.log("Buscando:", query);
}

// Función para validar formularios (si se añaden)
function validateForm(form) {
  // Implementación de validación
  return true;
}

// Manejar errores globales
window.addEventListener("error", function (e) {
  console.error("Error en la aplicación:", e.error);
});

// Exportar funciones para testing si es necesario
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    setupCategoryFilters,
    setupAddToCartButtons,
    setupSmoothScroll,
  };
}

// Configuración de carruseles
function setupCarousels() {
  // Configurar carrusel hero
  const heroCarousel = document.getElementById("heroCarousel");
  if (heroCarousel) {
    new bootstrap.Carousel(heroCarousel, {
      interval: 5000,
      wrap: true,
      pause: "hover",
      touch: true,
    });
  }

  // Configurar carrusel de productos destacados
  const productCarousel = document.getElementById("productCarousel");
  if (productCarousel) {
    new bootstrap.Carousel(productCarousel, {
      interval: 6000,
      wrap: true,
    });

    // Configurar botones de añadir al carrito dentro del carrusel estático
    // Esto es necesario porque setupAddToCartButtons busca .add-to-cart pero
    // estos elementos ya existen en el DOM, solo necesitamos asegurar que funcionen
    // incluso si están dentro del carrusel
    productCarousel.querySelectorAll(".add-to-cart").forEach((button) => {
      // Eliminamos listeners anteriores para evitar duplicados si se llamara múltiples veces
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);

      newButton.addEventListener("click", function () {
        const productId = parseInt(this.getAttribute("data-id"));
        if (
          typeof addToCart === "function" &&
          typeof products !== "undefined"
        ) {
          addToCart(productId, products);
        }
      });
    });
  }

  // Configurar carrusel de testimonios
  const testimonialCarousel = document.getElementById("testimonialCarousel");
  if (testimonialCarousel) {
    new bootstrap.Carousel(testimonialCarousel, {
      interval: 7000,
      wrap: true,
    });
  }
}
