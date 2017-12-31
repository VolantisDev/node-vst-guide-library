var path = require('path')

function Vst3 (data) {
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
  name: 'VST3 file',
  color: 'blue',
  priority: 30,
  create: Vst3
}
