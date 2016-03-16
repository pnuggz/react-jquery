import { $$NODE, $$PROPS } from './symbols';
import patchChildren from './patchChildren';

export default
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
