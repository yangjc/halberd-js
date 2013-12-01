define(function(require, exports, module){
/**
 * Author : YJC
 * Date : 2013-10-16
 */
exports.debug = (function(){
  function Debug(){
    this._fns = [];
  }

  Debug.prototype = {
    test: function(fn, title, times){
      this._fns.push([fn, title || "", times || 1]);

      return this;
    },
    start: function(){
      var i, j, l, fn, t;
      for (i = 0, l = this._fns.length; i < l; i ++) {
        fn = this._fns[i];
        console.log("\n*"+i+"* " + fn[1] + "\n\n times " + fn[2]);
        fn.push((new Date).getTime());
        for (j = 0; j < fn[2]; j ++) {
          fn[0]();
        }
        fn.push((new Date).getTime());
        t = fn[4] - fn[3];
//        console.log(fn);
        console.log("\n time : " + (t / 1000).toFixed(3) + " s ;" +
          " avg : " + (t / fn[2]).toFixed(2) + ' ms each\n');
      }

      return this;
    }
  };

  return function(){
    return new Debug()
  }
})();
});