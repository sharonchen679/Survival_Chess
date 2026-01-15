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
  
  return (
    <div
      id={squareId}
      className={`
        relative w-full h-full border border-gray-800
        ${bgColor}
        ${isSelected ? 'ring-2 ring-move-indicator ring-offset-2' : ''}
        ${isPossibleCapture ? 'bg-move-indicator animate-pulse' : ''}
        cursor-pointer
        flex items-center justify-center
        text-4xl md:text-5xl
      `}
      onClick={onClick}
    >
      {isPossibleMove && !isPossibleCapture && (
        <div className="absolute w-3 h-3 bg-move-indicator rounded-full" />
      )}
      {pieceSymbol && (
        <span className={square.piece.startsWith('white') ? 'text-piece-white' : 'text-piece-black'}>
          {pieceSymbol}
        </span>
      )}
      {square.isBlock && (
        <div className="absolute inset-0 bg-block-outer opacity-80" />
      )}
      {square.isBlockPiece && (
        <div className="absolute inset-0 bg-block-outer opacity-80" />
      )}
    </div>
  )
}

export default Square
