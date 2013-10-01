(function(root) {
  var Game = root.Game = (root.Game || {});

  Game.BOARD_SIZE = 20;

  var Snake = Game.Snake = function(board) {
    this.dir = "E";
    this.board = board;
    this.segments = [new Coord(10,10), new Coord(10,11), new Coord(10,12), new Coord(10,13), new Coord(10,14), new Coord(10,15)];//head's at [0]
  }

  Snake.prototype.move = function(){
    var added = Coord.plus(this.dir, this.segments[0]);

    if (this.hitSomething(added)) {
      this.board.endGame();
    }
    else {
      this.segments.unshift(added);

      this.board.changeChar(this.segments.pop(), "_");
      this.board.changeChar(added, "S");
    }
  };

  Snake.prototype.turn = function (direction) {
    this.dir = direction;
  };

  Snake.prototype.hitSomething = function (headCoord){

    var row = headCoord.row;
    var col = headCoord.col;

    if (row < 0 || col < 0 || row > Game.BOARD_SIZE-1 || col > Game.BOARD_SIZE-1){
      return true;
    }

    this.segments.forEach(function(coord){
      if (row === coord.row && col === coord.col) {
        return true;
      }

    });
    return false;
  }


  var Coord = Game.Coord = function(row, col) {
    this.row = row;
    this.col = col;
  }

  Coord.plus = function(direction, segment){
    row = segment.row
    col = segment.col
    switch(direction){
      //0,0 is at the top
    case "N":
      row -= 1;
      break;
    case "S":
      row += 1;
      break;
    case "E":
      col += 1;
      break;
    case "W":
      col -= 1;
      break;
    };

    return new Coord(row, col)
  };

  var Board = Game.Board = function() {
    this.snake = new Snake(this);
    this.board = this.createBoard();
    this.initializeSnake();
    this.intervalId;
    this.gameOver = false;
    this.appleSeen = false;
    this.apple = new Apple()
  }

  Board.prototype.createBoard = function () {
    var board = new Array(Game.BOARD_SIZE);
    for (var i = 0; i < board.length; i++) {
      board[i] = new Array(Game.BOARD_SIZE);
      for (var j = 0; j < board[i].length; j++) {
        board[i][j] = "_";
      }
    }


    return board;
  };

  Board.prototype.render = function () {
    var str = "";
    for (var i = 0; i < this.board.length; i++) {
      str += "|"
      for (var j = 0; j < this.board[i].length; j++) {
        str += this.board[i][j] + "|";
      }
      str += "\n";
    }

    return str;
  };

  Board.prototype.initializeSnake = function () {
    for(var i=0; i<this.snake.segments.length; i++){
      var row = this.snake.segments[i].row;
      var col = this.snake.segments[i].col;

      this.changeChar(this.snake.segments[i], "S")
    }

  };

  Board.prototype.putApple = function(){
    //is there an apple already
    //clock starts once apple is gone or the game starts

    if (!this.appleSeen){
      var x = parseInt(Math.random() * 20);
      var y = parseInt(Math.random() * 20);

      this.apple.updateCoord(new Coord(x,y));

      this.apple.display(this);
      this.appleSeen = true;
    }
  };

  Board.prototype.removeApple = function(){
    //is there an apple already
    //clock starts once apple is gone or the game starts
    this.apple.hide(this);
    this.appleSeen = false;
  };

  Board.prototype.changeChar = function (coord, symbol) {
    var row = coord.row;
    var col = coord.col;

    this.board[row][col] = symbol
  };


  Board.prototype.step = function () {
    this.snake.move();
    this.putApple();
  };

  Board.prototype.run = function () {
    var game = this;
    this.intervalId = setInterval(function(){
      game.step();
    }, 600)
  };

  Board.prototype.endGame = function () {
    var game = this;
    this.gameOver = true;
  };

  var Apple = Game.Apple = function() {
    //new Coord(10,10)
    this.coord;
  };


  Apple.prototype.display = function(board){
    //picks a coordinate
    //starts timer
    var that = this;

    setTimeout(function(){

      board.changeChar(that.coord, "A")
    }, Math.random());


  };

   //removes the apple from display
  Apple.prototype.hide = function(board){
    board.changeChar(this.coord, "_")
  };

  Apple.prototype.updateCoord = function(coord){
    this.coord = coord;
  };

})(this);

