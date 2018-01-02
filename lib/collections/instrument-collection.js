var Promise = require('bluebird')
var db = require('../local-database')

var types = {
  hardware: 'hardwareType',
  plugin: 'pluginType'
}

// pluginType should be 'instrument' or 'effect', or will default to 'unknown'
function InstrumentCollection (items) {
  this.items = items || []

  this.loadAllEffects = function loadAllInstruments() {
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
        return instruments
      })
  }
}

module.exports = {
  name: 'Instrument collection',
  types: types,
  create: InstrumentCollection
}
