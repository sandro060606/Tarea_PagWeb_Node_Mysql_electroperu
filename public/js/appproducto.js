const API_URL = 'http://localhost:3000/api/productos'

const formulario = document.getElementById('form-producto')
const tabla = document.querySelector('#tabla-productos tbody')

const idproducto = document.getElementById('idproducto') //caja oculta, contener el ID (PK)
const descripcion = document.getElementById('descripcion') //elemento de formulario
const garantia = document.getElementById('garantia')
const precio = document.getElementById('precio')

const btnGuardar = document.getElementById('btnGuardar')
const btnCancelar = document.getElementById('btnCancelar')

//Retorna el botón guardar a su estado original
btnCancelar.addEventListener('click', () => {
  btnGuardar.innerText = 'Guardar'
})

//Obtener los datos (backend) > renderizar en la tabla
async function obtenerProductos(){
  const response = await fetch(API_URL, { method: 'get' })
  const productos = await response.json()
  //console.log(productos)

  //Reiniciamos el contenido de la tabla
  tabla.innerHTML = '';
  
  productos.forEach(producto => {
    //Crear una nueva fila y celdas con los datos contenidos en JSON
    const row = tabla.insertRow() //<tr></tr>

    row.insertCell().textContent = producto.id //<td></td>
    row.insertCell().textContent = producto.descripcion //<td></td>
    row.insertCell().textContent = producto.garantia //<td></td>
    row.insertCell().textContent = producto.precio //<td></td>
    
    //La última celda contendrá 2 botones (funcionalidad)
    const actionCell = row.insertCell()

    //Botón 1: Editar
    const editButton = document.createElement('button')
    editButton.textContent = 'Editar'
    editButton.classList.add('btn')
    editButton.classList.add('btn-info')
    editButton.classList.add('btn-sm')
    editButton.onclick = () => cargarParaEdicion(producto)

    //Botón 2: Eliminar
    const deleteButton = document.createElement('button')
    deleteButton.textContent = 'Eliminar'
    deleteButton.classList.add('btn')
    deleteButton.classList.add('btn-danger')
    deleteButton.classList.add('btn-sm')
    deleteButton.onclick = () => eliminarProducto(producto.id, producto.descripcion)

    //Agregando ambos botones a la última celda
    actionCell.appendChild(editButton)
    actionCell.appendChild(deleteButton)
  });
}

async function eliminarProducto(id, descripcion){
  //console.log(id, descripcion)
  if (confirm(`¿Está seguro de eliminar el producto: ${descripcion}?`)){ 
    try{
      const response = await fetch(API_URL + `/${id}` , { method: 'delete' })
      
      if (!response.ok){
        throw new Error(`Error al eliminar: ${descripcion}`)
      }

      //Eliminado correctamente...
      const result = await response.json()
      console.log(result)
      obtenerProductos()

    }catch(e){
      console.error(e)
    }
  }
}

async function cargarParaEdicion(producto){
  idproducto.value = producto.id
  descripcion.value = producto.descripcion
  garantia.value = producto.garantia
  precio.value = producto.precio

  btnGuardar.innerText = 'Actualizar'
}

//Al pulsar el botón Guardar (submit) - DEBEMOS VERIFICAR SI: registrar | actualizar
formulario.addEventListener("submit", async (event) => {
  event.preventDefault() //Anulado el evento submit

  //Para guardar, necesitamos almacenar los datos en formato JSON
  //preparamos un objeto JS con la misma estructura
  const data = {
    descripcion: descripcion.value,
    garantia: parseInt(garantia.value),
    precio: parseFloat(precio.value)
  }

  //Enviar los datos (1. URL, 2. Verbo, 3. Tipo dato, 4. JSON)
  try{
    //¿Actualizamos o registramos?
    let response = null

    if (idproducto.value == ''){
      response = await fetch(API_URL, { 
        method: 'post',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
    }else{
      //Actualizar...
      response = await fetch(API_URL + `/${idproducto.value}`, { 
        method: 'put',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
    }
    
    const result = await response.json()
    console.log(result)
    btnGuardar.innerText = 'Guardar'
    formulario.reset()
    obtenerProductos()
  }catch(e){
    console.error(e)
  }
})

//Cuando la página esté lista, se ejecutará obtenerProductos
document.addEventListener('DOMContentLoaded', obtenerProductos)