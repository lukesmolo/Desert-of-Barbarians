function scale(x, y) {
	var distance = Math.sqrt( Math.pow(x, 2) +
			Math.pow(y, 2) ),
	distancePerFrame = 3;

		return distance / distancePerFrame;
}
