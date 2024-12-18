async function cargarInventario() {
    try {
        const response = await fetch('http://localhost:5000/inventario');
        if (!response.ok) throw new Error('Error al obtener inventario');

        const productos = await response.json();
        const contenedorCarruselTemporada = document.querySelector('.elementos-carrusel-temporada');
        const contenedorCarruselTradicional = document.querySelector('.elementos-carrusel-tradicional');

        contenedorCarruselTemporada.innerHTML = '';
        contenedorCarruselTradicional.innerHTML = '';

        productos.forEach(producto => {
            const elementoHTML = `
                <div class="elemento-carrusel">
                    <img src="${producto.urlimage}" alt="${producto.Nombre}">
                    <h3>${producto.Nombre}</h3>
                    <p class="descripcion">${producto.Descripcion}</p>
                    <p class="precio">$${producto.Precio} MXN</p>
                    <p class="cantidad">Cantidad: <span>${producto.cantidad}</span></p>
                    <button class="boton-agregar" onclick="agregarAlCarrito(${producto.PANID}, '${producto.Nombre}', ${producto.Precio})">Agregar al carrito</button>
                </div>
            `;

            if (producto.categoria.toLowerCase() === 'temporada') {
                contenedorCarruselTemporada.insertAdjacentHTML('beforeend', elementoHTML);
            } else if (producto.categoria.toLowerCase() === 'tradicional') {
                contenedorCarruselTradicional.insertAdjacentHTML('beforeend', elementoHTML);
            }
        });
    } catch (error) {
        console.error(error);
    }
}

async function agregarAlCarrito(id, nombre, precio) {
    const idCliente = 1;

    try {
        const response = await fetch(`http://localhost:5000/carrito/${idCliente}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                PANID: id,
                cantidad: 1,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(`${nombre} se agregó al carrito.`);
            actualizarVistaCarrito();
        } else {
            alert('Error al agregar el producto al carrito: ' + data.message);
        }
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        alert('Hubo un error al agregar el producto al carrito.');
    }
}

async function actualizarVistaCarrito() {
    const idCliente = 1;

    try {
        const response = await fetch(`http://localhost:5000/carrito/${idCliente}`);
        const productosCarrito = await response.json();

        const contenedorCarrito = document.querySelector('.contenedor-carrito');
        contenedorCarrito.innerHTML = '';

        if (productosCarrito.length === 0) {
            contenedorCarrito.innerHTML = "<p>Tu carrito está vacío.</p>";
            return;
        }

        productosCarrito.forEach(producto => {
            const productoHTML = `
                <div class="producto-carrito">
                    <div class="detalles-producto">
                        <h3>${producto.Nombre}</h3>
                        <p>Precio: $${producto.Precio.toFixed(2)} MXN</p>
                        <p>Cantidad: ${producto.cantidad}</p>
                    </div>
                    <button class="boton-agregar" onclick="EliminardelCarrito(${producto.PANID}, '${producto.Nombre}', ${producto.Precio})">Eliminar</button>
                </div>
            `;
            contenedorCarrito.insertAdjacentHTML('beforeend', productoHTML);
        });
    } catch (error) {
        console.error('Error al cargar el carrito:', error);
    }
}

async function cargarCarrito() {
    const idCliente = 1;
    const carritoTotal = document.querySelector('#carritoTotal');

    try {
        const response = await fetch(`http://localhost:5000/carrito/${idCliente}`);
        const productosCarrito = await response.json();

        const contenedorCarrito = document.querySelector('.contenedor-carrito');
        contenedorCarrito.innerHTML = '';

        if (!productosCarrito || productosCarrito.length === 0) {
            contenedorCarrito.innerHTML = "<p>Tu carrito está vacío.</p>";
            carritoTotal.textContent = "Total: $0.00 MXN";
            return;
        }

        productosCarrito.forEach(producto => {
            const precioNumerico = parseFloat(producto.Precio);

            const elementoHTML = `
                <div class="producto-carrito">
                    <div class="detalles-producto">
                        <h3>${producto.Nombre}</h3>
                        <p>${producto.Descripcion || "Sin descripción"}</p>
                        <p>Precio: $${precioNumerico.toFixed(2)} MXN</p>
                        <p>Cantidad: ${producto.cantidad}</p>
                    </div>
                    <button class="boton-agregar" onclick="EliminardelCarrito(${producto.PANID}, \"${producto.Nombre}\")">Eliminar</button>

                </div>
            `;
            contenedorCarrito.insertAdjacentHTML('beforeend', elementoHTML);
        });

        const total = productosCarrito.reduce((suma, producto) => suma + producto.Precio * producto.cantidad, 0);
        carritoTotal.textContent = `Total: $${total.toFixed(2)} MXN`;

    } catch (error) {
        console.error('Error al cargar el carrito:', error);
    }
}



const modalCarrito = document.getElementById('modalCarrito');
const abrirModal = document.getElementById('abrirModal');
const cerrarModal = document.getElementById('cerrar-modal');

abrirModal.addEventListener('click', () => {
    cargarCarrito();
    modalCarrito.style.display = 'block';
});

cerrarModal.addEventListener('click', () => {
    modalCarrito.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modalCarrito) {
        modalCarrito.style.display = 'none';
    }
});

async function mostrarTicket() {
    const idCliente = 1;
    const nombreNegocio = "Panadería La Desesperanza";
    const numeroVenta = Math.floor(Math.random() * 100000);
    const fecha = new Date().toLocaleString();

    try {
        const response = await fetch(`http://localhost:5000/carrito/${idCliente}`);
        const productosCarrito = await response.json();

        const modalTicket = document.getElementById('modalTicket');
        const listaProductos = modalTicket.querySelector('#productosComprados ul');
        const totalElement = modalTicket.querySelector('#totalAPagar');

        listaProductos.innerHTML = '';
        let total = 0;

        productosCarrito.forEach(producto => {
            const item = document.createElement('li');
            item.textContent = `${producto.Nombre} (x${producto.cantidad}) - $${(producto.Precio * producto.cantidad).toFixed(2)} MXN`;
            listaProductos.appendChild(item);

            total += producto.Precio * producto.cantidad;
        });

        document.getElementById('nombreNegocio').textContent = nombreNegocio;
        document.getElementById('fechaCompra').textContent = `Fecha: ${fecha}`;
        totalElement.textContent = `Total a Pagar: $${total.toFixed(2)} MXN`;
        document.getElementById('numeroVenta').textContent = `Número de Venta: ${numeroVenta}`;
        
        modalTicket.style.display = 'block';
    } catch (error) {
        console.error('Error al mostrar el ticket:', error);
        alert('Hubo un error al generar el ticket.');
    }
}

document.getElementById('mostrarTicket').addEventListener('click', mostrarTicket);

document.getElementById('cerrarTicket').addEventListener('click', () => {
    document.getElementById('modalTicket').style.display = 'none';
});

window.addEventListener('click', (event) => {
    const modal = document.getElementById('modalTicket');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

cargarInventario();
