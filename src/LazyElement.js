import LazyNode, { proxyAllDescriptors } from './LazyNode';
import { $$node, $$cachedNode, $$parentLazyNode, $$children, $$props, $$tagName } from './symbols';

export default
class LazyElement extends LazyNode {
  constructor(tagName, internalInvocation) {
    super(internalInvocation);

    this[$$tagName] = tagName.toUpperCase();
  }

  get [$$node]() {
    let node = this[$$cachedNode];

    if (!node) {
      node = document.createElement(this[$$tagName]);
      this[$$cachedNode] = node;

      Object.assign(node, this[$$props]);

      this[$$children].forEach(child => {
        node.appendChild(child);
      });
    }

    return node;
  }

  appendChild(nodeOrLazyNode) {
    if (nodeOrLazyNode instanceof LazyNode == false && nodeOrLazyNode instanceof Node == false) {
      throw new TypeError(`Failed to execute 'appendChild' on 'LazyNode': parameter 1 is not of type 'Node' or 'LazyNode'`);
    }

    this[$$children].push(nodeOrLazyNode);

    const node = this[$$cachedNode];
    if (node) {
      node.appendChild(nodeOrLazyNode);
    } else {
      if (nodeOrLazyNode instanceof LazyNode) {
        nodeOrLazyNode[$$parentLazyNode] = this;
      }
    }

    return nodeOrLazyNode;
  }
}

proxyAllDescriptors(window.Element, LazyElement);
