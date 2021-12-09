var numberOfWorkers = 8;
var workers = []; 

var rowIndex = 0;
var magnification = 0;

window.onload = function() {
	setUpGraphics();
	createWorkers();
	startWorkers();
};

function createWorkers() {
	for (var i = 0; i < numberOfWorkers; i++) {
		var worker = new Worker("../js/worker.js");
		worker.onmessage = function(event) {
			worker.idle = true;
			drawRow(event.data);
			reassignTaskTo(event.target);
		};
		worker.idle = true;
		workers.push(worker);
	}
}

function reassignTaskTo(worker) {
	if (isThereStillTask()) {
		assignTaskIfWorkerIsIdle(worker);
	} else {
		worker.idle = true;
	}
}

function isThereStillTask() {
	return rowIndex < canvas.height;
}

function startWorkers() {
	magnification++;
	rowIndex = 0;
	for (var i = 0; i < workers.length; i++) {
		var worker = workers[i];
		assignTaskIfWorkerIsIdle(worker);
	}
}

function assignTaskIfWorkerIsIdle(worker) {
	if (worker.idle) {
		var taskInfo = createTaskInfoForRowAt(rowIndex);
		worker.postMessage(taskInfo);
		worker.idle = false;
		rowIndex++;
	}
}

/* 
packages up the data we need to send to the worker
*/
function createTaskInfoForRowAt(rowIndex) {
	var taskInfo = {
		rowIndex: rowIndex,		// index of the row we're working on.
		width: rowData.width,	// width of the ImageData object to fill.
		magnification: magnification,	// how far we are in.
		r_min: r_min,
		r_max: r_max,
		i: i_max + (i_min - i_max) * rowIndex / canvas.height,
		max_iter: max_iter,
		escape: _escape
	};
	return taskInfo;
}