const db = require('../config/db')

//Crear
exports.crearTienda = async (req, res) => {
  //1. Recepcionar los datos
  const {tienda} = req.body

  //2. Validación backend
  if (!tienda){
    return res.status(400).json({mensaje: 'Falta completar los campos'})
  }

  //3. Estructurar la consulta ... ? = comodin (tiene un índice, similar a un array)
  const sql = "INSERT INTO tiendas (tienda) VALUES (?)"

  //4. Transacción
  try{
    //5. Ejecutamos la consulta
    const [result] = await db.query(sql, [tienda])

    //6. Entregar un resultado (PK)
    res.status(201).json({
      id: result.insertId,
      mensaje: 'Tienda Registrada correctamente'
    })

  }catch(e){
    console.error(e)
    res.status(500).json({mensaje: 'Error interno del servidor'})
  }
}

//Listar
exports.obtenerTiendas = async (req, res) => {
  //1. Preparar consulta
  const sql = "SELECT * FROM tiendas ORDER BY id DESC"

  //2. Transacción
  try{
    //3. Deserialización - PRIMER VALOR DEL ARREGLO
    const [tiendas] = await db.query(sql)
    //4. Envíamos los resultados
    res.status(200).json(tiendas)
  }catch(e){
    console.error(e)
    res.status(500).json({mensaje: 'Error interno del servidor'})
  }
}

//Buscar por ID
exports.obtenerTiendaPorId = async (req, res) => {
  //1. Obteniendo el ID desde la URL
  //.params => http://miweb.com/api/modulo/7
  const { id } = req.params

  //2. Preparar consulta
  const sql = "SELECT id, tienda FROM tiendas WHERE id = ?"

  //3. Transacción
  try{
    //4. Deserialización - PRIMER VALOR DEL ARREGLO
    const [tiendas] = await db.query(sql, [id])

    //5. Validación
    //No encontramos el producto con el ID enviado
    if (tiendas.length == 0){
      //Cuando se ejecuta "return" se FINALIZA el método
      return res.status(404).json({mensaje: 'No encontramos la tienda'})
    }

    //6. Envíamos los resultados
    res.status(200).json(tiendas[0])
  }catch(e){
    console.error(e)
    res.status(500).json({mensaje: 'Error interno del servidor'})
  }
}

//Actualizar
exports.actualizarTienda = async (req, res) => {
  //Necesitamos parámetro
  const { id } = req.params

  //Leer un JSON body
  const { tienda } = req.body

  //Validación => ES OBLIGATORIO QUE AL MENOS UNO TENGA DATOS
  if (!tienda){
    return res.status(400).json({mensaje: 'Falta completar los campos'})
  }

  let sqlParts = []   //campos que sufrirán actualización
  let values = []     //valores para los campos

  if (tienda){
    sqlParts.push('tienda = ?')
    values.push(tienda)
  }

  if (sqlParts.length == 0){
    return res.status(400).json({mensaje: 'No hay datos por actualizar'})
  }

  //Construir de manera dinámica la consulta
  values.push(id)
  const sql = `UPDATE tiendas SET ${sqlParts.join(', ')} WHERE id = ?`

  try{
    const [result] = await db.query(sql, values)

    if (result.affectedRows === 0){
      return res.status(404).json({mensaje: 'No encontramos la Tienda con el ID'})
    }

    res.status(200).json({mensaje: 'Tienda Actualizada correctamente'})
  }
  catch(e){
    console.error(e)
    res.status(500).json({mensaje: 'Error interno en el servidor'})
  }
}

//Eliminar
exports.eliminarTienda = async (req, res) => {
  const { id } = req.params
  const sql = "DELETE FROM tiendas WHERE id = ?"

  try{
    const [result] = await db.query(sql, [id])

    if (result.affectedRows === 0){
      return res.status(404).json({mensaje: 'La Tiena no fue encontrada'})
    }

    res.status(200).json({mensaje: 'Tienda Eliminada correctamente'})
  }catch(e){
    console.error(e)
    res.status(500).json({mensaje: 'Error interno del servidor'})
  }
}

