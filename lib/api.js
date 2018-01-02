const Promise = require('bluebird')
const api = require('vst-guide-api')
var db = require('./local-database')

function copyItem(dbItem, newId) {
  var newData = Object.assign({}, dbItem, { id: newId })

  return db.insert('plugin', newId, newData)
}

function writeRedirectData(dbItem, newId) {
  var newData = { redirect: newId }

  return db.update('plugin', dbItem.id, newData)
}

function setRedirect(dbItem, newId) {
  return db.read('plugin', newId, { followRedirects: true })
    .then(function (redirDbData) {
      if (!redirDbData || !redirDbData.id) {
        return copyItem(dbItem, newId)
          .then(function () {
            return writeRedirectData(dbItem, newId)
          })
          .then(function () {
            return populatePluginInfo(newId)
          })
      } else {
        return writeRedirectData(dbItem, redirDbData.id)
          .then(function () {
            return populatePluginInfo(redirDbData.id)
          })
      }
    })
}

function populatePluginInfo(id) {
  var dbItem = {}
  return db.read('plugin', id)
    .then(function (dbResult) {
      dbItem = dbResult
      if (dbItem.id) {
        return api.plugin(dbItem.id)
      } else {
        return api.plugin(id)
      }
    })
    .then(function (data) {
      if (data.redirect && !dbItem.redirect) {
        return setRedirect(dbItem, data.redirect)
      } else if (data.id) {
        dbItem = Object.assign({}, dbItem, data)

        return db.update('plugin', dbItem.id, dbItem)
          .then(function () {
            return dbItem
          })
      } else {
        return dbItem
      }
    })
    .catch(function (message) {
      return dbItem || {}
    })
}

function populateAllPluginInfo(useDb) {
  useDb = useDb || db
  return useDb.find('plugin')
    .then(function (results) {
      return Promise.each(results, function (result) {
        return populatePluginInfo(result.id)
      })
    })
}

function getDeveloper(id) {
  return api.get('developers', id)
    .then(function (result) {
      return result
    })
    .catch(function (message) {
      return {}
    })
}

module.exports = {
  populatePluginInfo: populatePluginInfo,
  populateAllPluginInfo: populateAllPluginInfo,
  getDeveloper: getDeveloper
}
