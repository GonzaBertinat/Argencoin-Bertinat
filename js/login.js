// Guarda valores a utilizar en todos los documentos en el Session Storage correspondientes a la sesión iniciada.
const guardarDatosSesion = usuario => {
    // Se guarda el username del usuario en sesión.
    sessionStorage.setItem('username', usuario.username)
    // Se inicializa moneda elegida para ver balance total en 'Mis Activos' a Peso Argentino.
    sessionStorage.setItem('monedaSaldoTotal', 'ARS')
    // Se agignan por defecto 3 movimientos por página para la sección 'Mis Movimientos'
    sessionStorage.setItem('movimientosPorPagina', 3)
}

// Limpia campos del formulario de Login.
const limpiarCamposLogin = () => {
    $('#form-username').val('')
    $('#form-password').val('')
}

// Procesa formulario de inicio de sesión. Si el login es correcto, redirige a 'Mis Activos'. Si falla muestra mensaje de error.
const iniciarSesion = () => {
    // Se obtienen los valores ingresados en el form.
    let user = $('#form-username').val()
    let pass = $('#form-password').val()

    // Se realizan validaciones de potenciales campos vacíos. Si alguno está vacío se muestra mensaje de error.
    if(!user){
        mostrarAlerta('ERROR','Debe ingresar un nombre de usuario/email.')
        return    
    }
    if(!pass){
        mostrarAlerta('ERROR','Debe ingresar una contraseña.')
        return    
    }

    // Se busca al usuario. Si no existe o la contraseña es incorrecta muestra mensaje de error.
    let usuario = obtenerUsuario(user)
    if(usuario && usuario.password === pass){
        // Si las credenciales son correctas, se muestra mensaje, se persiste el usuario en el Session Storage y se redirige a 'Mis Activos'.
        mostrarAlerta('OK','Sesión iniciada con éxito. Redireccionando...')
        guardarDatosSesion(usuario)
        limpiarCamposLogin()
        setTimeout(() => window.location.replace("activos.html"), 2000);
    }
    else {
        mostrarAlerta('ERROR','Credenciales incorrectas. Revise sus datos e inténtelo de nuevo.')
    }
}

// Inicializa documento asignando eventos a elementos del formulario de Login.
$(document).ready(() => {
    $('#password__icon').click(actualizarInputPassword)
    $('#login__submit').click(iniciarSesion)
    $('#login__form').keypress(e => {
        // Se envía el formulario al presionar 'Enter'.
        if(e.which == 13) {
            iniciarSesion()
        }
    })
})
