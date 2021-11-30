// Se carga encabezado con nombre de columnas para la tabla de movimientos
const renderizarHeaderMovimientos = () => {
    $('#listaMovimientos').append(
        `<div class="col-12">
            <div class="cotizacion__header">
                <div class="cotizacion__grupoTitulos">
                    <div class="cotizacion__titulo">
                        <span>OPERACIÓN</span>
                    </div>
                </div>
                <div class="cotizacion__grupoTitulos">
                    <div class="cotizacion__titulo">
                        <span>MONEDA</span>
                    </div>
                </div>
                <div class="cotizacion__grupoTitulos">
                    <div class="cotizacion__titulo">
                        <span>FECHA</span>
                    </div>
                </div>
                <div class="cotizacion__grupoTitulos">
                    <div class="cotizacion__titulo">
                        <span>MONTO</span>
                    </div>
                </div>
                <div class="cotizacion__grupoTitulos">
                    <div class="cotizacion__titulo">
                        <span>COTIZACIÓN</span>
                    </div>
                </div>
                <div class="cotizacion__grupoTitulos">
                    <div class="cotizacion__titulo">
                        <span>ELIMINAR</span>
                    </div>
                </div>
            </div>
        </div>`
    )
}

// Devuelve los movimientos correspondientes a una página seleccionada en la vista.
const obtenerMovimientosPagina = (movimientos, pagina) => {
    let movimientosPorPagina = parseInt(sessionStorage.getItem('movimientosPorPagina'))
    let inicio = pagina * movimientosPorPagina
    let fin = inicio + movimientosPorPagina
    return movimientos.slice(inicio, fin)
}

// Renderiza en el DOM un paginador para ver los movimientos en páginas.
const renderizarPaginador = (paginaActual, cantidadMovimientos) => {
    let movimientosPorPagina = parseInt(sessionStorage.getItem('movimientosPorPagina'))
    let cantidadPaginas = cantidadMovimientos % movimientosPorPagina === 0 ? parseInt(cantidadMovimientos / movimientosPorPagina) : parseInt(cantidadMovimientos / movimientosPorPagina) + 1
    let habilitarAnterior = paginaActual !== 0
    let habilitarSiguiente = paginaActual !== (cantidadPaginas - 1)
    
    $('#paginador').empty()
                   .append(`
                    <div class="container">
                      <div class="row">
                        <div class="col-12 col-md-5 paginador__contenedor">
                            <button id="paginaAnteriorButton" ${!habilitarAnterior ? 'disabled = "true" class="paginador__deshabilitado"' : ''}>Anterior</button>
                            <div class="paginador__info">
                                <p>Página <span id="paginaActual">${paginaActual+1}</span> de <span id="ultimaPagina">${cantidadPaginas}</span></p>
                                <span>Movimientos encontrados: ${cantidadMovimientos}</span>
                            </div>
                            <button id="paginaSiguienteButton" ${!habilitarSiguiente ? 'disabled = "true" class="paginador__deshabilitado"' : ''}>Siguiente</button>
                        </div>    
                      </div>  
                    </div>`)

    // Cargo eventos para botones de página siguiente y anterior
    let filtro = $('#selectFiltroMovimientos').val()
    let usuario = sessionStorage.getItem('username')
    $('#paginaAnteriorButton').click( () => {
        renderizarMovimientos(usuario,filtro,paginaActual-1)
    })

    $('#paginaSiguienteButton').click(() => {
        renderizarMovimientos(usuario,filtro,paginaActual+1)
    })

    // Renderiza selección de cantidad de movimientos por página
    let cantidadCombo = parseInt(sessionStorage.getItem('movimientosPorPagina'))
    $('#movimientos__cantidad').empty()
                               .append(
                                `<div class="cantidad__contenedor">   
                                    <span>Mostrar</span>
                                        <select id="selectCantidadMovimientos" class="comboCantidad">
                                            <option value="3" ${cantidadCombo === 3 ? 'selected="true"' : ''}>3</option>
                                            <option value="5" ${cantidadCombo === 5 ? 'selected="true"' : ''}>5</option>
                                            <option value="10" ${cantidadCombo === 10 ? 'selected="true"' : ''}>10</option>
                                        </select>
                                    <span>movimientos por página</span>
                                </div>`)    
                                .change(() => {
                                    let nuevaCantidad = $('#selectCantidadMovimientos').val()
                                    sessionStorage.setItem('movimientosPorPagina', nuevaCantidad)
                                    renderizarMovimientos(usuario,filtro,0)
                                })         
}

// Imprime en el DOM los movimientos de un usuario, mostrando la moneda cripto y el monto en USD de cada movimiento.
const renderizarMovimientos = (username, filtro, numeroPagina) => {  
    
    // Se limpia la vista.
    $('#listaMovimientos').empty()
   
    // Se obtienen los movimientos del usuario. Se valida el filtro elegido en la vista.
    let movimientos = obtenerMovimientosDeUsuario(username)
                      .filter(m => filtro === 'TODOS' ? m === m : m.moneda === filtro)


    let cantidadMovimientos = movimientos.length
    
    // Si no hay movimientos se muestra una leyenda. Si hay, se los itera para imprimirlos en el documento.
    if(cantidadMovimientos === 0){
        $('#listaMovimientos').append(
            `<div class="movimientos__vacio">
                <span>No se encontraron movimientos</span>
             </div>`
        )
        
        // No se carga paginador ya que no hay movimientos
        $('#paginador').empty()
        $('#movimientos__cantidad').empty()
    }
    else {
        // Se carga header
        renderizarHeaderMovimientos()

        // Se carga paginador
        renderizarPaginador(numeroPagina, cantidadMovimientos)

        // Se obtienen los movimientos a mostrar según el paginado
        movimientos = obtenerMovimientosPagina(movimientos, numeroPagina)
        
        // Se cargan los movimientos en la vista.
        movimientos.forEach((m,index) => {
            let movimiento = new Movimiento(m)
            let criptomoneda = criptomonedas.find(c => c.sigla === movimiento.moneda)
            
            $('#listaMovimientos').append(
                `<div id="${movimiento.id}" class="col-12">
                    <div class="movimiento__contenedor ${index % 2 === 0 ? 'movimiento__contenedor-light' : 'movimiento__contenedor-normal'}">
                        <div class="movimiento__operacion">
                            <div class="movimiento__imagenOperacion ${movimiento.operacion === 'C' ? 'movimiento__compra' : 'movimiento__venta'}">
                                ${movimiento.operacion === 'C' ? '<img src="../images/icons/compra-icon.png" alt="Compra">' : '<img src="../images/icons/venta-icon.png" alt="Venta">'}
                            </div>
                            <div class="movimiento__tipoOperacion">
                                ${movimiento.operacion === 'C' ? '<span>Compra</span>' : '<span>Venta</span>'}
                            </div>
                        </div>
                        <div class="movimiento__moneda">
                            <div class="movimiento__imagenMoneda">
                                <img src="../${criptomoneda.rutaImagen}" alt="${criptomoneda.sigla}">
                            </div>
                            <div class="movimiento__nombreMoneda">
                                <span>${criptomoneda.sigla}</span>
                            </div>
                        </div>
                        <div class="movimiento__fecha">
                            <span>${new Date(movimiento.fechaCarga).toLocaleString()}</span>
                        </div>
                        <div class="movimiento__unidades">
                            <span>${formatoCripto(movimiento.unidades)}</span>
                        </div>
                        <div class="movimiento__precio">
                            <span>${movimiento.precio}</span>
                        </div>
                        <div class="movimiento__eliminar">
                            <button onclick="asignarId(${movimiento.id})" type="button" class="movimiento__deleteButton btn" data-bs-toggle="modal" data-bs-target="#confirmarBorradoForm" data-toggle="tooltip" data-placement="left" title="Borrar movimiento">
                                <img class="movimiento__deleteIcon" src="../images/icons/borrar-icon.png">
                            </button>
                        </div>
                    </div>
                </div>`
            )
            
            // Se muestra el movimiento con una animación de slideDown de arriba hacia abajo.
            $(`#${movimiento.id}`)
                            .fadeOut(0)
                            .delay(300 * index)
                            .slideDown(1500)
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
    let criptomoneda = criptomonedas.find(c => c.sigla === $('#selectCriptomoneda').val())
    
    registrarMovimiento({
        id: new Date().getTime(),
        precio: criptomoneda.cotizacion,
        moneda: criptomoneda.sigla,
        unidades: parseFloat($('#inputCantidad').val()),
        operacion: $('#selectOperacion').val(),
        fechaCarga: new Date(),
        username: sessionStorage.getItem('username')
    })
    
    // Se actualiza vista con el nuevo movimiento incluido.
    renderizarMovimientos(username,'TODOS',0)
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
    renderizarMovimientos(sessionStorage.getItem('username'),'TODOS',0)
}

// Actualiza logo de criptomoneda elegida en el filtro de movimientos
const actualizarLogoCombo = (valor) => {
    let rutaImagen
    let alt
    if(valor === 'TODOS'){
        rutaImagen = '../images/monedas/usd.png'
        alt = "Logo dinero"
    }
    else {
        let criptomoneda = criptomonedas.find(c => c.sigla === valor)
        rutaImagen = `../${criptomoneda.rutaImagen}`
        alt = `Logo ${criptomoneda.nombre}`
    }
    
    $('.movimientos__logoFiltro').empty().append(`
        <img src="${rutaImagen}" alt="${alt}">                    
    `)
}

// Filtra en la vista movimientos según la opción elegida en el combo.
const filtrarMovimientos = () => {
    let valor = $('#selectFiltroMovimientos').val()
    actualizarLogoCombo(valor)
    renderizarMovimientos(sessionStorage.getItem('username'), valor, 0)
}

// Imprime en DOM las opciones para combos de criptomonedas, para la carga y filtrado de movimientos.
const renderizarCombosMonedas = () => {
    criptomonedas.forEach(c => {
        $('.comboCriptomonedas').append(
            `<option value="${c.sigla}">${c.nombreFormateado()}</option>`
        )
    })
}

// Inicializa documento.
$(document).ready(() => {
    // Asignación de cantidad de movimientos por página por defecto (si no existía)
    if(!sessionStorage.getItem('movimientosPorPagina')){
        sessionStorage.setItem('movimientosPorPagina', 3)
    }
    // Carga de movimientos en 'Mis Movimientos'.
    renderizarMovimientos(sessionStorage.getItem('username'), 'TODOS', 0)

    // Carga de combos de criptomonedas.
    renderizarCombosMonedas()

    // Se obtienen cotizaciones de las criptomonedas para generar movimientos con los valores más recientes.
    obtenerCotizaciones(criptomonedas, () => {})

    /* Carga de eventos */
    // Registrar nuevo movimiento.
    $('#cargarMovimientoForm').submit(procesarNuevoMovimiento)

    // Borrar un movimiento.
    $('#borrarMovimientoForm').submit(borrarMovimiento)

    // Filtrar movimientos.
    $('#selectFiltroMovimientos').change(filtrarMovimientos)
})
