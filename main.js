/* Desafío 1
 * Se ingresa un nombre, y luego dos números para realizar operaciones básicas
 */

// Ingreso de valores
let nombre = prompt("¡Hola! ¿Cómo te llamás?");
alert("¡Bienvenido " + nombre + "! Vamos a hacer algunos cálculos...");
let numero1 = parseInt(prompt("Por favor, ingresá un número entero."));
let numero2 = parseInt(prompt("Por favor, ingresá otro número entero."));
console.log("Valores ingresados: " + numero1 + " y " + numero2);

// Guardo el resultado de los cálculos en variables
let suma = numero1 + numero2;
let resta = numero1 - numero2;
let producto = numero1 * numero2;

// Muestro los resultados al usuario
alert("La suma de los valores ingresados es " + suma);
alert("La resta entre los valores ingresados es " + resta);
alert("El producto de los valores ingresados es " + producto);