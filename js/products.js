// Datos de productos
const products = [
    {
        id: 1,
        name: "Quemador Natural Premium",
        category: "control-peso",
        price: 32.99,
        image: "https://www.nutrimind.net/images/news/analisis_quemadores_grasa/2.png",
        description: "Ayuda natural para acelerar el metabolismo y controlar el peso.",
        badges: ["natural", "vegan"]
    },
    {
        id: 2,
        name: "Crema Facial de Árgan",
        category: "piel",
        price: 28.50,
        image: "https://images.pexels.com/photos/6663374/pexels-photo-6663374.jpeg?_gl=1*17vko3z*_ga*NTI4MzE5MDcxLjE3NjgzNjYxMTc.*_ga_8JE65Q40S6*czE3NjgzNjYxMTckbzEkZzEkdDE3NjgzNjc4MjUkajU1JGwwJGgw",
        description: "Hidratación profunda con aceite de argán orgánico.",
        badges: ["organic", "vegan"]
    },
    {
        id: 3,
        name: "Aceite Esencial Lavanda",
        category: "antiestres",
        price: 18.75,
        image: "https://images.pexels.com/photos/17466173/pexels-photo-17466173.jpeg?_gl=1*4w0258*_ga*NTI4MzE5MDcxLjE3NjgzNjYxMTc.*_ga_8JE65Q40S6*czE3NjgzNjYxMTckbzEkZzEkdDE3NjgzNjc3MzUkajU5JGwwJGgw",
        description: "Calma la mente y promueve un sueño reparador.",
        badges: ["organic"]
    },
    {
        id: 4,
        name: "Suplemento Omega-3 Algas",
        category: "suplementos",
        price: 42.25,
        image: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/flo/flo61424/l/8.jpg",
        description: "Ácidos grasos esenciales de origen vegetal.",
        badges: ["vegan"]
    },
    {
        id: 5,
        name: "Té Verde Orgánico",
        category: "control-peso",
        price: 15.99,
        image: "https://images.pexels.com/photos/5946639/pexels-photo-5946639.jpeg?_gl=1*10fgp02*_ga*NTI4MzE5MDcxLjE3NjgzNjYxMTc.*_ga_8JE65Q40S6*czE3NjgzNjYxMTckbzEkZzEkdDE3NjgzNjc2ODAkajQ3JGwwJGgw",
        description: "Antioxidantes naturales para complementar tu dieta.",
        badges: ["organic", "natural"]
    },
    {
        id: 6,
        name: "Jabón de Caléndula",
        category: "piel",
        price: 12.50,
        image: "https://images.pexels.com/photos/7500305/pexels-photo-7500305.jpeg?_gl=1*1jyyerm*_ga*NTI4MzE5MDcxLjE3NjgzNjYxMTc.*_ga_8JE65Q40S6*czE3NjgzNjYxMTckbzEkZzEkdDE3NjgzNjgyNTgkajU5JGwwJGgw",
        description: "Suave limpieza para pieles sensibles.",
        badges: ["organic", "natural", "vegan"]
    }
];

// Obtener nombre de categoría
function getCategoryName(category) {
    const categoryNames = {
        'control-peso': 'Control de Peso',
        'piel': 'Cuidado de la Piel',
        'antiestres': 'Anti-estrés',
        'suplementos': 'Suplementos',
        'organico': 'Orgánico'
    };
    
    return categoryNames[category] || category;
}

// Renderizar productos
function renderProducts(filter = 'all') {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.category === filter);
    
    filteredProducts.forEach(product => {
        const badgesHTML = product.badges.map(badge => {
            let badgeClass = 'badge-natural';
            let badgeText = 'Natural';
            
            if (badge === 'organic') {
                badgeClass = 'badge-organic';
                badgeText = 'Orgánico';
            } else if (badge === 'vegan') {
                badgeClass = 'badge-vegan';
                badgeText = 'Vegano';
            }
            
            return `<span class="badge ${badgeClass} me-1">${badgeText}</span>`;
        }).join('');
        
        const productCard = `
            <div class="col-md-6 col-lg-4" data-category="${product.category}">
                <div class="card product-card">
                    <img src="${product.image}" class="card-img-top product-img" alt="${product.name}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="product-category">${getCategoryName(product.category)}</span>
                            ${badgesHTML}
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
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { products, renderProducts, getCategoryName };
}