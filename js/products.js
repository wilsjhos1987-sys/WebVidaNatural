
const API = 'http://localhost:8080/VidaNaturalAPI/api/productos';

let products = [];   // lo llenaremos con el fetch

fetch(API)
  .then(r => r.json())
  .then(lista => {
    /* 2. Adaptamos los nombres del servlet a los que ya usas */
    products = lista.map(p => ({
      id:          p.id,
      name:        p.nombre,
      category:    p.categoria   || 'organico',   // si tu tabla no tiene categoria, ponemos uno por defecto
      price:       p.precio,
      image:       p.imagen,
      description: p.descripcion,
      badges:      ['natural']                   // o el que quieras
    }));
    /* 3. Una vez cargados, pintamos */
    renderProducts('all');
  })
  .catch(err => console.error('Error al cargar productos:', err));
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



