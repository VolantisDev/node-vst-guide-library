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

function read(type, id, override) {
  override = override || false
  var database = override ? db.overrides : db.library

  var query = {
    type: type,
    id: id
  }

  return database.findOne(query)
}

function find(type, properties, override) {
  properties = properties || {}
  override = override || false
  var database = override ? db.overrides : db.library

  var search = {
    type: type
  }
  Object.keys(properties).forEach(function (key) {
    search['data.' + key] = properties[key]
  })

  return database.find(search)
}

function insert(type, id, data, override) {
  override = override || false
  var database = override ? db.overrides : db.library

  var doc = {
    type: type,
    id: id,
    data: data
  }

  return database.insert(doc)
}

function update(type, id, data, override) {
  override = override || false
  var database = override ? db.overrides : db.library

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

function remove(type, id, override) {
  override = override || false
  var database = override ? db.overrides : db.library

  var query = {
    type: type,
    id: id
  }

  return database.remove(query)
}

function loadObjects(type, properties, override) {
  var objects = []
  var data = {}

  return find(type, properties, false)
    .then(function (libResults) {
      libResults.forEach(function (result) {
        if (result.data) {
          var itemData = data.hasOwnProperty(result.id) ? data[result.id] : {}
          itemData = Object.assign(itemData, result.data)
          data[result.id] = itemData
        }
      })

      if (override) {
        return find(type, properties, true)
          .then(function (overrideResults) {
            overrideResults.forEach(function (result) {
              if (result.data) {
                var itemData = data.hasOwnProperty(result.id) ? data[result.id] : {}
                itemData = Object.assign(itemData, result.data)
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

function loadObject(type, id, override) {
  var data = {}

  return read(type, id, false)
    .then(function (libResult) {
      if (libResult.data) {
        data = Object.assign(data, libResult.data)
      }

      if (override) {
        return read(type, id, true)
          .then(function (overrideResult) {
            if (overrideResult.data) {
              data = Object.assign(data, overrideResult.data)
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
  loadObject: loadObject
}
