const $$NODE = Symbol('$$NODE');
const $$PROPS = Symbol('$$PROPS');

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

    if (key === $$PROPS) {
      return props;
    }

    if (key in props) {
      return props[key];
    } else {
      const node = target[$$NODE] || (
        target[$$NODE] = document.createElement(props.tagName)
      );

      return node[key];
    }
  },

  set(target, key, value) {
    if (key === $$NODE) {
      target[$$NODE] = value;
    } else {
      target[$$PROPS][key] = value;
    }

    return true;
  }
};

export function createElement(type, props, ...children) {
  props = props || {};

  switch (typeof type) {
    case 'string':
      return new Proxy({
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

function patchChildren(prevNode, nextNode, children, leftOversOverride) {
  const leftOvers = leftOversOverride || (prevNode ? [...prevNode.childNodes] : []);

  for (let i = 0, l = children.length; i < l; i++) {
    const childElement = children[i];
    const prevChildNode = prevNode ? prevNode.childNodes[i] : null;

    if (Array.isArray(childElement)) {
      patchChildren(prevNode, nextNode, childElement, leftOvers);
    } else {
      const prevChildNodeIndex = leftOvers.indexOf(prevChildNode);

      if (prevChildNodeIndex !== -1) {
        leftOvers.splice(prevChildNodeIndex, 1);
      }

      patchNode(prevChildNode, childElement, nextNode);
    }
  }

  while (leftOvers.length > 0) {
    const childNode = leftOvers.pop();
    nextNode.removeChild(childNode);
  }
}

function patchNode(prevNode, nextElement, parentNode) {
  if (nextElement === undefined || nextElement === null) {
    return;
  }

  const nextProps = nextElement[$$PROPS];

  if (nextProps) {
    const { children } = nextProps;

    if (!prevNode) {
      const nextNode = nextElement[$$NODE] || (
        nextElement[$$NODE] = document.createElement(nextProps.tagName)
      );

      patchChildren(prevNode, nextNode, children);

      for (const key in nextProps) {
        if (key !== 'tagName' && key !== 'children') {
          nextNode[key] = nextProps[key];
        }
      }

      parentNode.appendChild(nextNode);
    } else {
      if (prevNode.tagName === nextProps.tagName) {
        nextElement[$$NODE] = prevNode;

        patchChildren(prevNode, prevNode, children);

        for (const key in nextProps) {
          if (key !== 'tagName' && key !== 'children') {
            if (prevNode[key] !== nextProps[key]) {
              prevNode[key] = nextProps[key];
            }
          }
        }
      } else {
        parentNode.removeChild(prevNode);
        return patchNode(null, nextElement, parentNode);
      }
    }
  } else {
    if (prevNode && prevNode.nodeValue === nextElement) {
      return;
    }

    const textNode = document.createTextNode(nextElement);

    if (prevNode) {
      parentNode.replaceChild(textNode, prevNode);
    } else {
      parentNode.appendChild(textNode);
    }
  }
}

export function render(nextElement, mountNode) {
  patchNode(mountNode.firstChild, nextElement, mountNode);
}
