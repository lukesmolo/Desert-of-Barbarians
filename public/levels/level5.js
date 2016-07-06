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
