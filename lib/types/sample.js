var sources = require('../sources')

function Sample (data) {
  this.data = data
  this.id = data.id
  this.name = data.name
  this.sourceId = data.sourceId
  this.sourceData = data.sourceData
  this.source = sources.create(this.sourceId, this.sourceData)
}

module.exports = {
  name: 'Sample',
  sources: ['audio-file'],
  create: Sample
}
