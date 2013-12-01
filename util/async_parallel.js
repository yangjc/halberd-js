define(function(require, exports, module){
/**!module:;-client-side
 * Author : YJC
 * Date : 2013-11-25
 */

exports.async_parallel = function(arr, fn, callback){
  var i, len, err, waiting, over;

  if ( ! arr || ! (waiting = len = arr.length)) {
    callback();
    return;
  }

  function end(e){
    waiting --;
    e && (err || (err = [])).push(e);
    waiting === 0 && i === len && (over = 1) && callback(err)
  }

  for (i = 0; i < len; i++) {
    fn(arr[i], end, i)
  }

  waiting === 0 && !over && callback(err)
};
});