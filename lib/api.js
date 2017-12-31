const Promise = require('bluebird')
const api = require('vst-guide-api')
var db = require('./local-database')

function copyItem(dbItem, newId) {
  var newData = Object.assign({}, dbItem.data, { id: newId })

  return db.insert('plugin', newId, newData, false)
}

function writeRedirectData(dbItem, newId) {
  var newData = { redirect: newId }

  return db.update('plugin', dbItem.id, newData, false)
}

function setRedirect(dbItem, newId) {
  return db.read('plugin', newId, false)
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
        return writeRedirectData(dbItem, newId)
          .then(function () {
            return populatePluginInfo(newId)
          })
      }
    })
}

function populatePluginInfo(id) {
  var dbItem = {}
  return db.read('plugin', id, false)
    .then(function (dbResult) {
      dbItem = dbResult
      return api.plugin(id)
    })
    .then(function (data) {
      if (data.redirect) {
        return setRedirect(dbItem, data.redirect)
      } else if (data.id) {
        dbItem.data = Object.assign({}, dbItem.data, data)

        return db.update('plugin', id, dbItem.data)
          .then(function () {
            return dbItem.data
          })
      } else {
        return dbItem.data
      }
    })
    .catch(function (message) {
      return dbItem.data || {}
    })
}

function populateAllPluginInfo() {
  return db.find('plugin')
    .then(function (results) {
      return Promise.each(results, function (result) {
        return populatePluginInfo(result.id)
      })
    })
}

module.exports = {
  populatePluginInfo: populatePluginInfo,
  populateAllPluginInfo: populateAllPluginInfo
}
