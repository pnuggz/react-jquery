import LazyNode from './LazyNode';
import { $$cachedNode, $$parentLazyNode } from './symbols';

/**
 * https://dom.spec.whatwg.org/#interface-childnode
 * 
 * [NoInterfaceObject, Exposed=Window]
 * interface ChildNode {
 *   [Unscopeable] void before((Node or DOMString)... nodes);
 *   [Unscopeable] void after((Node or DOMString)... nodes);
 *   [Unscopeable] void replaceWith((Node or DOMString)... nodes);
 *   [Unscopeable] void remove();
 * };

 * DocumentType implements ChildNode;
 * Element implements ChildNode;
 * CharacterData implements ChildNode;
 */
const LazyChildNodeMixin = {
  before(...nodes: LazyNode|string) {
    var frag = buildDOM.apply(this, arguments);
    this.parentNode.insertBefore(frag, this);
  }

  after(...nodes: LazyNode|string) {
    var frag = buildDOM.apply(this, arguments);
    this.parentNode.insertBefore(frag, this.nextSibling);
  }

  replaceWith(...nodes: LazyNode|string) {
    const node = this[$$cachedNode];

    if (node) {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    } else {
      this[$$parentLazyNode].removeChild(this);
    }

    if (this.parentNode) {
      
    }
  }

  remove() {
    const node = this[$$cachedNode];

    if (node) {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    } else {
      this[$$parentLazyNode].removeChild(this);
    }
  }
};
