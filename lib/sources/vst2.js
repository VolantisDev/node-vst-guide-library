var path = require('path')

function Vst2 (data) {
  this.name = data.name
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

module.exports = {
  name: 'VST2 file',
  color: 'blue',
  priority: 20,
  create: Vst2
}
