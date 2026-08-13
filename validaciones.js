/**
 * VALIDACIONES DE FORMULARIO
 */

function validarCarnet(carnet) {
    // Formato esperado: 2026-101, 2026-999, etc.
    const regex = /^\d{4}-\d{3,}$/;
    return regex.test(carnet);
}

function validarCorreo(correo) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
}

function validarTextoVacio(texto) {
    return texto && texto.trim().length > 0;
}