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
        drawZoomableSunburst("breakfast");
        //drawStackedBar(0);
        //drawHorizontalBar();
}

function drawZoomableSunburst(fileString) {
    zoomableSunburst = new D3WRAP.ZoomableSunburst("#chart1", {strLength: 20}, 350, fileString);
}

/*function drawStackedBar(buttonval) {*/
function drawStackedBar() {
    /*stackedBar = new D3WRAP1.StackedBar("#chart2", buttonval);*/
    stackedBar = new D3WRAP1.StackedBar("#chart2");
    /*stackedBar = new D3WRAP1.StackedBar("#chart2", 'False');*/
}

function drawHorizontalBar(meal_data) {
    stackedBar = new D3WRAP2.HorizontalBar("#chart3", meal_data);
}