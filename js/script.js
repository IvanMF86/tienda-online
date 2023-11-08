document.addEventListener("DOMContentLoaded", function() {
    const botonesAgregarAlCarrito = document.querySelectorAll('.agregar-al-carrito');
    const listaDeCompras = document.querySelector('.lista-de-compras');
    const totalElemento = document.getElementById('total');
    const vaciarCarritoBoton = document.getElementById('vaciar-carrito');
    const comprarBoton = document.getElementById('comprar');
    const formaDePago = document.getElementById("forma-de-pago");
    const camposTarjeta = document.getElementById("campos-tarjeta");

    // Obtener el carrito del localStorage o crear uno vacío si no existe
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    function actualizarCarrito() {
        // Verificar si los elementos existen en el DOM
        if (!listaDeCompras || !totalElemento) {
            console.error("Elementos del carrito no encontrados en el DOM.");
            return; // Salir de la función si los elementos no están presentes
        }

        let total = 0;

        // Limpiar la lista antes de volver a llenarla
        listaDeCompras.innerHTML = '';

        // Objeto para realizar el seguimiento de la cantidad de productos
        let productosContados = {};

        carrito.forEach((producto) => {
            // Contar la cantidad de cada producto en el carrito
            if (productosContados[producto.id]) {
                productosContados[producto.id].cantidad += 1;
            } else {
                productosContados[producto.id] = {
                    producto: producto,
                    cantidad: 1
                };
            }

            total += producto.precio;
        });

        // Mostrar los productos contados en el carrito junto con botones para incrementar y decrementar la cantidad
        Object.values(productosContados).forEach((item) => {
            const nuevoProducto = document.createElement('li');
            nuevoProducto.innerHTML = `
                ${item.producto.nombre} - ${item.producto.precio.toFixed(2)}€ 
                <button class="decrementar-cantidad" data-id="${item.producto.id}">-</button>
                <span>${item.cantidad}</span>
                <button class="incrementar-cantidad" data-id="${item.producto.id}">+</button>
                <button class="eliminar-producto" data-id="${item.producto.id}">Eliminar</button>
            `;
            listaDeCompras.appendChild(nuevoProducto);
        });

        totalElemento.textContent = total.toFixed(2);
    }

    // Actualizar la lista de compras al cargar la página
    actualizarCarrito();

    // Manejar clic en los botones "Agregar al Carrito"
    botonesAgregarAlCarrito.forEach((boton) => {
        boton.addEventListener('click', function() {
            const id = parseInt(boton.getAttribute('data-id'));
            const nombre = boton.getAttribute('data-nombre');
            const precio = parseFloat(boton.getAttribute('data-precio'));

            // Agregar el producto al carrito
            const producto = {
                id: id,
                nombre: nombre,
                precio: precio
            };
            carrito.push(producto);

            // Guardar el carrito en el localStorage
            localStorage.setItem('carrito', JSON.stringify(carrito));
            alert('Producto agregado al carrito.');
            // Actualizar la lista de compras después de agregar un producto
            actualizarCarrito();
        });
    });

    // Manejar clics en el botón "Eliminar"
    listaDeCompras.addEventListener('click', function(event) {
        if (event.target.classList.contains('eliminar-producto')) {
            const id = parseInt(event.target.getAttribute('data-id'));
            // Filtrar el carrito para eliminar el producto con el ID seleccionado
            carrito = carrito.filter((producto) => producto.id !== id);
            // Guardar el carrito actualizado en el localStorage
            localStorage.setItem('carrito', JSON.stringify(carrito));
            // Actualizar la lista de compras después de eliminar un producto
            actualizarCarrito();
        }

        if (event.target.classList.contains('incrementar-cantidad')) {
            const id = parseInt(event.target.getAttribute('data-id'));
            // Incrementar la cantidad del producto con el ID seleccionado
            carrito.push(carrito.find((producto) => producto.id === id));
            // Guardar el carrito actualizado en el localStorage
            localStorage.setItem('carrito', JSON.stringify(carrito));
            // Actualizar la lista de compras después de incrementar la cantidad
            actualizarCarrito();
        }

        if (event.target.classList.contains('decrementar-cantidad')) {
            const id = parseInt(event.target.getAttribute('data-id'));
            // Decrementar la cantidad del producto con el ID seleccionado
            const productoIndex = carrito.findIndex((producto) => producto.id === id);
            if (productoIndex !== -1) {
                carrito.splice(productoIndex, 1);
            }
            // Guardar el carrito actualizado en el localStorage
            localStorage.setItem('carrito', JSON.stringify(carrito));
            // Actualizar la lista de compras después de decrementar la cantidad
            actualizarCarrito();
        }
    });

    // Manejar clic en el botón "Vaciar Carrito"
    vaciarCarritoBoton.addEventListener('click', function() {
        // Vaciar el carrito
        carrito = [];
        // Guardar el carrito vacío en el localStorage
        localStorage.removeItem('carrito');
        // Actualizar la lista de compras después de vaciar el carrito
        actualizarCarrito();
    });

    // Manejar clic en el botón "Comprar"
    comprarBoton.addEventListener('click', function() {
        alert('¡Gracias por tu compra!');
        window.location.href = 'pagar.html';
        // Vaciar el carrito después de la compra
        carrito = [];
        // Guardar el carrito vacío en el localStorage
        localStorage.removeItem('carrito');
        // Actualizar la lista de compras después de vaciar el carrito
        actualizarCarrito();
    });
    // Manejar clic en el botón "Forma de Pago"
    formaDePago.addEventListener("change", function() {
        console.log("Forma de pago seleccionada: " + formaDePago.value);
        if (formaDePago.value === "tarjeta") {
            camposTarjeta.style.display = "block";
        } else {
            camposTarjeta.style.display = "none";
        }
    });
});
