var path = require('path')

function Kontakt (data) {
  this.name = data.name;
  this.kontaktId = data.kontaktId
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
  name: 'Kontakt instrument',
  color: 'orange',
  priority: 70,
  create: Kontakt
}
