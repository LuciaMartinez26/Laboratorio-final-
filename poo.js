/**
 * CLASES DEL SISTEMA (POO)
 */

// Clase Base: Persona
class Persona {
    constructor(nombre, correo, fechaNacimiento) {
        this.nombre = nombre;
        this.correo = correo;
        this.fechaNacimiento = fechaNacimiento;
    }

    calcularEdad() {
        if (!this.fechaNacimiento) return 18;
        const hoy = new Date();
        const nacimiento = new Date(this.fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad > 0 ? edad : 18;
    }
}

// Clase Curso
class Curso {
    constructor(codigo, nombre, creditos, calificaciones) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.creditos = creditos;
        this.calificaciones = Number(calificaciones);
    }
}

// Clase Estudiante (Hereda de Persona)
class Estudiante extends Persona {
    constructor(nombre, correo, fechaNacimiento, carnet, carrera, cursosInscritos = []) {
        super(nombre, correo, fechaNacimiento);
        this.carnet = carnet;
        this.carrera = carrera;
        this.cursosInscritos = cursosInscritos.map(c => new Curso(c.codigo, c.nombre, c.creditos, c.calificaciones));
    }

    inscribirCurso(curso) {
        this.cursosInscritos.push(curso);
    }

    calcularPromedio() {
        if (!this.cursosInscritos || this.cursosInscritos.length === 0) return 0;
        const suma = this.cursosInscritos.reduce((acc, c) => acc + Number(c.calificaciones), 0);
        return (suma / this.cursosInscritos.length).toFixed(2);
    }
}

// Clase Administrador
class Administrador {
    constructor(listaEstudiantes = []) {
        this.listaEstudiantes = listaEstudiantes;
    }

    eliminarEstudiante(carnet) {
        const indice = this.listaEstudiantes.findIndex(e => e.carnet === carnet);
        if (indice !== -1) {
            this.listaEstudiantes.splice(indice, 1);
            return true;
        }
        return false;
    }
}