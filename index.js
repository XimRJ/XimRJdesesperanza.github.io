const mysql = require("mysql2/promise"); // Usar mysql2/promise para soporte de promesas
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const dbConfig = {
    host: "localhost",
    user: "root",
    password: "Y00ng!", // Cambiar la contraseña
    database: "desesperaza"
};

// Función para conectar a la base de datos
async function connectDB() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log("¡Conexión exitosa a la base de datos!");
        return connection;
    } catch (err) {
        console.error("Error en la conexión a la base de datos:", err);
        throw err;
    }
}

const port = 5000;
app.use(express.static('public'));
app.use(express.static('public/html'));
// Endpoint para iniciar sesión (login)
app.post('/sesion', async (req, res) => {
    const { correo, password } = req.body;

    try {
        const connection = await connectDB();

        // Verificar si es usuario
        const userQuery = 'SELECT * FROM cliente WHERE correo_electronico_cliente = ? AND password_cliente = ?';
        const [userResults] = await connection.execute(userQuery, [correo, password]);
        
        if (userResults.length > 0) {
            return res.status(200).json({status: 1, email: correo});
        }

        // Verificar si es administrador
        const adminQuery = 'SELECT * FROM administrador WHERE correo_electronico_administrador = ? AND password_administrador = ?';
        const [adminResults] = await connection.execute(adminQuery, [correo, password]);

        if (adminResults.length > 0) {
            return res.status(200).json({status: 2, email: correo}); // Redirige a la página del administrador
        } else {
            return res.status(401).send('Credenciales incorrectas');
        }
    } catch (err) {
        console.error('Error en la consulta de inicio de sesión:', err);
        res.status(500).send('Error al procesar la solicitud');
    }
});

// Endpoint para registrar un nuevo usuario (signup)
app.post('/registrar', async (req, res) => {
    const { nombre, correo, password } = req.body;

    try {
        const connection = await connectDB();
        const insertClientQuery = 'INSERT INTO cliente (nombre_cliente, correo_electronico_cliente, password_cliente) VALUES (?, ?, ?)';
        const [result] = await connection.execute(insertClientQuery, [nombre, correo, password]);
        
        res.status(201).json({ mensaje: 'Usuario Registrado con éxito' });
    } catch (err) {
        console.error('Error en el registro del usuario:', err);
        res.status(500).send('Error al registrar al usuario');
    }
});

// Ruta para registrar pan en inventario
app.post('/inventario', async (req, res) => {
    const { Nombre, Descripcion, Precio, categoria, urlimage, cantidad } = req.body;
    const query = 'INSERT INTO inventario (Nombre, Descripcion, Precio, categoria, urlimage, cantidad) VALUES (?, ?, ?, ?, ?, ?)';
    try {
        const connection = await connectDB();
        const [result] = await connection.execute(query, [Nombre, Descripcion, Precio, categoria, urlimage, cantidad]);
        res.status(201).json({ message: 'Pan registrado :D', id: result.insertId });
    } catch (err) {
        console.error('Error al registrar pan:', err);
        res.status(500).json({ error: 'Error al registrar pan' });
    }
});

// Mostrar todos los productos
app.get('/inventario', async (req, res) => {
    const query = 'SELECT * FROM inventario';
    try {
        const connection = await connectDB();
        const [results] = await connection.execute(query);
        res.status(200).json(results);
    } catch (err) {
        console.error('Error al obtener registro:', err);
        res.status(500).json({ error: 'Error al obtener registros' });
    }
});

// Obtener un producto por ID
app.get('/inventario/:PANID', async (req, res) => {
    const { PANID } = req.params;
    const query = 'SELECT * FROM inventario WHERE PANID = ?';
    try {
        const connection = await connectDB();
        const [results] = await connection.execute(query, [PANID]);
        if (results.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json(results[0]); // Devolver el primer resultado
    } catch (err) {
        console.error('Error al obtener el producto:', err);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// Actualizar producto
app.put('/inventario/:PANID', async (req, res) => {
    const { PANID } = req.params;
    const { Nombre, Descripcion, Precio, categoria, urlimage, cantidad } = req.body;
    const query = 'UPDATE inventario SET Nombre=?, Descripcion=?, Precio=?, categoria=?, urlimage=?, cantidad=? WHERE PANID=?';
    try {
        const connection = await connectDB();
        const [result] = await connection.execute(query, [Nombre, Descripcion, Precio, categoria, urlimage, cantidad, PANID]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.status(200).json({ message: 'Registro actualizado' });
    } catch (err) {
        console.error('Error al actualizar el registro:', err);
        res.status(500).json({ error: 'Error al actualizar el registro' });
    }
});

// Eliminar producto
app.delete('/inventario/:PANID', async (req, res) => {
    const { PANID } = req.params;
    const query = 'DELETE FROM inventario WHERE PANID = ?';
    try {
        const connection = await connectDB();
        const [result] = await connection.execute(query, [PANID]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.status(200).json({ message: 'Registro eliminado' });
    } catch (err) {
        console.error('Error al eliminar el registro:', err);
        res.status(500).json({ error: 'Error al eliminar el registro' });
    }
});

// Ruta para agregar productos al carrito
app.post('/carrito/:id_cliente', async (req, res) => {
    const { id_cliente } = req.params;
    const { PANID, cantidad } = req.body;

    try {
        const connection = await connectDB();
        // Verificar si el producto ya está en el carrito del cliente
        const [productoExistente] = await connection.execute(
            'SELECT * FROM carrito WHERE id_cliente = ? AND pan_id = ?',
            [id_cliente, PANID]
        );

        if (productoExistente.length > 0) {
            // Si el producto ya existe en el carrito, actualizar la cantidad
            await connection.execute(
                'UPDATE carrito SET cantidad = cantidad + ? WHERE id_cliente = ? AND pan_id = ?',
                [cantidad, id_cliente, PANID]
            );
        } else {
            // Si el producto no existe, agregarlo al carrito
            await connection.execute(
                'INSERT INTO carrito (id_cliente, pan_id, cantidad) VALUES (?, ?, ?)',
                [id_cliente, PANID, cantidad]
            );
        }

        res.status(200).json({ message: 'Producto agregado al carrito correctamente.' });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ message: 'Error al agregar el producto al carrito.' });
    }
});

// Ruta para obtener los productos en el carrito
app.get('/carrito/:id_cliente', async (req, res) => {
    const { id_cliente } = req.params;

    try {
        const connection = await connectDB();
        const [productosCarrito] = await connection.execute(
            `SELECT i.Nombre, i.Descripcion, i.Precio, c.cantidad
            FROM carrito c
            JOIN inventario i ON c.pan_id = i.PANID
            WHERE c.id_cliente = ?`,
            [id_cliente]
        );

        res.status(200).json(productosCarrito);
    } catch (error) {
        console.error('Error al obtener productos del carrito:', error);
        res.status(500).json({ message: 'Error al obtener los productos del carrito.' });
    }
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
