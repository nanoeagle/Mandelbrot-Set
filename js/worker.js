importScripts("task.js");

onmessage = receiveTask;

function receiveTask(event) {
	var workerResult = handleTask(event.data);
	sendBack(workerResult);
}

function sendBack(workerResult) {
	postMessage(workerResult);
}