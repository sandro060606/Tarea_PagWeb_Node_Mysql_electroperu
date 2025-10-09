function validarAlgo(num){
  console.log("Entrada función")

  if (num > 10){
    console.log("Entramos a la condición")
  }

  if (num % 2 == 0){
    console.log("Entramos segunda condición")
    return
  }

  console.log("Fin función")
}

validarAlgo(70)