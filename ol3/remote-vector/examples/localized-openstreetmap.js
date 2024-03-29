// tiles.openseamap.org does not set CORS headers, so we have to disable
// crossOrigin and we cannot use WebGL.

var openCycleMapLayer = new ol.layer.Tile({
  source: new ol.source.OSM({
    attributions: [
      new ol.Attribution({
        html: 'All maps &copy; ' +
            '<a href="http://www.opencyclemap.org/">OpenCycleMap</a>'
      }),
      ol.source.OSM.DATA_ATTRIBUTION
    ],
    url: 'http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
  })
});

var openSeaMapLayer = new ol.layer.Tile({
  source: new ol.source.OSM({
    attributions: [
      new ol.Attribution({
        html: 'All maps &copy; ' +
            '<a href="http://www.openseamap.org/">OpenSeaMap</a>'
      }),
      ol.source.OSM.DATA_ATTRIBUTION
    ],
    crossOrigin: null,
    url: 'http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png'
  })
});


var map = new ol.Map({
  layers: [
    openCycleMapLayer,
    openSeaMapLayer
  ],
  renderer: 'canvas',
  target: 'map',
  view: new ol.View2D({
    maxZoom: 18,
    center: [-244780.24508882355, 5986452.183179816],
    zoom: 15
  })
});
