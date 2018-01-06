var sources = {
  audioFile: require('./audio-file'),
  kontakt: require('./kontakt'),
  preset: require('./preset'),
  reaktor: require('./reaktor'),
  vst2: require('./vst2'),
  vst3: require('./vst3'),
  hardware: require('./hardware')
}

function load(sourceId) {
  if (!sourceId) {
    return {}
  }

  return sources[sourceId]()
}

module.exports = {
  list: function () {
    return Object.keys(sources)
  },
  load: load,
  create: function (sourceId, sourceData) {
    if (!sourceId) {
      return {}
    }

    var source = load(sourceId)
    return source.create(sourceData)
  }
}
