let productos = [];


fetch("./js/gamer.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    })

const contenedorGamer = document.querySelector("#productos2");
const botones = document.querySelectorAll(".boton-categoria2");
let clickProductos = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#indicador");
let productosEnCarrito;

const productosEnCarritoLS = JSON.parse(localStorage.getItem("productos-en-carrito"));
if(productosEnCarritoLS){
    productosEnCarrito = productosEnCarritoLS;
    newNumerito();
} else {
    productosEnCarrito =[];
}


function agregarAlCarrito(e) {

    Toastify({
        text: "AGREGADO AL CARRITO",
        duration: 2000,
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
            x: '37rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '3rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
        },
        onClick: function () { } // Callback after click
    }).showToast();

    const id = e.target.id;
    const productoAgregado = productos.find(producto => producto.id === id);

    if (productosEnCarrito.some(producto => producto.id === id)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === id);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    newNumerito();
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function newNumerito() {
    let indicador = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = indicador;
}

function cargarProductos(productosElegidos, categoriaInicial = "monitores") {
    contenedorGamer.innerHTML = "";

    const productosFiltrados = productosElegidos.filter(producto => producto.categoria.id === categoriaInicial);

    productosFiltrados.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
        <img class="producto-img" src="${producto.imagen}" alt="">
        <div class="producto-detalles">
            <h3 class="producto-titulo">${producto.titulo}</h3>
            <p class="producto-precio">$${producto.precio}</p>
            <button class="producto-agregar" id="${producto.id}">Agregar</button>
        </div>`;
        contenedorGamer.append(div);
    });

    updateClicks();

   
}

function updateClicks() {
    clickProductos = document.querySelectorAll(".producto-agregar");
    clickProductos.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

cargarProductos(productos); // Llamada inicial para mostrar solo los productos de la categoría "MONITORES"

botones.forEach(boton => {
    boton.addEventListener("click", (e) => {
        botones.forEach(boton => boton.classList.remove("active"));
        e.target.classList.add("active");

        const categoriaSeleccionada = e.target.id;
        cargarProductos(productos, categoriaSeleccionada);
    });
});
