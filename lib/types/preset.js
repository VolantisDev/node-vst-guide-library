var sources = require('../sources')

function Preset (data) {
  this.data = data
  this.id = data.id
  this.name = data.name
  this.sourceId = data.sourceId
  this.sourceData = data.sourceData
  this.source = sources.create(this.sourceId, this.sourceData)
}

module.exports = {
  name: 'Preset',
  sources: ['preset'],
  create: Preset
}
