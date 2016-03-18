import { $$isStatic } from './symbols';
import createElement from './createElement';

export default
function createStaticElement(domAsString) {
  return createElement($$isStatic, null, domAsString);
}
