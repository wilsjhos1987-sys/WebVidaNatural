// Carrito de compras
let cart = [];

// Elementos del DOM
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const openCartBtn = document.getElementById('openCartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const continueShoppingBtn = document.getElementById('continueShoppingBtn');
const checkoutBtn = document.getElementById('checkoutBtn');

// Añadir producto al carrito
function addToCart(productId, products) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
        });
    }
    
    updateCart();
    showToast(`${product.name} añadido al carrito`);
}

// Cambiar cantidad de producto
function changeQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    }
    
    updateCart();
}

// Eliminar producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Actualizar visualización del carrito
function updateCart() {
    // Actualizar contador
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
    
    // Actualizar items del carrito
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="text-center py-4">
                    <i class="bi bi-cart-x display-4 text-muted"></i>
                    <p class="text-muted mt-3">Tu carrito está vacío</p>
                </div>
            `;
            
            if (cartSubtotal) cartSubtotal.textContent = '$0.00';
            if (cartTotal) cartTotal.textContent = '$3.50';
            return;
        }
        
        let cartHTML = '';
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            cartHTML += `
                <div class="cart-item mb-3 pb-3 border-bottom">
                    <div class="d-flex">
                        <img src="${item.image}" alt="${item.name}" class="rounded" style="width: 60px; height: 60px; object-fit: cover;">
                        <div class="ms-3 flex-grow-1">
                            <h6 class="mb-1">${item.name}</h6>
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted">$${item.price.toFixed(2)} c/u</span>
                                </div>
                                <div class="d-flex align-items-center">
                                    <button class="btn btn-sm btn-outline-secondary decrease-qty" data-id="${item.id}">-</button>
                                    <span class="mx-2">${item.quantity}</span>
                                    <button class="btn btn-sm btn-outline-secondary increase-qty" data-id="${item.id}">+</button>
                                    <button class="btn btn-sm btn-outline-danger ms-3 remove-item" data-id="${item.id}">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="text-end mt-1">
                                <small class="text-primary fw-bold">$${itemTotal.toFixed(2)}</small>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        cartItems.innerHTML = cartHTML;
        
        // Actualizar totales
        const shipping = 3.50;
        const total = subtotal + shipping;
        
        if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
        
        // Añadir event listeners a los botones del carrito
        document.querySelectorAll('.increase-qty').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                changeQuantity(productId, 1);
            });
        });
        
        document.querySelectorAll('.decrease-qty').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                changeQuantity(productId, -1);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                removeFromCart(productId);
            });
        });
    }
}

// Mostrar notificación Toast
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 end-0 p-3';
    toast.style.zIndex = '11';
    
    const toastBody = document.createElement('div');
    toastBody.className = 'toast align-items-center text-white bg-success border-0 show';
    toastBody.setAttribute('role', 'alert');
    toastBody.setAttribute('aria-live', 'assertive');
    toastBody.setAttribute('aria-atomic', 'true');
    
    toastBody.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="bi bi-check-circle me-2"></i> ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toast.appendChild(toastBody);
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Abrir carrito
function openCart() {
    if (cartSidebar) cartSidebar.classList.add('open');
    if (cartOverlay) cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Cerrar carrito
function closeCart() {
    if (cartSidebar) cartSidebar.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Inicializar eventos del carrito
function initCartEvents() {
    if (openCartBtn) {
        openCartBtn.addEventListener('click', openCart);
    }
    
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }
    
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', closeCart);
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async function() {
            if (cart.length === 0) {
                alert('Tu carrito está vacío');
                return;
            }

            // Calcular total
            const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            const shipping = 3.50;
            const total = subtotal + shipping;

            // Preparar datos para enviar
            const orderData = {
                items: cart,
                total: total
            };

            // Deshabilitar botón para evitar doble envío
            const originalText = checkoutBtn.innerText;
            checkoutBtn.disabled = true;
            checkoutBtn.innerText = 'Procesando...';

            // Función para simular éxito en modo demo
            const simulateSuccess = () => {
                const fakeOrderId = Math.floor(Math.random() * 1000) + 1000;
                alert(`¡Gracias por tu compra! (MODO DEMO)\n\nTu pedido simulado #${fakeOrderId} ha sido registrado.\nEn un entorno real, esto se guardaría en la base de datos.`);
                
                // Limpiar carrito
                cart = [];
                updateCart();
                closeCart();
            };

            // Detectar modo archivo
            if (window.location.protocol === 'file:') {
                setTimeout(() => {
                    simulateSuccess();
                    checkoutBtn.disabled = false;
                    checkoutBtn.innerText = originalText;
                }, 1000); // Pequeño delay para realismo
                return;
            }

            try {
                const response = await fetch('api/save_order.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderData)
                });

                // Verificar si es contenido HTML (error común en XAMPP/Hosting gratis cuando hay error PHP)
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") === -1) {
                    throw new Error("Respuesta no válida del servidor");
                }

                const result = await response.json();

                if (response.ok && result.success) {
                    // Pedido exitoso REAL
                    alert(`¡Gracias por tu compra! Tu pedido #${result.order_id} ha sido registrado exitosamente.`);
                    
                    // Limpiar carrito
                    cart = [];
                    updateCart();
                    closeCart();
                } else {
                    throw new Error(result.error || 'Error desconocido');
                }
            } catch (error) {
                console.warn('Fallo el pedido real, activando fallback demo:', error);
                // Si falla la conexión (ej. GitHub Pages), usamos el simulador
                simulateSuccess();
            } finally {
                // Restaurar botón (solo si no se usó el retorno temprano del modo archivo)
                if (checkoutBtn.disabled) {
                    checkoutBtn.disabled = false;
                    checkoutBtn.innerText = originalText;
                }
            }
        });
    }
}

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        cart, 
        addToCart, 
        updateCart, 
        initCartEvents, 
        openCart, 
        closeCart 
    };
}