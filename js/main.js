/* Desafío 3
 * Se solicita al usuario que ingrese una cantidad X números por prompt, y se calcula la sumatoria y el promedio de dichos valores. 
 * La cantidad X la elige el usuario.
 * Se valida que cada valor ingresado sea mayor a 0, de lo contrario, debe volver a ingresarlo.
 */

alert("¡Bienvenido! Se calculará la sumatoria y el promedio de los números que ingreses a continuación.")

let cantidadValores = parseInt(prompt("Por favor, indique cuantos valores quiere ingresar."))
if(cantidadValores > 0){

    let suma = 0;
    for(let i=0; i<cantidadValores; i++){

        let valor = parseInt(prompt("Por favor, ingrese un número mayor a 0."))
        // Si ingresa un valor incorrecto, deberá volver a intentarlo hasta que sí lo sea.
        while(valor <= 0){
            valor = parseInt(prompt("El número ingresado es incorrecto. Por favor, ingrese un valor mayor a 0."))
        }
        suma += valor
    }

    // Calculo el promedio con 4 decimales
    let promedio = (suma / cantidadValores).toFixed(4) 
    alert("La sumatoria de los valores ingresados es: " + suma)
    alert("El promedio de los valores ingresados es: " + promedio)
}
else {
    alert("La cantidad de valores debe ser mayor a cero. Por favor, recargue el sitio e inténtelo de nuevo.")
}
