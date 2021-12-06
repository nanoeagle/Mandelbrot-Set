var canvas;
var canvasContext;

var rowData;
var i_max = 1.5;
var i_min = -1.5;
var r_max = 1.5;
var r_min = -2.5;

var max_iter = 1024;
var _escape = 1025;
var palette = [];

/*
setUpGraphics sets up some of the initial values for the variables used 
in the Mandelbrot computation, and sets the canvas width and height to 
the width and height of the window.
*/
function setUpGraphics() {
	setUpCanvas();
	
	var width = ((i_max - i_min) * canvas.width / canvas.height);
	var r_mid = (r_max + r_min) / 2;
	r_min = r_mid - width/2;
	r_max = r_mid + width/2;

	rowData = canvasContext.createImageData(canvas.width, 1);
	makePalette();
}

function setUpCanvas() {
	canvas = document.getElementById("fractal");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvasContext = canvas.getContext("2d");
}

/* 
This function fills the palette with (r, g, b) values.
*/
function makePalette() {
	function wrap(x) {
		x = ((x + 256) & 0x1ff) - 256;
		if (x < 0) x = -x;
		return x;
	}
	for (i = 0; i <= max_iter; i++)
		palette.push([wrap(7*i), wrap(5*i), wrap(11*i)]);
}

/* 
drawRow maps the color values in the array returned from a worker
to actual colors of pixels in a row using the palette.
*/
function drawRow(workerResult) {
	setColorsOfEachPixel(workerResult);
	canvasContext.putImageData(rowData, 0, workerResult.numberOfRows);
}

function setColorsOfEachPixel(workerResult) {
	// The color value array in numbers that the worker sends back.
	var colorValues = workerResult.values;
	// for each color index of each pixel in the row.
	for (var i = 0; i < rowData.width; i++) {
		var colorIndex = {
			red: i * 4,
			green: i * 4 + 1,
			blue: i * 4 + 2,
			alpha: i * 4 + 3
		};
		setPixelColors(colorIndex, colorValues[i]);
	}
}

function setPixelColors(colorIndex, colorValue) {
	// The actual pixels in the ImageData obj.
	// The pixelData is a reference to the
	// 	rowData.data! so changing pixelData
	// 	changes the rowData.data.
	var pixelData = rowData.data;
	pixelData[colorIndex.alpha] = 255; // set alpha to opaque
	if (colorValue < 0) {
		pixelData[colorIndex.red] = pixelData[colorIndex.green] 
			= pixelData[colorIndex.blue] = 0; // black.
	} else {
		var pixelColors = palette[colorValue];
		pixelData[colorIndex.red] = pixelColors[0];
		pixelData[colorIndex.green] = pixelColors[1];
		pixelData[colorIndex.blue] = pixelColors[2];
	}
}