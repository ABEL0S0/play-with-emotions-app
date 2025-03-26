import React, { useState } from 'react';
import GameOver from '../games-components/GameOver';
import '../games-components/adivina.css';

// Nueva base de datos con imágenes
const imageDatabase = [
  { image: "/images/Angustiado.png", correct: "Angustiado" },
  { image: "/images/Asustado.png", correct: "Asustado" },
  { image: "/images/Contento.png", correct: "Contento" },
  { image: "/images/Desanimado.png", correct: "Desanimado" },
  { image: "/images/Dudoso.png", correct: "Dudoso" },
  { image: "/images/Feliz.png", correct: "Feliz" },
  { image: "/images/Malicioso.png", correct: "Malicioso" },
  { image: "/images/Nervioso.png", correct: "Nervioso" },
  { image: "/images/Satisfecho.png", correct: "Satisfecho" },
  { image: "/images/Tranquilo.png", correct: "Tranquilo" },
  { image: "/images/Travieso.png", correct: "Travieso" },
  { image: "/images/Triste.png", correct: "Triste" }
];

function Adivina() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameImages, setGameImages] = useState(() => shuffleArray(imageDatabase));
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);

  function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  const checkAnswer = (selected, correct) => {
    const isCorrect = selected === correct;
    const newAnswer = {
      image: gameImages[currentImageIndex].image,
      correct: correct,
      selected: selected,
      isCorrect: isCorrect
    };
    
    setAnswers([...answers, newAnswer]);
    
    if (isCorrect) {
      setScore(score + 1);
      alert('¡Respuesta correcta!');
    } else {
      alert('Respuesta incorrecta');
    }

    if (currentImageIndex < gameImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setIsGameOver(true);
    }
  };

  const restartGame = () => {
    setGameImages(shuffleArray(imageDatabase));
    setCurrentImageIndex(0);
    setIsGameOver(false);
    setAnswers([]);
    setScore(0);
  };

  if (isGameOver) {
    return (
      <GameOver 
        onPlayAgain={restartGame} 
        score={score} 
        totalQuestions={imageDatabase.length}
        answers={answers}
      />
    );
  }

  const currentImage = gameImages[currentImageIndex];
  const options = shuffleArray([
    currentImage.correct,
    ...imageDatabase
      .filter(e => e.correct !== currentImage.correct)
      .slice(0, 3)
      .map(e => e.correct)
  ]);

  return (
    <div className="juego-principal">
      <div className="instrucciones-cuadro">
        <h2>Instrucciones del Juego</h2>
        <p>Selecciona la opción correcta de la expresión mostrada.</p>
        <p>Presiona el botón correspondiente a tu respuesta.</p>
        <p>Si aciertas, sumarás un punto; si fallas, perderás una vida.</p>
        <p>¡Buena suerte!</p>
      </div>
      <div className="container">
        <div className="game-area">
          <div className="progress">
            Imagen {currentImageIndex + 1} de {imageDatabase.length}
          </div>
          <div className="image-container">
            <img src={currentImage.image} alt="Adivina" className="game-image" />
          </div>
          <div className="options">
            {options.map((option, index) => (
              <button
                key={index}
                className="option-btn"
                onClick={() => checkAnswer(option, currentImage.correct)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Adivina;