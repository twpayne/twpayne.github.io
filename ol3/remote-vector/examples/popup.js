/**
 * Elements that make up the popup.
 */
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');


/**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */
closer.onclick = function() {
  container.style.display = 'none';
  closer.blur();
  return false;
};


/**
 * Create an overlay to anchor the popup to the map.
 */
var overlay = new ol.Overlay({
  element: container
});


/**
 * Create the map.
 */
var map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.TileJSON({
        url: 'http://api.tiles.mapbox.com/v3/' +
            'mapbox.natural-earth-hypso-bathy.jsonp',
        crossOrigin: 'anonymous'
      })
    })
  ],
  renderer: exampleNS.getRendererFromQueryString(),
  overlays: [overlay],
  target: 'map',
  view: new ol.View2D({
    center: [0, 0],
    zoom: 2
  })
});


/**
 * Add a click handler to the map to render the popup.
 */
map.on('singleclick', function(evt) {
  var coordinate = evt.coordinate;
  var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
      coordinate, 'EPSG:3857', 'EPSG:4326'));

  overlay.setPosition(coordinate);
  content.innerHTML = '<p>You clicked here:</p><code>' + hdms +
      '</code>';
  container.style.display = 'block';

});
