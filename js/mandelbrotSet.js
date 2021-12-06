var numberOfWorkers = 8;
var workers = []; 

var nextRow = 0;
var magnification = 0;

window.onload = function() {
	setUpGraphics();
	createWorkers();
	startWorkers();
}

function createWorkers() {
	for (var i = 0; i < numberOfWorkers; i++) {
		var worker = new Worker("../js/worker.js");
		worker.onmessage = function(event) {
			processWork(event.target, event.data);
		};
		worker.idle = true;
		workers.push(worker);
	}
}

function startWorkers() {
	magnification++;
	nextRow = 0;
	for (var i = 0; i < workers.length; i++) {
		var worker = workers[i];
		assignTaskIfWorkerIsIdle(worker);
	}
}

function assignTaskIfWorkerIsIdle(worker) {
	if (worker.idle) {
		var taskInfo = createTaskInfo(nextRow);
		worker.postMessage(taskInfo);
		worker.idle = false;
		nextRow++;
	}
}

/* 
packages up the data we need to send to the worker
*/
function createTaskInfo(row) {
	var taskInfo = {
		row: row,				// row number we're working on.
		width: rowData.width,   // width of the ImageData object to fill.
		magnification: magnification, // how far we are in.
		r_min: r_min,
		r_max: r_max,
		i: i_max + (i_min - i_max) * row / canvas.height,
		max_iter: max_iter,
		escape: _escape
	};
	return taskInfo;
}