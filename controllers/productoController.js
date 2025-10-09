//Acceso a la BD mysql/promise
const db = require('../config/db')

//Métodos exportados
//req   require (solicitud)
//res   response (respuesta)

//Crear
exports.crearProducto = async (req, res) => {
  //1. Recepcionar los datos
  const {descripcion, garantia, precio} = req.body

  //2. Validación backend
  if (!descripcion || garantia == undefined || !precio){
    return res.status(400).json({mensaje: 'Falta completar los campos'})
  }

  //3. Estructurar la consulta ... ? = comodin (tiene un índice, similar a un array)
  const sql = "INSERT INTO productos (descripcion, garantia, precio) VALUES (?,?,?)"

  //4. Transacción
  try{
    //5. Ejecutamos la consulta
    const [result] = await db.query(sql, [descripcion, garantia, precio])

    //6. Entregar un resultado (PK)
    res.status(201).json({
      id: result.insertId,
      mensaje: 'Registrado correctamente'
    })

  }catch(e){
    console.error(e)
    res.status(500).json({mensaje: 'Error interno del servidor'})
  }
}

//Listar
exports.obtenerProductos = async (req, res) => {
  //1. Preparar consulta
  const sql = "SELECT id, descripcion, garantia, precio FROM productos"

  //2. Transacción
  try{
    //3. Deserialización - PRIMER VALOR DEL ARREGLO
    const [productos] = await db.query(sql)
    //4. Envíamos los resultados
    res.status(200).json(productos)
  }catch(e){
    console.error(e)
    res.status(500).json({mensaje: 'Error interno del servidor'})
  }
}

//Buscar por ID
exports.obtenerProductoPorId = async (req, res) => {
  //1. Obteniendo el ID desde la URL
  //.params => http://miweb.com/api/modulo/7
  const { id } = req.params

  //2. Preparar consulta
  const sql = "SELECT id, descripcion, garantia, precio FROM productos WHERE id = ?"

  //3. Transacción
  try{
    //4. Deserialización - PRIMER VALOR DEL ARREGLO
    const [productos] = await db.query(sql, [id])

    //5. Validación
    //No encontramos el producto con el ID enviado
    if (productos.length == 0){
      //Cuando se ejecuta "return" se FINALIZA el método
      return res.status(404).json({mensaje: 'No encontramos el producto'})
    }

    //6. Envíamos los resultados
    res.status(200).json(productos[0])
  }catch(e){
    console.error(e)
    res.status(500).json({mensaje: 'Error interno del servidor'})
  }
}

//Actualizar
exports.actualizarProducto = async (req, res) => {
  //Necesitamos parámetro
  const { id } = req.params

  //Leer un JSON body
  const { descripcion, garantia, precio } = req.body

  //Validación => ES OBLIGATORIO QUE AL MENOS UNO TENGA DATOS
  if (!descripcion && garantia == undefined && !precio){
    return res.status(400).json({mensaje: 'Falta completar los campos'})
  }

  //Algoritmo eficiente de actualización
  //NO SE HARÁ => UPDATE productos SET descripcion = ?, garantia = ?, precio = ? WHERE id = ?
  //SE DESARROLLARÁ => UPDATE productos SET precio = ? WHERE id = ?
  let sqlParts = []   //campos que sufrirán actualización
  let values = []     //valores para los campos

  if (descripcion){
    sqlParts.push('descripcion = ?')
    values.push(descripcion)
  }

  if (garantia != undefined){
    sqlParts.push('garantia = ?')
    values.push(garantia)
  }

  if (precio){
    sqlParts.push('precio = ?')
    values.push(precio)
  }

  if (sqlParts.length == 0){
    return res.status(400).json({mensaje: 'No hay datos por actualizar'})
  }

  //Construir de manera dinámica la consulta
  values.push(id)
  const sql = `UPDATE productos SET ${sqlParts.join(', ')} WHERE id = ?`

  try{
    const [result] = await db.query(sql, values)

    if (result.affectedRows === 0){
      return res.status(404).json({mensaje: 'No encontramos el producto con el ID'})
    }

    res.status(200).json({mensaje: 'Actualizado correctamente'})
  }
  catch(e){
    console.error(e)
    res.status(500).json({mensaje: 'Error interno en el servidor'})
  }
}

//Eliminar
exports.eliminarProducto = async (req, res) => {
  const { id } = req.params
  const sql = "DELETE FROM productos WHERE id = ?" //¡CUIDADO! DELETE ES IRRESVERSIBLE

  try{
    const [result] = await db.query(sql, [id])

    if (result.affectedRows === 0){
      return res.status(404).json({mensaje: 'Producto no encontrado para eliminar'})
    }

    res.status(200).json({mensaje: 'Eliminado correctamente'})
  }catch(e){
    console.error(e)
    res.status(500).json({mensaje: 'Error interno del servidor'})
  }
}