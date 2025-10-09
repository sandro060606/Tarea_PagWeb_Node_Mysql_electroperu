const API_URL = 'http://localhost:3000/api/tiendas'

const formulario = document.getElementById('form-tienda')
const tabla = document.querySelector('#tabla-tiendas tbody')

const idtienda = document.getElementById('idtienda') //caja oculta, contener el ID (PK)
const tienda = document.getElementById('tienda')

const btnGuardar = document.getElementById('btnGuardar')
const btnCancelar = document.getElementById('btnCancelar')

//Retorna el botón guardar a su estado original
btnCancelar.addEventListener('click', () => {
  btnGuardar.innerText = 'Guardar'
})

//Obtener los datos (backend) > renderizar en la tabla
async function obtenerTiendas(){
  const response = await fetch(API_URL, { method: 'get' })
  const tiendas = await response.json()
  //console.log(productos)

  //Reiniciamos el contenido de la tabla
  tabla.innerHTML = '';
  
  tiendas.forEach(tienda => {
    //Crear una nueva fila y celdas con los datos contenidos en JSON
    const row = tabla.insertRow() //<tr></tr>

    row.insertCell().textContent = tienda.id //<td></td>
    row.insertCell().textContent = tienda.tienda //<td></td>
    
    //La última celda contendrá 2 botones (funcionalidad)
    const actionCell = row.insertCell()

    //Botón 1: Editar
    const editButton = document.createElement('button')
    editButton.textContent = 'Editar'
    editButton.classList.add('btn')
    editButton.classList.add('btn-info')
    editButton.classList.add('btn-sm')
    editButton.onclick = () => cargarParaEdicion(tienda)

    //Botón 2: Eliminar
    const deleteButton = document.createElement('button')
    deleteButton.textContent = 'Eliminar'
    deleteButton.classList.add('btn')
    deleteButton.classList.add('btn-danger')
    deleteButton.classList.add('btn-sm')
    deleteButton.onclick = () => eliminarTiendas(tienda.id, tienda.tienda)

    //Agregando ambos botones a la última celda
    actionCell.appendChild(editButton)
    actionCell.appendChild(deleteButton)
  });
}

async function eliminarTiendas(id, tienda){
  //console.log(id, descripcion)
  if (confirm(`¿Está seguro de eliminar la Tienda: ${tienda}?`)){ 
    try{
      const response = await fetch(API_URL + `/${id}` , { method: 'delete' })
      
      if (!response.ok){
        throw new Error(`Error al eliminar: ${tienda}`)
      }

      //Eliminado correctamente...
      const result = await response.json()
      console.log(result)
      obtenerTiendas()

    }catch(e){
      console.error(e)
    }
  }
}

async function cargarParaEdicion(tiendadata){
  idtienda.value = tiendadata.id
  tienda.value = tiendadata.tienda

  btnGuardar.innerText = 'Actualizar'
}

//Al pulsar el botón Guardar (submit) - DEBEMOS VERIFICAR SI: registrar | actualizar
formulario.addEventListener("submit", async (event) => {
  event.preventDefault() //Anulado el evento submit

  //Para guardar, necesitamos almacenar los datos en formato JSON
  //preparamos un objeto JS con la misma estructura
  const data = {
    tienda: tienda.value,
  }

  //Enviar los datos (1. URL, 2. Verbo, 3. Tipo dato, 4. JSON)
  try{
    //¿Actualizamos o registramos?
    let response = null

    if (idtienda.value == ''){
      response = await fetch(API_URL, { 
        method: 'post',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
    }else{
      //Actualizar...
      response = await fetch(API_URL + `/${idtienda.value}`, { 
        method: 'put',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
    }
    
    const result = await response.json()
    console.log(result)
    btnGuardar.innerText = 'Guardar'
    formulario.reset()
    obtenerTiendas()
  }catch(e){
    console.error(e)
  }
})

//Cuando la página esté lista
document.addEventListener('DOMContentLoaded', obtenerTiendas)