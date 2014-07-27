module.exports = function (nemit, oemit) {
  return function (type, args) {
    nemit.apply(this, arguments)
    if (typeof oemit === 'function') oemit.apply(this, arguments)
    return this
  }
}

