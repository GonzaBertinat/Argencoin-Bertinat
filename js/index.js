// Renderiza en la sección de Inicio la cotización de Bitcoin y Ethereum.
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

// Inicializa documento.
$(document).ready(() => {
    // Se cargan las cotizaciones en vivo de las criptomonedas principales.
    renderizarSeccionCotizaciones()
    // Se ejecuta breve animación en el título del sitio.
    $('.fondoIndex__titulo').animate({fontSize: '100px'},1500)
                            .animate({fontSize: '70px'},1500)
})
