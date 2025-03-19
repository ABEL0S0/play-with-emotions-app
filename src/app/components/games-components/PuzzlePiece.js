export default function PuzzlePiece({
    index,
    piece,
    gridSize,
    pieceSize,
    onDragStart,
    onDragOver,
    onDrop,
    img,
}) {
    const handleDragStart = () => onDragStart(index);
    const handleDrop = () => onDrop(index);

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            onDragOver={onDragOver}
            onDrop={handleDrop}
            className="border border-gray-300 cursor-move"
            style={{
                width: `${pieceSize}px`,
                height: `${pieceSize}px`,
                backgroundImage: `url("${img}")`,
                backgroundSize: `${pieceSize * gridSize}px ${pieceSize * gridSize}px`,
                backgroundPosition: `${-(piece % gridSize) * pieceSize}px ${-Math.floor(piece / gridSize) * pieceSize}px`,
            }}
        />
    );
}

