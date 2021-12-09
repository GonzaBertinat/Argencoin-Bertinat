// Imprime en el DOM los elementos HTML para visualizar las cotizaciones de las diferentes criptomonedas del sitio.
const renderizarCotizaciones = criptomonedas => {
    // Para cada criptomoneda se genera su HTML correspondiente.
    criptomonedas.forEach( (c,index) => {
        $('#listaCotizaciones').append(
            `<div id="precio${c.sigla}" class="row cotizacion__contenedor ${index % 2 === 0 ? 'cotizacion__contenedor-light' : 'cotizacion__contenedor-normal'}">
                <div class="col-12 col-sm-5">
                    <div class="cotizacion__info">
                        <div class="cotizacion__logo">
                            <img src="../${c.rutaImagen}" alt="Logo ${c.nombre}">
                        </div>
                        <div class="cotizacion__nombre">
                            <span class="cotizacion__moneda">${c.nombre}</span>
                            <span class="cotizacion__sigla">(${c.sigla})</span>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3 cotizacion__usd">
                    <span class="cotizacion__label">PRECIO USD</span>
                    <span id="${c.sigla}-USD">Cargando...</span>            
                </div>
                <div class="col-12 col-sm-4 cotizacion__ars">
                    <span class="cotizacion__label">PRECIO ARS</span>
                    <span id="${c.sigla}-ARS">Cargando...</span>        
                </div>
            </div>`)

        // Se muestra la cotización con una animación de fadeIn.
        $(`#precio${c.sigla}`).fadeOut(0) 
                              .delay(300 * index)   
                              .fadeIn(1500)
    })
}

// Función utilizada como callback que reemplaza en el DOM el precio de una criptomoneda. 
const renderizarCotizacion = criptomoneda => {
    $(`#${criptomoneda.sigla}-USD`).empty().append(`$ ${criptomoneda.cotizacion}`)
    $(`#${criptomoneda.sigla}-ARS`).empty().append(`$ ${convertirAPesos(criptomoneda.cotizacion)}`)
}

// Carga de cotizaciones en 'Cotizaciones'.
$(document).ready(() => {
    // Se cargan los elementos HTML para visualizar las cotizaciones.
    renderizarCotizaciones(criptomonedas)

    // Se obtienen vía API las cotizaciones de las criptomonedas y se reemplaza su valor en el DOM con la función de callback.
    obtenerCotizaciones(criptomonedas, renderizarCotizacion)
})
