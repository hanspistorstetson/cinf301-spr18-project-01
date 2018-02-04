function PuzzleGUI($container, dimension, size, margin, speed, num_shuffles, solveFunc, shuffleId, solveId) {
    this.$container = $container;
    this.dimension = dimension;
    this.size = size;
    this.margin = margin;
    this.speed = speed;
    this.num_shuffles = num_shuffles;
    this.solveFunc = solveFunc;
    this.puzzle = new Puzzle(dimension, solveFunc);
    this.shuffleId = shuffleId;
    this.solveId = solveId;

    this.drawBlocks();
    var self = this;
    var shuffleFunc = function () {
        $container.parent().find(this.shuffleId).attr("disabled", "disabled");
        $container.parent().find(this.solveId).attr("disabled", "disabled");
        self.shuffle(self.puzzle, self.num_shuffles, function () {
            $container.parent().find(this.shuffleId).removeAttr("disabled");
            $container.parent().find(this.solveId).removeAttr("disabled");
        });
    };
    $container.parent().find(this.shuffleId).on("click", shuffleFunc);
    shuffleFunc();
    $container.parent().find(this.solveId).on("click", function () {
        console.log("solve func");
        var path = self.puzzle.solve();
        $container.parent().find(this.shuffleId).attr("disabled", "disabled");
        $container.parent().find(this.solveId).attr("disabled", "disabled");
        self.solve(self.puzzle, path, function () {
            $container.parent().find(this.shuffleId).removeAttr("disabled");
            $container.parent().find(this.solveId).removeAttr("disabled");
        });
    });
    $container.find("div").on("click", function () {
        var id = $(this).attr("id");
        var num = parseInt(id.slice(1));
        var direction = self.puzzle.move(num);
        if (direction != null) {
            self.move(id, direction);
        }
    });
}

PuzzleGUI.prototype.drawBlocks = function () {
    for (var i = 0; i < this.dimension; i++) {
        for (var j = 0; j < this.dimension; j++) {
            if (!(i == this.dimension - 1 && j == this.dimension - 1)) {
                var id = i * this.dimension + j + 1;
                this.$container.append("<div id='c" + id + "'>" + id + "</div>");
                var $e = this.$container.find("#c" + id);
                $e.css("left", j * (this.size + this.margin));
                $e.css("top", i * (this.size + this.margin));
                $e.css("width", this.size + "px");
                $e.css("height", this.size + "px");
                $e.css("font-size", this.size * 0.7);
                $e.css("background-color", "#0d4477");
            }
        }
        this.$container.append("<br/>");
    }
    this.$container.css("width", (this.size + this.margin) * this.dimension);
    this.$container.css("height", (this.size + this.margin) * this.dimension);
}

PuzzleGUI.prototype.move = function (id, direction) {
    console.log("#" + id);
    var block = this.$container.find("#" + id);
    var distance = this.size + this.margin;
    switch (direction) {
        case Direction.LEFT:
            block.animate({
                left: "-=" + distance + "px"
            }, this.speed);
            break;
        case Direction.RIGHT:
            block.animate({
                left: "+=" + distance + "px"
            }, this.speed);
            break;
        case Direction.UP:
            block.animate({
                top: "-=" + distance + "px"
            }, this.speed);
            break;
        case Direction.DOWN:
            block.animate({
                top: "+=" + distance + "px"
            }, this.speed);
            break;
    }
}

PuzzleGUI.prototype.randomMove = function (puzzle, lastMove) {
    var allowedMoves = puzzle.getAllowedMoves();
    var rand;
    do {
        rand = Math.floor(Math.random() * allowedMoves.length);
    } while (lastMove == allowedMoves[rand]);
    var movingBlock = allowedMoves[rand];
    var direction = puzzle.move(movingBlock);
    this.move("c" + movingBlock, direction);
    return movingBlock;
}

PuzzleGUI.prototype.shuffle = function (puzzle, times, callbackFunction, lastMove) {
    if (times <= 0) {
        callbackFunction();
        return;
    }
    var movedBlock = this.randomMove(puzzle, lastMove);
    var self = this;
    setTimeout(function () {
        self.shuffle(puzzle, times - 1, callbackFunction, movedBlock);
    }, this.speed);
}

PuzzleGUI.prototype.solve = function (puzzle, path, callbackFunction) {
    console.log("solve");
    if (path.length == 0) {
        callbackFunction();
        return;
    }
    var movingBlock = path.shift();
    var direction = puzzle.move(movingBlock);
    this.move("c" + movingBlock, direction);
    var self = this;
    setTimeout(function () {
        self.solve(puzzle, path, callbackFunction);
    }, this.speed);
}
