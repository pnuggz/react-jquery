import LazyElement from './LazyElement';
import { proxyAllDescriptors } from './LazyNode';
import { $$cachedNode, $$props } from './symbols';

export default
class LazyHTMLElement extends LazyElement {
  // TODO: blur, click, focus, forceSpellCheck
}

proxyAllDescriptors(HTMLElement, LazyHTMLElement);
