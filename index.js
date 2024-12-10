const mysql = require("mysql2");
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express();

// Configurar body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Y00ng!", // Cambiar la contraseña según sea necesario
    database: "desesperaza"
});

db.connect(err => {
    if (err) {
        console.error("Error en la conexión a la base de datos:", err);
        return;
    }
    console.log("¡Conexión exitosa a la base de datos!");
});

const port = 5000;

// Servir el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Registrar un producto
app.post('/inventario', (req, res) => {
    const { Nombre, Descripcion, Precio, categoria, urlimage, cantidad } = req.body;
    const query = 'INSERT INTO inventario (Nombre, Descripcion, Precio, categoria, urlimage, cantidad) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(query, [Nombre, Descripcion, Precio, categoria, urlimage, cantidad], (err, result) => {
        if (err) {
            console.error('Error al registrar pan:', err);
            return res.status(500).json({ error: 'Error al registrar pan' });
        }
        res.status(201).json({ message: 'Pan registrado :D', id: result.insertId });
    });
});

// Mostrar todos los productos
app.get('/inventario', (req, res) => {
    const query = 'SELECT * FROM inventario';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener registro:', err);
            return res.status(500).json({ error: 'Error al obtener registros' });
        }
        res.status(200).json(results);
    });
});

// Obtener un producto por ID
app.get('/inventario/:PANID', (req, res) => {
    const { PANID } = req.params;
    const query = 'SELECT * FROM inventario WHERE PANID = ?';

    db.query(query, [PANID], (err, results) => {
        if (err) {
            console.error('Error al obtener el producto:', err);
            return res.status(500).json({ error: 'Error al obtener el producto' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json(results[0]); // Devolver el primer resultado
    });
});

// Actualizar un producto por ID
app.put('/inventario/:PANID', (req, res) => {
    const { PANID } = req.params;
    const { Nombre, Descripcion, Precio, categoria, urlimage, cantidad } = req.body;
    const query = 'UPDATE inventario SET Nombre=?, Descripcion=?, Precio=?, categoria=?, urlimage=?, cantidad=? WHERE PANID=?';

    db.query(query, [Nombre, Descripcion, Precio, categoria, urlimage, cantidad, PANID], (err, result) => {
        if (err) {
            console.error('Error al actualizar el registro:', err);
            return res.status(500).json({ error: 'Error al actualizar el registro' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.status(200).json({ message: 'Registro actualizado' });
    });
});

// Eliminar un producto por ID
app.delete('/inventario/:PANID', (req, res) => {
    const { PANID } = req.params;
    const query = 'DELETE FROM inventario WHERE PANID = ?';

    db.query(query, [PANID], (err, result) => {
        if (err) {
            console.error('Error al eliminar el registro:', err);
            return res.status(500).json({ error: 'Error al eliminar el registro' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.status(200).json({ message: 'Registro eliminado' });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
