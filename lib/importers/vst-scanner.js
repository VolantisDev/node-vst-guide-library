var config = require('vst-guide-config')
var vstScanner = require('vst-scanner')
var Promise = require('bluebird')

function scan(db, read) {
  db = db || require('../local-database')
  var type = false // Support both VST2 and VST3
  read = read || true

  return vstScanner.scan(config.get('vstPaths'), type, read)
    .then(function (results) {
      return Promise.each(Object.keys(results), function (id) {
        var item = results[id]

        item.sourceId = item.type
        item.sourceData = {
          name: item.title,
          filePath: item.path
        }

        return db.read('plugin', id, false)
          .then(function (dbItem) {
            item = dbItem !== null ? Object.assign({}, dbItem.data, item) : item
            var op = dbItem !== null ? 'update' : 'insert'
            results[id] = item
            return db[op]('plugin', id, item, false)
          })
      })
    })
}

module.exports = scan
