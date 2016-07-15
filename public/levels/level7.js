function playerShoot2(x,y) {
	if( checkHeight(y) ) {
		var source = whichAntiMissileBattery( x );
		if( source === -1 ){
			return;
		}
		playerMissiles.push( new PlayerMissile( source, x, y ) );
		playerMissiles.push( new PlayerMissile( source, x + 35, y ) );
	}
}
