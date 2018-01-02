var sources = require('../sources')

// pluginType should be 'instrument' or 'effect', or will default to 'unknown'
function Developer (data) {
  this.data = data
  this.id = data.id
  this.name = data.name
  this.shortName = data.shortName || data.name
  this.website = data.website || ''
  this.sourceId = data.sourceId
  this.sourceData = data.sourceData
  this.source = sources.create(this.sourceId, this.sourceData)
}

module.exports = {
  name: 'Developer',
  sources: [],
  create: Developer
}
