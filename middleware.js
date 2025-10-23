//Gestionar los archivos binarios => jpg, png, pdf, mp3
//Node > "multer"
const multer = require("multer")
const path = require("path")

const uploadDir = "./public/uploads"

//Gestion de Escritura
const storage = multer.diskStorage({
  destination: (req, file, cb) => { 
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    //NOTA: No podemos guardar el archivo con el nombre original
    //Sufijo Unico
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) //Sufijo Aleatorio
    cb(null, 'foto-' + uniqueSuffix + path.extname(file.originalname ))
  }
})
//Filtro (¿Que tipo de archivos se esta permitido?)
const fileFilter = (req, file, cb) => {
  //Expresion Regular
  const allowedTypes = /jpeg|jpg|png|gif|webp/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimeType = allowedTypes.test(file.mimetype)

  //Si la extension es correcta, podemos GRABAR el archivo
  if (mimeType && extname){
    return cb(null, true)
  }else{
    cb(new Error('Solo se permiten imagenes (jpeg, jpg, png, gif, webp)'))
  }
}
//Configuracion "multer"
// * 1024 (KB) * 1024 (Mb)
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
})

//Exportar
module.exports = { upload }