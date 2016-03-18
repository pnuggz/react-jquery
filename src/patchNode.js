import { $$isElement, $$node, $$props, $$isStatic } from './symbols';
import patchChildren from './patchChildren';

function createStaticNode(elementAsString) {
  const template = document.createElement('template');
  template.innerHTML = elementAsString;
  return template.content.firstElementChild;
}

export default
function patchNode(prevNode, nextElement, parentNode) {
  if (nextElement === undefined || nextElement === null) {
    return;
  }

  // Elements marked as static cannot change or be moved during a diff
  // so are only created once then left where they are untouched including
  // all of their children.
  if (nextElement[$$isStatic]) {
    // Only happens on the first render
    if (!prevNode) {
      const node = nextElement[$$node] || (
        nextElement[$$node] = createStaticNode(nextElement[$$props].children[0])
      );
      parentNode.appendChild(node);
    }

    return;
  }

  if (nextElement[$$isElement]) {
    const nextProps = nextElement[$$props] || {};
    const { children } = nextProps;

    if (prevNode) {
      if (prevNode.tagName === nextProps.tagName) {
        nextElement[$$node] = prevNode;

        patchChildren(prevNode, prevNode, children);

        for (const key in nextProps) {
          if (key !== 'tagName' && key !== 'children') {
            if (prevNode[key] !== nextProps[key]) {
              prevNode[key] = nextProps[key];
            }
          }
        }

        const nextNode = nextElement[$$node];

        // This doesn't do any diffing so is almost certainly wrong
        // and lead to continous appending instead.
        if (nextNode && nextNode !== prevNode) {
          const { childNodes } = nextNode;
          for (let i = 0, l = childNodes.length; i < l; i++) {
            const childNode = childNodes[i];
            prevNode.appendChild(childNode);
          }
        }
      } else {
        parentNode.removeChild(prevNode);
        return patchNode(null, nextElement, parentNode);
      }
    } else {
      const nextNode = nextElement[$$node] || (
        nextElement[$$node] = document.createElement(nextProps.tagName)
      );

      patchChildren(prevNode, nextNode, children);

      for (const key in nextProps) {
        if (key !== 'tagName' && key !== 'children') {
          nextNode[key] = nextProps[key];
        }
      }

      parentNode.appendChild(nextNode);
    }
  } else {
    if (prevNode && prevNode.nodeValue === nextElement) {
      return;
    }

    if (nextElement.nodeType > 0) {
      console.log(nextElement);
      parentNode.appendChild(nextElement);
    } else if (prevNode) {
      prevNode.nodeValue = nextElement;
    } else {
      parentNode.appendChild(
        document.createTextNode(nextElement)
      );
    }
  }
}
