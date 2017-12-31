var path = require('path')

function AudioFile (data) {
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

// Read common audio file types.
module.exports = {
  name: 'Audio file',
  color: 'green',
  priority: 10,
  create: AudioFile
}
