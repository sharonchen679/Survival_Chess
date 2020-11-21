////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
// useful:
var first_move = true;
var game_is_over = false;
var difficulty = localStorage.difficulty; // between 1 to 4 (1 is the hardest)
var score = 0;
var captures_in_a_row = 0;
var letters = ['0','A','B','C','D','E','F','G','H']; // index 0 is unused
function in_range(letter,num)   {return letter>=1 && letter<=8 && num>=1 && num<=8;}
function get_square(letter,num) {return in_range(letter,num)? document.getElementById(letters[letter]+num) : null;}
function get_piece_type(square) {return square.classList.item(2);}
function get_piece_to_move()    {return document.getElementsByClassName("piece_to_move").item(0);}
function update_score()         {document.getElementById("score").innerHTML = "score: " + score;}
function set_score_text(string) {document.getElementById("score_text").innerHTML = string;}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready( function() {
    // put pieces on board: (board is already defined by HTML)
    // 1st row
    get_square(1,1).classList.add("white_rook"  );
    get_square(2,1).classList.add("white_knight");
    get_square(3,1).classList.add("white_bishop");
    get_square(4,1).classList.add("white_queen" );
    get_square(5,1).classList.add("white_king"  );
    get_square(6,1).classList.add("white_bishop");
    get_square(7,1).classList.add("white_knight");
    get_square(8,1).classList.add("white_rook"  );
    //2nd row
    for(var letter=1; letter<=8; letter++)
        get_square(letter,2).classList.add("white_pawn");
    //rest
    for(var num=3; num<=8; num++)
        for(var letter=1; letter<=8; letter++)
            get_square(letter,num).classList.add("empty");
//define on-click listeners for squares
    for(var letter=1; letter<=8; letter++)
        for(var num=1; num<=8; num++)
            get_square(letter,num).addEventListener("click", function() {
                if(!game_is_over) play(this);
            });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
// main function - activated by clicking on a specific square
function play(square) {
    if(square.classList.contains("possible_move")) {
        move_to(square);
        if(first_move) {
            add_blocks();
            first_move=false;
            return;
        }
        if(Math.floor(Math.random()*difficulty) == 0) { // equals TRUE with probability of 1/difficulty
            board_down();
            add_blocks();
        }
        captures_in_a_row = 0;
        set_score_text("");
        if(no_possible_moves())
            game_over();
    }
    else if(square.classList.contains("possible_capture")) {
        capture(square);
        bonus = clear_blocks(square);
        captures_in_a_row++;
        score += Math.pow(2,captures_in_a_row-1); // 1st = 1 point, 2nd = 2 points, 3rd = 4, 4th = 8, 5th = 16, ...
        update_score();
        set_score_text("captures in a row: "+ captures_in_a_row + bonus);
        // at this point, there is always a possible move, so no need to check it
        // (same piece goes back to the previous square)        
    }
    else { //first click
        var letter = letters.indexOf(square.id.charAt(0));
        var num = parseInt(square.id.charAt(1));
        show_possible_moves(letter,num);
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
// moving on board:
function move_to(square) { // assuming square is a legal move
    let piece_to_move = get_piece_to_move();
    piece_type = get_piece_type(piece_to_move);
    piece_to_move.classList.remove("piece_to_move");
    piece_to_move.classList.remove(piece_type);
    piece_to_move.classList.add("empty");
    square.classList.remove("empty");
    square.classList.add(piece_type);
    clear_last_click();
}

function capture(square) { // assuming square is a legal capture
    square.classList.remove("block_piece");
    square.classList.remove(get_piece_type(square));
    square.classList.add("empty");
    move_to(square);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
// marking squares:
function mark_possible_move(letter,num) {
    let square = get_square(letter,num);
    if(square == null) return; // out of range
    if(square.classList.contains("empty")) {
        square.classList.add("possible_move");
        return true;
    }
    return false;
}

function mark_possible_capture(letter,num,piece_type) {
    let square = get_square(letter,num);
    if(square == null) return; // out of range
    if(square.classList.contains("black_"+piece_type))
        square.classList.add("possible_capture");
}

function mark(letter,num,piece_type) { // anyway
    if(!mark_possible_move(letter,num))
        mark_possible_capture(letter,num,piece_type);
}

function clear_last_click() { // unmark all squares
    for(var letter=1; letter<=8; letter++)
        for(var num=1; num<=8; num++) {
            get_square(letter,num).classList.remove("possible_move");
            get_square(letter,num).classList.remove("possible_capture");
        }
    let piece_to_move = get_piece_to_move();
    if(piece_to_move != null) piece_to_move.classList.remove("piece_to_move");
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
// move rules:
function show_possible_moves(letter, num) {
    clear_last_click();
    let square  = get_square(letter,num);
    if(square.classList.contains("empty") || square.classList.contains("block") 
    || square.classList.contains("block_piece")) return; // cannot move

    square.classList.add("piece_to_move"); // mark
    switch(get_piece_type(square)) {
        case "white_king":   king_moves(letter,num);            break;
        case "white_queen":  queen_moves(letter,num);           break;
        case "white_rook":   rook_moves(letter,num,"rook");     break;
        case "white_bishop": bishop_moves(letter,num,"bishop"); break;
        case "white_knight": knight_moves(letter,num);          break;
        case "white_pawn":   pawn_moves(letter,num);            break;
    }
}
function king_moves(letter,num) {
    mark(letter-1, num-1, "king");
    mark(letter,   num-1, "king");
    mark(letter+1, num-1, "king");
    mark(letter-1, num,   "king");
    mark(letter+1, num,   "king");
    mark(letter-1, num+1, "king");
    mark(letter,   num+1, "king");
    mark(letter+1, num+1, "king");
}

function queen_moves(letter,num) {
    rook_moves(letter,num,"queen");
    bishop_moves(letter,num,"queen");
}

function rook_moves(letter,num,piece_type) {
    //left
    for(var col=letter-1; in_range(col,num) ;col--)
        if(!mark_possible_move(col,num)) { // something is blocking the way
            mark_possible_capture(col,num,piece_type); // maybe can capture it
            break; // stop anyway (cannot jump over pieces)
        }
    //similar code for other directions:
    for(var col=letter+1; in_range(col,num) ;col++) //right
        if(!mark_possible_move(col,num)) {mark_possible_capture(col,num,piece_type); break;}
    for(var row=num-1; in_range(letter,row) ;row--) //down        
        if(!mark_possible_move(letter,row)) {mark_possible_capture(letter,row,piece_type); break;}
    for(var row=num+1; in_range(letter,row) ;row++) //up
        if(!mark_possible_move(letter,row)) {mark_possible_capture(letter,row,piece_type); break;}
}

function bishop_moves(letter,num,piece_type) {
    //up left
    for(var col=letter-1, row=num+1; in_range(col,row) ;col--,row++)
        if(!mark_possible_move(col,row)) { // something is blocking the way
            mark_possible_capture(col,row,piece_type); // maybe can capture it
            break; // stop anyway (cannot jump over pieces)
        }
    //similar code for other directions:
    for(var col=letter-1, row=num-1; in_range(col,row) ;col--,row--) //down left
        if(!mark_possible_move(col,row)) {mark_possible_capture(col,row,piece_type); break;}
    for(var col=letter+1, row=num+1; in_range(col,row) ;col++,row++) //up right        
        if(!mark_possible_move(col,row)) {mark_possible_capture(col,row,piece_type); break;}
    for(var col=letter+1, row=num-1; in_range(col,row) ;col++,row--) //down right        
        if(!mark_possible_move(col,row)) {mark_possible_capture(col,row,piece_type); break;}
}

function knight_moves(letter,num) {
    mark(letter-1, num-2, "knight");
    mark(letter-1, num+2, "knight");
    mark(letter-2, num-1, "knight");
    mark(letter-2, num+1, "knight");
    mark(letter+1, num-2, "knight");
    mark(letter+1, num+2, "knight");
    mark(letter+2, num-1, "knight");
    mark(letter+2, num+1, "knight");
}

function pawn_moves(letter,num) {
    if(num==8) return; // nowhere to go
    one_step = mark_possible_move(letter,num-(-1));
    if(num == 2 && one_step) // first row of pawn, double step is possible
        mark_possible_move(letter,num+2);
    mark_possible_capture(letter-1, num+1, "pawn");    // possible left capture
    mark_possible_capture(letter+1, num+1, "pawn"); // possible right capture
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
// moving blocks down
function board_down() {
    for(var start=2; start<=8; start++)  { // find lowest row of blocks
        var square = get_square(1,start);
        if(square.classList.contains("block") || square.classList.contains("block_piece"))
            break; // found it
    }
    if(get_square(1,start) == null) { // no blocks - nothing to move
        //stiil need to check 8th row for white pieces (row of blocks is coming)
        for(var letter=1; letter<=8; letter++) {
            var square = get_square(letter,8);
            if(!square.classList.contains("empty"))
                lose_piece(square);
        }
        return;
    }
    for(var num=start-1; num<=7; num++) // row 8 remains empty
        for(var letter=1; letter<=8; letter++) {
            var square = get_square(letter,num);
            var above = get_square(letter,num+1);
            if(!square.classList.contains("empty") && // contains white piece
                (above.classList.contains("block") || above.classList.contains("block_piece")))
                    lose_piece(square);
            copy_from_above(square,above);
        }
    if(start == 2) {
        add_blocks(); 
        game_over();
    }
}

function lose_piece(square) {
    square.classList.remove(get_piece_type(square)); // remove white piece
    square.classList.add("empty");
}

function copy_from_above(square,above) { // assuming square is always empty
    if(above.classList.contains("empty")) return // nothing to copy
    square.classList.remove("empty");

    let piece_type = get_piece_type(above);
    square.classList.add(piece_type);
    if(above.classList.contains("block_piece")) {
        square.classList.add("block_piece");
        above.classList.remove("block_piece");
    }
    above.classList.remove(piece_type);        
    above.classList.add("empty"); // make empty for next copy
    // else: above contains white piece - don't copy
}

function add_blocks() { // assuming row 8 is empty
    let random_index = (Math.floor(Math.random()*8))+1; // between 1 to 8
    for(var letter=1; letter<=8; letter++) {
        var square = get_square(letter,8); // always on the 8th row
        square.classList.remove("empty");
        if(letter != random_index)
            square.classList.add("block");
        else { // choose random black piece
            switch((Math.floor(Math.random()*6))) {
                case 0: square.classList.add("black_king"); break;
                case 1: square.classList.add("black_queen"); break;
                case 2: square.classList.add("black_rook"); break;
                case 3: square.classList.add("black_bishop"); break;
                case 4: square.classList.add("black_knight"); break;
                case 5: square.classList.add("black_pawn"); break;
            }
            square.classList.add("block_piece");
        }
    }
}

function clear_blocks(captured_square) {
    let piece_index = letters.indexOf(captured_square.id.charAt(0));
    for(var letter = 1; letter<=8; letter++) // go over row
        if(letter != piece_index) {
            let square = get_square(letter,captured_square.id.charAt(1));
            square.classList.remove("block");
            square.classList.add("empty");
        }
    if(document.getElementsByClassName("block").item(0) == null) { // no more blocks     
        let bonus = (6-difficulty); // bonus is between 2 to 5 points according to difficulty
        score += bonus; // spacial score
        update_score();
        return (" + BONUS: " + bonus);
    }
    return ""; // no bonus
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
// end game
function no_possible_moves() {
    let result = true;
    for(var letter=1; letter<=8; letter++)
        for(var num=1; num<=8; num++) {
            show_possible_moves(letter,num);
            if( document.getElementsByClassName("possible_move").item(0) != null
            || document.getElementsByClassName("possible_capture").item(0) != null) {
                result = false;
                break;
            }
        }
    clear_last_click();
    return result;
}

function game_over() {
    let score_text = document.getElementById("score_text");
    score_text.innerHTML = "GAME OVER";
    game_is_over = true; // squares' listeners are now off
}