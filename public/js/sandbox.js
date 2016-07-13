var sandbox_context = new Array(max_n_levels);
var check = 1;


sandbox_context[0] = `
	scale();
`;

sandbox_context[1] = `
	function playerShoot(x, y) {};
	shootWithOffset();
`;

sandbox_context[2] = `
	setNumMissiles();
`;

sandbox_context[3] = `
	function AntiMissileBattery(x){};
	function castle(x){};
	function initializeLevel(){};
	var antiMissileBatteries = [];
	var castles = [];
	initializeObf();
`;

sandbox_context[4] = `
var CANVAS_HEIGHT;
var CANVAS_WIDTH;
checkHeightObf();
`;

sandbox_context[6] = `
function AntiMissileBattery(x){};
function castle(x){};
function initializeLevel(){};
var antiMissileBatteries = [];
var castles = [];
initializeRec(18);
`;

sandbox_context[6] = `
	function checkHeight(x) {};
	function PlayerMissile(x){};
	PlayerMissiles = [];
	playerShoot3();
`;

sandbox_context[7] = `
	CANVAS_WIDTH = 0;
	CANVAS_HEIGHT = 0;
	function playerShoot(x, y){};
	autofire();
`;

sandbox_context[8] = `
	CANVAS_WIDTH = 0;
	CANVAS_HEIGHT = 0;
	function firedToOuterThird(x, y){};
	whichAntiMissileBatteryObf();
`;


var NOT_ALLOWED = function(name){

	return function(){
		check = name + "(); is not allowed.";
		console.warn(name + "(); is not allowed.");
		return function(){};
	};
};

var scope = {
//	"alert": function(message){ console.log(message); },
	"alert": NOT_ALLOWED("alert"),
	"eval": NOT_ALLOWED("eval"),
	"Function": NOT_ALLOWED("Function")
};


function sandbox(script, context){
	check = 1;
	context.window = {};

	for (var key in context){
		context.window[key] = context[key];
	}

	context.global = context.window;
	var lines = script.split('\n');
	for(var i = 0;i < lines.length;i++){
		try {
				lines[i] = lines[i].replace(/while\(([^\)]*\))/g, "");
				lines[i] = lines[i].replace(/for\(([^\)]*\))/g, "");
				console.log(lines[i]);
				eval("with (context){ " + lines[i]+ " }");

		} catch(e) {
		}
	}
	return check;

}

function limitEval(code, fnOnStop, opt_timeoutInMS) {
	var id = Math.random() + 1,
	myWorker = new Worker('js/worker.js');

	function onDone() {
		fnOnStop.apply(this, arguments);
	}

	myWorker.onmessage = function (data) {
		data = data.data;
		if (data) {

			if (data.i === id) {
				id = 0;
				onDone(true, data.r);
			}
			else if (data.i === id + 1) {
				setTimeout(function() {
					if (id) {
						myWorker.terminate();
						onDone(false);
					}
				}, opt_timeoutInMS || 1000);
			}
		}
	};

	myWorker.postMessage({ c: code, i: id });
}
