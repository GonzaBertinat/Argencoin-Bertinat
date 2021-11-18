// Imprime en el DOM los movimientos de un usuario, mostrando la moneda cripto y el monto en USD de cada movimiento.
const renderizarMovimientos = (username, filtro) => {  
    // Se limpia la vista.
    $('#listaMovimientos').empty()
   
    // Se obtienen los movimientos del usuario. Se valida el filtro elegido en la vista.
    let movimientos = obtenerMovimientosDeUsuario(username)
                      .filter(m => filtro === 'TODOS' ? m === m : m.criptomoneda.sigla === filtro)

    // Si no hay movimientos se muestra una leyenda. Si hay, se los itera para imprimirlos en el documento.
    if(movimientos.length === 0){
        $('#listaMovimientos').append(
            `<span class="movimientos__vacio">No se registran movimientos.</span>`
        )
    }
    else {
        // Se cargan los movimientos en la vista
        movimientos.forEach(m => {
            let movimiento = new Movimiento(m)
            $('#listaMovimientos').append(
                `<div class="movimiento__container">
                    <span class="movimiento">${movimiento.operacion === 'C' ? '+' : '-'} ${formatoCripto(movimiento.unidades)} ${movimiento.criptomoneda.sigla} = ${formatoMoneda(movimiento.montoEnUSD())} USD</span>
                    <button onclick="asignarId(${movimiento.id})" type="button" class="movimiento__deleteButton btn" data-bs-toggle="modal" data-bs-target="#confirmarBorradoForm" data-toggle="tooltip" data-placement="left" title="Borrar movimiento">
                        <img class="movimiento__deleteIcon" src="../images/eliminar-movimiento-icon.png">
                    </button>
                </div>`
            )
        })
    }
}

// Asigna un id oculto al modal de confirmación para eliminar movimiento, en el momento de presionar el ícono de borrar.
const asignarId = idMovimiento => {
    $('#movimientoId').attr('movimiento_id', idMovimiento)
}

// Crea un movimiento y lo guarda en el Local Storage.
const registrarMovimiento = movimiento => {
    let movimientos = obtenerTodosLosMovimientos()
    movimientos.push(new Movimiento(movimiento))
    localStorage.setItem('movimientos', JSON.stringify(movimientos))
}

// Procesa formulario de carga de movimiento y lo registra.
const procesarNuevoMovimiento = () => {   
    // Se crea el movimiento y se lo persiste en el Storage.
    registrarMovimiento({
        id: new Date().getTime(),
        criptomoneda: criptomonedas.find(c => c.sigla === $('#selectCriptomoneda').val()),
        unidades: parseFloat($('#inputCantidad').val()),
        operacion: $('#selectOperacion').val(),
        fechaCarga: new Date(),
        username: sessionStorage.getItem('username')
    })
    
    // Se actualiza vista con el nuevo movimiento incluido.
    renderizarMovimientos(username,'TODOS')
}

// Elimina un movimiento registrado por un usuario.
const borrarMovimiento = () => {
    // Se obtiene id del movimiento a borrar.
    let idMovimiento = parseInt($('#movimientoId').attr('movimiento_id'))
    
    // Se elimina movimiento.
    const movimientos = obtenerTodosLosMovimientos()
    const index = movimientos.findIndex(m => m.id === idMovimiento)
    movimientos.splice(index, 1)
    localStorage.setItem('movimientos', JSON.stringify(movimientos))
    
    // Se actualiza la vista.
    renderizarMovimientos(sessionStorage.getItem('username'),'TODOS')
}

// Filtra en la vista movimientos según la opción elegida en el combo.
const filtrarMovimientos = () => {
    renderizarMovimientos(sessionStorage.getItem('username'), 
                          $('#selectFiltroMovimientos').val())
}

// Imprime en DOM las opciones para combos de criptomonedas, para la carga y filtrado de movimientos.
const renderizarCombosMonedas = () => {
    criptomonedas.forEach(c => {
        $('.comboCriptomonedas').append(
            `<option value=${c.sigla}>${c.nombreFormateado()}</option>`
        )
    })
}

// Inicializa documento.
$(document).ready(() => {
    // Carga de movimientos en 'Mis Movimientos'.
    renderizarMovimientos(sessionStorage.getItem('username'), 'TODOS')

    // Carga de combos de criptomonedas.
    renderizarCombosMonedas()

    /* Carga de eventos */
    // Registrar nuevo movimiento.
    $('#cargarMovimientoForm').submit(procesarNuevoMovimiento)

    // Borrar un movimiento.
    $('#borrarMovimientoForm').submit(borrarMovimiento)

    // Filtrar movimientos.
    $('#buttonFiltroMovimientos').click(filtrarMovimientos)
})
