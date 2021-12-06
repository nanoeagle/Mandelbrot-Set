importScripts("task.js");
onmessage = function(event) {
	var workerResult = computeRow(event.data);
	postMessage(workerResult);
};