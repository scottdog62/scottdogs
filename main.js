var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();


function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

//-------------------- Don't modify anything above here

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;

var LAYER_COUNT = level1.layers.length;
var MAP = {tw: level1.width, th:level1.height};
var TILE = level1.tilewidth;
var TILESET_TILE = level1.tilesets[0].tilewidth;
var TILESET_PADDING=level1.tilesets[0].margin;
var TILESET_SPACING=level1.tilesets[0].spacing;
var TILESET_COUNT_X=level1.tilesets[0].columns;
var TILESET_COUNT_Y=level1.tilesets[0].tilecount
		/ TILESET_COUNT_X;

var tileset = document.createElement("img");
tileset.src = level1.tilesets[0].image;

// some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

var heartImage = document.createElement("img");
heartImage.src = "heartImage.png"
var player = new Player();
var keyboard = new Keyboard();




//var LAYER_BACKGROUND=0;
var LAYER_PLATFORMS = 0;
//var LAYER_LADDERS = 2;

var METER = TILE;

var GRAVITY = METER * 9.8 * 6;

var MAXDX = METER * 15;
var MAXDY = METER * 15;
var ACCEL = MAXDX * 6;
var FRICTION = MAXDX*6;
var JUMP = METER * 1500;


function cellAtPixelCoord(layer, x,y)
{
if(x<0 || x>SCREEN_WIDTH || y<0)
return 1;
// let the player drop of the bottom of the screen (this means death)
if(y>SCREEN_HEIGHT)
return 0;
return cellAtTileCoord(layer, p2t(x), p2t(y));
};
function cellAtTileCoord(layer, tx, ty)
{
if(tx<0 || tx>=MAP.tw || ty<0)
return 1;
// let the player drop of the bottom of the screen (this means death)
if(ty>=MAP.th)
return 0;
return cells[layer][ty][tx];
};


function tileToPixel(tile)
{
return tile * TILE;
};
function pixelToTile(pixel)
{
return Math.floor(pixel/TILE);
};


function bound(value, min, max)
{
if(value < min)
return min;
if(value > max)
return max;
return value;
}


var cells = []; // the array that holds our simplified collision data
function initialize() {
 
 for(var layerIdx = 0; layerIdx < LAYER_COUNT; layerIdx++) { // initialize the collision map
 cells[layerIdx] = [];
 var idx = 0;
 for(var y = 0; y < level1.layers[layerIdx].height; y++) {
 cells[layerIdx][y] = [];
 for(var x = 0; x < level1.layers[layerIdx].width; x++) {
 if(level1.layers[layerIdx].data[idx] != 0) {
 // for each tile we find in the layer data, we need to create 4 collisions
 // (because our collision squares are 35x35 but the tile in the
// level are 70x70)
 cells[layerIdx][y][x] = 1;
cells[layerIdx][y-1][x] = 1;
cells[layerIdx][y-1][x+1] = 1;
cells[layerIdx][y][x+1] = 1;
 }
 else if(cells[layerIdx][y][x] != 1) {
// if we haven't set this cell's value, then set it to 0 now
 cells[layerIdx][y][x] = 0;
}
 idx++;
 
 
 }
 }
 }
 
 

 var musicBackground;
var sfxFire;

 
 musicBackground = new Howl(
	{
		urls: ["background.ogg"],
		loop: true,
		buffer: true,
		volume: 0.5
	});
	
	musicBackground.play();
	
	sfxFire = new Howl(
	{
		urls: ["fireEffect.ogg"],
		buffer: true,
		volume: 1,
		onend: function() {
			isSfxPlaying = false;
		}
	});
}

var score = 0;
 var lives = 3;
 
function cellAtPixelCoord(layer, x,y)
{
if(x<0 || x>SCREEN_WIDTH) // remove ‘|| y<0’
return 1;
// let the player drop of the bottom of the screen
// (this means death)
if(y>SCREEN_HEIGHT)
return 0;
return cellAtTileCoord(layer, p2t(x), p2t(y)); 
};
function cellAtTileCoord(layer, tx, ty)
{
if(tx<0 || tx>=MAP.tw)
return 1;
// let the player drop of the bottom of the screen
// (this means death)
if(ty>=MAP.th)
return 0;
return cells[layer][ty][tx]; 
};

function tileToPixel(tile)
{
return tile * TILE;
};
function pixelToTile(pixel)
{
return Math.floor(pixel/TILE);
};
function bound(value, min, max)
{
if(value < min)
return min;
if(value > max)
return max;
return value;
}
var worldOffsetX =0;


function drawMap()
{
	var startX = -1;
	var maxTiles = Math.floor(SCREEN_WIDTH / TILE) + 2;
	var tileX= pixelToTile(player.position.x);
	var offsetX = TILE + Math.floor(player.position.x%TILE);
	
	startX = tileX - Math.floor(maxTiles / 2);
	
	if(startX < -1)
	{
		startX = 0;
		offsetX = 0;
	}
	if(startX > MAP.tw - maxTiles)
	{startX = MAP.tw - maxTiles + 1;
	offsetX = TILE;
	}
		
	worldOffsetX = startX * TILE + offsetX;
	
for(var layerIdx=0; layerIdx<LAYER_COUNT; layerIdx++)
{
var idx = 0;
for( var y = 0; y < level1.layers[layerIdx].height; y++ )
{
for( var x = 0; x < level1.layers[layerIdx].width; x++ )
{
if( level1.layers[layerIdx].data[idx] != 0 )
{

var tileIndex = level1.layers[layerIdx].data[idx] - 1;
var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X) * (TILESET_TILE + TILESET_SPACING);
var sy = TILESET_PADDING + (Math.floor(tileIndex / TILESET_COUNT_Y)) * (TILESET_TILE + TILESET_SPACING);
context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE, x*TILE, (y-1)*TILE, TILESET_TILE, TILESET_TILE);
}
idx++;
}
}
}
}

var cells = [];




function run()
{
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	var deltaTime = getDeltaTime();
	
	player.update(deltaTime);
	drawMap()
	player.draw();
		
	// update the frame counter 
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}		
	
{
 context.drawImage(heartImage, 20  , 10);
}
		
	// draw the FPS
	context.fillStyle = "#f00";
	context.font="14px Arial";
	context.fillText("FPS: " + fps, 5, 20, 100);
	
	context.fillStyle = "yellow";
context.font="32px Arial";
var scoreText = "Score: " + score;
context.fillText(scoreText, SCREEN_WIDTH - 170, 35);
	
	


	
}

initialize();


//-------------------- Don't modify anything below here


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);


