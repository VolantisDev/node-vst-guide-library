var vstScanner = require('./lib/importers/vst-scanner')
var db = require('./lib/local-database')
var api = require('./lib/api')

vstScanner()
  .then(function (results) {
    return api.populateAllPluginInfo()
      .then(function () {
        return db.find('plugin')
      })
      .then(function (findResults) {
        console.log(findResults)
        console.log('Added/updated ' + Object.keys(results).length + ' items.')
      })
  })
