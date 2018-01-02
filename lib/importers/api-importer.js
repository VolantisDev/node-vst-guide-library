var Promise = require('bluebird')
const api = require('../api')

function importDevelopers(db) {
  db = db || require('../local-database')

  var developersObj = {}

  return db.find('plugin', {}, { followRedirects: true })
    .then(function (plugins) {
      plugins.forEach(function (plugin) {
        if (plugin.developer) {
          developersObj[plugin.developer] = true
        }
      })

      return Object.keys(developersObj)
    })
    .then(function (developers) {
      return Promise.each(developers, function (developerId) {
        return db.read('developer', developerId)
          .then(function (developer) {
            return api.getDeveloper(developerId)
              .then(function (newDeveloper) {
                if (developer) {
                  newDeveloper = Object.assign({}, developer, newDeveloper)
                  if (newDeveloper && newDeveloper.id) {
                    return db.update('developer', developerId, newDeveloper)
                  } else {
                    return true
                  }
                } else {
                  if (newDeveloper && newDeveloper.id) {
                    return db.insert('developer', developerId, newDeveloper)
                  } else {
                    return true
                  }
                }
              })
          })
      })
    })
}

function doImport(db) {
  db = db || require('../local-database')

  return api.populateAllPluginInfo(db)
    .then(function () {
      return importDevelopers(db)
    })
    .catch(function (message) {
      return true
    })
}

module.exports = doImport
