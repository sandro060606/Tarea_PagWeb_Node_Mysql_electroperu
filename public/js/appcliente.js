const API_URL = 'http://localhost:3000/api/clientes'

const formulario = document.getElementById('form-cliente')
const tabla = document.querySelector('#tabla-clientes tbody')

const idcliente = document.getElementById('idcliente') //caja oculta, contener el ID (PK)
const apellidos = document.getElementById('apellidos')
const nombres = document.getElementById('nombres')
const dni = document.getElementById('dni')
const telefono = document.getElementById('telefono')
const direccion = document.getElementById('direccion')
const listaTiendas = document.getElementById('lista-tiendas')

const btnGuardar = document.getElementById('btnGuardar')
const btnCancelar = document.getElementById('btnCancelar')

btnCancelar.addEventListener('click', () => { btnGuardar.innerText = 'Guardar'})

const API_URL_TIENDAS = 'http://localhost:3000/api/tiendas'

async function obtenerTiendas() {
  const response = await fetch(API_URL_TIENDAS, { method: 'get' })
  const tiendas = await response.json()

  tiendas.forEach(item => {
    const tagOption = document.createElement("option")
    tagOption.innerHTML = item.tienda
    tagOption.value = item.id
    listaTiendas.appendChild(tagOption)
  });
}

async function obtenerClientes() {
  const response = await fetch(API_URL, { method: 'get' })
  const clientes = await response.json()

  tabla.innerHTML = '';

  clientes.forEach(cliente => {
    //Crear una nueva fila y celdas con los datos contenidos en JSON
    const row = tabla.insertRow() //<tr></tr>

    row.insertCell().textContent = cliente.id //<td></td>
    row.insertCell().textContent = cliente.apellidos //<td></td>
    row.insertCell().textContent = cliente.nombres //<td></td>
    row.insertCell().textContent = cliente.dni //<td></td>
    row.insertCell().textContent = cliente.telefono //<td></td>
    row.insertCell().textContent = cliente.tienda //<td></td>
    
    //La última celda contendrá 2 botones (funcionalidad)
    const actionCell = row.insertCell()

    //Botón 1: Editar
    const editButton = document.createElement('button')
    editButton.textContent = 'Editar'
    editButton.classList.add('btn')
    editButton.classList.add('btn-info')
    editButton.classList.add('btn-sm')
    editButton.onclick = () => cargarParaEdicion(cliente)

    //Botón 2: Eliminar
    const deleteButton = document.createElement('button')
    deleteButton.textContent = 'Eliminar'
    deleteButton.classList.add('btn')
    deleteButton.classList.add('btn-danger')
    deleteButton.classList.add('btn-sm')
    deleteButton.onclick = () => eliminarCliente(cliente.id, cliente.nombres)

    //Agregando ambos botones a la última celda
    actionCell.appendChild(editButton)
    actionCell.appendChild(deleteButton)
  });
}

async function eliminarCliente(id, nombres){
  //console.log(id, descripcion)
  if (confirm(`¿Está seguro de eliminar el cliente: ${nombres}?`)){ 
    try{
      const response = await fetch(API_URL + `/${id}` , { method: 'delete' })
      
      if (!response.ok){
        throw new Error(`Error al eliminar: ${nombres}`)
      }
      const result = await response.json()
      console.log(result)
      obtenerClientes()
    }catch(e){
      console.error(e)
    }
  }
}

async function cargarParaEdicion(cliente){
  idcliente.value = cliente.id 
  apellidos.value = cliente.apellidos
  nombres.value = cliente.nombres
  dni.value = cliente.dni
  telefono.value = cliente.telefono
  direccion.value = cliente.direccion
  

  btnGuardar.innerText = 'Actualizar'
}

formulario.addEventListener("submit", async (event) => {
  event.preventDefault() //Anulado el evento submit
  const data = {
    apellidos: apellidos.value,
    nombres: nombres.value,
    dni: dni.value, 
    telefono: telefono.value,
    direccion: direccion.value,
    idtienda: parseInt(listaTiendas.value)
  }
  try{
    //¿Actualizamos o registramos?
    let response = null

    if (idcliente.value == ''){
      response = await fetch(API_URL, { 
        method: 'post',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
    }else{
      //Actualizar...
      response = await fetch(API_URL + `/${idcliente.value}`, { 
        method: 'put',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
    }
    const result = await response.json()
    console.log(result)
    btnGuardar.innerText = 'Guardar'
    formulario.reset()
    obtenerClientes()
  }catch(e){
    console.error(e)
  }
})

document.addEventListener("DOMContentLoaded", () => {
  obtenerTiendas()
  obtenerClientes()
})
