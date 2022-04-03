document.addEventListener('DOMContentLoaded', () => {

    // Variables
    const baseDeDatos = [
        {
            id: 1,
            nombre: 'Hombre con habano',
            precio: 1000,
            imagen: '../Images/carrito/6.jpg'
        },
        {
            id: 2,
            nombre: 'Hombre con gafas negras',
            precio: 2000,
            imagen: '../Images/carrito/2.jpg'
        },
        {
            id: 3,
            nombre: 'Hombre con gafas amarillas',
            precio: 2100,
            imagen: '../Images/carrito/3.jpg'
        },
        {
            id: 4,
            nombre: 'Mujer con tatuaje',
            precio: 1500,
            imagen: '../Images/carrito/4.jpg'
        },
        {
            id: 5,
            nombre: 'Hombre con cigarro',
            precio: 2200,
            imagen: '../Images/carrito/5.jpg'
        },
        {
            id: 6,
            nombre: 'Hombre con habano',
            precio: 1700,
            imagen: '../Images/carrito/1.jpg'
        }

    ];

    let carrito = [];
    const divisa = '$';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const miLocalStorage = window.localStorage;

    // Funciones

    function renderizarProductos() {
        baseDeDatos.forEach((info) => {
            const miNodo = document.createElement('div');
            miNodo.classList.add('card', 'col-sm-4');
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');
            const miNodoTitle = document.createElement('h5');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = info.nombre;
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid');
            miNodoImagen.setAttribute('src', info.imagen);
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.textContent = `${divisa}${info.precio}`;
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-primary');
            miNodoBoton.textContent = 'Agregar';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', agregarProductoAlCarrito);
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    }

    /* añadir un producto al carrito de la compra*/

    function agregarProductoAlCarrito(evento) {
        carrito.push(evento.target.getAttribute('marcador'));
        Toastify({
            text: "Producto agregado al carrito",
            duration: 3000,
            style: {
                background: "linear-gradient(to bottom, rgb(117, 227, 231), black)",
            },
            position: 'right',
            gravity: 'bottom'
        }).showToast();
        renderizarCarrito();
        guardarCarritoEnLocalStorage();
    }

    /* mostrar los productos guardados en el carrito */

    function renderizarCarrito() {
        DOMcarrito.textContent = '';
        const carritoSinDuplicados = [...new Set(carrito)];
        carritoSinDuplicados.forEach((item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                return itemId === item ? total += 1 : total;
            }, 0);
            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa}`;
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5');
            miBoton.textContent = 'X';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });
        DOMtotal.textContent = calcularTotal();
    }

    /* borrar un elemento del carrito */

    function borrarItemCarrito(evento) {
        const id = evento.target.dataset.item;
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        Toastify({
            text: "Producto eliminado del carrito",
            duration: 3000,
            style: {
                background: "linear-gradient(to bottom, rgb(117, 227, 231), red)",
            },
            position: 'right',
            gravity: 'bottom'
        }).showToast();
        renderizarCarrito();
        guardarCarritoEnLocalStorage();
    }

    /* Calcula el precio total teniendo en cuenta los productos repetidos */

    function calcularTotal() {
        return carrito.reduce((total, item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            return total + miItem[0].precio;
        }, 0).toFixed(2);
    }

    /* Vacia el carrito */

    function vaciarCarrito() {
        Toastify({
            text: "Se ha vaciado el carrito",
            duration: 3000,
            style: {
                background: "linear-gradient(to bottom, rgb(117, 227, 231), black)",
            },
            position: 'right',
            gravity: 'bottom'
        }).showToast();
        carrito = [];
        renderizarCarrito();
        localStorage.clear();
    }

    function guardarCarritoEnLocalStorage () {
        miLocalStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function cargarCarritoDeLocalStorage () {
        if (miLocalStorage.getItem('carrito') !== null) {
            carrito = JSON.parse(miLocalStorage.getItem('carrito'));
        }
    }

    // Eventos
    DOMbotonVaciar.addEventListener('click', vaciarCarrito);

    // Inicio
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();
});