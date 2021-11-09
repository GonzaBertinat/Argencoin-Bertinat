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
        // Se cargan los movimientos en la vista
        movimientos.forEach(m => {
            let movimiento = new Movimiento(m)
            const div = document.createElement("div")
            div.innerHTML =
            `<div class="movimiento__container">
                <span class="movimiento">${movimiento.operacion === 'C' ? '+' : '-'} ${formatoCripto(movimiento.unidades)} ${movimiento.criptomoneda.sigla} = ${formatoMoneda(movimiento.montoEnUSD())} USD</span>
                <button onclick="asignarId(${movimiento.id})" type="button" class="movimiento__deleteButton btn" data-bs-toggle="modal" data-bs-target="#confirmarBorradoForm" data-toggle="tooltip" data-placement="left" title="Borrar movimiento">
                    <img class="movimiento__deleteIcon" src="../images/eliminar-movimiento-icon.png">
                </button>
            </div>`
            movimientosDiv.appendChild(div)
        })
    }
}

// Asigna un id oculto al modal de confirmación para eliminar movimiento, en el momento de presionar el ícono de borrar.
const asignarId = idMovimiento => {
    let hiddenId = document.getElementById('movimientoId')
    hiddenId.setAttribute("movimiento_id", idMovimiento)
}

// Crea un movimiento y lo guarda en el Local Storage.
const registrarMovimiento = movimiento => {
    let movimientos = obtenerTodosLosMovimientos()
    movimientos.push(new Movimiento(movimiento))
    localStorage.setItem('movimientos', JSON.stringify(movimientos))
}

// Procesa formulario de carga de movimiento y lo registra.
const procesarNuevoMovimiento = () => {   
    // Se obtienen valores.
    let moneda = document.getElementById("selectCriptomoneda").value
    let operacion = document.getElementById("selectOperacion").value
    let unidades = parseFloat(document.getElementById("inputCantidad").value)
    
    // Se obtienen datos para crear movimiento.
    let criptomoneda = criptomonedas.find(c => c.sigla === moneda)
    let username = sessionStorage.getItem('username')

    // Se crea el movimiento y se lo persiste en el Storage.
    registrarMovimiento({
        id: new Date().getTime(),
        criptomoneda: criptomoneda,
        unidades: unidades,
        operacion: operacion,
        fechaCarga: new Date(),
        username: username
    })
    
    // Se actualiza vista con el nuevo movimiento incluido.
    renderizarMovimientos(username,'TODOS')
}

// Elimina un movimiento registrado por un usuario.
const borrarMovimiento = () => {
    // Se obtiene id del movimiento a borrar.
    let idMovimiento = parseInt(document.getElementById('movimientoId').getAttribute('movimiento_id'))
 
    // Se elimina movimiento.
    const movimientos = obtenerTodosLosMovimientos()
    const index = movimientos.findIndex(m => m.id === idMovimiento)
    movimientos.splice(index, 1)
    localStorage.setItem('movimientos', JSON.stringify(movimientos))
    
    // Se actualiza la vista.
    let username = sessionStorage.getItem('username')
    renderizarMovimientos(username,'TODOS')
}

// Filtra en la vista movimientos según la opción elegida en el combo.
const filtrarMovimientos = () => {
    let filtroSeleccionado = document.getElementById('selectFiltroMovimientos').value
    let username = sessionStorage.getItem('username')
    renderizarMovimientos(username, filtroSeleccionado)
}

// Imprime en DOM las opciones para combos de criptomonedas, para la carga y filtrado de movimientos.
const renderizarCombosMonedas = () => {
    let combos = document.getElementsByClassName('comboCriptomonedas')
    for(const combo of combos){
        criptomonedas.forEach(c => {
            const option = document.createElement('option')
            option.value = c.sigla
            option.innerHTML = c.nombreFormateado()
            combo.appendChild(option)
        })
    }
}

// Inicialización del documento.
const init = () => {
    // Carga de movimientos en 'Mis Movimientos'
    let username = sessionStorage.getItem('username')
    renderizarMovimientos(username, 'TODOS')

    // Carga de combos de criptomonedas
    renderizarCombosMonedas()

    /* Carga de eventos */
    // Registrar nuevo movimiento
    let cargarMovimientoForm = document.getElementById('cargarMovimientoForm')
    cargarMovimientoForm.addEventListener('submit', procesarNuevoMovimiento)

    // Borrar un movimiento
    let borrarMovimientoForm = document.getElementById('borrarMovimientoForm')
    borrarMovimientoForm.addEventListener('submit', borrarMovimiento)
    
    // Filtrar movimientos
    let botonFiltrar = document.getElementById('buttonFiltroMovimientos')
    botonFiltrar.addEventListener('click',filtrarMovimientos)
}

init()
