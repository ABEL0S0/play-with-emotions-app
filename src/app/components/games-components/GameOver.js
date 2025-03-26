import React from 'react';

function GameOver({ onPlayAgain, score, totalQuestions, answers }) {
  return (
    <div className="game-over-container">
      <h1>¡Juego Terminado!</h1>
      <div className="score-container">
        <h2>Puntuación: {score} de {totalQuestions} puntos</h2>
        <p>Acertaste {score} de {totalQuestions} imágenes</p>
      </div>
      
      <div className="answers-review">
        <h3>Revisión de respuestas:</h3>
        {answers.map((answer, index) => (
          <div key={index} className={`answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
            <img src={answer.image} alt="Imagen pregunta" className="review-image" />
            <div className="answer-details">
              <p>Respuesta correcta: {answer.correct}</p>
              {!answer.isCorrect && <p>Tu respuesta: {answer.selected}</p>}
            </div>
          </div>
        ))}
      </div>
      
      <button className="play-again-btn" onClick={onPlayAgain}>
        Jugar de nuevo
      </button>
    </div>
  );
}

export default GameOver; 