const api = require('vst-guide-api')
var db = require('./local-database')

module.exports = {
  populatePluginInfo: function (id) {
    return api.plugin(id)
      .then(function (data) {
        return db.read('plugin', id, false)
          .then(function (dbItem) {
            if (data) {
              dbItem.data = Object.assign({}, dbItem.data, data)

              return db.update('plugin', id, dbItem)
                .then(function () {
                  return dbItem.data
                })
            } else {
              return dbItem.data
            }
          })
      })
  }
}
