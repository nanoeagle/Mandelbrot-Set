importScripts("task.js");
onmessage = function(event) {
	var workerResult = handleTask(event.data);
	postMessage(workerResult);
};