var config = require('vst-guide-config')
var vstScanner = require('vst-scanner')

vstScanner.scan(config.get('vstPaths'))
  .then(function (results) {
    console.log(results)
  })
