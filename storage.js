/**
 * MANEJO DE LOCALSTORAGE Y JSON
 */

const CLAVE_LOCALSTORAGE = 'utdd_estudiantes_data';

// Guarda la lista de estudiantes en el navegador
function guardarEstudiantesLocal(listaEstudiantes) {
    localStorage.setItem(CLAVE_LOCALSTORAGE, JSON.stringify(listaEstudiantes));
}

// Carga los estudiantes del LocalStorage
function cargarEstudiantesLocal() {
    const datos = localStorage.getItem(CLAVE_LOCALSTORAGE);
    if (!datos) return null;
    try {
        return JSON.parse(datos);
    } catch (e) {
        console.error("Error al parsear LocalStorage:", e);
        return null;
    }
}