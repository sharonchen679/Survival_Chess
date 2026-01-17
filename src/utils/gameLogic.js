// Game logic utilities
export const letters = ['0', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']; // index 0 is unused

export function inRange(letter, num) {
  return letter >= 1 && letter <= 8 && num >= 1 && num <= 8;
}

export function getSquareId(letter, num) {
  return letters[letter] + num;
}

export function getInitialBoard() {
  const board = {};
  
  // Initialize all squares as empty
  for (let num = 1; num <= 8; num++) {
    for (let letter = 1; letter <= 8; letter++) {
      board[getSquareId(letter, num)] = {
        piece: 'empty',
        isBlock: false,
        isBlockPiece: false,
      };
    }
  }
  
  // 1st row - white pieces
  board['A1'] = { piece: 'white_rook', isBlock: false, isBlockPiece: false };
  board['B1'] = { piece: 'white_knight', isBlock: false, isBlockPiece: false };
  board['C1'] = { piece: 'white_bishop', isBlock: false, isBlockPiece: false };
  board['D1'] = { piece: 'white_queen', isBlock: false, isBlockPiece: false };
  board['E1'] = { piece: 'white_king', isBlock: false, isBlockPiece: false };
  board['F1'] = { piece: 'white_bishop', isBlock: false, isBlockPiece: false };
  board['G1'] = { piece: 'white_knight', isBlock: false, isBlockPiece: false };
  board['H1'] = { piece: 'white_rook', isBlock: false, isBlockPiece: false };
  
  // 2nd row - white pawns
  for (let letter = 1; letter <= 8; letter++) {
    board[getSquareId(letter, 2)] = { piece: 'white_pawn', isBlock: false, isBlockPiece: false };
  }
  
  return board;
}

export function getPossibleMoves(board, letter, num) {
  const squareId = getSquareId(letter, num);
  const square = board[squareId];
  
  if (!square || square.piece === 'empty' || square.isBlock || square.isBlockPiece) {
    return { possibleMoves: [], possibleCaptures: [] };
  }
  
  const possibleMoves = [];
  const possibleCaptures = [];
  const pieceType = square.piece.replace('white_', '');
  
  switch (square.piece) {
    case 'white_king':
      addKingMoves(board, letter, num, possibleMoves, possibleCaptures, 'king');
      break;
    case 'white_queen':
      addQueenMoves(board, letter, num, possibleMoves, possibleCaptures, 'queen');
      break;
    case 'white_rook':
      addRookMoves(board, letter, num, possibleMoves, possibleCaptures, 'rook');
      break;
    case 'white_bishop':
      addBishopMoves(board, letter, num, possibleMoves, possibleCaptures, 'bishop');
      break;
    case 'white_knight':
      addKnightMoves(board, letter, num, possibleMoves, possibleCaptures);
      break;
    case 'white_pawn':
      addPawnMoves(board, letter, num, possibleMoves, possibleCaptures);
      break;
  }
  
  return { possibleMoves, possibleCaptures };
}

function addKingMoves(board, letter, num, possibleMoves, possibleCaptures, pieceType) {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];
  
  directions.forEach(([dLetter, dNum]) => {
    const newLetter = letter + dLetter;
    const newNum = num + dNum;
    if (inRange(newLetter, newNum)) {
      const squareId = getSquareId(newLetter, newNum);
      const square = board[squareId];
      // Can move to empty square without blocks
      if (square.piece === 'empty' && !square.isBlock && !square.isBlockPiece) {
        possibleMoves.push(squareId);
      } 
      // Can capture block piece of same type
      else if (square.isBlockPiece && square.piece === `black_${pieceType}`) {
        possibleCaptures.push(squareId);
      }
    }
  });
}

function addQueenMoves(board, letter, num, possibleMoves, possibleCaptures, pieceType) {
  addRookMoves(board, letter, num, possibleMoves, possibleCaptures, pieceType);
  addBishopMoves(board, letter, num, possibleMoves, possibleCaptures, pieceType);
}

function addRookMoves(board, letter, num, possibleMoves, possibleCaptures, pieceType) {
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  
  directions.forEach(([dLetter, dNum]) => {
    for (let i = 1; i <= 8; i++) {
      const newLetter = letter + dLetter * i;
      const newNum = num + dNum * i;
      if (!inRange(newLetter, newNum)) break;
      
      const squareId = getSquareId(newLetter, newNum);
      const square = board[squareId];
      
      // Can move to empty square without blocks
      if (square.piece === 'empty' && !square.isBlock && !square.isBlockPiece) {
        possibleMoves.push(squareId);
      } 
      // Can capture block piece of same type
      else if (square.isBlockPiece && square.piece === `black_${pieceType}`) {
        possibleCaptures.push(squareId);
        break; // Stop after capture
      }
      // Blocked by block or other piece
      else {
        break; // Stop - cannot move through blocks
      }
    }
  });
}

function addBishopMoves(board, letter, num, possibleMoves, possibleCaptures, pieceType) {
  const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  
  directions.forEach(([dLetter, dNum]) => {
    for (let i = 1; i <= 8; i++) {
      const newLetter = letter + dLetter * i;
      const newNum = num + dNum * i;
      if (!inRange(newLetter, newNum)) break;
      
      const squareId = getSquareId(newLetter, newNum);
      const square = board[squareId];
      
      // Can move to empty square without blocks
      if (square.piece === 'empty' && !square.isBlock && !square.isBlockPiece) {
        possibleMoves.push(squareId);
      } 
      // Can capture block piece of same type
      else if (square.isBlockPiece && square.piece === `black_${pieceType}`) {
        possibleCaptures.push(squareId);
        break; // Stop after capture
      }
      // Blocked by block or other piece
      else {
        break; // Stop - cannot move through blocks
      }
    }
  });
}

function addKnightMoves(board, letter, num, possibleMoves, possibleCaptures) {
  const moves = [
    [-1, -2], [-1, 2], [-2, -1], [-2, 1],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ];
  
  moves.forEach(([dLetter, dNum]) => {
    const newLetter = letter + dLetter;
    const newNum = num + dNum;
    if (inRange(newLetter, newNum)) {
      const squareId = getSquareId(newLetter, newNum);
      const square = board[squareId];
      // Can move to empty square without blocks
      if (square.piece === 'empty' && !square.isBlock && !square.isBlockPiece) {
        possibleMoves.push(squareId);
      } 
      // Can capture block piece of same type
      else if (square.isBlockPiece && square.piece === 'black_knight') {
        possibleCaptures.push(squareId);
      }
    }
  });
}

function addPawnMoves(board, letter, num, possibleMoves, possibleCaptures) {
  if (num === 8) return; // nowhere to go
  
  // Forward move
  const forwardId = getSquareId(letter, num + 1);
  const forwardSquare = board[forwardId];
  if (forwardSquare.piece === 'empty' && !forwardSquare.isBlock && !forwardSquare.isBlockPiece) {
    possibleMoves.push(forwardId);
    
    // Double step from row 2
    if (num === 2) {
      const doubleId = getSquareId(letter, num + 2);
      const doubleSquare = board[doubleId];
      if (doubleSquare.piece === 'empty' && !doubleSquare.isBlock && !doubleSquare.isBlockPiece) {
        possibleMoves.push(doubleId);
      }
    }
  }
  
  // Diagonal captures
  if (letter > 1) {
    const leftId = getSquareId(letter - 1, num + 1);
    const leftSquare = board[leftId];
    if (leftSquare.isBlockPiece && leftSquare.piece === 'black_pawn') {
      possibleCaptures.push(leftId);
    }
  }
  if (letter < 8) {
    const rightId = getSquareId(letter + 1, num + 1);
    const rightSquare = board[rightId];
    if (rightSquare.isBlockPiece && rightSquare.piece === 'black_pawn') {
      possibleCaptures.push(rightId);
    }
  }
}

export function hasPossibleMoves(board) {
  for (let letter = 1; letter <= 8; letter++) {
    for (let num = 1; num <= 8; num++) {
      const { possibleMoves, possibleCaptures } = getPossibleMoves(board, letter, num);
      if (possibleMoves.length > 0 || possibleCaptures.length > 0) {
        return true;
      }
    }
  }
  return false;
}
