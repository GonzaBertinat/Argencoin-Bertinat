// Imprime en el DOM las cotizaciones de las diferentes criptomonedas del sitio
const renderizarCotizaciones = criptomonedas => {

    // Para cada criptomoneda generamos su HTML correspondiente
    criptomonedas.forEach(c => {
        // Se crea contenedor con clases Bootstrap.
        let col = document.createElement('div')
        col.classList.add('col-6', 'col-md-3')

        // Agrego contenido dentro del contenedor
        col.innerHTML =
        `<div class="cotizacion">
            <span class="cotizacion__moneda">${c.nombreFormateado()}</span>
            <img class="cotizacion__logo" src="${c.rutaImagen}">
            <span class="cotizacion__precio">USD $${c.cotizacion}</span>
        </div>`

        // Se agrega cotización al DOM.
        let cotizaciones = document.getElementById('listaCotizaciones')
        cotizaciones.appendChild(col)
    })
}

// Carga de cotizaciones en 'Cotizaciones'
renderizarCotizaciones(criptomonedas)
