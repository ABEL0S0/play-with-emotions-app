'use client';
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Navbarprofesor from "@/app/components/navbar-profesor";

export default function GameList() {
    const [juegos, setJuegos] = useState([]);
    const [juegoSeleccionado, setJuegoSeleccionado] = useState(null);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games`);
                if (!response.ok) {
                    throw new Error("Error al obtener los juegos");
                }
                const data = await response.json();
                setJuegos(data);
            } catch (error) {
                console.error("Error al cargar juegos:", error);
            }
        };
        fetchGames();
    }, []);

    const GameComponent = juegoSeleccionado
        ? dynamic(() => import(`../../components/games/${juegoSeleccionado}`), { ssr: false })
        : null;

    return (
        <div>
          <Navbarprofesor/>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Selecciona un juego</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {juegos.map(juego => (
                <div 
                  key={juego.id} 
                  className="p-4 border rounded-lg shadow cursor-pointer hover:bg-gray-100"
                  onClick={() => setJuegoSeleccionado(juego.id)}
                >
                  <h3 className="text-lg font-semibold">{juego.nombre}</h3>
                  <p className="text-gray-600">{juego.descripcion}</p>
                  <p className="text-sm font-bold mt-2">Dificultad: {juego.dificultad}</p>
                </div>
              ))}
            </div>

            {juegoSeleccionado && (
              <div className="mt-6 p-4 border rounded-lg shadow-lg relative">
                <button 
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  onClick={() => setJuegoSeleccionado(null)}
                >
                  Cerrar
                </button>
                <h3 className="text-lg font-semibold mb-2">Juego Seleccionado</h3>
                <GameComponent />
              </div>
            )}
          </div>
        </div>
    );
}