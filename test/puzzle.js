let allBtns = ["button0", "button1", "button2", "button3", "button4", "button5", "button6", "button7", "button8", ];

let puzzle = null;

function move(tile) {
    let val = parseInt(document.getElementById(tile).innerText)
    puzzle.move(val);
    updateHTML();
}

function updateHTML() {
    let board = puzzle.board;
    for (i = 0; i < puzzle.dimension; i++) {
        for (j = 0; j < puzzle.dimension; j++) {
            if (board[i][j] != 0) {
                document.getElementById("button" + (i * puzzle.dimension + j)).innerHTML = board[i][j];
            } else {
                document.getElementById("button" + (i * puzzle.dimension + j)).innerHTML = " ";
            }
        }
    }
}

function randomize() {
    puzzle = new Puzzle(3);
    let val = "";
    for (i = 0; i < puzzle.dimension; i++) {
        for (j = 0; j < puzzle.dimension; j++) {
            if (puzzle.board[i][j] == 0) {
                val = " ";
            } else {
                val = puzzle.board[i][j];
            }
            document.getElementById(allBtns[i * puzzle.dimension + j]).innerHTML = val;

        }
    }

}



Direction = {
    LEFT: "left",
    RIGHT: "right",
    UP: "up",
    DOWN: "down"
};
function Puzzle(dimension) {
    this.board = [];
    this.path = [];
    this.dimension = dimension;
    this.lastMove = null;
    for (var i = 0; i < dimension; i++) {
        this.board.push([]);
        for (var j = 0; j < dimension; j++) {
            if (i == this.dimension - 1 && j == this.dimension - 1) {
                this.board[i].push(0);
            } else {
                this.board[i].push(dimension * i + j + 1);
            }
        }
    }

};

Puzzle.prototype.getPosition = function(val) {
    for (var i = 0; i < this.dimension; i++) {
        for (var j = 0; j < this.dimension; j++) {
            if (this.board[i][j] == val) {
                return [i, j];
            }
        }
    }
};

// Get the (x, y) position of the blank space
Puzzle.prototype.getBlankSpacePosition = function() {
    return this.getPosition(0);
};

// Swap two items on a bidimensional array
Puzzle.prototype.swap = function(i1, j1, i2, j2) {
    var temp = this.board[i1][j1];
    this.board[i1][j1] = this.board[i2][j2];
    this.board[i2][j2] = temp;
}

// Return the direction that a piece can be moved, if any
Puzzle.prototype.getMove = function(piece) {
    var blankSpacePosition = this.getBlankSpacePosition();
    var line = blankSpacePosition[0];
    var column = blankSpacePosition[1];
    if (line > 0 && piece == this.board[line-1][column]) {
        return Direction.DOWN;
    } else if (line < this.dimension - 1 && piece == this.board[line+1][column]) {
        return Direction.UP;
    } else if (column > 0 && piece == this.board[line][column-1]) {
        return Direction.RIGHT;
    } else if (column < this.dimension - 1 && piece == this.board[line][column+1]) {
        return Direction.LEFT;
    }
};

// Move a piece, if possible, and return the direction that it was moved
Puzzle.prototype.move = function(piece) {
    var move = this.getMove(piece);
    if (move != null) {
        var blankSpacePosition = this.getBlankSpacePosition();
        var line = blankSpacePosition[0];
        var column = blankSpacePosition[1];
        switch (move) {
            case Direction.LEFT:
                this.swap(line, column, line, column + 1);
                break;
            case Direction.RIGHT:
                this.swap(line, column, line, column - 1);
                break;
            case Direction.UP:
                this.swap(line, column, line + 1, column);
                break;
            case Direction.DOWN:
                this.swap(line, column, line - 1, column);
                break;
        }
        if (move != null) {
            this.lastMove = piece;
        }
        return move;
    }
};

Puzzle.prototype.isGoalState = function() {
    for (var i = 0; i < this.dimension; i++) {
        for (var j = 0; j < this.dimension; j++) {
            var piece = this.board[i][j];
            if (piece != 0) {
                var originalLine = Math.floor((piece - 1) / this.dimension);
                var originalColumn = (piece - 1) % this.dimension;
                if (i != originalLine || j != originalColumn) return false;
            }
        }
    }
    return true;
};

// Return a copy of current puzzle
Puzzle.prototype.getCopy = function() {
    var newPuzzle = new Puzzle(this.dimension);
    for (var i = 0; i < this.dimension; i++) {
        for (var j = 0; j < this.dimension; j++) {
            newPuzzle.board[i][j] = this.board[i][j];
        }
    }
    for (var i = 0; i < this.path.length; i++) {
        newPuzzle.path.push(this.path[i]);
    }
    return newPuzzle;
};

// Return all current allowed moves
Puzzle.prototype.getAllowedMoves = function() {
    var allowedMoves = [];
    for (var i = 0; i < this.dimension; i++) {
        for (var j = 0; j < this.dimension; j++) {
            var piece = this.board[i][j];
            if (this.getMove(piece) != null) {
                allowedMoves.push(piece);
            }
        }
    }
    return allowedMoves;
};

Puzzle.prototype.visit = function() {
    var children = [];
    var allowedMoves = this.getAllowedMoves();
    for (var i = 0; i < allowedMoves.length; i++)  {
        var move = allowedMoves[i];
        if (move != this.lastMove) {
            var newInstance = this.getCopy();
            newInstance.move(move);
            newInstance.path.push(move);
            children.push(newInstance);
        }
    }
    return children;
};

Puzzle.prototype.solve = function() {
    var startingState = this.getCopy();
    startingState.path = [];
    var states = [startingState];
    while (states.length > 0) {
        var state = states[0];
        states.shift();
        if (state.isGoalState()) {
            return state.path;
        }
        states = states.concat(state.visit());
    }
};

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}
