// script.js - App de inventario de supermercado

// Array para almacenar los productos en memoria
let productos = [];

// Elementos del DOM
const form = document.getElementById('product-form');
const inputNombre = document.getElementById('product-name');
const inputCantidad = document.getElementById('product-quantity');
const inputCategoria = document.getElementById('product-category');
const listaProductos = document.getElementById('product-list');

// Verificar que los elementos del DOM existan para evitar errores
function elementosDisponibles() {
  return (
    form &&
    inputNombre &&
    inputCantidad &&
    inputCategoria &&
    listaProductos
  );
}

// Clave de LocalStorage
const STORAGE_KEY = 'inventario-productos';

// Función para guardar el array de productos en localStorage
function guardarProductos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
  } catch (e) {
    console.error('Error al guardar en localStorage', e);
  }
}

// Función para cargar los productos de localStorage
function cargarProductos() {
  try {
    const datos = localStorage.getItem(STORAGE_KEY);
    productos = datos ? JSON.parse(datos) : [];
  } catch (e) {
    console.error('Error al leer de localStorage', e);
    productos = [];
  }
}

// Función para crear un elemento li para un producto
function crearElementoProducto({ id, nombre, cantidad, categoria }) {
  const li = document.createElement('li');
  li.dataset.id = id;
  li.textContent = `${nombre} - ${cantidad} (${categoria})`;

  const btnEliminar = document.createElement('button');
  btnEliminar.textContent = 'Eliminar';
  btnEliminar.addEventListener('click', () => eliminarProducto(id));

  li.appendChild(btnEliminar);
  return li;
}

// Función para renderizar la lista completa de productos
function mostrarProductos() {
  // Limpiar lista actual
  listaProductos.innerHTML = '';
  productos.forEach((producto) => {
    const li = crearElementoProducto(producto);
    listaProductos.appendChild(li);
  });
}

// Función para agregar un nuevo producto al array y a la lista
function agregarProducto(nombre, cantidad, categoria) {
  const nuevoProducto = {
    id: Date.now(),
    nombre,
    cantidad,
    categoria
  };

  productos.push(nuevoProducto);
  guardarProductos();
  const li = crearElementoProducto(nuevoProducto);
  listaProductos.appendChild(li);
}

// Función para eliminar un producto por id
function eliminarProducto(id) {
  productos = productos.filter((producto) => producto.id !== id);
  guardarProductos();
  mostrarProductos();
}

// Manejador del evento submit del formulario
function manejarEnvio(event) {
  event.preventDefault();

  const nombre = inputNombre.value.trim();
  const cantidad = inputCantidad.value.trim();
  const categoria = inputCategoria.value.trim();

  if (!nombre || !cantidad || !categoria) {
    alert('Por favor complete todos los campos');
    return;
  }

  agregarProducto(nombre, cantidad, categoria);

  // Limpiar formulario
  form.reset();
  inputNombre.focus();
}

// Inicializar app al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  if (!elementosDisponibles()) {
    console.error('Error: elementos del DOM no encontrados');
    return;
  }

  cargarProductos();
  mostrarProductos();
  form.addEventListener('submit', manejarEnvio);
});

