// Imprime en el DOM las cotizaciones de las diferentes criptomonedas del sitio
const renderizarCotizaciones = criptomonedas => {

    // Para cada criptomoneda generamos su HTML correspondiente
    criptomonedas.forEach(c => {
            
        // Se crean elementos con datos de la criptomoneda.
        let moneda = document.createElement('span')
        moneda.classList.add('cotizacion__moneda')
        moneda.innerHTML = `${c.nombreFormateado()}`

        let logo = document.createElement('img')
        logo.classList.add('cotizacion__logo')
        logo.src = `../images/criptos/${c.sigla.toLowerCase()}-logo.png`
        
        let precio = document.createElement('span')
        precio.classList.add('cotizacion__precio')
        precio.innerHTML = `USD $${c.cotizacion}`

        // Se crea div contenedor de los datos.
        let cotizacionDiv = document.createElement('div')
        cotizacionDiv.classList.add('cotizacion')
        cotizacionDiv.appendChild(moneda)
        cotizacionDiv.appendChild(logo)
        cotizacionDiv.appendChild(precio)

        // Se crea contenedor con clases Bootstrap.
        let col = document.createElement('div')
        col.classList.add('col-6', 'col-md-3')
        col.appendChild(cotizacionDiv)
        
        // Se agrega cotización al DOM.
        let cotizaciones = document.getElementById('listaCotizaciones')
        cotizaciones.appendChild(col)
    });
}

// Carga de cotizaciones en 'Cotizaciones'
renderizarCotizaciones(criptomonedas)
