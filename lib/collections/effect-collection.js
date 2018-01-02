var Promise = require('bluebird')
var db = require('../local-database')

var types = {
  hardware: 'hardwareType',
  plugin: 'pluginType'
}

// pluginType should be 'instrument' or 'effect', or will default to 'unknown'
function EffectCollection (items) {
  this.items = items || []

  this.loadAllEffects = function loadAllEffects() {
    var effects = {}

    return Promise.each(Object.keys(types), function (type) {
      var properties = {}
      properties[types[type]] = 'effect'
      return db.loadObjects(type, properties, { followRedirects: true })
        .then(function (items) {
          items.forEach(function (item) {
            effects[item.id] = item
            return item
          })
        })
    })
      .then(function () {
        return effects
      })
  }
}

module.exports = {
  name: 'Effect collection',
  types: types,
  create: EffectCollection
}
