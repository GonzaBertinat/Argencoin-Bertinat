/* Desafío 2
 * Se pide nombre de usuario y edad, se los valida que sean correctos.
 * Luego se analiza si el usuario es mayor de edad y se le comunica si su edad es par o impar.
 */

// Se solicita el nombre del usuario. Si no lo ingresa finaliza el programa.
let nombre = prompt("Hola! Por favor, ingresá tu nombre.");

if(nombre != ""){
    let edad = parseInt(prompt("Bienvenido " + nombre + ". Por favor, ingresá tu edad."));

    // Se valida un rango de edad realista
    if(edad <= 0 || edad > 100){
        alert("La edad ingresada es incorrecta. Debe estar entre 1 y 100. Inténtalo de nuevo.")
    }
    else{
        let esPar = (edad % 2 == 0);

        // Se analiza la edad, y según el caso, se imprime un mensaje 
        if(edad >= 18 && esPar){
            alert("Eres mayor de edad, y tu edad es par.");
        } else if (edad >= 18 && !esPar){
            alert("Eres mayor de edad, y tu edad es impar.");
        } else if (edad < 18 && esPar){
            alert("Eres menor de edad, y tu edad es par.");
        } else {
            alert("Eres menor de edad, y tu edad es impar.");
        }
    }
}
else {
    alert("No has ingresado tu nombre. Recarga el sitio e inténtalo de nuevo.");
}

