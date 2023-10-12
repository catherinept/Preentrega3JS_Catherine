document.addEventListener('DOMContentLoaded', () => {
    const listaProductos = document.querySelector('.container-items');

    let productos = JSON.parse(localStorage.getItem('productos')) || [
        {
            "title": "Bota Industrial",
            "price": 80000,
            "stock": 15,
            "image": "./images/botas.jpeg"
        },
        {
            "title": "Arnes",
            "price": 234000,
            "stock": 45,
            "image": "./images/arnes.jpeg"
        },
        {
            "title": "Casco",
            "price": 155000,
            "stock": 55,
            "image": "./images/casco.jpeg"
        },
        {
            "title": "Gafas",
            "price": 30000,
            "stock": 5,
            "image": "./images/gafas.jpeg"
        },
        {
            "title": "Guantes",
            "price": 14000,
            "stock": 115,
            "image": "./images/guantes.jpeg"
        },
        {
            "title": "Tapa Oído",
            "price": 58000,
            "stock": 67,
            "image": "./images/tapaoido.jpeg"
        }
    ];

    function guardarProductosEnLocalStorage() {
        localStorage.setItem('productos', JSON.stringify(productos));
    }

    function mostrarProductos() {
        listaProductos.innerHTML = '';
        productos.forEach(producto => {
            const item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML = `
                <figure>
                    <img src="${producto.image}" alt="${producto.title}">
                </figure>
                <div class="info-producto">
                    <h2>${producto.title}</h2>
                    <p class="price">$${producto.price}</p>
                    <p class="stock">Stock: ${producto.stock}</p>
                    <button class="btn-add-cart" data-id="${producto.title}">Agregar al Carrito</button>
                </div>
            `;
            listaProductos.appendChild(item);
        });
    }

    mostrarProductos();

    listaProductos.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-add-cart')) {
            const productId = e.target.getAttribute('data-id');
            const producto = productos.find((item) => item.title === productId);
            if (producto && producto.stock > 0) {
                Swal.fire({
                    title: '¿Cuántos productos deseas añadir (ver bien stock disponible)?',
                    input: 'number',
                    inputAttributes: {
                        min: 1,
                        max: producto.stock,
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Añadir',
                    showLoaderOnConfirm: true,
                    preConfirm: (cantidad) => {
                        if (cantidad <= producto.stock) {
                            producto.stock -= cantidad;
                            guardarProductosEnLocalStorage();
                            return cantidad;
                        }
                    },
                }).then((result) => {
                    if (result.value) {
                        const cantidadComprada = result.value;
                        const totalPagar = cantidadComprada * producto.price;
                        Swal.fire({
                            title: 'Compra exitosa',
                            html: `Ha añadido ${cantidadComprada} ${producto.title}(s) al carrito.<br>Total a pagar: $${totalPagar}`,
                            icon: 'success'
                        });
                    }
                    mostrarProductos();
                });
            }
        }
    });

    document.getElementById('agregarProducto').addEventListener('click', () => {
        Swal.mixin({
            input: 'text',
            confirmButtonText: 'Siguiente',
            showCancelButton: true,
            progressSteps: ['1', '2', '3']
        }).queue([
            {
                title: 'Nombre del Producto',
                text: 'Ingrese el nombre del nuevo producto:'
            },
            {
                title: 'Cantidad en Stock',
                text: 'Ingrese la cantidad en stock:',
                input: 'number'
            },
            {
                title: 'Precio del Producto',
                text: 'Ingrese el precio del producto:',
                input: 'text'
            }
        ]).then((result) => {
            if (result.value) {
                const nombre = result.value[0];
                const cantidadStock = parseInt(result.value[1]);
                const precio = result.value[2];
                const newProduct = {
                    title: nombre,
                    stock: cantidadStock,
                    price: precio
                };
                productos.push(newProduct);
                mostrarProductos();
            }
        });
    });
});