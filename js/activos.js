// Imprime en el DOM los elementos HTML para visualizar los saldos de todas las criptomonedas.
const renderizarSeccionSaldos = () => {

    // Se agregan los saldos al DOM.
    criptomonedas.forEach(c => {
        $('#listaSaldos').append(  
            `<div class="col-12">
                <div class="saldo">
                    <span>${c.nombreFormateado()}</span>
                    <span id="saldo${c.sigla}">Cargando...</span>
                </div>
             </div>`
        )
    })
}

/* Actualiza en el DOM el saldo total en USD y Pesos Argentinos del usuario. 
   Utiliza un acumulador almacenado en Session Storage para sumar el balance calculado hasta el momento, 
   independiente del orden en que lleguen las respuestas de las cotizaciones vía API. */
const actualizarSaldoTotal = (saldoCripto, criptomoneda) => {

    // Se obtiene el saldo total acumulado.
    let total = parseFloat(sessionStorage.getItem('saldo'))
    
    // Se suma la posesión de la criptomoneda.
    total += saldoCripto * criptomoneda.cotizacion

    // Se actualiza el DOM.
    $(`#saldoPesos`).empty().append(`${convertirAPesos(total)}`)
    $(`#saldoDolares`).empty().append(`${formatoMoneda(total)}`)
    
    // Se persiste en Storage el nuevo saldo total acumulado.
    sessionStorage.setItem('saldo', total)
}

// Calcula el total de unidades de una criptomoneda en posesión del usuario según sus movimientos.
const calcularSaldo = (criptomoneda, usuario) => {
    return obtenerMovimientosDeUsuario(usuario)
            .filter(m => m.moneda === criptomoneda.sigla)
            .map(m => new Movimiento(m))
            .map(m => m.unidades * (m.operacion === 'V' ? -1 : 1))
            .reduce((x,y) => x + y, 0)
}

/* Función utilizada como callback que reemplaza en el DOM el saldo total de una criptomoneda
   y actualiza el total equivalente en Pesos y en Dólares. */
const renderizarSaldo = (criptomoneda) => {
    // Calcula saldo total de la criptomoneda.
    let saldoCripto = calcularSaldo(criptomoneda, sessionStorage.getItem('username'))

    // Se actualiza el balance de la criptomoneda en el DOM.
    $(`#saldo${criptomoneda.sigla}`).empty().append(`${formatoCripto(saldoCripto)}`)

    // Se actualiza el balance total en PESOS y USD en el DOM.
    actualizarSaldoTotal(saldoCripto, criptomoneda)
}

// Carga de saldos en 'Mis Activos'
$(document).ready(() => {
    // Se cargan los elementos HTML para visualizar los saldos.
    renderizarSeccionSaldos(sessionStorage.getItem('username'))
    
    /* Se guarda en Storage un acumulador de saldo total.
       Dado que las cotizaciones se obtienen de forma asincrónica, a medida que lleguen las respuestas vía API
       se calculará la posesión del usuario en USD correpondiente a la criptomoneda consultada y se la sumará
       al saldo total obtenido hasta el momento.
       Se inicializa en 0 para que cada vez que se cargue el sitio se vuelva a calcular el total con las cotizaciones más recientes. */
    sessionStorage.setItem('saldo', 0)

    /* Se obtienen vía API las cotizaciones de las criptomonedas y de tipo de cambio USD-ARS,
       y se las utiliza para calcular el saldo total en USD y en Pesos Argentinos */
    obtenerCotizaciones(criptomonedas, renderizarSaldo)
})

