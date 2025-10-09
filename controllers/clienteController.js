const db = require('../config/db')

//Crear
exports.crearCliente = async (req, res) => {
  //1. Recepcionar los datos
  const {apellidos, nombres, dni, telefono, direccion, idtienda} = req.body
  //2. Validación backend
  if (!apellidos|| !nombres || !dni || !telefono || !direccion || !idtienda){
    return res.status(400).json({mensaje: 'Falta completar los campos'})
  }
  //3. Estructurar la consulta ... ? = comodin (tiene un índice, similar a un array)
  const sql = "INSERT INTO clientes (apellidos, nombres, dni, telefono, direccion, idtienda) VALUES (?,?,?,?,?,?)"
  //4. Transacción
  try{
    //5. Ejecutamos la consulta
    const [result] = await db.query(sql, [apellidos, nombres, dni, telefono, direccion, idtienda])
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
exports.obtenerClientes = async (req, res) => {
  //1. Preparar consulta
  const sql = "SELECT c.id, c.apellidos, c.nombres, c.dni, c.telefono, t.tienda FROM clientes AS c INNER JOIN tiendas AS t ON c.idtienda = t.id"
  //2. Transacción
  try{
    //3. Deserialización - PRIMER VALOR DEL ARREGLO
    const [clientes] = await db.query(sql)
    //4. Envíamos los resultados
    res.status(200).json(clientes)
  }catch(e){
    console.error(e)
    res.status(500).json({mensaje: 'Error interno del servidor'})
  }
}

//Buscar por ID
exports.obtenerClientePorId = async (req, res) => {
  //1. Obteniendo el ID desde la URL
  const { id } = req.params
  //2. Preparar consulta
  const sql = "SELECT id, apellidos, nombres, dni, telefono, direccion, idtienda FROM clientes WHERE id = ?"
  //3. Transacción
  try{
    //4. Deserialización - PRIMER VALOR DEL ARREGLO
    const [clientes] = await db.query(sql, [id])
    //5. Validación
    if (clientes.length == 0){
      //Cuando se ejecuta "return" se FINALIZA el método
      return res.status(404).json({mensaje: 'No encontramos el producto'})
    }
    //6. Envíamos los resultados
    res.status(200).json(clientes[0])
  }catch(e){
    console.error(e)
    res.status(500).json({mensaje: 'Error interno del servidor'})
  }
}

//Actualizar
exports.actualizarCliente = async (req, res) => {
  //Necesitamos parámetro
  const { id } = req.params
  //Leer un JSON body
  const { apellidos, nombres, dni, telefono, direccion, idtienda } = req.body
  //Validación => ES OBLIGATORIO QUE AL MENOS UNO TENGA DATOS
  if (!apellidos && !nombres && !dni && !telefono && !direccion && !idtienda){
    return res.status(400).json({mensaje: 'Falta completar los campos'})
  }
  //Algoritmo eficiente de actualización
  let sqlParts = []   //campos que sufrirán actualización
  let values = []     //valores para los campos

  if (apellidos){
    sqlParts.push('apellidos = ?')
    values.push(apellidos)
  }
   if (nombres){
    sqlParts.push('nombres = ?')
    values.push(nombres)
  }
  if (telefono != undefined){
    sqlParts.push('telefono = ?')
    values.push(telefono)
  }
  if (direccion != undefined){
    sqlParts.push('direccion = ?')
    values.push(direccion)
  }
  if (idtienda!= undefined){
    sqlParts.push('idtienda = ?')
    values.push(idtienda)
  }
  if (sqlParts.length == 0){
    return res.status(400).json({mensaje: 'No hay datos por actualizar'})
  }
  //Construir de manera dinámica la consulta
  values.push(id)
  const sql = `UPDATE clientes SET ${sqlParts.join(', ')} WHERE id = ?`
  try{
    const [result] = await db.query(sql, values)

    if (result.affectedRows === 0){
      return res.status(404).json({mensaje: 'No encontramos el Cliente con el ID'})
    }
    res.status(200).json({mensaje: 'Cliente actualizado correctamente'})
  }
  catch(e){
    console.error(e)
    res.status(500).json({mensaje: 'Error interno en el servidor'})
  }
}

//Eliminar
exports.eliminarCliente = async (req, res) => {
  const { id } = req.params
  const sql = "DELETE FROM clientes WHERE id = ?" //¡CUIDADO! DELETE ES IRRESVERSIBLE

  try{
    const [result] = await db.query(sql, [id])

    if (result.affectedRows === 0){
      return res.status(404).json({mensaje: 'Cliente no encontrado para eliminar'})
    }

    res.status(200).json({mensaje: 'Cliente Eliminado correctamente'})
  }catch(e){
    console.error(e)
    res.status(500).json({mensaje: 'Error interno del servidor'})
  }
}