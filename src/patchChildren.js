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

// This method became pretty ugly when trying to optimize away excess array
// allocations (to the extreme) but still flatten [child, [child, [child]]] etc
// on the fly. I'd love to revisit this, but be careful to measure memory usage
// in extreme examples like DBMonster since this is a hot code path. We still
// have plenty of JS CPU headroom so any ways we can remove memory alloc the
// better because garbage collection is still not ideal in the extreme
// benchmarks like DBMonster
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
