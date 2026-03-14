// --- DATOS Y CONFIGURACIÓN ---
console.log("MENÚ LEYENDO LOCALSTORAGE: ", localStorage.getItem('cafetin_productos'));
const products = [
    { id: 1, name: "Empanada de carne", price: 1.5, image: "../css/imagenes/productos/empanadas.jpg", category: "Desayunos" },
    { id: 2, name: "Pastel de chocolate", price: 3.0, image: "../css/imagenes/productos/torta.jpg", category: "Postres" },
    { id: 3, name: "Pizza", price: 2.5, image: "../css/imagenes/productos/pizza.jpg", category: "Almuerzos" },
    { id: 4, name: "Sándwich de pollo", price: 3.0, image: "../css/imagenes/productos/sandwich.jpg", category: "Desayunos" },
    { id: 5, name: "Café", price: 1.2, image: "../css/imagenes/productos/necesito-3-litros-de-eso.jpg", category: "Bebidas" },
    { id: 6, name: "Donas", price: 1.0, image: "../css/imagenes/productos/donas.jpg", category: "Postres" },
    { id: 7, name: "Malta", price: 1.5, image: "../css/imagenes/productos/MALTA-250ML.jpg", category: "Bebidas" },
    { id: 8, name: "Pie de limon", price: 2.5, image: "../css/imagenes/productos/Pie-de-limon.jpg", category: "Postres" },
    { id: 9, name: "Pollo frito", price: 5.0, image: "../css/imagenes/productos/pollo_frito.jpg", category: "Almuerzos" },
    { id: 10, name: "Té Lipton Durazno", price: 2.5, image: "../css/imagenes/productos/te_lipton.jpg", category: "Bebidas" },
    { id: 11, name: "Tequeños", price: 1.0, image: "../css/imagenes/productos/tequenos.jpg", category: "Desayunos" },
    { id: 12, name: "Batido de frutas", price: 2.0, image: "../css/imagenes/productos/batido-de-fresa-y-platano-receta-saludable.jpeg", category: "Bebidas" },
    { id: 13, name: "Agua", price: 0.8, image: "../css/imagenes/productos/agua.jpg", category: "Bebidas" },
    { id: 14, name: "Salchipapa", price: 4.0, image: "../css/imagenes/productos/salchipapa.jpg", category: "Almuerzos" },
    { id: 15, name: "Papas rellenas", price: 1.5, image: "../css/imagenes/productos/papas_rellenas.jpeg", category: "Desayunos" }
];

let cart = JSON.parse(localStorage.getItem('cafetin_cart')) || [];

// Elementos del DOM
const productsContainer = document.getElementById('products-container');
const cartCountElement = document.getElementById('cart-count');
const cartConfirmation = document.getElementById('cart-confirmation');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const openCartBtn = document.getElementById('open-cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const sidebarItemsContainer = document.getElementById('sidebar-items-container');
const sidebarTotal = document.getElementById('sidebar-total');

// --- LÓGICA DEL CATÁLOGO ---

function renderProducts() {
    if (!productsContainer) return;
    productsContainer.innerHTML = ''; 
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="info">${product.category}</p>
                <p class="price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart-btn" data-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> Agregar
                </button>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });

    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

function addToCart(event) {
    const button = event.target.closest('.add-to-cart-btn');
    if (!button) return;

    const productId = parseInt(button.dataset.id);
    const product = products.find(p => p.id === productId);
    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    mostrarFeedback();
}

// Nueva función para productos dinámicos (Admin)
window.agregarAlCarrito = function(id, nombre, precio) {
    const existingProduct = cart.find(item => item.id == id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ id: id, name: nombre, price: parseFloat(precio), quantity: 1 });
    }
    saveCart();
    updateCartUI();
    mostrarFeedback();
};

function mostrarFeedback() {
    if (cartConfirmation) {
        cartConfirmation.style.display = 'block';
        setTimeout(() => cartConfirmation.style.display = 'none', 2000); 
    }
}

function saveCart() {
    localStorage.setItem('cafetin_cart', JSON.stringify(cart));
}

function updateCartUI() {
    if (!cartCountElement) return;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.innerText = totalItems;
    renderSidebarItems();
}

function renderSidebarItems() {
    if (!sidebarItemsContainer) return;
    sidebarItemsContainer.innerHTML = '';
    let totalAmount = 0;

    if (cart.length === 0) {
        sidebarItemsContainer.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío.</p>';
    } else {
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            totalAmount += itemTotal;
            sidebarItemsContainer.innerHTML += `
                <div class="cart-item-sidebar">
                    <div class="cart-item-info">
                        <h4>${item.name} (x${item.quantity})</h4>
                        <p>$${itemTotal.toFixed(2)}</p>
                    </div>
                    <button class="remove-item-btn" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
        });
    }
    sidebarTotal.innerText = `$${totalAmount.toFixed(2)}`;
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
};

// Control Sidebar
if (openCartBtn) openCartBtn.addEventListener('click', () => {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('show');
});

const closeSidebar = () => {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('show');
};

if (closeCartBtn) closeCartBtn.addEventListener('click', closeSidebar);
if (cartOverlay) cartOverlay.addEventListener('click', closeSidebar);

// --- LEALTAD Y PAGOS ---
let puntosUsuario = 150; 
const elementoPuntos = document.getElementById('puntos-actuales');
const botonesCanjear = document.querySelectorAll('.btn-canjear');

function actualizarInterfazLealtad() {
    if (elementoPuntos) elementoPuntos.textContent = puntosUsuario;
    botonesCanjear.forEach(boton => {
        const costoItem = parseInt(boton.getAttribute('data-costo'));
        if (puntosUsuario < costoItem) {
            boton.disabled = true;
            boton.textContent = "Puntos insuficientes";
        } else {
            boton.disabled = false;
            boton.textContent = "Canjear";
        }
    });
}

// Navegación
window.navegarAlPago = function() {
    const carrito = JSON.parse(localStorage.getItem('cafetin_cart')) || [];
    if (carrito.length > 0) {
        window.location.href = "pago.html";
    } else {
        alert("¡Tu carrito está vacío!");
    }
};



document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log("DOM Cargado, iniciando renderizado...");
        
        // Ejecutamos las funciones base
        renderProducts();
        updateCartUI();
        actualizarInterfazLealtad();

        const contenedorNuevos = document.getElementById('contenedor-nuevos-productos');
        console.log("¿Existe el contenedor en el HTML?:", contenedorNuevos !== null);

        if (contenedorNuevos) {
            //ya no es necesaria la funcionalidad, pero si quito esto se rompe el codigo...
            const productosBaseNuevos = [
                { id: 'base1', nombre: "Arroz chino", precio: 5.75, imagen: "../css/imagenes/productos/arroz-chino-venezolano.jpg" },
                { id: 'base2', nombre: "Coca Cola botella 350ml", precio: 1.00, imagen: "../css/imagenes/productos/cocacola.jpeg"},
                { id: 'base3', nombre: "Galletas de chocolate", precio: 0.99, imagen: "../css/imagenes/productos/galletas.jpg"}
            ];
            
            const productosAdmin = JSON.parse(localStorage.getItem('cafetin_productos')) || [];
            
            const listaFinalNuevos = [...productosBaseNuevos, ...productosAdmin];
            
            let htmlExtra = '';
            
            listaFinalNuevos.forEach((prod, index) => {
                console.log(` 4. Procesando producto ${index + 1}:`, prod.nombre);
                
                // Forzamos a que el precio sea un número por si se guardó como texto por accidente
                const precioSeguro = Number(prod.precio);
                const precioFormateado = isNaN(precioSeguro) ? "0.00" : precioSeguro.toFixed(2);
                
                htmlExtra += `
                    <div class="product-card">
                        <img src="${prod.imagen}" alt="${prod.nombre}" class="product-img" onerror="this.src='https://via.placeholder.com/250x180?text=Cafetín+UCV'">
                        <div class="product-info">
                            <h3 class="product-title">${prod.nombre}</h3>
                            <div class="product-price">$${precioFormateado}</div>
                            <button class="btn-add-cart" onclick="agregarAlCarrito('${prod.id}', '${prod.nombre}', ${precioSeguro})">
                                <i class="fas fa-cart-plus"></i> Añadir
                            </button>
                        </div>
                    </div>
                `;
            });

            console.log(" 5. HTML construido, insertando en la página...");
            contenedorNuevos.innerHTML = htmlExtra;
            console.log(" 6. ¡Éxito! Los productos deberían verse ahora.");
            
        } else {
            console.error(" ERROR CRÍTICO: El div 'contenedor-nuevos-productos' no se encontró. Verifica que no hayas borrado su id en el HTML.");
        }
        
    } catch (error) {
        console.error(" SE DETECTÓ UN ERROR EN EL CÓDIGO QUE DETUVO LA CARGA:", error);
    }
});

function navegarAlPago() {
    if (carrito.length === 0) {
        alert("Agrega productos primero.");
        return;
    }
    // Guardamos el carrito para que la página de Pago lo encuentre
    localStorage.setItem('cafetin_cart', JSON.stringify(carrito));
    // Redirigimos
    window.location.href = 'pago.html';
}

// Función para actualizar el número del carrito leyendo el LocalStorage
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('cafetin_cart')) || [];
    const totalItems = carrito.reduce((acc, item) => acc + (item.quantity || 1), 0);
    
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.innerText = totalItems;
    }
}

// Ejecutar cada vez que se carga la página
window.addEventListener('DOMContentLoaded', actualizarContadorCarrito);

// Escuchar cambios en otras pestañas (por si pagas en una pestaña y tienes el menú abierto en otra)
window.addEventListener('storage', (event) => {
    if (event.key === 'cafetin_cart') {
        actualizarContadorCarrito();
    }
});