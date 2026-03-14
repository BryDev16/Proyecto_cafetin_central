//usuarios del inicio de sesion
//cliente
const cliente_user = 'ClienteUCV';
const cliente_password = 'Central_123';

//personal de caja
const caja_user = 'caja_01';
const caja_password = 'Cajero#123';
//admin
const admin_user = 'adminRoot';
const admin_password = 'cafetinAdmin';

//lista de productos
/* era lo que utilizaba antes para mostrar los productos, lo cambie para que esten todos en el local storage */
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
        
        // Elementos del Sidebar
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        const openCartBtn = document.getElementById('open-cart-btn');
        const closeCartBtn = document.getElementById('close-cart-btn');
        const sidebarItemsContainer = document.getElementById('sidebar-items-container');
        const sidebarTotal = document.getElementById('sidebar-total');

        // 1. Renderizar Catálogo
        function renderProducts() {
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

        // 2. Añadir al carrito
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

            // Feedback visual
            cartConfirmation.style.display = 'block';
            setTimeout(() => cartConfirmation.style.display = 'none', 2000); 
        }

        // 3. Guardar y Actualizar Interfaz
        function saveCart() {
            localStorage.setItem('cafetin_cart', JSON.stringify(cart));
        }

        function updateCartUI() {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountElement.innerText = totalItems;
            renderSidebarItems(); // Actualiza visualmente los elementos del panel
        }

        // 4. Renderizar elementos en el panel lateral
        function renderSidebarItems() {
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

        // 5. Eliminar producto del carrito
        window.removeFromCart = function(index) {
            cart.splice(index, 1);
            saveCart();
            updateCartUI();
        };

        // 6. Control del Panel Lateral (Abrir/Cerrar)
        openCartBtn.addEventListener('click', () => {
            cartSidebar.classList.add('open');
            cartOverlay.classList.add('show');
        });

        const closeSidebar = () => {
            cartSidebar.classList.remove('open');
            cartOverlay.classList.remove('show');
        };

        closeCartBtn.addEventListener('click', closeSidebar);
        cartOverlay.addEventListener('click', closeSidebar); // Cierra si haces clic fuera del panel

        // Inicializar al cargar
        document.addEventListener('DOMContentLoaded', () => {
            renderProducts();
            updateCartUI();
        });

        // 7. Lógica de funcionamiento del canje de puntos de lealtad
        let puntosUsuario = 150; 

        const elementoPuntos = document.getElementById('puntos-actuales');
        const botonesCanjear = document.querySelectorAll('.btn-canjear');
        const notificacion = document.getElementById('notificacion');

        function actualizarInterfaz() {
    // Escudo: Solo cambiamos el texto SI el elementoPuntos existe en esta página
    if (elementoPuntos) {
        elementoPuntos.textContent = puntosUsuario;
    }

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

        function mostrarMensaje(mensaje, esExito) {
    // Escudo protector para la notificación
    if (notificacion) {
        notificacion.textContent = mensaje;
        notificacion.style.backgroundColor = esExito ? "#466b5c" : "#8A3B08";
        notificacion.style.display = 'block';

        setTimeout(() => {
            notificacion.style.display = 'none';
        }, 3000);
    }
}

        botonesCanjear.forEach(boton => {
            boton.addEventListener('click', function() {
                const costo = parseInt(this.getAttribute('data-costo'));
                const premio = this.getAttribute('data-premio');

                if (puntosUsuario >= costo) {
                    puntosUsuario -= costo;
                    mostrarMensaje(`¡Éxito! Has canjeado ${premio}`, true);
                    actualizarInterfaz();
                } else {
                    mostrarMensaje('Saldo insuficiente', false);
                }
            });
        });

        // Inicializar
        actualizarInterfaz();

        //8- botones de translado de pagina

        //ir a pagar

        function navegarAlPago() {
    // 1. Recuperamos el carrito para ver si tiene algo
    const carrito = JSON.parse(localStorage.getItem('cafetin_cart')) || [];

    // 2. Comprobamos si hay productos
    if (carrito.length > 0) {
        // Si hay productos, redirigimos a la página de pago
        window.location.href = "pago.html";
    } else {
        // Si está vacío, avisamos al usuario
        alert("¡Tu carrito está vacío! Añade algún producto antes de ir a pagar.");
    }
}

//para el de inicio de sesion

// Localizamos el formulario
const loginForm = document.getElementById('login-form');

// EL ESCUDO: Solo ejecutamos esto si loginForm NO es null
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;

        const usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuarioValido = usuariosRegistrados.find(u => u.username === user && u.password === pass);

        if (usuarioValido) {
            localStorage.setItem('usuario_activo', JSON.stringify(usuarioValido));
            alert("¡Bienvenido!");
            window.location.href = "menu.html"; 
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    });
}
document.addEventListener('DOMContentLoaded', () => {
    const contenedorNuevos = document.getElementById('contenedor-nuevos-productos');

    // 1. PRODUCTOS POR DEFECTO
    const productosBaseNuevos = [
        { id: 'base1', nombre: "Bowl de Frutas", precio: 3.50, imagen: "../css/imagenes/general/bowl.jpg" },
        { id: 'base2', nombre: "Muffin Integral", precio: 2.00, imagen: "../css/imagenes/general/muffin.jpg" },
        { id: 'base3', nombre: "Té Frío Artesanal", precio: 1.20, imagen: "../css/imagenes/general/te.jpg" }
    ];

    // 2. OBTENER PRODUCTOS DEL ADMIN
    const productosAdmin = JSON.parse(localStorage.getItem('cafetin_productos')) || [];

    // 3. COMBINAR AMBOS ARREGLOS
    const listaFinalNuevos = [...productosBaseNuevos, ...productosAdmin];

    // 4. FUNCIÓN PARA RENDERIZAR (Usando tus clases y estilos)
    function cargarNovedades() {
        let htmlExtra = '';
        
        listaFinalNuevos.forEach(prod => {
            // Validamos que el precio sea un número para evitar errores visuales
            const precioFormateado = typeof prod.precio === 'number' ? prod.precio.toFixed(2) : prod.precio;
            
            htmlExtra += `
                <div class="product-card">
                    <img src="${prod.imagen}" alt="${prod.nombre}" class="product-img" onerror="this.src='https://via.placeholder.com/250x180?text=Cafetín+UCV'">
                    <div class="product-info">
                        <h3 class="product-title">${prod.nombre}</h3>
                        <div class="product-price">$${precioFormateado}</div>
                        <button class="btn-add-cart" onclick="agregarAlCarrito('${prod.id}', '${prod.nombre}', ${prod.precio})">
                            <i class="fas fa-cart-plus"></i> Añadir
                        </button>
                    </div>
                </div>
            `;
        });

        contenedorNuevos.innerHTML = htmlExtra;
    }

    // Ejecutar la carga
    cargarNovedades();
});