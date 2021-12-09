// Expresión regular para validar correos.
const mailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

// Crea un usuario y lo guarda en el Local Storage.
const registrarUsuario = usuario => {
    let usuarios = obtenerUsuariosRegistrados()
    usuarios.push(new Usuario(usuario))
    localStorage.setItem('usuarios', JSON.stringify(usuarios))
}

// Limpia campos del formulario de Registro.
const limpiarCamposRegistro = () => {
    $('#form-email').val('')
    $('#form-username').val('')
    $('#form-password').val('')
}

/* Procesa formulario de registro. 
Si el username y el email ingresados están libres, se crea al usuario y se lo persiste en Local Storage.
En caso contrario se muestra mensaje de error. */
const procesarRegistro = () => {
    
    // Se obtienen los valores ingresados en el form.
    let mail = $('#form-email').val()
    let user = $('#form-username').val()
    let pass = $('#form-password').val()

    // Se realizan validaciones de campos vacíos y además para el email se utiliza una expresión regular.
    if(!mail){
        mostrarAlerta('ERROR','Debe ingresar un mail.')
        return    
    }
    if (!mailRegex.test((mail).toLowerCase())){
        mostrarAlerta('ERROR','El formato del mail ingresado es incorrecto.')
        return
    }
    if(!user){
        mostrarAlerta('ERROR','Debe ingresar un nombre de usuario.')
        return    
    }
    if(!pass){
        mostrarAlerta('ERROR','Debe ingresar una contraseña.')
        return    
    }
    if(user.length > 15){
        mostrarAlerta('ERROR','El nombre de usuario no puede superar los 15 caracteres.')
        return
    }
    if(pass.length < 6){
        mostrarAlerta('ERROR','La contraseña debe tener al menos 6 caracteres.')
        return
    }

    // Se valida existencia del usuario. Si no existe, se crea al usuario y se lo persiste en el Local Storage.
    if(!existeUsuario(mail,user)){
        registrarUsuario({
            email: mail,
            username: user,
            password: pass 
        })
        mostrarAlerta('OK','Registrado con éxito. Por favor, iniciá sesión para continuar.')
        limpiarCamposRegistro()
    } else {
        mostrarAlerta('ERROR','El email o el nombre de usuario ya se encuentran asociados a una cuenta.')
    }
}

// Inicializa documento asignando eventos a elementos del formulario de Registro.
$(document).ready(() => {
    $('#password__icon').click(actualizarInputPassword)
    $('#registro__submit').click(procesarRegistro)
    $('#registro__form').keypress(e => {
        // Se envía el formulario al presionar 'Enter'.
        if(e.which == 13) {
            procesarRegistro()
        }
    })
})