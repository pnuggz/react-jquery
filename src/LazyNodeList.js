/**
 * https://dom.spec.whatwg.org/#interface-nodelist
 *
 * interface NodeList {
 *   getter Node? item(unsigned long index);
 *   readonly attribute unsigned long length;
 *   iterable<Node>;
 * };
 */
export default
class LazyNodeList {
  item(index: number): ?Node {

  }

  // Btw this is enumerable per spec, but Chrome actually doesn't return this
  // property from NodeList's when using Object.keys() but does with `for..in`
  // Not sure if that's a Chrome bug or something I'm missing from the spec.
  get length(): number {

  }
}
