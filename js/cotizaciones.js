// Imprime en el DOM las cotizaciones de las diferentes criptomonedas del sitio
const renderizarCotizaciones = criptomonedas => {

    // Para cada criptomoneda generamos su HTML correspondiente
    criptomonedas.forEach(c => {
        // Se agrega cotización al DOM.
        $('#listaCotizaciones').append(
            `<div class="col-6 col-md-3">
                <div class="cotizacion">
                    <span class="cotizacion__moneda">${c.nombreFormateado()}</span>
                    <img class="cotizacion__logo" src="../${c.rutaImagen}">
                    <span class="cotizacion__precio">USD $${c.cotizacion}</span>
                </div>
            </div>`
        )
    })
}

// Carga de cotizaciones en 'Cotizaciones'
$(document).ready(() => {
    renderizarCotizaciones(criptomonedas)
})
