import LazyCharacterData from './LazyCharacterData';
import { proxyAllDescriptors } from './LazyNode';
import { $$internalInvocation, $$node, $$cachedNode, $$lazyNodeValue } from './symbols';

export default
class LazyText extends LazyCharacterData {
  constructor(nodeValue) {
    super($$internalInvocation);

    this[$$lazyNodeValue] = nodeValue;
  }

  get nodeValue() {
    const node = this[$$cachedNode];

    if (node) {
      return node.nodeValue;
    } else {
      return this[$$lazyNodeValue];
    }
  }

  set nodeValue(value) {
    const node = this[$$cachedNode];

    if (node) {
      node.nodeValue = value;
    } else {
      this[$$lazyNodeValue] = value;
    }

    return value;
  }

  get [$$node]() {
    let node = this[$$cachedNode];

    if (!node) {
      node = this[$$cachedNode] = document.createTextNode(this[$$lazyNodeValue]);
      Object.assign(node, this.props);
    }

    return node;
  }
}

proxyAllDescriptors(window.Text, LazyText);
