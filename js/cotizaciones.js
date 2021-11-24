// Imprime en el DOM los elementos HTML para visualizar las cotizaciones de las diferentes criptomonedas del sitio.
const renderizarCotizaciones = criptomonedas => {
    // Para cada criptomoneda generamos su HTML correspondiente.
    criptomonedas.forEach( (c,index) => {
        $('#listaCotizaciones').append(
            `<div class="col-6 col-md-3">
                <div class="cotizacion">
                    <span class="cotizacion__moneda">${c.nombreFormateado()}</span>
                    <img class="cotizacion__logo" src="../${c.rutaImagen}">
                    <span id="${c.sigla}-USD" class="cotizacion__precio">Cargando...</span>
                </div>
            </div>`
        )
        
        // Se muestra la cotización con una animación de fadeIn y se carga después de la anterior.
        $(`#${c.sigla}-USD`).parent() 
                            .parent() // Se accede al div col-6
                            .fadeOut(0) 
                            .delay(300 * index)   
                            .fadeIn(1000)

    })

}

// Función utilizada como callback que reemplaza en el DOM el precio de una criptomoneda. 
const renderizarCotizacion = (criptomoneda) => {
    $(`#${criptomoneda.sigla}-USD`).empty().append(`${criptomoneda.cotizacion} USD`)
}

// Carga de cotizaciones en 'Cotizaciones'.
$(document).ready(() => {
    // Se cargan los elementos HTML para visualizar las cotizaciones.
    renderizarCotizaciones(criptomonedas)

    // Se obtienen vía API las cotizaciones de las criptomonedas.
    obtenerCotizaciones(criptomonedas, renderizarCotizacion)
})
