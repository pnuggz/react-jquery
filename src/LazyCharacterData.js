import LazyNode, { proxyAllDescriptors } from './LazyNode';

export default
class LazyCharacterData extends LazyNode {
  // Nothing to overload
}

proxyAllDescriptors(LazyCharacterData, window.CharacterData);
