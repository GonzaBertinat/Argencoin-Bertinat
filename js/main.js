/* Proyecto Final - Entrega 1
 * El proyecto consistirá en una plataforma de criptomonedas.
 * Contará con la posibilidad de ver cotizaciones en vivo, cargar transacciones, 
 * y ver el balance de activos. También el usuario podrá registrarse e iniciar sesión.
 */

// Entidades del sistema.
class Criptomoneda {
    constructor(id, sigla, nombre, cotizacion){
        this.id = id
        this.sigla = sigla
        this.nombre = nombre
        this.cotizacion = cotizacion
    }

    // Retorna el par Sigla + Nombre de la criptomoneda.
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

    // Calcula el monto en dólares de la transacción, según la cotización de la criptomoneda empleada.
    montoEnUSD(){
        return this.criptomoneda.cotizacion * this.unidades
    }
}

class Usuario {
    constructor(username, password){
        this.username = username
        this.password = password // TODO - Encriptar de alguna manera.
        this.transacciones = []
    }

    // Agrega una transacción al array
    agregarTransaccion(criptomoneda, unidades){
        this.transacciones.push(new Transaccion(criptomoneda, unidades, new Date()))
    }

    // Ordena las transacciones del usuario según un criterio recibido por parámetro.
    ordenarTransacciones(criterio) {
        this.transacciones = this.transacciones.sort(criterio)
    }

    // Imprime en el DOM las transacciones del usuario, mostrando la moneda cripto y el monto en USD de cada transacción.
    imprimirTransacciones() {
        document.write(`<h3>TRANSACCIONES del usuario ${this.username.toUpperCase()}:</h3>`)
        if(this.transacciones.length === 0){
            document.write(`<h4>No se han cargado transacciones.</h4>`)
        }
        else {
            this.transacciones.forEach(transaccion => {
                document.write(
                    `<div class="transaccion__container">
                        <span class="transaccion">
                            + ${formatoCripto(transaccion.unidades)} ${transaccion.criptomoneda.sigla} = ${formatoMoneda(transaccion.montoEnUSD())} USD
                        </span>
                    </div>`)
            })
        }
    }

    // Imprime en el DOM el saldo del usuario en pesos argentinos y en dólares según sus transacciones registradas.
    imprimirSaldos() {
        let saldoUSD = this.transacciones.map(transaccion => transaccion.montoEnUSD())
                                         .reduce((x,y) => x + y, 0)

        document.write(`<h3>SALDOS BILLETERA:</h3>
                        <div class="saldos">
                            <span class="pesos">Pesos (ARS): $${convertirAPesos(saldoUSD)}</span>
                            <span class="dolares">Dólares (USD): $${formatoMoneda(saldoUSD)}</span>
                        </div>`)
    }
}

// Array para guardar los usuarios que se registren en el sistema y luego permitir su login.
let usuarios = []

// Precio DÓLAR en Pesos Argentinos.
const COTIZACION_USD = 195

/* Criptomonedas disponibles. 
 * Las cotizaciones son en USD. 
 * A futuro se obtendrán vía API, al igual que la cotización del dólar en pesos argentinos.
 */
const criptomonedas = [
    new Criptomoneda(1,'BTC','Bitcoin', 60000),
    new Criptomoneda(2,'ETH', 'Ethereum', 4000),
    new Criptomoneda(3,'ADA','Cardano', 2.15),
    new Criptomoneda(4,'USDT','Tether', 1)
]

/***  Funciones utilitarias y de conversión. ***/
const formatoMoneda = cantidad => cantidad.toFixed(2)
const formatoCripto = cantidad => cantidad.toFixed(8)
const convertirAPesos = dolares => formatoMoneda(dolares * COTIZACION_USD)

/*** Funciones como criterio de ordenamiento de arrays. ***/

// Compara colocando en primer lugar al monto mayor.
const compararPorMontoUSD = (tr1, tr2) => {
    if (tr1.montoEnUSD() > tr2.montoEnUSD()) return -1
    if (tr1.montoEnUSD() < tr2.montoEnUSD()) return 1
    return 0
}

// Compara colocando en primer lugar a la fecha más reciente.
const compararPorFechaCarga = (tr1, tr2) => {
    if (tr1.fechaCarga.getTime() > tr2.fechaCarga.getTime()) return -1
    if (tr1.fechaCarga.getTime() < tr2.fechaCarga.getTime()) return 1
    return 0
}

/*** Funciones que aplican lógica de negocio. ***/

// Menú con opciones mostrado por prompt.
let menu = 
`Por favor, ingrese una opción. 
${criptomonedas.map(c => `${c.id}. ${c.nombreFormateado()}`)
               .join("\n")}
${criptomonedas.length + 1}. Finalizar carga`

// Permite elegir una opción del menú y la retorna.
const elegirOpcion = () => prompt(menu)

// Ingresa por prompt la cantidad de unidades de la criptomoneda en una transacción.
const ingresarMonto = criptomoneda => {
    let monto = prompt(`Ingrese el monto en ${criptomoneda.nombreFormateado()}:`)
    // Se valida que sea correcto el monto ingresado.
    while(isNaN(monto) || monto <= 0){
        monto = prompt(`El valor ingresado es incorrecto.\nPor favor, ingrese el monto en ${criptomoneda.nombreFormateado()}:`)
    }
    return parseFloat(monto)
}

// Carga de todas las transacciones de un usuario vía prompt. Finaliza cuando el usuario elige la opción 'Finalizar carga'.
const cargarTransacciones = usuario => {
    alert("Registro de transacciones en criptomonedas.")
    let opcion = elegirOpcion()
    while(opcion !== "5"){
        switch(opcion){
            case "1": case "2": case "3": case "4":
                let criptomoneda = criptomonedas.find(cripto => cripto.id === parseInt(opcion))
                let unidades = ingresarMonto(criptomoneda)
                usuario.agregarTransaccion(criptomoneda, unidades)
                break
            default:
                alert("ERROR: Opción no encontrada.")
                break
        }
        opcion = elegirOpcion()
    }    
}

// Solicita nombre de usuario y contraseña. Crea un usuario y lo registra en el array de usuarios.
const registrarUsuario = () => {
    let username = prompt("Por favor, ingresá tu nombre de usuario:")
    while(username.trim().length < 5){
        username = prompt(`ERROR: Tu nombre de usuario debe tener al menos 5 caracteres. Por favor, ingresá tu nombre de usuario:`)
    }
    let password = prompt("Ahora ingresá tu contraseña:")
    while(password.trim().length < 6){
        password = prompt(`ERROR: Tu contraseña debe tener al menos 6 caracteres. Por favor, ingresá tu contraseña:`)
    }
    usuarios.push(new Usuario(username,password));
    alert(`¡Excelente, ${username}! Te registraste con éxito en Argencoin.`)
}

/** Para esta entrega, se simula el registro de un usuario y la carga de transacciones. 
  * Finalmente se muestran sus activos en base a la carga de datos. */
alert("¡Bienvenido a Argencoin!")
registrarUsuario()
// Para esta entrega, tomo el primer usuario (único registrado) como el usuario en sesión. A futuro se guardará en el navegador luego del login.
let usuarioEnSesion = usuarios[0] 
cargarTransacciones(usuarioEnSesion)
usuarioEnSesion.ordenarTransacciones(compararPorMontoUSD)
usuarioEnSesion.imprimirTransacciones()
usuarioEnSesion.imprimirSaldos()
