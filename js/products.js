// Variable global para almacenar productos una vez cargados
let products = [];

// Obtener nombre de categoría
function getCategoryName(category) {
  const categoryNames = {
    "control-peso": "Control de Peso",
    piel: "Cuidado de la Piel",
    antiestres: "Anti-estrés",
    suplementos: "Suplementos",
    organico: "Orgánico",
  };

  return categoryNames[category] || category;
}

// Renderizar productos desde la API
async function renderProducts(filter = "all") {
  const productGrid = document.getElementById("productGrid");
  if (!productGrid) return;

// Datos de ejemplo para Modo Demo (cuando no hay base de datos)
const DEMO_PRODUCTS = [
    {
        id: 1,
        name: 'Quemador Natural Premium',
        category: 'control-peso',
        price: 32.99,
        image: 'https://www.nutrimind.net/images/news/analisis_quemadores_grasa/2.png',
        description: 'Ayuda natural para acelerar el metabolismo y controlar el peso.',
        badges: ["natural", "vegan"]
    },
    {
        id: 2,
        name: 'Crema Facial de Árgan',
        category: 'piel',
        price: 28.50,
        image: 'https://images.pexels.com/photos/6663374/pexels-photo-6663374.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        description: 'Hidratación profunda con aceite de argán orgánico.',
        badges: ["organic", "vegan"]
    },
    {
        id: 3,
        name: 'Aceite Esencial Lavanda',
        category: 'antiestres',
        price: 18.75,
        image: 'https://images.pexels.com/photos/672051/pexels-photo-672051.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        description: 'Calma la mente y promueve un sueño reparador.',
        badges: ["organic"]
    },
    {
        id: 4,
        name: 'Suplemento Omega-3 Algas',
        category: 'suplementos',
        price: 42.25,
        image: 'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/flo/flo61424/l/8.jpg',
        description: 'Ácidos grasos esenciales de origen vegetal.',
        badges: ["vegan"]
    },
    {
        id: 5,
        name: 'Té Verde Orgánico',
        category: 'control-peso',
        price: 15.99,
        image: 'https://images.pexels.com/photos/5946639/pexels-photo-5946639.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        description: 'Antioxidantes naturales para complementar tu dieta.',
        badges: ["organic", "natural"]
    },
    {
        id: 6,
        name: 'Jabón de Caléndula',
        category: 'piel',
        price: 12.50,
        image: 'https://images.pexels.com/photos/7500305/pexels-photo-7500305.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        description: 'Suave limpieza para pieles sensibles.',
        badges: ["organic", "natural", "vegan"]
    }
];

    if (products.length === 0) {
        let useDemo = false;
        let errorMessage = "";

        // Detectar si estamos en modo archivo o si falla la API
        if (window.location.protocol === 'file:') {
            useDemo = true;
            errorMessage = "Modo Archivo (Sin Servidor)";
        } else {
            try {
                const response = await fetch("api/get_products.php");
                if (!response.ok) {
                    throw new Error(`Error ${response.status}`);
                }
                products = await response.json();
            } catch (error) {
                console.warn("Fallo la conexión con la API, usando datos demo:", error);
                useDemo = true;
                errorMessage = "Sin conexión a Base de Datos";
            }
        }

        if (useDemo) {
            products = DEMO_PRODUCTS;
            // Mostrar aviso no intrusivo
            const existingAlert = document.getElementById('demo-alert');
            if (!existingAlert) {
                const alertDiv = document.createElement('div');
                alertDiv.id = 'demo-alert';
                alertDiv.className = 'alert alert-warning alert-dismissible fade show position-fixed bottom-0 end-0 m-3';
                alertDiv.style.zIndex = '1050';
                alertDiv.innerHTML = `
                    <i class="bi bi-wifi-off"></i> 
                    <strong>Modo Demo Activado</strong><br>
                    <small>${errorMessage}. Mostrando productos de ejemplo.</small>
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                `;
                document.body.appendChild(alertDiv);
            }
        }
    }

  productGrid.innerHTML = "";

  const filteredProducts =
    filter === "all"
      ? products
      : products.filter((product) => product.category === filter);

  if (filteredProducts.length === 0) {
    productGrid.innerHTML =
      '<div class="col-12 text-center text-muted">No se encontraron productos en esta categoría.</div>';
    return;
  }

  filteredProducts.forEach((product) => {
    // Asegurar que badges sea un array (en caso de que venga null o mal formato)
    const badges = Array.isArray(product.badges) ? product.badges : [];

    const badgesHTML = badges
      .map((badge) => {
        let badgeClass = "badge-natural";
        let badgeText = "Natural";

        if (badge === "organic") {
          badgeClass = "badge-organic";
          badgeText = "Orgánico";
        } else if (badge === "vegan") {
          badgeClass = "badge-vegan";
          badgeText = "Vegano";
        }

        return `<span class="badge ${badgeClass} me-1">${badgeText}</span>`;
      })
      .join("");

    const productCard = `
            <div class="col-md-6 col-lg-4" data-category="${product.category}">
                <div class="card product-card">
                    <img src="${product.image}" class="card-img-top product-img" alt="${product.name}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="product-category">${getCategoryName(product.category)}</span>
                            <div>${badgesHTML}</div>
                        </div>
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text text-muted">${product.description}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <span class="product-price">$${product.price.toFixed(2)}</span>
                            <button class="btn btn-primary btn-sm add-to-cart" data-id="${product.id}">
                                <i class="bi bi-cart-plus"></i> Añadir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

    productGrid.innerHTML += productCard;
  });
}

// Exportar para uso en otros archivos
if (typeof module !== "undefined" && module.exports) {
  module.exports = { products, renderProducts, getCategoryName };
}
