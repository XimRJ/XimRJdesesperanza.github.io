// Obtener productos del carrito desde localStorage
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Contenedor donde se mostrarán los productos
const contenedorCarrito = document.querySelector(".contenedor-carrito");
const carritoTotal = document.querySelector(".carrito-total");

//Funcion para los productos y el total
function renderizarCarrito() {
    contenedorCarrito.innerHTML = "";

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = "<p>Tu carrito está vacío.</p>";
        carritoTotal.textContent = "Total: $0.00 MXN";
        return;
    }

    carrito.forEach((producto, index) => {
        const productoHTML = `
            <div class="producto-carrito">
                <img src="${producto.urlImage}" alt="${producto.nombre}" class="imagen-producto">
                <div class="detalles-producto">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion || "Sin descripción"}</p>
                    <p>Precio: $${producto.precio.toFixed(2)}</p>
                    <p>Cantidad: ${producto.cantidad}</p>
                </div>
                <button class="boton-eliminar" onclick="eliminarDelCarrito(${index})">Eliminar</button>
            </div>
        `;
        contenedorCarrito.insertAdjacentHTML("beforeend", productoHTML);
    });

    const total = carrito.reduce((suma, producto) => suma + producto.precio * producto.cantidad, 0);
    carritoTotal.textContent = `Total: $${total.toFixed(2)} MXN`;
}

// Eliminar
function eliminarDelCarrito(index) {
    const productoEliminado = carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert(`${productoEliminado[0].nombre} se eliminó del carrito.`);
    renderizarCarrito();
}

// Renderizar carrito al cargar la página
renderizarCarrito();
