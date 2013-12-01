define(function(require, exports, module){
/**!phpjs;module:var
 */
exports.settype = function settype (vr, type) {
  // http://kevin.vanzonneveld.net
  // +   original by: Waldo Malqui Silva
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +    revised by: Brett Zamir (http://brett-zamir.me)
  // %        note 1: Credits to Crockford also
  // %        note 2: only works on global variables, and "vr" must be passed in as a string
  // *     example 1: foo = '5bar';
  // *     example 1: settype('foo', 'integer');
  // *     results 1: foo === 5
  // *     returns 1: true
  // *     example 2: foo = true;
  // *     example 2: settype('foo', 'string');
  // *     results 2: foo === '1'
  // *     returns 2: true
  var is_array = function (arr) {
    return typeof arr === 'object' && typeof arr.length === 'number' && !(arr.propertyIsEnumerable('length')) && typeof arr.splice === 'function';
  };
  var v, mtch, i, obj;
  v = module[vr] ? module[vr] : vr;

  try {
    switch (type) {
    case 'boolean':
      if (is_array(v) && v.length === 0) {
        module[vr] = false;
      } else if (v === '0') {
        module[vr] = false;
      } else if (typeof v === 'object' && !is_array(v)) {
        var lgth = false;
        for (i in v) {
          lgth = true;
        }
        module[vr] = lgth;
      } else {
        module[vr] = !! v;
      }
      break;
    case 'integer':
      if (typeof v === 'number') {
        module[vr] = parseInt(v, 10);
      } else if (typeof v === 'string') {
        mtch = v.match(/^([+\-]?)(\d+)/);
        if (!mtch) {
          module[vr] = 0;
        } else {
          module[vr] = parseInt(v, 10);
        }
      } else if (v === true) {
        module[vr] = 1;
      } else if (v === false || v === null) {
        module[vr] = 0;
      } else if (is_array(v) && v.length === 0) {
        module[vr] = 0;
      } else if (typeof v === 'object') {
        module[vr] = 1;
      }

      break;
    case 'float':
      if (typeof v === 'string') {
        mtch = v.match(/^([+\-]?)(\d+(\.\d+)?|\.\d+)([eE][+\-]?\d+)?/);
        if (!mtch) {
          module[vr] = 0;
        } else {
          module[vr] = parseFloat(v, 10);
        }
      } else if (v === true) {
        module[vr] = 1;
      } else if (v === false || v === null) {
        module[vr] = 0;
      } else if (is_array(v) && v.length === 0) {
        module[vr] = 0;
      } else if (typeof v === 'object') {
        module[vr] = 1;
      }
      break;
    case 'string':
      if (v === null || v === false) {
        module[vr] = '';
      } else if (is_array(v)) {
        module[vr] = 'Array';
      } else if (typeof v === 'object') {
        module[vr] = 'Object';
      } else if (v === true) {
        module[vr] = '1';
      } else {
        module[vr] += '';
      } // numbers (and functions?)
      break;
    case 'array':
      if (v === null) {
        module[vr] = [];
      } else if (typeof v !== 'object') {
        module[vr] = [v];
      }
      break;
    case 'object':
      if (v === null) {
        module[vr] = {};
      } else if (is_array(v)) {
        for (i = 0, obj = {}; i < v.length; i++) {
          obj[i] = v;
        }
        module[vr] = obj;
      } else if (typeof v !== 'object') {
        module[vr] = {
          scalar: v
        };
      }
      break;
    case 'null':
      delete module[vr];
      break;
    }
    return true;
  } catch (e) {
    return false;
  }
};// Fork from https://github.com/kvz/phpjs
});