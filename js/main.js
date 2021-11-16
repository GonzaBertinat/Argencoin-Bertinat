/* Script JS importado por todos los documentos HTML del sitio.
* Incluye las clases y constantes del sistema, y funciones comunes y utilitarias para todos los documentos.
* NOTA: Por ahora contempla también funciones relacionadas a registro de usuario, 
* que se delegarán a su propio .js al implementar el login.
*/

// Entidades del sistema.
class Criptomoneda {
    constructor(id, sigla, nombre, cotizacion, rutaImagen){
        this.id = id
        this.sigla = sigla
        this.nombre = nombre
        this.cotizacion = cotizacion
        this.rutaImagen = rutaImagen
    }

    // Retorna el par Sigla + Nombre de la criptomoneda.
    nombreFormateado(){
        return `${this.sigla} - ${this.nombre}` 
    }
}

class Movimiento {
    constructor(objeto){
        this.id = objeto.id
        this.criptomoneda = objeto.criptomoneda
        this.unidades = objeto.unidades
        this.operacion = objeto.operacion
        this.fechaCarga = objeto.fechaCarga
        this.username = objeto.username
    }

    // Calcula el monto en dólares de la transacción, según la cotización de la criptomoneda empleada.
    montoEnUSD(){
        return this.criptomoneda.cotizacion * this.unidades * (this.operacion === 'C' ? 1 : -1)
    }
}

class Usuario {
    constructor(objeto){
        this.username = objeto.username
        this.password = objeto.password // TODO - Encriptar de alguna manera.
    }
}

// Precio DÓLAR en Pesos Argentinos.
const COTIZACION_USD = 200

/* Criptomonedas disponibles. 
 * Las cotizaciones son en USD. 
 * A futuro se obtendrán vía API, al igual que la cotización del dólar en pesos argentinos.
 */
const criptomonedas = [
    new Criptomoneda(1, 'BTC', 'Bitcoin', 62000, 'images/criptos/btc-logo.png'),
    new Criptomoneda(2, 'ETH', 'Ethereum', 4600, 'images/criptos/eth-logo.png'),
    new Criptomoneda(3, 'BNB', 'Binance Coin', 570, 'images/criptos/bnb-logo.png'),
    new Criptomoneda(4, 'SOL', 'Solana', 242, 'images/criptos/sol-logo.png'),
    new Criptomoneda(5, 'USDT', 'Tether', 1, 'images/criptos/usdt-logo.png'),
    new Criptomoneda(6, 'ADA', 'Cardano', 2.06, 'images/criptos/ada-logo.png'),
    new Criptomoneda(7, 'DOT', 'Polkadot', 53.5, 'images/criptos/dot-logo.png'),
    new Criptomoneda(8, 'DOGE', 'Dogecoin', 0.26, 'images/criptos/doge-logo.png'),
    new Criptomoneda(9, 'DAI', 'DAI', 1.01, 'images/criptos/dai-logo.png'),
]

/***  Funciones utilitarias y de conversión. ***/
const formatoMoneda = cantidad => cantidad.toFixed(2)
const formatoCripto = cantidad => cantidad.toFixed(8)
const convertirAPesos = dolares => formatoMoneda(dolares * COTIZACION_USD)

/*** Funciones que aplican lógica de negocio. ***/

// Crea un usuario y lo guarda en el Local Storage
const registrarUsuario = usuario => {
    let usuarios = obtenerUsuariosRegistrados()
    usuarios.push(new Usuario(usuario))
    localStorage.setItem('usuarios', JSON.stringify(usuarios))
}

// Devuelve los datos de los usuarios registrados en el sitio
const obtenerUsuariosRegistrados = () => {
    return JSON.parse(localStorage.getItem('usuarios'))
}

// Devuelve los movimientos registrados por los usuarios en el sitio
const obtenerTodosLosMovimientos = () => {
    return JSON.parse(localStorage.getItem('movimientos'))
}

// Devuelve todos los movimientos registrados por un usuario en particular
const obtenerMovimientosDeUsuario = username => {
    let movimientos = obtenerTodosLosMovimientos()
    return movimientos.filter(movimiento => movimiento.username === username)
}

// Inicializa aplicación
$(document).ready(() => {
    /* Inicializo local storage
     * Al no interactuar con un backend, se simulará la 'persistencia' de los datos de usuarios y transacciones en el storage local.
     * De esta forma, en el cliente donde se abra el sitio podrá iniciar sesión, cerrarla, y recuperar los datos al ingresar en otro momento. 
     */ 
    // Array de Usuarios registrados
    if(!localStorage.getItem('usuarios')) {
        localStorage.setItem('usuarios', JSON.stringify([]))
        console.log('Array de usuarios inicializado')
    }
    // Array de transacciones cargadas
    if(!localStorage.getItem('movimientos')) {
        localStorage.setItem('movimientos', JSON.stringify([]))
        console.log('Array de movimientos inicializado')
    }
    
    /* Registro un usuario TEMPORALMENTE para esta entrega.
       A futuro se guardarán en Local Storage al momento de registrarse en un HTML dedicado al registro de usuario */
    if(!obtenerUsuariosRegistrados().find(user => user.username === 'GonzaBertinat2021')){
        registrarUsuario({
            username: 'GonzaBertinat2021',
            password: 'JavaScript'
        })
        console.log('Usuario de prueba registrado')
    }

    // Usuario en sesión. Se persistirá en Session Storage.
    if(!sessionStorage.getItem('username')) {
        sessionStorage.setItem('username', 'GonzaBertinat2021')
        console.log('Sesión iniciada')
    }
})