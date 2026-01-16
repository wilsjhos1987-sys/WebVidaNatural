const API = 'http://localhost:8080/VidaNaturalAPI/api/productos';
const CHECKOUT_API = 'http://localhost:8080/VidaNaturalAPI/api/checkout'; // URL de tu Servlet de ventas

let products = []; 
let cart = []; // Variable para almacenar lo que el usuario elige

// 1. CARGA DE PRODUCTOS (Tu código original)
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
    setupAddToCartButtons(); // Activamos los botones después de cargar
  })
  .catch(err => console.error('Error al cargar productos:', err));

// 2. RENDERIZADO (Tu código original)
function renderProducts(filter = 'all') {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    productGrid.innerHTML = '';
    const filteredProducts = filter === 'all' ? products : products.filter(p => p.category === filter);
    
    filteredProducts.forEach(product => {
        const productCard = `
            <div class="col-md-6 col-lg-4">
                <div class="card product-card">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-price">$${product.price.toFixed(2)}</p>
                        <button class="btn btn-primary add-to-cart" data-id="${product.id}">Añadir al carrito</button>
                    </div>
                </div>
            </div>`;
        productGrid.innerHTML += productCard;
    });
    setupAddToCartButtons();
}

// 3. LÓGICA PARA REGISTRAR EN LA BASE DE DATOS
function setupAddToCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.onclick = (e) => {
            const id = e.target.dataset.id;
            const product = products.find(p => p.id == id);
            cart.push(product);
            console.log("Añadido:", product.name);
            alert(`${product.name} se añadió al carrito`);
        };
    });
}

// --- ESTA ES LA FUNCIÓN QUE DEBES VINCULAR A TU BOTÓN "PROCEDER AL PAGO" ---
async function procesarPagoYRegistrar() {
    if (cart.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    const totalCompra = cart.reduce((total, p) => total + p.price, 0) + 3.50; // Total + envío
    
    const datosVenta = {
        total: totalCompra.toFixed(2),
        items: cart.map(p => ({ nombre: p.name, precio: p.price }))
    };

    try {
        const response = await fetch(CHECKOUT_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosVenta)
        });

        if (response.ok) {
            alert("¡Gracias por tu compra! Serás redirigido a nuestro sistema de pago seguro.");
            cart = []; // Limpiamos carrito
            // Aquí puedes redirigir a una pasarela real si quisieras
        } else {
            alert("Error al registrar en la base de datos local.");
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        alert("No se pudo conectar con el servidor local (NetBeans).");
    }
}

// 4. VINCULAR AL BOTÓN FINAL
// Asegúrate de que en tu HTML el botón de "Proceder al Pago" tenga el ID 'btnProceder'
document.getElementById('btnProceder')?.addEventListener('click', procesarPagoYRegistrar);
