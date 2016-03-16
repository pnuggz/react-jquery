import patchNode from './patchNode';

export default
function render(nextElement, mountNode) {
  patchNode(mountNode.firstChild, nextElement, mountNode);
}
