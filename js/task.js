// Computes a row of the fractal.
// The values array returned to the manager code 
// contains a color value (in number) for each pixel in the row.
function handleTask(taskInfo) {
	var iter = 0;
	var max_iter = taskInfo.max_iter;
	var c_i = taskInfo.i;
	var escape = Math.pow(taskInfo.escape, 2);
	taskInfo.colorValues = [];
	
	for (var i = 0; i < taskInfo.width; i++) {
		var c_r = taskInfo.r_min + 
			(taskInfo.r_max - taskInfo.r_min) * i / taskInfo.width;
		var z_r = 0, z_i = 0;

		for (iter = 0; z_r*z_r + z_i*z_i < escape && iter < max_iter; iter++) {
			// z -> z^2 + c
			var tmp = z_r*z_r - z_i*z_i + c_r;
			z_i = 2 * z_r * z_i + c_i;
			z_r = tmp;
		}
		if (iter == max_iter) {
			iter = -1;
		}
		taskInfo.colorValues.push(iter);
	}

	var workerResult = {
		rowIndex: taskInfo.rowIndex,
		colorValues: taskInfo.colorValues
	};
	return workerResult;
}