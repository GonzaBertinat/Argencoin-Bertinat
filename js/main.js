/* Desafío Arrays
 * El proyecto consistirá en una plataforma de criptomonedas.
 * Contará con la posibilidad de ver cotizaciones en vivo, cargar transacciones, 
 * y ver el balance de activos. También el usuario podrá registrarse e iniciar sesión.
 * 
 * Para este desafío se incluyen dos métodos de ordenamiento para el array de Transacciones. 
 */

// Entidades del sistema.
class Criptomoneda {
    constructor(id, sigla, nombre, cotizacion){
        this.id = id
        this.sigla = sigla
        this.nombre = nombre
        this.cotizacion = cotizacion
    }

    nombreFormateado(){
        return `${this.sigla} - ${this.nombre}` 
    }
}

class Transaccion {
    constructor(criptomoneda, unidades, fechaCarga){
        this.criptomoneda = criptomoneda
        this.unidades = unidades
        this.fechaCarga = fechaCarga
    }

    montoEnUSD(){
        return this.criptomoneda.cotizacion * this.unidades
    }
}

/* Criptomonedas disponibles. 
 * Las cotizaciones son en USD. 
 * A futuro se obtendrán vía API, al igual que la cotización del dólar en pesos argentinos.
 */
const criptomonedas = [
    new Criptomoneda(1,'BTC','Bitcoin', 60000),
    new Criptomoneda(2,'ETH', 'Ethereum', 4000),
    new Criptomoneda(3,'ADA','Cardano', 2.15)
]

// Precio DÓLAR en Pesos Argentinos.
const COTIZACION_USD = 195

/**  Funciones utilitarias y de conversión. **/
const formatoMoneda = cantidad => cantidad.toFixed(2)
const formatoCripto = cantidad => cantidad.toFixed(8)
const convertirAPesos = dolares => formatoMoneda(dolares * COTIZACION_USD)

/** Funciones para imprimir datos en la vista **/

// Imprime en el DOM el saldo en pesos y dólares del usuario según las transacciones ingresadas.
const imprimirSaldos = transacciones => {
    
    let saldoUSD = transacciones.map(transaccion => transaccion.montoEnUSD())
                                .reduce((x,y) => x + y, 0)

    document.write(`<h3>SALDOS BILLETERA:</h3>
                    <div class="saldos">
                        <span class="pesos">Pesos (ARS): $${convertirAPesos(saldoUSD)}</span>
                        <span class="dolares">Dólares (USD): $${formatoMoneda(saldoUSD)}</span>
                    </div>`)
}

// Imprime en el DOM las transacciones ingresadas por el usuario, incluyendo la moneda cripto y el monto en USD.
const imprimirTransacciones = transacciones => {
    document.write("<h3>TRANSACCIONES:</h3>")
    if(transacciones.length === 0){
        document.write(`<h4>No se han cargado transacciones.</h4>`)
    }
    else {
        transacciones.forEach(transaccion => {
            document.write(
                `<div class="transaccion__container">
                    <span class="transaccion">
                        + ${formatoCripto(transaccion.unidades)} ${transaccion.criptomoneda.sigla} = ${formatoMoneda(transaccion.montoEnUSD())} USD
                    </span>
                </div>`)
        })
    }
}

/** Funciones que aplican lógica de negocio **/

// Menú con opciones mostrado por prompt.
let menu = 
`Por favor, ingrese una opción. 
${criptomonedas.map(c => `${c.id}. ${c.nombreFormateado()}`)
               .join("\n")}
4. Finalizar carga`

// Permite elegir una opción del menú y la retorna.
const elegirOpcion = () => prompt(menu)

// Ingresa por prompt la cantidad de unidades de la moneda en una transacción.
const ingresarMonto = criptomoneda => {
    let monto = prompt(`Ingrese el monto en ${criptomoneda.nombreFormateado()}:`)
    // Se valida que sea correcto el monto ingresado.
    while(isNaN(monto) || monto <= 0){
        monto = prompt(`El valor ingresado es incorrecto.\nPor favor, ingrese el monto en ${criptomoneda.nombreFormateado()}:`)
    }
    return parseFloat(monto)
}

// Carga de una transacción. El usuario ingresa un monto, se crea una transacción y se la guarda en un array.
const registrarTransaccion = criptomoneda => {
    let unidades = ingresarMonto(criptomoneda)
    let transaccion = new Transaccion(criptomoneda, unidades, new Date())
    transacciones.push(transaccion)
}

// Carga de todas las transacciones vía prompt. Finaliza cuando el usuario elige la opción 4.
const cargarTransacciones = () => {
    alert("Registro de transacciones en criptomonedas.")
    let opcion = elegirOpcion()
    while(opcion !== "4"){
        switch(opcion){
            case "1": case "2": case "3":
                let criptomoneda = criptomonedas.find(cripto => cripto.id === parseInt(opcion))
                registrarTransaccion(criptomoneda)
                break
            default:
                alert("ERROR: Opción no encontrada.")
                break
        }
        opcion = elegirOpcion()
    }    
}

/** DESAFÍO COMPLEMENTARIO 
 * Se agregan dos métodos de ordenamiento para las transacciones: 
 * 1. Por fecha de carga de la más reciente a la más antigua.
 * 2. Por monto en USD del mayor al menor.
 * A modo de prueba, utilizo el criterio del monto.
*/

// Compara colocando en primer lugar al monto mayor.
const compararPorMontoUSD = (tr1, tr2) => {
    if (tr1.montoEnUSD() > tr2.montoEnUSD()) return -1
    if (tr1.montoEnUSD() < tr2.montoEnUSD()) return 1
    return 0
}

// Compara colocando en primer lugar la fecha más reciente.
const compararPorFechaCarga = (tr1, tr2) => {
    if (tr1.fechaCarga.getTime() > tr2.fechaCarga.getTime()) return -1
    if (tr1.fechaCarga.getTime() < tr2.fechaCarga.getTime()) return 1
    return 0
}

// Ordena un array de transacciones según un criterio recibido por parámetro.
const ordenarTransacciones = (transacciones,criterio) => {
    return transacciones.sort(criterio)
}

// Simulo el registro de transacciones y muestro balance de activos cuando el usuario termina la carga.
let transacciones = []
cargarTransacciones()
ordenarTransacciones(transacciones,compararPorMontoUSD)
imprimirTransacciones(transacciones)
imprimirSaldos(transacciones)
