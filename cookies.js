/**
 * MÓDULO V: PERSISTENCIA DE INFORMACIÓN (cookies.js)
 * Manejo de Cookies y SessionStorage
 */

// ==========================================
// 1. FUNCIONES PARA MANEJO DE COOKIES
// ==========================================

const CookiesManager = {
    // Crear o actualizar una cookie
    setCookie: (nombre, valor, dias = 7) => {
        const fecha = new Date();
        fecha.setTime(fecha.getTime() + (dias * 24 * 60 * 60 * 1000));
        const expires = "expires=" + fecha.toUTCString();
        document.cookie = `${nombre}=${encodeURIComponent(valor)}; ${expires}; path=/`;
    },

    // Obtener el valor de una cookie por nombre
    getCookie: (nombre) => {
        const nameEQ = nombre + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    },

    // Eliminar una cookie
    deleteCookie: (nombre) => {
        document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    },

    // Obtener todas las cookies como un Objeto
    getAllCookies: () => {
        const cookies = {};
        if (document.cookie) {
            const lista = document.cookie.split(';');
            lista.forEach(c => {
                const [clave, valor] = c.split('=');
                if (clave && valor) {
                    cookies[clave.trim()] = decodeURIComponent(valor.trim());
                }
            });
        }
        return cookies;
    },

    // Guardar datos iniciales de la sesión activa en Cookies
    registrarAccesoUsuario: (usuario, rol) => {
        const hoy = new Date().toLocaleString();
        CookiesManager.setCookie("usuarioAutenticado", usuario);
        CookiesManager.setCookie("rolUsuario", rol);
        CookiesManager.setCookie("ultimoAcceso", hoy);
        CookiesManager.setCookie("temaPreferencia", "claro"); // Preferencia por defecto
    }
};

// ==========================================
// 2. SEGUIMIENTO CON SESSIONSTORAGE
// ==========================================

const SessionTracker = {
    iniciarSeguimiento: () => {
        // Registrar tiempo de inicio si no existe
        if (!sessionStorage.getItem("inicioSesion")) {
            sessionStorage.setItem("inicioSesion", new Date().getTime());
        }

        // Contador de páginas visitadas
        let paginasVisitadas = JSON.parse(sessionStorage.getItem("paginasVisitadas") || "[]");
        const paginaActual = window.location.pathname.split('/').pop() || 'index.html';
        paginasVisitadas.push({ pagina: paginaActual, hora: new Date().toLocaleTimeString() });
        sessionStorage.setItem("paginasVisitadas", JSON.stringify(paginasVisitadas));
    },

    // Registrar acciones ejecutadas por el usuario (Módulo V)
    registrarAccion: (descripcion) => {
        let historialAcciones = JSON.parse(sessionStorage.getItem("accionesEjecutadas") || "[]");
        historialAcciones.push({ accion: descripcion, fecha: new Date().toLocaleTimeString() });
        sessionStorage.setItem("accionesEjecutadas", JSON.stringify(historialAcciones));
    },

    // Obtener tiempo total transcurrido en minutos/segundos
    obtenerTiempoPermanencia: () => {
        const inicio = sessionStorage.getItem("inicioSesion");
        if (!inicio) return "0 seg";
        const milisegundos = new Date().getTime() - Number(inicio);
        const segundos = Math.floor(milisegundos / 1000);
        const minutos = Math.floor(segundos / 60);
        return `${minutos} min ${segundos % 60} seg`;
    }
};

// Iniciar seguimiento al cargar cualquier página
document.addEventListener("DOMContentLoaded", () => {
    SessionTracker.iniciarSeguimiento();
});