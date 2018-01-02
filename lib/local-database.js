var Promise = require('bluebird')
var Datastore = require('nedb-promises')
var config = require('vst-guide-config')
var path = require('path')

var db = {
  library: new Datastore({
    filename: path.join(config.get('userLibraryPath'), 'library.db'),
    autoload: true
  }),
  overrides: new Datastore({
    filename: path.join(config.get('userLibraryPath'), 'overrides.db'),
    autoload: true
  })
}

function getRedirectId(type, id) {
  return read(type, id, { followRedirects: true })
    .then(function (item) {
      return item.id
    })
}

function removeDuplicates(items) {
  var ids = {}
  return items.filter(function (item) {
    var exists = ids[item.id]
    ids[item.id] = true
    return !exists
  })
}

function read(type, id, options) {
  options = options || {}
  options.override = options.override || false
  options.followRedirects = options.followRedirects || false
  var database = options.override ? db.overrides : db.library

  var query = {
    type: type,
    id: id
  }

  return database.findOne(query)
    .then(function (dbItem) {
      if (options.followRedirects && dbItem && dbItem.data && dbItem.data.redirect) {
        return read(type, dbItem.data.redirect, options)
      } else {
        return dbItem ? dbItem.data : null
      }
    })
}

function find(type, properties, options) {
  properties = properties || {}
  options = options || {}
  options.override = options.override || false
  options.followRedirects = options.followRedirects || false
  var database = options.override ? db.overrides : db.library

  var search = {
    type: type
  }
  Object.keys(properties).forEach(function (key) {
    search['data.' + key] = properties[key]
  })

  return database.find(search)
    .then(function (dbItems) {
      var results = []
      return Promise.each(dbItems, function (item) {
        results.push(item.data)
      })
        .then(function () {
          return results
        })
    })
    .then(function (results) {
      if (options.followRedirects) {
        return Promise.each(results, function (item, index) {
          if (item && item.redirect) {
            return read(type, item.redirect, options)
              .then(function (newItem) {
                results[index] = newItem
                return newItem
              })
          } else {
            return item
          }
        })
          .then(function () {
            return removeDuplicates(results)
          })
      } else {
        return results
      }
    })
}

function insert(type, id, data, options) {
  if (!data) {
    return Promise.reject('No data provided')
  }

  options = options || {}
  options.override = options.override || false
  var database = options.override ? db.overrides : db.library

  var doc = {
    type: type,
    id: id,
    data: data
  }

  return database.insert(doc)
}

function update(type, id, data, options) {
  if (!data) {
    return Promise.reject('No data provided')
  }

  options = options || {}
  options.override = options.override || false
  var database = options.override ? db.overrides : db.library

  var doc = {
    type: type,
    id: id,
    data: data
  }

  var query = {
    type: type,
    id: id
  }

  return database.update(query, doc)
}

function remove(type, id, options) {
  options = options || {}
  options.override = options.override || false
  var database = options.override ? db.overrides : db.library

  var query = {
    type: type,
    id: id
  }

  return database.remove(query)
}

function loadObjects(type, properties, options) {
  options = options || {}
  options.override = options.override || false
  options.followRedirects = options.followRedirects || false

  var objects = []
  var data = {}

  return find(type, properties, { followRedirects: options.followRedirects })
    .then(function (libResults) {
      libResults.forEach(function (result) {
        if (result) {
          var itemData = data.hasOwnProperty(result.id) ? data[result.id] : {}
          itemData = Object.assign(itemData, result)
          data[result.id] = itemData
        }
      })

      if (options.override) {
        return find(type, properties, { override: true, followRedirects: options.followRedirects })
          .then(function (overrideResults) {
            overrideResults.forEach(function (result) {
              if (result) {
                var itemData = data.hasOwnProperty(result.id) ? data[result.id] : {}
                itemData = Object.assign(itemData, result)
                data[result.id] = itemData
              }
            })

            return data
          })
      } else {
        return data
      }
    })
    .then(function (data) {
      Object.keys(data).forEach(function (key) {
        var objData = data[key]
        var typePlugin = require('./types/' +  type)
        objects.push(typePlugin.create(objData))
      })

      return objects
    })
}

function loadObject(type, id, options) {
  options = options || {}
  options.override = options.override || false
  options.followRedirects = options.followRedirects || false
  var data = {}

  return read(type, id, { followRedirects: options.followRedirects })
    .then(function (libResult) {
      if (libResult) {
        data = Object.assign(data, libResult)
      }

      if (options.override) {
        return read(type, id, { override: options.override, followRedirects: options.followRedirects })
          .then(function (overrideResult) {
            if (overrideResult) {
              data = Object.assign(data, overrideResult)
            }

            return data
          })
      } else {
        return data
      }
    })
    .then(function (data) {
      var typePlugin = require('./types/' +  type)

      return typePlugin.create(data)
    })
}

module.exports = {
  db: db,
  find: find,
  read: read,
  insert: insert,
  update: update,
  remove: remove,
  loadObjects: loadObjects,
  loadObject: loadObject,
  getRedirectId: getRedirectId
}
