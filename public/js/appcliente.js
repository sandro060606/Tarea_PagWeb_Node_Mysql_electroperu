const API_URL = 'http://localhost:3000/api/clientes'

const formulario = document.getElementById('form-cliente')
const tabla = document.querySelector('#tabla-clientes tbody')

const idcliente = document.getElementById('idcliente') //caja oculta, contener el ID (PK)
const descripcion = document.getElementById('descripcion') //elemento de formulario
const garantia = document.getElementById('garantia')
const precio = document.getElementById('precio')

const btnGuardar = document.getElementById('btnGuardar')
const btnCancelar = document.getElementById('btnCancelar')
