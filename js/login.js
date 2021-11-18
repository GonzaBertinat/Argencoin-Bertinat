// Procesa formulario de inicio de sesión. Si el login es correcto, redirige a 'Mis Activos'. Si falla muestra mensaje de error.
const iniciarSesion = () => {
    // Se obtienen los valores ingresados en el form.
    let user = $('#form-username').val()
    let pass = $('#form-password').val()

    // Se realizan validaciones de potenciales campos vacíos. Si alguno está vacío se muestra mensaje de error.
    if(!user){
        mostrarMensaje('ERROR','Debe ingresar un nombre de usuario/email')
        return    
    }
    if(!pass){
        mostrarMensaje('ERROR','Debe ingresar una contraseña')
        return    
    }

    // Se busca al usuario. Si no existe o la contraseña es incorrecta muestra mensaje de error.
    let usuario = obtenerUsuario(user)
    if(usuario && usuario.password === pass){
        // Si las credenciales son correctas, se muestra mensaje, se persiste el usuario en el session storage y se redirige a 'Mis Activos'.
        mostrarMensaje('OK','Sesión iniciada con éxito. Redireccionando...')
        sessionStorage.setItem('username', usuario.username)
        limpiarCamposLogin()
        setTimeout(() => window.location.replace("activos.html"), 2000);
    }
    else {
        mostrarMensaje('ERROR','Credenciales incorrectas. Revise sus datos e inténtelo de nuevo')
    }
}

// Limpia campos del formulario de Login.
const limpiarCamposLogin = () => {
    $('#form-username').val('')
    $('#form-password').val('')
}

// Inicializa documento asignando eventos a elementos del formulario de Login.
$(document).ready(() => {
    $('#password__icon').click(actualizarInputPassword)
    $('#login__submit').click(iniciarSesion)
})
