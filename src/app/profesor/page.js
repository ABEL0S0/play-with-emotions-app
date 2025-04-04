'use client';

import { useEffect, useState } from "react";
import { Accordion, Button, Card } from "react-bootstrap"; // Importamos los componentes de Bootstrap
import { Checkbox } from 'primereact/checkbox';
import Navbarprofesor from "../components/navbar-profesor";

export default function ProfesorDashboard() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [cursos, setCursos] = useState([]);
    const [nombreCurso, setNombreCurso] = useState("");
    const [juegos, setJuegos] = useState([]);
    const [juegosAsignados, setJuegosAsignados] = useState([]);
    const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
    const [juegoSeleccionado, setJuegoSeleccionado] = useState(null);
    const [estudiantes, setEstudiantes] = useState([]);
    const [verEstudiantes, setVerEstudiantes] = useState(false);
    const profesorId = "7ba7e984-a0fd-4360-90e9-aa486db31396"; // TODO: Reemplazar con ID real del profesor autenticado

    useEffect(() => {
        if (!API_URL) return;

        fetch(`${API_URL}/courses/profesor/${profesorId}`)
            .then(res => res.json())
            .then(data => setCursos(data))
            .catch(error => console.error("Error al cargar cursos:", error));

        fetch(`${API_URL}/games`)
            .then(res => res.json())
            .then(data => setJuegos(data))
            .catch(error => console.error("Error al cargar juegos:", error));
    }, [API_URL]);

    const crearCurso = async () => {
        const response = await fetch(`${API_URL}/courses/create/${profesorId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: nombreCurso })
        });
        if (response.ok) {
            const nuevoCurso = await response.json();
            setCursos([...cursos, nuevoCurso]);
            setNombreCurso("");
        }
    };

    const eliminarCurso = async (cursoId) => {
        if (!confirm("¿Estás seguro de que quieres eliminar este curso? Esta acción no se puede deshacer.")) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/courses/${cursoId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${await response.text()}`);
            }

            setCursos((prevCursos) => prevCursos.filter(curso => curso.id !== cursoId));

            alert("Curso eliminado correctamente.");
        } catch (error) {
            console.error("Error al eliminar el curso:", error);
        }
    };

    const cargarEstudiantes = async (cursoId) => {
        if (!cursoId) return;
        try {
            const response = await fetch(`${API_URL}/student-courses/course/${cursoId}`);
            if (!response.ok) throw new Error("Error al cargar estudiantes");

            const data = await response.json();
            const listaEstudiantes = data.map(item => item.estudiante);
            setEstudiantes(listaEstudiantes);
            setVerEstudiantes(true);
        } catch (error) {
            console.error("Error al cargar estudiantes:", error);
        }
    };

    const cargarJuegosAsignados = async (cursoId) => {
        if (!cursoId) return;
        try {
            const response = await fetch(`${API_URL}/assigned-games/course/${cursoId}`);
            if (!response.ok) throw new Error("Error al cargar juegos asignados");

            const data = await response.json();
            setJuegosAsignados(data);
        } catch (error) {
            console.error("Error al cargar juegos asignados:", error);
        }
    };

    const asignarJuego = async () => {
        if (!cursoSeleccionado || !juegoSeleccionado) return;
    
        try {
            // 1. Obtener los juegos ya asignados al curso
            const checkResponse = await fetch(`${API_URL}/assigned-games/course/${cursoSeleccionado}`);
    
            if (!checkResponse.ok) {
                throw new Error(`Error ${checkResponse.status}: ${await checkResponse.text()}`);
            }
    
            const juegosAsignados = await checkResponse.json();
    
            // 2. Verificar si el juego ya está asignado
            const juegoYaAsignado = juegosAsignados.some(juego => juego.juego.id === juegoSeleccionado);
            if (juegoYaAsignado) {
                console.warn("El juego ya está asignado a este curso.");
                return;
            }
    
            // 3. Determinar el nuevo orden (máximo orden existente + 1, o 0 si es el primero)
            const nuevoOrden = juegosAsignados.length > 0 
                ? Math.max(...juegosAsignados.map(j => j.orden)) + 1 
                : 0;
    
            console.log(`Asignando juego con orden: ${nuevoOrden}`);
    
            // 4. Asignar el juego con el nuevo orden
            const response = await fetch(`${API_URL}/assigned-games`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    profesorId,
                    courseId: cursoSeleccionado,
                    gameId: juegoSeleccionado,
                    orden: nuevoOrden // ✅ Asegurándonos de enviar el orden
                })
            });
    
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${await response.text()}`);
            }
    
            const data = await response.json();
            console.log(`Juego asignado con orden ${nuevoOrden}:`, data);
        } catch (error) {
            console.error("Error al asignar juego:", error);
        }
    };
        

    const desasignarJuego = async (cursoId, gameId) => {
        if (!cursoId || !gameId) return;
        try {
            const response = await fetch(`${API_URL}/assigned-games/${cursoId}/${gameId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${await response.text()}`);
            }

            setJuegosAsignados((prevJuegos) => prevJuegos.filter(item => item.juego.id !== gameId));
            alert("Juego desasignado correctamente");
        } catch (error) {
            console.error("Error al desasignar juego:", error);
        }
    };

    const toggleProgresivo = async (cursoId, nuevoEstado) => {
        try {
            const response = await fetch(`${API_URL}/courses/${cursoId}/progresivo?progresivo=${nuevoEstado}`, {
                method: "PATCH",
            });
    
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${await response.text()}`);
            }
    
            setCursos(prevCursos => prevCursos.map(curso => 
                curso.id === cursoId ? { ...curso, progresivo: nuevoEstado } : curso
            ));
        } catch (error) {
            console.error("Error al actualizar el estado progresivo:", error);
        }
    };    

    const actualizarOrden = async (assignedGameId, nuevoOrden) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assigned-games/${assignedGameId}/orden?nuevoOrden=${nuevoOrden}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" }
            });
    
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${await response.text()}`);
            }
    
            // Actualiza la lista de juegos después del cambio
            setJuegos(prevJuegos =>
                prevJuegos.map(juego =>
                    juego.id === assignedGameId ? { ...juego, orden: nuevoOrden } : juego
                )
            );
        } catch (error) {
            console.error("Error al actualizar el orden:", error);
        }
    };    

    return (
        <div>
            <Navbarprofesor></Navbarprofesor>    
            <div className="container mt-4">
                <div className="mb-4">
                    <h2>Crear Curso</h2>
                    <input
                        type="text"
                        value={nombreCurso}
                        onChange={(e) => setNombreCurso(e.target.value)}
                        className="form-control mb-2"
                        placeholder="Nombre del curso"
                    />
                    <button className="btn btn-primary" onClick={crearCurso}>Crear</button>
                </div>

                <div className="mb-4">
                    <h2>Asignar Juego a Curso</h2>
                    <select onChange={(e) => setCursoSeleccionado(e.target.value)} className="form-select mb-2">
                        <option value="">Seleccionar Curso</option>
                        {cursos.map(curso => (
                            <option key={curso.id} value={curso.id}>{curso.nombre}</option>
                        ))}
                    </select>
                    <select onChange={(e) => setJuegoSeleccionado(e.target.value)} className="form-select mb-2">
                        <option value="">Seleccionar Juego</option>
                        {juegos.map(juego => (
                            <option key={juego.id} value={juego.id}>{juego.nombre}</option>
                        ))}
                    </select>
                    <button className="btn btn-success" onClick={asignarJuego}>Asignar</button>
                </div>

                <div className="mb-4">
                    <h2>Mis Cursos:</h2>
                    <Accordion>
                        {cursos.map(curso => (
                            <Card key={curso.id}>
                                <Accordion.Item eventKey={curso.id}>
                                    <Accordion.Header>{curso.nombre} - Código: {curso.codigo}</Accordion.Header>
                                    <Accordion.Body>
                                        <div className="d-flex justify-content-between">
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => eliminarCurso(curso.id)}
                                            >
                                                Eliminar Curso
                                            </button>
                                            <button
                                                className="btn btn-info"
                                                onClick={() => {
                                                    setCursoSeleccionado(curso.id);
                                                    cargarEstudiantes(curso.id);
                                                    cargarJuegosAsignados(curso.id);
                                                }}
                                            >
                                                Cargar Datos
                                            </button>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <Checkbox 
                                                inputId={`progresivo-${curso.id}`} 
                                                checked={curso.progresivo} 
                                                onChange={(e) => toggleProgresivo(curso.id, e.checked)}
                                            />
                                            <label htmlFor={`progresivo-${curso.id}`} className="ms-2">
                                                Curso Progresivo
                                            </label>
                                        </div>
                                    </div>
                                        {verEstudiantes && estudiantes.length > 0 && (
                                            <div>
                                                <h2>Estudiantes del Curso</h2>
                                                <ul>
                                                    {estudiantes.map(estudiante => (
                                                        <li key={estudiante.id}>
                                                            {estudiante.nombre} - {estudiante.email}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {juegosAsignados.length > 0 && (
                                            <div>
                                                <h2>Juegos Asignados</h2>
                                                <div className="row">
                                                    {juegosAsignados.map(item => (
                                                        <div key={item.juego.id} className="col-12 col-md-6 col-lg-4 mb-3">
                                                            <Card title={item.juego.nombre} className="shadow-sm border p-3">
                                                            <p><b className="text-gray-600">{item.juego.nombre}</b></p>
                                                                <p className="text-gray-600">{item.juego.descripcion}</p>
                                                                <p className="text-sm font-bold mt-2">Dificultad: {item.juego.dificultad}</p>

                                                                <div className="flex items-center gap-2 mt-2">
                                                                    <input
                                                                        type="number"
                                                                        value={item.orden}
                                                                        onChange={(e) => actualizarOrden(item.id, parseInt(e.target.value))}
                                                                        className="border rounded p-1 w-16 text-center"
                                                                    />
                                                                    <Button
                                                                        label="Actualizar Orden"
                                                                        icon="pi pi-sort"
                                                                        className="p-button-primary"
                                                                        onClick={() => actualizarOrden(item.id, item.orden)}
                                                                    />
                                                                </div>

                                                                <button
                                                                    className="btn btn-danger btn-sm ms-2 mt-3"
                                                                    onClick={() => desasignarJuego(cursoSeleccionado, item.juego.id)}
                                                                >
                                                                    Eliminar
                                                                </button>
                                                            </Card>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                    </Accordion.Body>
                                </Accordion.Item>
                            </Card>
                        ))}
                    </Accordion>
                </div>
            </div>
        </div>
    );
}
