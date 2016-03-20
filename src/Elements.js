/**
 * Even though Elements is in the HTML spec, I'm not aware of any browser that
 * actually supports it yet, but hopefully any LazyDOM spec would use this
 * instead of NodeList|HTMLCollection but that seems less likely since that
 * would mean the various Node APIs are not a superset of the non-lazy variants
 * which might make interop harder. In practice, I have never seen anyone use
 * the methods on NodeList|HTMLCollection though. They always just treat it
 * array-like or flat out convert it into one.
 * 
 * https://dom.spec.whatwg.org/#element-collections
 *
 * class Elements extends Array {
 *   Element? query(DOMString relativeSelectors);
 *   Elements queryAll(DOMString relativeSelectors);
 * };
 */
export default
class Elements extends Array {
  query(relativeSelectors: string): ?Element {
    throw new Error('Elements::query is not currently implemented');
  }

  queryAll(relativeSelectors: string): Elements {
    throw new Error('Elements::queryAll is not currently implemented');
  }
}
