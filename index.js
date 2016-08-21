const pse = require('postcss-scopeify-everything');

const scopeify = pse.api;
const getCss = pse.getCss;
const keyId = pse.key;

module.exports = psjs({ elements: false, ids: false });
module.exports.psjs = psjs;
module.exports.getCss = getCss;

function psjs(opts) {
  return function (strings) {
    const values = Array(arguments.length - 1);
    for (let i = 1; i < arguments.length; i++) {
      values[i - 1] = arguments[i];
    }
    const precss = joinStrings(strings, values);

    const result = scopeify(opts)(precss).sync();
    const css = getCss(result);

    const prop = {};
    if (opts.classes) extractProps(prop, result.classes, 'class');
    if (opts.keyframes) extractProps(prop, result.keyframes, 'keyframe');
    if (opts.ids) extractProps(prop, result.ids, 'id');
    if (opts.elements) extractProps(prop, result.elements, 'element');
    return Object.defineProperty(prop, keyId, { value: css });
  };
}

function extractProps(combinedObj, useObj, type) {
  Object.keys(useObj).forEach(function (key) {
    const scopedName = useObj[key];
    combinedObj[key] = {
      type: type,
      scopedName: scopedName,
      selector: scopedName,
    };

    if (type === 'class' || type === 'element') {
      combinedObj[key].selector = '.' + scopedName;
    } else if (type === 'id') {
      combinedObj[key].selector = '#' + scopedName;
    }

    Object.defineProperty(combinedObj[key], 'toString', {
      value: function () { return scopedName; },
      enumerable: false,
    });
  });

  return combinedObj;
}

function joinStrings(strings, values) {
  return strings.map(function (str, i) {
    return (i !== values.length) ? str + values[i] : str;
  }).join('');
}
