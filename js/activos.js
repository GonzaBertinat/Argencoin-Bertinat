// Imprime en el DOM el saldo del usuario en pesos argentinos y en dólares según sus transacciones registradas.
const renderizarSaldos = username => {
    // Se obtienen movimientos del usuario.
    let movimientos = obtenerMovimientosDeUsuario(username)

    // Se calcula el saldo total en Dólares.
    let saldoUSD = movimientos.map(m => new Movimiento(m))
                            .map(m => m.montoEnUSD())
                            .reduce((x,y) => x + y, 0)

    // Se crean nodos para saldo en pesos y en dólares.
    let pesos = document.createElement("span")
    pesos.className = "pesos"
    pesos.innerHTML = `Pesos (ARS): $${convertirAPesos(saldoUSD)}`
    let dolares = document.createElement("span")
    dolares.className = "dolares"
    dolares.innerHTML = `Dólares (USD): $${formatoMoneda(saldoUSD)}`

    // Se agregan los elementos al DOM.
    let saldosDiv = document.getElementById("listaSaldos")
    saldosDiv.appendChild(pesos)
    saldosDiv.appendChild(dolares)
}

// Carga de saldos en 'Mis Activos'
renderizarSaldos(sessionStorage.getItem('username'))

// TODO - Implementar muestra de saldos para cada una de las CRIPTOMONEDAS, además del total en pesos y USD.