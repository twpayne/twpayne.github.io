goog.provide('ol.interaction.Select');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.functions');
goog.require('ol.Feature');
goog.require('ol.FeatureOverlay');
goog.require('ol.events.condition');
goog.require('ol.interaction.Interaction');



/**
 * @constructor
 * @extends {ol.interaction.Interaction}
 * @param {olx.interaction.SelectOptions} options Options.
 * @todo stability experimental
 */
ol.interaction.Select = function(options) {

  goog.base(this);

  /**
   * @private
   * @type {ol.events.ConditionType}
   */
  this.condition_ = goog.isDef(options.condition) ?
      options.condition : ol.events.condition.singleClick;

  /**
   * @private
   * @type {ol.events.ConditionType}
   */
  this.addCondition_ = goog.isDef(options.addCondition) ?
      options.addCondition : ol.events.condition.never;

  /**
   * @private
   * @type {ol.events.ConditionType}
   */
  this.removeCondition_ = goog.isDef(options.removeCondition) ?
      options.removeCondition : ol.events.condition.never;

  /**
   * @private
   * @type {ol.events.ConditionType}
   */
  this.toggleCondition_ = goog.isDef(options.toggleCondition) ?
      options.toggleCondition : ol.events.condition.shiftKeyOnly;

  var layerFilter;
  if (goog.isDef(options.layerFilter)) {
    layerFilter = options.layerFilter;
  } else if (goog.isDef(options.layer)) {
    var layer = options.layer;
    layerFilter =
        /**
         * @param {ol.layer.Layer} l Layer.
         * @return {boolean} Include.
         */
        function(l) {
      return l === layer;
    };
  } else if (goog.isDef(options.layers)) {
    var layers = options.layers;
    layerFilter =
        /**
         * @param {ol.layer.Layer} layer Layer.
         * @return {boolean} Include.
         */
        function(layer) {
      return goog.array.indexOf(layers, layer) != -1;
    };
  } else {
    layerFilter = goog.functions.TRUE;
  }

  /**
   * @private
   * @type {function(ol.layer.Layer): boolean}
   */
  this.layerFilter_ = layerFilter;

  /**
   * @private
   * @type {ol.FeatureOverlay}
   */
  this.featureOverlay_ = new ol.FeatureOverlay({
    style: options.style
  });

};
goog.inherits(ol.interaction.Select, ol.interaction.Interaction);


/**
 * @return {ol.Collection} Features collection.
 * @todo stability experimental
 */
ol.interaction.Select.prototype.getFeatures = function() {
  return this.featureOverlay_.getFeatures();
};


/**
 * @inheritDoc
 */
ol.interaction.Select.prototype.handleMapBrowserEvent =
    function(mapBrowserEvent) {
  if (!this.condition_(mapBrowserEvent)) {
    return true;
  }
  var add = this.addCondition_(mapBrowserEvent);
  var remove = this.removeCondition_(mapBrowserEvent);
  var toggle = this.toggleCondition_(mapBrowserEvent);
  var map = mapBrowserEvent.map;
  var feature = map.forEachFeatureAtPixel(mapBrowserEvent.pixel,
      /**
        * @param {ol.Feature} feature Feature.
        * @param {ol.layer.Layer} layer Layer.
        */
      function(feature, layer) {
        this.addFeature_(feature, add, remove, toggle);
        return feature;
      }, this, this.layerFilter_);
  if (!goog.isDef(feature) && !add && !remove) {
    this.removeAllFeatures_();
  }
  return false;
};


/**
 * @param {?ol.Feature|undefined} feature Feature.
 * @param {Boolean} add Add
 * @param {Boolean} remove Remove
 * @param {Boolean} toggle Toggle
 * @private
 * @todo stability experimental
 */
ol.interaction.Select.prototype.addFeature_ = function(feature, add,
    remove, toggle) {
  var features = this.featureOverlay_.getFeatures();
  var index = -1;
  var i, ii;
  if ((!goog.isDef(feature) || goog.isNull(feature)) && !add) {
    this.removeAllFeatures_();
    return;
  }
  goog.asserts.assertInstanceof(feature, ol.Feature);
  index = features.getArray().indexOf(feature);
  if (index == -1) {
    if (!add && !remove && (features.getLength() > 0)) {
      for (ii = features.getLength() - 1, i = ii; i >= 0; i--) {
        if (features.getAt(i) != feature) {
          this.removeFeature_(/** @type {ol.Feature} */ (features.getAt(i)));
        }
      }
    }
  } else {
    if (toggle || remove) {
      this.removeFeature_(/** @type {ol.Feature} */ (features.getAt(index)));
      return;
    }
  }
  if (remove) {
    return;
  }
  if (index == -1) {
    features.push(feature);
    this.getMap().getSkippedFeatures().push(feature);
  }
};


/**
 * @param {ol.Feature} feature Feature.
 * @private
 * @todo stability experimental
 */
ol.interaction.Select.prototype.removeFeature_ = function(feature) {
  this.featureOverlay_.getFeatures().remove(feature);
  this.getMap().getSkippedFeatures().remove(feature);
};


/**
 * @private
 * @todo stability experimental
 */
ol.interaction.Select.prototype.removeAllFeatures_ = function() {
  var i, ii,
      features = this.featureOverlay_.getFeatures();
  for (ii = features.getLength() - 1, i = ii; i >= 0; i--) {
    this.removeFeature_(/** @type {ol.Feature} */ (features.getAt(i)));
  }
};


/**
 * @inheritDoc
 */
ol.interaction.Select.prototype.setMap = function(map) {
  goog.base(this, 'setMap', map);
  this.featureOverlay_.setMap(map);
};
