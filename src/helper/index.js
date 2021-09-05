exports.convertObjectFieldString = (obj = {}) => {
  const entries = Object.entries(obj)
  return entries.reduce((t, v) => {
    t[v[0]] = `${v[1]}`
    return t
  }, {})
}