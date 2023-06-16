const productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito"));
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#contenedor-carrito");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#vaciar-carrito");
const contenedorTotal = document.querySelector("#totalCarrito");
const botonComprar = document.querySelector("#comprar");

cargarProductosCarrito();

function cargarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        contenedorCarritoProductos.innerHTML = "";

        productosEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
        <img class="carrito-producto-img" src="${producto.imagen}" alt="">
        <div class="carrito-producto-titulo">
          <small>Producto</small>
          <h5>${producto.titulo}</h5>
        </div>
        <div class="carrito-producto-cantidad">
          <small>Cantidad</small>
          <p>${producto.cantidad}</p>
        </div>
        <div class="carrito-producto-precio">
          <small>Precio</small>
          <p>$ ${producto.precio}</p>
        </div>
        <div class="carrito-producto-subtotal">
          <small>Subtotal</small>
          <p>$ ${producto.precio * producto.cantidad}</p>
        </div>
        <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash3-fill"></i></button>
      `;
            contenedorCarritoProductos.append(div);
        });
    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }

    actualizarBotonesEliminar();
    actualizarTotal();
}

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    Toastify({
        text: "ELIMINADO DEL CARRITO",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right, #104241, #8BBEB7 )",
            borderRadius: "2rem",
            fontSize: ".78rem"
        },
        offset: {
            x: '70rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '3rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
        },
        onClick: function () { } // Callback after click
    }).showToast();

    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    productosEnCarrito.splice(index, 1);
    cargarProductosCarrito();
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function vaciarCarrito() {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
        title: '¿Estás seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, borrarlo',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
            Swal.fire(
                '¡Vacío!',
                'Tu carrito ha sido vaciado.',
                'success'
            )
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
                'Cancelado',
                'Tu carrito está seguro :)',
                'error'
            )
        }
    });
}

function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    contenedorTotal.innerText = `$${totalCalculado}`;
}

botonVaciar.addEventListener("click", vaciarCarrito);

botonComprar.addEventListener("click", comprarCarrito);

function comprarCarrito() {
    Swal.fire({
        title: '¡Gracias por tu compra!',
        text: 'Tu pedido ha sido realizado exitosamente.',
        width: 600,
        padding: '3em',
        color: '#716add',
        background: '#fff url(./img/efecto.gif)',
        backdrop: `
        rgba(0,0,123,0.4)
        url("./img/abrazo-gato.gif")
        left top
        no-repeat
    `,
        confirmButtonText: 'Aceptar'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            window.location.href = 'productos.html';
        }
    });
}

