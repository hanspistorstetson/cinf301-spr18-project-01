let allBtns = [
  "button0",
  "button1",
  "button2",
  "button3",
  "button4",
  "button5",
  "button6",
  "button7",
  "button8"
];

function getEmpty() {
  for (let i = 0; i < 9; i++) {
    if ($("#" + allBtns[i]).text() == "") {
      return allBtns[i];
    }
  }
}

function isMoveable(btnId) {
  toButtonNumber = [];
  btnIdNumber = parseInt(btnId[btnId.length - 1]);
  // The rightside of the board can move up three, down three, or left 1
  if ([2, 5, 8].includes(btnIdNumber)) {
    toButtonNumber = [+3, -3, -1];
  }
  // The right side of the board can move up three, down three, or right 1
  if ([0, 3, 6].includes(btnIdNumber)) {
    toButtonNumber = [+3, -3, +1];
  }
  // The Middle of the board can move up three, down three, left 1 and right 1
  if ([1, 4, 7].includes(btnIdNumber)) {
    toButtonNumber = [+3, -3, -1, +1];
  }

  for (let i = 0; i < toButtonNumber.length; i++) {
    if (btnIdNumber + toButtonNumber[i] == getEmpty()[getEmpty().length - 1]) {
      return true;
    }
  }

  return false;
}

function pushTile(tileId) {
  $("#" + getEmpty()).text($("#" + tileId).text());
  $("#" + tileId).text("");
}

function checkState() {
  for (let i = 0; i < 8; i++) {
    if ($("#button" + i).text() != i + 1) {
      return false;
    }
  }
  return true;
}

function move(tileId) {
  let emptyTile = getEmpty();
  if ($("#" + tileId).text() != " ") {
    let moveable = isMoveable(tileId);
    pushTile(tileId);
  }
  if (checkState()) {
    $("#solved").text("Solved!");
  } else {
    $("#solved").text("");
  }
}

function updateHTML() {
  let board = puzzle.board;
  for (i = 0; i < puzzle.dimension; i++) {
    for (j = 0; j < puzzle.dimension; j++) {
      if (board[i][j] != 0) {
        document.getElementById(
          "button" + (i * puzzle.dimension + j)
        ).innerHTML =
          board[i][j];
      } else {
        document.getElementById(
          "button" + (i * puzzle.dimension + j)
        ).innerHTML =
          " ";
      }
    }
  }
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomize() {
  do {
    let nums = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    nums = shuffle(nums);
    for (let i = 0; i < 9; i++) {
      if (nums[i] != 0) {
        $("#button" + i).text(nums[i]);
      } else {
        $("#button" + i).text("");
      }
    }
  } while (!solveable);
}

function solveable() {
  inversionCount = 0;
  var item1, item2;
  for (i = 0; i < allBtns.length - 1; i++) {
    if (document.getElementById(allBtns[i]).innerHTML == " ") {
      item1 = 0;
    } else {
      item1 = document.getElementById(allBtns[i]).innerHTML;
    }
    for (j = i + 1; j < allBtns.length; j++) {
      if (document.getElementById(allBtns[j]).innerHtml == " ") {
        item2 = 0;
      } else {
        item2 = document.getElementById(allBtns[j]).innerHtml;
      }
      if (item1 && item2 && item1 > item2) {
        inversionCount++;
      }
    }
  }

  return inversionCount % 2 == 0;
}
