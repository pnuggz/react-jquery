import { $$NODE, $$PROPS, $$METHODS } from './symbols';
import patchNode from './patchNode';

{
  const nodeProto = Node.prototype;

  ['appendChild', 'removeChild'].forEach(key => {
    const nativeMethod = nodeProto[key];

    nodeProto[key] = function (...elements) {
      const nodes = elements.map(element => {
        if (element[$$PROPS]) {
          if (!element[$$NODE]) {
            patchNode(null, element, document.createElement('x-temp-container'));
          }

          return element[$$NODE];
        }

        return element;
      });

      return nativeMethod.apply(this, nodes);
    };
  });
}

function throwDOMException(methodName, message) {
  throw new DOMException(`Failed to execute '${methodName}' on 'Node': ${message}`);
}

const elementMethodHandlers = {
  appendChild(childNode) {
    this[$$PROPS].children.push(childNode);
    return childNode;
  },

  removeChild(childNode) {
    const { children } = this[$$PROPS];
    const childIndex = children.indexOf(childNode);

    if (childIndex === -1) {
      throwDOMException('removeChild', 'The node to be removed is not a child of this node.');
    }

    children.splice(childIndex, 1);

    return childNode;
  }
};

const elementProxyHandler = {
  get(target, key) {
    // Used to return the actual underlying DOM node,
    // which is stored on a secret Symbol
    if (key === $$NODE) {
      return target[$$NODE];
    }

    // $$PROPS stores the props of the element that were provided or
    // mutated at some point
    const props = target[$$PROPS];
    // $$METHODS stores Element method hooks
    const methods = target[$$METHODS];

    if (key === $$PROPS) {
      return props;
    }

    if (key in props) {
      return props[key];
    } else if (key in methods) {
      return methods[key];
    } else {
      const node = target[$$NODE] || (
        target[$$NODE] = document.createElement(props.tagName)
      );

      let value = node[key];

      // Currently not the right behavior
      /*
      if (typeof value === 'function') {
        value = value.bind(node);
      }
      */

      return value;
    }
  },

  set(target, key, value) {
    if (key === $$NODE) {
      target[$$NODE] = value;
    } else {
      const node = target[$$NODE];
      if (node) {
        node[key] = value;
      } else {
        target[$$PROPS][key] = value;
      }
    }

    return true;
  }
};

export default
function createElement(type, props, ...children) {
  props = props || {};

  switch (typeof type) {
    case 'string':
      return new Proxy({
        [$$METHODS]: elementMethodHandlers,
        [$$PROPS]: {
          ...props,
          tagName: type.toUpperCase(),
          children
        }
      }, elementProxyHandler);

    case 'function':
      props.children = children;
      return type(props);

    default:
      throw new Error(`createElement called with unknown type: ${type}`);
  }
}
