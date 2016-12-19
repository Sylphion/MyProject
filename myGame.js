navigator.sayswho= (function(){
    var N= navigator.appName, ua= navigator.userAgent, tem;
    var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
    M= M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];

    return M;
})();

var browser;
if (navigator.sayswho[0] == "Firefox")
	browser="f";
else if (navigator.sayswho[0] == "Chrome")
	browser="c";
else if (navigator.sayswho[0] == "Safari")
	browser="s";
else  if (navigator.sayswho[0] == "Microsoft")
	browser="m";
else
	browser="f";

	
	var canvas = document.getElementById("canvas");   // the canvas where game will be drawn
	var context = canvas.getContext("2d");            // canvas context
	var levelCols=13;							// level width, in tiles
	var levelRows=16;							// level height, in tiles
	var tileSize=32;							// tile size, in pixels
	var playerCol=6;                                  // player starting column
	var playerRow=12;                                  // player starting row
	var leftPressed=false;                            // are we pressing LEFT arrow key?
	var rightPressed=false;                           // are we pressing RIGHT arrow key?
	var upPressed=false;                              // are we pressing UP arrow key?
	var downPressed=false;                            // are we pressing DOWN arrow key?
	var movementSpeed=3;                              // the speed we are going to move, in pixels per frame
	var playerXSpeed=0;                               // player horizontal speed, in pixels per frame
	var playerYSpeed=0;                               // player vertical speed, in pixels per frame
	
	var level = [        						// the 11x9 level - 1=wall, 0=empty space
		[1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1]
	];
 
	var playerYPos=playerRow*tileSize;				// converting Y player position from tiles to pixels
	var playerXPos=playerCol*=tileSize;               // converting X player position from tiles to pixels
	
	var mouseX = 300; //default values
	var mouseY = 300; //default values
	
	canvas.width=tileSize*levelCols;                   // canvas width. Won't work without it even if you style it from CSS
	canvas.height=tileSize*levelRows;                   // canvas height. Same as before

	
	// simple WASD listeners
	
	document.addEventListener("keydown", function(e){
		console.log(e.keyCode);
		switch(e.keyCode){
			case 65:
				leftPressed=true;
				break;
			case 87:
				upPressed=true;
				break;
			case 68:
				rightPressed=true;
				break;
			case 83:
				downPressed=true;
				break;
		}
	}, false);
 
	document.addEventListener("keyup", function(e){
		switch(e.keyCode){
			case 65:
				leftPressed=false;
				break;
			case 87:
				upPressed=false;
				break;
			case 68:
				rightPressed=false;
				break;
			case 83:
				downPressed=false;
				break;
		}
	}, false);
	
	//MouseClick Listener
	document.addEventListener("mousedown", canvasClick, false);
	
	function canvasClick(event)
{	
	if (browser == "f" || browser == "m")
	{
	mouseX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	mouseY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	else //"s" or "c"
	{
	mouseX = event.clientX
	mouseY = event.clientY
	}
}	
	
	
	// function to display the level
	
	function renderLevel(){
		// clear the canvas
		context.clearRect(0, 0, canvas.width, canvas.height);
		
		context.fillStyle = "grey";
		context.fillRect(0, 0, canvas.width, canvas.height);	
	
		// walls
		context.fillStyle = "#006835";
		for(i=0;i<levelRows;i++){
			for(j=0;j<levelCols;j++){
				if(level[i][j]==1){
					context.fillRect(j*tileSize,i*tileSize,tileSize,tileSize);	
				}
			}
		}
		// player = green box
		context.fillStyle = "#00ff00";
		context.fillRect(playerXPos,playerYPos,tileSize,tileSize);
	}
	
	// this function will do its best to make stuff work at 60FPS - please notice I said "will do its best"
	
	window.requestAnimFrame = (function(callback) {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000/60);
		};
	})();
	
	// function to handle the game itself
	
	function updateGame() {
	
		// no friction or inertia at the moment, so at every frame initial speed is set to zero
		playerXSpeed=0;
		playerYSpeed=0;
		
		// updating speed according to key pressed
		if(rightPressed){
			playerXSpeed=movementSpeed
		}
		
		if(leftPressed){
				playerXSpeed=-movementSpeed;
			}
		
		if(upPressed){
					playerYSpeed=-movementSpeed;
				}
				
		if(downPressed){
						playerYSpeed=movementSpeed;
					}         
				         		  
		
		// updating player position
		
		playerXPos+=playerXSpeed;
		playerYPos+=playerYSpeed;
		
	
		
		// check for horizontal collisions
		
		var baseCol = Math.floor(playerXPos/tileSize);
		var baseRow = Math.floor(playerYPos/tileSize);
		var colOverlap = playerXPos%tileSize;
		var rowOverlap = playerYPos%tileSize;
		
		if(playerXSpeed>0){
			if((level[baseRow][baseCol+1] && !level[baseRow][baseCol]) || (level[baseRow+1][baseCol+1] && !level[baseRow+1][baseCol] && rowOverlap)){
				playerXPos=baseCol*tileSize;
			}	
		}
		
		if(playerXSpeed<0){
			if((!level[baseRow][baseCol+1] && level[baseRow][baseCol]) || (!level[baseRow+1][baseCol+1] && level[baseRow+1][baseCol] && rowOverlap)){
				playerXPos=(baseCol+1)*tileSize;
			}	
		}
		
		// check for vertical collisions
		
		baseCol = Math.floor(playerXPos/tileSize);
		baseRow = Math.floor(playerYPos/tileSize);
		colOverlap = playerXPos%tileSize;
		rowOverlap = playerYPos%tileSize;
				
		if(playerYSpeed>0){
			if((level[baseRow+1][baseCol] && !level[baseRow][baseCol]) || (level[baseRow+1][baseCol+1] && !level[baseRow][baseCol+1] && colOverlap)){
				playerYPos = baseRow*tileSize;
			}	
		}
		
		if(playerYSpeed<0){
			if((!level[baseRow+1][baseCol] && level[baseRow][baseCol]) || (!level[baseRow+1][baseCol+1] && level[baseRow][baseCol+1] && colOverlap)){
				playerYPos = (baseRow+1)*tileSize;
			}		
		}
	
		
		// rendering level
		
		renderLevel();
		
		// update the game in about 1/60 seconds
		
		requestAnimFrame(function() {
			updateGame();
		});
	}
 
	updateGame();
 
