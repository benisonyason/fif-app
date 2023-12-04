import "./style.css";
import { Image, Map, Overlay, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import {
  Control,
  FullScreen,
  MousePosition,
  OverviewMap,
  ScaleLine,
  ZoomSlider,
  defaults as defaultControls,
} from "ol/control.js";
import TileWMS from 'ol/source/TileWMS.js';
import { createStringXY } from "ol/coordinate";
import DragBox from "ol/interaction/DragBox.js";
import { platformModifierKeyOnly } from "ol/events/condition";
import VectorLayer from "ol/layer/Vector";
import VectorTile from "ol/source/VectorTile";
import ImageWMS from "ol/source/ImageWMS.js";
import ImageLayer from "ol/layer/Image";
import Layer from "ol/layer/Layer";
import LayerSwitcher from "ol-layerswitcher";
import "ol-layerswitcher/dist/ol-layerswitcher.css";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature.js";
import { Circle } from "ol/geom";
import GeoJSON from 'ol/format/GeoJSON.js';

/**
 * Create an overlay to anchor the popup to the map.
 */
var zoomInFlag = false;
var zoomOutFlag = false;
var showPopupOnMapClick = false;
var showPopupOnstateClick = false;
var showPopupOnSenClick = false;
var showPopupOnfarmClick = false;
var showQueryPaneOnClick = false;

const closer = document.getElementById("popup-closer");

const popup = new Overlay({
  element: document.getElementById("popup"),
  // positioning: 'bottom-center',
  autoPan: {
    animation: {
      duration: 250,
    },
  },
  // stopEvent: false,
  // offset: [0, -10]
});

closer.onclick = function () {
  popup.setPosition(undefined);
  closer.blur();
  return false;
};

const map = new Map({
  target: "map",
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: [900544.4532489562, 1041662.7869185621],
    zoom: 6,
    extent: [
      -112701.66807717911, 328416.9877889885, 1913790.5745750917,
      1754908.5860481358,
    ],
  }),
  controls: [],
});

map.addOverlay(popup);

//scalebar
const scaleBarControl = new ScaleLine({
  units: "metric", // You can also use 'imperial' for non-metric units
  bar: true, // Display the scale bar as a line
  steps: 2, // Number of scale steps to display
  text: true, // Display text on the scale bar
  minWidth: 120, // Minimum width of the scale bar in pixels
  maxWidth: 150,
});
map.addControl(scaleBarControl);

// Create the mouse position control
var mousePositionControl = new MousePosition({
  coordinateFormat: createStringXY(5), // Format the coordinates
  projection: "EPSG:4326", // The projection of the coordinates (e.g., WGS 84)
  undefinedHTML: "&nbsp;", // Text to display when coordinates are undefined
  target: document.getElementById("mouse-position"),
});

// Add the mouse position control to the map
map.addControl(mousePositionControl);

const overviewMapControl = new OverviewMap({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
});

map.addControl(overviewMapControl);

var querypaneButton = document.createElement("button");
querypaneButton.innerHTML = "Query Pane"
// // "<p>Query Pane</p>";
// '<img src="resources/images/home.svg" alt="" style="width: 20px; height: 20px; filter:brightness(0) invert(1); vertical-align:middle"></img>';
querypaneButton.className = "myButton";
querypaneButton.id = "querypaneButton";

var querypaneElement = document.createElement("div");
querypaneElement.className = "querypaneButtonDiv";
querypaneElement.appendChild(querypaneButton);

// Define the default extent or view you want to set when the "Home" button is clicked

var querypaneControl = new Control({
  element: querypaneElement,
});

// Add a click event listener to the "Home" button
querypaneButton.addEventListener("click", function () {
  showQueryPaneOnClick = !showQueryPaneOnClick;
  if (showQueryPaneOnClick) {
    querypaneButton.innerHTML = "Close Pane";
    document.getElementById("mySidebar").style.width = "20%";
    document.getElementById("map").style.marginLeft = "20%";
    document.getElementById("map").style.width = "80%";
  } else {
    querypaneButton.innerHTML = "Query Pane"
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("map").style.marginLeft = "0";
    document.getElementById("map").style.width = "100%";
  }
});

map.addControl(querypaneControl);

var homeButton = document.createElement("button");
homeButton.innerHTML = "Home";
// '<img src="resources/images/home.svg" alt="" style="width: 20px; height: 20px; filter:brightness(0) invert(1); vertical-align:middle"></img>';
homeButton.className = "myButton";
homeButton.id = "homeButton";

var homeElement = document.createElement("div");
homeElement.className = "homeButtonDiv";
homeElement.appendChild(homeButton);

// Define the default extent or view you want to set when the "Home" button is clicked
var defaultExtent = [
  -112701.66807717911, 328416.9877889885, 1913790.5745750917,
  1754908.5860481358,
]; // Define your desired extent

var HomeControl = new Control({
  element: homeElement,
});

// Add a click event listener to the "Home" button
homeButton.addEventListener("click", function () {
  map.getView().fit(defaultExtent, { duration: 2000 }); // Fit the view to the default extent
});

map.addControl(HomeControl);

//Zoom in Control
const zoomInteraction = new DragBox();

zoomInteraction.on("boxend", function () {
  var zoonInExtent = zoomInteraction.getGeometry().getExtent();
  map.getView().fit(zoonInExtent);
});

var ziButton = document.createElement("button");
ziButton.innerHTML = "ZoomIN";
// '<img src="resources/images/home.svg" alt="" style="width: 20px; height: 20px; filter:brightness(0) invert(1); vertical-align:middle"></img>';
ziButton.className = "myButton";
ziButton.id = "ziButton";

var ziElement = document.createElement("div");
ziElement.className = "ziButtonDiv";
ziElement.appendChild(ziButton);

var ziControl = new Control({
  element: ziElement,
});

//zoomout control
const zoomOutteraction = new DragBox({
  // condition: platformModifierKeyOnly
});
zoomOutteraction.on("boxend", function () {
  const extent = zoomOutteraction.getGeometry().getExtent();
  const view = map.getView();
  const newZoom = view.getZoom() - 1; // Zoom out by 1 level

  view.fit(extent, { size: map.getSize(), duration: 500 });
  view.setZoom(newZoom);
});

var zoButton = document.createElement("button");
zoButton.innerHTML = "ZoomOUT";
// '<img src="resources/images/home.svg" alt="" style="width: 20px; height: 20px; filter:brightness(0) invert(1); vertical-align:middle"></img>';
zoButton.className = "myButton";
zoButton.id = "zoButton";

var zoElement = document.createElement("div");
zoElement.className = "zoButtonDiv";
zoElement.appendChild(zoButton);

var zoControl = new Control({
  element: zoElement,
});

ziButton.addEventListener("click", () => {
  zoomInFlag = !zoomInFlag;
  if (zoomInFlag) {
    document.getElementById("map").style.cursor = "zoom-in";
    ziButton.style.backgroundColor = "green";
    zoButton.style.backgroundColor = "";
    map.addInteraction(zoomInteraction);
  } else {
    map.removeInteraction(zoomInteraction);
    ziButton.style.backgroundColor = "";
    document.getElementById("map").style.cursor = "default";
  }
});

zoButton.addEventListener("click", () => {
  zoomOutFlag = !zoomOutFlag;
  if (zoomOutFlag) {
    document.getElementById("map").style.cursor = "zoom-out";
    zoButton.style.backgroundColor = "green";
    ziButton.style.backgroundColor = "";
    map.addInteraction(zoomOutteraction);
  } else {
    map.removeInteraction(zoomOutteraction);
    zoButton.style.backgroundColor = "";

    // map.removeInteraction(zoomInteraction);
    document.getElementById("map").style.cursor = "default";
  }
});

map.addControl(ziControl);
map.addControl(zoControl);

//zoom in and out logic

//DKIS Project Site
var dkisButton = document.createElement("button");
dkisButton.innerHTML = "DKIS";
// '<img src="resources/images/home.svg" alt="" style="width: 20px; height: 20px; filter:brightness(0) invert(1); vertical-align:middle"></img>';
dkisButton.className = "myButton";
dkisButton.id = "dkisButton";

var dkisElement = document.createElement("div");
dkisElement.className = "dkisButtonnDiv";
dkisElement.appendChild(dkisButton);

// Define the default extent or view you want to set when the "Home" button is clicked
var disextent = [
  1277802.9894, 1149417.90719754, 1286441.183338, 1154167.72831068,
]; // Define your desired extent

var DkisControl = new Control({
  element: dkisElement,
});

// Add a click event listener to the "Home" button
dkisButton.addEventListener("click", function () {
  map.removeInteraction(zoomInteraction);
  map.removeInteraction(zoomOutteraction);
  map.getView().fit(disextent, { duration: 3000 }); // Fit the view to the default extent
});

map.addControl(DkisControl);

var qryButton = document.createElement("button");
qryButton.innerHTML = "LGA Info";
// '<img src="resources/images/home.svg" alt="" style="width: 20px; height: 20px; filter:brightness(0) invert(1); vertical-align:middle"></img>';
qryButton.className = "myButton";
qryButton.id = "qryButton";

var qryElement = document.createElement("div");
qryElement.className = "qryButtonnDiv";
qryElement.appendChild(qryButton);

var qryControl = new Control({
  element: qryElement,
});

qryButton.addEventListener("click", function () {
  showPopupOnMapClick = !showPopupOnMapClick; // Toggle the state

  if (showPopupOnMapClick) {
    showPopupOnstateClick = false;
    showPopupOnSenClick = false;
    showPopupOnfarmClick = false;
    qryButton.textContent = "Hide LGA Info";
    qrysteButton.textContent = "State Info";
    qrysenButton.textContent = "Senatorial Info";
    qryfarmButton.textContent = "Farm Info";
    qryButton.style.backgroundColor = "green";
    qrysteButton.style.backgroundColor = "";
    qrysenButton.style.backgroundColor = "";
    qryfarmButton.style.backgroundColor = "";
    map.removeInteraction(zoomInteraction);
    map.removeInteraction(zoomOutteraction);
    ziButton.style.backgroundColor = "";
    zoButton.style.backgroundColor = "";
    document.getElementById("map").style.cursor = "default";
  } else {
    qryButton.textContent = "LGA Info";
    qryButton.style.backgroundColor = "";
    popup.setPosition(undefined); // Hide the popup if it was open
  }
});

map.addControl(qryControl);

var qrysteButton = document.createElement("button");
qrysteButton.innerHTML = "State Info";
// '<img src="resources/images/home.svg" alt="" style="width: 20px; height: 20px; filter:brightness(0) invert(1); vertical-align:middle"></img>';
qrysteButton.className = "myButton";
qrysteButton.id = "qrysteButton";

var qrysteElement = document.createElement("div");
qrysteElement.className = "qrysteButtonDiv";
qrysteElement.appendChild(qrysteButton);

var qrysteControl = new Control({
  element: qrysteElement,
});

qrysteButton.addEventListener("click", function () {
  showPopupOnstateClick = !showPopupOnstateClick; // Toggle the state

  if (showPopupOnstateClick) {
    showPopupOnMapClick = false;
    showPopupOnSenClick = false;
    showPopupOnfarmClick = false;
    qrysteButton.textContent = "Hide state Info";
    qrysenButton.textContent = "Senatorial Info";
    qryButton.textContent = "LGA Info";
    qryfarmButton.textContent = "Farm Info";
    qrysteButton.style.backgroundColor = "green";
    qryButton.style.backgroundColor = "";
    qrysenButton.style.backgroundColor = "";
    qryfarmButton.style.backgroundColor = "";
    map.removeInteraction(zoomInteraction);
    map.removeInteraction(zoomOutteraction);
    ziButton.style.backgroundColor = "";
    zoButton.style.backgroundColor = "";
    document.getElementById("map").style.cursor = "default";
  } else {
    qrysteButton.textContent = "State Info";
    qrysteButton.style.backgroundColor = "";
    popup.setPosition(undefined); // Hide the popup if it was open
  }
});

map.addControl(qrysteControl);

var qrysenButton = document.createElement("button");
qrysenButton.innerHTML = "Senatorial Info";
// '<img src="resources/images/home.svg" alt="" style="width: 20px; height: 20px; filter:brightness(0) invert(1); vertical-align:middle"></img>';
qrysenButton.className = "myButton";
qrysenButton.id = "qrysenButton";

var qrysenElement = document.createElement("div");
qrysenElement.className = "qrysenButtonDiv";
qrysenElement.appendChild(qrysenButton);

var qrysenControl = new Control({
  element: qrysenElement,
});

qrysenButton.addEventListener("click", function () {
  showPopupOnSenClick = !showPopupOnSenClick; // Toggle the state

  if (showPopupOnSenClick) {
    showPopupOnMapClick = false;
    showPopupOnstateClick = false;
    showPopupOnfarmClick = false;
    qrysenButton.textContent = "Stop Sen Info";
    qrysteButton.textContent = "State Info";
    qryButton.textContent = "LGA Info";
    qryfarmButton.textContent = "Farm Info";
    qrysenButton.style.backgroundColor = "green";
    qryButton.style.backgroundColor = "";
    qrysteButton.style.backgroundColor = "";
    qryfarmButton.style.backgroundColor = "";
    map.removeInteraction(zoomInteraction);
    map.removeInteraction(zoomOutteraction);
    ziButton.style.backgroundColor = "";
    zoButton.style.backgroundColor = "";
    document.getElementById("map").style.cursor = "default";
  } else {
    qrysenButton.textContent = "Senatorial Info";
    qrysenButton.style.backgroundColor = "";
    popup.setPosition(undefined); // Hide the popup if it was open
  }
});

map.addControl(qrysenControl);

var qryfarmButton = document.createElement("button");
qryfarmButton.innerHTML = "Farm Info";
// '<img src="resources/images/home.svg" alt="" style="width: 20px; height: 20px; filter:brightness(0) invert(1); vertical-align:middle"></img>';
qryfarmButton.className = "myButton";
qryfarmButton.id = "qryfarmButton";

var qryfarmElement = document.createElement("div");
qryfarmElement.className = "qryfarmButtonDiv";
qryfarmElement.appendChild(qryfarmButton);

var qryfarmControl = new Control({
  element: qryfarmElement,
});

qryfarmButton.addEventListener("click", function () {
  showPopupOnfarmClick = !showPopupOnfarmClick; // Toggle the state

  if (showPopupOnfarmClick) {
    showPopupOnMapClick = false;
    showPopupOnstateClick = false;
    showPopupOnSenClick = false;
    qryfarmButton.textContent = "Stop Farm Info";
    qrysteButton.textContent = "State Info";
    qryButton.textContent = "LGA Info";
    qrysenButton.textContent = "Senatorial Info";
    qryfarmButton.style.backgroundColor = "green";
    qryButton.style.backgroundColor = "";
    qrysteButton.style.backgroundColor = "";
    qrysenButton.style.backgroundColor = "";
    map.removeInteraction(zoomInteraction);
    map.removeInteraction(zoomOutteraction);
    ziButton.style.backgroundColor = "";
    zoButton.style.backgroundColor = "";
    document.getElementById("map").style.cursor = "default";
  } else {
    qryfarmButton.textContent = "Farm Info";
    qryfarmButton.style.backgroundColor = "";
    popup.setPosition(undefined); // Hide the popup if it was open
  }
});

map.addControl(qryfarmControl);

// var slider = new ZoomSlider();
// map.addControl(slider);

const stateSource = new TileWMS({
  url: "http://146.190.140.212:8080/geoserver/FiFwsp/wms?",
  params: { LAYERS: "FiFwsp:state_boundary" },
  serverType: 'geoserver',
  transition: 0,
});

const state = new TileLayer({
  source: stateSource,
  title: "State"
})

map.addLayer(state);

const senatorialSource = new TileWMS({
  url: "http://146.190.140.212:8080/geoserver/FiFwsp/wms?",
    params: { LAYERS: "FiFwsp:senatorial_boundary" },
    ratio: 1,
    serverType: "geoserver",
    projection: "EPSG:4326",
})

const senatorial = new TileLayer({
  title: "Seantorial District",
  // extent: [-180, -90, -180, 90],
  source: senatorialSource,
});

map.addLayer(senatorial);


const lgaSource = new TileWMS({
  url: "http://146.190.140.212:8080/geoserver/FiFwsp/wms?",
    params: { LAYERS: "FiFwsp:lga_boundary" },
    ratio: 1,
    serverType: "geoserver",
    projection: "EPSG:4326",
});

const lga_layer = new TileLayer({
  title: "LGA Layer",
  // extent: [-180, -90, -180, 90],
  source: lgaSource,
});

map.addLayer(lga_layer);


const farmboundarySource = new TileWMS({
  url: "http://146.190.140.212:8080/geoserver/FiFwsp/wms?",
    params: { LAYERS: "	FiFwsp:farm_boundary2" },
    ratio: 1,
    serverType: "geoserver",
    projection: "EPSG:4326",
});

const farm_boundary = new TileLayer({
  title: "Farm Parcels",
  // extent: [-180, -90, -180, 90],
  source: farmboundarySource,
});

map.addLayer(farm_boundary);

const schools = new ImageLayer({
  title: "Schools",
  // extent: [-180, -90, -180, 90],
  source: new ImageWMS({
    url: "http://146.190.140.212:8080/geoserver/FiFwsp/wms?",
    params: { LAYERS: "FiFwsp:schools" },
    ratio: 1,
    serverType: "geoserver",
    projection: "EPSG:4326",
  }),
});
map.addLayer(schools);

const ward = new ImageLayer({
  title: "Wards",
  // extent: [-180, -90, -180, 90],
  source: new ImageWMS({
    url: "http://146.190.140.212:8080/geoserver/FiFwsp/wms?",
    params: { LAYERS: "FiFwsp:wards" },
    ratio: 1,
    serverType: "geoserver",
    projection: "EPSG:4326",
  }),
  visible: false, 
});

map.addLayer(ward);

const waterSource = new ImageLayer({
  title: "Water Baseline",
  // extent: [-180, -90, -180, 90],
  source: new ImageWMS({
    url: "http://146.190.140.212:8080/geoserver/FiFwsp/wms?",
    params: { LAYERS: "FiFwsp:water_baseline" },
    ratio: 1,
    serverType: "geoserver",
    projection: "EPSG:4326",
  }),
  visible: false, 
});

map.addLayer(waterSource);


// Toggle vector layer visibility based on zoom level
map.getView().on('change:resolution', function () {
  const currentZoom = map.getView().getZoom();
  waterSource.setVisible(currentZoom > 20);
});


// Add this function outside your click event handler
function createChart(data) {
  const ctx = document.getElementById("myChart").getContext("2d");

  const chart = new Chart(ctx, {
    type: "bar", // Change the chart type as needed (e.g., 'bar', 'line', etc.)
    data: {
      labels: ["No. Schools", "No. Water Infra"], // Replace with your chart labels
      datasets: [
        {
          data: data, // Replace with your chart data
          backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
          ], // Customize colors
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
          ], // Customize border colors
          borderWidth: 1,
          barThickness: 20,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false, // Hide the legend
        },
      },
      indexAxis: "y", // Make the chart horizontal
      responsive: true,
      // maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Vector Layer for Highlighting
const highlightedFeatureSource = new VectorSource();
const highlightedFeatureLayer = new VectorLayer({
  source: highlightedFeatureSource,
  style: new Style({
    fill: new Fill({
      color: 'rgba(0, 255, 255, 0.2)',
    }),
    stroke: new Stroke({
      color: 'blue', // Customize the stroke color as needed
      width: 2,
    }),
  }),
});

map.addLayer(highlightedFeatureLayer);



map.on("singleclick", function (event) {
  if (showPopupOnMapClick) {
      // Clear previous highlights
      highlightedFeatureSource.clear();
    const viewResolution = map.getView().getResolution();
    const wmsSource = lga_layer.getSource();

    const url = wmsSource.getFeatureInfoUrl(
      event.coordinate,
      viewResolution,
      map.getView().getProjection(),
      { INFO_FORMAT: "application/json" }
    );

    if (url) {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const features = new GeoJSON().readFeatures(data);
          // Highlight the clicked feature on the highlight layer
          highlightedFeatureSource.addFeatures(features);

          // Extract the attributes "name" and "adm_2en"
          const attributes = data.features[0].properties;
          const lga_name = attributes.adm2_en;
          const state = attributes.adm1_en;
          const senDist = attributes.sd_en;
          const no_schools = attributes.schools;
          const no_waterInfra = attributes.watebaseli;
          const totalInfra = attributes.schools + attributes.watebaseli;
          const lgaSize = attributes.shape_area.toFixed(5);
          const growthIndex = ((totalInfra / lgaSize) * 100).toFixed(2);

          const chartData = [no_schools, no_waterInfra]; // Replace with your chart data points

          // Build popup content
          const popupContent = `
          <div style="background-color: rgba(0, 255, 0, 0.1);">
          <strong>LGA:</strong> ${lga_name}<br>
          <strong>State:</strong> ${state}<br>
          <strong>Sen Dist:</strong> ${senDist}<br>
          <strong>No. Schools:</strong> ${no_schools}<br>
          <strong>No. Water Sources:</strong> ${no_waterInfra}<br>
          <strong>Total Infrastruture:</strong> ${totalInfra}<br>
          <strong>LGA Size:</strong> ${lgaSize}<br>
          <strong>Infrastructure Index:</strong> ${growthIndex}<br>
          <canvas id="myChart" width="100%" height="35px"></canvas>
          </div>
        `;

          // Show the popup
          popup.setPosition(event.coordinate);
          popup.getElement().innerHTML = popupContent;

          createChart(chartData);
        });
    }
  } else if (showPopupOnstateClick) {
      // Clear previous highlights
      highlightedFeatureSource.clear();
    const viewResolution = map.getView().getResolution();
    const wmsSource = state.getSource();

    const url = wmsSource.getFeatureInfoUrl(
      event.coordinate,
      viewResolution,
      map.getView().getProjection(),
      { INFO_FORMAT: "application/json" }
    );

    if (url) {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const features = new GeoJSON().readFeatures(data);
          // Highlight the clicked feature on the highlight layer
          highlightedFeatureSource.addFeatures(features);
          // Extract the attributes "name" and "adm_2en"
          const attributes = data.features[0].properties;
          const state = attributes.adm1_en;
          const wards = attributes.numwards.toFixed(0);
          const no_schools = attributes.schools;
          const no_waterInfra = attributes.waterbasel;
          const totalInfra = attributes.schools + attributes.waterbasel;
          const statesize = attributes.shape_area.toFixed(5);
          const growthIndex = (totalInfra / statesize).toFixed(2);

          const chartData = [no_schools, no_waterInfra]; // Replace with your chart data points

          // Build popup content
          const popupContent = `
          <div style="background-color: rgba(255, 179, 179, 0.5);">
          <strong>State:</strong> ${state}<br>
          <strong>Number Wards:</strong> ${wards}<br>
          <strong>No. Schools:</strong> ${no_schools}<br>
          <strong>No. Water Sources:</strong> ${no_waterInfra}<br>
          <strong>Total Infrastruture:</strong> ${totalInfra}<br>
          <strong>State Size:</strong> ${statesize}<br>
          <strong>Infrastructure Index:</strong> ${growthIndex}<br>
          <canvas id="myChart" width="100%" height="35px"></canvas>
          </div>
        `;
          // Show the popup
          popup.setPosition(event.coordinate);
          popup.getElement().innerHTML = popupContent;

          createChart(chartData);
        });
    }
  } else if (showPopupOnSenClick) {

    highlightedFeatureSource.clear();

    const viewResolution = map.getView().getResolution();
    const wmsSource = senatorial.getSource();

    const url = wmsSource.getFeatureInfoUrl(
      event.coordinate,
      viewResolution,
      map.getView().getProjection(),
      { INFO_FORMAT: "application/json" }
    );

    if (url) {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const features = new GeoJSON().readFeatures(data);
          // Highlight the clicked feature on the highlight layer
          highlightedFeatureSource.addFeatures(features);

          // Extract the attributes "name" and "adm_2en"
          const attributes = data.features[0].properties;
          const state = attributes.adm1_en;
          const senDistrict = attributes.sd_ref;
          const wards = attributes.numwards.toFixed(0);
          const no_schools = attributes.schools;
          const no_waterInfra = attributes.waterbasel;
          const totalInfra = attributes.schools + attributes.waterbasel;
          const senDissize = attributes.shape_area.toFixed(5);
          const growthIndex = (totalInfra / senDissize).toFixed(2);

          const chartData = [no_schools, no_waterInfra]; // Replace with your chart data points

          // Build popup content
          const popupContent = `
          <div style="background-color: rgba(204, 242, 255, 0.6);">
          <strong>Senatorial District:</strong> ${senDistrict}<br>
          <strong>State:</strong> ${state}<br>          
          <strong>Number Wards:</strong> ${wards}<br>
          <strong>No. Schools:</strong> ${no_schools}<br>
          <strong>No. Water Sources:</strong> ${no_waterInfra}<br>
          <strong>Total Infrastruture:</strong> ${totalInfra}<br>
          <strong>State Size:</strong> ${senDissize}<br>
          <strong>Infrastructure Index:</strong> ${growthIndex}<br>
          <canvas id="myChart" width="100%" height="35px"></canvas>

          </div>
        `;
          // Show the popup
          popup.setPosition(event.coordinate);
          popup.getElement().innerHTML = popupContent;

          createChart(chartData);
        });
    }
  } else if (showPopupOnfarmClick) {
    const features = new GeoJSON().readFeatures(data);
    // Highlight the clicked feature on the highlight layer
    highlightedFeatureSource.addFeatures(features);

    highlightedFeatureSource.clear();

    const viewResolution = map.getView().getResolution();
    const wmsSource = farm_boundary.getSource();

    const url = wmsSource.getFeatureInfoUrl(
      event.coordinate,
      viewResolution,
      map.getView().getProjection(),
      { INFO_FORMAT: "application/json" }
    );

    if (url) {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          // Extract the attributes "name" and "adm_2en"
          const attributes = data.features[0].properties;
          const FName = attributes.First_name;
          const LName = attributes.Last_name;
          const Age = attributes.Age;
          const Gender = attributes.Gender;
          const Education = attributes.Educationa;
          const MNumber = "0"+attributes.Mobile_Num;
          const LastyearIncome = attributes.Last_Year_;
          const Association = attributes.Society_an;
          const yearsExperience = attributes.Experience;
          const CropGrown = attributes.Crop_grown;
          const photograph = attributes.Photograph;
          const fullName = FName + " " + LName;

          // Build popup content
          const popupContent = `
          <div style="background-color: rgba(204, 242, 255, 0.6);">
          <strong>Full Name: </strong> ${fullName}<br>
          <strong>Age: </strong> ${Age}<br>          
          <strong>Gender: </strong> ${Gender}<br>
          <strong>Education: </strong> ${Education}<br>
          <strong>Mobile Number: </strong> ${MNumber}<br>
          <strong>Last Year Income: </strong> ${LastyearIncome}<br>
          <strong>Group/Association: </strong> ${Association}<br>
          <strong>Year of Experience: </strong> ${yearsExperience}<br>
          <strong>Crops Grown: </strong> ${CropGrown}<br>
          <p><a href='${photograph}' target="_blank" title="Open farmer Picture in new Window">Farmer Photograph</a></p><br>
          </div>
        `;
          // Show the popup
          popup.setPosition(event.coordinate);
          popup.getElement().innerHTML = popupContent;
        });
    }
  }
});

// map.on("pointermove", function () {
//   map.getTargetElement().style.cursor = 'pointer';
// });

const layerSwitcher = new LayerSwitcher({
  tipLabel: "Custom Layer Switcher",
  groupSelectStyle: "children", // Display child layers as radio buttons
  show_groups: true, // Show layer groups in the switcher
  show_progress: true, // Show loading progress for layers
  zoomToExtent: true, // Add an "extent" button for zooming to the extent of the layer
  collapsed: false,
  startActive: true,
});
map.addControl(layerSwitcher);





// Assuming you have already fetched and parsed your senatorial and LGA data

// Create an object to store school counts by state
const schoolCounts = {};

// Loop through the senatorial district features
senatorial.getFeatures().forEach(senatorialFeature => {
  const state = senatorialFeature.get('adm1_en');

  // Initialize the count for the state if it doesn't exist
  if (!schoolCounts[state]) {
    schoolCounts[state] = {};
  }

  // Loop through the LGA features to find matching LGA features
  lga_layer.getSource().forEachFeature(lgaFeature => {
    if (
      lgaFeature.get('adm1_en') === state &&
      lgaFeature.get('sd_ref') === senatorialFeature.get('sd_ref')
    ) {
      // Accumulate the number of schools
      const noSchools = senatorialFeature.get('schools') || 0;
      schoolCounts[state][senatorialFeature.get('sd_ref')] = noSchools;
    }
  });
});

// Get a reference to your existing table element by its ID
const table = document.getElementById('statebreakdown');

// Create the table rows and populate the table
Object.keys(schoolCounts).forEach(state => {
  Object.keys(schoolCounts[state]).forEach(lga => {
    const row = table.insertRow(-1); // Insert a new row at the end of the table

    const stateCell = row.insertCell(0);
    stateCell.innerHTML = state;

    const lgaCell = row.insertCell(1);
    lgaCell.innerHTML = lga;

    const countCell = row.insertCell(2);
    countCell.innerHTML = schoolCounts[state][lga];
  });
});

