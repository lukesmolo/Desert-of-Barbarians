function
playerShoot3(x,y) {
	//cannot shoot in the lower fifth part of canvas and in the upper fifth
	if( checkHeight(y) ) {
		var source = whichAntiMissileBattery( x );
		if( source === -1 ){ // No missiles left
			return;
		}
		playerMissiles.push( new PlayerMissile( source, x, y ) );
		playerMissiles.push( new PlayerMissile( source, x + 40, y ) );
		playerMissiles.push( new PlayerMissile( source, x - 40, y ) );
	}
}
