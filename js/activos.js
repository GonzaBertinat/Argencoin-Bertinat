// Imprime en el DOM los elementos HTML para visualizar los saldos de todas las criptomonedas.
const renderizarSeccionSaldos = () => {

    // Se agregan los saldos al DOM.
    criptomonedas.forEach( (c,index) => {
        $('#listaSaldos').append(  
            `<div class="col-10 col-lg-6 saldo">
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
            </div>`
        )

        // Se muestra el saldo con una animación de fadeIn de arriba hacia abajo.
        $(`#saldo${c.sigla}`).fadeOut(0)
                             .delay(300 * index)
                             .fadeIn(1000)
    })
}

/* Actualiza en el DOM el saldo total Pesos Argentinos del usuario. 
   Utiliza un acumulador almacenado en Session Storage para sumar el balance calculado hasta el momento, 
   independiente del orden en que lleguen las respuestas de las cotizaciones vía API. */
const actualizarSaldoTotal = (saldoCripto, criptomoneda) => {

    // Se obtiene el saldo total acumulado.
    let total = parseFloat(sessionStorage.getItem('saldo'))
    
    // Se suma la posesión de la criptomoneda.
    total += saldoCripto * criptomoneda.cotizacion

    // Se actualiza el DOM.
    let monedaElegida = criptomonedas.concat(fiat)
                                     .find(m => m.sigla === sessionStorage.getItem('monedaSaldoTotal'))
    let saldoTotalFinal
    switch(monedaElegida.sigla){
        case 'ARS':
            saldoTotalFinal = convertirAPesos(total)
            break
        case 'USD':
            saldoTotalFinal = formatoMoneda(total)
            break
        default:
            saldoTotalFinal = formatoCripto(total / monedaElegida.cotizacion)
    }

    $(`#saldoTotal`).empty().append(`${saldoTotalFinal}`)
    
    // Se persiste en Storage el nuevo saldo total acumulado.
    sessionStorage.setItem('saldo', total)
}

/* Función utilizada como callback que reemplaza en el DOM el saldo total de una criptomoneda
   y actualiza el total equivalente en la moneda elegida por el usuario */
const renderizarSaldo = (criptomoneda) => {
    // Calcula saldo total de la criptomoneda.
    let saldoCripto = calcularSaldo(criptomoneda, sessionStorage.getItem('username'))

    // Se actualiza el balance de la criptomoneda en el DOM.
    $(`#saldo${criptomoneda.sigla}`).empty().append(`${formatoCripto(saldoCripto)}`)

    // Se actualiza el balance total en el DOM.
    actualizarSaldoTotal(saldoCripto, criptomoneda)
}

const renderizarSaldoTotal = (siglaMoneda) => {

    let todasLasMonedas = fiat.concat(criptomonedas)
    let moneda = todasLasMonedas.find(m => m.sigla === siglaMoneda)

    let opcionesCombo = ``
    todasLasMonedas.forEach(m => {
        opcionesCombo += `<option value="${m.sigla}" ${m.sigla === siglaMoneda ? 'selected="true"' : ''}>
                            ${m.sigla}
                          </option>`
    })
    
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
    
    $('#saldo__combo').change( () => {
        let monedaCombo = $('#saldo__combo').val()
        sessionStorage.setItem('monedaSaldoTotal', monedaCombo)
        sessionStorage.setItem('saldo', 0)
        renderizarSaldoTotal(monedaCombo)
        obtenerCotizaciones(criptomonedas, renderizarSaldo)
    })
}

// Carga de saldos en 'Mis Activos'
$(document).ready(() => {
    // Se cargan los elementos HTML para visualizar los saldos de las criptomonedas disponibles.
    renderizarSeccionSaldos(sessionStorage.getItem('username'))
    
    // Se inicializa moneda elegida a Peso Argentino en caso de no tener ninguna guardada
    if(!sessionStorage.getItem('monedaSaldoTotal')){
        sessionStorage.setItem('monedaSaldoTotal', 'ARS')
    }
    // Se carga los elementos HTML para visualizar el saldo TOTAL según la moneda elegida por el usuario en combo
    renderizarSaldoTotal(sessionStorage.getItem('monedaSaldoTotal'))

    /* Se guarda en Storage un acumulador de saldo total.
       Dado que las cotizaciones se obtienen de forma asincrónica, a medida que lleguen las respuestas vía API
       se calculará la posesión del usuario en USD correpondiente a la criptomoneda consultada y se la sumará
       al saldo total obtenido hasta el momento.
       Se inicializa en 0 para que cada vez que se cargue el sitio se vuelva a calcular el total con las cotizaciones más recientes. */
    sessionStorage.setItem('saldo', 0)

    /* Se obtienen vía API las cotizaciones de las criptomonedas y de tipo de cambio USD-ARS,
       y se las utiliza para calcular el saldo total en USD y convertirlo a la moneda elegida por el usuario */
    obtenerCotizaciones(criptomonedas, renderizarSaldo)
})

