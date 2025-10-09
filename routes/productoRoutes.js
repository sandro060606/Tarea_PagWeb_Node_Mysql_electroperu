//RUTAS = acceso a los recursos
//Verbos:
//GET - Obtener, PUT = Actualizar, POST = crear, DELETE = eliminar
const express = require('express')

//Enrutador
const router = express.Router()

//Acceso = Crear, Listar, etc...
const productoController = require('../controllers/productoController')

//Definiendo las rutas
router.post('/', productoController.crearProducto)

router.get('/', productoController.obtenerProductos)

router.get('/:id', productoController.obtenerProductoPorId)

router.put('/:id', productoController.actualizarProducto)

router.delete('/:id', productoController.eliminarProducto)

module.exports = router