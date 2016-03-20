import LazyHTMLElement from './LazyHTMLElement';
import { shimGettersSetters } from './LazyNode';

export default
function LazyUnknownElement(tagName) {
  // TODO: use Proxy's to implement wrapper around custom elements
  throw new TypeError(`Unknown tagName ${tagName}. Lazy custom elements are not yet supported.`);
}
