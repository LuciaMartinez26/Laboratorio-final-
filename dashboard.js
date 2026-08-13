/**
 * LÓGICA EXCLUSIVA DEL DASHBOARD
 */

function actualizarMetricasDashboard(listaEstudiantes) {
    const totalEstudiantesEl = document.getElementById('total-estudiantes');
    const cursosActivosEl = document.getElementById('cursos-activos');
    const promedioGeneralEl = document.getElementById('promedio-general');
    const totalAprobadosEl = document.getElementById('total-aprobados');
    const totalReprobadosEl = document.getElementById('total-reprobados');

    if (!listaEstudiantes || listaEstudiantes.length === 0) return;

    let totalCursos = 0;
    let sumaPromedios = 0;
    let aprobados = 0;
    let reprobados = 0;

    listaEstudiantes.forEach(est => {
        const prom = Number(est.calcularPromedio());
        sumaPromedios += prom;
        if (est.cursosInscritos) totalCursos += est.cursosInscritos.length;

        if (prom >= 60) {
            aprobados++;
        } else {
            reprobados++;
        }
    });

    if (totalEstudiantesEl) totalEstudiantesEl.textContent = listaEstudiantes.length;
    if (cursosActivosEl) cursosActivosEl.textContent = totalCursos;
    if (promedioGeneralEl) promedioGeneralEl.textContent = (sumaPromedios / listaEstudiantes.length).toFixed(2);
    if (totalAprobadosEl) totalAprobadosEl.textContent = aprobados;
    if (totalReprobadosEl) totalReprobadosEl.textContent = reprobados;
}