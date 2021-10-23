/* Desafío 4
 * El proyecto consistirá en una plataforma de criptomonedas.
 * Contará con la posibilidad de ver cotizaciones en vivo, cargar transacciones, 
 * y ver el balance de activos. 
 * Para este desafío simularé la carga de activos del usuario.
 */

/* Cotizaciones en USD de las principales criptomonedas.
   A futuro, se pedirán vía API */
const BITCOIN = 60000
const ETHEREUM = 3600
const CARDANO = 2.20

// Precio DOLAR en Pesos Argentinos
const COTIZACION_USD = 185

const convertirAPesos = (dolares) => (dolares * COTIZACION_USD).toFixed(2)

const calcularSaldo = (precio, unidades) => precio * unidades

const elegirOpcion = () => prompt("Por favor, ingrese una opción.\n1. BTC - Bitcoin\n2. ETH - Ethereum\n3. ADA - Cardano\n4. Finalizar carga")

const imprimirSaldos = () => {
    if(transacciones === 0){
        document.write(`<h4>No se han cargado transacciones.</h4>`)
    }
    document.write(`<h3>SALDOS BILLETERA:</h3>
                    <div class="saldos">
                        <span class="pesos">Pesos (ARS): $${convertirAPesos(saldoUSD)}</span>
                        <span class="dolares">Dólares (USD): $${saldoUSD.toFixed(2)}</span>
                    </div>`)
}

const registrarTransaccion = (moneda, precio) => {
    let unidades = prompt(`Ingrese el monto en ${moneda}:`)
    while(isNaN(unidades) || unidades <= 0){
        unidades = prompt(`El valor ingresado es incorrecto.\nPor favor, ingrese el monto en ${moneda}:`)
    }
    document.write(`<div class="transaccion__container">
                         <span class="transaccion">+ ${parseFloat(unidades).toFixed(6)} ${moneda}</span>
                    </div>`)
    transacciones++;
    return calcularSaldo(precio,unidades)
}

const cargarTransacciones = () => {
    alert("Registro de transacciones en criptomonedas.")
    document.write("<h3>TRANSACCIONES:</h3>")
    let opcion = elegirOpcion()
    while(opcion !== "4"){
        switch(opcion){
            case "1":
                saldoUSD += registrarTransaccion("BTC", BITCOIN)
                break
            case "2":
                saldoUSD += registrarTransaccion("ETH", ETHEREUM)
                break
            case "3":
                saldoUSD += registrarTransaccion("ADA", CARDANO)
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
