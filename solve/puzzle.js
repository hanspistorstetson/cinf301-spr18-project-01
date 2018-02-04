let allBtns = ["button0", "button1", "button2", "button3", "button4", "button5", "button6", "button7", "button8",];

let puzzle = null;


/**
 * @fileOverview Implementation of a min heap.  Allows a comparator
 * to be provided so that the heap may contain objects that involve a
 * more complex comparison.
 */

/**
 * Implementation of a min heap allowing for a comparator
 * to be provided so that the heap may contain objects that involve a
 * more complex comparison.
 * <br>
 * This constructor constructs a MinHeap instance and takes two optional
 * parameters: an array and comparator.  If the array is provided, it
 * will be used as the backing store for the heap. Therefore, all
 * operations on the heap will be reflected in the provided array.
 * Usage
 * @example
 * Sample Usage:
 var heapq = new MinHeap();
 heapq.push(5);
 heapq.push(2);
 heapq.push(1);
 heapq.pop()); // returns 1
 heapq.pop()); // returns 2
 * @param array Array to use heapify or null to start with an empty
 * heap.
 * @param comparator alternate comparator used to compare each
 * item within the heap.  If not provided, the default will perform
 * a simple comparison on the item.
 *
 * @returns instance of MinHeap
 * @constructor
 */
function MinHeap(array, comparator) {

    /**
     * Storage for heap.
     * @private
     */
    this.heap = array || new Array();

    /**
     * Default comparator used if an override is not provided.
     * @private
     */
    this.compare = comparator || function (item1, item2) {
        return item1 == item2 ? 0 : item1 < item2 ? -1 : 1;
    };

    /**
     * Retrieve the index of the left child of the node at index i.
     * @private
     */
    this.left = function (i) {
        return 2 * i + 1;
    };
    /**
     * Retrieve the index of the right child of the node at index i.
     * @private
     */
    this.right = function (i) {
        return 2 * i + 2;
    };
    /**
     * Retrieve the index of the parent of the node at index i.
     * @private
     */
    this.parent = function (i) {
        return Math.ceil(i / 2) - 1;
    };

    /**
     * Ensure that the contents of the heap don't violate the
     * constraint.
     * @private
     */
    this.heapify = function (i) {
        var lIdx = this.left(i);
        var rIdx = this.right(i);
        var smallest;
        if (lIdx < this.heap.length
            && this.compare(this.heap[lIdx], this.heap[i]) < 0) {
            smallest = lIdx;
        } else {
            smallest = i;
        }
        if (rIdx < this.heap.length
            && this.compare(this.heap[rIdx], this.heap[smallest]) < 0) {
            smallest = rIdx;
        }
        if (i != smallest) {
            var temp = this.heap[smallest];
            this.heap[smallest] = this.heap[i];
            this.heap[i] = temp;
            this.heapify(smallest);
        }
    };

    /**
     * Starting with the node at index i, move up the heap until parent value
     * is less than the node.
     * @private
     */
    this.siftUp = function (i) {
        var p = this.parent(i);
        if (p >= 0 && this.compare(this.heap[p], this.heap[i]) > 0) {
            var temp = this.heap[p];
            this.heap[p] = this.heap[i];
            this.heap[i] = temp;
            this.siftUp(p);
        }
    };

    /**
     * Heapify the contents of an array.
     * This function is called when an array is provided.
     * @private
     */
    this.heapifyArray = function () {
        // for loop starting from floor size/2 going up and heapify each.
        var i = Math.floor(this.heap.length / 2) - 1;
        for (; i >= 0; i--) {
            //	jstestdriver.console.log("i: ", i);
            this.heapify(i);
        }
    };

    // If an initial array was provided, then heapify the array.
    if (array != null) {
        this.heapifyArray();
    }
    ;
}

/**
 * Place an item in the heap.
 * @param item
 * @function
 */
MinHeap.prototype.push = function (item) {
    this.heap.push(item);
    this.siftUp(this.heap.length - 1);
};

/**
 * Insert an item into the heap.
 * @param item
 * @function
 */
MinHeap.prototype.insert = function (item) {
    this.push(item);
};

/**
 * Pop the minimum valued item off of the heap. The heap is then updated
 * to float the next smallest item to the top of the heap.
 * @returns the minimum value contained within the heap.
 * @function
 */
MinHeap.prototype.pop = function () {
    var value;
    if (this.heap.length > 1) {
        value = this.heap[0];
        // Put the bottom element at the top and let it drift down.
        this.heap[0] = this.heap.pop();
        this.heapify(0);
    } else {
        value = this.heap.pop();
    }
    return value;
};

/**
 * Remove the minimum item from the heap.
 * @returns the minimum value contained within the heap.
 * @function
 */
MinHeap.prototype.remove = function () {
    return this.pop();
};


/**
 * Returns the minimum value contained within the heap.  This will
 * not remove the value from the heap.
 * @returns the minimum value within the heap.
 * @function
 */
MinHeap.prototype.getMin = function () {
    return this.heap[0];
};

/**
 * Return the current number of elements within the heap.
 * @returns size of the heap.
 * @function
 */
MinHeap.prototype.size = function () {
    return this.heap.length;
};


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

Algorithm = {
    BFS: "BFS",
    AOutOfPlace: "A* Out Of Place",
    AManHatten: "A* Manhattan Distance"

}
;

function Puzzle(dimension, solveFunc) {
    this.board = [];
    this.path = [];
    this.dimension = dimension;
    this.lastMove = null;
    this.solveFunc = solveFunc;
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

Puzzle.prototype.getPosition = function (val) {
    for (var i = 0; i < this.dimension; i++) {
        for (var j = 0; j < this.dimension; j++) {
            if (this.board[i][j] == val) {
                return [i, j];
            }
        }
    }
};

// Get the (x, y) position of the blank space
Puzzle.prototype.getBlankSpacePosition = function () {
    return this.getPosition(0);
};

// Swap two items on a bidimensional array
Puzzle.prototype.swap = function (i1, j1, i2, j2) {
    var temp = this.board[i1][j1];
    this.board[i1][j1] = this.board[i2][j2];
    this.board[i2][j2] = temp;
}

// Return the direction that a piece can be moved, if any
Puzzle.prototype.getMove = function (piece) {
    var blankSpacePosition = this.getBlankSpacePosition();
    var line = blankSpacePosition[0];
    var column = blankSpacePosition[1];
    if (line > 0 && piece == this.board[line - 1][column]) {
        return Direction.DOWN;
    } else if (line < this.dimension - 1 && piece == this.board[line + 1][column]) {
        return Direction.UP;
    } else if (column > 0 && piece == this.board[line][column - 1]) {
        return Direction.RIGHT;
    } else if (column < this.dimension - 1 && piece == this.board[line][column + 1]) {
        return Direction.LEFT;
    }
};

// Move a piece, if possible, and return the direction that it was moved
Puzzle.prototype.move = function (piece) {
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

Puzzle.prototype.isGoalState = function () {
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
Puzzle.prototype.getCopy = function () {
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
Puzzle.prototype.getAllowedMoves = function () {
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

Puzzle.prototype.visit = function () {
    var children = [];
    var allowedMoves = this.getAllowedMoves();
    for (var i = 0; i < allowedMoves.length; i++) {
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

Puzzle.prototype.solveBFS = function () {
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

Puzzle.prototype.solveAOutOfPlace = function () {
    console.log("solve");
    var states = new MinHeap(null, function (a, b) {
        return a.distance - b.distance;
    })
    this.path = []
    states.push({puzzle: this, distance: 0});
    while (states.size() > 0) {
        console.log("pop");
        var state = states.pop().puzzle;
        if (state.isGoalState()) {
            return state.path;
        }

        var children = state.visit();
        for (i = 0; i < children.length; i++) {
            var child = children[i];
            var f = child.g() + child.hOutOfPlace();
            states.push({puzzle: child, distance: f});
        }
    }
};

Puzzle.prototype.solveAManhattan = function () {
    console.log("solve");
    var states = new MinHeap(null, function (a, b) {
        return a.distance - b.distance;
    })
    this.path = []
    states.push({puzzle: this, distance: 0});
    while (states.size() > 0) {
        var state = states.pop().puzzle;
        if (state.isGoalState()) {
            return state.path;
        }

        var children = state.visit();
        for (i = 0; i < children.length; i++) {
            var child = children[i];
            var f = child.g() + child.hManhattan();
            states.push({puzzle: child, distance: f});
        }
    }
};

Puzzle.prototype.g = function () {
    return this.path.length;
}

Puzzle.prototype.hOutOfPlace = function () {
    var count = 0;
    for (var i = 0; i < this.dimension; i++) {
        for (var j = 0; j < this.dimension; j++) {
            var piece = this.board[i][j];
            if (piece != 0) {
                var originalLine = Math.floor((piece - 1) / this.dimension);
                var originalColumn = (piece - 1) % this.dimension;
                if (i != originalLine || j != originalColumn) count++;
            }
        }
    }
    return count;
};

Puzzle.prototype.hManhattan = function () {
    var distance = 0;
    for (var i = 0; i < this.dimension; i++) {
        for (var j = 0; j < this.dimension; j++) {
            var piece = this.board[i][j];
            if (piece != 0) {
                var originalLine = Math.floor((piece - 1) / this.dimension);
                var originalColumn = (piece - 1) % this.dimension;
                distance += Math.abs(i - originalLine) + Math.abs(j - originalColumn);
            }
        }
    }
    return distance;
};
Puzzle.prototype.solve = function () {
    if (this.solveFunc == Algorithm.BFS) {
        return this.solveBFS();
    } else if (this.solveFunc == Algorithm.AOutOfPlace) {
        console.log(Algorithm.AOutOfPlace);
        return this.solveAOutOfPlace();
    } else if (this.solveFunc == Algorithm.AManHatten) {
        return this.solveAManhattan();
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
