//DESERIALIZAR ARREGLOS
const amigos = ["Juan", "Carlos", "María"]
const [data1] = amigos
const [,data2] = amigos
const [,,data3] = amigos

const apps = [
  ["VSCode", "Xampp", "AndroidStudio"],
  ["Photoshop", "Illustrator", "Premier"],
  ["Excel", "PowerBI", "SAP"]
]

const [appDev] = apps
const [,appDesign] = apps
const [,,appAdmin] = apps

//console.log(appDev)
//console.log(appDesign)
//console.log(appAdmin)

//DESERIALIZACIÓN DE OBJETOS
const SENATI = {
  zonal: "Ica Ayacucho",
  sede: "UCP Chincha",
  carrera: "Ingeniería de Software IA"
}

const { zonal, sede, carrera } = SENATI

/*
const infoZonal = SENATI.zonal
const infoSede = SENATI.sede
const infoCarrera = SENATI.carrera
*/

console.log(carrera)
