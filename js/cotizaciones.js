// Imprime en el DOM los elementos HTML para visualizar las cotizaciones de las diferentes criptomonedas del sitio.
const renderizarCotizaciones = criptomonedas => {
    // Para cada criptomoneda generamos su HTML correspondiente.
    criptomonedas.forEach( (c,index) => {
        $('#listaCotizaciones').append(
            `<div class="col-12 col-md-10" id="precio${c.sigla}">
                <div class="cotizacion__contenedor ${index % 2 === 0 ? 'cotizacion__contenedor-light' : 'cotizacion__contenedor-normal'}">
                    <div class="cotizacion__info">
                        <div class="cotizacion__logo">
                            <img src="../${c.rutaImagen}" alt="Logo ${c.nombre}">
                        </div>
                        <div class="cotizacion__nombre">
                            <span class="cotizacion__moneda">${c.nombre}</span>
                            <span class="cotizacion__sigla">(${c.sigla})</span>
                        </div>
                    </div>
                    <div class="cotizacion__precios">
                        <div class="cotizacion__usd" id="${c.sigla}-USD">Cargando...</div>
                        <div class="cotizacion__ars" id="${c.sigla}-ARS">Cargando...</div>
                    </div>
                </div>
            </div>`
        )

        // Se muestra la cotización con una animación de fadeIn y se carga después de la anterior.
        $(`#precio${c.sigla}`).fadeOut(0) 
                              .delay(300 * index)   
                              .fadeIn(1500)
    })
}

// Función utilizada como callback que reemplaza en el DOM el precio de una criptomoneda. 
const renderizarCotizacion = (criptomoneda) => {
    $(`#${criptomoneda.sigla}-USD`).empty().append(`$ ${criptomoneda.cotizacion}`)
    $(`#${criptomoneda.sigla}-ARS`).empty().append(`$ ${convertirAPesos(criptomoneda.cotizacion)}`)
}

// Carga de cotizaciones en 'Cotizaciones'.
$(document).ready(() => {
    // Se cargan los elementos HTML para visualizar las cotizaciones.
    renderizarCotizaciones(criptomonedas)

    // Se obtienen vía API las cotizaciones de las criptomonedas.
    obtenerCotizaciones(criptomonedas, renderizarCotizacion)
})
