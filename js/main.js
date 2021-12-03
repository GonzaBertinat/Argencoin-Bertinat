/* Script JS importado por todos los documentos HTML del sitio.
 * Incluye las clases y constantes del sistema, y funciones comunes y utilitarias para todos los documentos.
 */

// Entidades del sistema.
class Moneda {
    constructor(id, sigla, nombre, rutaImagen){
        this.id = id
        this.sigla = sigla
        this.nombre = nombre
        this.rutaImagen = rutaImagen
    }

    // Retorna el par Sigla + Nombre de la moneda.
    nombreFormateado(){
        return `${this.sigla} - ${this.nombre}` 
    }
}

class Movimiento {
    constructor(objeto){
        this.id = objeto.id
        this.unidades = objeto.unidades
        this.precio = objeto.precio
        this.moneda = objeto.moneda
        this.operacion = objeto.operacion
        this.fechaCarga = objeto.fechaCarga
        this.username = objeto.username
    }

    // Calcula el monto en dólares de la transacción, según la cotización de la criptomoneda empleada.
    montoEnUSD(){
        return this.precio * this.unidades * (this.operacion === 'C' ? 1 : -1)
    }
}

class Usuario {
    constructor(objeto){
        this.username = objeto.username
        this.email = objeto.email
        this.password = objeto.password // TODO - Encriptar de alguna manera.
    }
}

// Precio DÓLAR en Pesos Argentinos.
let COTIZACION_USD

// Expresión regular para validar correos.
const mailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

// Criptomonedas disponibles.
const criptomonedas = [
    new Moneda(1, 'BTC', 'Bitcoin', 'images/criptos/btc-logo.png'),
    new Moneda(2, 'ETH', 'Ethereum', 'images/criptos/eth-logo.png'),
    new Moneda(3, 'SOL', 'Solana', 'images/criptos/sol-logo.png'),
    new Moneda(4, 'USDT', 'Tether', 'images/criptos/usdt-logo.png'),
    new Moneda(5, 'ADA', 'Cardano', 'images/criptos/ada-logo.png'),
    new Moneda(6, 'DOT', 'Polkadot', 'images/criptos/dot-logo.png'),
    new Moneda(7, 'DOGE', 'Dogecoin', 'images/criptos/doge-logo.png'),
    new Moneda(8, 'DAI', 'DAI', 'images/criptos/dai-logo.png'),
]

// Monedas fiat disponibles
const fiat = [
    new Moneda(9, 'ARS', 'Pesos', 'images/monedas/ars.png'),
    new Moneda(10, 'USD', 'Dólares', 'images/monedas/usd.png')
]

/***  Funciones utilitarias y de conversión. ***/
const formatoMoneda = cantidad => cantidad.toFixed(2)
const formatoCripto = cantidad => cantidad.toFixed(8)
const convertirAPesos = dolares => formatoMoneda(dolares * COTIZACION_USD)

/*** Funciones que aplican lógica de negocio. ***/

// Crea un usuario y lo guarda en el Local Storage.
const registrarUsuario = usuario => {
    let usuarios = obtenerUsuariosRegistrados()
    usuarios.push(new Usuario(usuario))
    localStorage.setItem('usuarios', JSON.stringify(usuarios))
}

// Valida si existe un usuario con el email o el username indicados.
const existeUsuario = (email, username) => {
    let usuarios = obtenerUsuariosRegistrados()
    if(usuarios.findIndex(u => u.email === email) >= 0)
        return true
    if(usuarios.findIndex(u => u.username === username) >= 0)
        return true
    return false
}

// Retorna un usuario registrado en el sistema. El parámetro id puede ser tanto el username como el email.
const obtenerUsuario = (id) => {
    let usuarios = obtenerUsuariosRegistrados()
    let index = usuarios.findIndex(u => u.email === id)
    if(index >= 0)
        return usuarios[index]
    index = usuarios.findIndex(u => u.username === id)
    if(index >= 0)
        return usuarios[index]
    return null
}

// Devuelve los datos de los usuarios registrados en el sitio.
const obtenerUsuariosRegistrados = () => {
    return JSON.parse(localStorage.getItem('usuarios'))
}

// Devuelve los movimientos registrados por los usuarios en el sitio.
const obtenerTodosLosMovimientos = () => {
    return JSON.parse(localStorage.getItem('movimientos'))
}

// Devuelve todos los movimientos registrados por un usuario en particular.
const obtenerMovimientosDeUsuario = username => {
    let movimientos = obtenerTodosLosMovimientos()
    return movimientos.filter(movimiento => movimiento.username === username)
}

// Calcula el total de unidades de una criptomoneda en posesión del usuario según sus movimientos.
const calcularSaldo = (criptomoneda, usuario) => {
    return obtenerMovimientosDeUsuario(usuario)
            .filter(m => m.moneda === criptomoneda.sigla)
            .map(m => new Movimiento(m))
            .map(m => m.unidades * (m.operacion === 'V' ? -1 : 1))
            .reduce((x,y) => x + y, 0)
}

// Cierra la sesión del usuario conectado y redirige a página de inicio.
const cerrarSesionActual = () => {
    sessionStorage.removeItem('username')
    sessionStorage.removeItem('monedaSaldoTotal')
    let prefix = (window.location.pathname === '/' || window.location.pathname.includes('index.html')) ? '' : '../'
    setTimeout(() => window.location.replace(`${prefix}index.html`), 500);
}

// Actualiza los enlaces y botones de la barra de navegación dependiendo si hay un usuario en sesión o no. 
const cargarNavbar = (sesionActiva) => {

    let prefix = (window.location.pathname.endsWith('/') || window.location.pathname.includes('index.html')) ? 'pages/' : ''
    if(sesionActiva){

        // Se cargan las secciones 'Cotizaciones', Mis Activos' y 'Mis Movimientos'.
        const enlacesNav = 
        `<li class="nav-item">
            <a class="nav-link" aria-current="page" href="${prefix}cotizaciones.html">Cotizaciones</a>
        </li>   
        <li class="nav-item">
            <a class="nav-link" href="${prefix}activos.html">Mis Activos</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="${prefix}movimientos.html">Mis Movimientos</a>
        </li>`

        $('#enlacesNav').empty().append(enlacesNav)
        $('#enlacesNavLateral').empty().append(enlacesNav)
        
        // Se ocultan botones 'Iniciar Sesión' y 'Registrarse'
        // Se muestra el username y un botón para cerrar sesión.
        let enlacesLogin = 
        `<li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                ${sessionStorage.getItem('username')}
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a class="cerrarSesion__button" class="dropdown-item" href="#">Cerrar sesión</a></li>
            </ul>
        </li>`
        
        $('#enlacesLogin').empty().append(enlacesLogin)
        $('#enlacesLoginLateral').empty().append(enlacesLogin)
        
        // Se asocia evento para cerrar sesión
        $('.cerrarSesion__button').click(cerrarSesionActual)
    }
    else {
        // Se muestra sólo sección 'Cotizaciones'
        const enlacesNav =
        `<li class="nav-item">
            <a class="nav-link" aria-current="page" href="${prefix}cotizaciones.html">Cotizaciones</a>
        </li>`
        $('#enlacesNav').empty().append(enlacesNav)
        $('#enlacesNavLateral').empty().append(enlacesNav)
        
        // Se muestran botones 'Iniciar Sesión' y 'Registrarse'
        const enlacesLogin =
        `<li class="nav-item">
            <button type="button" class="btn btn-success">
                <a class="encabezado__button" href="${prefix}login.html">Iniciar sesión</a>
            </button>
        </li>
        <li class="nav-item">
            <button type="button" class="btn btn-danger">
                <a class="encabezado__button" href="${prefix}registro.html">Registrarse</a>
            </button>
        </li>`

        $('#enlacesLogin').empty().append(enlacesLogin)
        $('#enlacesLoginLateral').empty().append(enlacesLogin)
   }
}

// Switch para visualizar u ocultar la contraseña en el form de Login y de Registro.
const actualizarInputPassword = () => {
    let div = $("#password__icon").parent()
    let tipoInput = $("#form-password").attr('type')
    if(tipoInput === 'password'){
        $('#form-password').attr('type','text')
        $('#password__icon').remove()
        div.append(`<img id="password__icon" src="../images/password-visible-icon.svg" alt="Contraseña visible">`)
    } else {
        $('#form-password').attr('type','password')
        $('#password__icon').remove()
        div.append(`<img id="password__icon" src="../images/password-oculto-icon.svg" alt="Contraseña oculta">`)
    }
    $("#password__icon").click(actualizarInputPassword)
}

// Muestra animación con mensaje de alerta. Se usa en validaciones de formularios de Login y Registro.
const mostrarMensaje = (tipo, mensaje) => {
    $('#mensajeAlerta').empty()
                       .append(`<span>${mensaje}</span>`)
                       .css('background-color', tipo === 'ERROR' ? 'red' : 'green')
                       .css('opacity', 1)
                       .fadeIn(1000)
                       .delay(2000)
                       .animate({
                        opacity: 0,
                      }, 2000)                       
}

// Consulta vía API de Coinbase la cotización SPOT de las criptomonedas recibidas por parámetro.
// Ejecuta una función de callback también recibida por parámetro para cada criptomoneda luego de obtener su cotización.
const obtenerCotizacionesCriptomonedas = (criptomonedas, callback) => {
    criptomonedas.forEach(c => {
        let URL = `https://api.coinbase.com/v2/prices/${c.sigla}-USD/spot`
        $.get(URL, (response, status) => {
            if(status === 'success'){
                c.cotizacion = response.data.amount
                callback(c)
            }
            else {
                // Si sucede un error se toma un valor por defecto.
                c.cotizacion = 10000
                callback(c)
            }
        })
    })
}

// Obtiene las cotizaciones en vivo del dólar estadounidense y de criptomonedas vía APIs.
const obtenerCotizaciones = (criptomonedas, callback) => {
    /* Se obtiene la cotización del Dólar estadounidense en Pesos argentinos.
    NOTA: En Argentina, al día de realizar este proyecto existen restricciones a la compra de divisas.
    Esto fomenta la creación de mercados paralelos para saltear estas restricciones, por lo que existen
    alrededor de 15 valores posibles para el par USD/ARS.
    Se toma como referencia el valor conocido como DOLAR BLUE.*/

    let URL = `https://api.bluelytics.com.ar/v2/latest`
    $.get(URL, (response, status) => {
        // En cualquier caso, luego de esta petición se obtienen las cotizaciones de las criptomonedas.
        if(status === 'success'){
            COTIZACION_USD = response.blue.value_sell
            obtenerCotizacionesCriptomonedas(criptomonedas, callback)
        }
        else {
            // Si sucede un error se toma un valor por defecto cercano a la cotizacion real.
            cotizacion = 200
            obtenerCotizacionesCriptomonedas(criptomonedas, callback)
        }
    })
}

// Inicializa aplicación.
$(document).ready(() => {
    /* Inicializo local storage.
     * Al no interactuar con un backend, se simulará la 'persistencia' de los datos de usuarios y transacciones en el storage local.
     * De esta forma, en el cliente donde se abra el sitio podrá iniciar sesión, cerrarla, y recuperar los datos al ingresar en otro momento. */ 
    
    // Array de Usuarios registrados.
    if(!localStorage.getItem('usuarios')) {
        localStorage.setItem('usuarios', JSON.stringify([]))
        console.log('Array de usuarios inicializado')
    }
    // Array de transacciones cargadas.
    if(!localStorage.getItem('movimientos')) {
        localStorage.setItem('movimientos', JSON.stringify([]))
        console.log('Array de movimientos inicializado')
    }

    // El usuario en sesión se guarda en el Session Storage. 
    // Se carga la vista en función de si existe una sesión activa.
    cargarNavbar(sessionStorage.getItem('username'))

    /* Si no existe una sesión iniciada y se quiere abrir 'Mis Activos' o 'Mis movimientos'
       se redirige a Login ya que son paginas que sólo se puede acceder con sesión activa. */ 
    const documento = window.location.pathname
    if(!sessionStorage.getItem('username') && 
       (documento.includes('activos.html') || documento.includes('movimientos.html'))){
        window.location.replace("login.html")
    }

    /* Si ya existe una sesión iniciada y se quiere abrir 'Login' o 'Registro'
       se redirige a 'Mis Activos ya que son páginas que no tiene sentido acceder estando en sesión */
    if(sessionStorage.getItem('username') && 
        (documento.includes('login.html') || documento.includes('registro.html'))){
        window.location.replace("activos.html")
    }
})