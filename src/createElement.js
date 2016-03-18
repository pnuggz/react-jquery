import { $$isElement, $$node, $$props, $$methods, $$isStatic } from './symbols';
import patchNode from './patchNode';

{
  const nodeProto = Node.prototype;
  const nativeAppendChild = nodeProto.appendChild;
  const nativeRemoveChild = nodeProto.removeChild;

  function elementToNode(element) {
    let node = element[$$node];

    if (!node) {
      const template = document.createElement('template');
      patchNode(null, element, template);
      node = template.firstChild;
    }

    return node;
  }

  nodeProto.appendChild = function appendChild(childNode)  {
    if (childNode[$$isElement]) {
      childNode = elementToNode(childNode);
    }

    return nativeAppendChild.call(this, childNode);
  };

  nodeProto.removeChild = function removeChild(childNode)  {
    if (childNode[$$isElement]) {
      childNode = elementToNode(childNode);
    }

    return nativeRemoveChild.call(this, childNode);
  };

  /*
  [].forEach(key => {
    const nativeMethod = nodeProto[key];

    nodeProto[key] = function () {
      const nodes = elements.map(element => {
        if (element[$$props]) {
          if (!element[$$node]) {
            patchNode(null, element, document.createElement('x-temp-container'));
          }

          return element[$$node];
        }

        return element;
      });

      return nativeMethod.apply(this, nodes);
    };
  });
  */
}

function throwDOMException(methodName, message) {
  throw new DOMException(`Failed to execute '${methodName}' on 'Node': ${message}`);
}

const elementMethodHandlers = {
  appendChild(childNode) {
    const node = this[$$node];
    if (node) {
      node.appendChild(childNode);
    } else {
      this[$$props].children.push(childNode);
    }

    return childNode;
  },

  removeChild(childNode) {
    const node = this[$$node];
    if (node) {
      node.removeChild(childNode);
    } else {
      const { children } = this[$$props];
      const childIndex = children.indexOf(childNode);

      if (childIndex === -1) {
        throwDOMException('removeChild', 'The node to be removed is not a child of this node.');
      }

      children.splice(childIndex, 1);
    }

    return childNode;
  }
};

const elementProxyHandler = {
  get(target, key) {
    switch (key) {
      case $$isElement:
      case $$node:
      case $$props:
      case $$isStatic:
        return target[key];
    }

    // $$props stores the props of the element that were provided or
    // mutated at some point
    const props = target[$$props];
    // $$methods stores Element method hooks
    const methods = target[$$methods];


    if (key in props) {
      return props[key];
    } else if (key in methods) {
      return methods[key];
    } else {
      const node = target[$$node] || (
        target[$$node] = document.createElement(props.tagName)
      );

      return node[key];
    }
  },

  set(target, key, value) {
    if (key === $$node) {
      target[$$node] = value;
    } else {
      const node = target[$$node];
      if (node) {
        node[key] = value;
      } else {
        target[$$props][key] = value;
      }
    }

    return true;
  }
};

const emptyProps = Object.freeze({});

// Used later to convert `arguments` to an array
const { slice } = Array.prototype;

export default
function createElement(type, props, ...children) {
  props = props || emptyProps;

  switch (typeof type) {
    case 'symbol':
      return new Proxy({
        [$$isElement]: true,
        [$$isStatic]: true,
        [$$methods]: elementMethodHandlers,
        [$$props]: { children }
      }, elementProxyHandler);

    case 'string':
      // Theoretically we could create a mock HTMLElement with
      // every property in the spec as a getter/setter
      // which would have better browser support. Maybe later?
      return new Proxy({
        [$$isElement]: true,
        [$$methods]: elementMethodHandlers,
        [$$props]: {
          ...props,
          tagName: type.toUpperCase(),
          children
        }
      }, elementProxyHandler);

    case 'function':
      if (children) {
        // Lazy allocation of a mutable props
        // for memory conservation
        if (props === emptyProps) {
          props = {};
        }

        props.children = children;
      }

      return type(props);

    default:
      throw new Error(`createElement called with unknown type: ${type}`);
  }
}
