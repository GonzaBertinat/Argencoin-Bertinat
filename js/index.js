// Renderiza en la sección de Inicio los elementos HTML para visualizar cotizaciones de Bitcoin y Ethereum.
const renderizarSeccionCotizaciones = () => {
    // Se muestran Bitcoin y Ethereum ya que son las monedas más importantes del mercado.
    const criptos = criptomonedas.filter(c => c.sigla === 'BTC' || c.sigla === 'ETH')

    // Para cada criptomoneda generamos su HTML correspondiente.
    criptos.forEach(c => {
        $('.cotizacionesIndex__contenedor').append(
            `<div class="col-6 col-md-3">
                <div class="cotizacion">
                    <span class="cotizacion__moneda">${c.nombreFormateado()}</span>
                    <img class="cotizacion__logo" src="${c.rutaImagen}">
                    <span id="cotizacion__precio_${c.sigla}" class="cotizacion__precio">Cargando...</span>
                </div>
            </div>`
        )
    })
}

// Función utilizada como callback que reemplaza en el DOM el precio de una criptomoneda. 
const renderizarCotizacion = (criptomoneda) => {
    $(`#cotizacion__precio_${criptomoneda.sigla}`).empty().append(`${criptomoneda.cotizacion} USD`)
}

// Inicializa documento.
$(document).ready(() => {
    // Se cargan los elementos HTML en el DOM para cotizaciones de principales criptomonedas.
    renderizarSeccionCotizaciones()
    
    // Se obtienen vía API las cotizaciones de las criptomonedas.
    const criptos = criptomonedas.filter(c => c.sigla === 'BTC' || c.sigla === 'ETH')
    obtenerCotizaciones(criptos, renderizarCotizacion)
    
    // Se ejecuta breve animación en el título del sitio.
    $('.fondoIndex__titulo').animate({fontSize: '100px'},1500)
                            .animate({fontSize: '70px'},1500)
})
