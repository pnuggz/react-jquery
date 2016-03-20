import LazyNode from './LazyNode';

/**
 * https://dom.spec.whatwg.org/#interface-childnode
 * 
 * [NoInterfaceObject, Exposed=Window]
 * interface ChildNode {
 *   [Unscopeable] void before((Node or DOMString)... nodes);
 *   [Unscopeable] void after((Node or DOMString)... nodes);
 *   [Unscopeable] void replaceWith((Node or DOMString)... nodes);
 *   [Unscopeable] void remove();
 * };

 * DocumentType implements ChildNode;
 * Element implements ChildNode;
 * CharacterData implements ChildNode;
 */
interface LazyChildNode {
  before(...nodes: LazyNode|string): void;
  after(...nodes: LazyNode|string): void;
  replaceWith(...nodes: LazyNode|string): void;
  remove(): void;
};
