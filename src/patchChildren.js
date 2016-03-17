import patchNode from './patchNode';

export default
function patchChildren(prevNode, nextNode, children, leftOversOverride) {
  const leftOvers = leftOversOverride || (prevNode ? [...prevNode.childNodes] : []);

  let offset = 0;

  for (let i = 0, l = children.length; i < l; i++) {
    const childElement = children[i];
    const prevChildNode = prevNode ? prevNode.childNodes[offset + i] : null;

    if (Array.isArray(childElement)) {
      children = [...childElement, ...children.slice(i + 1, l)];
      offset += i;
      l = children.length;
      i = -1;
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
