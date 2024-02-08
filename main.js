document.addEventListener('DOMContentLoaded', () => {
    fetch('https://jsonblob.com/api/jsonBlob/1200030886333898752')
        .then(response => response.json())
        .then(productos => {
            const carrito = new Carrito();

            productos.forEach(producto => {
                carrito.añadirProducto(producto.id, producto, 0);
            });

            const contenedorCarrito = document.querySelector('#carrito__productos');
            const contenedorResumen = document.querySelector('#aside__contenido');
            const contenedorTotal = document.querySelector('#total__precio');

            const pintor = new LeonardoDaVinci(contenedorCarrito, contenedorResumen, contenedorTotal);
            pintor.pintame(carrito);
        })
});
