import React, { useState } from "react";

export default function Example() {
    const [completed, setCompleted] = useState(false);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const gameuuid = "3588519b-26e1-40da-ab10-3146e886ed2d";
    const studentId = "907581a8-65c5-4deb-a3b5-4e68093806fb"; // Reemplazar con el ID real del estudiante
    const courseId = "51bfc7af-9777-4945-b28b-ed6d61741287"; // Reemplazar con el ID real del curso

    const handleClick = async () => {
        setCompleted(true);
        console.log("Intentando marcar como completado...");
    
        try {
            const response = await fetch(`${API_URL}/student-progress/complete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentId: studentId, courseId: courseId, gameId: gameuuid }),
            });
    
            const data = await response.json();
            console.log("Respuesta del servidor:", data);
    
            if (!response.ok) {
                throw new Error(`Error al marcar como completado: ${data.message || response.statusText}`);
            }
    
            console.log("Juego marcado como completado");
        } catch (error) {
            console.error("Error:", error);
        }
    };
    

    return (
        <div>
            <h1 onClick={handleClick} style={{ cursor: "pointer" }}>HELLO WORLD</h1>
            {completed && <h2>COMPLETE!</h2>}
        </div>
    );
}

