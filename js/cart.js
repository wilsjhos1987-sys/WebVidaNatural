const API = 'http://localhost:8080/VidaNaturalAPI/api/productos';
const CHECKOUT_API = 'http://localhost:8080/VidaNaturalAPI/api/checkout';

let products = []; 
let cart = [];

// --- 1. CARGA DE PRODUCTOS ---
fetch(API)
  .then(r => r.json())
  .then(lista => {
    products = lista.map(p => ({
      id:          p.id,
      name:        p.nombre,
      category:    p.categoria || 'organico',
      price:       p.precio,
      image:       p.imagen,
      description: p.descripcion,
      badges:      ['natural']
    }));
    renderProducts('all');
  })
  .catch(err => console.error('Error al cargar productos:', err));

// --- 2. RENDERIZADO Y UI ---
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

function renderProducts(filter = 'all') {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    const filteredProducts = filter === 'all' ? products : products.filter(p => p.category === filter);
    
    filteredProducts.forEach(product => {
        const productCard = `
            <div class="col-md-6 col-lg-4">
                <div class="card product-card">
                    <img src="${product.image}" class="card-img-top product-img" alt="${product.name}">
                    <div class="card-body">
                        <span class="product-category">${getCategoryName(product.category)}</span>
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text text-muted">${product.description}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <span class="product-price">$${product.price.toFixed(2)}</span>
                            <button class="btn btn-primary btn-sm add-to-cart" onclick="addToCart(${product.id})">
                                <i class="bi bi-cart-plus"></i> Añadir
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
        productGrid.innerHTML += productCard;
    });
}

// --- 3. LÓGICA DEL CARRITO ---
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
    showToast(`${product.name} añadido al carrito`);
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');

    if (cartCount) cartCount.textContent = cart.reduce((t, i) => t + i.quantity, 0);
    
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="text-center py-4 text-muted">Tu carrito está vacío</p>';
            if (cartTotal) cartTotal.textContent = '$0.00';
            return;
        }

        let subtotal = 0;
        cartItems.innerHTML = cart.map(item => {
            subtotal += item.price * item.quantity;
            return `
                <div class="cart-item mb-3 pb-3 border-bottom">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-0">${item.name}</h6>
                            <small class="text-muted">$${item.price.toFixed(2)} x ${item.quantity}</small>
                        </div>
                        <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${item.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>`;
        }).join('');

        if (cartTotal) cartTotal.textContent = `$${(subtotal + 3.50).toFixed(2)}`;
    }
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    updateCart();
}

// --- 4. FUNCIÓN DE FINALIZAR COMPRA (FETCH POST) ---
async function finalizarCompraReal() {
    if (cart.length === 0) return alert('El carrito está vacío');

    const pedido = {
        items: cart.map(i => ({ productoId: i.id, cantidad: i.quantity, precioUnit: i.price })),
        total: cart.reduce((t, i) => t + (i.price * i.quantity), 3.50).toFixed(2)
    };

    try {
        const res = await fetch(CHECKOUT_API, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(pedido)
        });
        const data = await res.json();
        if (res.ok) {
            alert('¡Compra exitosa! ID: ' + (data.idPedido || 'OK'));
            cart = []; updateCart(); closeCart();
        } else {
            alert('Error: ' + data.error);
        }
    } catch (err) {
        alert('No se pudo conectar con el servidor local.');
    }
}

// --- 5. EVENTOS ---
document.getElementById('checkoutBtn')?.addEventListener('click', finalizarCompraReal);
document.getElementById('openCartBtn')?.addEventListener('click', () => {
    document.getElementById('cartSidebar').classList.add('open');
});
document.getElementById('closeCartBtn')?.addEventListener('click', closeCart);

function closeCart() {
    document.getElementById('cartSidebar').classList.remove('open');
}

function showToast(m) {
    console.log("Toast: " + m); // Aquí puedes usar tu lógica de toast
}
