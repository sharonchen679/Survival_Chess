import { getSquareId } from '../utils/gameLogic'

function Square({ 
  letter, 
  num, 
  square, 
  isPossibleMove, 
  isPossibleCapture, 
  isSelected, 
  onClick 
}) {
  const squareId = getSquareId(letter, num)
  const isLight = (letter + num) % 2 === 0
  
  const getPieceSymbol = (piece) => {
    const symbols = {
      'white_king': '\u2654',
      'white_queen': '\u2655',
      'white_rook': '\u2656',
      'white_bishop': '\u2657',
      'white_knight': '\u2658',
      'white_pawn': '\u2659',
      'black_king': '\u265A',
      'black_queen': '\u265B',
      'black_rook': '\u265C',
      'black_bishop': '\u265D',
      'black_knight': '\u265E',
      'black_pawn': '\u265F',
    }
    return symbols[piece] || ''
  }
  
  const bgColor = isLight ? 'bg-board-light' : 'bg-board-dark'
  const pieceSymbol = square.piece !== 'empty' ? getPieceSymbol(square.piece) : ''
  
  // Render brick pattern for blocks (2x2 grid)
  const renderBricks = () => {
    return (
      <div className="absolute inset-0" style={{ overflow: 'hidden' }}>
        {[...Array(4)].map((_, i) => {
          // Calculate position for each brick using absolute positioning
          const row = Math.floor(i / 2)
          const col = i % 2
          return (
            <div 
              key={i} 
              className="absolute"
              style={{
                left: `${col * 50}%`,
                top: `${row * 50}%`,
                width: '50%',
                height: '50%',
                margin: 0,
                padding: 0,
                overflow: 'hidden'
              }}
            >
              <svg 
                viewBox="0 0 100 100" 
                className="w-full h-full"
                preserveAspectRatio="none"
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%'
                }}
              >
                <rect x="0" y="0" width="100" height="100" fill="#4A3728"/>
                <rect x="14.5" y="14.5" width="71" height="71" fill="#5D4E37"/>
              </svg>
            </div>
          )
        })}
      </div>
    )
  }
  
  return (
    <div
      id={squareId}
      className={`
        relative w-full h-full border border-gray-900/30
        ${isPossibleCapture ? 'fast-pulse' : bgColor}
        ${isSelected ? 'ring-4 ring-move-indicator ring-opacity-75 shadow-lg shadow-move-indicator/50' : ''}
        cursor-pointer
        flex items-center justify-center
        text-4xl md:text-5xl
        transition-all duration-200
      `}
      style={{
        aspectRatio: '1 / 1',
        ...(isPossibleCapture ? {
          backgroundColor: '#5C7A7A'
        } : {})
      }}
      onClick={onClick}
    >
      {/* Possible move indicator - dot */}
      {isPossibleMove && !isPossibleCapture && (
        <div className="absolute w-3 h-3 bg-move-indicator rounded-full z-10" />
      )}
      
      {/* Block visualization - brick pattern */}
      {square.isBlock && renderBricks()}
      
      {/* Block piece visualization - bricks + piece */}
      {square.isBlockPiece && (
        <>
          {renderBricks()}
          <span className="relative z-10 text-piece-black drop-shadow-lg">
            {pieceSymbol}
          </span>
        </>
      )}
      
      {/* White piece */}
      {square.piece !== 'empty' && !square.isBlock && !square.isBlockPiece && (
        <span className={`relative z-10 ${square.piece.startsWith('white') ? 'text-piece-white drop-shadow-lg' : 'text-piece-black drop-shadow-lg'}`}>
          {pieceSymbol}
        </span>
      )}
    </div>
  )
}

export default Square
