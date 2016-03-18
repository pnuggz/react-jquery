import patchNode from './patchNode';

function patchChild(prevChildNode, childElement, nextNode, leftOvers) {
  if (leftOvers) {
    const prevChildNodeIndex = leftOvers.indexOf(prevChildNode);

    if (prevChildNodeIndex !== -1) {
      leftOvers.splice(prevChildNodeIndex, 1);
    } else {
      //debugger;
    }
  }

  patchNode(prevChildNode, childElement, nextNode);
}

const { slice } = Array.prototype;

export default
function patchChildren(prevNode, nextNode, children, leftOversOverride, offset = 0) {
  const leftOvers = leftOversOverride || (prevNode ? slice.call(prevNode.childNodes) : null);

  if (Array.isArray(children)) {
    for (let i = 0, l = children.length; i < l; i++) {
      const childElement = children[i];
      const prevChildNode = prevNode ? prevNode.childNodes[offset + i] : null;
      if (Array.isArray(childElement)) {
        patchChildren(prevNode, nextNode, childElement, leftOvers, offset + i);
        offset += childElement.length;
      } else {
        patchChild(prevChildNode, childElement, nextNode, leftOvers);
      }
    }
  } else {
    const prevChildNode = prevNode ? prevNode.childNodes[offset] : null;
    patchChild(prevChildNode, children, nextNode, leftOvers);
  }

  if (leftOvers) {
    while (leftOvers.length > 0) {
      const childNode = leftOvers.pop();
      nextNode.removeChild(childNode);
    }
  }
}
