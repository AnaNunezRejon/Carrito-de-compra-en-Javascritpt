
class Carrito {

    #lista = []

    añadirProducto(id, producto, cantidad) {
        this.#lista[id] = {
            producto: producto,
            cantidad: cantidad,
        };
    }

    establecerCantidadProducto(id, cantidad) {
        cantidad = cantidad >= 0 ? cantidad : 0;
        
        if (this.#lista[id]) {
            let item = this.#lista[id];
            item.cantidad = cantidad;
        }
    }

    listarProductos() {
        return this.#lista.map(item => {
            return {
                id: item.producto.id,
                nombre: item.producto.nombre,
                ref: item.producto.ref,
                cantidad: item.cantidad,
                precio: item.producto.precio.toFixed(2),
                total: (item.producto.precio * item.cantidad).toFixed(2),
            }
        })
    }

    obtenerTotal() {
        return this.#lista.reduce((acumulador, item) => {
            return acumulador + item.producto.precio * item.cantidad;
        }, 0).toFixed(2);
    }
}

class LeonardoDaVinci { 

    #contenedorCarrito
    #contenedorResumen
    #contenedorTotal

    constructor(contenedorCarrito, contenedorResumen, contenedorTotal) {
        this.#contenedorCarrito = contenedorCarrito
        this.#contenedorResumen = contenedorResumen
        this.#contenedorTotal = contenedorTotal
    }

    generarLineaCarrito({ id, nombre, cantidad, precio, total, ref }) {
        return `            
        <article id="productos__producto-${id}" class="productos__producto">
            <div class="producto__tituloyreferencia">
                <div class="producto__titulo">
                    <strong>${nombre}</strong>
                </div>
                <div class="producto__referencia">${ref}</div>
            </div>
            <div class="producto__botones">
                <button id="boton__restar-${id}" class="boton__restar" data-id="${id}">-</button>
                    <input type="number" class="cantidad" value="${cantidad}" data-id="${id}" id="cantidad-${id}" />
                <button id="boton__sumar-${id}" class="boton__sumar" data-id="${id}">+</button>
            </div>
            <div class="producto__precio-unidad">${precio}€</div>
            <div class="producto__precio-total" data-id="${id}"><strong>${total}€</strong></div>
        </article>
        `;
    }

    generarLineaResumen({nombre, total, cantidad}) {
        if (cantidad > 0) {
            return `
            <div class="aside__contenido--contenedor">
                <div id="aside__producto" class="aside__producto">${nombre}</div>
                <div id="aside__producto-total" class="aside__producto-total">${total}€</div>
            </div>
            `;
        } else {
            return ''; 
        }
    }

    pintame(carrito) {
        const listado = carrito.listarProductos();

        let contenido = listado.reduce((acc, item) => {
            return acc + this.generarLineaCarrito(item);
        }, '');
        this.#contenedorCarrito.innerHTML = contenido;

        const botonesRestar = this.#contenedorCarrito.querySelectorAll(".boton__restar");
        botonesRestar.forEach(boton => {
            boton.addEventListener('click', event => {
                let id = boton.dataset.id;
                let cantidadInput = this.#contenedorCarrito.querySelector(`#cantidad-${id}`);
                
                if (cantidadInput) {
                    let cantidad = +cantidadInput.value;
                    
                    cantidad = cantidad > 0 ? cantidad - 1 : 0;

                    carrito.establecerCantidadProducto(id, cantidad);
                    this.pintame(carrito);
                }
            });
        });

        const botonesSumar = this.#contenedorCarrito.querySelectorAll(".boton__sumar");
        botonesSumar.forEach(boton => {
            boton.addEventListener('click', event => {
                let id = boton.dataset.id;
                let cantidadInput = this.#contenedorCarrito.querySelector(`#cantidad-${id}`);
                
                if (cantidadInput) {
                    let cantidad = +cantidadInput.value;
                    
                    carrito.establecerCantidadProducto(id, cantidad + 1);
                    this.pintame(carrito);
                }
            });
        });

        const inputsCantidad = this.#contenedorCarrito.querySelectorAll(".cantidad");
        inputsCantidad.forEach(input => {
            input.addEventListener('change', event => {
                let id = input.dataset.id;
                let nuevaCantidad = +input.value;

                if (isNaN(nuevaCantidad) || nuevaCantidad < 0) {
                    nuevaCantidad = 0;
                }

                carrito.establecerCantidadProducto(id, nuevaCantidad);
                this.pintame(carrito);
            });
        });
    
        contenido = listado.reduce((acc, item) => {
            return acc + this.generarLineaResumen(item);
        }, '');
        this.#contenedorResumen.innerHTML = contenido;

        this.#contenedorTotal.innerHTML = `<strong>${carrito.obtenerTotal()}</strong>`;
    }

}