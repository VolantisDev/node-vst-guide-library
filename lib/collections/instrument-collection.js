var Promise = require('bluebird')
var db = require('../local-database')

var types = {
  hardware: 'hardwareType',
  plugin: 'pluginType'
}

// pluginType should be 'instrument' or 'effect', or will default to 'unknown'
function InstrumentCollection (items) {
  var collection = this

  this.items = items || []

  this.loadAll = function loadAll() {
    var instruments = {}

    return Promise.each(Object.keys(types), function (type) {
      var properties = {}
      properties[types[type]] = 'instrument'
      return db.loadObjects(type, properties, { followRedirects: true })
        .then(function (items) {
          items.forEach(function (item) {
            instruments[item.id] = item
            return item
          })
        })
    })
      .then(function () {
        Object.keys(instruments).forEach(function (effect) {
          collection.items.push(effect)
        })

        return collection.items
      })
  }
}

module.exports = {
  name: 'Instrument collection',
  types: types,
  create: InstrumentCollection
}
