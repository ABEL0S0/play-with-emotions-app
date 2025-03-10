'use client';

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';

export default function EstudianteDashboard() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [cursos, setCursos] = useState([]);
    const [codigoCurso, setCodigoCurso] = useState("");
    const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
    const [juegos, setJuegos] = useState([]);
    const [juegoSeleccionado, setJuegoSeleccionado] = useState(null);
    
    const estudianteId = "907581a8-65c5-4deb-a3b5-4e68093806fb";

    useEffect(() => {
        fetch(`${API_URL}/student-courses/student/${estudianteId}`)
            .then(res => res.json())
            .then(data => {
                console.log("Cursos cargados:", data);
                setCursos(data);
            })
            .catch(error => console.error("Error al cargar cursos:", error));
    }, []);

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
            setCursos([...cursos, nuevoCurso]);
            setCodigoCurso("");
        } catch (error) {
            console.error("Error al unirse al curso:", error);
        }
    };

    const cargarJuegosDelCurso = async (cursoId) => {
        setCursoSeleccionado(cursoId);
        setJuegoSeleccionado(null); // Resetear juego seleccionado al cambiar de curso

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

    const cargarJuego = (juegoId) => {
        setJuegoSeleccionado(juegoId);
    };

    const regresarAlDashboard = () => {
        setJuegoSeleccionado(null);
    };

    // Carga dinámica del componente del juego basado en su UUID
    const GameComponent = juegoSeleccionado === '3588519b-26e1-40da-ab10-3146e886ed2d' 
        ? dynamic(() => import('../components/games/ExampleGame'), { ssr: false }) 
        : null;

    return (
        <div>
            <h1>Dashboard del Estudiante</h1>

            {juegoSeleccionado ? (
                <div>
                    <GameComponent />
                    <button onClick={regresarAlDashboard}>Volver al Dashboard</button>
                </div>
            ) : (
                <>
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
                                        {cursoSeleccionado === curso.curso.id && (
                                            <ul>
                                                {juegos.length === 0 ? (
                                                    <p>No hay juegos asignados.</p>
                                                ) : (
                                                    juegos.map(juegoAsignado => (
                                                        <li key={juegoAsignado.juego.id}>
                                                            <button onClick={() => cargarJuego(juegoAsignado.juego.id)}>
                                                                {juegoAsignado.juego.nombre}: {juegoAsignado.juego.descripcion}
                                                            </button>
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
                </>
            )}
        </div>
    );
}

