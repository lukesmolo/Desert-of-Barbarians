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
	var scale = (function() {
		var distance = Math.sqrt( Math.pow(xDistance, 2) +
				Math.pow(yDistance, 2) ),
		distancePerFrame = 15;

			return distance / distancePerFrame;
	})();

	this.dx = xDistance / scale;
	this.dy = yDistance / scale;
	amb.missilesLeft--;
}
