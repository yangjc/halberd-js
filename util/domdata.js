define(function(require, exports, module){
/**!module:dom;client-side
 * Author : YJC
 * Date : 2013-04-21
 */
/**
 * 获取某个DOM节点的data属性
 * @param node DOM节点
 * @param name 索引名，不传入时返回全部data属性的对象
 * @return {Object|String}
 */
exports.domdata = function(node, name) {
  if (typeof name === 'string') {
    if (typeof node.dataset === 'object') return node.dataset[name];
    return node.getAttribute('data-' + name);
  }
  if (typeof node.dataset === 'object') return node.dataset;
  var i, n, data = {};
  for (i in node.attributes) {
    i = i.toString().toLowerCase();
    if (i.indexOf('data-') === 0) {
      data[i.substr(5)] = node.getAttribute(i);
      continue;
    }
    if (isNaN(i)) continue;
    n = node.attributes[i];
    if ( ! n || typeof n !== 'object' || ! n.nodeName) continue;
    n = n.nodeName.toLowerCase();
    if (n.indexOf('data-') === 0) {
      data[n.substr(5)] = node.attributes[i].nodeValue;
    }
  }
  return data;
};
});