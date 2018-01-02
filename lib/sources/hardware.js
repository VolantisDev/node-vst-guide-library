var path = require('path')

function Hardware (data) {
  this.name = data.name;
  this.location = data.location || 'unknown'
}

module.exports = {
  name: 'Hardware component',
  color: 'red',
  priority: 70,
  create: Hardware
}
