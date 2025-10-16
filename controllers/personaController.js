const { error } = require('console')
const db = require('../config/db') //Acceso a la BD

const path = require('path') //Manejo de rutas


//Definir las acciones (metodos) con la entidad "Persona"
const obtenerTodas = async (req, res) => {
  try{
    const sql = "SELECT * FROM personas"
    const [rows] = await db.query(sql) //Deserializado
    res.json(rows)
  }catch(e){
    console.error(e)
    res.status(500).json({error: 'Error en la Conexion'})
  }
}

//req => requiere (peticion/solicitud)
//req.params    :parametro URL
//req.body      :parametro JSON
//requ.file     :Envia un archivo binario
const crear = async (req, res) => {
  try{
    //1. Recibir los datos del formulario (texto)
    const  {apellidos, nombres, dni, telefono } = req.body
    //2. Recibir la fotografia
    //const fotografia = req.file ? `/uploads/${req.file.filename}` : null;
    const fotografia = 'nuevafoto.'
    //3.

    //4.Guardar un nuevo registro
    const [result] = await db.query("INSERT INTO personas (apellidos, nombres, dni, telefono, fotografia) VALUES (?,?,?,?,?)", 
      [apellidos, nombres, dni, telefono, fotografia])

      res.status(201).json({
        id: result.insertId,
        message: 'Registro Correcto'
      })

  }catch(e){
    //console.error(e)
    if(e.code === "ER_DUP_ENTRY"){
      return res.status(400).json({error: 'DNI esta duplicado'})
    }

    res.status(500).json({error: 'Error en el Proceso de registro'})
  }
}

const crearTest = async(req, res) => {
  res.status(201).json({
    test: "correcto"
  })
}

const actualizar = async(req, res) => {
  //...
}

const eliminar = async (req, res) => {
  //...
}

//Antes de Finalizar el Controlados, exporta los objetods

module.exports = {
  obtenerTodas,
  crear,
  actualizar,
  eliminar
}
  