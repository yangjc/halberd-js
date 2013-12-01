define(function(require, exports, module){
/**!module:object
 * Author : YJC
 * Date : 2013-10-20
 */

exports.items_list = function(list_arr){
  var list = {}, i = 0, l = list_arr.length;

  for (; i < l; i++) {
    list[list_arr[i]] = 1;
  }

  return {
    list: list,
    list_arr: list_arr,
    has: function (one){
      return list.hasOwnProperty(one);
    }
  };
};
});