var sources = {
  'audioFile': './audio-file',
  'kontakt': './kontakt',
  'preset': './preset',
  'reaktor': './reaktor',
  'vst2': './vst2',
  'vst3': './vst3',
  'hardware': './hardware'
}

function load(sourceId) {
  if (!sourceId) {
    return {}
  }

  return require(sources[sourceId])
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
