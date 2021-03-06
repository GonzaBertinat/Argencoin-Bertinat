// Renderiza en la sección de Inicio los elementos HTML para visualizar cotizaciones de Bitcoin y Ethereum.
const renderizarSeccionCotizaciones = () => {
    // Se muestran Bitcoin y Ethereum ya que son las monedas más importantes del mercado.
    const criptos = criptomonedas.filter(c => c.sigla === 'BTC' || c.sigla === 'ETH')

    // Para cada criptomoneda generamos su HTML correspondiente.
    criptos.forEach(c => {
        $('.cotizacionesIndex__contenedor .container .row').append(
            `<div class="col-8 col-sm-6 col-md-5 col-lg-4">
                <div class="cotizacionIndex">
                    <span class="cotizacionIndex__moneda">${c.nombreFormateado()}</span>
                    <img class="cotizacionIndex__logo" src="${c.rutaImagen}">
                    <span id="cotizacionIndex__precio_${c.sigla}" class="cotizacionIndex__precio">Cargando...</span>
                </div>
            </div>`
        )
    })
}

// Función utilizada como callback que reemplaza en el DOM el precio de una criptomoneda. 
const renderizarCotizacionIndex = criptomoneda => {
    $(`#cotizacionIndex__precio_${criptomoneda.sigla}`).empty().append(`${criptomoneda.cotizacion} USD`)
}

// Inicializa documento.
$(document).ready(() => {
    // Se cargan los elementos HTML en el DOM para cotizaciones de principales criptomonedas.
    renderizarSeccionCotizaciones()
    
    // Se obtienen vía API las cotizaciones de las criptomonedas BTC y ETH y se reemplaza su valor en el DOM con la función de callback.
    const criptos = criptomonedas.filter(c => c.sigla === 'BTC' || c.sigla === 'ETH')
    obtenerCotizaciones(criptos, renderizarCotizacionIndex)
})
