import { useEffect, useState } from 'react'
import PuzzleBoard from '../games-components/PuzzleBoard'
import { Button } from 'primereact/button';

const GRID_SIZE = 3
const IMAGE_SIZE = 300
const IMG_URLS = [
  '../images/Angustiado.png',
  '../images/Asustado.png',
  '../images/Contento.png',
  '../images/Desanimado.png',
  '../images/Dudoso.png',
  '../images/Feliz.png',
  '../images/Malicioso.png',
  '../images/Nervioso.png',
  '../images/Satisfecho.png',
  '../images/Tranquilo.png',
  '../images/Travieso.png',
  '../images/Triste.png',
  // Agrega más URLs de imágenes si lo deseas
]

function Puzzle() {
  const [pieces, setPieces] = useState([])
  const [isSolved, setIsSolved] = useState(false)
  const [currentImage, setCurrentImage] = useState(IMG_URLS[0])

  useEffect(() => {
    selectRandomImage()
    shufflePieces()
  }, [])

  const selectRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * IMG_URLS.length)
    setCurrentImage(IMG_URLS[randomIndex])
  }

  const shufflePieces = () => {
    const newPieces = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i)
    for (let i = newPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newPieces[i], newPieces[j]] = [newPieces[j], newPieces[i]]
    }
    setPieces(newPieces)
    setIsSolved(false)
  }

  const checkSolution = () => {
    setIsSolved(pieces.every((piece, index) => piece === index))
  }

  const handlePiecesChange = (newPieces) => {
    setPieces(newPieces)
    checkSolution()
  }

  const handleNewPuzzle = () => {
    selectRandomImage()
    shufflePieces()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-8">Image Puzzle Game</h1>
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        <div className="order-2 md:order-1">
          <PuzzleBoard pieces={pieces} onPiecesChange={handlePiecesChange} gridSize={GRID_SIZE} imageSize={IMAGE_SIZE} img={currentImage} />
        </div>
        <div className="order-1 md:order-2">
          <div className="p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Reference Image</h2>
            <img
              src={currentImage}
              alt="Reference Image"
              width={IMAGE_SIZE}
              height={IMAGE_SIZE}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
      <div className="mt-8">
        <Button variant="contained" onClick={handleNewPuzzle} className="mr-4">
          New Puzzle
        </Button>
        {isSolved && <span className="text-green-600 font-bold">Puzzle Solved!</span>}
      </div>
    </div>
  )
}

export default Puzzle
