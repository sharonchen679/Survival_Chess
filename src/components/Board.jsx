import Square from './Square'
import { getSquareId } from '../utils/gameLogic'

function Board({ 
  board, 
  selectedSquare, 
  possibleMoves, 
  possibleCaptures, 
  onSquareClick 
}) {
  const letters = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  
  return (
    <div className="relative inline-block border-4 border-[#5A3F2F] shadow-2xl">
      {/* Top coordinates */}
      <div className="flex">
        <div className="w-8" /> {/* Corner */}
        {letters.slice(1).map(letter => (
          <div key={letter} className="w-12 h-6 flex items-center justify-center text-sm font-semibold text-[#5A3F2F]">
            {letter}
          </div>
        ))}
      </div>
      
      <div className="flex">
        {/* Left coordinates */}
        <div className="flex flex-col">
          {[8, 7, 6, 5, 4, 3, 2, 1].map(num => (
            <div key={num} className="w-8 h-12 flex items-center justify-center text-sm font-semibold text-[#5A3F2F]">
              {num}
            </div>
          ))}
        </div>
        
        {/* Board squares */}
        <div className="grid grid-cols-8 w-96 h-96 md:w-[480px] md:h-[480px]">
          {[8, 7, 6, 5, 4, 3, 2, 1].map(num => (
            letters.slice(1).map((_, letterIndex) => {
              const letter = letterIndex + 1
              const squareId = getSquareId(letter, num)
              const square = board[squareId] || { piece: 'empty', isBlock: false, isBlockPiece: false }
              
              return (
                <Square
                  key={squareId}
                  letter={letter}
                  num={num}
                  square={square}
                  isPossibleMove={possibleMoves.includes(squareId)}
                  isPossibleCapture={possibleCaptures.includes(squareId)}
                  isSelected={selectedSquare === squareId}
                  onClick={() => onSquareClick(letter, num)}
                />
              )
            })
          ))}
        </div>
      </div>
    </div>
  )
}

export default Board
