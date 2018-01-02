var vstScanner = require('./lib/importers/vst-scanner')
var apiImporter = require('./lib/importers/api-importer')
var db = require('./lib/local-database')

vstScanner()
  .then(function (results) {
    return apiImporter()
      .then(function () {
        return db.find('plugin', {}, { followRedirects: true })
      })
      .then(function (plugins) {
        return db.find('developer', {})
          .then(function (developers) {
            console.log(plugins)
            console.log(developers)
            console.log('Added/updated ' + Object.keys(results).length + ' items.')
            console.log('Total library items (excluding redirects): ' + plugins.length)
            console.log('Total developers: ' + developers.length)
          })
      })
  })
