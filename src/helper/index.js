const sharp = require("sharp")
const {encode} = require("blurhash")
exports.convertObjectFieldString = (obj = {}) => {
  const entries = Object.entries(obj)
  return entries.reduce((t, v) => {
    t[v[0]] = `${v[1]}`
    return t
  }, {})
}
exports.encodeImageToBlurhash = path =>
  new Promise((resolve, reject) => {
    sharp(path)
      .resize(300,300)
      .raw()
      .ensureAlpha()
      .toBuffer((err, buffer, { width, height }) => {
        if (err) return reject(err);
        resolve(encode(new Uint8ClampedArray(buffer), width, height, 6, 4));
      });
  });