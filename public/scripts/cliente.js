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

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function agregarAlCarrito(id, nombre, precio) {
    const productoExistente = carrito.find(item => item.id === id);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({ id, nombre, precio, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert(`${nombre} se agregó al carrito.`);
    actualizarVistaCarrito();
}

cargarInventario();


