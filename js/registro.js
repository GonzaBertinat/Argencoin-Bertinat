/* Procesa formulario de registro. 
   Si el username y el email ingresados están libres, se crea al usuario y se lo persiste en Local Storage.
   En caso contrario se muestra mensaje de error.
*/
const procesarRegistro = () => {
    
    // Se obtienen los valores ingresados en el form.
    let mail = $('#form-email').val()
    let user = $('#form-username').val()
    let pass = $('#form-password').val()

    // Se realizan validaciones de campos vacíos y además para el email se utiliza una expresión regular.
    if(!mail){
        mostrarMensaje('ERROR','Debe ingresar un mail')
        return    
    }
    if (!mailRegex.test((mail).toLowerCase())){
        mostrarMensaje('ERROR','El formato del mail ingresado es incorrecto')
        return
    }
    if(!user){
        mostrarMensaje('ERROR','Debe ingresar un nombre de usuario')
        return    
    }
    if(!pass){
        mostrarMensaje('ERROR','Debe ingresar una contraseña')
        return    
    }

    // Se valida existencia del usuario. Si no existe, se crea al usuario y se lo persiste en el Local Storage.
    if(!existeUsuario(mail,user)){
        registrarUsuario({
            email: mail,
            username: user,
            password: pass 
        })
        mostrarMensaje('OK','Registrado con éxito. Por favor, iniciá sesión para continuar.')
        limpiarCamposRegistro()
    } else {
        mostrarMensaje('ERROR','El email o el nombre de usuario ya se encuentran asociados a una cuenta.')
    }
}

// Limpia campos del formulario de Registro.
const limpiarCamposRegistro = () => {
    $('#form-email').val('')
    $('#form-username').val('')
    $('#form-password').val('')
}

// Inicializa documento asignando eventos a elementos del formulario de Registro
$(document).ready(() => {
    $('#password__icon').click(actualizarInputPassword)
    $('#registro__submit').click(procesarRegistro)
})