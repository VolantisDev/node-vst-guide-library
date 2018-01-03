var Promise = require('bluebird')
var db = require('../local-database')

var types = {
  hardware: 'hardwareType',
  plugin: 'pluginType'
}

// pluginType should be 'instrument' or 'effect', or will default to 'unknown'
function EffectCollection (items) {
  var collection = this

  this.items = items || []

  this.loadAll = function loadAll() {
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
        Object.keys(effects).forEach(function (effect) {
          collection.items.push(effect)
        })

        return collection
      })
  }
}

module.exports = {
  name: 'Effect collection',
  types: types,
  create: function (items) {
    return new EffectCollection(items)
  },
  all: function () {
    var result = new EffectCollection()
    return result.loadAll()
  }
}
