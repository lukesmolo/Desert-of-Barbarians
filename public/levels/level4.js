function initializeObf() {
	for (i=1; i <=18; i+=1){
		castles.push( new castle( i) );
		antiMissileBatteries.push( new AntiMissileBattery(i) );
	}
	initializeLevel();
}
