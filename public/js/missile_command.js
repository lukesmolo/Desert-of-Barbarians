/*TODO runtime changing size of canvas*/



// Missile Command
var canvas = $('#game_canvas')[0];
var ctx = canvas.getContext('2d');

//Set canvas size
var background = new Image();
background.addEventListener('load', onImageLoad);
background.src = "../images/fondale.png";

var bool = 1;
var code_length = 1;

$(canvas).attr('width', ($('#game_canvas').parent().width()));
$(canvas).attr('height', ($('#game_canvas').parent().height()));

// Constants
var CANVAS_WIDTH  = canvas.width;
var CANVAS_HEIGHT = canvas.height;
var MISSILE = {
	    active: 1,
	    exploding: 2,
	    imploding: 3,
	    exploded: 4
};

// Variables
var score = 0;
var castles = [];
var antiMissileBatteries = [];
var playerMissiles = [];
var enemyMissiles = [];
var timerID;
var buildTime = 0;

function
missileCommand() {
	resetVars();
	initialize();
	setupListeners();
}

function
resetVars() {
	// Variables
	score = 0;
	buildTime = 0;
	castles = [];
	antiMissileBatteries = [];
	playerMissiles = [];
	enemyMissiles = [];
	clearInterval( timerID ); //FIXME praticamente rimane un piccoli bug: quando l'utente fa il send code senza giocare prima, si rirompe
 	$( '#game_canvas' ).off( 'click' );
}



// Create castles and anti missile batteries at the start of the game
function
initialize() {
	//Initialize the leftmost castles (3, 5, 7)
	for (i=3; i <=7; i+=2)
		//Bottom left relative position of castle
		castles.push( new castle( CANVAS_WIDTH*i/18, CANVAS_HEIGHT-(CANVAS_HEIGHT/10) ) );
	//Initialize the rightmost castles (11, 13, 15)
	for (i=11; i <=15; i+=2)
		// Bottom left relative position of castle
		castles.push( new castle( CANVAS_WIDTH*i/18, CANVAS_HEIGHT-(CANVAS_HEIGHT/10) ) );
	for (i=1; i <=17; i+=8)
		// Top middle position of anti missile battery
		antiMissileBatteries.push( new AntiMissileBattery( (CANVAS_WIDTH*i/18), CANVAS_HEIGHT-(CANVAS_HEIGHT/10)-28 ) );
	initializeLevel();
}

// Create castles and anti missile batteries at the start of the game
function
initializeObf() {
	for (i=1; i <=18; i+=1){
		castles.push( new castle( i) );
		antiMissileBatteries.push( new AntiMissileBattery(i) );
	}
	initializeLevel();
}

function return_numMissiles(){
	missilesLeft = 1;
	return missilesLeft;
}

// Reset various variables at the start of a new level
function
initializeLevel() {
	if (current_level == 3){
		$.each( antiMissileBatteries, function( index, amb ) {
			if (index == 1) {
				amb.missilesLeft = return_numMissiles();
			}
			else {
				amb.missilesLeft = return_numMissiles() - 1;
			}
		});
	}
	else {
		$.each( antiMissileBatteries, function( index, amb ) {
			if (index == 1) {amb.missilesLeft = 10;}
			else {amb.missilesLeft = 10;}
		});
	}
	playerMissiles = [];
	enemyMissiles = [];
	createEmemyMissiles();
	drawBeginLevel();
}



// Create a certain number of enemy missiles based on the game level
function
createEmemyMissiles(){
	var targets = viableTargets();
	switch (current_level){
			case 1: numMissiles = 7; break;
			default: numMissiles = 10;
	}
	for( var i = 0; i < numMissiles; i++ ) {
		enemyMissiles.push( new EnemyMissile(targets) );
	}
}

// Get a random number between min and max, inclusive
function
rand( min, max ) {
	return Math.floor( Math.random() * (max - min + 1) ) + min;
}


function
onImageLoad(e) {
	drawBackground();
	drawcastles();
	drawAntiMissileBatteries();
	drawScore();
}

// Show various graphics shown on most game screens
function
drawGameState() {
	onImageLoad(background);
}

function
drawBeginLevel() {
	onImageLoad(background);
	//drawLevelMessage();
}

// Show current score
function
drawScore() {
	ctx.fillStyle = 'red';
	ctx.font = 'bold 20px arial';
	ctx.fillText( 'Points ' + score, CANVAS_WIDTH/20, CANVAS_HEIGHT/20 );
}

// Draw all active castles
var drawcastles = function() {
	$.each( castles, function( index, castle ) {
		if( castle.active ) {
			castle.draw();
		}
	});
};

// Draw missiles in all anti missile batteries
var drawAntiMissileBatteries = function() {
	$.each( antiMissileBatteries, function( index, amb ) {
		amb.draw();
	});
};

// Show the basic game background
function
drawBackground() {
	//necessary to refersh the screen
	ctx.fillRect( 0, 0,CANVAS_WIDTH, CANVAS_HEIGHT );
	ctx.drawImage(background, 0, 0, background.width,    background.height,    // source rectangle
			0, 0, canvas.width, canvas.height);  // destination rectangle

	var l = CANVAS_WIDTH/70;
	var h = CANVAS_HEIGHT/10;

	//castle's walls
	ctx.fillStyle = 'grey';
	ctx.beginPath();
	ctx.moveTo( 0,  10*h);
	ctx.lineTo( 0,  9*h);
	ctx.lineTo( l*3/2,  8*h);
	ctx.lineTo( l*13/2,  8*h);
	ctx.lineTo( l*8,  9*h);
	ctx.lineTo( l*31,  9*h);
	ctx.lineTo( l*31+l*3/2,  8*h);
	ctx.lineTo( l*31+l*13/2,  8*h);
	ctx.lineTo( l*31+l*8,  9*h);
	ctx.lineTo( CANVAS_WIDTH-l*8,  9*h);
	ctx.lineTo( CANVAS_WIDTH-l*13/2,  8*h);
	ctx.lineTo( CANVAS_WIDTH-l*3/2,  8*h);
	ctx.lineTo( CANVAS_WIDTH,  9*h);
	ctx.lineTo( CANVAS_WIDTH,  10*h);
	ctx.closePath();
	ctx.fill();
};

// Constructor for a castle
function castle( x, y ) {
	if (arguments.length === 2) {
	this.x = x;
	this.y = y;
	this.active = true;
	}
	else if (arguments.length === 1){
		castleY = CANVAS_HEIGHT-(CANVAS_HEIGHT/10);
		slot = CANVAS_WIDTH/18;

		if (i == 3 || i == 5 || i == 7 || i == 11 || i == 13 || i == 15) {
			this.x = slot*i;
			this.y = castleY;
			this.active = true;
		}

		//time is lost even if castle is not built
		buildTime++;
	}
}

// Show a castle based on its position
castle.prototype.draw = function() {
	var x = this.x,
	y = this.y,
	l = CANVAS_WIDTH/70;
	//castle tower design
	ctx.fillStyle = 'grey';
	ctx.beginPath();
	ctx.moveTo( x, y );
	ctx.lineTo( x , y - l);
	ctx.lineTo( x -l/2, y - l);
	ctx.lineTo( x -l/2, y - 2*l);
	ctx.lineTo( x, y - 2*l);
	ctx.lineTo( x, y - 3/2*l);
	ctx.lineTo( x + l/3, y - 3/2*l);
	ctx.lineTo( x + l/3, y - 2*l);
	ctx.lineTo( x + l*2/3, y - 2*l);
	ctx.lineTo( x + l*2/3, y - 3/2*l);
	ctx.lineTo( x + l, y - 3/2*l);
	ctx.lineTo( x + l, y - 2*l);
	ctx.lineTo( x + 3/2*l, y - 2*l);
	ctx.lineTo( x + 3/2*l, y - l);
	ctx.lineTo( x + l, y - l);
	ctx.lineTo( x + l, y);
	ctx.closePath();
	ctx.fill();
	//doors design
	ctx.fillStyle = 'brown';
	ctx.beginPath();
	ctx.moveTo( x +l/5, y);
	ctx.lineTo( x +l/5, y - l/2);
	ctx.lineTo( x +l*5/10, y - l*7/10);
	ctx.lineTo( x +l*4/5, y - l/2);
	ctx.lineTo( x +l*4/5, y);
	ctx.closePath();
	ctx.fill();
};

// Constructor for an Anti Missile Battery
function
AntiMissileBattery( x, y ) {
	if (arguments.length === 2) {
		this.x = x;
		this.y = y;
		this.missilesLeft = 10;
	}
	else if (arguments.length === 1){
		slot = CANVAS_WIDTH/18;
		antiMissileY = CANVAS_HEIGHT-(CANVAS_HEIGHT/10)-28 ;

		if (i == 1 || i == 9 || i == 17){
			this.x = slot*i;
			this.y = antiMissileY;
			this.missilesLeft = 10;
		}
		//time is lost even if castle is not built
		buildTime++;
	}
}

AntiMissileBattery.prototype.hasMissile = function() {
	//"cast to bool" "Operator": ! is not, !! turns our int!=0 in 1 (es. 7, !7=0, !0 = 1)
	return !!this.missilesLeft;
	//autofire
	//return 1;
};

// Show the missiles left in an anti missile battery
AntiMissileBattery.prototype.draw = function() {
	var x, y;
	var delta = [ [0, 0], [-6, 6], [6, 6], [-12, 12], [0, 12],
	[12, 12], [-18, 18], [-6, 18], [6, 18], [18, 18] ];

	for( var i = 0, len = this.missilesLeft; i < len; i++ ) {
		x = this.x + delta[i][0];
		y = this.y + delta[i][1];

		// Draw a missile
		ctx.strokeStyle = 'blue';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo( x, y );
		ctx.lineTo( x, y + 8 );
		ctx.moveTo( x - 2, y + 10 );
		ctx.lineTo( x - 2, y + 6 );
		ctx.moveTo( x + 2, y + 10 );
		ctx.lineTo( x + 2, y + 6 );
		ctx.stroke();
	}
};

// Constructor for a Missile, which may be the player's missile or
// the enemy's missile.
// The options argument used to create the missile is expected to
// have startX, startY, endX, and endY to define the missile's path
// as well as color and trailColor for the missile's appearance
function
Missile(options) {
	this.startX = options.startX;
	this.startY = options.startY;
	this.endX = options.endX;
	this.endY = options.endY;
	this.color = options.color;
	this.trailColor = options.trailColor;
	this.x = options.startX;
	this.y = options.startY;
	this.state = MISSILE.active;
	this.width = 2;
	this.height = 2;
	this.explodeRadius = 0;
}

// Draw the path of a missile or an exploding missile
Missile.prototype.draw = function() {
	if( this.state === MISSILE.active ){
		ctx.strokeStyle = this.trailColor;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo( this.startX, this.startY );
		ctx.lineTo( this.x, this.y );
		ctx.stroke();

		ctx.fillStyle = this.color;
		ctx.fillRect( this.x - 1, this.y - 1, this.width, this.height );
	} else if( this.state === MISSILE.exploding ||
			this.state === MISSILE.imploding ) {
		ctx.fillStyle = 'white';
		ctx.beginPath();
		ctx.arc( this.x, this.y, this.explodeRadius, 0, 2 * Math.PI );
		ctx.closePath();

		explodeOtherMissiles( this, ctx );

		ctx.fill();
	}
};

// Handle update to help with animating an explosion
Missile.prototype.explode = function() {
	if( this.state === MISSILE.exploding ) {
		this.explodeRadius++;
	}
	if( this.explodeRadius > 30 ) {
		this.state = MISSILE.imploding;
	}
	if( this.state === MISSILE.imploding ) {
		this.explodeRadius--;
		if( this.groundExplosion ) {
			( this.target[2] instanceof castle ) ? this.target[2].active = false
				: this.target[2].missilesLeft = 0;
		}
	}
	if( this.explodeRadius < 0 ) {
		this.state = MISSILE.exploded;
	}
};

function scale(x, y) {
	var distance = Math.sqrt( Math.pow(x, 2) +
			Math.pow(y, 2) )
	distancePerFrame = 15;
	if (current_level == 1) distancePerFrame = 3;

		return distance / distancePerFrame;
};

// Constructor for the Player's Missile, which is a subclass of Missile
// and uses Missile's constructor
function PlayerMissile( source, endX, endY ) {
	// Anti missile battery this missile will be fired from
	var amb = antiMissileBatteries[source];

	Missile.call( this, { startX: amb.x,  startY: amb.y,
		endX: endX,     endY: endY,
		color: 'green', trailColor: 'blue' } );

	var xDistance = this.endX - this.startX,
	yDistance = this.endY - this.startY;
	// Determine a value to be used to scale the orthogonal directions
	// of travel so the missiles travel at a constant speed and in the
	// right direction

	this.dx = xDistance / scale(xDistance, yDistance);
	this.dy = yDistance / scale(xDistance, yDistance);
	amb.missilesLeft--;
}

// Make PlayerMissile inherit from Missile
PlayerMissile.prototype = Object.create( Missile.prototype );
PlayerMissile.prototype.constructor = PlayerMissile;

// Update the location and/or state of this missile of the player
PlayerMissile.prototype.update = function() {
	if( this.state === MISSILE.active && this.y <= this.endY ) {
		// Target reached
		this.x = this.endX;
		this.y = this.endY;
		this.state = MISSILE.exploding;
	}
	if( this.state === MISSILE.active ) {
		this.x += this.dx;
		this.y += this.dy;
	} else {
		this.explode();
	}
};

// Create a missile that will be shot at indicated location
function
playerShoot(x,y) {
	//cannot shoot in the lower fifth part of canvas and in the upper fifth
	if( checkHeight(y) ) {
		var source = whichAntiMissileBattery( x );
		if( source === -1 ){ // No missiles left
			return;
		}
		playerMissiles.push( new PlayerMissile( source, x, y ) );
	}
}

function shootWithOffset(x, y, offLeft, offTop){
	correctedX = x - offLeft;
	correctedY = y - offTop;
	if (current_level == 2){
		playerShoot(1.5*correctedX, correctedY+45);
	}
	else playerShoot(correctedX, correctedY);
}

function checkHeight(y) {
	if (y >= CANVAS_HEIGHT/8 && y <= CANVAS_HEIGHT*6/8) {return true}
	else return false;
}

function checkHeightObf(y) {
	var admitted = false;
	var admittedTop = false;
	var admittedBottom = false;
	var alreadySetTop = false;
	var alreadySetBottom = false;
	for (i = 0; i <= CANVAS_HEIGHT*6/8; i++){
		for (k = 0; k <= y; k++){
			for (j = 0; j <= k; j++){
				if (i == y == k == j) {
					admittedBottom = true;
					alreadySetBottom = true;
				}
				else {
					if (!alreadySetBottom){
						admittedBottom = false;
					}
				}
			}
		}
	}
	for (i = CANVAS_HEIGHT; i >= CANVAS_HEIGHT/8; i--){
		for (k = 0; k <= y; k++){
			for (j = 0; j <= k; j++){
				if (i == y == k == j) {
					admittedTop = true;
					alreadySetTop = true;
				}
				else {
					if (!alreadySetTop){
						admittedTop = false;
					}
				}
			}
		}
	}
	admitted = admittedTop && admittedBottom;
	return admitted;
}

// Constructor for the Enemy's Missile, which is a subclass of Missile
// and uses Missile's constructor
function
EnemyMissile(targets) {
	var startX = rand( 0, CANVAS_WIDTH ),
	startY = 0,
	// Create some variation in the speed of missiles
	offSpeed = rand(80, 120) / 100,
	// Randomly pick a target for this missile
	target = targets[ rand(0, targets.length - 1) ],
	framesToTarget;

	Missile.call( this, { startX: startX,  startY: startY,
		endX: target[0], endY: target[1],
		color: 'yellow', trailColor: 'red' } );

	//lower is this value, higher will be the speed of the missiles
	//TODO put in back level!
	framesToTarget = ( 390 - 10 * current_level ) / offSpeed;
	if( framesToTarget < 20 ) {
		framesToTarget = 20;
	}
	this.dx = ( this.endX - this.startX ) / framesToTarget;
	this.dy = ( this.endY - this.startY ) / framesToTarget;

	this.target = target;
	// Make missiles heading to their target at random times
	this.delay = rand( 0, 50 + current_level * 15 );
	this.groundExplosion = false;
}

// Make EnemyMissile inherit from Missile
EnemyMissile.prototype = Object.create( Missile.prototype );
EnemyMissile.prototype.constructor = EnemyMissile;

// Update the location and/or state of an enemy missile.
// The missile doesn't begin it's flight until its delay is past.
EnemyMissile.prototype.update = function() {
	if( this.delay ) {
		this.delay--;
		return;
	}
	if( this.state === MISSILE.active && this.y >= this.endY ) {
		// Missile has hit a ground target (castle or Anti Missile Battery)
		this.x = this.endX;
		this.y = this.endY;
		this.state = MISSILE.exploding;
		this.groundExplosion = true;
	}
	if( this.state === MISSILE.active ) {
		this.x += this.dx;
		this.y += this.dy;
	} else {
		this.explode();
	}
};

// When a missile that did not hit the ground is exploding, check if
// any enemy missile is in the explosion radius; if so, cause that
// enemy missile to begin exploding too.
function
explodeOtherMissiles( missile, ctx ) {
	if( !missile.groundExplosion ){
		$.each( enemyMissiles, function( index, otherMissile ) {
			if( ctx.isPointInPath( otherMissile.x, otherMissile.y ) &&
					otherMissile.state === MISSILE.active ) {
				score += 25;
					otherMissile.state = MISSILE.exploding;
			}
		});
	}
}

// Get targets that may be attacked in a game Level. All targets
// selected here may not be attacked, but no target other than those
// selected here will be attacked in a game level.
// Note that at most 3 castles may be attacked in any level.
function
viableTargets(){
	var targets = [];

	// Include all active castles
	$.each( castles, function( index, castle ) {
		if( castle.active ) {
			targets.push( [castle.x + 15, castle.y - 10, castle] );
		}
	});

	// Randomly select at most 4 castles to target
	/*while( targets.length > 4) {
		targets.splice( rand(0, targets.length - 1), 1 );
	}*/

	// Include all anti missile batteries
	$.each( antiMissileBatteries, function( index, amb ) {
		targets.push( [amb.x, amb.y, amb]);
	});

	return targets;
}

// Operations to be performed on each game frame leading to the
// game animation
function
nextFrame() {
	drawGameState();
	updateEnemyMissiles();
	drawEnemyMissiles();
	updatePlayerMissiles();
	drawPlayerMissiles();
	checkEndLevel();
}

// Check if the player has complete the objectives of the level
function
checkEndLevel() {
	if( !enemyMissiles.length ) {
		// Stop animation
		stopLevel();
		$( '#game_canvas' ).off( 'click' );

		//TODO write in some global var the number of castles (and missiles) saved
		if (totalcastlesSaved() == 6) {
			alert('win');
			get_level(++current_level);
		}
		else {
			alert('fail');
		}
		missileCommand();
	}
}


// Get missiles left in all anti missile batteries at the end of a level
function
totalMissilesLeft() {
	var total = 0;
	$.each( antiMissileBatteries, function(index, amb) {
		total += amb.missilesLeft;
	});
	return total;
}

// Get count of undestroyed castles
function
totalcastlesSaved() {
	var total = 0;
	$.each( castles, function(index, castle) {
		if( castle.active ) {
			total++;
		}
	});
	return total;
}

// Update all enemy missiles and remove those that have exploded
function
updateEnemyMissiles() {
	$.each( enemyMissiles, function( index, missile ) {
		missile.update();
	});
	enemyMissiles = enemyMissiles.filter( function( missile ) {
		return missile.state !== MISSILE.exploded;
	});
}

// Draw all enemy missiles
function
drawEnemyMissiles() {
	$.each( enemyMissiles, function( index, missile ) {
		missile.draw();
	});
}

// Update all player's missiles and remove those that have exploded
function
updatePlayerMissiles() {
	$.each( playerMissiles, function( index, missile ) {
		missile.update();
	});
	playerMissiles = playerMissiles.filter( function( missile ) {
		return missile.state !== MISSILE.exploded;
	});
}

// Draw all player's missiles
function
drawPlayerMissiles() {
	$.each( playerMissiles, function( index, missile ) {
		missile.draw();
	});
}

// Stop animating a game level
function
stopLevel() {
	clearInterval( timerID );
}

// Start animating a game level
function
startLevel() {
	var fps = 30;
	//calls a function or evaluates an expression at specified intervals
	timerID = setInterval( nextFrame, 1000 / fps );
}

// Determine which Anti Missile Battery will be used to serve a
// player's request to shoot a missile. Determining factors are
// where the missile will be fired to and which anti missile
// batteries have missile(s) to serve the request
function
whichAntiMissileBattery(x) {
	var firedToOuterThird = function( priority1, priority2, priority3) {
		if( antiMissileBatteries[priority1].hasMissile() ) {
			return priority1;
		} else if ( antiMissileBatteries[priority2].hasMissile() ) {
			return priority2;
		} else {
			return priority3;
		}
	};

	var firedtoMiddleThird = function( priority1, priority2 ) {
		if( antiMissileBatteries[priority1].hasMissile() ) {
			return priority1;
		} else {
			return priority2;
		}
	};

	if( !antiMissileBatteries[0].hasMissile() &&
			!antiMissileBatteries[1].hasMissile() &&
			!antiMissileBatteries[2].hasMissile() ) {
		return -1;
	}
	if( x <= CANVAS_WIDTH / 3 ){
		return firedToOuterThird( 0, 1, 2 );
	} else if( x <= (2 * CANVAS_WIDTH / 3) ) {
		if ( antiMissileBatteries[1].hasMissile() ) {
			return 1;
		} else {
			return ( x <= CANVAS_WIDTH / 2 ) ? firedtoMiddleThird( 0, 2 )
				: firedtoMiddleThird( 2, 0 );
		}
	} else {
		return firedToOuterThird( 2, 1, 0 );
	}
}

// Attach event Listeners to handle the player's input
function
setupListeners() {
	$( '#game_canvas' ).one( 'click', function() {
		startLevel();

		//subtractions are necessaries to correct the position of the click (error dependent on left and top offset)
		$( '#game_canvas' ).on( 'click', function( event ) {
			shootWithOffset(event.pageX, event.pageY, $("#game_canvas").offset().left, $("#game_canvas").offset().top);
		});

	});
}

$( document ).ready( function() {
	function respondCanvas(){
		missileCommand();
	}

	//Initial Call
	respondCanvas();
});
