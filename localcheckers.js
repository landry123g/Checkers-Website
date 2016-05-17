//Initilize variables
var canvas = document.getElementById("myCanvas");
canvas.addEventListener("mousedown",getPos,false);
var ctx = canvas.getContext("2d");

var FPS = 30;

function Board(width,height) {
	this.width = width;
	this.height = height;
	this.checkers = [];
	this.selection = null;
	this.jumpable = null;
	
	this.drawSquares = function() {
		for(y = 0; y < this.height; y++) {
			for(x = 0; x < this.width; x++) {
				if(y % 2 == 0) {
					if(x % 2 == 1) {
						ctx.fillStyle = "white";
						ctx.fillRect(x*64,y*64,64,64);
					} else {
						ctx.fillStyle = "black";
						ctx.fillRect(x*64,y*64,64,64);
					}
				} else {
					if(x % 2 == 0) {
						ctx.fillStyle = "white"
						ctx.fillRect(x*64,y*64,64,64);
					} else {
						ctx.fillStyle = "black";
						ctx.fillRect(x*64,y*64,64,64);
					}
				}
			}
		}
	}
	
	this.createBoard = function() {
		//Draw the board tiles
		this.drawSquares();
		
		//Draw red checkers and place them in starting positions
		for(y = 0; y < 3; y++) {
			for(x = 0; x < 8; x++) {
				if(y % 2 == 0) {
					if(x % 2 == 1) {
						var checker = new Checker(x*64,y*64,"red");
						this.checkers.push(checker);
					}
				} else {
					if(x % 2 == 0) {
						var checker = new Checker(x*64,y*64,"red");
						this.checkers.push(checker);
					}
				}
			}
		}
		
		//Draw black checkers and place them in starting positions
		for(y = 0; y < 3; y++) {
			for(x = 0; x < 8; x++) {
				if(y % 2 == 1) {
					if(x % 2 == 1) {
						var checker = new Checker(x*64,(y+5)*64,"black");
						this.checkers.push(checker);
					}
				} else {
					if(x % 2 == 0) {
						var checker = new Checker(x*64,(y+5)*64,"black");
						this.checkers.push(checker);
					}
				}
			}
		}
	}
	
	//Draws the checkers and also draws the selection box + possible moves
	this.drawCheckers = function() {
		this.drawSquares();
		for(var checker of this.checkers) {
			checker.draw();			
		}
		if(this.selection != null) {
			//selection box
			ctx.beginPath();
			ctx.strokeStyle = "green";
			ctx.lineWidth = "5";
			ctx.rect(this.selection.x,this.selection.y,64,64);
			ctx.stroke();
			
			//possible moves
			if(this.selection.color == "red") {
				var bl = true;
				var br = true;
				var bll = true;
				var brr = true;
			} else {
				var bl = false;
				var br = false;
				var bll = false;
				var brr = false;
			}
			if(this.selection.color == "black") {
				var tl = true;
				var tr = true;
				var tll = true;
				var trr = true;
			} else {
				var tl = false;
				var tr = false;
				var tll = false;
				var trr = false;
			}
			
			for(var checker of this.checkers) {
				if(this.selection.color == "red") {
					if(checker.x == this.selection.x+64) {
						if(checker.y == this.selection.y+64) {
							br = false;
							
							if(checker.color == "black") {
								if(checker.x == this.selection.x+64 && checker.y == this.selection.y+64) {
									for(var checker2 in this.checkers) {
										if(checker2.x == this.selection.x+128) {
											if(checker2.y == this.selection.y+128) {
												brr = false;
											}
										}
									}
								}
								
								if(brr) {
									this.jumpable = checker;
								}
							} else {
								brr = false;
							}
						}
					}
					if(checker.x == this.selection.x-64) {
						if(checker.y == this.selection.y+64) {
							bl = false;
							
							if(checker.color == "black") {
								if(checker.x == this.selection.x-64 && checker.y == this.selection.y+64) {
									for(var checker2 in this.checkers) {
										if(checker2.x == this.selection.x-128) {
											if(checker2.y == this.selection.y+128) {
												bll = false;
											}
										}
									}
								}
								
								if(bll) {
									this.jumpable = checker;
								}
							} else {
								bll = false;
							}
						}
					}
				}
				if(this.selection.color == "black") {
					if(checker.x == this.selection.x+64) {
						if(checker.y == this.selection.y-64) {
							tr = false;
						}
					}
					if(checker.x == this.selection.x-64) {
						if(checker.y == this.selection.y-64) {
							tl = false;
						}
					}
				}
			}
			
			ctx.fillStyle = "green";
			//draw possible moves and move checker there.
			if(bl) {
				bll = false;
				ctx.fillRect(this.selection.x-64,this.selection.y+64,64,64);
				//Move the checker to the bottom left if clicked.
				if(mPos.x <= this.selection.x && mPos.x >= this.selection.x-64) {
					if(mPos.y <= this.selection.y+128 && mPos.y >= this.selection.y+64) {
						this.selection.x -= 64;
						this.selection.y += 64;
						this.selection = null;
					}
				}
			}
			if(bll) {
					ctx.fillRect(this.selection.x-128,this.selection.y+128,64,64);
					if(mPos.x >= this.selection.x-128 && mPos.x <= this.selection.x-64) {
						console.log("made it");
						if(mPos.y <= this.selection.y+192 && mPos.y >= this.selection.y+128) {
							this.selection.x -= 128;
							this.selection.y += 128;
							this.selection = null;
							console.log(this.jumpable);
							var index = this.checkers.indexOf(this.jumpable);
							this.checkers.splice(index,1);
							this.jumpable = null;
							
						}
					}
				}
			if(this.selection != null) {
				if(br) {
					brr = false;
					ctx.fillRect(this.selection.x+64,this.selection.y+64,64,64);
					if(mPos.x <= this.selection.x+128 && mPos.x >= this.selection.x+64) {
						if(mPos.y <= this.selection.y+128 && mPos.y >= this.selection.y+64) {
							this.selection.x += 64;
							this.selection.y += 64;
							this.selection = null;
						}
					}
				}
				if(brr) {
					ctx.fillRect(this.selection.x+128,this.selection.y+128,64,64);
					if(mPos.x <= this.selection.x+192 && mPos.x >= this.selection.x+128) {
						if(mPos.y <= this.selection.y+192 && mPos.y >= this.selection.y+128) {
							this.selection.x += 128;
							this.selection.y += 128;
							this.selection = null;
							console.log(this.jumpable);
							var index = this.checkers.indexOf(this.jumpable);
							this.checkers.splice(index,1);
							this.jumpable = null;
							
						}
					}
				}
			}
			if(this.selection != null) {
				if(tl) {
					ctx.fillRect(this.selection.x-64,this.selection.y-64,64,64);
					if(mPos.x <= this.selection.x && mPos.x >= this.selection.x-64) {
						if(mPos.y >= this.selection.y-64 && mPos.y <= this.selection.y) {
							this.selection.x -= 64;
							this.selection.y -= 64;
							this.selection = null;
						}
					}
				}
			}
			if(this.selection != null) {
				if(tr) {
					ctx.fillRect(this.selection.x+64,this.selection.y-64,64,64);
					if(mPos.x <= this.selection.x+128 && mPos.x >= this.selection.x+64) {
						if(mPos.y >= this.selection.y-64 && mPos.y <= this.selection.y) {
							this.selection.x += 64;
							this.selection.y -= 64;
							this.selection = null;
						}
					}
				}
			}		
		}
	}
}

function Checker(x,y,color) {
	this.x = x;
	this.y = y;
	this.color = color;
	
	this.draw = function() {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.ellipse(this.x+32,this.y+32,28,28,45 * Math.PI/180,0,2 * Math.PI);
		ctx.fill();
	}
}

//Create Board and initilize board.
var board = new Board(8,8);
board.createBoard();

var mPos = new Object();

function getPos(event) {
	var x = event.x;
	var y = event.y;
	
	x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
	
	mPos.x = x;
	mPos.y = y;
	
	console.log(mPos.x, mPos.y);
	
	for(var checker of board.checkers) {
		
		if(x <= checker.x + 64 && x >= checker.x) {
			if(y <= checker.y + 64 && y >= checker.y) {
				board.selection = checker;
			}
		}
	}
	
}

var draw = function() {
	board.drawCheckers();
}

setInterval(function() {
  draw();
}, 1000/FPS);