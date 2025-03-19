import { useState, useEffect } from 'react';
import PuzzlePiece from './PuzzlePiece';

export default function PuzzleBoard({ pieces, onPiecesChange, gridSize, img, imageSize }) {
    const [draggedPiece, setDraggedPiece] = useState(null);
    const [isSolved, setIsSolved] = useState(false);

    useEffect(() => {
        checkSolution();
    }, [pieces]);

    const checkSolution = () => {
        const solved = pieces.every((piece, index) => piece === index);
        setIsSolved(solved);
    };

    const handleDragStart = (index) => {
        setDraggedPiece(index);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (targetIndex) => {
        if (draggedPiece === null) return;

        const newPieces = [...pieces];
        const draggedPieceValue = newPieces[draggedPiece];
        newPieces[draggedPiece] = newPieces[targetIndex];
        newPieces[targetIndex] = draggedPieceValue;

        onPiecesChange(newPieces);
        setDraggedPiece(null);
    };

    const pieceSize = imageSize / gridSize;

    return (
        <div className="relative p-4 rounded-lg shadow-md">
            <div
                className="grid gap-1"
                style={{
                    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    width: `${imageSize}px`,
                    height: `${imageSize}px`,
                }}
            >
                {pieces.map((piece, index) => (
                    <PuzzlePiece
                        key={index}
                        index={index}
                        piece={piece}
                        gridSize={gridSize}
                        pieceSize={pieceSize}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        img={img}
                    />
                ))}
            </div>
            {isSolved && (
                <div className="absolute inset-0 bg-green-500 bg-opacity-50 flex items-center justify-center rounded-lg">
                    <span className="text-white text-4xl font-bold">Solved!</span>
                </div>
            )}
        </div>
    );
}

