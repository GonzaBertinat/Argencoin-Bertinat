/* Desafío Objetos
 * El proyecto consistirá en una plataforma de criptomonedas.
 * Contará con la posibilidad de ver cotizaciones en vivo, cargar transacciones, 
 * y ver el balance de activos. También el usuario podrá registrarse e iniciar sesión.
 * 
 * Para este desafío incluyo la entidad Transaccion, la entidad Criptomoneda, las relaciono entre ellas
 * y adapto la funcionalidad existente de carga de transacciones y vista de balances a estas clases. 
 */

// Entidades del sistema.
class Criptomoneda {
    constructor(sigla, nombre, cotizacion){
        this.sigla = sigla
        this.nombre = nombre
        this.cotizacion = cotizacion
    }

    nombreFormateado(){
        return `${this.sigla} - ${this.nombre}` 
    }
}

class Transaccion {
    constructor(criptomoneda, unidades){
        this.criptomoneda = criptomoneda
        this.unidades = unidades
    }

    montoEnUSD(){
        return this.criptomoneda.cotizacion * this.unidades
    }
}

/* Criptomonedas disponibles. 
 * Las cotizaciones son en USD. 
 * A futuro se obtendrán vía API, al igual que la cotización del dólar en pesos argentinos.
 */
const bitcoin = new Criptomoneda('BTC','Bitcoin', 63000)
const ethereum = new Criptomoneda('ETH', 'Ethereum', 3800)
const cardano = new Criptomoneda('ADA','Cardano', 2.10)
   
// Precio DÓLAR en Pesos Argentinos.
const COTIZACION_USD = 185

/**  Funciones utilitarias y de conversión. */
const formatoMoneda = cantidad => cantidad.toFixed(2)
const formatoCripto = cantidad => cantidad.toFixed(8)
const convertirAPesos = dolares => formatoMoneda(dolares * COTIZACION_USD)

// Menú con opciones mostrado por prompt.
let menu = 
`Por favor, ingrese una opción.
1. ${bitcoin.nombreFormateado()}
2. ${ethereum.nombreFormateado()}
3. ${cardano.nombreFormateado()}
4. Finalizar carga`

/** Funciones que aplican lógica de negocio */

// Permite elegir una opción del menú y la retorna.
const elegirOpcion = () => prompt(menu)

// Imprime en el DOM el saldo en pesos y dólares del usuario según las transacciones ingresadas.
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

// Ingresa por prompt la cantidad de unidades de la moneda en una transacción.
const ingresarMonto = criptomoneda => {
    let monto = prompt(`Ingrese el monto en ${criptomoneda.nombreFormateado()}:`)
    // Se valida que sea correcto el monto ingresado.
    while(isNaN(monto) || monto <= 0){
        monto = prompt(`El valor ingresado es incorrecto.\nPor favor, ingrese el monto en ${criptomoneda.nombreFormateado()}:`)
    }
    return parseFloat(monto)
}

// Imprime en el DOM una transacción ingresada por el usuario, incluyendo la moneda y el monto en USD.
const imprimirTransaccion = (transaccion) => {
    document.write(
        `<div class="transaccion__container">
            <span class="transaccion">
                + ${formatoCripto(transaccion.unidades)} ${transaccion.criptomoneda.sigla} = ${formatoMoneda(transaccion.montoEnUSD())} USD
            </span>
        </div>`)
    transacciones++;
}

// Carga de una transacción. El usuario ingresa un monto, se crea una transacción, se la imprime y se retorna su monto en USD.
const registrarTransaccion = (criptomoneda) => {
    let unidades = ingresarMonto(criptomoneda)
    let transaccion = new Transaccion(criptomoneda, unidades)
    imprimirTransaccion(transaccion)
    return transaccion.montoEnUSD()
}

// Carga de todas las transacciones vía prompt. Finaliza cuando el usuario elige la opción 4.
const cargarTransacciones = () => {
    alert("Registro de transacciones en criptomonedas.")
    document.write("<h3>TRANSACCIONES:</h3>")
    let opcion = elegirOpcion()
    while(opcion !== "4"){
        switch(opcion){
            case "1":
                saldoUSD += registrarTransaccion(bitcoin)
                break
            case "2":
                saldoUSD += registrarTransaccion(ethereum)
                break
            case "3":
                saldoUSD += registrarTransaccion(cardano)
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
