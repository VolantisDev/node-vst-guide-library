var sources = require('../sources')

// pluginType should be 'instrument' or 'effect', or will default to 'unknown'
function Plugin (data) {
  this.data = data
  this.name = data.name
  this.pluginType = data.pluginType || 'unknown'
  this.sourceId = data.sourceId
  this.sourceData = data.sourceData
  this.source = sources.create(this.sourceId, this.sourceData)
}

module.exports = {
  name: 'Plugin',
  sources: ['kontakt', 'reaktor', 'vst2', 'vst3'],
  create: Plugin
}
