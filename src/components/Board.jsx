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
    <div className="relative inline-block border-8 border-[#5A3F2F] shadow-2xl rounded-lg overflow-hidden"
         style={{
           background: 'linear-gradient(135deg, #6B4E3D 0%, #5A3F2F 50%, #4A3426 100%)',
           boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(0, 0, 0, 0.2)'
         }}>
      {/* Top coordinates */}
      <div className="flex">
        <div className="w-8" /> {/* Corner */}
        {letters.slice(1).map(letter => (
          <div 
            key={`top-${letter}`} 
            className="w-12 h-6 md:w-15 md:h-6 flex items-center justify-center text-sm font-bold text-white drop-shadow-md"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
          >
            {letter}
          </div>
        ))}
        <div className="w-8" /> {/* Right corner */}
      </div>
      
      <div className="flex">
        {/* Left coordinates */}
        <div className="flex flex-col">
          {[8, 7, 6, 5, 4, 3, 2, 1].map(num => (
            <div 
              key={`left-${num}`} 
              className="w-8 h-12 md:h-15 flex items-center justify-center text-sm font-bold text-white drop-shadow-md"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
            >
              {num}
            </div>
          ))}
        </div>
        
        {/* Board squares - fixed size grid to ensure perfect squares */}
        <div className="grid grid-cols-8 w-[384px] h-[384px] md:w-[480px] md:h-[480px]">
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
        
        {/* Right coordinates */}
        <div className="flex flex-col">
          {[8, 7, 6, 5, 4, 3, 2, 1].map(num => (
            <div 
              key={`right-${num}`} 
              className="w-8 h-12 md:h-15 flex items-center justify-center text-sm font-bold text-white drop-shadow-md"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
            >
              {num}
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom coordinates */}
      <div className="flex">
        <div className="w-8" /> {/* Corner */}
        {letters.slice(1).map(letter => (
          <div 
            key={`bottom-${letter}`} 
            className="w-12 h-6 md:w-15 md:h-6 flex items-center justify-center text-sm font-bold text-white drop-shadow-md"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
          >
            {letter}
          </div>
        ))}
        <div className="w-8" /> {/* Right corner */}
      </div>
    </div>
  )
}

export default Board
