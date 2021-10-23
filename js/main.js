/* Desafío 4
 * El proyecto consistirá en una plataforma de criptomonedas.
 * Contará con la posibilidad de ver cotizaciones en vivo, cargar transacciones, 
 * y ver el balance de activos. 
 * Para este desafío simularé la carga de activos del usuario.
 */

/* Cotizaciones en USD de las principales criptomonedas.
   A futuro, se pedirán vía API */
const PRECIO_BITCOIN = 60000
const PRECIO_ETHEREUM = 3600
const PRECIO_CARDANO = 2.20

// Precio DOLAR en Pesos Argentinos
const COTIZACION_USD = 185

const formatoMoneda = cantidad => cantidad.toFixed(2)

const formatoCripto = cantidad => cantidad.toFixed(6)

const convertirAPesos = dolares => formatoMoneda(dolares * COTIZACION_USD)

const calcularSaldo = (precio, unidades) => precio * unidades

const elegirOpcion = () => prompt("Por favor, ingrese una opción.\n1. BTC - Bitcoin\n2. ETH - Ethereum\n3. ADA - Cardano\n4. Finalizar carga")

const imprimirSaldos = () => {
    if(transacciones === 0){
        document.write(`<h4>No se han cargado transacciones.</h4>`)
    }
    document.write(`<h3>SALDOS BILLETERA:</h3>
                    <div class="saldos">
                        <span class="pesos">Pesos (ARS): $${convertirAPesos(saldoUSD)}</span>
                        <span class="dolares">Dólares (USD): $${formatoMoneda(saldoUSD)}</span>
                    </div>`)
}

const ingresarMonto = moneda => {
    let monto = prompt(`Ingrese el monto en ${moneda}:`)
    while(isNaN(monto) || monto <= 0){
        monto = prompt(`El valor ingresado es incorrecto.\nPor favor, ingrese el monto en ${moneda}:`)
    }
    return parseFloat(monto)
}

const imprimirTransaccion = (moneda, unidades, valorUSD) => {
    document.write(`<div class="transaccion__container">
                         <span class="transaccion">+ ${formatoCripto(unidades)} ${moneda} = ${formatoMoneda(valorUSD)} USD</span>
                    </div>`)
    transacciones++;
}

/* DESAFIO COMPLEMENTARIO
* El registro de una transacción se compone de 3 pasos.
* 1. Ingresar el monto en unidades de la moneda elegida. 
* 2. Calcular su valor monetario en USD.
* 3. Mostrarla al usuario (imprimirla en el HTML).
*/ 
const registrarTransaccion = (moneda, precio) => {
    let monto = ingresarMonto(moneda)
    let valorUSD = calcularSaldo(precio, monto)
    imprimirTransaccion(moneda, monto, valorUSD)
    return valorUSD
}

const cargarTransacciones = () => {
    alert("Registro de transacciones en criptomonedas.")
    document.write("<h3>TRANSACCIONES:</h3>")
    let opcion = elegirOpcion()
    while(opcion !== "4"){
        switch(opcion){
            case "1":
                saldoUSD += registrarTransaccion("BTC", PRECIO_BITCOIN)
                break
            case "2":
                saldoUSD += registrarTransaccion("ETH", PRECIO_ETHEREUM)
                break
            case "3":
                saldoUSD += registrarTransaccion("ADA", PRECIO_CARDANO)
                break
            default:
                alert("ERROR: Opción no encontrada.")
                break
        }
        opcion = elegirOpcion()
    }    
}

// Simulo el registro de transacciones y muestro balance cuando el usuario termina la carga.
let saldoUSD = 0;
let transacciones = 0;

cargarTransacciones()
imprimirSaldos()
