let productos = [];
let carrito = [];

document.addEventListener("DOMContentLoaded", () => {
  const selectProducto = document.getElementById("producto");
  const form = document.getElementById("formCompra");
  const resultado = document.getElementById("resultado");

  fetch("data/productos.json")
    .then(res => res.json())
    .then(data => {
      productos = data;
      cargarOpciones(productos);
    });

  function cargarOpciones(productos) {
    productos.forEach(prod => {
      const option = document.createElement("option");
      option.value = prod.id;
      option.textContent = `${prod.nombre} - $${prod.precio}`;
      selectProducto.appendChild(option);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const productoID = parseInt(selectProducto.value);
    const cantidad = parseInt(document.getElementById("cantidad").value);

    const productoSeleccionado = productos.find(p => p.id === productoID);

    if (!productoSeleccionado || isNaN(cantidad) || cantidad <= 0) {
      Toastify({
                text: "❌ Error: Ingresá un producto y cantidad válida",
                duration: 3000,
                gravity: "top",
                position: "center",
               backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
             }).showToast();
      return;
    }

    const total = cantidad * productoSeleccionado.precio;

    const compra = {
      cliente: nombre,
      producto: productoSeleccionado.nombre,
      cantidad,
      total
    };

    carrito.push(compra);
    localStorage.setItem("carrito", JSON.stringify(carrito));

    mostrarCompra(compra);
  });

  function mostrarCompra(compra) {
  resultado.innerHTML = `
    <h3 class="mt-4">Resumen de la Compra</h3>
    <p><strong>Cliente:</strong> ${compra.cliente}</p>
    <p><strong>Producto:</strong> ${compra.producto}</p>
    <p><strong>Cantidad:</strong> ${compra.cantidad}</p>
    <p><strong>Total:</strong> $${compra.total}</p>
  `;

  Toastify({
    text: `✅ ¡Compra agregada! Total: $${compra.total}`,
    duration: 3000,
    gravity: "top", 
    position: "center", 
    backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
    stopOnFocus: true
  }).showToast();
}

  if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
    mostrarCompra(carrito[carrito.length - 1]);
  }
});

//Esta es toda la base JS del simulador y que se conecta con el JSON// 