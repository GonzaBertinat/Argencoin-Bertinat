const renderizarSeccionCotizaciones = () => {
    // Se muestran Bitcoin y Ethereum como cotizaciones, ya que son las monedas más importantes.
    const criptos = criptomonedas.filter(c => c.sigla === 'BTC' || c.sigla === 'ETH')

    // Para cada criptomoneda generamos su HTML correspondiente
    criptos.forEach(c => {
        // Se agrega cotización al DOM.
        $('.cotizacionesIndex__contenedor').append(
            `<div class="col-6 col-md-3">
                <div class="cotizacion">
                    <span class="cotizacion__moneda">${c.nombreFormateado()}</span>
                    <img class="cotizacion__logo" src="${c.rutaImagen}">
                    <span class="cotizacion__precio">USD $${c.cotizacion}</span>
                </div>
            </div>`
        )
    })
}

$(document).ready(renderizarSeccionCotizaciones)
