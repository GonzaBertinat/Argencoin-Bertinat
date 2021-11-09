// Imprime en el DOM el saldo del usuario en pesos argentinos y en dólares según sus transacciones registradas.
const renderizarSaldos = username => {
    // Se obtienen movimientos del usuario.
    let movimientos = obtenerMovimientosDeUsuario(username)

    // Se calcula el saldo total en Dólares.
    let saldoUSD = movimientos.map(m => new Movimiento(m))
                            .map(m => m.montoEnUSD())
                            .reduce((x,y) => x + y, 0)

    // Se agregan los saldos al DOM.
    let saldosDiv = document.getElementById("listaSaldos")
    saldosDiv.innerHTML = 
    `<span class="pesos">Pesos (ARS): $${convertirAPesos(saldoUSD)}</span>
     <span class="dolares">Dólares (USD): $${formatoMoneda(saldoUSD)}</span>`
}

// Carga de saldos en 'Mis Activos'
renderizarSaldos(sessionStorage.getItem('username'))

// TODO - Implementar muestra de saldos para cada una de las CRIPTOMONEDAS, además del total en pesos y USD.