import { $$NODE, $$PROPS } from './symbols';

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

export default
function createElement(type, props, ...children) {
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
