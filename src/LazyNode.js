import { $$internalInvocation, $$node, $$cachedNode, $$parentLazyNode, $$children, $$props, $$tagName, $$lazyNodeValue } from './symbols';

export default
class LazyNode {
  static LazyLAZY_ELEMENT_NODE = 12;
  static LAZY_TEXT_NODE = 13;

  constructor(internalInvocation) {
    if (internalInvocation !== $$internalInvocation) {
      throw new TypeError('Illegal constructor');
    }

    this[$$cachedNode] = null;
    this[$$parentLazyNode] = null;
    this[$$props] = {};
    this[$$children] = [];
  }

  get children() {
    const node = this[$$cachedNode];

    if (node) {
      return node.children;
    } else {
      return this[$$children];
    }
  }

  get firstChild() {
    return this[$$children][0];
  }

  get parentNode() {
    const node = this[$$cachedNode];

    if (node) {
      return node.parentNode;
    } else {
      return this[$$parentLazyNode];
    }
  }

  set parentNode(value) {
    // Setting parentNode doesn't do anything but doesn't
    // error either, just like real nodes.
    return value;
  }

  mergeWith(nodeOrLazyNode: Node|LazyNode) {
    mergeWith(this, nodeOrLazyNode);
    return nodeOrLazyNode;
  }
}

function mergePrevElementWithLazyElement(prev: Element, nextLazy: LazyElement): void {
  
}

function mergePrevTextWithLazyText(prev, nextLazy) {
  // look up nodeValue directly because LazyText has a getter that will take
  // care of normalizing whether a nor exists or not.
  prev.nodeValue = nextLazy.nodeValue;
}

function mergePrevLazyNodeWithLazyNode(prev: LazyNode, next: LazyNode): void {
  const node = prev[$$cachedNode] = next[$$node];
}

function mergeWith(prevLazy: LazyNode, next: Node|LazyNode): void {
  if (next instanceof LazyNode) {
    const nextLazy = next;
    const prevNode = prevLazy[$$cachedNode];

    if (prevNode) {
      switch (prevNode.nodeType) {
        // Node.ELEMENT_NODE
        case 1:
          if (prevNode.tagName === nextLazy[$$tagName]) {
            Object.assign(prevNode, nextLazy[$$props]);
            const prevChildren = prevLazy[$$children];
            const nextChildren = nextLazy[$$children];

            for (let i = 0, l = nextChildren.length; i < l; i++) {
              const prevLazyChild = prevChildren[i];
              const nextLazyChild = nextChildren[i];

              if (prevLazyChild) {
                mergeWith(prevLazyChild, nextLazyChild);
              } else {
                prevNode.appendChild(nextLazyChild);
              }
            }

          } else {
            debugger;
            throw new Error('not implemented yet');
          }
          break;

        // Node.TEXT_NODE
        case 3:
          mergePrevTextWithLazyText(prevNode, nextLazy);
          break;

        default:
          throw new TypeError(`mergePrevNodeWithLazyNode: unknown previously nodeType: ${prevNode.nodeType}`);
      }

      nextLazy[$$cachedNode] = prevNode;
    } else {
      debugger;
      nextLazy[$$parentLazyNode] = prevLazy[$$parentLazyNode];
      mergePrevLazyNodeWithLazyNode(prevLazy, nextLazy);
    }
  } else {
    debugger;
    throw new TypeError('not implemented');
  }
}

const { defineProperties } = Object;
const blacklist = {
  constructor: true,
  children: true
};

export function proxyAllDescriptors(target, handler, keys) {
  const targetProto = target.prototype;
  const handlerProto = handler.prototype;

  const targetDescs = Object.getOwnPropertyDescriptors(targetProto);
  const handlerDescs = {};

  for (const key in targetDescs) {
    if (!blacklist[key]) {
      const desc = targetDescs[key];

      if (desc.get || desc.set) {
        handlerDescs[key] = {
          configurable: true,
          enumerable: true,
          get () {
            const node = this[$$cachedNode];
            if (node) {
              return node[key];
            } else {
              const props = this[$$props];
              if (key in props) {
                return props[key];
              } else {
                // This will create an actual element to proxy the request to
                // and is intentionally a last-resort since it's expensive
                // and the node may end up getting thrown away after a merge
                return this[$$node][key];
              }
            }
          },

          set(value) {
            const node = this[$$cachedNode];
            if (node) {
              node[key] = value;
            } else {
              this[$$props][key] = value;
            }

            return value;
          }
        }
      }
    }
  }

  defineProperties(handlerProto, handlerDescs);
}
