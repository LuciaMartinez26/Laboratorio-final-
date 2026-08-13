/**
 * APLICACIÓN PRINCIPAL (APP.JS)
 */

let admin;

// Datos Iniciales (Docentes)
const DOCENTES_SISTEMA = [
    { id: "DOC-101", nombre: "Ing. Carlos Mendoza", materia: "Programación Orientada a Objetos" },
    { id: "DOC-102", nombre: "Licda. Sofía Ramírez", materia: "Contabilidad General" },
    { id: "DOC-103", nombre: "Arq. David Morales", materia: "Diseño Vectorial" }
];

// Generador de 30 Estudiantes Base
function generar30EstudiantesBase() {
    const nombres = [
        "Mariana Fuentes", "Adrián Castañeda", "Natalia Saravia", "Benjamín Orellana", "Isabela del Valle",
        "Thiago Mendizábal", "Regina Samayoa", "Emilio Zaid", "Camila Batres", "Mateo Archila",
        "Valeria Coronado", "Lucas Godoy", "Lucía Paredes", "Gabriel Asturias", "Elena Najera",
        "Daniel Estrada", "Ximena Rivas", "Diego Palacios", "Sofia Girón", "Alejandro Melgar",
        "Fernanda Rosales", "Sebastián Pinto", "Andrea Villagrán", "Rodrigo Solares", "Paula Cabrera",
        "Javier Montiel", "Daniela Franco", "Esteban Quiñónez", "Claudia Lemus", "Santi Morales"
    ];

    const carreras = [
        "Bachillerato en Computación",
        "Perito Contador",
        "Ingeniería en Desarrollo de Software",
        "Diseño Gráfico Digital",
        "Administración de Empresas"
    ];

    const cursosMuestra = [
        [new Curso("CC101", "Programación Orientada a Objetos", 4, 90), new Curso("CC102", "Bases de Datos", 4, 85)],
        [new Curso("CONT101", "Contabilidad General", 3, 78), new Curso("FIN102", "Finanzas II", 4, 82)],
        [new Curso("SOFT101", "Ingeniería de Software", 5, 95), new Curso("SOFT102", "Arquitectura Web", 4, 88)],
        [new Curso("DIS101", "Diseño Vectorial", 3, 91), new Curso("DIS102", "Fotografía Digital", 3, 89)],
        [new Curso("ADM101", "Administración I", 4, 75), new Curso("ADM102", "Mercadotecnia", 3, 80)]
    ];

    const lista = [];

    nombres.forEach((nombre, idx) => {
        const carnet = `2026-${101 + idx}`;
        const correo = `${nombre.toLowerCase().replace(/\s+/g, ".")}@utdd.edu`;
        const fechaNac = "2005-05-15";
        const carrera = carreras[idx % carreras.length];
        const cursos = cursosMuestra[idx % cursosMuestra.length];

        const est = new Estudiante(nombre, correo, fechaNac, carnet, carrera, cursos);
        lista.push(est);
    });

    return lista;
}

// Inicialización del Sistema
document.addEventListener('DOMContentLoaded', () => {
    let datosCargados = cargarEstudiantesLocal();

    if (!datosCargados || datosCargados.length === 0) {
        const estudiantesBase = generar30EstudiantesBase();
        admin = new Administrador(estudiantesBase);
        guardarEstudiantesLocal(admin.listaEstudiantes);
    } else {
        const listaInstanciada = datosCargados.map(e => new Estudiante(e.nombre, e.correo, e.fechaNacimiento, e.carnet, e.carrera, e.cursosInscritos));
        admin = new Administrador(listaInstanciada);
    }

    renderizarSegunPagina();
});

function renderizarSegunPagina() {
    // Si estamos en estudiantes.html
    if (document.getElementById('tabla-estudiantes-body')) {
        renderizarTablaEstudiantes();
        poblarSelectEstudiantes();
        configurarFormularios();
    }

    // Si estamos en dashboard.html
    if (document.getElementById('tabla-dashboard-body')) {
        renderizarTablaDashboard();
        if (typeof actualizarMetricasDashboard === 'function') {
            actualizarMetricasDashboard(admin.listaEstudiantes);
        }
    }
}

// Renderizar Tabla Principal de Estudiantes
function renderizarTablaEstudiantes() {
    const tbody = document.getElementById('tabla-estudiantes-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    admin.listaEstudiantes.forEach(est => {
        const tr = document.createElement('tr');
        const promedio = est.calcularPromedio();

        tr.innerHTML = `
            <td><strong>${est.carnet}</strong></td>
            <td>${est.nombre}</td>
            <td>${est.calcularEdad()} años</td>
            <td>${est.carrera}</td>
            <td>${est.cursosInscritos ? est.cursosInscritos.length : 0} curso(s)</td>
            <td><strong>${promedio}</strong></td>
            <td>
                <button class="btn btn-secondary" style="padding: 6px 10px; font-size: 0.8rem;" onclick="mostrarFichaCompleta('${est.carnet}')">Detalle</button>
                <button class="btn btn-primary" style="padding: 6px 10px; font-size: 0.8rem; background-color: #a5b4fc;" onclick="prepararEdicion('${est.carnet}')">Editar</button>
                <button class="btn btn-danger" style="padding: 6px 10px; font-size: 0.8rem;" onclick="eliminarAlumno('${est.carnet}')">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Renderizar Tabla del Dashboard
function renderizarTablaDashboard() {
    const tbody = document.getElementById('tabla-dashboard-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    admin.listaEstudiantes.forEach(est => {
        const tr = document.createElement('tr');
        const prom = Number(est.calcularPromedio());
        const estadoBadge = prom >= 60 
            ? `<span class="badge badge-success">Aprobado</span>`
            : `<span class="badge badge-danger">Reprobado</span>`;

        tr.innerHTML = `
            <td><strong>${est.carnet}</strong></td>
            <td>${est.nombre}</td>
            <td>${est.carrera}</td>
            <td><strong>${prom.toFixed(2)}</strong></td>
            <td>${estadoBadge}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Poblar el Select de los formularios
function poblarSelectEstudiantes() {
    const select = document.getElementById('select-estudiante');
    if (!select) return;

    select.innerHTML = '<option value="">-- Cargar Alumno --</option>';
    admin.listaEstudiantes.forEach(est => {
        const opt = document.createElement('option');
        opt.value = est.carnet;
        opt.textContent = `${est.carnet} - ${est.nombre}`;
        select.appendChild(opt);
    });
}

// MUESTRA LA FICHA COMPLETA (TABLA EXTRA CON CURSOS Y DOCENTES)
function mostrarFichaCompleta(carnet) {
    const est = admin.listaEstudiantes.find(e => e.carnet === carnet);
    const panel = document.getElementById('panel-detalle-estudiante');
    if (!est || !panel) return;

    let cursosHTML = '';
    if (est.cursosInscritos && est.cursosInscritos.length > 0) {
        cursosHTML = `
            <table class="data-table" style="margin-top: 10px;">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Asignatura</th>
                        <th>Créditos</th>
                        <th>Nota</th>
                    </tr>
                </thead>
                <tbody>
                    ${est.cursosInscritos.map(c => `
                        <tr>
                            <td>${c.codigo}</td>
                            <td>${c.nombre}</td>
                            <td>${c.creditos}</td>
                            <td><strong>${c.calificaciones} pts</strong></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } else {
        cursosHTML = '<p style="color: #94a3b8; margin-top: 10px;">Sin cursos registrados aún.</p>';
    }

    panel.innerHTML = `
        <div class="card" style="margin-top: 25px; border-left: 4px solid #7b9acc;">
            <h3>🔎 Ficha Académica Completa: ${est.nombre} (${est.carnet})</h3>
            <p><strong>Correo:</strong> ${est.correo} | <strong>Carrera:</strong> ${est.carrera} | <strong>Edad:</strong> ${est.calcularEdad()} años</p>
            <h4 style="margin-top: 15px; color: #334155;">Cursos Asignados:</h4>
            ${cursosHTML}
            <div style="margin-top: 15px; text-align: right;">
                <button class="btn btn-secondary" onclick="cerrarFicha()">Cerrar Ficha</button>
            </div>
        </div>
    `;
    panel.scrollIntoView({ behavior: 'smooth' });
}

function cerrarFicha() {
    const panel = document.getElementById('panel-detalle-estudiante');
    if (panel) panel.innerHTML = '';
}

// PREPARAR EDICIÓN DE UN ESTUDIANTE
function prepararEdicion(carnet) {
    const est = admin.listaEstudiantes.find(e => e.carnet === carnet);
    const panelEdit = document.getElementById('panel-editar-estudiante');
    if (!est || !panelEdit) return;

    const usuarioCorreo = est.correo.split('@')[0];

    panelEdit.innerHTML = `
        <div class="card" style="margin-bottom: 25px; border-left: 4px solid #a5b4fc; background-color: #faf5ff;">
            <h3>✏️ Editar Estudiante: ${est.carnet}</h3>
            <form id="form-editar-estudiante" style="margin-top: 15px;">
                <input type="hidden" id="edit-carnet" value="${est.carnet}">
                
                <div class="form-group">
                    <label for="edit-nombre">Nombre Completo:</label>
                    <input type="text" id="edit-nombre" class="form-control" value="${est.nombre}" required>
                </div>
                
                <div class="form-group">
                    <label for="edit-correo-user">Correo Electrónico Institucional:</label>
                    <div style="display: flex; align-items: center;">
                        <input type="text" id="edit-correo-user" class="form-control" value="${usuarioCorreo}" style="border-top-right-radius: 0; border-bottom-right-radius: 0;" required>
                        <span style="background-color: #e2e8f0; padding: 10px 14px; border: 1px solid #e2e8f0; border-left: none; border-top-right-radius: 10px; border-bottom-right-radius: 10px; color: #64748b; font-size: 0.9rem; font-weight: 600; white-space: nowrap;">
                            @utdd.edu
                        </span>
                    </div>
                </div>

                <div class="form-group">
                    <label for="edit-fecha">Fecha de Nacimiento:</label>
                    <input type="date" id="edit-fecha" class="form-control" value="${est.fechaNacimiento || ''}" required>
                </div>

                <div class="form-group">
                    <label for="edit-carrera">Carrera / Programa:</label>
                    <select id="edit-carrera" class="form-control" required>
                        <option value="Bachillerato en Computación" ${est.carrera === 'Bachillerato en Computación' ? 'selected' : ''}>Bachillerato en Computación</option>
                        <option value="Perito Contador" ${est.carrera === 'Perito Contador' ? 'selected' : ''}>Perito Contador</option>
                        <option value="Ingeniería en Desarrollo de Software" ${est.carrera === 'Ingeniería en Desarrollo de Software' ? 'selected' : ''}>Ingeniería en Desarrollo de Software</option>
                        <option value="Diseño Gráfico Digital" ${est.carrera === 'Diseño Gráfico Digital' ? 'selected' : ''}>Diseño Gráfico Digital</option>
                        <option value="Administración de Empresas" ${est.carrera === 'Administración de Empresas' ? 'selected' : ''}>Administración de Empresas</option>
                    </select>
                </div>

                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button type="button" class="btn btn-secondary" onclick="cerrarEdicion()">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                </div>
            </form>
        </div>
    `;

    panelEdit.scrollIntoView({ behavior: 'smooth' });

    // Escuchar el submit de edición
    document.getElementById('form-editar-estudiante').onsubmit = (e) => {
        e.preventDefault();
        const carnetEdit = document.getElementById('edit-carnet').value;
        const estudianteEncontrado = admin.listaEstudiantes.find(e => e.carnet === carnetEdit);

        if (estudianteEncontrado) {
            estudianteEncontrado.nombre = document.getElementById('edit-nombre').value.trim();
            const usuario = document.getElementById('edit-correo-user').value.trim();
            estudianteEncontrado.correo = `${usuario}@utdd.edu`;
            estudianteEncontrado.fechaNacimiento = document.getElementById('edit-fecha').value;
            estudianteEncontrado.carrera = document.getElementById('edit-carrera').value;

            guardarEstudiantesLocal(admin.listaEstudiantes);
            cerrarEdicion();
            renderizarSegunPagina();
            alert('¡Datos del estudiante actualizados con éxito!');
        }
    };
}

function cerrarEdicion() {
    const panelEdit = document.getElementById('panel-editar-estudiante');
    if (panelEdit) panelEdit.innerHTML = '';
}

// Eliminar Alumno
function eliminarAlumno(carnet) {
    if (confirm(`¿Está seguro de eliminar al estudiante ${carnet}?`)) {
        admin.eliminarEstudiante(carnet);
        guardarEstudiantesLocal(admin.listaEstudiantes);
        renderizarSegunPagina();
    }
}

// Formularios principales
function configurarFormularios() {
    const formEst = document.getElementById('form-estudiante');
    if (formEst) {
        formEst.onsubmit = (e) => {
            e.preventDefault();
            const carnet = document.getElementById('est-carnet').value.trim();
            const nombre = document.getElementById('est-nombre').value.trim();
            
            const usuarioCorreo = document.getElementById('est-correo-user').value.trim();
            const correo = `${usuarioCorreo}@utdd.edu`;

            const fecha = document.getElementById('est-fecha').value;
            const carrera = document.getElementById('est-carrera').value;

            const nuevoEst = new Estudiante(nombre, correo, fecha, carnet, carrera, []);
            admin.listaEstudiantes.unshift(nuevoEst);
            guardarEstudiantesLocal(admin.listaEstudiantes);
            
            formEst.reset();
            renderizarSegunPagina();
            alert('¡Estudiante registrado con éxito!');
        };
    }

    const formCur = document.getElementById('form-curso');
    if (formCur) {
        formCur.onsubmit = (e) => {
            e.preventDefault();
            const carnetSelect = document.getElementById('select-estudiante').value;
            const codigo = document.getElementById('curso-codigo').value.trim();
            const nombre = document.getElementById('curso-nombre').value.trim();
            const creditos = document.getElementById('curso-creditos').value;
            const nota = document.getElementById('curso-nota').value;

            const est = admin.listaEstudiantes.find(e => e.carnet === carnetSelect);
            if (est) {
                const nuevoCurso = new Curso(codigo, nombre, creditos, nota);
                est.inscribirCurso(nuevoCurso);
                guardarEstudiantesLocal(admin.listaEstudiantes);
                
                formCur.reset();
                renderizarSegunPagina();
                alert('¡Curso asignado correctamente!');
            }
        };
    }
}