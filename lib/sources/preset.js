var path = require('path')

function Preset (data) {
  this.name = data.name
  this.parentType = data.parentType
  this.parentId = data.parentId
  this.filePath = data.filePath

  this.directory = function () {
    return path.dirname(this.filePath)
  }

  this.filename = function () {
    return path.basename(this.filePath)
  }

  this.extension = function () {
    return path.extname(this.filePath)
  }
}

// Read presets from each installed plugin that we have preset data for in the DB.
module.exports = {
  name: 'Preset',
  color: 'purple',
  priority: 90,
  create: Preset
}
