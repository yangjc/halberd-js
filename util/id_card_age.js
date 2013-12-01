define(function(require, exports, module){
/**module:validate
 * Author : YJC
 * Date : 2013-09-02
 */
/**
 * 从居民身份证号码获取年龄
 * @param {String} _c 身份证号码
 * @returns {number} 年龄，精确到年；返回 0 时表示身份证号码不合法
 */
exports.id_card_age = function(_c) {
  var _d = new Date();
  if (_c.length != 15 && _c.length != 18) {
    return 0;
  }
  if (_c.length == 15) {
    _c = _c.substr(0, 6) + '19' + _c.substr(6, _c.length - 6);
  }
  var _a = (_d.getFullYear() - parseInt(_c.substr(6, 4)));
  if (_a == 0) {
    _a = 1;
  }
  if (_a < 0 || _a > 150) {
    return 0;
  }
  if (_c.length == 17) {
    return _a;
  }
  var _s = 0;
  var i = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  for (var k in i) {
    _s += i[k] * parseInt(_c.substr(k, 1));
  }
  var x = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  k++;
  return (x[_s % 11] == _c.substr(k, 1).toUpperCase()) ? _a : 0;
};
});