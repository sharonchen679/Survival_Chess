import { useState, useEffect } from 'react'
import Board from '../components/Board'
import { 
  getInitialBoard, 
  getPossibleMoves, 
  hasPossibleMoves,
  getSquareId,
  letters 
} from '../utils/gameLogic'

function GamePage() {
  const [board, setBoard] = useState(getInitialBoard())
  const [selectedSquare, setSelectedSquare] = useState(null)
  const [possibleMoves, setPossibleMoves] = useState([])
  const [possibleCaptures, setPossibleCaptures] = useState([])
  const [firstMove, setFirstMove] = useState(true)
  const [gameIsOver, setGameIsOver] = useState(false)
  const [score, setScore] = useState(0)
  const [capturesInARow, setCapturesInARow] = useState(0)
  const [scoreText, setScoreText] = useState('')
  const difficulty = parseInt(localStorage.getItem('difficulty') || '4')

  // Check for game over when board changes
  useEffect(() => {
    if (!gameIsOver && !hasPossibleMoves(board)) {
      setGameIsOver(true)
      setScoreText('GAME OVER')
    }
  }, [board, gameIsOver])

  const handleSquareClick = (letter, num) => {
    if (gameIsOver) return
    
    const squareId = getSquareId(letter, num)
    const square = board[squareId]
    
    // If clicking on a possible move
    if (possibleMoves.includes(squareId)) {
      movePiece(selectedSquare, squareId)
      if (firstMove) {
        addBlocks()
        setFirstMove(false)
        return
      }
      setCapturesInARow(0)
      setScoreText('')
      
      // Check for block movement
      if (Math.floor(Math.random() * difficulty) === 0) {
        boardDown()
        // Add blocks after board moves down (if game not over)
        // Use setTimeout to check after state update
        setTimeout(() => {
          if (!gameIsOver) {
            addBlocks()
          }
        }, 0)
      }
    }
    // If clicking on a possible capture
    else if (possibleCaptures.includes(squareId)) {
      capturePiece(selectedSquare, squareId)
      const bonus = clearBlocks(squareId)
      const newCapturesInARow = capturesInARow + 1
      setCapturesInARow(newCapturesInARow)
      const points = Math.pow(2, newCapturesInARow - 1)
      setScore(prev => prev + points)
      setScoreText(`captures in a row: ${newCapturesInARow}${bonus}`)
    }
    // First click - select piece
    else {
      if (square.piece === 'empty' || square.isBlock || square.isBlockPiece) {
        return
      }
      const { possibleMoves: moves, possibleCaptures: captures } = getPossibleMoves(board, letter, num)
      setSelectedSquare(squareId)
      setPossibleMoves(moves)
      setPossibleCaptures(captures)
    }
  }

  const movePiece = (fromId, toId) => {
    setBoard(prev => {
      const newBoard = { ...prev }
      const piece = newBoard[fromId].piece
      newBoard[toId] = { ...newBoard[toId], piece }
      newBoard[fromId] = { piece: 'empty', isBlock: false, isBlockPiece: false }
      return newBoard
    })
    setSelectedSquare(null)
    setPossibleMoves([])
    setPossibleCaptures([])
  }

  const capturePiece = (fromId, toId) => {
    setBoard(prev => {
      const newBoard = { ...prev }
      const piece = newBoard[fromId].piece
      newBoard[toId] = { 
        piece, 
        isBlock: false, 
        isBlockPiece: false 
      }
      newBoard[fromId] = { piece: 'empty', isBlock: false, isBlockPiece: false }
      return newBoard
    })
    setSelectedSquare(null)
    setPossibleMoves([])
    setPossibleCaptures([])
  }

  const boardDown = () => {
    setBoard(prev => {
      const newBoard = { ...prev }
      let start = 2
      
      // Find lowest row of blocks
      for (; start <= 8; start++) {
        const square = newBoard[getSquareId(1, start)]
        if (square.isBlock || square.isBlockPiece) {
          break
        }
      }
      
      if (start > 8) {
        // No blocks - check 8th row for white pieces
        for (let letter = 1; letter <= 8; letter++) {
          const squareId = getSquareId(letter, 8)
          if (newBoard[squareId].piece !== 'empty') {
            newBoard[squareId] = { piece: 'empty', isBlock: false, isBlockPiece: false }
          }
        }
        return newBoard
      }
      
      // Move blocks down
      for (let num = start - 1; num <= 7; num++) {
        for (let letter = 1; letter <= 8; letter++) {
          const squareId = getSquareId(letter, num)
          const aboveId = getSquareId(letter, num + 1)
          const square = newBoard[squareId]
          const above = newBoard[aboveId]
          
          // Lose piece if block is above
          if (square.piece !== 'empty' && (above.isBlock || above.isBlockPiece)) {
            newBoard[squareId] = { piece: 'empty', isBlock: false, isBlockPiece: false }
          }
          
          // Copy from above
          if (above.piece !== 'empty' || above.isBlock || above.isBlockPiece) {
            newBoard[squareId] = {
              piece: above.piece,
              isBlock: above.isBlock,
              isBlockPiece: above.isBlockPiece
            }
            newBoard[aboveId] = { piece: 'empty', isBlock: false, isBlockPiece: false }
          }
        }
      }
      
      if (start === 2) {
        addBlocksToBoard(newBoard)
        setGameIsOver(true)
        setScoreText('GAME OVER')
      }
      
      return newBoard
    })
    
    // Check if game ended by checking if blocks were on row 2
    let start = 2
    for (; start <= 8; start++) {
      const square = board[getSquareId(1, start)]
      if (square && (square.isBlock || square.isBlockPiece)) {
        break
      }
    }
    return start === 2
  }

  const addBlocks = () => {
    setBoard(prev => {
      const newBoard = { ...prev }
      addBlocksToBoard(newBoard)
      return newBoard
    })
  }

  const addBlocksToBoard = (newBoard) => {
    const randomIndex = Math.floor(Math.random() * 8) + 1
    const blackPieces = ['black_king', 'black_queen', 'black_rook', 'black_bishop', 'black_knight', 'black_pawn']
    
    for (let letter = 1; letter <= 8; letter++) {
      const squareId = getSquareId(letter, 8)
      if (letter !== randomIndex) {
        newBoard[squareId] = { piece: 'empty', isBlock: true, isBlockPiece: false }
      } else {
        const randomPiece = blackPieces[Math.floor(Math.random() * 6)]
        newBoard[squareId] = { piece: randomPiece, isBlock: false, isBlockPiece: true }
      }
    }
  }

  const clearBlocks = (capturedSquareId) => {
    const letter = letters.indexOf(capturedSquareId.charAt(0))
    const num = parseInt(capturedSquareId.charAt(1))
    
    // First, check current board to see if this will clear all blocks
    const currentBoard = { ...board }
    for (let l = 1; l <= 8; l++) {
      if (l !== letter) {
        const squareId = getSquareId(l, num)
        currentBoard[squareId] = { piece: 'empty', isBlock: false, isBlockPiece: false }
      }
    }
    
    // Check if no more blocks will remain after this clear
    const hasBlocks = Object.values(currentBoard).some(sq => sq.isBlock)
    let bonusText = ''
    
    if (!hasBlocks) {
      const bonus = 6 - difficulty
      setScore(prev => prev + bonus)
      bonusText = ` + BONUS: ${bonus}`
    }
    
    // Now update the board
    setBoard(prev => {
      const newBoard = { ...prev }
      for (let l = 1; l <= 8; l++) {
        if (l !== letter) {
          const squareId = getSquareId(l, num)
          newBoard[squareId] = { piece: 'empty', isBlock: false, isBlockPiece: false }
        }
      }
      return newBoard
    })
    
    return bonusText
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-4">
      <div className="max-w-4xl mx-auto">
        {/* Score Display - Fixed height to prevent jumping */}
        <div className="mb-4 text-center" style={{ minHeight: '80px' }}>
          <h2 className="text-2xl font-semibold text-[#8B5A3C]">score: {score}</h2>
          <div style={{ minHeight: '32px' }}>
            {scoreText && (
              <h2 className="text-xl text-[#5C7A7A]">{scoreText}</h2>
            )}
          </div>
        </div>
        
        {/* Board */}
        <div className="flex justify-center">
          <Board
            board={board}
            selectedSquare={selectedSquare}
            possibleMoves={possibleMoves}
            possibleCaptures={possibleCaptures}
            onSquareClick={handleSquareClick}
          />
        </div>
      </div>
    </div>
  )
}

export default GamePage
