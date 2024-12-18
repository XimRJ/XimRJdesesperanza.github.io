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
                    <button class="boton-editar" onclick="abrirModalEditar(${producto.PANID})">Actualizar</button>
                    <button class="boton-eliminar" onclick="eliminarProducto(${producto.PANID})">Eliminar</button>
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

const modalAgregarProducto = document.getElementById('modalAgregarProducto');
const agregarProductoBtn = document.getElementById('agregarProductoBtn');
const cerrarModal = document.getElementById('cerrarModal');
const formAgregarProducto = document.getElementById('formAgregarProducto');

agregarProductoBtn.onclick = function() {
    modalAgregarProducto.style.display = 'block';
}

cerrarModal.onclick = function() {
    modalAgregarProducto.style.display = 'none';
}

// Validaciones
document.getElementById('precio').addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9.]/g, ''); // Solo números y puntos
    if (this.value.split('.').length > 2) this.value = this.value.slice(0, -1); // Evitar más de un punto decimal
    if (parseFloat(this.value) < 0) this.value = ''; // Evitar valores negativos
});

document.getElementById('nombre').addEventListener('input', function() {
    this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''); // Solo letras y espacios
});

document.getElementById('descripcion').addEventListener('input', function() {
    this.value = this.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g, ''); // Solo letras, números y espacios
});

document.getElementById('cantidad').addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, ''); // Solo números enteros
    if (parseInt(this.value) < 0) this.value = ''; // Evitar valores negativos
});

// Agregar
formAgregarProducto.onsubmit = async function(e) {
    e.preventDefault();

    const nuevoProducto = {
        Nombre: document.getElementById('nombre').value,
        Descripcion: document.getElementById('descripcion').value,
        Precio: parseFloat(document.getElementById('precio').value).toFixed(2),
        cantidad: parseInt(document.getElementById('cantidad').value, 10),
        categoria: document.getElementById('categoria').value,
        urlimage: document.getElementById('urlimage').value
    };

    try {
        const response = await fetch('http://localhost:5000/inventario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoProducto)
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            cargarInventario();
            modalAgregarProducto.style.display = 'none';
            formAgregarProducto.reset();
        } else {
            alert('Error al agregar el producto: ' + data.error);
        }
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        alert('Error al agregar el producto. Intenta nuevamente.');
    }
}

// Eliminar
async function eliminarProducto(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        try {
            const response = await fetch(`http://localhost:5000/inventario/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                cargarInventario();
            } else {
                alert('Error al eliminar el producto: ' + data.error);
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            alert('Error al eliminar el producto. Intenta nuevamente.');
        }
    }
}

const modalEditarProducto = document.getElementById('modalEditarProducto');
const cerrarModalEditar = document.getElementById('cerrarModalEditar');
const formEditarProducto = document.getElementById('formEditarProducto');

// Editar
async function abrirModalEditar(id) {
    try {
        const response = await fetch(`http://localhost:5000/inventario/${id}`);
        if (!response.ok) throw new Error('Error al obtener producto');

        const producto = await response.json();

        document.getElementById('editarId').value = producto.PANID;
        document.getElementById('editarNombre').value = producto.Nombre;
        document.getElementById('editarDescripcion').value = producto.Descripcion;
        document.getElementById('editarPrecio').value = producto.Precio;
        document.getElementById('editarCantidad').value = producto.cantidad;
        document.getElementById('editarCategoria').value = producto.categoria;
        document.getElementById('editarUrlImagen').value = producto.urlimage;

        modalEditarProducto.style.display = 'block';
    } catch (error) {
        console.error(error);
        alert('Error al cargar los datos del producto. Intenta nuevamente.');
    }
}

cerrarModalEditar.onclick = function() {
    modalEditarProducto.style.display = 'none';
}

// Validaciones para Editar
document.getElementById('editarPrecio').addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9.]/g, ''); // Solo números y puntos
    if (this.value.split('.').length > 2) this.value = this.value.slice(0, -1); // Evitar más de un punto decimal
    if (parseFloat(this.value) < 0) this.value = ''; // Evitar valores negativos
});

document.getElementById('editarNombre').addEventListener('input', function() {
    this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''); // Solo letras y espacios
});

document.getElementById('editarDescripcion').addEventListener('input', function() {
    this.value = this.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g, ''); // Solo letras, números y espacios
});

document.getElementById('editarCantidad').addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, ''); // Solo números enteros
    if (parseInt(this.value) < 0) this.value = ''; // Evitar valores negativos
});

// Actualizar
formEditarProducto.onsubmit = async function(e) {
    e.preventDefault();

    const id = document.getElementById('editarId').value;
    const productoActualizado = {
        Nombre: document.getElementById('editarNombre').value,
        Descripcion: document.getElementById('editarDescripcion').value,
        Precio: parseFloat(document.getElementById('editarPrecio').value).toFixed(2),
        cantidad: parseInt(document.getElementById('editarCantidad').value, 10),
        categoria: document.getElementById('editarCategoria').value,
        urlimage: document.getElementById('editarUrlImagen').value
    };

    try {
        const response = await fetch(`http://localhost:5000/inventario/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productoActualizado)
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            cargarInventario();
            modalEditarProducto.style.display = 'none';
        } else {
            alert('Error al actualizar el producto: ' + data.error);
        }
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        alert('Error al actualizar el producto. Intenta nuevamente.');
    }
}


// Cerrar el modal
window.onclick = function(event) {
    if (event.target === modalEditarProducto) {
        modalEditarProducto.style.display = 'none';
    }
    if (event.target === modalAgregarProducto) {
        modalAgregarProducto.style.display = 'none';
    }
};


cargarInventario();
