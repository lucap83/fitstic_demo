
exports.currentLang = 'it'

function searchKey (key, langData) {
  const keys = key.split('.')
  let root = langData

  keys.forEach((k) => {
    if (root[k] !== undefined) root = root[k]
    else root = key
  })

  return root
}

exports.get = function (keys) {
  const langData = require('./langs/' + exports.currentLang + '.json')

  if (typeof keys === 'string') {
    return searchKey(keys, langData)
  } else {
    const values = {}
    keys.forEach((k) => {
      values[k] = searchKey(k, langData)
    })

    return values
  }
}
