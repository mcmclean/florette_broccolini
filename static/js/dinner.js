var zoomableSunburst;
var stackedBar;
var horizontalBar;
var buttonval;
var fileString;


function pageIsLoaded() {
	d3ProjectInit();
}

// project initialization function
function d3ProjectInit() {
        drawZoomableSunburst("dinner");
}

function drawZoomableSunburst(fileString) {
    zoomableSunburst = new D3WRAP.ZoomableSunburst("#chart1", {strLength: 10}, 320, fileString);
}

function drawStackedBar() {
    stackedBar = new D3WRAP1.StackedBar("#chart2");
}

function drawHorizontalBar(meal_data) {
    stackedBar = new D3WRAP2.HorizontalBar("#chart3", meal_data);
}