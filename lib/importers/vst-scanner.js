var config = require('vst-guide-config')
var vstScanner = require('vst-scanner')

function scan(db) {
  db = db || require('../local-database')

  vstScanner.scan(config.get('vstPaths'))
    .then(function (results) {

      db.insert('plugin', )
      // @todo update / insert scanned plugins
    })
}


