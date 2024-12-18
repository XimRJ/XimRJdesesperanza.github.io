async function cargarInventario() {
    try {
        const response = await fetch('http://localhost:5000/inventario');
        if (!response.ok) throw new Error('Error al obtener inventario');

        const productos = await response.json();
        const contenedorCarruselTemporada = document.querySelector('.elementos-carrusel-temporada');
        const contenedorCarruselTradicional = document.querySelector('.elementos-carrusel-tradicional');
        
        contenedorCarruselTemporada.innerHTML = '';
        contenedorCarruselTradicional.innerHTML = '';

        // Separa productos por categoría
        productos.forEach(producto => {
            const elementoHTML = `
                <div class="elemento-carrusel">
                    <img src="${producto.urlimage}" alt="${producto.Nombre}">
                    <h3>${producto.Nombre}</h3>
                    <p class="descripcion">${producto.Descripcion}</p>
                    <p class="precio">$${producto.Precio} MXN</p>
                    <p class="cantidad">Cantidad: <span>${producto.cantidad}</span></p>
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

cargarInventario();