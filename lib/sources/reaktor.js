var path = require('path')

function Reaktor (data) {
  this.name = data.name;
  this.reaktorId = data.reaktorId
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
  name: 'Reaktor instrument',
  color: 'yellow',
  priority: 70,
  create: Reaktor
}
