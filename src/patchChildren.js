import patchNode from './patchNode';

export default
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
