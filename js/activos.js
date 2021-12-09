
// Balance total del usuario en sesión.
let SALDO_USUARIO

// Imprime en el DOM los elementos HTML para visualizar los saldos de todas las criptomonedas.
const renderizarSeccionSaldos = () => {

    // Se agrega el saldo al DOM de cada criptomoneda existente en el sistema.
    criptomonedas.forEach( (c,index) => {
        $('#listaSaldos').append(  
            `<div class="col-12 col-md-6 saldo">
                <div class="saldo__info">
                    <div class="saldo__imagen">
                        <img src="../${c.rutaImagen}" alt="${c.nombre}">
                    </div>
                    <div class="saldo__moneda">
                        <div class="saldo__nombre">${c.nombre}</div>
                        <div class="saldo__sigla">(${c.sigla})</div>                    
                    </div>
                </div>
                <div class="saldo__monto">
                    <span id="saldo${c.sigla}">Cargando...</span>
                </div>
            </div>`)

        // Se muestra el saldo con una animación de fadeIn.
        $(`#saldo${c.sigla}`).fadeOut(0)
                             .delay(300 * index)
                             .fadeIn(1000)
    })
}

/* Imprime en el DOM elementos HTML para visualizar el balance total del usuario en la moneda de su preferencia. */
const renderizarSaldoTotal = siglaMoneda => {

    let todasLasMonedas = fiat.concat(criptomonedas)
    let moneda = todasLasMonedas.find(m => m.sigla === siglaMoneda)

    // Carga combo de selección de moneda en la cual visualizar el balance total.
    // Deja seleccionada la moneda recibida por parámetro.
    let opcionesCombo = ``
    todasLasMonedas.forEach(m => {
        opcionesCombo += `<option value="${m.sigla}" ${m.sigla === siglaMoneda ? 'selected="true"' : ''}>
                            ${m.sigla}
                          </option>`
    })
    
    // Carga balance total
    $('#saldo__total').empty()
                      .append(`
                        <div class="saldo__info">
                            <div class="saldo__imagen">
                                <img src="../${moneda.rutaImagen}" alt="${moneda.nombre}">
                            </div>
                            <div class="saldo__moneda">
                                <div class="saldo__nombre">${moneda.nombre}</div>
                                <div class="saldo__sigla">
                                    <select id="saldo__combo">
                                        ${opcionesCombo}
                                    </select>
                                </div>                    
                            </div>
                        </div>
                        <div class="saldo__monto">
                            <span id="saldoTotal">Cargando...</span>
                        </div>
                      `)
    
    // Asocia evento al combo de selección mandando a renderizar el saldo nuevamente cuando el usuario cambie su moneda de preferencia.
    $('#saldo__combo').change( () => {
        SALDO_USUARIO = 0
        let monedaCombo = $('#saldo__combo').val()
        sessionStorage.setItem('monedaSaldoTotal', monedaCombo)
        renderizarSaldoTotal(monedaCombo)
        obtenerCotizaciones(criptomonedas, renderizarSaldo)
    })
}

/* Actualiza en el DOM el saldo total del usuario. 
   Utiliza un acumulador SALDO_USUARIO para sumar el balance en USD calculado hasta el momento, 
   independiente del orden en que lleguen las respuestas de las cotizaciones vía API. */
const actualizarSaldoTotal = (saldoCripto, criptomoneda) => {

    // Se suma la posesión de la criptomoneda al saldo total del usuario.
    SALDO_USUARIO += saldoCripto * criptomoneda.cotizacion

    // Se actualiza el DOM con el saldo total según la moneda elegida.
    let monedaElegida = criptomonedas.concat(fiat)
                                     .find(m => m.sigla === sessionStorage.getItem('monedaSaldoTotal'))
    let saldoTotalFinal
    switch(monedaElegida.sigla){
        case 'ARS':
            saldoTotalFinal = convertirAPesos(SALDO_USUARIO)
            break
        case 'USD':
            saldoTotalFinal = formatoMoneda(SALDO_USUARIO)
            break
        default:
            saldoTotalFinal = formatoCripto(SALDO_USUARIO / monedaElegida.cotizacion)
    }

    $(`#saldoTotal`).empty().append(`${saldoTotalFinal}`)
}

/* Función utilizada como callback que reemplaza en el DOM el saldo total de una criptomoneda
   y actualiza el total equivalente en la moneda elegida por el usuario. */
const renderizarSaldo = criptomoneda => {
    // Calcula saldo total de la criptomoneda.
    let saldoCripto = calcularSaldo(criptomoneda, sessionStorage.getItem('username'))

    // Se actualiza el balance de la criptomoneda en el DOM.
    $(`#saldo${criptomoneda.sigla}`).empty().append(`${formatoCripto(saldoCripto)}`)

    // Se actualiza el balance total en el DOM.
    actualizarSaldoTotal(saldoCripto, criptomoneda)
}

// Carga de saldos en 'Mis Activos'.
$(document).ready(() => {
    // Se cargan los elementos HTML para visualizar los saldos de las criptomonedas disponibles.
    renderizarSeccionSaldos(sessionStorage.getItem('username'))
    
    // Se carga los elementos HTML para visualizar el saldo TOTAL según la moneda elegida por el usuario en combo.
    // Cuando inicia sesión se guarda el valor 'ARS' para el combo. Luego se actualiza cuando el usuario interactúa con el combo.
    renderizarSaldoTotal(sessionStorage.getItem('monedaSaldoTotal'))

    /* Se guarda en SALDO_USUARIO un acumulador de saldo total.
    Dado que las cotizaciones se obtienen de forma asincrónica, a medida que lleguen las respuestas vía API
    se calculará la posesión del usuario en USD correpondiente a la criptomoneda consultada y se la sumará
    al saldo total obtenido hasta el momento.
    Se inicializa en 0 para que cada vez que se cargue el documento se vuelva a calcular el total con las cotizaciones más recientes. */
    SALDO_USUARIO = 0

    /* Se obtienen vía API las cotizaciones de las criptomonedas y de tipo de cambio USD-ARS,
       y se las utiliza para calcular el saldo total en USD y convertirlo a la moneda elegida por el usuario en el combo */
    obtenerCotizaciones(criptomonedas, renderizarSaldo)
})

