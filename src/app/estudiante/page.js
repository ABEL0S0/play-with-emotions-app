'use client';

import { useEffect, useState } from "react";

export default function EstudianteDashboard() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [cursos, setCursos] = useState([]);
    const [codigoCurso, setCodigoCurso] = useState("");
    const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
    const [juegos, setJuegos] = useState([]);
    //const estudianteId = "b13ad2aa-17c1-4a12-bdf4-69b5525567c1"; // TODO: Reemplazar con ID real del estudiante autenticado
    const estudianteId = "907581a8-65c5-4deb-a3b5-4e68093806fb";
    // Cargar los cursos en los que está inscrito el estudiante
    useEffect(() => {
        fetch(`${API_URL}/student-courses/student/${estudianteId}`)
            .then(res => res.json())
            .then(data => {
                console.log("Cursos cargados:", data); // 📌 Debug
                setCursos(data);
            })
            .catch(error => console.error("Error al cargar cursos:", error));
    }, []);

    // Unirse a un curso por código
    const unirseACurso = async () => {
        if (!codigoCurso) return;

        try {
            const response = await fetch(`${API_URL}/student-courses/enroll/${estudianteId}/${codigoCurso}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${await response.text()}`);
            }

            const nuevoCurso = await response.json();
            setCursos([...cursos, nuevoCurso]); // Agregar el nuevo curso a la lista
            setCodigoCurso("");
        } catch (error) {
            console.error("Error al unirse al curso:", error);
        }
    };

    // Obtener juegos de un curso
    const cargarJuegosDelCurso = async (cursoId) => {
        setCursoSeleccionado(cursoId); // Almacenar curso seleccionado

        try {
            const response = await fetch(`${API_URL}/assigned-games/course/${cursoId}`);
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${await response.text()}`);
            }
            const juegosAsignados = await response.json();
            setJuegos(juegosAsignados);
        } catch (error) {
            console.error("Error al obtener juegos asignados:", error);
        }
    };

    return (
        <div>
            <h1>Dashboard del Estudiante</h1>

            {/* Unirse a un curso */}
            <div>
                <h2>Unirse a un Curso</h2>
                <input
                    type="text"
                    value={codigoCurso}
                    onChange={(e) => setCodigoCurso(e.target.value)}
                    placeholder="Código del curso"
                />
                <button onClick={unirseACurso}>Unirse</button>
            </div>

            {/* Lista de Cursos Inscritos */}
            <div>
                <h2>Mis Cursos</h2>
                {cursos.length === 0 ? (
                    <p>No estás inscrito en ningún curso.</p>
                ) : (
                    <ul>
                        {cursos.map(curso => (
                            <li key={curso.id}>
                                <button onClick={() => cargarJuegosDelCurso(curso.curso.id)}>
                                    {curso.curso.nombre} - Código: {curso.curso.codigo}
                                </button>
                                {/* Mostrar juegos si el curso está seleccionado */}
                                {cursoSeleccionado === curso.curso.id && (
                                    <ul>
                                        {juegos.length === 0 ? (
                                            <p>No hay juegos asignados.</p>
                                        ) : (
                                            juegos.map(juegosAsignado => (
                                                <li key={juegosAsignado.juego.id}>
                                                    {juegosAsignado.juego.nombre}: {juegosAsignado.juego.descripcion}
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
