function whichAntiMissileBatteryObf(x) {
	if( x <= CANVAS_WIDTH / 3 ){
		return firedToOuterThird( 0, 1, 2 );
	} else if( x <= (2 * CANVAS_WIDTH / 3) ) {
		if ( antiMissileBatteries[1].hasMissile() ) {
			return 1;
		} else {
			return ( x <= CANVAS_WIDTH / 2 ) ? firedtoMiddleThird( 0, 2 )	: firedtoMiddleThird( 2, 0 );
		}
	} else {
		return firedToOuterThird( 2, 1, 0 );
	}
}
