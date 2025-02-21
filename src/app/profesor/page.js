'use client'

import { useEffect, useState } from "react";

export default function ProfesorDashboard() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [cursos, setCursos] = useState([]);
    const [nombreCurso, setNombreCurso] = useState("");
    const [juegos, setJuegos] = useState([]);
    const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
    const [juegoSeleccionado, setJuegoSeleccionado] = useState(null);
    const profesorId = "7ba7e984-a0fd-4360-90e9-aa486db31396"; // TODO: Reemplazar con ID real del profesor autenticado

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/profesor/${profesorId}`)
            .then(res => res.json())
            .then(data => setCursos(data))
            .catch(error => console.error("Error al cargar cursos:", error));

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/games`)
            .then(res => res.json())
            .then(data => setJuegos(data))
            .catch(error => console.error("Error al cargar juegos:", error));
    }, []);

    const crearCurso = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/create/${profesorId}`, {
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

    const asignarJuego = async () => {
      if (!cursoSeleccionado || !juegoSeleccionado) return;
  
      try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assigned-games`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  profesorId,
                  courseId: cursoSeleccionado,
                  gameId: juegoSeleccionado
              })
          });
  
          if (!response.ok) {
              throw new Error(`Error ${response.status}: ${await response.text()}`);
          }
  
          const data = await response.json();
          console.log("Juego asignado:", data);
      } catch (error) {
          console.error("Error al asignar juego:", error);
      }
  };
  

    return (
        <div>
            <h1>Dashboard del Profesor</h1>
            
            {/* Crear Curso */}
            <div>
                <h2>Crear Curso</h2>
                <input type="text" value={nombreCurso} onChange={(e) => setNombreCurso(e.target.value)} placeholder="Nombre del curso" />
                <button onClick={crearCurso}>Crear</button>
            </div>
            
            {/* Lista de Cursos */}
            <div>
                <h2>Mis Cursos</h2>
                <ul>
                    {cursos.map(curso => (
                        <li key={curso.id}>{curso.nombre} - Código: {curso.codigo}</li>
                    ))}
                </ul>
            </div>
            
            {/* Asignar Juego a Curso */}
            <div>
                <h2>Asignar Juego a Curso</h2>
                <select onChange={(e) => setCursoSeleccionado(e.target.value)}>
                    <option value="">Seleccionar Curso</option>
                    {cursos.map(curso => (
                        <option key={curso.id} value={curso.id}>{curso.nombre}</option>
                    ))}
                </select>
                <select onChange={(e) => setJuegoSeleccionado(e.target.value)}>
                    <option value="">Seleccionar Juego</option>
                    {juegos.map(juego => (
                        <option key={juego.id} value={juego.id}>{juego.nombre}</option>
                    ))}
                </select>
                <button onClick={asignarJuego}>Asignar</button>
            </div>
        </div>
    );
}