// Computes a row of the fractal.
// The values array returned to the manager code 
// contains a color value (in number) for each pixel in the row.
function computeRow(taskInfo) {
	var iter = 0;
	var c_i = taskInfo.i;
	var max_iter = taskInfo.max_iter;
	var escape = taskInfo.escape * taskInfo.escape;
	taskInfo.values = [];
	for (var i = 0; i < taskInfo.width; i++) {
		var c_r = taskInfo.r_min + (taskInfo.r_max - taskInfo.r_min) * i / taskInfo.width;
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
		taskInfo.values.push(iter);
	}
	return taskInfo;
}