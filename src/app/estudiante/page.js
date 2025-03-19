'use client';

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Navbarestudiante from "../components/navbar-estudiante";
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';

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
            .then(data => setCursos(data))
            .catch(error => console.error("Error al cargar cursos:", error));
    }, []);

    const unirseACurso = async () => {
        if (!codigoCurso) return;

        try {
            const response = await fetch(`${API_URL}/student-courses/enroll/${estudianteId}/${codigoCurso}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) throw new Error(`Error ${response.status}: ${await response.text()}`);

            const nuevoCurso = await response.json();
            setCursos([...cursos, nuevoCurso]);
            setCodigoCurso("");
        } catch (error) {
            console.error("Error al unirse al curso:", error);
        }
    };

    const cargarJuegosDelCurso = async (cursoId) => {
        setCursoSeleccionado(cursoId);

        try {
            const response = await fetch(`${API_URL}/assigned-games/course/${cursoId}`);
            if (!response.ok) throw new Error(`Error ${response.status}: ${await response.text()}`);
            
            setJuegos(await response.json());
        } catch (error) {
            console.error("Error al obtener juegos asignados:", error);
        }
    };

    const cargarJuego = (uuid) => {
        setJuegoSeleccionado(uuid);
    };

    const regresarADashboard = () => {
        setJuegoSeleccionado(null);
    };

    // Carga dinámica del componente del juego basado en su UUID
    const GameComponent = juegoSeleccionado
        ? dynamic(() => import(`../components/games/${juegoSeleccionado}`), { ssr: false })
        : null;

    return (
        <div className="p-d-flex p-flex-column p-align-center p-mt-5">
            <Navbarestudiante />
            
            <div className="p-card p-shadow-3 p-p-3 p-mt-4" style={{ width: '80%' }}>
                {juegoSeleccionado ? (
                    <div className="p-d-flex p-flex-column p-align-center">
                        <Button label="Volver" icon="pi pi-arrow-left" className="p-button-secondary p-mb-3" onClick={regresarADashboard} />
                        <GameComponent />
                    </div>
                ) : (
                    <>
                    <br/>
                        {/* Unirse a un curso */}
                        <Panel header="Unirse a un Curso" className="p-mt-4">
                            <div className="p-d-flex p-flex-column p-align-start">
                                <InputText
                                    value={codigoCurso}
                                    onChange={(e) => setCodigoCurso(e.target.value)}
                                    placeholder="Código del curso"
                                    className="p-inputtext-lg p-mb-3"
                                />
                                <Button label="Unirse" icon="pi pi-check" className="p-button-primary" onClick={unirseACurso} />
                            </div>
                        </Panel>

                        {/* Lista de Cursos Inscritos */}
                        <Panel header="Mis Cursos" className="p-mt-4">
                            {cursos.length === 0 ? (
                                <p>No estás inscrito en ningún curso.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {cursos.map(curso => (
                                        <Card key={curso.id} title={curso.curso.nombre} subTitle={`Código: ${curso.curso.codigo}`} className="shadow-md">
                                            <Button
                                                label="Ver Juegos"
                                                icon="pi pi-play"
                                                className="p-button-info w-full"
                                                onClick={() => cargarJuegosDelCurso(curso.curso.id)}
                                            />
                                            {cursoSeleccionado === curso.curso.id && juegos.length > 0 && (
                                                <div className="grid grid-cols-1 gap-3 mt-3">
                                                    {juegos.map(juego => (
                                                        <Card key={juego.juego.id} title={juego.juego.nombre} className="shadow-sm border p-3">
                                                            <p className="text-gray-600">{juego.juego.descripcion}</p>
                                                            <p className="text-sm font-bold mt-2">Dificultad: {juego.juego.dificultad}</p>
                                                            <Button
                                                                label="Jugar"
                                                                icon="pi pi-gamepad"
                                                                className="p-button-success w-full mt-2"
                                                                onClick={() => cargarJuego(juego.juego.id)}
                                                            />
                                                        </Card>
                                                    ))}
                                                </div>
                                            )}
                                            {cursoSeleccionado === curso.curso.id && juegos.length === 0 && (
                                                <p className="text-gray-500 mt-2">No hay juegos asignados.</p>
                                            )}
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </Panel>
                    </>
                )}
            </div>
        </div>
    );
}
