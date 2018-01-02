var sources = require('../sources')

// pluginType should be 'instrument' or 'effect', or will default to 'unknown'
function Hardware (data) {
  this.data = data
  this.id = data.id
  this.name = data.name
  this.hardwareType = data.hardwareType || 'unknown'
  this.connectionType = data.connectionType || 'unknown'
  this.sourceId = data.sourceId
  this.sourceData = data.sourceData
  this.source = sources.create(this.sourceId, this.sourceData)
}

module.exports = {
  name: 'Hardware component',
  sources: ['hardware'],
  create: Hardware
}
