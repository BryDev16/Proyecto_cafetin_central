// --- 1. DATOS DE RESPALDO ---
const productosOriginales = [
    { id: 1, nombre: "Empanada de carne", precio: 1.5, imagen: "../css/imagenes/productos/empanadas.jpg" },
    { id: 2, nombre: "Pastel de chocolate", precio: 3.0, imagen: "../css/imagenes/productos/torta.jpg" },
    { id: 3, nombre: "Pizza", precio: 2.5, imagen: "../css/imagenes/productos/pizza.jpg" },
    { id: 4, nombre: "Sándwich de pollo", precio: 3.0, imagen: "../css/imagenes/productos/sandwich.jpg" },
    { id: 5, nombre: "Café", precio: 1.2, imagen: "../css/imagenes/productos/necesito-3-litros-de-eso.jpg" },
    { id: 6, nombre: "Donas", precio: 1.0, imagen: "../css/imagenes/productos/donas.jpg" },
    { id: 7, nombre: "Malta", precio: 1.5, imagen: "../css/imagenes/productos/MALTA-250ML.jpg" },
    { id: 8, nombre: "Pie de limon", precio: 2.5, imagen: "../css/imagenes/productos/Pie-de-limon.jpg" },
    { id: 9, nombre: "Pollo frito", precio: 5.0, imagen: "../css/imagenes/productos/pollo_frito.jpg" },
    { id: 10, nombre: "Té Lipton Durazno", precio: 2.5, imagen: "../css/imagenes/productos/te_lipton.jpg" },
    { id: 11, nombre: "Tequeños", precio: 1.0, imagen: "../css/imagenes/productos/tequenos.jpg" },
    { id: 12, nombre: "Batido de frutas", precio: 2.0, imagen: "../css/imagenes/productos/batido-de-fresa-y-platano-receta-saludable.jpeg" },
    { id: 13, nombre: "Agua", precio: 0.8, imagen: "../css/imagenes/productos/agua.jpg" },
    { id: 14, nombre: "Salchipapa", precio: 4.0, imagen: "../css/imagenes/productos/salchipapa.jpg" },
    { id: 15, nombre: "Papas rellenas", precio: 1.5, imagen: "../css/imagenes/productos/papas_rellenas.jpeg" }
];

// Cargar desde LocalStorage o usar los originales si está vacío
let productosAdmin = JSON.parse(localStorage.getItem('cafetin_productos'));

if (!productosAdmin || productosAdmin.length === 0) {
    productosAdmin = productosOriginales;
    localStorage.setItem('cafetin_productos', JSON.stringify(productosOriginales));
}

// --- 2. MOSTRAR LA LISTA EN EL PANEL ---
function renderizarListaAdmin() {
    const contenedor = document.getElementById('lista-productos');
    if (!contenedor) return;
    
    contenedor.innerHTML = ''; // Limpiar antes de dibujar
    
    productosAdmin.forEach(prod => {
        contenedor.innerHTML += `
            <li class="admin-list-item">
                <div class="item-info">
                    <span class="item-name">${prod.nombre || prod.name}</span>
                    <span class="item-meta">$${Number(prod.precio || prod.price).toFixed(2)}</span>
                </div>
                <button class="btn-danger" onclick="eliminarProducto(${prod.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </li>
        `;
    });
}

// --- 3. AGREGAR NUEVOS PRODUCTOS ---
document.addEventListener('DOMContentLoaded', () => {
    // Dibujamos la lista al cargar la página
    renderizarListaAdmin();

    const formProducto = document.getElementById('form-agregar-producto');
    
    if (formProducto) {
        formProducto.addEventListener('submit', function(e) {
            e.preventDefault(); // ¡CRÍTICO! Evita que la página se recargue

            // Obtener los valores del formulario
            const nombre = document.getElementById('prod-nombre').value;
            const precio = parseFloat(document.getElementById('prod-precio').value);
            const imagen = document.getElementById('prod-imagen').value;

            // Crear el nuevo objeto
            const nuevoProducto = {
                id: Date.now(), // Se le asigna un ID único con la hora actual
                nombre: nombre,
                precio: precio,
                imagen: imagen
            };

            // Guardarlo en el arreglo y luego en la memoria del navegador
            productosAdmin.push(nuevoProducto);
            localStorage.setItem('cafetin_productos', JSON.stringify(productosAdmin));
            
            // Actualizar la vista y limpiar el formulario
            renderizarListaAdmin();
            formProducto.reset();
            alert("¡Producto agregado exitosamente al menú!");
        });
    }
});

// --- 4. ELIMINAR PRODUCTOS ---
window.eliminarProducto = function(idABorrar) {
    if(confirm("¿Estás seguro de que deseas eliminar este producto de todo el sistema?")) {
        // Filtramos para quedarnos con todos MENOS el que queremos borrar
        productosAdmin = productosAdmin.filter(prod => prod.id !== idABorrar);
        
        // Guardamos la nueva lista actualizada
        localStorage.setItem('cafetin_productos', JSON.stringify(productosAdmin));
        
        // Volvemos a dibujar
        renderizarListaAdmin();
    }
};