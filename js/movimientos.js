// Imprime en el DOM los movimientos de un usuario, mostrando la moneda cripto y el monto en USD de cada movimiento.
const renderizarMovimientos = (username, filtro) => {  
    // Se limpia la vista.
    const movimientosDiv = document.getElementById("listaMovimientos")
    while (movimientosDiv.firstChild) {
        movimientosDiv.removeChild(movimientosDiv.firstChild);
    }

    // Se obtienen los movimientos del usuario. Se valida el filtro elegido en la vista.
    let movimientos = obtenerMovimientosDeUsuario(username)
                      .filter(m => filtro === 'TODOS' ? m === m : m.criptomoneda.sigla === filtro)

    // Si no hay movimientos se muestra una leyenda. Si hay, se los itera para imprimirlos en el documento.
    if(movimientos.length === 0){
        const span = document.createElement("span")
        span.style.paddingLeft = '15px'
        span.innerHTML = "No se registran movimientos."
        movimientosDiv.appendChild(span)
    }
    else {
        movimientos.forEach(m => {
            let movimiento = new Movimiento(m)
            // Se crean elementos y se asignan sus clases de estilos.
            const div = document.createElement("div")
            div.className = "movimiento__container"
            const span = document.createElement("span")
            span.className = "movimiento"

            // Se agrega ícono para borrar movimiento.
            const img = document.createElement("img")
            img.className = "movimiento__deleteIcon"
            img.src = "../images/eliminar-movimiento-icon.png"
            const button = document.createElement("button")
            button.className = "movimiento__deleteButton"
            button.appendChild(img)

            // Guardo contenido con el movimiento a imprimir.
            span.innerHTML = `${movimiento.operacion === 'C' ? '+' : '-'} ${formatoCripto(movimiento.unidades)} ${movimiento.criptomoneda.sigla} = ${formatoMoneda(movimiento.montoEnUSD())} USD`
            
            // Agrego los elementos al DOM.
            div.appendChild(span)
            div.appendChild(button)
            movimientosDiv.appendChild(div)
        })
    }
}

// Crea un movimiento y lo guarda en el Local Storage.
const registrarMovimiento = movimiento => {
    let movimientos = obtenerTodosLosMovimientos()
    movimientos.push(new Movimiento(movimiento))
    localStorage.setItem('movimientos', JSON.stringify(movimientos))
}

// Procesa formulario de carga de movimiento y lo registra.
const procesarNuevoMovimiento = evento => {   
    // Se obtienen valores.
    let moneda = document.getElementById("selectCriptomoneda").value
    let operacion = document.getElementById("selectOperacion").value
    let unidades = parseFloat(document.getElementById("inputCantidad").value)
    
    // Se obtienen datos para crear movimiento.
    let criptomoneda = criptomonedas.find(c => c.sigla === moneda)
    let username = sessionStorage.getItem('username')

    // Se crea el movimiento y se lo persiste en el storage.
    registrarMovimiento({
        criptomoneda: criptomoneda,
        unidades: unidades,
        operacion: operacion,
        fechaCarga: new Date(),
        username: username
    })
    
    // Se actualiza vista con el nuevo movimiento incluido.
    renderizarMovimientos(username,'TODOS')
}

// TODO - Elimina un movimiento registrado por un usuario.
const borrarMovimiento = evento => {
    console.log('Borrando...')
    alert('Funcionalidad aún no disponible.')
}

// Filtra en la vista movimientos según la opción elegida en el combo.
const filtrarMovimientos = evento => {
    let filtroSeleccionado = document.getElementById('selectFiltroMovimientos').value
    let username = sessionStorage.getItem('username')
    renderizarMovimientos(username, filtroSeleccionado)
}

// Inicialización del documento.
const init = () => {
    // Carga de movimientos en 'Mis Movimientos'
    let username = sessionStorage.getItem('username')
    renderizarMovimientos(username, 'TODOS')

    /* Carga de eventos */
    // Registrar nuevo movimiento
    let cargarMovimientoForm = document.getElementById('cargar-movimiento-form')
    cargarMovimientoForm.addEventListener('submit', procesarNuevoMovimiento)

    // Eliminar un movimiento
    let botonesEliminar = document.getElementsByClassName('movimiento__deleteButton')
    for(const boton of botonesEliminar){
        boton.addEventListener('click', borrarMovimiento)
    }

    // Filtrar movimientos
    let botonFiltrar = document.getElementById('buttonFiltroMovimientos')
    botonFiltrar.addEventListener('click',filtrarMovimientos)
}

init()
